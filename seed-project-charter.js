/**
 * Script: seed-project-charter.js
 * Purpose: Create the `projectcharters` collection and insert a sample Project Charter document.
 * Usage: node seed-project-charter.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support';
console.log(`[ProjectCharter Seeder] Connecting to MongoDB: ${mongoURI}`);

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('[ProjectCharter Seeder] MongoDB connection established'))
  .catch((err) => {
    console.error('[ProjectCharter Seeder] MongoDB connection error:', err);
    process.exit(1);
  });

// Import Mongoose model (declares collection name 'projectcharters')
const ProjectCharter = require('./server/models/ProjectCharter');

// Sample document matching schema fields
const sampleCharter = {
  title: 'USCIS Data Quality Improvement Initiative',
  problemStatement:
    'Current data quality issues across multiple domains hinder accurate reporting and decision-making. We need a coordinated effort to assess, remediate, and prevent data quality problems.',
  missionAlignment:
    'Aligns with USCIS strategic goal to enhance data-driven decision-making and improve service delivery.',
  objectivesKpis:
    '- Achieve 95% data completeness across critical datasets within 2 quarters\n- Reduce duplicate records by 80%\n- Establish ongoing data quality monitoring with monthly dashboards',
  inScope:
    'Critical data domains (Benefits, Case Management, Identity), data profiling, deduplication policies, data validation rules.',
  outOfScope:
    'Non-critical archival datasets, non-USCIS external partner systems.',
  stakeholdersRaci:
    'R: Data Governance Office; A: Chief Data Officer; C: Domain Stewards; I: Program Offices',
  assumptionsConstraints:
    'Resource availability for ETL updates, cross-team coordination, access to source systems.',
  risksMitigations:
    'Risk: Incomplete source access → Mitigation: Executive sponsorship and phased access plan.\nRisk: Tooling limitations → Mitigation: Pilot alternative tooling.',
  timelineMilestones:
    'Q1: Discovery & Profiling\nQ2: Remediation Plan\nQ3: Implementation\nQ4: Monitoring & Handoff',
  decisionCadence:
    'Bi-weekly steering committee meetings with exception review as needed.',
  notes:
    'Seeded by seed-project-charter.js for local development and testing.'
};

async function run() {
  try {
    // Optional: clear existing documents (comment out if not desired)
    // await ProjectCharter.deleteMany({});
    // console.log('[ProjectCharter Seeder] Cleared existing project charters');

    // Upsert: create if none exists, otherwise keep existing first doc
    const existing = await ProjectCharter.findOne();
    if (existing) {
      console.log('[ProjectCharter Seeder] A Project Charter already exists. Skipping insert.');
    } else {
      const created = await ProjectCharter.create(sampleCharter);
      console.log('[ProjectCharter Seeder] Inserted sample Project Charter with id:', created._id.toString());
    }

    // Verify collection exists and count docs
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasCollection = collections.some((c) => c.name === 'projectcharters');
    console.log(`[ProjectCharter Seeder] Collection present: ${hasCollection}`);

    const count = await ProjectCharter.countDocuments();
    console.log(`[ProjectCharter Seeder] Document count in projectcharters: ${count}`);
  } catch (err) {
    console.error('[ProjectCharter Seeder] Error seeding Project Charter:', err);
  } finally {
    await mongoose.connection.close();
    console.log('[ProjectCharter Seeder] Database connection closed');
    process.exit(0);
  }
}

run();
