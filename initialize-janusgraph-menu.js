#!/usr/bin/env node

/**
 * JanusGraph Menu Initialization Script
 * 
 * This script adds the JanusGraph Visualization menu item to the admin menu system.
 * It integrates with the existing MenuSettings collection to provide proper navigation.
 */

const mongoose = require('mongoose');
const MenuSettings = require('./server/models/MenuSettings');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize JanusGraph menu item
const initializeJanusGraphMenu = async () => {
  try {
    console.log('🚀 Initializing JanusGraph menu item...');
    
    // Check if JanusGraph menu item already exists
    const existingMenuItem = await MenuSettings.findOne({ menuId: 'janusgraph' });
    
    if (existingMenuItem) {
      console.log('ℹ️  JanusGraph menu item already exists');
      console.log('   Current status:', existingMenuItem.isEnabled ? 'Enabled' : 'Disabled');
      return;
    }
    
    // Create JanusGraph menu item
    const janusGraphMenuItem = new MenuSettings({
      menuId: 'janusgraph',
      text: 'JanusGraph Visualization',
      path: '/admin/janusgraph',
      isEnabled: true,
      category: 'administration',
      order: 85,
      requiredRole: 'admin'
    });
    
    await janusGraphMenuItem.save();
    
    console.log('✅ JanusGraph menu item created successfully');
    console.log('📍 Menu Details:');
    console.log('   Label: JanusGraph Visualization');
    console.log('   Path: /admin/janusgraph');
    console.log('   Category: Administration');
    console.log('   Role: admin');
    console.log('   Status: Enabled');
    
  } catch (error) {
    console.error('❌ Error initializing JanusGraph menu:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await initializeJanusGraphMenu();
    
    console.log('\n🎯 JanusGraph menu initialization completed!');
    console.log('📋 Next steps:');
    console.log('   1. Restart the application to see the menu item');
    console.log('   2. Login as admin or data-steward');
    console.log('   3. Navigate to Administration > JanusGraph Visualization');
    console.log('   4. Explore the interactive graph database features');
    
  } catch (error) {
    console.error('❌ Menu initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

if (require.main === module) {
  main();
}

module.exports = { initializeJanusGraphMenu };
