const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Menu Settings Schema (matching the existing model)
const MenuSettingsSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  icon: String,
  category: String,
  subcategory: String,
  order: {
    type: Number,
    default: 0
  },
  roles: [{
    type: String,
    enum: ['admin', 'data-steward', 'user']
  }],
  isEnabled: {
    type: Boolean,
    default: true
  },
  description: String,
  isNew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const MenuSettings = mongoose.model('MenuSettings', MenuSettingsSchema);

// Initialize Automated Processes menu item
const initializeAutomatedProcessesMenu = async () => {
  try {
    await connectDB();
    
    const automatedProcessesMenuItem = {
      menuId: 'automated-processes',
      name: 'Automated Processes',
      path: '/admin/automated-processes',
      icon: 'AutomationIcon',
      category: 'Administration',
      subcategory: 'Process Management',
      order: 85, // Position after Data Strategy Operations Center
      roles: ['admin', 'data-steward'],
      isEnabled: true,
      description: 'Workflow automation and process orchestration management',
      isNew: true
    };

    // Check if menu item already exists
    const existingMenuItem = await MenuSettings.findOne({ menuId: 'automated-processes' });
    
    if (existingMenuItem) {
      console.log('Automated Processes menu item already exists, updating...');
      await MenuSettings.findOneAndUpdate(
        { menuId: 'automated-processes' },
        automatedProcessesMenuItem,
        { new: true }
      );
      console.log('✅ Automated Processes menu item updated successfully');
    } else {
      console.log('Creating new Automated Processes menu item...');
      await MenuSettings.create(automatedProcessesMenuItem);
      console.log('✅ Automated Processes menu item created successfully');
    }

    // Verify the menu item was created/updated
    const verifyMenuItem = await MenuSettings.findOne({ menuId: 'automated-processes' });
    if (verifyMenuItem) {
      console.log('📋 Menu Item Details:');
      console.log(`   ID: ${verifyMenuItem.menuId}`);
      console.log(`   Name: ${verifyMenuItem.name}`);
      console.log(`   Path: ${verifyMenuItem.path}`);
      console.log(`   Category: ${verifyMenuItem.category}`);
      console.log(`   Roles: ${verifyMenuItem.roles.join(', ')}`);
      console.log(`   Enabled: ${verifyMenuItem.isEnabled}`);
      console.log(`   Order: ${verifyMenuItem.order}`);
    }

    // Display summary of all admin menu items for context
    console.log('\n📊 Current Admin Menu Items:');
    const adminMenuItems = await MenuSettings.find({ 
      roles: 'admin',
      category: 'Administration'
    }).sort({ order: 1 });
    
    adminMenuItems.forEach(item => {
      console.log(`   ${item.order}: ${item.name} (${item.path}) - ${item.isEnabled ? 'Enabled' : 'Disabled'}`);
    });

    console.log('\n🎉 Automated Processes menu initialization completed successfully!');
    console.log('📍 Access URL: http://localhost:3008/admin/automated-processes');
    console.log('🔐 Required Roles: admin, data-steward');
    
  } catch (error) {
    console.error('❌ Error initializing Automated Processes menu:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the initialization
if (require.main === module) {
  initializeAutomatedProcessesMenu();
}

module.exports = initializeAutomatedProcessesMenu;
