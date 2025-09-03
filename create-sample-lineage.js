const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Import models
const DataAsset = require('./server/models/DataAsset');
const DataLineage = require('./server/models/DataLineage');

const createSampleLineage = async () => {
  try {
    await connectDB();
    
    console.log('Creating sample lineage relationships...');
    
    // Get some existing data assets
    const assets = await DataAsset.find().limit(10);
    
    if (assets.length < 2) {
      console.log('Not enough data assets found. Please run the data generation script first.');
      process.exit(1);
    }
    
    console.log(`Found ${assets.length} assets to create lineage for`);
    
    // Sample lineage relationships
    const lineageRelationships = [
      {
        sourceAssetId: assets[0]._id,
        targetAssetId: assets[1]._id,
        relationshipType: 'feeds_into',
        strength: 0.9,
        metadata: {
          transformationType: 'ETL',
          frequency: 'daily',
          dataVolume: '1GB',
          qualityScore: 0.95,
          businessRules: ['Data validation', 'Format standardization'],
          technicalNotes: 'Automated daily ETL process'
        },
        createdBy: 'system'
      },
      {
        sourceAssetId: assets[1]._id,
        targetAssetId: assets[2]._id,
        relationshipType: 'transforms_to',
        strength: 0.8,
        metadata: {
          transformationType: 'Aggregation',
          frequency: 'weekly',
          dataVolume: '500MB',
          qualityScore: 0.88,
          businessRules: ['Weekly aggregation', 'Outlier removal'],
          technicalNotes: 'Weekly summary report generation'
        },
        createdBy: 'system'
      }
    ];
    
    // Add more relationships if we have enough assets
    if (assets.length >= 4) {
      lineageRelationships.push(
        {
          sourceAssetId: assets[2]._id,
          targetAssetId: assets[3]._id,
          relationshipType: 'derived_from',
          strength: 0.7,
          metadata: {
            transformationType: 'Calculation',
            frequency: 'real-time',
            dataVolume: '100MB',
            qualityScore: 0.92,
            businessRules: ['Real-time calculations', 'Business logic application'],
            technicalNotes: 'Real-time derived metrics'
          },
          createdBy: 'system'
        }
      );
    }
    
    if (assets.length >= 5) {
      lineageRelationships.push(
        {
          sourceAssetId: assets[0]._id,
          targetAssetId: assets[4]._id,
          relationshipType: 'copies_to',
          strength: 1.0,
          metadata: {
            transformationType: 'Replication',
            frequency: 'real-time',
            dataVolume: '1GB',
            qualityScore: 1.0,
            businessRules: ['Exact copy', 'No transformation'],
            technicalNotes: 'Real-time replication for backup'
          },
          createdBy: 'system'
        }
      );
    }
    
    // Create lineage relationships
    for (const relationship of lineageRelationships) {
      try {
        // Check if relationship already exists
        const existing = await DataLineage.findOne({
          sourceAssetId: relationship.sourceAssetId,
          targetAssetId: relationship.targetAssetId
        });
        
        if (!existing) {
          await DataLineage.create(relationship);
          console.log(`Created lineage: ${assets.find(a => a._id.equals(relationship.sourceAssetId))?.name} -> ${assets.find(a => a._id.equals(relationship.targetAssetId))?.name}`);
        } else {
          console.log(`Lineage already exists: ${assets.find(a => a._id.equals(relationship.sourceAssetId))?.name} -> ${assets.find(a => a._id.equals(relationship.targetAssetId))?.name}`);
        }
      } catch (error) {
        console.error('Error creating lineage relationship:', error);
      }
    }
    
    // Create some reverse relationships for more complex lineage
    if (assets.length >= 6) {
      const reverseRelationships = [
        {
          sourceAssetId: assets[5]._id,
          targetAssetId: assets[0]._id,
          relationshipType: 'feeds_into',
          strength: 0.6,
          metadata: {
            transformationType: 'ETL',
            frequency: 'monthly',
            dataVolume: '2GB',
            qualityScore: 0.85,
            businessRules: ['Monthly data import', 'Data cleansing'],
            technicalNotes: 'Monthly batch import from external source'
          },
          createdBy: 'system'
        }
      ];
      
      for (const relationship of reverseRelationships) {
        try {
          const existing = await DataLineage.findOne({
            sourceAssetId: relationship.sourceAssetId,
            targetAssetId: relationship.targetAssetId
          });
          
          if (!existing) {
            await DataLineage.create(relationship);
            console.log(`Created reverse lineage: ${assets.find(a => a._id.equals(relationship.sourceAssetId))?.name} -> ${assets.find(a => a._id.equals(relationship.targetAssetId))?.name}`);
          }
        } catch (error) {
          console.error('Error creating reverse lineage relationship:', error);
        }
      }
    }
    
    // Display summary
    const totalLineage = await DataLineage.countDocuments({ isActive: true });
    console.log(`\n✅ Sample lineage creation completed!`);
    console.log(`📊 Total active lineage relationships: ${totalLineage}`);
    
    // Show some example lineage
    const sampleLineage = await DataLineage.find({ isActive: true })
      .populate('sourceAssetId', 'name type domain')
      .populate('targetAssetId', 'name type domain')
      .limit(5);
    
    console.log('\n📋 Sample lineage relationships:');
    sampleLineage.forEach((lineage, index) => {
      console.log(`${index + 1}. ${lineage.sourceAssetId.name} (${lineage.sourceAssetId.type}) -> ${lineage.targetAssetId.name} (${lineage.targetAssetId.type})`);
      console.log(`   Relationship: ${lineage.relationshipType}, Strength: ${lineage.strength}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample lineage:', error);
    process.exit(1);
  }
};

createSampleLineage();
