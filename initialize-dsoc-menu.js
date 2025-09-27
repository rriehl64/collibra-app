const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collibra-app';

async function initializeDSOCMenu() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const menuCollection = db.collection('menusettings');
    
    // Check if DSOC menu item already exists
    const existingItem = await menuCollection.findOne({ 
      menuId: 'data-strategy-operations-center' 
    });
    
    if (existingItem) {
      console.log('Data Strategy Operations Center menu item already exists');
      return;
    }
    
    // Add the new menu item
    const dsocMenuItem = {
      menuId: 'data-strategy-operations-center',
      label: 'Data Strategy Operations Center',
      path: '/admin/data-strategy-operations-center',
      icon: 'Dashboard',
      parentId: 'administration',
      order: 6,
      roles: ['admin', 'data-steward'],
      isEnabled: true,
      description: 'USCIS OCDO/OPQ comprehensive data strategy platform with workflow automation, real-time analytics, and government-grade data governance',
      category: 'administration',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await menuCollection.insertOne(dsocMenuItem);
    console.log('✅ Data Strategy Operations Center menu item added successfully');
    console.log('Menu ID:', result.insertedId);
    
    // Also update the administration parent menu if needed
    const adminMenu = await menuCollection.findOne({ menuId: 'administration' });
    if (!adminMenu) {
      const adminMenuItem = {
        menuId: 'administration',
        label: 'Administration',
        path: '/admin',
        icon: 'AdminPanelSettings',
        parentId: null,
        order: 100,
        roles: ['admin'],
        isEnabled: true,
        description: 'Administrative functions and system management',
        category: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await menuCollection.insertOne(adminMenuItem);
      console.log('✅ Administration parent menu item added');
    }
    
  } catch (error) {
    console.error('❌ Error initializing DSOC menu:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization
initializeDSOCMenu().catch(console.error);
