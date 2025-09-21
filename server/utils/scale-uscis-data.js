#!/usr/bin/env node

/**
 * USCIS Application Data Scaling Utility
 * Generates larger datasets (5K, 50K) for performance testing and enhanced analytics
 */

const mongoose = require('mongoose');
const { generateApplications } = require('../../seed-uscis-applications');
const USCISApplication = require('../models/USCISApplication');
const connectDB = require('../config/db');

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.startTime = Date.now();
    this.checkpoints = [];
  }
  
  checkpoint(name) {
    const now = Date.now();
    const elapsed = now - this.startTime;
    const since_last = this.checkpoints.length > 0 
      ? now - this.checkpoints[this.checkpoints.length - 1].time 
      : elapsed;
    
    this.checkpoints.push({
      name,
      time: now,
      elapsed,
      since_last
    });
    
    console.log(`✓ ${name}: ${since_last}ms (total: ${elapsed}ms)`);
  }
  
  summary() {
    const total = Date.now() - this.startTime;
    console.log(`\n📊 Performance Summary:`);
    console.log(`Total Time: ${(total / 1000).toFixed(2)}s`);
    
    this.checkpoints.forEach(cp => {
      console.log(`  ${cp.name}: ${cp.since_last}ms`);
    });
  }
}

// Database optimization utilities
class DatabaseOptimizer {
  static async createOptimalIndexes() {
    console.log('🔧 Creating optimal indexes for large datasets...');
    
    const indexes = [
      // Core query patterns
      { applicationType: 1, currentStatus: 1 },
      { processingCenter: 1, receivedDate: 1 },
      { fiscalYear: 1, quarter: 1 },
      
      // Dashboard aggregations
      { currentStatus: 1, applicationType: 1, processingCenter: 1 },
      { receivedDate: 1, applicationType: 1 },
      
      // Analytics queries
      { countryOfBirth: 1, applicationType: 1 },
      { hasRFE: 1, applicationType: 1 },
      { isExpedited: 1, currentStatus: 1 },
      
      // Time-series analysis
      { receivedDate: 1, actualCompletionDate: 1 },
      { fiscalYear: 1, quarter: 1, applicationType: 1 }
    ];
    
    for (const index of indexes) {
      try {
        await USCISApplication.collection.createIndex(index);
        console.log(`  ✓ Created index: ${JSON.stringify(index)}`);
      } catch (error) {
        if (error.code !== 85) { // Index already exists
          console.log(`  ⚠️ Index creation failed: ${error.message}`);
        }
      }
    }
  }
  
