const mongoose = require('mongoose');
const MenuSettings = require('./server/models/MenuSettings');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collibra-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataStrategyMenuItem = {
  menuId: 'data-strategy-planning',
  text: 'Data Strategy Planning',
  path: '/admin/data-strategy-planning',
  isEnabled: true,
  category: 'administration',
  order: 15,
  requiredRole: 'admin'
};

async function initializeDataStrategyMenu() {
  try {
    console.log('Initializing Data Strategy Planning menu item...');
    
    // Check if menu item already exists
    const existingItem = await MenuSettings.findOne({ menuId: dataStrategyMenuItem.menuId });
    
    if (existingItem) {
      console.log('Data Strategy Planning menu item already exists, updating...');
      await MenuSettings.findOneAndUpdate(
        { menuId: dataStrategyMenuItem.menuId },
        dataStrategyMenuItem,
        { new: true }
      );
    } else {
      console.log('Creating new Data Strategy Planning menu item...');
      await MenuSettings.create(dataStrategyMenuItem);
    }
    
    console.log('✅ Data Strategy Planning menu item initialized successfully');
    
    // List all menu items for verification
    const allMenuItems = await MenuSettings.find({}).sort({ category: 1, order: 1 });
    console.log('\n📋 Current menu items:');
    allMenuItems.forEach(item => {
      console.log(`  - ${item.text} (${item.category}) - ${item.isEnabled ? 'Enabled' : 'Disabled'}`);
    });
    
  } catch (error) {
    console.error('❌ Error initializing Data Strategy Planning menu:', error);
  } finally {
    mongoose.connection.close();
  }
}

initializeDataStrategyMenu();
