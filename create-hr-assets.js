const mongoose = require('mongoose');
const DataAsset = require('./server/models/DataAsset');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data-literacy-support');

const hrAssets = [
  // Business Terms
  {
    name: 'Promotions',
    type: 'Business Term',
    domain: 'Human Resources',
    description: 'Employee promotion events and career advancement tracking',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'promotions', 'career', 'business-term'],
    certification: 'certified'
  },
  {
    name: 'Cost Center',
    type: 'Business Term',
    domain: 'Human Resources',
    description: 'Organizational cost centers for budget allocation and reporting',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'cost-center', 'budget', 'business-term'],
    certification: 'certified'
  },
  
  // System
  {
    name: 'HR DataMart',
    type: 'Data Warehouse',
    domain: 'Human Resources',
    description: 'Human Resources data mart containing employee and organizational data',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'datamart', 'warehouse', 'system'],
    certification: 'gold'
  },
  
  // Database
  {
    name: 'test-drive-329411',
    type: 'Database',
    domain: 'Human Resources',
    description: 'HR database containing employee data and organizational structures',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'database', 'employee-data'],
    certification: 'certified'
  },
  
  // Schema
  {
    name: 'HR',
    type: 'Schema',
    domain: 'Human Resources',
    description: 'HR schema containing employee tables and views',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'schema', 'employee'],
    certification: 'certified'
  },
  
  // View
  {
    name: 'employees_view',
    type: 'View',
    domain: 'Human Resources',
    description: 'Consolidated view of employee data for reporting and analysis',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'employees', 'view', 'reporting'],
    certification: 'certified'
  },
  
  // Column
  {
    name: 'employee_email',
    type: 'Column',
    domain: 'Human Resources',
    description: 'Employee email address field - Text data type',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'employee', 'email', 'contact', 'column'],
    certification: 'certified',
    dataType: 'Text',
    isPrimaryKey: false,
    isNullable: false,
    dataClassification: 'Confidential'
  },
  
  // Tableau Reports
  {
    name: 'Employees Churn Reporting',
    type: 'Report',
    domain: 'Human Resources',
    description: 'Tableau report analyzing employee churn rates and retention metrics',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'tableau', 'churn', 'reporting', 'analytics'],
    certification: 'certified'
  },
  {
    name: 'By Cost Center',
    type: 'Report',
    domain: 'Human Resources',
    description: 'Tableau report showing HR metrics organized by cost center',
    owner: 'HR Team',
    status: 'Production',
    tags: ['hr', 'tableau', 'cost-center', 'reporting', 'metrics'],
    certification: 'certified'
  }
];

async function createHRAssets() {
  try {
    console.log('Creating HR data assets from Collibra diagram...');
    
    for (const assetData of hrAssets) {
      const asset = new DataAsset(assetData);
      await asset.save();
      console.log(`✅ Created ${assetData.type}: ${assetData.name}`);
    }
    
    console.log(`\n🎉 Successfully created ${hrAssets.length} HR assets!`);
    
    // Verify creation by domain
    const createdAssets = await DataAsset.find({ domain: 'Human Resources' });
    console.log(`\n📊 Verification: Found ${createdAssets.length} assets in Human Resources domain`);
    
    // Show breakdown by type
    const typeBreakdown = {};
    createdAssets.forEach(asset => {
      typeBreakdown[asset.type] = (typeBreakdown[asset.type] || 0) + 1;
    });
    
    console.log('\n📋 Asset breakdown:');
    Object.entries(typeBreakdown).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating HR assets:', error);
  } finally {
    mongoose.connection.close();
  }
}

createHRAssets();
