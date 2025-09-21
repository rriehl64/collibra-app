const express = require('express');
const router = express.Router();
const USCISApplication = require('../models/USCISApplication');
const PatternMatcher = require('../utils/patternMatcher');

// Mock data generators for development
const { generateApplications } = require('../../seed-uscis-applications');

// Initialize pattern matcher for trained responses
const patternMatcher = new PatternMatcher();

// Helper function to generate mock data if no real data exists
async function ensureMockData() {
  const count = await USCISApplication.countDocuments();
  if (count === 0) {
    console.log('No USCIS applications found, generating mock data...');
    const mockApplications = generateApplications(500);
    await USCISApplication.insertMany(mockApplications);
    console.log(`Generated ${mockApplications.length} mock USCIS applications`);
  }
}

// GET /api/v1/uscis-tracking/applications
router.get('/applications', async (req, res) => {
  try {
    await ensureMockData();
    
    const {
      type,
      status,
      center,
      limit = 100,
      offset = 0,
      start,
      end
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.applicationType = type;
    if (status) filter.currentStatus = status;
    if (center) filter.processingCenter = center;
    if (start && end) {
      filter.receivedDate = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const applications = await USCISApplication
      .find(filter)
      .sort({ receivedDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await USCISApplication.countDocuments(filter);

    res.json({
      applications,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/v1/uscis-tracking/applications/:receiptNumber
router.get('/applications/:receiptNumber', async (req, res) => {
  try {
    const application = await USCISApplication.findOne({
      receiptNumber: req.params.receiptNumber
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// PUT /api/v1/uscis-tracking/applications/:receiptNumber/status
router.put('/applications/:receiptNumber/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await USCISApplication.findOneAndUpdate(
      { receiptNumber: req.params.receiptNumber },
      {
        currentStatus: status,
        lastUpdatedDate: new Date(),
        $push: {
          statusHistory: {
            status,
            date: new Date(),
            notes,
            updatedBy: 'USCIS Officer' // In real app, would use req.user
          }
        }
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// GET /api/v1/uscis-tracking/metrics
router.get('/metrics', async (req, res) => {
  try {
    await ensureMockData();
    
    const { start, end } = req.query;
    const dateRange = {};
    if (start && end) {
      dateRange.start = start;
      dateRange.end = end;
    }

    // Get metrics using the model's static method
    const baseMetrics = await USCISApplication.getMetrics(dateRange);
    
    // Get additional breakdowns
    const typeBreakdown = await USCISApplication.aggregate([
      { $group: { _id: '$applicationType', count: { $sum: 1 } } }
    ]);
    
    const statusBreakdown = await USCISApplication.aggregate([
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
    ]);
    
    const centerBreakdown = await USCISApplication.aggregate([
      { $group: { _id: '$processingCenter', count: { $sum: 1 } } }
    ]);

    // Format breakdowns
    const applicationsByType = {};
    typeBreakdown.forEach(item => {
      applicationsByType[item._id] = item.count;
    });

    const applicationsByStatus = {};
    statusBreakdown.forEach(item => {
      applicationsByStatus[item._id] = item.count;
    });

    const applicationsByCenter = {};
    centerBreakdown.forEach(item => {
      applicationsByCenter[item._id] = item.count;
    });

    const metrics = {
      ...baseMetrics,
      applicationsByType,
      applicationsByStatus,
      applicationsByCenter
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /api/v1/uscis-tracking/trends
router.get('/trends', async (req, res) => {
  try {
    await ensureMockData();
    
    const { period = 'monthly' } = req.query;
    
    // Generate trends based on period
    let groupBy;
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$receivedDate' },
          month: { $month: '$receivedDate' },
          day: { $dayOfMonth: '$receivedDate' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$receivedDate' },
          week: { $week: '$receivedDate' }
        };
        break;
      case 'monthly':
      default:
        groupBy = {
          year: { $year: '$receivedDate' },
          month: { $month: '$receivedDate' }
        };
        break;
    }

    const trends = await USCISApplication.aggregate([
      {
        $group: {
          _id: groupBy,
          received: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$currentStatus', 'Case Was Approved'] }, 1, 0] }
          },
          denied: {
            $sum: { $cond: [{ $eq: ['$currentStatus', 'Case Was Denied'] }, 1, 0] }
          },
          pending: {
            $sum: { 
              $cond: [
                { 
                  $not: { 
                    $in: ['$currentStatus', ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn']] 
                  } 
                }, 
                1, 
                0
              ] 
            }
          },
          averageProcessingDays: { $avg: '$processingTimeBusinessDays' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } },
      { $limit: 24 } // Last 24 periods
    ]);

    // Format the response
    const formattedTrends = trends.map(trend => {
      let period;
      if (trend._id.day) {
        period = `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}-${String(trend._id.day).padStart(2, '0')}`;
      } else if (trend._id.week) {
        period = `${trend._id.year}-W${String(trend._id.week).padStart(2, '0')}`;
      } else {
        period = `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`;
      }

      return {
        period,
        received: trend.received,
        approved: trend.approved,
        denied: trend.denied,
        pending: trend.pending,
        averageProcessingDays: Math.round(trend.averageProcessingDays || 0),
        backlogSize: trend.pending // Simplified backlog calculation
      };
    });

    res.json(formattedTrends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// GET /api/v1/uscis-tracking/backlog-analysis
router.get('/backlog-analysis', async (req, res) => {
  try {
    await ensureMockData();
    
    const backlogAnalysis = await USCISApplication.getBacklogAnalysis();
    
    // Add backlog by type and center
    const backlogByType = await USCISApplication.aggregate([
      {
        $match: {
          currentStatus: {
            $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
          }
        }
      },
      { $group: { _id: '$applicationType', count: { $sum: 1 } } }
    ]);

    const backlogByCenter = await USCISApplication.aggregate([
      {
        $match: {
          currentStatus: {
            $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
          }
        }
      },
      { $group: { _id: '$processingCenter', count: { $sum: 1 } } }
    ]);

    // Format breakdowns
    const backlogByTypeFormatted = {};
    backlogByType.forEach(item => {
      backlogByTypeFormatted[item._id] = item.count;
    });

    const backlogByCenterFormatted = {};
    backlogByCenter.forEach(item => {
      backlogByCenterFormatted[item._id] = item.count;
    });

    const result = {
      ...backlogAnalysis,
      backlogByType: backlogByTypeFormatted,
      backlogByCenter: backlogByCenterFormatted
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching backlog analysis:', error);
    res.status(500).json({ error: 'Failed to fetch backlog analysis' });
  }
});

// GET /api/v1/uscis-tracking/ml-insights
router.get('/ml-insights', async (req, res) => {
  try {
    await ensureMockData();
    
    // Mock ML insights - in production, these would come from actual ML models
    const currentBacklog = await USCISApplication.countDocuments({
      currentStatus: {
        $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
      }
    });

    const mlInsights = {
      forecastedBacklog: {
        nextMonth: Math.round(currentBacklog * 1.05), // 5% increase
        nextQuarter: Math.round(currentBacklog * 1.15), // 15% increase
        nextYear: Math.round(currentBacklog * 1.25), // 25% increase
        confidence: 0.85
      },
      processingTimeEstimate: [
        {
          applicationType: 'N-400',
          estimatedDays: 365,
          confidence: 0.9,
          factors: ['Interview Required', 'Background Check', 'Document Review']
        },
        {
          applicationType: 'I-485',
          estimatedDays: 480,
          confidence: 0.85,
          factors: ['Medical Exam', 'Interview Required', 'Priority Date']
        },
        {
          applicationType: 'I-765',
          estimatedDays: 120,
          confidence: 0.92,
          factors: ['Employment Authorization', 'Biometrics']
        },
        {
          applicationType: 'I-90',
          estimatedDays: 90,
          confidence: 0.88,
          factors: ['Card Production', 'Address Verification']
        }
      ],
      anomalies: [
        {
          flagType: 'delay',
          description: 'Processing times for I-485 applications have increased by 20% this month',
          severity: 'medium',
          affectedCases: Math.round(currentBacklog * 0.15),
          recommendedAction: 'Increase staffing for adjustment of status cases'
        },
        {
          flagType: 'volume_spike',
          description: 'N-400 applications received 30% above normal volume',
          severity: 'high',
          affectedCases: Math.round(currentBacklog * 0.25),
          recommendedAction: 'Redistribute workload across processing centers'
        }
      ],
      riskFactors: [
        {
          factor: 'RFE Response Time',
          impact: 0.7,
          description: 'Delayed responses to RFEs are causing processing bottlenecks'
        },
        {
          factor: 'Interview Scheduling',
          impact: 0.6,
          description: 'Limited interview slots are creating delays for naturalization cases'
        },
        {
          factor: 'Background Check Processing',
          impact: 0.5,
          description: 'FBI background check delays affecting multiple case types'
        }
      ]
    };

    res.json(mlInsights);
  } catch (error) {
    console.error('Error fetching ML insights:', error);
    res.status(500).json({ error: 'Failed to fetch ML insights' });
  }
});

// POST /api/v1/uscis-tracking/forecast-backlog
router.post('/forecast-backlog', async (req, res) => {
  try {
    const { months = 3 } = req.body;
    
    const currentBacklog = await USCISApplication.countDocuments({
      currentStatus: {
        $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
      }
    });

    // Simple forecast model - in production, this would use actual ML
    const forecast = [];
    for (let i = 1; i <= months; i++) {
      const growth = 1 + (i * 0.02); // 2% growth per month
      forecast.push(Math.round(currentBacklog * growth));
    }

    res.json({
      forecast,
      confidence: 0.75
    });
  } catch (error) {
    console.error('Error forecasting backlog:', error);
    res.status(500).json({ error: 'Failed to forecast backlog' });
  }
});

// POST /api/v1/uscis-tracking/estimate-processing-time
router.post('/estimate-processing-time', async (req, res) => {
  try {
    const { applicationType } = req.body;
    
    // Mock processing time estimates - in production, these would come from ML models
    const estimates = {
      'N-400': { estimatedDays: 365, confidence: 0.9, factors: ['Interview Required', 'Background Check'] },
      'I-485': { estimatedDays: 480, confidence: 0.85, factors: ['Medical Exam', 'Interview Required'] },
      'I-765': { estimatedDays: 120, confidence: 0.92, factors: ['Employment Authorization'] },
      'I-90': { estimatedDays: 90, confidence: 0.88, factors: ['Card Production'] },
      'I-131': { estimatedDays: 75, confidence: 0.85, factors: ['Travel Document'] },
      'I-130': { estimatedDays: 540, confidence: 0.75, factors: ['Priority Date', 'Relationship Verification'] },
      'I-140': { estimatedDays: 300, confidence: 0.8, factors: ['Labor Certification', 'Premium Processing Available'] },
      'I-589': { estimatedDays: 720, confidence: 0.7, factors: ['Interview Required', 'Country Conditions'] },
      'I-327': { estimatedDays: 90, confidence: 0.85, factors: ['Refugee Status Verification'] },
      'I-751': { estimatedDays: 360, confidence: 0.8, factors: ['Interview May Be Required', 'Evidence Review'] }
    };

    const estimate = estimates[applicationType] || { 
      estimatedDays: 180, 
      confidence: 0.6, 
      factors: ['Standard Processing'] 
    };

    res.json(estimate);
  } catch (error) {
    console.error('Error estimating processing time:', error);
    res.status(500).json({ error: 'Failed to estimate processing time' });
  }
});

// GET /api/v1/uscis-tracking/business-questions
router.get('/business-questions', async (req, res) => {
  try {
    const businessQuestions = [
      {
        id: 'total-applications-received',
        question: 'How many applications were received this fiscal year?',
        category: 'volume',
        priority: 'high'
      },
      {
        id: 'green-card-backlog',
        question: 'What is the current backlog for green card applications?',
        category: 'backlog',
        priority: 'high'
      },
      {
        id: 'approval-rates',
        question: 'What are the approval rates by application type?',
        category: 'approval_rate',
        priority: 'medium'
      },
      {
        id: 'processing-times',
        question: 'What are the average processing times by center?',
        category: 'processing_time',
        priority: 'high'
      },
      {
        id: 'naturalization-trends',
        question: 'Show me naturalization application trends for the last quarter',
        category: 'trends',
        priority: 'medium'
      }
    ];

    res.json(businessQuestions);
  } catch (error) {
    console.error('Error fetching business questions:', error);
    res.status(500).json({ error: 'Failed to fetch business questions' });
  }
});

// POST /api/v1/uscis-tracking/business-questions/:id/execute
router.post('/business-questions/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock execution results - in production, these would run actual queries
    const results = {
      'total-applications-received': { count: 125000, period: 'FY 2024' },
      'green-card-backlog': { backlog: 45000, type: 'I-485' },
      'approval-rates': { 'N-400': 0.92, 'I-485': 0.87, 'I-765': 0.95 },
      'processing-times': { 'NBC': 180, 'TSC': 210, 'NSC': 195 },
      'naturalization-trends': { trend: 'increasing', percentage: 15 }
    };

    res.json({
      questionId: id,
      result: results[id] || { message: 'No data available' },
      executedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error executing business question:', error);
    res.status(500).json({ error: 'Failed to execute business question' });
  }
});

// POST /api/v1/uscis-tracking/natural-language-query
router.post('/natural-language-query', async (req, res) => {
  try {
    const { question } = req.body;
    
    // Enhanced natural language processing with actual data integration
    const answer = await processNaturalLanguageQuery(question);
    
    res.json(answer);
  } catch (error) {
    console.error('Error processing natural language query:', error);
    res.status(500).json({ error: 'Failed to process natural language query' });
  }
});

// GET /api/v1/uscis-tracking/training-patterns - Get all training patterns
router.get('/training-patterns', async (req, res) => {
  try {
    const patterns = patternMatcher.getAllPatterns();
    res.json({
      patterns,
      totalCount: patterns.length
    });
  } catch (error) {
    console.error('Error fetching training patterns:', error);
    res.status(500).json({ error: 'Failed to fetch training patterns' });
  }
});

// POST /api/v1/uscis-tracking/training-patterns - Add new training pattern
router.post('/training-patterns', async (req, res) => {
  try {
    const { pattern, template, confidence, category, keywords } = req.body;
    
    if (!pattern || !template) {
      return res.status(400).json({ error: 'Pattern and template are required' });
    }
    
    const newPattern = patternMatcher.addPattern(pattern, template, {
      confidence: confidence || 0.9,
      category: category || 'custom',
      keywords: keywords || []
    });
    
    res.json({
      message: 'Training pattern added successfully',
      pattern: newPattern
    });
  } catch (error) {
    console.error('Error adding training pattern:', error);
    res.status(500).json({ error: 'Failed to add training pattern' });
  }
});

// POST /api/v1/uscis-tracking/reload-patterns - Reload patterns from file
router.post('/reload-patterns', async (req, res) => {
  try {
    patternMatcher.reloadPatterns();
    const patterns = patternMatcher.getAllPatterns();
    
    res.json({
      message: 'Training patterns reloaded successfully',
      totalCount: patterns.length
    });
  } catch (error) {
    console.error('Error reloading training patterns:', error);
    res.status(500).json({ error: 'Failed to reload training patterns' });
  }
});

// GET /api/v1/uscis-tracking/sample-questions - Get sample questions by category
router.get('/sample-questions', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const patterns = patternMatcher.getAllPatterns();
    
    let filteredPatterns = patterns;
    if (category && category !== 'all') {
      filteredPatterns = patterns.filter(p => p.category === category);
    }
    
    // Convert patterns to user-friendly questions
    const sampleQuestions = filteredPatterns
      .slice(0, parseInt(limit))
      .map(pattern => ({
        question: pattern.pattern.toLowerCase()
          .replace(/\*/g, 'my application')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim() + '?',
        category: pattern.category,
        confidence: pattern.confidence
      }));
    
    // Get unique categories
    const categories = [...new Set(patterns.map(p => p.category))].sort();
    
    res.json({
      questions: sampleQuestions,
      categories,
      totalPatterns: patterns.length,
      filteredCount: filteredPatterns.length
    });
  } catch (error) {
    console.error('Error fetching sample questions:', error);
    res.status(500).json({ error: 'Failed to fetch sample questions' });
  }
});

// GET /api/v1/uscis-tracking/question-categories - Get all available categories
router.get('/question-categories', async (req, res) => {
  try {
    const patterns = patternMatcher.getAllPatterns();
    
    const categoryStats = patterns.reduce((acc, pattern) => {
      if (!acc[pattern.category]) {
        acc[pattern.category] = {
          name: pattern.category,
          count: 0,
          displayName: pattern.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
      }
      acc[pattern.category].count++;
      return acc;
    }, {});
    
    res.json({
      categories: Object.values(categoryStats).sort((a, b) => b.count - a.count),
      totalCategories: Object.keys(categoryStats).length,
      totalQuestions: patterns.length
    });
  } catch (error) {
    console.error('Error fetching question categories:', error);
    res.status(500).json({ error: 'Failed to fetch question categories' });
  }
});

// Enhanced NLP processing function
async function processNaturalLanguageQuery(question) {
  const lowerQuestion = question.toLowerCase();
  
  // First, check if this matches a trained pattern
  const trainedResponse = patternMatcher.getResponse(question);
  if (trainedResponse) {
    return {
      ...trainedResponse,
      sources: ['USCIS Training Data', 'Pattern Matching System'],
      timestamp: new Date().toISOString()
    };
  }
  
  // Get real-time data for responses
  const metrics = await USCISApplication.getMetrics();
  const backlogAnalysis = await USCISApplication.getBacklogAnalysis();
  
  // Enhanced pattern matching with actual data
  const patterns = [
    {
      keywords: ['how many', 'total', 'count', 'number of'],
      contexts: ['applications', 'cases'],
      handler: async () => {
        if (lowerQuestion.includes('received') || lowerQuestion.includes('submitted')) {
          if (lowerQuestion.includes('month')) {
            const monthlyCount = Math.round(metrics.totalApplications / 12);
            return {
              answer: `Based on current data, approximately ${monthlyCount.toLocaleString()} applications are received per month on average. The total applications in the system is ${metrics.totalApplications.toLocaleString()}.`,
              confidence: 0.9,
              data: { monthlyAverage: monthlyCount, total: metrics.totalApplications }
            };
          } else if (lowerQuestion.includes('year')) {
            return {
              answer: `This fiscal year, ${metrics.totalApplications.toLocaleString()} applications have been received across all benefit types.`,
              confidence: 0.9,
              data: { yearlyTotal: metrics.totalApplications }
            };
          }
        }
        return {
          answer: `There are currently ${(metrics && metrics.totalApplications) ? metrics.totalApplications.toLocaleString() : '0'} applications in the USCIS system across all benefit types.`,
          confidence: 0.9,
          data: { totalApplications: (metrics && metrics.totalApplications) ? metrics.totalApplications : 0 }
        };
      }
    },
    {
      keywords: ['processing center', 'center', 'facility'],
      contexts: ['longest', 'fastest', 'comparison', 'workload', 'wait times', 'processing times', 'list', 'distinct'],
      handler: async () => {
        if (lowerQuestion.includes('list') || lowerQuestion.includes('distinct')) {
          // Get distinct processing centers
          const distinctCenters = await USCISApplication.distinct('processingCenter');
          
          if (distinctCenters.length > 0) {
            const centerList = distinctCenters.map(center => `• ${center}`).join('\n');
            
            return {
              answer: `USCIS Processing Centers:\n\n${centerList}\n\nTotal: ${distinctCenters.length} processing centers currently operational.`,
              confidence: 0.98,
              data: { 
                processingCenters: distinctCenters,
                totalCount: distinctCenters.length
              }
            };
          }
        } else if (lowerQuestion.includes('longest') || lowerQuestion.includes('wait times') || lowerQuestion.includes('slowest')) {
          // Calculate average processing times by center
          const centerProcessingTimes = await USCISApplication.aggregate([
            {
              $match: {
                processingTimeBusinessDays: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: '$processingCenter',
                avgProcessingTime: { $avg: '$processingTimeBusinessDays' },
                totalCases: { $sum: 1 },
                pendingCases: {
                  $sum: {
                    $cond: [
                      { $in: ['$currentStatus', ['Case Was Received', 'Case Is Being Actively Reviewed', 'Request for Additional Evidence Was Sent', 'Response To USCIS Request Received', 'Case Is Ready to Be Scheduled for An Interview', 'Interview Was Scheduled']] },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $sort: { avgProcessingTime: -1 }
            }
          ]);

          if (centerProcessingTimes.length > 0) {
            const slowestCenter = centerProcessingTimes[0];
            const fastestCenter = centerProcessingTimes[centerProcessingTimes.length - 1];
            
            const centerList = centerProcessingTimes.map(center => 
              `• ${center._id}: ${Math.round(center.avgProcessingTime)} days (${center.pendingCases} pending)`
            ).join('\n');

            return {
              answer: `Processing Center Wait Times (Longest to Shortest):\n\n${centerList}\n\n📊 Summary: ${slowestCenter._id} has the longest wait time (${Math.round(slowestCenter.avgProcessingTime)} days), while ${fastestCenter._id} is fastest (${Math.round(fastestCenter.avgProcessingTime)} days).`,
              confidence: 0.95,
              data: { 
                centerProcessingTimes: centerProcessingTimes.map(c => ({
                  center: c._id,
                  avgProcessingDays: Math.round(c.avgProcessingTime),
                  totalCases: c.totalCases,
                  pendingCases: c.pendingCases
                }))
              }
            };
          }
        }
        
        // Default workload distribution
        const centerData = Object.entries((metrics && metrics.applicationsByCenter) ? metrics.applicationsByCenter : {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);
        
        if (centerData.length > 0) {
          const topCenter = centerData[0];
          const centerList = centerData.map(([center, count]) => `${center}: ${count.toLocaleString()}`).join(', ');
          
          return {
            answer: `Processing center workload distribution: ${centerList}. The ${topCenter[0]} currently handles the highest volume with ${topCenter[1].toLocaleString()} applications.`,
            confidence: 0.9,
            data: { centerDistribution: (metrics && metrics.applicationsByCenter) ? metrics.applicationsByCenter : {} }
          };
        }
        
        return {
          answer: `Processing center information is currently unavailable. Please try again later.`,
          confidence: 0.3,
          data: null
        };
      }
    },
    {
      keywords: ['list', 'show', 'distinct'],
      contexts: ['application types', 'statuses', 'types', 'status'],
      handler: async () => {
        if (lowerQuestion.includes('application types') || lowerQuestion.includes('types')) {
          // Get distinct application types
          const distinctTypes = await USCISApplication.distinct('applicationType');
          
          if (distinctTypes.length > 0) {
            const typeList = distinctTypes.map(type => `• ${type}`).join('\n');
            
            return {
              answer: `USCIS Application Types:\n\n${typeList}\n\nTotal: ${distinctTypes.length} different application types processed.`,
              confidence: 0.98,
              data: { 
                applicationTypes: distinctTypes,
                totalCount: distinctTypes.length
              }
            };
          }
        } else if (lowerQuestion.includes('status') || lowerQuestion.includes('statuses')) {
          // Get distinct statuses
          const distinctStatuses = await USCISApplication.distinct('currentStatus');
          
          if (distinctStatuses.length > 0) {
            const statusList = distinctStatuses.map(status => `• ${status}`).join('\n');
            
            return {
              answer: `USCIS Application Statuses:\n\n${statusList}\n\nTotal: ${distinctStatuses.length} different status categories tracked.`,
              confidence: 0.98,
              data: { 
                applicationStatuses: distinctStatuses,
                totalCount: distinctStatuses.length
              }
            };
          }
        }
        
        return {
          answer: `I can help you list:\n\n• Processing Centers\n• Application Types\n• Application Statuses\n\nPlease specify what you'd like to see listed.`,
          confidence: 0.7,
          data: null
        };
      }
    },
    {
      keywords: ['green card', 'i-485', 'adjustment of status'],
      contexts: ['backlog', 'time', 'status'],
      handler: async () => {
        const greenCardCount = (metrics && metrics.applicationsByType) ? metrics.applicationsByType['I-485'] || 0 : 0;
        const greenCardBacklog = (backlogAnalysis && backlogAnalysis.backlogByType) ? backlogAnalysis.backlogByType['I-485'] || 0 : 0;
        
        if (lowerQuestion.includes('backlog')) {
          return {
            answer: `The current green card (I-485) backlog is ${greenCardBacklog.toLocaleString()} applications. Total I-485 applications in the system: ${greenCardCount.toLocaleString()}.`,
            confidence: 0.95,
            data: { backlog: greenCardBacklog, total: greenCardCount }
          };
        } else if (lowerQuestion.includes('processing time') || lowerQuestion.includes('how long')) {
          return {
            answer: `Green card (I-485) applications currently have an average processing time of 16-24 months, depending on the processing center and case complexity.`,
            confidence: 0.85,
            data: { estimatedDays: 480 }
          };
        }
        return {
          answer: `Green card (I-485) applications: ${greenCardCount.toLocaleString()} total, ${greenCardBacklog.toLocaleString()} in backlog. Average processing time is 16-24 months.`,
          confidence: 0.9,
          data: { total: greenCardCount, backlog: greenCardBacklog }
        };
      }
    },
    {
      keywords: ['bottleneck', 'delay', 'problem', 'issue'],
      contexts: ['main', 'primary', 'biggest', 'current', 'naturalization', 'processing'],
      handler: async () => {
        // Check if this is specifically about naturalization bottlenecks
        if (lowerQuestion.includes('naturalization') || lowerQuestion.includes('n-400')) {
          return {
            answer: `Main Naturalization (N-400) Processing Bottlenecks:\n\n• **Interview Scheduling**: 45-60 day delays due to capacity constraints\n• **Background Check Processing**: 30-90 days for FBI name check completion\n• **Document Review**: 15-30 days for initial eligibility determination\n• **Oath Ceremony Scheduling**: 30-60 days after approval\n• **RFE Response Processing**: 60-120 days when additional evidence is required\n\n📊 **Impact**: These bottlenecks add 180-360 days to the standard 12-18 month processing timeline.`,
            confidence: 0.9,
            data: {
              bottlenecks: [
                { step: 'Interview Scheduling', avgDuration: 52, impact: 'High' },
                { step: 'Background Check Processing', avgDuration: 60, impact: 'High' },
                { step: 'Document Review', avgDuration: 22, impact: 'Medium' },
                { step: 'Oath Ceremony Scheduling', avgDuration: 45, impact: 'Medium' },
                { step: 'RFE Response Processing', avgDuration: 90, impact: 'High' }
              ],
              applicationType: 'N-400'
            }
          };
        }
        
        // General bottlenecks
        const bottlenecks = (backlogAnalysis && backlogAnalysis.bottlenecks) ? backlogAnalysis.bottlenecks : [];
        if (bottlenecks.length > 0) {
          const bottleneckList = bottlenecks.map(b => 
            `• **${b.step}**: ${b.averageDuration} days (${b.casesAffected.toLocaleString()} cases affected)`
          ).join('\n');
          
          return {
            answer: `Main USCIS Processing Bottlenecks:\n\n${bottleneckList}\n\n📊 **Recommendation**: Focus on the top bottleneck to improve overall processing efficiency.`,
            confidence: 0.85,
            data: { bottlenecks }
          };
        }
        
        return {
          answer: `Common USCIS Processing Bottlenecks:\n\n• **Initial Review Delays**: High application volumes causing intake backlogs\n• **RFE Response Processing**: Additional evidence requests extending timelines\n• **Interview Scheduling**: Limited capacity at field offices\n• **Background Check Processing**: FBI and security clearance delays\n• **Quality Assurance Reviews**: Final case review and approval processes\n\n📊 **Note**: Specific bottleneck data varies by application type and processing center.`,
          confidence: 0.7,
          data: {
            generalBottlenecks: [
              'Initial Review Delays',
              'RFE Response Processing', 
              'Interview Scheduling',
              'Background Check Processing',
              'Quality Assurance Reviews'
            ]
          }
        };
      }
    },
    {
      keywords: ['naturalization', 'n-400', 'citizenship'],
      contexts: ['backlog', 'processing', 'time', 'approval'],
      handler: async () => {
        const naturalizationCount = (metrics && metrics.applicationsByType) ? metrics.applicationsByType['N-400'] || 0 : 0;
        const naturalizationBacklog = (backlogAnalysis && backlogAnalysis.backlogByType) ? backlogAnalysis.backlogByType['N-400'] || 0 : 0;
        
        if (lowerQuestion.includes('approval rate')) {
          return {
            answer: `Naturalization (N-400) applications have a ${(metrics && metrics.approvalRate) ? (metrics.approvalRate * 100).toFixed(1) : '0'}% approval rate. There are ${naturalizationCount.toLocaleString()} N-400 applications currently in the system.`,
            confidence: 0.9,
            data: { approvalRate: (metrics && metrics.approvalRate) ? metrics.approvalRate : 0, total: naturalizationCount }
          };
        } else if (lowerQuestion.includes('processing time')) {
          return {
            answer: `Naturalization (N-400) applications typically take 12-18 months to process, including the interview and oath ceremony scheduling.`,
            confidence: 0.85,
            data: { estimatedDays: 365 }
          };
        }
        return {
          answer: `Naturalization (N-400) applications: ${naturalizationCount.toLocaleString()} total, ${naturalizationBacklog.toLocaleString()} in backlog. Current approval rate is ${(metrics && metrics.approvalRate) ? (metrics.approvalRate * 100).toFixed(1) : '0'}%.`,
          confidence: 0.9,
          data: { total: naturalizationCount, backlog: naturalizationBacklog }
        };
      }
    },
    {
      keywords: ['backlog', 'pending', 'waiting'],
      contexts: ['current', 'total', 'size'],
      handler: async () => {
        if (lowerQuestion.includes('oldest') || lowerQuestion.includes('longest')) {
          const oldestCase = (backlogAnalysis && backlogAnalysis.oldestCase) ? backlogAnalysis.oldestCase : null;
          return {
            answer: `The oldest case in the current backlog has been in the system for ${oldestCase?.daysInSystem || 'N/A'} days (Receipt: ${oldestCase?.receiptNumber || 'N/A'}).`,
            confidence: 0.9,
            data: oldestCase
          };
        }
        return {
          answer: `The current total backlog is ${metrics.backlogCount.toLocaleString()} pending applications across all benefit types. This represents ${((metrics.backlogCount / metrics.totalApplications) * 100).toFixed(1)}% of all applications in the system.`,
          confidence: 0.95,
          data: { backlog: metrics.backlogCount, percentage: (metrics.backlogCount / metrics.totalApplications) * 100 }
        };
      }
    },
    {
      keywords: ['approval rate', 'approval', 'approved', 'success rate'],
      contexts: ['rate', 'percentage', 'statistics'],
      handler: async () => {
        const approvalPercentage = (metrics.approvalRate * 100).toFixed(1);
        const denialPercentage = (metrics.denialRate * 100).toFixed(1);
        
        return {
          answer: `Current approval rates: Overall ${approvalPercentage}%, Denial rate ${denialPercentage}%. The completion rate (approved + denied) is ${(metrics.completionRate * 100).toFixed(1)}%.`,
          confidence: 0.95,
          data: { 
            approvalRate: metrics.approvalRate, 
            denialRate: metrics.denialRate,
            completionRate: metrics.completionRate 
          }
        };
      }
    },
    {
      keywords: ['processing time', 'how long', 'duration', 'timeline'],
      contexts: ['average', 'typical', 'current'],
      handler: async () => {
        return {
          answer: `Average processing time across all application types is ${metrics.averageProcessingTime} days. Processing times vary by application type: N-400 (12-18 months), I-485 (16-24 months), I-765 (3-5 months).`,
          confidence: 0.9,
          data: { averageProcessingTime: metrics.averageProcessingTime }
        };
      }
    },
    {
      keywords: ['bottleneck', 'delay', 'problem', 'issue'],
      contexts: ['main', 'primary', 'biggest', 'current', 'naturalization', 'processing'],
      handler: async () => {
        // Check if this is specifically about naturalization bottlenecks
        if (lowerQuestion.includes('naturalization') || lowerQuestion.includes('n-400')) {
          return {
            answer: `Main Naturalization (N-400) Processing Bottlenecks:\n\n• **Interview Scheduling**: 45-60 day delays due to capacity constraints\n• **Background Check Processing**: 30-90 days for FBI name check completion\n• **Document Review**: 15-30 days for initial eligibility determination\n• **Oath Ceremony Scheduling**: 30-60 days after approval\n• **RFE Response Processing**: 60-120 days when additional evidence is required\n\n📊 **Impact**: These bottlenecks add 180-360 days to the standard 12-18 month processing timeline.`,
            confidence: 0.9,
            data: {
              bottlenecks: [
                { step: 'Interview Scheduling', avgDuration: 52, impact: 'High' },
                { step: 'Background Check Processing', avgDuration: 60, impact: 'High' },
                { step: 'Document Review', avgDuration: 22, impact: 'Medium' },
                { step: 'Oath Ceremony Scheduling', avgDuration: 45, impact: 'Medium' },
                { step: 'RFE Response Processing', avgDuration: 90, impact: 'High' }
              ],
              applicationType: 'N-400'
            }
          };
        }
        
        // General bottlenecks
        const bottlenecks = (backlogAnalysis && backlogAnalysis.bottlenecks) ? backlogAnalysis.bottlenecks : [];
        if (bottlenecks.length > 0) {
          const bottleneckList = bottlenecks.map(b => 
            `• **${b.step}**: ${b.averageDuration} days (${b.casesAffected.toLocaleString()} cases affected)`
          ).join('\n');
          
          return {
            answer: `Main USCIS Processing Bottlenecks:\n\n${bottleneckList}\n\n📊 **Recommendation**: Focus on the top bottleneck to improve overall processing efficiency.`,
            confidence: 0.85,
            data: { bottlenecks }
          };
        }
        
        return {
          answer: `Common USCIS Processing Bottlenecks:\n\n• **Initial Review Delays**: High application volumes causing intake backlogs\n• **RFE Response Processing**: Additional evidence requests extending timelines\n• **Interview Scheduling**: Limited capacity at field offices\n• **Background Check Processing**: FBI and security clearance delays\n• **Quality Assurance Reviews**: Final case review and approval processes\n\n📊 **Note**: Specific bottleneck data varies by application type and processing center.`,
          confidence: 0.7,
          data: {
            generalBottlenecks: [
              'Initial Review Delays',
              'RFE Response Processing', 
              'Interview Scheduling',
              'Background Check Processing',
              'Quality Assurance Reviews'
            ]
          }
        };
      }
    }
  ];

  // Find matching pattern
  for (const pattern of patterns) {
    const hasKeyword = pattern.keywords.some(keyword => lowerQuestion.includes(keyword));
    const hasContext = pattern.contexts.some(context => lowerQuestion.includes(context));
    
    if (hasKeyword || hasContext) {
      const result = await pattern.handler();
      return {
        ...result,
        sources: ['USCIS Application Database', 'Real-time Processing Data', 'Backlog Analysis System'],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Fallback response with helpful suggestions
  return {
    answer: `I understand you're asking about USCIS application data. I can help you with questions about:

• Application volumes and counts ("How many applications were received?")
• Processing times ("What's the average processing time for green cards?")
• Approval rates ("What's the approval rate for naturalization?")
• Backlog information ("What's the current backlog size?")
• Processing centers ("Which center handles the most cases?")
• Bottlenecks and delays ("What are the main processing bottlenecks?")

Please try rephrasing your question using these topics, or click one of the sample questions below.`,
    confidence: 0.6,
    sources: ['DHS Chat Assistant'],
    data: null,
    suggestions: [
      "How many applications were received this month?",
      "What's the current backlog for green card applications?",
      "What's the approval rate for naturalization applications?",
      "Which processing center has the longest wait times?"
    ]
  };
}

// GET /api/v1/uscis-tracking/dashboard-config
router.get('/dashboard-config', async (req, res) => {
  try {
    const config = {
      refreshInterval: 300000, // 5 minutes
      defaultDateRange: '1year',
      enabledMetrics: [
        'totalApplications',
        'approvalRate',
        'backlogCount',
        'averageProcessingTime',
        'expeditedCount'
      ],
      alertThresholds: {
        backlogSize: 100000,
        processingTimeIncrease: 0.2, // 20%
        approvalRateDecrease: 0.1 // 10%
      }
    };

    res.json(config);
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard config' });
  }
});

// PUT /api/v1/uscis-tracking/dashboard-config
router.put('/dashboard-config', async (req, res) => {
  try {
    // In production, this would save to database
    const updatedConfig = req.body;
    
    res.json(updatedConfig);
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    res.status(500).json({ error: 'Failed to update dashboard config' });
  }
});

// GET /api/v1/uscis-tracking/export
router.get('/export', async (req, res) => {
  try {
    // Mock export functionality
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="uscis-applications.csv"');
    
    const csvData = 'Receipt Number,Application Type,Status,Received Date,Processing Days\n';
    res.send(csvData + 'MSC1234567890,N-400,Case Was Approved,2024-01-15,180\n');
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// POST /api/v1/uscis-tracking/generate-report
router.post('/generate-report', async (req, res) => {
  try {
    const { reportType, options } = req.body;
    
    // Mock report generation
    const reportUrl = `/reports/uscis-${reportType}-${Date.now()}.pdf`;
    const generatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    
    res.json({
      reportUrl,
      generatedAt,
      expiresAt
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
