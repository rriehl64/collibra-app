#!/usr/bin/env node

/**
 * Documentation Center Menu Initialization Script
 * 
 * This script adds the Documentation Center menu item to the admin menu system.
 * It provides access to all JanusGraph and platform documentation.
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

// Initialize Documentation Center menu item
const initializeDocumentationMenu = async () => {
  try {
    console.log('🚀 Initializing Documentation Center menu item...');
    
    // Check if Documentation Center menu item already exists
    const existingMenuItem = await MenuSettings.findOne({ menuId: 'documentation-center' });
    
    if (existingMenuItem) {
      console.log('ℹ️  Documentation Center menu item already exists');
      console.log('   Current status:', existingMenuItem.isEnabled ? 'Enabled' : 'Disabled');
      
      // Update to ensure it's enabled
      existingMenuItem.isEnabled = true;
      await existingMenuItem.save();
      console.log('✅ Documentation Center menu item updated to Enabled');
      return;
    }
    
    // Create Documentation Center menu item
    const documentationMenuItem = new MenuSettings({
      menuId: 'documentation-center',
      text: 'Documentation Center',
      path: '/admin/documentation',
      isEnabled: true,
      category: 'administration',
      order: 86,
      requiredRole: 'admin'
    });
    
    await documentationMenuItem.save();
    
    console.log('✅ Documentation Center menu item created successfully');
    console.log('📍 Menu Details:');
    console.log('   Label: Documentation Center');
    console.log('   Path: /admin/documentation');
    console.log('   Category: Administration');
    console.log('   Role: admin (also accessible to data-steward)');
    console.log('   Status: Enabled');
    console.log('   Order: 86 (appears after JanusGraph Visualization)');
    
  } catch (error) {
    console.error('❌ Error initializing Documentation Center menu:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await initializeDocumentationMenu();
    
    console.log('\n🎯 Documentation Center menu initialization completed!');
    console.log('📋 Next steps:');
    console.log('   1. Restart the application to see the menu item');
    console.log('   2. Login as admin or data-steward');
    console.log('   3. Navigate to Administration > Documentation Center');
    console.log('   4. Browse and read all JanusGraph and platform documentation');
    console.log('\n📚 Available Documentation:');
    console.log('   • JanusGraph Documentation Index');
    console.log('   • JanusGraph Access Guide');
    console.log('   • JanusGraph Strategic Overview (25 pages)');
    console.log('   • JanusGraph Executive Briefing (25 slides)');
    console.log('   • JanusGraph Implementation Guide (40 pages)');
    console.log('   • JanusGraph DSSS3 Capabilities');
    console.log('   • Business Value Summary');
    console.log('   • Executive Decision Strategy');
    console.log('   • And more technical documentation...');
    
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

module.exports = { initializeDocumentationMenu };
