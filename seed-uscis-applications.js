const mongoose = require('mongoose');
const crypto = require('crypto');

// USCIS Application data generation script
// This creates realistic sample data for the USCIS Application Tracking system

const applicationTypes = [
  'N-400',    // Naturalization
  'I-485',    // Green Card (Adjustment of Status)
  'I-90',     // Green Card Renewal
  'I-765',    // Work Authorization
  'I-131',    // Travel Document
  'I-130',    // Family Petition
  'I-140',    // Employment Petition
  'I-589',    // Asylum
  'I-327',    // Refugee Travel Document
  'I-751'     // Conditional Residence Removal
];

const applicationStatuses = [
  'Case Was Received',
  'Case Is Being Actively Reviewed',
  'Request for Additional Evidence Was Sent',
  'Response To USCIS Request Received',
  'Interview Was Scheduled',
  'Interview Was Completed',
  'Case Is Ready to Be Scheduled for An Interview',
  'Case Was Approved',
  'Case Was Denied',
  'Case Was Withdrawn',
  'Case Was Terminated',
  'Case Was Transferred'
];

const processingCenters = [
  'National Benefits Center',
  'Texas Service Center',
  'Nebraska Service Center',
  'Vermont Service Center',
  'California Service Center',
  'Potomac Service Center',
  'USCIS Lockbox Facility'
];

const priorities = ['Standard', 'Expedited', 'Premium Processing', 'Emergency'];
const channels = ['Online', 'Mail', 'In-Person'];

const countries = [
  'Mexico', 'India', 'China', 'Philippines', 'El Salvador', 'Vietnam', 'Cuba', 
  'Dominican Republic', 'Guatemala', 'South Korea', 'Colombia', 'Haiti', 
  'Jamaica', 'Ecuador', 'Peru', 'Honduras', 'Brazil', 'Canada', 'United Kingdom',
  'Germany', 'Nigeria', 'Ethiopia', 'Bangladesh', 'Pakistan', 'Iran'
];

// Generate receipt number based on processing center
function generateReceiptNumber(center) {
  const centerCodes = {
    'National Benefits Center': 'NBC',
    'Texas Service Center': 'TSC',
    'Nebraska Service Center': 'NSC',
    'Vermont Service Center': 'VSC',
    'California Service Center': 'CSC',
    'Potomac Service Center': 'POT',
    'USCIS Lockbox Facility': 'LBX'
  };
  
  const code = centerCodes[center] || 'NBC';
  const number = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return `${code}${number}`;
}

// Generate random date within range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate anonymized applicant ID
function generateApplicantId() {
  return crypto.randomBytes(16).toString('hex');
}

// Generate realistic processing times based on application type
function getProcessingTimeRange(applicationType) {
  const ranges = {
    'N-400': { min: 180, max: 540 },    // 6-18 months
    'I-485': { min: 240, max: 720 },    // 8-24 months
    'I-90': { min: 60, max: 180 },      // 2-6 months
    'I-765': { min: 90, max: 150 },     // 3-5 months
    'I-131': { min: 60, max: 120 },     // 2-4 months
    'I-130': { min: 300, max: 900 },    // 10-30 months
    'I-140': { min: 180, max: 540 },    // 6-18 months
    'I-589': { min: 360, max: 1080 },   // 12-36 months
    'I-327': { min: 90, max: 180 },     // 3-6 months
    'I-751': { min: 240, max: 540 }     // 8-18 months
  };
  
  return ranges[applicationType] || { min: 90, max: 365 };
}

