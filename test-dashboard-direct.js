const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support');

const DataAsset = require('./server/models/DataAsset');

async function testDashboardData() {
  try {
    console.log('Testing dashboard domain distribution logic...\n');
    
    // Get asset distribution by domain (same logic as dashboard controller)
    const assetsByDomain = await DataAsset.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          domain: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log(`Total unique domains: ${assetsByDomain.length}`);
    console.log('Top 10 domains by count:');
    assetsByDomain.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.domain}: ${item.count} assets`);
    });
    
    // Apply the grouping logic
    const totalAssetCount = assetsByDomain.reduce((sum, item) => sum + item.count, 0);
    const TOP_DOMAINS_LIMIT = 8;
    
    let domainDistribution = [];
    let othersCount = 0;
    
    assetsByDomain.forEach((item, index) => {
      const percentage = Math.round((item.count / totalAssetCount) * 100);
      
      if (index < TOP_DOMAINS_LIMIT && percentage >= 2) {
        // Include in top domains if it's in top N and has at least 2%
        domainDistribution.push({
          domain: item.domain,
          count: item.count,
          percentage: percentage
        });
      } else {
        // Group into "Others"
        othersCount += item.count;
      }
    });
    
    // Add "Others" category if there are remaining domains
    if (othersCount > 0) {
      const othersPercentage = Math.round((othersCount / totalAssetCount) * 100);
      domainDistribution.push({
        domain: 'Others',
        count: othersCount,
        percentage: othersPercentage
      });
    }
    
    // Sort by count descending
    domainDistribution.sort((a, b) => b.count - a.count);
    
    console.log(`\nFiltered distribution (${domainDistribution.length} items):`);
    domainDistribution.forEach((item, index) => {
      console.log(`${index + 1}. ${item.domain}: ${item.count} assets (${item.percentage}%)`);
    });
    
    console.log(`\nTotal assets: ${totalAssetCount}`);
    console.log(`Assets in "Others": ${othersCount}`);
    console.log(`Domains grouped into "Others": ${assetsByDomain.length - domainDistribution.length + 1}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testDashboardData();
