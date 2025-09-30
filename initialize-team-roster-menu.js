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

// Team Roster menu item
const teamRosterMenuItem = {
  menuId: 'team-roster',
  text: 'Team Roster',
  path: '/admin/team-roster',
  category: 'administration',
  isEnabled: true,
  order: 85,
  requiredRole: 'admin'
};

// Function to initialize Team Roster menu
const initializeTeamRosterMenu = async () => {
  try {
    console.log('🚀 Initializing Team Roster menu item...');
    
    // Check if Team Roster menu item already exists
    const existingMenuItem = await MenuSettings.findOne({ 
      menuId: 'team-roster'
    });
    
    if (existingMenuItem) {
      console.log('📋 Team Roster menu item already exists');
      
      // Update if needed
      const updated = await MenuSettings.findByIdAndUpdate(
        existingMenuItem._id,
        {
          ...teamRosterMenuItem,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      console.log('✅ Team Roster menu item updated successfully');
      console.log(`📍 Menu ID: ${updated._id}`);
      console.log(`🔗 Path: ${updated.path}`);
      console.log(`👥 Role: ${updated.requiredRole}`);
      console.log(`✨ Status: ${updated.isEnabled ? 'Enabled' : 'Disabled'}`);
      
    } else {
      // Create new menu item
      const newMenuItem = new MenuSettings(teamRosterMenuItem);
      const saved = await newMenuItem.save();
      
      console.log('✅ Team Roster menu item created successfully');
      console.log(`📍 Menu ID: ${saved._id}`);
      console.log(`🔗 Path: ${saved.path}`);
      console.log(`👥 Role: ${saved.requiredRole}`);
      console.log(`✨ Status: ${saved.isEnabled ? 'Enabled' : 'Disabled'}`);
    }
    
    // Display current menu structure
    const allMenuItems = await MenuSettings.find({ isEnabled: true })
      .sort({ category: 1, order: 1 });
    
    console.log('\n📋 Current Enabled Menu Items:');
    const menuByCategory = {};
    allMenuItems.forEach(item => {
      if (!menuByCategory[item.category]) {
        menuByCategory[item.category] = [];
      }
      menuByCategory[item.category].push(item);
    });
    
    Object.entries(menuByCategory).forEach(([category, items]) => {
      console.log(`\n🏷️  ${category}:`);
      items.forEach(item => {
        console.log(`   • ${item.text} (${item.path}) - ${item.requiredRole}`);
      });
    });
    
    console.log('\n🎯 Team Roster menu initialization completed!');
    console.log('📍 Access Team Roster at: http://localhost:3008/admin/team-roster');
    console.log('⚙️  Manage menus at: http://localhost:3008/admin/menu-management');
    
  } catch (error) {
    console.error('❌ Error initializing Team Roster menu:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await initializeTeamRosterMenu();
    console.log('\n✅ Menu initialization completed successfully!');
  } catch (error) {
    console.error('❌ Script execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { initializeTeamRosterMenu, teamRosterMenuItem };
