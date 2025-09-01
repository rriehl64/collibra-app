const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data-literacy-support');

mongoose.connection.on('open', async () => {
  try {
    const distinctTypes = await mongoose.connection.db.collection('dataassets').distinct('type');
    
    console.log('📊 DISTINCT TYPE VALUES IN DATAASSETS COLLECTION (60K+ records):');
    console.log('Total unique types found:', distinctTypes.length);
    console.log();
    distinctTypes.sort().forEach((type, index) => {
      console.log(`${index + 1}. "${type}"`);
    });
    
    const currentEnum = ['Database', 'Table', 'Report', 'Dashboard', 'Document', 'API', 'Data Warehouse', 'ETL Process'];
    
    console.log('\n🔧 CURRENT SCHEMA ENUM VALUES:');
    currentEnum.forEach((type, index) => {
      console.log(`${index + 1}. "${type}"`);
    });
    
    const missing = [];
    for (const type of distinctTypes) {
      if (!currentEnum.includes(type)) {
        missing.push(type);
      }
    }
    
    console.log('\n❌ MISSING FROM SCHEMA (causing validation errors):');
    if (missing.length > 0) {
      missing.forEach((type, index) => {
        console.log(`${index + 1}. "${type}"`);
      });
    } else {
      console.log('None - all types are covered!');
    }
    
    const allTypes = new Set([...currentEnum, ...distinctTypes]);
    const completeEnum = Array.from(allTypes).sort();
    
    console.log('\n✅ COMPLETE ENUM ARRAY NEEDED:');
    console.log('[');
    completeEnum.forEach((type, index) => {
      const comma = index < completeEnum.length - 1 ? ',' : '';
      console.log(`  '${type}'${comma}`);
    });
    console.log(']');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
});
