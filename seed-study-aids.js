/*
 Seed Study Aids Chapters into MongoDB from JSON file.
 Usage: node seed-study-aids.js [--drop]
 Environment: MONGO_URI or defaults from server/config/db.js
*/

const path = require('path');
const fs = require('fs');
const connectDB = require('./server/config/db');
const StudyAidsChapter = require('./server/models/StudyAidsChapter');

const DATA_PATH = path.join(__dirname, 'public', 'templates', 'study-aids-chapters.json');

async function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Chapters JSON not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Chapters JSON must be an array');
  return data;
}

function validateChapter(ch) {
  const errors = [];
  if (!ch.id || typeof ch.id !== 'string') errors.push('id (string) required');
  if (typeof ch.number !== 'number') errors.push('number (number) required');
  if (!ch.title || typeof ch.title !== 'string') errors.push('title (string) required');
  if (errors.length) {
    const err = new Error(`Invalid chapter ${JSON.stringify({ id: ch.id, number: ch.number })}: ${errors.join(', ')}`);
    err.context = ch;
    throw err;
  }
}

async function seed({ drop = false } = {}) {
  await connectDB();

  if (drop) {
    console.log('Dropping StudyAidsChapter collection...');
    try {
      await StudyAidsChapter.collection.drop();
    } catch (e) {
      if (e.codeName !== 'NamespaceNotFound') throw e;
    }
  }

  const chapters = await loadJson(DATA_PATH);
  let upserted = 0;
  for (const ch of chapters) {
    validateChapter(ch);
    const filter = { $or: [{ id: ch.id }, { number: ch.number }] };
    const update = { $set: ch };
    const res = await StudyAidsChapter.updateOne(filter, update, { upsert: true });
    if (res.upsertedCount || res.modifiedCount) upserted += 1;
  }
  const total = await StudyAidsChapter.countDocuments();
  console.log(`Seed complete. Upserted/Modified: ${upserted}. Total chapters in DB: ${total}.`);
}

const args = process.argv.slice(2);
const drop = args.includes('--drop');

seed({ drop })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    if (err.context) {
      console.error('Context:', JSON.stringify(err.context, null, 2));
    }
    process.exit(1);
  });