// Generate status progression based on application type and current status
function generateStatusHistory(applicationType, currentStatus, receivedDate) {
  const history = [{
    status: 'Case Was Received',
    date: receivedDate,
    notes: 'Initial receipt and data entry completed',
    updatedBy: 'System'
  }];
  
  const statusProgression = [
    'Case Was Received',
    'Case Is Being Actively Reviewed',
    'Request for Additional Evidence Was Sent',
    'Response To USCIS Request Received',
    'Interview Was Scheduled',
    'Interview Was Completed',
    'Case Was Approved'
  ];
  
  const currentIndex = statusProgression.indexOf(currentStatus);
  let currentDate = new Date(receivedDate);
  
  for (let i = 1; i <= currentIndex; i++) {
    currentDate = new Date(currentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    history.push({
      status: statusProgression[i],
      date: currentDate,
      notes: `Status updated to ${statusProgression[i]}`,
      updatedBy: 'USCIS Officer'
    });
  }
  
  return history;
}

// Generate sample applications
function generateApplications(count = 1000) {
  const applications = [];
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  
  for (let i = 0; i < count; i++) {
    const applicationType = applicationTypes[Math.floor(Math.random() * applicationTypes.length)];
    const processingCenter = processingCenters[Math.floor(Math.random() * processingCenters.length)];
    const receivedDate = randomDate(twoYearsAgo, now);
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Determine current status based on how long the case has been in system
    const daysInSystem = Math.floor((now - receivedDate) / (1000 * 60 * 60 * 24));
    const processingRange = getProcessingTimeRange(applicationType);
    
    let currentStatus;
    if (daysInSystem < processingRange.min * 0.3) {
      currentStatus = applicationStatuses[Math.floor(Math.random() * 4)]; // Early stages
    } else if (daysInSystem < processingRange.min * 0.7) {
      currentStatus = applicationStatuses[Math.floor(Math.random() * 6) + 2]; // Middle stages
    } else if (daysInSystem > processingRange.max) {
      currentStatus = applicationStatuses[Math.floor(Math.random() * 3) + 7]; // Final stages
    } else {
      currentStatus = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
    }
    
    const hasRFE = Math.random() < 0.25; // 25% chance of RFE
    const hasInterview = ['N-400', 'I-485', 'I-589'].includes(applicationType) && Math.random() < 0.8;
    const hasComplications = Math.random() < 0.15; // 15% chance of complications
    
    const totalStepsRequired = hasInterview ? 7 : 5;
    const totalStepsCompleted = Math.min(
      totalStepsRequired,
      Math.floor(Math.random() * totalStepsRequired) + 1
    );
    
    // Calculate fiscal year
    const year = receivedDate.getFullYear();
    const month = receivedDate.getMonth();
    const fiscalYear = month >= 9 ? year + 1 : year; // FY starts in October
    const quarter = Math.ceil((month + 4) % 12 / 3) || 4;

    const application = {
      receiptNumber: generateReceiptNumber(processingCenter),
      applicationType,
      currentStatus,
      priority,
      processingCenter,
      receivedDate,
      lastUpdatedDate: new Date(receivedDate.getTime() + Math.random() * (now - receivedDate)),
      applicantId: generateApplicantId(),
      countryOfBirth: countries[Math.floor(Math.random() * countries.length)],
      applicationChannel: channels[Math.floor(Math.random() * channels.length)],
      processingTimeBusinessDays: daysInSystem,
      currentStepDuration: Math.floor(Math.random() * 60) + 1,
      totalStepsCompleted,
      totalStepsRequired,
      hasRFE,
      hasInterview,
      isExpedited: ['Expedited', 'Premium Processing', 'Emergency'].includes(priority),
      hasComplications,
      fiscalYear,
      quarter,
      statusHistory: generateStatusHistory(applicationType, currentStatus, receivedDate),
      riskScore: Math.random(),
      predictedProcessingDays: Math.floor(Math.random() * processingRange.max) + processingRange.min,
      anomalyFlags: hasComplications ? [{
        flagType: 'processing_delay',
        description: 'Case processing time exceeds normal range',
        severity: 'medium',
        detectedAt: new Date()
      }] : []
    };
    
    // Set completion date for approved/denied cases
    if (['Case Was Approved', 'Case Was Denied'].includes(currentStatus)) {
      application.actualCompletionDate = new Date(
        receivedDate.getTime() + Math.random() * (now - receivedDate)
      );
    }
    
    // Set expected completion date for pending cases
    if (!application.actualCompletionDate) {
      application.expectedCompletionDate = new Date(
        now.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000 // Next 6 months
      );
    }
    
    applications.push(application);
  }
  
  return applications;
}

// Export for use in seeding script
module.exports = {
  generateApplications,
  applicationTypes,
  applicationStatuses,
  processingCenters,
  priorities
};

// If run directly, generate and log sample data
if (require.main === module) {
  console.log('Generating sample USCIS applications...');
  const sampleApps = generateApplications(10);
  console.log(JSON.stringify(sampleApps, null, 2));
}
