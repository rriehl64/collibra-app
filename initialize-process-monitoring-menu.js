const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// MenuSettings Schema (matching the existing model)
const menuSettingsSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  label: {
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
  description: String,
  roles: [String],
  isEnabled: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  parentId: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const MenuSettings = mongoose.model('MenuSettings', menuSettingsSchema);

// Initialize Process Monitoring menu
const initializeProcessMonitoringMenu = async () => {
  try {
    console.log('🔧 Initializing Process Monitoring menu...');
    
    // Connect to database
    await connectDB();
    
    // Check if Process Monitoring menu already exists
    const existingMenu = await MenuSettings.findOne({ menuId: 'process-monitoring' });
    
    if (existingMenu) {
      console.log('📋 Process Monitoring menu already exists. Updating...');
      
      // Update existing menu item
      await MenuSettings.findOneAndUpdate(
        { menuId: 'process-monitoring' },
        {
          label: 'Process Monitoring',
          path: '/admin/process-monitoring',
          icon: 'MonitorHeart',
          category: 'Administration',
          subcategory: 'Monitoring',
          description: 'Real-time monitoring, alerts, and performance metrics for automated processes',
          roles: ['admin', 'data-steward'],
          isEnabled: true,
          order: 85,
          metadata: {
            features: [
              'Real-time Process Monitoring',
              'Performance Metrics Dashboard',
              'Alert Management System',
              'SLA Tracking and Compliance',
              'Health Check Configuration',
              'Custom Metrics Support',
              'Maintenance Window Management',
              'Dependency Monitoring'
            ],
            version: '1.0.0',
            lastUpdated: new Date(),
            accessLevel: 'admin',
            moduleType: 'monitoring',
            integrations: ['automated-processes', 'scheduled-processes'],
            compliance: ['Section 508', 'WCAG 2.0', 'USCIS Standards'],
            businessValue: [
              'Proactive Issue Detection',
              'Reduced Downtime',
              'Performance Optimization',
              'SLA Compliance Tracking',
              'Automated Alert Management',
              'Operational Visibility'
            ]
          }
        },
        { new: true }
      );
      
      console.log('✅ Process Monitoring menu updated successfully!');
    } else {
      console.log('🆕 Creating new Process Monitoring menu item...');
      
      // Create new menu item
      const processMonitoringMenu = await MenuSettings.create({
        menuId: 'process-monitoring',
        label: 'Process Monitoring',
        path: '/admin/process-monitoring',
        icon: 'MonitorHeart',
        category: 'Administration',
        subcategory: 'Monitoring',
        description: 'Real-time monitoring, alerts, and performance metrics for automated processes',
        roles: ['admin', 'data-steward'],
        isEnabled: true,
        order: 85,
        metadata: {
          features: [
            'Real-time Process Monitoring',
            'Performance Metrics Dashboard',
            'Alert Management System',
            'SLA Tracking and Compliance',
            'Health Check Configuration',
            'Custom Metrics Support',
            'Maintenance Window Management',
            'Dependency Monitoring'
          ],
          version: '1.0.0',
          lastUpdated: new Date(),
          accessLevel: 'admin',
          moduleType: 'monitoring',
          integrations: ['automated-processes', 'scheduled-processes'],
          compliance: ['Section 508', 'WCAG 2.0', 'USCIS Standards'],
          businessValue: [
            'Proactive Issue Detection',
            'Reduced Downtime',
            'Performance Optimization',
            'SLA Compliance Tracking',
            'Automated Alert Management',
            'Operational Visibility'
          ]
        }
      });
      
      console.log('✅ Process Monitoring menu created successfully!');
      console.log(`📋 Menu ID: ${processMonitoringMenu.menuId}`);
    }
    
    // Verify the menu was created/updated
    const verifyMenu = await MenuSettings.findOne({ menuId: 'process-monitoring' });
    
    if (verifyMenu) {
      console.log('\n🔍 Menu Verification:');
      console.log('=====================');
      console.log(`Label: ${verifyMenu.label}`);
      console.log(`Path: ${verifyMenu.path}`);
      console.log(`Category: ${verifyMenu.category}`);
      console.log(`Subcategory: ${verifyMenu.subcategory}`);
      console.log(`Roles: ${verifyMenu.roles.join(', ')}`);
      console.log(`Enabled: ${verifyMenu.isEnabled}`);
      console.log(`Order: ${verifyMenu.order}`);
      console.log(`Features: ${verifyMenu.metadata.features.length} features defined`);
    }
    
    // Check total menu count
    const totalMenus = await MenuSettings.countDocuments();
    console.log(`\n📊 Total menu items in database: ${totalMenus}`);
    
    // List all admin menus for reference
    const adminMenus = await MenuSettings.find({ 
      category: 'Administration',
      isEnabled: true 
    }).sort({ order: 1 }).select('label path order');
    
    console.log('\n📋 Administration Menu Items:');
    console.log('==============================');
    adminMenus.forEach(menu => {
      console.log(`${menu.order}: ${menu.label} (${menu.path})`);
    });
    
    console.log('\n🔗 Access Process Monitoring at:');
    console.log('http://localhost:3008/admin/process-monitoring');
    
    console.log('\n🎉 Process Monitoring menu initialization completed!');
    
  } catch (error) {
    console.error('❌ Error initializing Process Monitoring menu:', error);
    
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - menu might already exist with different case or spacing');
    }
    
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the initialization
if (require.main === module) {
  initializeProcessMonitoringMenu();
}

module.exports = { initializeProcessMonitoringMenu };
