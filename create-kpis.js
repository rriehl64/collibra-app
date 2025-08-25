/**
 * Script to create sample KPIs
 * Run this script to populate the kpis collection
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the Kpi model
const Kpi = require('./server/models/Kpi');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample KPIs to insert (12)
const kpis = [
  {
    name: 'Data Quality Score',
    definition: 'Overall measure of data quality across completeness, validity, consistency, timeliness.',
    calculationMethod: 'Weighted average of quality dimensions from profiling results.',
    dataSources: ['Data Quality Reports', 'Profiling Jobs'],
    frequency: 'Monthly',
    owner: 'Data Governance Team',
    category: 'Data Management',
    tags: ['data quality', 'governance', 'metrics'],
    currentValue: 87,
    targetValue: 95,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Data Completeness Rate', 'Master Data Accuracy'],
    target: '>= 95%',
    thresholds: 'Red < 85, Yellow 85-94, Green >= 95',
    notes: 'Aggregated from domain-level scores.'
  },
  {
    name: 'Data Completeness Rate',
    definition: 'Percentage of required fields populated across critical data assets.',
    calculationMethod: 'Populated required fields / total required fields.',
    dataSources: ['Profiling Jobs'],
    frequency: 'Monthly',
    owner: 'Data Quality Office',
    category: 'Data Quality',
    tags: ['completeness'],
    currentValue: 92,
    targetValue: 98,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Data Quality Score'],
    target: '>= 98%',
    thresholds: 'Red < 90, Yellow 90-97, Green >= 98',
    notes: ''
  },
  {
    name: 'Master Data Accuracy',
    definition: 'Accuracy of master data entities compared to source of truth.',
    calculationMethod: 'Validated correct values / total sampled values.',
    dataSources: ['MDM System', 'Audit Samples'],
    frequency: 'Quarterly',
    owner: 'MDM Team',
    category: 'MDM',
    tags: ['accuracy', 'mdm'],
    currentValue: 94,
    targetValue: 98,
    unit: '%',
    trend: 'flat',
    relatedKPIs: ['Data Quality Score'],
    target: '>= 98%',
    thresholds: 'Red < 93, Yellow 93-97, Green >= 98',
    notes: ''
  },
  {
    name: 'Pipeline Success Rate',
    definition: 'Percentage of successful data pipeline runs.',
    calculationMethod: 'Successful runs / total runs in the period.',
    dataSources: ['ETL Orchestrator'],
    frequency: 'Weekly',
    owner: 'Data Engineering',
    category: 'Operations',
    tags: ['pipelines', 'reliability'],
    currentValue: 99.1,
    targetValue: 99.9,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Mean Time to Recovery'],
    target: '>= 99.9%',
    thresholds: 'Red < 97, Yellow 97-99.8, Green >= 99.9',
    notes: ''
  },
  {
    name: 'Mean Time to Recovery (MTTR)',
    definition: 'Average time to restore a failed data service or pipeline.',
    calculationMethod: 'Sum of incident recovery times / number of incidents.',
    dataSources: ['Incident Management'],
    frequency: 'Monthly',
    owner: 'SRE Team',
    category: 'Reliability',
    tags: ['mttr', 'incidents'],
    currentValue: 1.8,
    targetValue: 1.0,
    unit: 'hours',
    trend: 'down',
    relatedKPIs: ['Pipeline Success Rate'],
    target: '<= 1 hour',
    thresholds: 'Red > 3, Yellow 1-3, Green <= 1',
    notes: ''
  },
  {
    name: 'Data Access Request Cycle Time',
    definition: 'Average time from data access request to fulfillment.',
    calculationMethod: 'Average of request completion durations.',
    dataSources: ['Access Management System'],
    frequency: 'Monthly',
    owner: 'Data Governance Team',
    category: 'Governance',
    tags: ['access', 'sla'],
    currentValue: 5.2,
    targetValue: 3,
    unit: 'days',
    trend: 'down',
    relatedKPIs: ['Access Requests Completed'],
    target: '<= 3 days',
    thresholds: 'Red > 7, Yellow 3-7, Green <= 3',
    notes: ''
  },
  {
    name: 'Access Requests Completed',
    definition: 'Number of access requests fulfilled in the period.',
    calculationMethod: 'Count of requests completed.',
    dataSources: ['Access Management System'],
    frequency: 'Monthly',
    owner: 'Data Governance Team',
    category: 'Governance',
    tags: ['access'],
    currentValue: 124,
    targetValue: 140,
    unit: 'count',
    trend: 'up',
    relatedKPIs: ['Data Access Request Cycle Time'],
    target: '>= 140 per month',
    thresholds: 'Red < 100, Yellow 100-139, Green >= 140',
    notes: ''
  },
  {
    name: 'Data Catalog Coverage',
    definition: 'Percentage of critical data assets documented in the catalog.',
    calculationMethod: 'Documented critical assets / total critical assets.',
    dataSources: ['Data Catalog'],
    frequency: 'Monthly',
    owner: 'Data Stewardship',
    category: 'Metadata',
    tags: ['catalog', 'metadata'],
    currentValue: 76,
    targetValue: 95,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Stewardship SLA Adherence'],
    target: '>= 95%',
    thresholds: 'Red < 70, Yellow 70-94, Green >= 95',
    notes: ''
  },
  {
    name: 'Stewardship SLA Adherence',
    definition: 'Percentage of stewardship tasks completed within SLA.',
    calculationMethod: 'On-time tasks / total tasks.',
    dataSources: ['Workflow System'],
    frequency: 'Monthly',
    owner: 'Data Stewardship',
    category: 'Operations',
    tags: ['sla', 'stewardship'],
    currentValue: 88,
    targetValue: 95,
    unit: '%',
    trend: 'flat',
    relatedKPIs: ['Data Catalog Coverage'],
    target: '>= 95%',
    thresholds: 'Red < 80, Yellow 80-94, Green >= 95',
    notes: ''
  },
  {
    name: 'PII Exposure Incidents',
    definition: 'Number of PII exposure incidents detected.',
    calculationMethod: 'Count of confirmed incidents in the period.',
    dataSources: ['Security Incident Management'],
    frequency: 'Monthly',
    owner: 'Security',
    category: 'Security',
    tags: ['pii', 'security'],
    currentValue: 1,
    targetValue: 0,
    unit: 'count',
    trend: 'down',
    relatedKPIs: ['Mean Time to Recovery (MTTR)'],
    target: '0',
    thresholds: 'Red > 2, Yellow 1-2, Green 0',
    notes: ''
  },
  {
    name: 'Analytics Adoption Rate',
    definition: 'Percentage of target users actively using analytics tools monthly.',
    calculationMethod: 'Active users / total target users.',
    dataSources: ['Analytics Platform Usage'],
    frequency: 'Monthly',
    owner: 'Analytics COE',
    category: 'Adoption',
    tags: ['adoption', 'usage'],
    currentValue: 63,
    targetValue: 80,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Training Completion Rate'],
    target: '>= 80%',
    thresholds: 'Red < 50, Yellow 50-79, Green >= 80',
    notes: ''
  },
  {
    name: 'Training Completion Rate',
    definition: 'Percentage of assigned users who completed required data training.',
    calculationMethod: 'Completions / assigned users.',
    dataSources: ['LMS'],
    frequency: 'Quarterly',
    owner: 'Learning & Development',
    category: 'Training',
    tags: ['training', 'compliance'],
    currentValue: 72,
    targetValue: 90,
    unit: '%',
    trend: 'up',
    relatedKPIs: ['Analytics Adoption Rate'],
    target: '>= 90%',
    thresholds: 'Red < 60, Yellow 60-89, Green >= 90',
    notes: ''
  }
];

// Seed function
async function seedKpis() {
  try {
    await Kpi.deleteMany({});
    console.log('Deleted existing KPIs');

    const created = await Kpi.create(kpis);
    console.log(`Created ${created.length} KPIs`);
    created.forEach(k => console.log(`- ${k.name} (${k._id})`));

    console.log('KPI seeding completed successfully');
  } catch (error) {
    console.error('Error seeding KPIs:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedKpis();
