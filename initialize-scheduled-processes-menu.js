/**
 * Initialize Scheduled Processes Menu Item
 * 
 * This script adds a menu item for the Scheduled Processes feature
 * as an optional standalone menu entry in addition to the existing
 * Automated Processes scheduling tab.
 */

const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/data-literacy-support';

async function initializeScheduledProcessesMenu() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const menuCollection = db.collection('menusettings');
    
    console.log('📋 Initializing Scheduled Processes menu item...');
    
    // Check if menu item already exists
    const existingMenuItem = await menuCollection.findOne({ 
      menuId: 'scheduled-processes' 
    });
    
    if (existingMenuItem) {
      console.log('✅ Scheduled Processes menu item already exists');
      console.log('📊 Current status:', existingMenuItem.isEnabled ? 'Enabled' : 'Disabled');
      return;
    }
    
    // Create the menu item
    const menuItem = {
      menuId: 'scheduled-processes',
      title: 'Scheduled Processes',
      path: '/admin/scheduled-processes',
      icon: 'Schedule',
      section: 'Administration',
      description: 'Manage automated scheduling and cron expressions for processes',
      roles: ['admin', 'data-steward'],
      isEnabled: true,
      order: 85, // After Automated Processes (80)
      metadata: {
        feature: 'workflow-automation',
        category: 'scheduling',
        requiresAuth: true,
        adminOnly: false,
        dataGovernance: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the menu item
    const result = await menuCollection.insertOne(menuItem);
    
    if (result.acknowledged) {
      console.log('✅ Successfully created Scheduled Processes menu item');
      console.log('📋 Menu ID:', menuItem.menuId);
      console.log('📍 Path:', menuItem.path);
      console.log('👥 Roles:', menuItem.roles.join(', '));
      console.log('🔢 Order:', menuItem.order);
    } else {
      console.error('❌ Failed to create menu item');
    }
    
  } catch (error) {
    console.error('❌ Error initializing Scheduled Processes menu:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Run the initialization
if (require.main === module) {
  console.log('🚀 Starting Scheduled Processes menu initialization...');
  initializeScheduledProcessesMenu()
    .then(() => {
      console.log('✅ Scheduled Processes menu initialization completed successfully!');
      console.log('');
      console.log('📖 Usage Notes:');
      console.log('- The Scheduled Processes feature is integrated into the Automated Processes page');
      console.log('- Access via: http://localhost:3008/admin/automated-processes (Scheduling tab)');
      console.log('- This optional menu item provides direct access: http://localhost:3008/admin/scheduled-processes');
      console.log('- Requires admin or data-steward role authentication');
      console.log('- Features: Cron expression builder, schedule monitoring, execution tracking');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to initialize Scheduled Processes menu:', error);
      process.exit(1);
    });
}

module.exports = { initializeScheduledProcessesMenu };
