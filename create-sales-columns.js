const mongoose = require('mongoose');
const DataAsset = require('./server/models/DataAsset');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data-literacy-support');

const salesTableId = '688c291934a602337a6085a5';

const salesColumns = [
  {
    name: 'transaction_id',
    type: 'Column',
    domain: 'Sales',
    description: 'Unique identifier for each sales transaction',
    dataType: 'VARCHAR(50)',
    isPrimaryKey: true,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Primary key for sales transactions table',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['primary-key', 'identifier', 'sales']
  },
  {
    name: 'customer_id',
    type: 'Column',
    domain: 'Sales',
    description: 'Foreign key reference to customer table',
    dataType: 'VARCHAR(50)',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Links transaction to customer record',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['foreign-key', 'customer', 'sales']
  },
  {
    name: 'product_id',
    type: 'Column',
    domain: 'Sales',
    description: 'Identifier for the product sold',
    dataType: 'VARCHAR(50)',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Product identifier for sales analysis',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['product', 'identifier', 'sales']
  },
  {
    name: 'transaction_date',
    type: 'Column',
    domain: 'Sales',
    description: 'Date and time when the transaction occurred',
    dataType: 'DATETIME',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Transaction timestamp for temporal analysis',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['date', 'timestamp', 'sales']
  },
  {
    name: 'amount',
    type: 'Column',
    domain: 'Sales',
    description: 'Total transaction amount in USD',
    dataType: 'DECIMAL(10,2)',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Monetary value of the transaction',
    dataClassification: 'Confidential',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['amount', 'currency', 'financial']
  },
  {
    name: 'quantity',
    type: 'Column',
    domain: 'Sales',
    description: 'Number of units sold in this transaction',
    dataType: 'INT',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Quantity of products sold',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['quantity', 'units', 'sales']
  },
  {
    name: 'discount_percent',
    type: 'Column',
    domain: 'Sales',
    description: 'Discount percentage applied to this transaction',
    dataType: 'DECIMAL(5,2)',
    isPrimaryKey: false,
    isNullable: true,
    parentTable: salesTableId,
    businessGlossary: 'Discount rate for promotional analysis',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['discount', 'promotion', 'sales']
  },
  {
    name: 'sales_rep_id',
    type: 'Column',
    domain: 'Sales',
    description: 'ID of the sales representative who handled the transaction',
    dataType: 'VARCHAR(50)',
    isPrimaryKey: false,
    isNullable: true,
    parentTable: salesTableId,
    businessGlossary: 'Sales representative for performance tracking',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['sales-rep', 'employee', 'performance']
  },
  {
    name: 'payment_method',
    type: 'Column',
    domain: 'Sales',
    description: 'Method of payment used (Credit Card, Cash, Check, etc.)',
    dataType: 'VARCHAR(50)',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'Payment method for transaction analysis',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['payment', 'method', 'transaction']
  },
  {
    name: 'created_at',
    type: 'Column',
    domain: 'Sales',
    description: 'Timestamp when the record was created in the system',
    dataType: 'DATETIME',
    isPrimaryKey: false,
    isNullable: false,
    parentTable: salesTableId,
    businessGlossary: 'System audit timestamp',
    dataClassification: 'Internal',
    owner: 'Sales Team',
    steward: 'Data Steward',
    tags: ['audit', 'timestamp', 'system']
  }
];

async function createSalesColumns() {
  try {
    console.log('Creating column assets for Sales Transactions table...');
    
    for (const columnData of salesColumns) {
      const column = new DataAsset(columnData);
      await column.save();
      console.log(`✅ Created column: ${columnData.name}`);
    }
    
    console.log(`\n🎉 Successfully created ${salesColumns.length} column assets!`);
    
    // Verify creation
    const createdColumns = await DataAsset.find({ 
      type: 'Column', 
      parentTable: salesTableId 
    });
    
    console.log(`\n📊 Verification: Found ${createdColumns.length} columns for Sales Transactions table`);
    
  } catch (error) {
    console.error('❌ Error creating columns:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSalesColumns();
