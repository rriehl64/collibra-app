/*
 Seed August 2025 Weekly Status entries - 40 users x 4 weeks = 160 records
 Usage:
   node seed-august-2025.js [--truncate]
 Notes:
   - Creates one status per user per week for all 4 weeks in August 2025
   - Use --truncate to clear existing data first
   - August 2025 weeks: Aug 4, Aug 11, Aug 18, Aug 25 (Mondays)
*/

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const connectDB = require('./server/config/db');
const WeeklyStatus = require('./server/models/WeeklyStatus');
const User = require('./server/models/User');

dotenv.config();

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { truncate: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--truncate') opts.truncate = true;
  }
  return opts;
}

// August 2025 Mondays (week start dates)
const augustWeeks = [
  new Date('2025-08-04T00:00:00.000Z'), // Week 1
  new Date('2025-08-11T00:00:00.000Z'), // Week 2
  new Date('2025-08-18T00:00:00.000Z'), // Week 3
  new Date('2025-08-25T00:00:00.000Z')  // Week 4
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateWeeklyData(userName, weekNumber) {
  const statuses = ['green', 'yellow', 'red'];
  const weights = [0.7, 0.25, 0.05]; // 70% green, 25% yellow, 5% red
  
  const rand = Math.random();
  let status = 'green';
  if (rand < weights[2]) status = 'red';
  else if (rand < weights[2] + weights[1]) status = 'yellow';

  const accomplishments = [
    `Week ${weekNumber}: Completed E-Verify UI enhancements and accessibility updates`,
    `Week ${weekNumber}: Delivered API endpoint optimizations for data asset management`,
    `Week ${weekNumber}: Coordinated with COR on August deliverable milestones`,
    `Week ${weekNumber}: Finalized security compliance documentation and testing`,
    `Week ${weekNumber}: Implemented user feedback improvements for dashboard components`
  ];

  const tasksStatus = [
    `Week ${weekNumber}: All assigned tasks on track per PWS requirements`,
    `Week ${weekNumber}: Sprint goals achieved, ready for next iteration`,
    `Week ${weekNumber}: Dependencies resolved, no current blockers identified`,
    `Week ${weekNumber}: Code reviews completed, staging deployment successful`,
    `Week ${weekNumber}: QA validation passed, production ready for release`
  ];

  const issuesNeeds = [
    'None - all systems operational',
    'Awaiting final approval on data migration timeline',
    'Need COR feedback on updated technical specifications',
    'Minor environment configuration adjustments needed',
    'Scheduling coordination required for stakeholder review'
  ];

  const nextSteps = [
    `Week ${weekNumber + 1}: Begin next sprint planning and requirement analysis`,
    `Week ${weekNumber + 1}: Prepare monthly demo materials for PMO presentation`,
    `Week ${weekNumber + 1}: Complete integration testing for new features`,
    `Week ${weekNumber + 1}: Update project documentation and user guides`,
    `Week ${weekNumber + 1}: Conduct team retrospective and process improvements`
  ];

  const communications = [
    `Week ${weekNumber}: Attended daily standups and weekly PMO sync meetings`,
    `Week ${weekNumber}: Coordinated with data stewards on asset classification`,
    `Week ${weekNumber}: Participated in architecture review and planning session`,
    `Week ${weekNumber}: Shared progress updates with supervisor and team leads`,
    `Week ${weekNumber}: Collaborated with QA team on testing strategies`
  ];

  return {
    status,
    summary: `Week ${weekNumber} summary for ${userName} - ${status.toUpperCase()} status`,
    accomplishments: pick(accomplishments),
    tasksStatus: pick(tasksStatus),
    issuesNeeds: pick(issuesNeeds),
    nextSteps: pick(nextSteps),
    hoursWorked: Math.floor(35 + Math.random() * 10), // 35-44 hours
    communications: pick(communications)
  };
}

async function getUsers(limit) {
  try {
    const users = await User.find().limit(limit).select('name email role');
    return users;
  } catch (e) {
    return [];
  }
}

async function run() {
  const { truncate } = parseArgs();
  await connectDB();

  console.log('Seeding August 2025 Weekly Status Reports...');
  console.log(`Target: 40 users × 4 weeks = 160 records`);

  if (truncate) {
    console.log('Truncating existing WeeklyStatus collection...');
    await WeeklyStatus.deleteMany({});
    console.log('Collection truncated.');
  }

  // Ensure unique index exists
  try {
    await WeeklyStatus.collection.createIndex({ userId: 1, weekStart: 1 }, { unique: true });
  } catch (e) {
    // ignore if already exists
  }

  const users = await getUsers(40);
  const docs = [];

  // Create participant list of exactly 40 users (real users first, then placeholders)
  const participants = [];
  for (let i = 0; i < Math.min(users.length, 40); i++) {
    participants.push({ _id: users[i]._id, name: users[i].name });
  }
  if (participants.length < 40) {
    const needed = 40 - participants.length;
    for (let i = 0; i < needed; i++) {
      const pid = new ObjectId();
      participants.push({ _id: pid, name: `User ${participants.length + 1}` });
    }
  }

  console.log(`Creating records for ${participants.length} users across ${augustWeeks.length} weeks...`);

  // Create one document per participant per week
  for (let weekIndex = 0; weekIndex < augustWeeks.length; weekIndex++) {
    const weekStart = augustWeeks[weekIndex];
    const weekNumber = weekIndex + 1;
    
    for (let userIndex = 0; userIndex < participants.length; userIndex++) {
      const participant = participants[userIndex];
      const name = participant.name || `User ${userIndex + 1}`;
      const weeklyData = generateWeeklyData(name, weekNumber);
      
      docs.push({
        userId: participant._id,
        name,
        team: 'USCIS-DSSS',
        contractNumber: 'USCIS-DSSS-3',
        periodOfPerformance: 'Oct 2024–Sep 2025',
        supervisor: 'Jane Manager',
        weekStart,
        status: weeklyData.status,
        summary: weeklyData.summary,
        accomplishments: weeklyData.accomplishments,
        tasksStatus: weeklyData.tasksStatus,
        issuesNeeds: weeklyData.issuesNeeds,
        nextSteps: weeklyData.nextSteps,
        hoursWorked: weeklyData.hoursWorked,
        communications: weeklyData.communications,
        createdBy: 'august-2025-seed',
        updatedBy: 'august-2025-seed',
        tags: ['august-2025', 'seed']
      });
    }
  }

  console.log(`Generated ${docs.length} weekly status documents`);

  try {
    const result = await WeeklyStatus.insertMany(docs, { ordered: false });
    console.log(`✅ Successfully inserted ${result.length} weekly status records`);
    console.log(`📊 August 2025 breakdown:`);
    console.log(`   - 40 users`);
    console.log(`   - 4 weeks (Aug 4, 11, 18, 25)`);
    console.log(`   - ${result.length} total records`);
  } catch (err) {
    if (err.writeErrors) {
      console.warn(`⚠️  Inserted with ${err.writeErrors.length} duplicate/conflict skips.`);
      console.log(`✅ Successfully inserted ${docs.length - err.writeErrors.length} records`);
    } else {
      console.error('❌ Insert error:', err.message);
    }
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((e) => {
  console.error('❌ Script error:', e);
  process.exit(1);
});
