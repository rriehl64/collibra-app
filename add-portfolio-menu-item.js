const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collibra-app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Menu Settings Schema
const menuSettingsSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['primary', 'secondary', 'administration'],
    default: 'primary'
  },
  order: {
    type: Number,
    default: 0
  },
  requiredRole: {
    type: String,
    enum: ['user', 'data-steward', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

const MenuSettings = mongoose.model('MenuSettings', menuSettingsSchema);

const addPortfolioMenuItem = async () => {
  try {
    await connectDB();
    
    // Check if Portfolio menu item already exists
    const existingPortfolio = await MenuSettings.findOne({ menuId: 'portfolio' });
    
    if (existingPortfolio) {
      console.log('Portfolio menu item already exists');
      console.log(`Current status: ${existingPortfolio.isEnabled ? 'Enabled' : 'Disabled'}`);
      
      // Ensure it's enabled
      if (!existingPortfolio.isEnabled) {
        existingPortfolio.isEnabled = true;
        await existingPortfolio.save();
        console.log('✅ Portfolio menu item enabled');
      }
      
      process.exit(0);
    }
    
    // Create Portfolio menu item
    const portfolioMenuItem = {
      menuId: 'portfolio',
      text: 'Portfolio',
      path: '/portfolio',
      category: 'primary',
      order: 2, // Place it after Dashboard (order 1)
      isEnabled: true,
      requiredRole: 'user' // Available to all authenticated users
    };
    
    const createdItem = await MenuSettings.create(portfolioMenuItem);
    
    console.log('✅ Successfully added Portfolio menu item');
    console.log(`   - Text: ${createdItem.text}`);
    console.log(`   - Path: ${createdItem.path}`);
    console.log(`   - Category: ${createdItem.category}`);
    console.log(`   - Order: ${createdItem.order}`);
    console.log(`   - Required Role: ${createdItem.requiredRole}`);
    console.log(`   - Enabled: ${createdItem.isEnabled}`);
    
    // Update order of other menu items to make room
    console.log('Updating order of existing menu items...');
    
    // Move all primary menu items with order >= 2 up by 1
    const result = await MenuSettings.updateMany(
      { 
        category: 'primary', 
        order: { $gte: 2 },
        menuId: { $ne: 'portfolio' } // Don't update the portfolio item we just created
      },
      { $inc: { order: 1 } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} existing menu items`);
    
    // Display current menu structure
    console.log('\n📋 Current Primary Menu Structure:');
    const allPrimaryItems = await MenuSettings.find({ category: 'primary' }).sort({ order: 1 });
    allPrimaryItems.forEach(item => {
      console.log(`   ${item.order}. ${item.text} (${item.path}) - ${item.isEnabled ? 'Enabled' : 'Disabled'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding Portfolio menu item:', error);
    process.exit(1);
  }
};

addPortfolioMenuItem();
