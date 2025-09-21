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

const addMissingMenuItems = async () => {
  try {
    await connectDB();
    
    // Menu items to add
    const newMenuItems = [
      {
        menuId: 'open-tasks',
        text: 'Open Tasks',
        path: '/tasks',
        category: 'primary',
        order: 23,
        isEnabled: true,
        requiredRole: 'user'
      },
      {
        menuId: 'federal-data-strategy',
        text: 'Federal Data Strategy',
        path: '/federal-data-strategy',
        category: 'primary',
        order: 24,
        isEnabled: true,
        requiredRole: 'user'
      }
    ];
    
    let addedCount = 0;
    
    for (const item of newMenuItems) {
      const existing = await MenuSettings.findOne({ menuId: item.menuId });
      if (!existing) {
        await MenuSettings.create(item);
        console.log(`✅ Created: ${item.text} at ${item.path}`);
        addedCount++;
      } else {
        console.log(`⚠️  Already exists: ${item.text}`);
      }
    }
    
    if (addedCount > 0) {
      console.log(`\n✅ Successfully added ${addedCount} menu items to the sidenav`);
    } else {
      console.log('\n✅ All menu items already exist');
    }
    
    // List all current menu items for verification
    const allItems = await MenuSettings.find().sort({ category: 1, order: 1 });
    console.log('\n📋 Current menu items:');
    
    const categories = ['primary', 'administration', 'secondary'];
    for (const category of categories) {
      const categoryItems = allItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        console.log(`\n${category.toUpperCase()}:`);
        categoryItems.forEach(item => {
          const status = item.isEnabled ? '✅' : '❌';
          const role = item.requiredRole !== 'user' ? ` (${item.requiredRole})` : '';
          console.log(`  ${status} ${item.text}${role} → ${item.path}`);
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding menu items:', error);
    process.exit(1);
  }
};

addMissingMenuItems();
