#!/usr/bin/env node

/**
 * Team Roster Management Script
 * 
 * This script provides comprehensive team management functionality:
 * 1. Add new team members
 * 2. Archive team members (soft delete)
 * 3. Delete team members (hard delete)
 * 4. Reactivate archived members
 * 5. Bulk operations
 * 
 * Usage: node manage-team-roster.js [command] [options]
 */

const mongoose = require('mongoose');
const TeamMember = require('./server/models/TeamMember');
const readline = require('readline');

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Add new team member
const addTeamMember = async () => {
  console.log('\n📝 Adding New Team Member');
  console.log('═'.repeat(40));
  
  try {
    // Get basic information
    const firstName = await prompt('First Name: ');
    const lastName = await prompt('Last Name: ');
    const email = await prompt('Email: ');
    const personalPhone = await prompt('Personal Phone: ');
    const role = await prompt('Role/Title: ');
    
    // Get branch selection
    console.log('\nAvailable Branches:');
    const branches = [
      'Front Office', 'Data Management', 'Data Analytics', 
      'Data Engineering', 'Data Science', 'Business Intelligence',
      'Data Governance', 'Product & Design'
    ];
    branches.forEach((branch, index) => {
      console.log(`${index + 1}. ${branch}`);
    });
    
    const branchIndex = await prompt('Select Branch (1-8): ');
    const branch = branches[parseInt(branchIndex) - 1];
    
    if (!branch) {
      throw new Error('Invalid branch selection');
    }
    
    // Generate employee ID
    const existingMembers = await TeamMember.find({}).sort({ employeeId: -1 }).limit(1);
    let nextId = 1;
    if (existingMembers.length > 0) {
      const lastId = existingMembers[0].employeeId;
      const numPart = parseInt(lastId.replace('EMP-', ''));
      nextId = numPart + 1;
    }
    const employeeId = `EMP-${nextId.toString().padStart(3, '0')}`;
    
    // Create new team member object
    const newMember = {
      employeeId,
      name: { firstName, lastName },
      email,
      personalPhone,
      role,
      title: role,
      branch,
      division: 'USCIS',
      startDate: new Date(),
      skills: [],
      capacity: {
        fteAllocation: 1.0,
        hoursPerWeek: 40,
        availableHours: 40
      },
      currentAssignments: [],
      isActive: true
    };
    
    // Save to database
    const savedMember = await TeamMember.create(newMember);
    
    console.log('\n✅ Team member added successfully!');
    console.log(`📍 Employee ID: ${savedMember.employeeId}`);
    console.log(`👤 Name: ${savedMember.name.firstName} ${savedMember.name.lastName}`);
    console.log(`📧 Email: ${savedMember.email}`);
    console.log(`🏢 Branch: ${savedMember.branch}`);
    console.log(`💼 Role: ${savedMember.role}`);
    
  } catch (error) {
    console.error('❌ Error adding team member:', error.message);
  }
};

