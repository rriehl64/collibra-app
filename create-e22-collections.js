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

// Import the models
const E22ApplicationRequirements = require('./server/models/E22ApplicationRequirements');
const E22Overview = require('./server/models/E22Overview');

// Default content for E22 Application Requirements
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

// Default content for E22 Overview - structure matches E22Overview model schema
const defaultOverviewContent = {
  mainTitle: "E-22 Classification Overview",
  mainDescription: "The E-22 classification is designed for spouses and children of principal EB-2 applicants. This classification allows family members to obtain permanent residency based on the principal applicant's approved EB-2 petition.",
  featuresTitle: "Key Features of E22 Classification",
  keyFeatures: [
    {
      title: "Derivative Status",
      description: "E22 beneficiaries derive their status from the principal EB-2 applicant and do not need to independently qualify for the EB-2 category."
    },
    {
      title: "Priority Date Sharing",
      description: "E22 applicants share the priority date of the principal EB-2 petition, which determines their place in line for visa number allocation."
    },
    {
      title: "Family Unity",
      description: "The E-22 classification serves to keep families together by allowing spouses and unmarried children under 21 years of age to join the principal EB-2 beneficiary."
    },
    {
      title: "Permanent Status",
      description: "E22 classification provides lawful permanent resident status, commonly known as a green card, which allows recipients to live and work permanently in the United States."
    }
  ],
  importanceTitle: "Importance in the Immigration System",
  importanceDescription: [
    {
      paragraph: "The E22 classification is an essential component of the U.S. employment-based immigration system. It ensures that talented individuals who qualify for EB-2 green cards can bring their spouses and children with them, maintaining family unity while meeting U.S. workforce needs."
    },
    {
      paragraph: "Without the E22 classification, many highly qualified professionals might be reluctant to immigrate to the United States if it meant separation from their immediate family members."
    },
    {
      paragraph: "This classification reflects the understanding that successful immigration outcomes often depend on the ability of families to remain together, particularly for high-skilled immigrants who make significant contributions to the U.S. economy and society."
    }
  ],
  lastUpdated: new Date(),
  updatedBy: "System"
};

// Create collections and insert data
const createCollections = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Process E22ApplicationRequirements
    console.log('\nProcessing E22ApplicationRequirements collection...');
    try {
      // Check if collection exists with data
      const appRequirementsCount = await mongoose.connection.db.collection('e22applicationrequirements').countDocuments();
      console.log(`Found ${appRequirementsCount} documents in e22applicationrequirements collection`);
      
      if (appRequirementsCount === 0) {
        console.log('Creating E22ApplicationRequirements data...');
        const appRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
        console.log('Created E22ApplicationRequirements document with ID:', appRequirements._id);
      } else {
        console.log('E22ApplicationRequirements data already exists');
      }
    } catch (err) {
      console.log('Error with E22ApplicationRequirements collection, creating it...');
      const appRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
      console.log('Created E22ApplicationRequirements document with ID:', appRequirements._id);
    }
    
    // Process E22Overview
    console.log('\nProcessing E22Overview collection...');
    try {
      // Check if collection exists with data
      const overviewCount = await mongoose.connection.db.collection('e22overviews').countDocuments();
      console.log(`Found ${overviewCount} documents in e22overviews collection`);
      
      if (overviewCount === 0) {
        console.log('Creating E22Overview data...');
        const overview = await E22Overview.create(defaultOverviewContent);
        console.log('Created E22Overview document with ID:', overview._id);
      } else {
        console.log('E22Overview data already exists');
      }
    } catch (err) {
      console.log('Error with E22Overview collection, creating it...');
      const overview = await E22Overview.create(defaultOverviewContent);
      console.log('Created E22Overview document with ID:', overview._id);
    }
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAll collections in database:');
    collections.forEach(c => console.log(` - ${c.name}`));
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\nDatabase operation completed, connection closed');
    
  } catch (err) {
    console.error('Error in createCollections:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnection error
    }
    process.exit(1);
  }
};

// Run the function
createCollections();
