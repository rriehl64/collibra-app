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
    enum: ['primary', 'secondary'],
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

const initializeMenuItems = async () => {
  try {
    await connectDB();
    
    // Check if menu items already exist
    const existingCount = await MenuSettings.countDocuments();
    if (existingCount > 0) {
      console.log(`Menu items already initialized (${existingCount} items found)`);
      
      // Fix E22 Classification if it's disabled
      const e22Item = await MenuSettings.findOne({ menuId: 'e22-classification' });
      if (e22Item && !e22Item.isEnabled) {
        console.log('Re-enabling E22 Classification...');
        e22Item.isEnabled = true;
        await e22Item.save();
        console.log('✅ E22 Classification re-enabled');
      } else if (!e22Item) {
        console.log('E22 Classification not found, creating it...');
        await MenuSettings.create({
          menuId: 'e22-classification',
          text: 'E-Unify E22 Classification',
          path: '/e22-classification',
          category: 'primary',
          order: 6,
          isEnabled: true
        });
        console.log('✅ E22 Classification created');
      } else {
        console.log('E22 Classification is already enabled');
      }
      
      // Add Team Roster menu item if it doesn't exist
      const teamRosterItem = await MenuSettings.findOne({ menuId: 'team-roster' });
      if (!teamRosterItem) {
        console.log('Creating Team Roster menu item...');
        await MenuSettings.create({
          menuId: 'team-roster',
          text: 'Team Roster',
          path: '/admin/team-roster',
          category: 'primary',
          order: 16,
          isEnabled: true,
          requiredRole: 'user'
        });
        console.log('✅ Team Roster menu item created');
      } else {
        console.log('Team Roster menu item already exists');
      }

      // Add Administration menu items if they don't exist
      const adminItems = [
        { menuId: 'user-management', text: 'User Management', path: '/access/user-management', category: 'secondary', order: 1, requiredRole: 'admin' },
        { menuId: 'roles-permissions', text: 'Roles & Permissions', path: '/access/roles', category: 'secondary', order: 2, requiredRole: 'admin' },
        { menuId: 'jurisdictions', text: 'Jurisdictions', path: '/access/jurisdictions', category: 'secondary', order: 3, requiredRole: 'admin' },
        { menuId: 'menu-management', text: 'Menu Management', path: '/admin/menu-management', category: 'secondary', order: 4, requiredRole: 'admin' },
        { menuId: 'system-settings', text: 'System Settings', path: '/admin/system-settings', category: 'secondary', order: 5, requiredRole: 'admin' }
      ];
      
      let addedCount = 0;
      for (const item of adminItems) {
        const existing = await MenuSettings.findOne({ menuId: item.menuId });
        if (!existing) {
          await MenuSettings.create(item);
          console.log(`✅ Created: ${item.text}`);
          addedCount++;
        }
      }
      
      if (addedCount > 0) {
        console.log(`✅ Added ${addedCount} Administration menu items`);
      } else {
        console.log('Administration menu items already exist');
      }
      
      process.exit(0);
    }
    
    const defaultMenuItems = [
      // Primary menu items
      { menuId: 'dashboard', text: 'Dashboard', path: '/', category: 'primary', order: 1 },
      { menuId: 'e-unify-101', text: 'E-Unify 101', path: '/learn101', category: 'primary', order: 2 },
      { menuId: 'data-literacy', text: 'Data Literacy Module', path: '/data-literacy', category: 'primary', order: 3 },
      { menuId: 'national-production-dataset', text: 'National Production Dataset', path: '/national-production-dataset', category: 'primary', order: 4 },
      { menuId: 'data-governance-quality', text: 'Data Governance & Quality', path: '/data-governance-quality', category: 'primary', order: 5 },
      { menuId: 'e22-classification', text: 'E-Unify E22 Classification', path: '/e22-classification', category: 'primary', order: 6 },
      { menuId: 'data-catalog', text: 'Data Catalog', path: '/data-catalog', category: 'primary', order: 7 },
      { menuId: 'data-assets', text: 'Data Assets', path: '/data-assets', category: 'primary', order: 8 },
      { menuId: 'business-processes', text: 'Business Processes', path: '/assets/business-processes', category: 'primary', order: 9 },
      { menuId: 'data-categories', text: 'Data Categories', path: '/assets/data-categories', category: 'primary', order: 10 },
      { menuId: 'data-concepts', text: 'Data Concepts', path: '/assets/data-concepts', category: 'primary', order: 11 },
      { menuId: 'data-domains', text: 'Data Domains', path: '/assets/data-domains', category: 'primary', order: 12 },
      { menuId: 'subject-categories', text: 'Subject Categories', path: '/assets/subject-categories', category: 'primary', order: 13 },
      { menuId: 'asset-types', text: 'Asset Types', path: '/asset-types', category: 'primary', order: 14 },
      { menuId: 'data-governance', text: 'Data Governance', path: '/data-governance', category: 'primary', order: 15 },
      { menuId: 'dgvsmdm', text: 'DG vs MDM', path: '/dgvsmdm', category: 'primary', order: 16 },
      { menuId: 'data-steward-lesson', text: 'Data Steward Lesson', path: '/data-steward-lesson', category: 'primary', order: 17 },
      { menuId: 'analytics', text: 'Analytics', path: '/analytics', category: 'primary', order: 18 },
      { menuId: 'study-aids-business-analytics', text: 'Study Aids: Business Analytics', path: '/study-aids/business-analytics', category: 'primary', order: 19 },
      { menuId: 'integration', text: 'Integration', path: '/integration', category: 'primary', order: 20 },
      { menuId: 'weekly-status', text: 'Weekly Status', path: '/weekly-status', category: 'primary', order: 21 },
      { menuId: 'monthly-status', text: 'Monthly Status', path: '/monthly-status', category: 'primary', order: 22 },
      
      // Administration menu items
      { menuId: 'user-management', text: 'User Management', path: '/access/user-management', category: 'administration', order: 1, requiredRole: 'admin' },
      { menuId: 'roles-permissions', text: 'Roles & Permissions', path: '/access/roles', category: 'administration', order: 2, requiredRole: 'admin' },
      { menuId: 'jurisdictions', text: 'Jurisdictions', path: '/access/jurisdictions', category: 'administration', order: 3, requiredRole: 'admin' },
      { menuId: 'menu-management', text: 'Menu Management', path: '/admin/menu-management', category: 'administration', order: 4, requiredRole: 'admin' },
      { menuId: 'system-settings', text: 'System Settings', path: '/admin/system-settings', category: 'administration', order: 5, requiredRole: 'admin' },
      
      // Secondary menu items
      { menuId: 'about-e-unify', text: 'About E-Unify', path: '/about', category: 'secondary', order: 1 },
      { menuId: 'documentation', text: 'Documentation', path: '/docs', category: 'secondary', order: 2 },
      { menuId: 'settings', text: 'Settings', path: '/settings', category: 'secondary', order: 3 }
    ];
    
    const createdMenuItems = await MenuSettings.insertMany(defaultMenuItems);
    
    console.log(`✅ Successfully initialized ${createdMenuItems.length} menu items`);
    console.log('Menu items created:');
    createdMenuItems.forEach(item => {
      console.log(`  - ${item.text} (${item.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing menu items:', error);
    process.exit(1);
  }
};

initializeMenuItems();
