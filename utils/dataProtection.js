const readline = require('readline');
const mongoose = require('mongoose');

/**
 * Data Protection Utilities
 * Provides safe data operations with confirmations and backups
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompts user for confirmation before destructive operations
 * @param {string} message - Warning message to display
 * @param {string} collectionName - Name of collection being affected
 * @param {number} recordCount - Number of records that will be affected
 * @returns {Promise<boolean>} - User confirmation
 */
const confirmDestructiveOperation = async (message, collectionName, recordCount = 0) => {
  const warning = `
⚠️  WARNING: DESTRUCTIVE OPERATION DETECTED ⚠️
${message}

Collection: ${collectionName}
Records affected: ${recordCount || 'Unknown'}
Environment: ${process.env.NODE_ENV || 'development'}

This operation will PERMANENTLY DELETE data and cannot be undone.

Type 'DELETE' (all caps) to confirm, or anything else to cancel: `;

  return new Promise((resolve) => {
    rl.question(warning, (answer) => {
      resolve(answer === 'DELETE');
    });
  });
};

/**
 * Creates a backup before destructive operations
 * @param {string} collectionName - Collection to backup
 * @param {string} backupPath - Path to save backup (optional)
 * @returns {Promise<string>} - Backup file path
 */
const createBackup = async (collectionName, backupPath = null) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = backupPath || `backup-${collectionName}-${timestamp}.json`;
  
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    const fs = require('fs');
    const path = require('path');
    
    // Ensure backup directory exists
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const fullPath = path.join(backupDir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(documents, null, 2));
    
    console.log(`✅ Backup created: ${fullPath} (${documents.length} records)`);
    return fullPath;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
};

/**
 * Safe delete operation with confirmation and backup
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Delete filter (default: {} for all)
 * @param {Object} options - Options {skipConfirmation, skipBackup}
 * @returns {Promise<Object>} - Delete result
 */
const safeDelete = async (model, filter = {}, options = {}) => {
  const { skipConfirmation = false, skipBackup = false } = options;
  const collectionName = model.collection.name;
  
  // Count records to be affected
  const recordCount = await model.countDocuments(filter);
  
  if (recordCount === 0) {
    console.log(`ℹ️  No records found in ${collectionName} matching filter`);
    return { deletedCount: 0 };
  }
  
  // Create backup unless skipped
  if (!skipBackup) {
    console.log(`📦 Creating backup for ${collectionName}...`);
    await createBackup(collectionName);
  }
  
  // Get confirmation unless skipped
  if (!skipConfirmation) {
    const confirmed = await confirmDestructiveOperation(
      `You are about to delete ${recordCount} records from ${collectionName}`,
      collectionName,
      recordCount
    );
    
    if (!confirmed) {
      console.log('❌ Operation cancelled by user');
      rl.close();
      return { deletedCount: 0, cancelled: true };
    }
  }
  
  // Perform deletion
  console.log(`🗑️  Deleting ${recordCount} records from ${collectionName}...`);
  const result = await model.deleteMany(filter);
  console.log(`✅ Deleted ${result.deletedCount} records from ${collectionName}`);
  
  rl.close();
  return result;
};

/**
 * Safe truncate operation (delete all records)
 * @param {Object} model - Mongoose model
 * @param {Object} options - Options {skipConfirmation, skipBackup}
 * @returns {Promise<Object>} - Delete result
 */
const safeTruncate = async (model, options = {}) => {
  return safeDelete(model, {}, options);
};

/**
 * Validates environment before destructive operations
 * @param {Array<string>} allowedEnvs - Allowed environments (default: ['development', 'test'])
 * @throws {Error} - If environment is not allowed
 */
const validateEnvironment = (allowedEnvs = ['development', 'test']) => {
  const currentEnv = process.env.NODE_ENV || 'development';
  
  if (!allowedEnvs.includes(currentEnv)) {
    throw new Error(
      `❌ Destructive operations not allowed in ${currentEnv} environment. ` +
      `Allowed environments: ${allowedEnvs.join(', ')}`
    );
  }
  
  console.log(`✅ Environment check passed: ${currentEnv}`);
};

/**
 * Closes readline interface (call this at the end of scripts)
 */
const cleanup = () => {
  rl.close();
};

module.exports = {
  confirmDestructiveOperation,
  createBackup,
  safeDelete,
  safeTruncate,
  validateEnvironment,
  cleanup
};
