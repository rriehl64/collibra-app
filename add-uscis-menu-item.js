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

const addUSCISMenuItem = async () => {
  try {
    await connectDB();
    
    // USCIS Application Tracking menu item
    const uscisMenuItem = {
      menuId: 'uscis-application-tracking',
      text: 'USCIS Application Tracking',
      path: '/admin/uscis-application-tracking',
      category: 'administration',
      order: 50,
      isEnabled: true,
      requiredRole: 'admin'
    };
    
    // Check if it already exists
    const existing = await MenuSettings.findOne({ menuId: uscisMenuItem.menuId });
    
    if (!existing) {
      await MenuSettings.create(uscisMenuItem);
      console.log(`✅ Created: ${uscisMenuItem.text} at ${uscisMenuItem.path}`);
      console.log('🎯 USCIS Application Tracking has been added to the admin menu!');
    } else {
      console.log(`⚠️  Already exists: ${uscisMenuItem.text}`);
      
      // Update if needed
      await MenuSettings.findOneAndUpdate(
        { menuId: uscisMenuItem.menuId },
        { 
          text: uscisMenuItem.text,
          path: uscisMenuItem.path,
          category: uscisMenuItem.category,
          order: uscisMenuItem.order,
          isEnabled: true,
          requiredRole: uscisMenuItem.requiredRole
        }
      );
      console.log('✅ Updated existing menu item');
    }
    
    // List all administration menu items for verification
    const adminItems = await MenuSettings.find({ category: 'administration' }).sort({ order: 1 });
    console.log('\n📋 Current administration menu items:');
    
    adminItems.forEach(item => {
      const status = item.isEnabled ? '✅' : '❌';
      const role = item.requiredRole !== 'user' ? ` (${item.requiredRole})` : '';
      console.log(`  ${status} ${item.text}${role} → ${item.path}`);
    });
    
    console.log('\n🚀 Menu updated! Refresh your browser to see the USCIS Application Tracking in the admin menu.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding USCIS menu item:', error);
    process.exit(1);
  }
};

addUSCISMenuItem();