  static async analyzePerformance(sampleSize = 1000) {
    console.log(`\n🔍 Analyzing query performance (${sampleSize} samples)...`);
    
    const queries = [
      // Dashboard queries
      { name: 'Status Distribution', query: () => 
        USCISApplication.aggregate([
          { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
        ])
      },
      
      // Search queries
      { name: 'Application Search', query: () =>
        USCISApplication.find({ applicationType: 'N-400' }).limit(100)
      },
      
      // Complex aggregation
      { name: 'Processing Time Analysis', query: () =>
        USCISApplication.aggregate([
          { $match: { currentStatus: 'Case Was Approved' } },
          { $group: { 
            _id: '$applicationType', 
            avgProcessingTime: { $avg: '$processingTimeBusinessDays' },
            count: { $sum: 1 }
          }}
        ])
      }
    ];
    
    for (const { name, query } of queries) {
      const start = Date.now();
      await query();
      const elapsed = Date.now() - start;
      console.log(`  ${name}: ${elapsed}ms`);
    }
  }
}

// Main scaling functions
async function scaleToFiveThousand() {
  console.log('🚀 Scaling to 5,000 USCIS applications...\n');
  const monitor = new PerformanceMonitor();
  
  try {
    // Connect to database
    await connectDB();
    monitor.checkpoint('Database Connected');
    
    // Clear existing data
    await USCISApplication.deleteMany({});
    monitor.checkpoint('Existing Data Cleared');
    
    // Generate applications in batches for memory efficiency
    const batchSize = 1000;
    const totalRecords = 5000;
    
    for (let i = 0; i < totalRecords; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalRecords - i);
      console.log(`Generating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(totalRecords/batchSize)} (${currentBatch} records)...`);
      
      const applications = generateApplications(currentBatch);
      await USCISApplication.insertMany(applications);
      
      monitor.checkpoint(`Batch ${Math.floor(i/batchSize) + 1} Inserted`);
    }
    
    // Create optimal indexes
    await DatabaseOptimizer.createOptimalIndexes();
    monitor.checkpoint('Indexes Created');
    
    // Analyze performance
    await DatabaseOptimizer.analyzePerformance();
    monitor.checkpoint('Performance Analysis Complete');
    
    // Final statistics
    const count = await USCISApplication.countDocuments();
    const stats = await USCISApplication.collection.stats();
    
    console.log(`\n✅ Successfully scaled to ${count.toLocaleString()} applications`);
    console.log(`📊 Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🗂️ Index size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    
    monitor.summary();
    
  } catch (error) {
    console.error('❌ Scaling failed:', error);
    throw error;
  }
}

async function scaleToFiftyThousand() {
  console.log('🚀 Scaling to 50,000 USCIS applications...\n');
  const monitor = new PerformanceMonitor();
  
  try {
    // Connect to database
    await connectDB();
    monitor.checkpoint('Database Connected');
    
    // Clear existing data
    await USCISApplication.deleteMany({});
    monitor.checkpoint('Existing Data Cleared');
    
    // Generate applications in smaller batches for large dataset
    const batchSize = 500; // Smaller batches for 50K records
    const totalRecords = 50000;
    
    console.log(`📈 Generating ${totalRecords.toLocaleString()} records in ${Math.ceil(totalRecords/batchSize)} batches...`);
    
    for (let i = 0; i < totalRecords; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalRecords - i);
      const batchNumber = Math.floor(i/batchSize) + 1;
      const totalBatches = Math.ceil(totalRecords/batchSize);
      
      process.stdout.write(`\rProcessing batch ${batchNumber}/${totalBatches} (${((i/totalRecords)*100).toFixed(1)}%)`);
      
      const applications = generateApplications(currentBatch);
      await USCISApplication.insertMany(applications);
      
      // Checkpoint every 10 batches
      if (batchNumber % 10 === 0) {
        monitor.checkpoint(`Batches 1-${batchNumber} Complete`);
      }
    }
    
    console.log('\n'); // New line after progress indicator
    
    // Create optimal indexes
    await DatabaseOptimizer.createOptimalIndexes();
    monitor.checkpoint('Indexes Created');
    
    // Analyze performance
    await DatabaseOptimizer.analyzePerformance();
    monitor.checkpoint('Performance Analysis Complete');
    
    // Final statistics
    const count = await USCISApplication.countDocuments();
    const stats = await USCISApplication.collection.stats();
    
    console.log(`\n✅ Successfully scaled to ${count.toLocaleString()} applications`);
    console.log(`📊 Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🗂️ Index size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Total storage: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    monitor.summary();
    
  } catch (error) {
    console.error('❌ Scaling failed:', error);
    throw error;
  }
}

async function analyzeCurrentData() {
  console.log('🔍 Analyzing current dataset...\n');
  
  try {
    await connectDB();
    
    const count = await USCISApplication.countDocuments();
    const stats = await USCISApplication.collection.stats();
    
    console.log(`📊 Current Statistics:`);
    console.log(`  Records: ${count.toLocaleString()}`);
    console.log(`  Data Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Index Size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Average Document Size: ${stats.avgObjSize} bytes`);
    console.log(`  Indexes: ${stats.nindexes}`);
    
    await DatabaseOptimizer.analyzePerformance();
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case '5k':
      case '5000':
        await scaleToFiveThousand();
        break;
        
      case '50k':
      case '50000':
        await scaleToFiftyThousand();
        break;
        
      case 'analyze':
      case 'stats':
        await analyzeCurrentData();
        break;
        
      case 'indexes':
        await connectDB();
        await DatabaseOptimizer.createOptimalIndexes();
        console.log('✅ Indexes created successfully');
        break;
        
      default:
        console.log('USCIS Application Data Scaling Utility\n');
        console.log('Usage: node scale-uscis-data.js [command]\n');
        console.log('Commands:');
        console.log('  5k, 5000     Scale to 5,000 applications');
        console.log('  50k, 50000   Scale to 50,000 applications');
        console.log('  analyze      Analyze current dataset');
        console.log('  indexes      Create optimal indexes');
        console.log('  stats        Show current statistics');
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  scaleToFiveThousand,
  scaleToFiftyThousand,
  analyzeCurrentData,
  DatabaseOptimizer
};
