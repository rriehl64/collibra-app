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

// Import the model
const FederalDataStrategy = require('./server/models/FederalDataStrategy');

const initializeFederalDataStrategy = async () => {
  try {
    await connectDB();
    
    // Check if data already exists
    const existingStrategy = await FederalDataStrategy.findOne({ isActive: true });
    if (existingStrategy) {
      console.log('✅ Federal Data Strategy already exists');
      console.log(`   Title: ${existingStrategy.title}`);
      console.log(`   Version: ${existingStrategy.version}`);
      console.log(`   Last Updated: ${existingStrategy.updatedAt}`);
      process.exit(0);
    }
    
    console.log('🚀 Creating default Federal Data Strategy content...');
    
    const defaultStrategy = new FederalDataStrategy({
      title: '2020 Federal Data Strategy Framework',
      subtitle: 'A comprehensive 10-year vision for how the U.S. Federal Government will leverage data to deliver on its mission, serve the public, and steward resources in a secure, ethical, and effective manner.',
      tags: ['10-Year Vision', 'Federal Government', 'Data Strategy'],
      
      missionTitle: 'Mission and Vision',
      missionText: 'The mission is to fully leverage federal data for mission, service, and public good by fostering practices of ethical governance, conscious design, and a learning culture throughout federal agencies.',
      
      principlesTitle: 'Ten Operating Principles',
      principlesDescription: 'The framework is built on ten operating principles, grouped into three foundational categories:',
      
      principles: [
        {
          category: 'Ethical Governance',
          description: 'Uphold ethics, exercise responsibility, and promote transparency in all data practices.',
          color: '#1976d2',
          items: [
            { text: 'Exercise Responsibility', order: 1 },
            { text: 'Uphold Ethics', order: 2 },
            { text: 'Promote Transparency', order: 3 }
          ],
          order: 1
        },
        {
          category: 'Conscious Design',
          description: 'Ensure relevance, harness existing data, anticipate future uses, and demonstrate responsiveness to stakeholders.',
          color: '#388e3c',
          items: [
            { text: 'Ensure Relevance', order: 1 },
            { text: 'Harness Existing Data', order: 2 },
            { text: 'Anticipate Future Uses', order: 3 },
            { text: 'Demonstrate Responsiveness', order: 4 }
          ],
          order: 2
        },
        {
          category: 'Learning Culture',
          description: 'Invest in ongoing learning, develop data leaders, and practice accountability across federal workforces.',
          color: '#f57c00',
          items: [
            { text: 'Invest in Learning', order: 1 },
            { text: 'Develop Data Leaders', order: 2 },
            { text: 'Practice Accountability', order: 3 }
          ],
          order: 3
        }
      ],
      
      practicesTitle: 'Core Practices',
      practicesDescription: 'Forty aspirational best practices guide agencies in managing and using federal and federally-sponsored data:',
      
      corePractices: [
        {
          title: 'Value and Promote Data Use',
          color: '#9c27b0',
          practices: [
            { text: 'Identify critical agency questions', order: 1 },
            { text: 'Balance stakeholder needs', order: 2 },
            { text: 'Use data in decision-making', order: 3 },
            { text: 'Champion data use', order: 4 }
          ],
          order: 1
        },
        {
          title: 'Govern and Protect Data',
          color: '#d32f2f',
          practices: [
            { text: 'Prioritize data governance', order: 1 },
            { text: 'Protect confidentiality', order: 2 },
            { text: 'Ensure data authenticity', order: 3 },
            { text: 'Maintain thorough documentation and inventories', order: 4 }
          ],
          order: 2
        },
        {
          title: 'Enable Efficient, Appropriate Use',
          color: '#1976d2',
          practices: [
            { text: 'Increase workforce capacity', order: 1 },
            { text: 'Design data for reuse', order: 2 },
            { text: 'Communicate planned data uses', order: 3 },
            { text: 'Diversify access methods for greater impact', order: 4 }
          ],
          order: 3
        }
      ],
      
      implementationTitle: 'Implementation and Actions',
      implementationDescription: 'All executive branch agencies are required to implement the strategy through annual government-wide action plans, which prioritize steps for each year. The first year (2020) contained 20 specific, measurable actions focused on establishing foundational practices and shared solutions.',
      
      implementationActions: [
        { text: 'Launch Chief Data Officer Council', order: 1 },
        { text: 'Improve AI data resources', order: 2 },
        { text: 'Publish open data inventories', order: 3 },
        { text: 'Establish foundational practices', order: 4 },
        { text: 'Develop shared solutions', order: 5 },
        { text: 'Create annual government-wide action plans', order: 6 }
      ],
      
      resourcesTitle: 'Resources',
      resourcesDescription: 'The full framework, details on principles, best practices, and yearly action plans are available at the official Federal Data Strategy website.',
      resourcesUrl: 'https://strategy.data.gov',
      
      isActive: true,
      version: '1.0',
      lastUpdatedBy: 'System'
    });
    
    const savedStrategy = await defaultStrategy.save();
    
    console.log('✅ Federal Data Strategy initialized successfully!');
    console.log(`   ID: ${savedStrategy._id}`);
    console.log(`   Title: ${savedStrategy.title}`);
    console.log(`   Principles: ${savedStrategy.principles.length}`);
    console.log(`   Core Practices: ${savedStrategy.corePractices.length}`);
    console.log(`   Implementation Actions: ${savedStrategy.implementationActions.length}`);
    console.log('');
    console.log('🌐 You can now access the editable Federal Data Strategy at:');
    console.log('   http://localhost:3008/federal-data-strategy');
    console.log('');
    console.log('📝 Features available:');
    console.log('   • Click anywhere to edit text content');
    console.log('   • Add/edit/delete principle items');
    console.log('   • Add/edit/delete practice items');
    console.log('   • All changes are saved to MongoDB');
    console.log('   • Section 508 compliant interface');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Federal Data Strategy:', error);
    process.exit(1);
  }
};

initializeFederalDataStrategy();
