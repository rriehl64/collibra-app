const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI || 'mongodb://localhost:27017/collibra-app');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collibra-app');
    console.log('MongoDB Connected');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Import the E22ApplicationRequirements model
const E22ApplicationRequirements = require('./server/models/E22ApplicationRequirements');

// Default content for creating application requirements
const defaultApplicationRequirementsContent = {
  mainTitle: "E22 Application Requirements",
  mainDescription: "This section outlines the necessary forms, documents, and procedures required for E22 classification applications. Ensure all requirements are met to avoid processing delays.",
  generalRequirementsTitle: "General Filing Requirements",
  generalRequirements: [
    {
      title: "Concurrent vs. Follow-to-Join Filing",
      description: "E22 applications can be filed concurrently with the principal EB-2 petition or later as a follow-to-join case if the principal has already been approved."
    },
    {
      title: "Form Submission",
      description: "For concurrent filing, submit Form I-485 along with the principal's I-140 petition. For follow-to-join, use Form I-824 to request the beneficiary follow the principal."
    },
    {
      title: "Filing Fees",
      description: "All required filing fees must be paid in full. Fee waivers are generally not available for employment-based immigration petitions."
    },
    {
      title: "Biometrics",
      description: "All applicants must attend a biometrics appointment for fingerprinting and photograph collection after filing Form I-485."
    }
  ],
  formsTitle: "Required Forms",
  forms: [
    {
      formName: "Form I-485",
      formDescription: "Application to Register Permanent Residence or Adjust Status - Required for applicants already in the United States",
      formUrl: "https://www.uscis.gov/i-485"
    },
    {
      formName: "Form I-824",
      formDescription: "Application for Action on an Approved Application or Petition - Used for follow-to-join cases",
      formUrl: "https://www.uscis.gov/i-824"
    },
    {
      formName: "Form I-693",
      formDescription: "Report of Medical Examination and Vaccination Record - Required medical examination by a USCIS-designated civil surgeon",
      formUrl: "https://www.uscis.gov/i-693"
    },
    {
      formName: "Form I-765",
      formDescription: "Application for Employment Authorization - Optional for work permission while I-485 is pending",
      formUrl: "https://www.uscis.gov/i-765"
    }
  ],
  supportingDocsTitle: "Supporting Documentation",
  supportingDocuments: [
    {
      title: "Marriage Certificate",
      description: "Official certificate proving legal marriage to the principal EB-2 applicant",
      isRequired: true
    },
    {
      title: "Birth Certificate",
      description: "Official birth certificate with English translation if in a foreign language",
      isRequired: true
    },
    {
      title: "Passport Photos",
      description: "Recent color photographs meeting USCIS specifications (typically 2 passport-style photos)",
      isRequired: true
    },
    {
      title: "Principal's I-140 Approval Notice",
      description: "Copy of Form I-797 approval notice for the principal applicant's EB-2 petition",
      isRequired: true
    },
    {
      title: "Financial Support Evidence",
      description: "Documentation showing financial stability, such as bank statements, employment verification, or Form I-864",
      isRequired: false
    },
    {
      title: "Relationship Evidence",
      description: "Additional evidence of bona fide marriage such as joint bank accounts, lease agreements, photographs, etc.",
      isRequired: false
    }
  ],
  tipsTitle: "Application Tips and Best Practices",
  applicationTips: [
    {
      title: "Organize Documents Properly",
      description: "Submit well-organized application packages with a clear cover letter detailing all enclosed items. Use tabs or separator sheets for different sections."
    },
    {
      title: "Respond to RFEs Promptly",
      description: "If you receive a Request for Evidence (RFE), respond within the specified timeframe with all requested documentation to avoid delays or denial."
    },
    {
      title: "Keep Copies of Everything",
      description: "Maintain complete copies of all submitted forms and supporting documents for your records."
    },
    {
      title: "Maintain Legal Status",
      description: "Ensure you maintain lawful immigration status while your application is pending, unless eligible for adjustment of status under Section 245(k)."
    }
  ],
  lastUpdated: new Date(),
  updatedBy: "System"
};

// Create initial data
const createInitialData = async () => {
  try {
    // Check if collection exists
    const existingData = await E22ApplicationRequirements.findOne();
    
    if (existingData) {
      console.log('E22ApplicationRequirements collection already exists with data:');
      console.log(existingData._id);
    } else {
      // Create new application requirements document
      const newRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
      console.log('Successfully created E22ApplicationRequirements document:');
      console.log(newRequirements._id);
    }

    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating E22ApplicationRequirements data:', err);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Main function to run everything
const runSetup = async () => {
  try {
    // First connect to the database
    await connectDB();
    
    console.log('Attempting to create e22applicationrequirements collection...');
    
    // Try to get collection info to check if it exists
    const collections = await mongoose.connection.db.listCollections({name: 'e22applicationrequirements'}).toArray();
    
    if (collections.length > 0) {
      console.log('Collection already exists, dropping it first...');
      await mongoose.connection.db.dropCollection('e22applicationrequirements');
    } else {
      console.log('Collection does not exist yet, will create it');
    }
    
    // Now create the document directly using the model
    console.log('Creating sample data...');
    const newRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
    console.log('Successfully created E22ApplicationRequirements document:');
    console.log(newRequirements._id);
    
    // List all collections to verify
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('Current collections in database:');
    allCollections.forEach(c => console.log(` - ${c.name}`));
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Database connection closed');
    
  } catch (err) {
    console.error('Error in setup process:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the setup
runSetup();