// Archive team member (soft delete)
const archiveTeamMember = async () => {
  console.log('\n📦 Archive Team Member');
  console.log('═'.repeat(40));
  
  try {
    // Show active members
    const activeMembers = await TeamMember.find({ isActive: true }).sort({ 'name.lastName': 1 });
    
    if (activeMembers.length === 0) {
      console.log('No active team members found.');
      return;
    }
    
    console.log('\nActive Team Members:');
    activeMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name.firstName} ${member.name.lastName} (${member.employeeId}) - ${member.role}`);
    });
    
    const memberIndex = await prompt('\nSelect member to archive (number): ');
    const selectedMember = activeMembers[parseInt(memberIndex) - 1];
    
    if (!selectedMember) {
      throw new Error('Invalid member selection');
    }
    
    const reason = await prompt('Archive reason (optional): ');
    
    // Archive the member
    selectedMember.isActive = false;
    selectedMember.endDate = new Date();
    if (reason) {
      selectedMember.notes.push({
        note: `Archived: ${reason}`,
        author: 'System',
        type: 'General'
      });
    }
    
    await selectedMember.save();
    
    console.log('\n✅ Team member archived successfully!');
    console.log(`👤 ${selectedMember.name.firstName} ${selectedMember.name.lastName} has been archived`);
    console.log(`📅 Archive Date: ${selectedMember.endDate.toLocaleDateString()}`);
    
  } catch (error) {
    console.error('❌ Error archiving team member:', error.message);
  }
};

// Delete team member (hard delete)
const deleteTeamMember = async () => {
  console.log('\n🗑️  Delete Team Member (PERMANENT)');
  console.log('═'.repeat(40));
  console.log('⚠️  WARNING: This will permanently delete the team member from the database!');
  
  try {
    // Show all members (active and archived)
    const allMembers = await TeamMember.find({}).sort({ 'name.lastName': 1 });
    
    if (allMembers.length === 0) {
      console.log('No team members found.');
      return;
    }
    
    console.log('\nAll Team Members:');
    allMembers.forEach((member, index) => {
      const status = member.isActive ? '✅ Active' : '📦 Archived';
      console.log(`${index + 1}. ${member.name.firstName} ${member.name.lastName} (${member.employeeId}) - ${status}`);
    });
    
    const memberIndex = await prompt('\nSelect member to DELETE PERMANENTLY (number): ');
    const selectedMember = allMembers[parseInt(memberIndex) - 1];
    
    if (!selectedMember) {
      throw new Error('Invalid member selection');
    }
    
    const confirmation = await prompt(`⚠️  Are you sure you want to PERMANENTLY DELETE ${selectedMember.name.firstName} ${selectedMember.name.lastName}? (yes/no): `);
    
    if (confirmation.toLowerCase() !== 'yes') {
      console.log('❌ Delete operation cancelled.');
      return;
    }
    
    // Delete the member
    await TeamMember.findByIdAndDelete(selectedMember._id);
    
    console.log('\n✅ Team member deleted permanently!');
    console.log(`👤 ${selectedMember.name.firstName} ${selectedMember.name.lastName} has been removed from the database`);
    
  } catch (error) {
    console.error('❌ Error deleting team member:', error.message);
  }
};

// Reactivate archived member
const reactivateTeamMember = async () => {
  console.log('\n🔄 Reactivate Team Member');
  console.log('═'.repeat(40));
  
  try {
    // Show archived members
    const archivedMembers = await TeamMember.find({ isActive: false }).sort({ 'name.lastName': 1 });
    
    if (archivedMembers.length === 0) {
      console.log('No archived team members found.');
      return;
    }
    
    console.log('\nArchived Team Members:');
    archivedMembers.forEach((member, index) => {
      const archiveDate = member.endDate ? member.endDate.toLocaleDateString() : 'Unknown';
      console.log(`${index + 1}. ${member.name.firstName} ${member.name.lastName} (${member.employeeId}) - Archived: ${archiveDate}`);
    });
    
    const memberIndex = await prompt('\nSelect member to reactivate (number): ');
    const selectedMember = archivedMembers[parseInt(memberIndex) - 1];
    
    if (!selectedMember) {
      throw new Error('Invalid member selection');
    }
    
    // Reactivate the member
    selectedMember.isActive = true;
    selectedMember.endDate = null;
    selectedMember.notes.push({
      note: 'Reactivated from archive',
      author: 'System',
      type: 'General'
    });
    
    await selectedMember.save();
    
    console.log('\n✅ Team member reactivated successfully!');
    console.log(`👤 ${selectedMember.name.firstName} ${selectedMember.name.lastName} is now active`);
    
  } catch (error) {
    console.error('❌ Error reactivating team member:', error.message);
  }
};

// List all team members with status
const listTeamMembers = async () => {
  console.log('\n📋 Team Roster Summary');
  console.log('═'.repeat(50));
  
  try {
    const allMembers = await TeamMember.find({}).sort({ 'name.lastName': 1 });
    const activeMembers = allMembers.filter(m => m.isActive);
    const archivedMembers = allMembers.filter(m => !m.isActive);
    
    console.log(`\n✅ Active Members (${activeMembers.length}):`);
    activeMembers.forEach(member => {
      console.log(`   • ${member.name.firstName} ${member.name.lastName} (${member.employeeId}) - ${member.role} - ${member.branch}`);
    });
    
    if (archivedMembers.length > 0) {
      console.log(`\n📦 Archived Members (${archivedMembers.length}):`);
      archivedMembers.forEach(member => {
        const archiveDate = member.endDate ? member.endDate.toLocaleDateString() : 'Unknown';
        console.log(`   • ${member.name.firstName} ${member.name.lastName} (${member.employeeId}) - Archived: ${archiveDate}`);
      });
    }
    
    console.log(`\n📊 Total: ${allMembers.length} team members`);
    
  } catch (error) {
    console.error('❌ Error listing team members:', error.message);
  }
};

// Main menu
const showMenu = async () => {
  console.log('\n🎯 Team Roster Management');
  console.log('═'.repeat(30));
  console.log('1. Add New Team Member');
  console.log('2. Archive Team Member');
  console.log('3. Delete Team Member (Permanent)');
  console.log('4. Reactivate Archived Member');
  console.log('5. List All Team Members');
  console.log('6. Exit');
  
  const choice = await prompt('\nSelect an option (1-6): ');
  
  switch (choice) {
    case '1':
      await addTeamMember();
      break;
    case '2':
      await archiveTeamMember();
      break;
    case '3':
      await deleteTeamMember();
      break;
    case '4':
      await reactivateTeamMember();
      break;
    case '5':
      await listTeamMembers();
      break;
    case '6':
      console.log('\n👋 Goodbye!');
      rl.close();
      return false;
    default:
      console.log('❌ Invalid option. Please try again.');
  }
  
  return true;
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Team Roster Management System');
    console.log('═'.repeat(40));
    
    let continueRunning = true;
    while (continueRunning) {
      continueRunning = await showMenu();
    }
    
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

module.exports = {
  addTeamMember,
  archiveTeamMember,
  deleteTeamMember,
  reactivateTeamMember,
  listTeamMembers
};
