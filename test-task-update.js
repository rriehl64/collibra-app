const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./server/models/Task');

dotenv.config();

const testTaskUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');
    
    // Find the Review Customer Data Quality task
    const task = await Task.findOne({ title: 'Review Customer Data Quality' });
    if (!task) {
      console.log('Task not found');
      process.exit(1);
    }
    
    console.log('Before update:');
    console.log('- Title:', task.title);
    console.log('- Status:', task.status);
    console.log('- Priority:', task.priority);
    console.log('- Description:', task.description.substring(0, 50) + '...');
    
    // Update the task to test persistence
    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      {
        status: 'In Progress',
        priority: 'Urgent',
        description: 'UPDATED: Review data quality metrics and validate customer data accuracy across all systems. Added comprehensive validation checks and automated monitoring.'
      },
      { new: true }
    );
    
    console.log('\nAfter update:');
    console.log('- Title:', updatedTask.title);
    console.log('- Status:', updatedTask.status);
    console.log('- Priority:', updatedTask.priority);
    console.log('- Description:', updatedTask.description.substring(0, 80) + '...');
    
    console.log('\n✅ Task persistence test successful!');
    process.exit(0);
    
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  }
};

testTaskUpdate();
