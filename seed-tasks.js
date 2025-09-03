const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./server/models/Task');
const User = require('./server/models/User');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedTasks = async () => {
  try {
    await connectDB();

    // Find or create a default user for task assignment
    let defaultUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!defaultUser) {
      // Create a default admin user if none exists
      defaultUser = await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Created default admin user');
    }

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Sample tasks to seed
    const sampleTasks = [
      {
        title: 'Review Customer Data Quality',
        description: 'Review data quality metrics and validate customer data accuracy across all customer-facing systems.',
        status: 'Open',
        priority: 'High',
        dueDate: new Date('2024-02-15'),
        assignee: defaultUser._id,
        creator: defaultUser._id,
        taskType: 'Data Quality',
        tags: ['data-quality', 'customer-data', 'validation']
      },
      {
        title: 'Certify Monthly Sales Report',
        description: 'Certify the accuracy and completeness of monthly sales report before distribution to stakeholders.',
        status: 'Open',
        priority: 'Medium',
        dueDate: new Date('2024-02-10'),
        assignee: defaultUser._id,
        creator: defaultUser._id,
        taskType: 'Governance',
        tags: ['certification', 'sales-report', 'monthly']
      },
      {
        title: 'Investigate Transaction Data Anomaly',
        description: 'Investigate unusual patterns in transaction data that were flagged by automated monitoring systems.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date('2024-02-05'),
        assignee: defaultUser._id,
        creator: defaultUser._id,
        taskType: 'Review',
        tags: ['investigation', 'anomaly', 'transactions']
      },
      {
        title: 'Update Data Governance Policies',
        description: 'Review and update data governance policies to align with new regulatory requirements.',
        status: 'Open',
        priority: 'Medium',
        dueDate: new Date('2024-02-20'),
        assignee: defaultUser._id,
        creator: defaultUser._id,
        taskType: 'Documentation',
        tags: ['governance', 'policies', 'compliance']
      },
      {
        title: 'Validate Inventory Data Accuracy',
        description: 'Perform comprehensive validation of inventory data to ensure accuracy for quarterly reporting.',
        status: 'Open',
        priority: 'High',
        dueDate: new Date('2024-02-12'),
        assignee: defaultUser._id,
        creator: defaultUser._id,
        taskType: 'Data Quality',
        tags: ['inventory', 'validation', 'quarterly']
      }
    ];

    // Insert sample tasks
    const createdTasks = await Task.insertMany(sampleTasks);
    console.log(`Successfully seeded ${createdTasks.length} tasks`);

    // Display created tasks
    console.log('\nCreated Tasks:');
    createdTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.status}) - Due: ${task.dueDate.toDateString()}`);
    });

    console.log('\nTask seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedTasks();
