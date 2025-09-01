/*
 Seed ~40 Weekly Status entries for a given week.
 Usage:
   node seed-weekly-status.js [--team USCIS-DSSS] [--contract USCIS-DSSS-3] [--week 2025-08-25]
 Notes:
   - If users exist, it will use them; otherwise it will generate placeholder ObjectIds and names.
   - week defaults to the most recent Monday.
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
  const opts = { team: 'USCIS-DSSS', contract: 'USCIS-DSSS-3', week: null, count: 40 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--team') opts.team = args[++i];
    else if (args[i] === '--contract') opts.contract = args[++i];
    else if (args[i] === '--week') opts.week = args[++i];
    else if (args[i] === '--count') opts.count = parseInt(args[++i], 10) || 40;
  }
  return opts;
}

function normalizeToIsoMonday(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);
  return monday;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function sampleData(name) {
  const rag = pick(['green', 'yellow', 'red']);
  const accomplishments = [
    'Delivered UI standardization for E22 screens',
    'Updated API endpoints for compliance checks',
    'Coordinated with COR on deliverable timeline',
    'Completed accessibility remediation for forms',
    'Auth + security config improvements deployed'
  ];
  const tasksStatus = [
    'In-progress tasks tracked and near completion',
    'On schedule per PWS milestones',
    'Dependencies identified; no blockers currently',
    'Validations added; ready for review',
    'QA passed in dev; staging next'
  ];
  const issuesNeeds = [
    'None',
    'Awaiting data pull approvals',
    'Need COR feedback on scope detail',
    'Minor environment instability observed',
    'Scheduling availability for review session'
  ];
  const nextSteps = [
    'Finalize tests and promote to staging',
    'Prepare demo for weekly review',
    'Draft documentation updates for PMO',
    'Complete refactoring of shared components',
    'Implement analytics dashboard tiles'
  ];
  const comms = [
    'Met with COR; alignment confirmed',
    'Attended PMO sync; shared updates',
    'Coordinated with data stewards',
    'Shared risk update with supervisor',
    'Reviewed acceptance criteria with team'
  ];

  return {
    status: rag,
    summary: `Weekly summary for ${name}`,
    accomplishments: pick(accomplishments),
    tasksStatus: pick(tasksStatus),
    issuesNeeds: pick(issuesNeeds),
    nextSteps: pick(nextSteps),
    hoursWorked: Math.floor(35 + Math.random() * 10),
    communications: pick(comms)
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
  const { team, contract, week, count } = parseArgs();
  await connectDB();

  const weekStart = normalizeToIsoMonday(week);
  console.log('Seeding Weekly Status for weekStart (UTC Monday):', weekStart.toISOString());

  // Ensure unique index exists so we truly have one entry per user per week
  try {
    await WeeklyStatus.collection.createIndex({ userId: 1, weekStart: 1 }, { unique: true });
  } catch (e) {
    // ignore if already exists or collection just created
  }

  const users = await getUsers(count);
  const docs = [];

  // Build a participant list of exactly `count` unique userIds (real users first, then placeholders)
  const participants = [];
  for (let i = 0; i < Math.min(users.length, count); i++) {
    participants.push({ _id: users[i]._id, name: users[i].name });
  }
  if (participants.length < count) {
    const needed = count - participants.length;
    for (let i = 0; i < needed; i++) {
      // Generate placeholder userIds; deterministic by index within this run is not necessary
      const pid = new ObjectId();
      participants.push({ _id: pid, name: `User ${participants.length + 1}` });
    }
  }

  // Create one document per participant for the specified week
  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    const name = p.name || `User ${i + 1}`;
    const supervisor = 'Jane Manager';
    const base = sampleData(name);
    docs.push({
      userId: p._id,
      name,
      team,
      contractNumber: contract,
      periodOfPerformance: 'Oct 2024–Sep 2025',
      supervisor,
      weekStart,
      status: base.status,
      summary: base.summary,
      accomplishments: base.accomplishments,
      tasksStatus: base.tasksStatus,
      issuesNeeds: base.issuesNeeds,
      nextSteps: base.nextSteps,
      hoursWorked: base.hoursWorked,
      communications: base.communications,
      createdBy: 'seed-script',
      updatedBy: 'seed-script',
      tags: ['seed']
    });
  }

  // Remove duplicates for same userId + weekStart to satisfy unique index
  const map = new Map();
  for (const d of docs) {
    const key = `${d.userId.toString()}_${weekStart.toISOString()}`;
    if (!map.has(key)) map.set(key, d);
  }
  const uniqueDocs = Array.from(map.values());

  try {
    const result = await WeeklyStatus.insertMany(uniqueDocs, { ordered: false });
    console.log(`Inserted ${result.length} weekly status documents.`);
  } catch (err) {
    if (err.writeErrors) {
      console.warn(`Inserted with ${err.writeErrors.length} duplicate/conflict skips.`);
    } else {
      console.error('Insert error:', err.message);
    }
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
