#!/usr/bin/env node

/**
 * Team Roster Setup Script
 * 
 * This script sets up the complete Team Roster functionality by:
 * 1. Initializing the Team Roster menu item
 * 2. Seeding the database with team member data from the spreadsheet
 * 
 * Usage: node setup-team-roster.js
 */

const { initializeTeamRosterMenu } = require('./initialize-team-roster-menu');
const { seedTeamRoster } = require('./seed-team-roster');
const mongoose = require('mongoose');

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

// Main setup function
const setupTeamRoster = async () => {
  console.log('🚀 Starting Team Roster Complete Setup...\n');
  
  try {
    // Step 1: Initialize menu
    console.log('📋 Step 1: Initializing Team Roster menu...');
    await initializeTeamRosterMenu();
    console.log('✅ Menu initialization completed\n');
    
    // Step 2: Seed team data
    console.log('👥 Step 2: Seeding team roster data...');
    await seedTeamRoster();
    console.log('✅ Team data seeding completed\n');
    
    // Success summary
    console.log('🎉 TEAM ROSTER SETUP COMPLETE! 🎉');
    console.log('═'.repeat(50));
    console.log('📍 Team Roster URL: http://localhost:3008/admin/team-roster');
    console.log('⚙️  Menu Management: http://localhost:3008/admin/menu-management');
    console.log('🏠 Dashboard: http://localhost:3008/dashboard');
    console.log('═'.repeat(50));
    console.log('\n✨ The Team Roster is now fully functional with:');
    console.log('   • 10 team members loaded from spreadsheet data');
    console.log('   • Complete skills and capacity tracking');
    console.log('   • Click-anywhere-to-edit functionality');
    console.log('   • Real-time utilization calculations');
    console.log('   • Section 508 accessibility compliance');
    console.log('   • Admin menu integration');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await setupTeamRoster();
    console.log('\n✅ All setup operations completed successfully!');
  } catch (error) {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
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

module.exports = { setupTeamRoster };
