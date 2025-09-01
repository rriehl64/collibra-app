# Data Protection Guide

## Overview
This guide provides best practices and tools to prevent accidental data loss in the E-Unify application. After experiencing data loss where 61,000+ records were accidentally deleted, we've implemented comprehensive safety measures.

## Safety Tools

### 1. Data Protection Utilities (`utils/dataProtection.js`)

Core utilities for safe data operations:

- **`safeDelete(model, filter, options)`** - Delete with confirmation and backup
- **`safeTruncate(model, options)`** - Truncate collection with safety checks
- **`createBackup(collectionName, backupPath)`** - Create JSON backup before operations
- **`confirmDestructiveOperation(message, collection, count)`** - User confirmation prompts
- **`validateEnvironment(allowedEnvs)`** - Prevent production accidents

### 2. Safe Script Examples

#### Safe Data Generation
```bash
# Generate 1000 records (no deletion)
node generate-sample-data-assets-safe.js 1000

# Generate with truncation (includes backup + confirmation)
node generate-sample-data-assets-safe.js 5000 --truncate

# Force mode (skip confirmations - use carefully)
node generate-sample-data-assets-safe.js 1000 --truncate --force
```

#### Safe Reset and Populate
```bash
# Show usage and safety info
node reset-and-populate-data-safe.js

# Reset with 500 sample records (requires --force)
node reset-and-populate-data-safe.js --force --count=500
```

## Safety Features

### ✅ Automatic Backups
- JSON backups created in `backups/` directory
- Timestamped filenames for easy identification
- Automatic backup before any destructive operation

### ✅ Environment Validation
- Scripts only run in `development` or `test` environments
- Production environment protection built-in
- Clear error messages for invalid environments

### ✅ User Confirmation
- Interactive prompts for destructive operations
- Must type "DELETE" (all caps) to confirm
- Shows record count and collection name
- Can be bypassed with `--force` flag (use carefully)

### ✅ Detailed Logging
- Clear status messages throughout operations
- Record counts and operation results
- Error handling with descriptive messages

## Backup and Recovery

### Creating Manual Backups
```bash
# Create backup using mongodump
mongodump --db data-literacy-support --collection dataassets --out backup-$(date +%Y%m%d-%H%M%S)

# Create JSON backup using mongoexport
mongoexport --db data-literacy-support --collection dataassets --out dataassets-backup-$(date +%Y%m%d-%H%M%S).json --pretty
```

### Restoring from Backups
```bash
# Restore from mongodump backup
mongorestore --db data-literacy-support --collection dataassets --drop backup-folder/data-literacy-support/dataassets.bson

# Restore from JSON backup
mongoimport --db data-literacy-support --collection dataassets --file dataassets-backup.json --drop
```

## Best Practices

### 🔒 Before Running Scripts
1. **Check environment** - Ensure you're in development/test
2. **Count existing records** - Know what you're working with
3. **Create manual backup** - Extra safety for important data
4. **Read script documentation** - Understand what it does

### 🔒 Script Development
1. **Use safe utilities** - Import from `utils/dataProtection.js`
2. **Add environment checks** - Validate before destructive operations
3. **Include confirmation prompts** - Let users confirm dangerous actions
4. **Create automatic backups** - Always backup before deletion
5. **Provide clear usage docs** - Help prevent misuse

### 🔒 Data Operations
1. **Test with small datasets** - Verify behavior before large operations
2. **Use append operations** - Prefer adding to existing data
3. **Avoid truncate patterns** - Don't delete all data by default
4. **Monitor record counts** - Check before and after operations

## Emergency Recovery

### If Data Loss Occurs
1. **Stop all operations immediately**
2. **Check `backups/` directory** for recent backups
3. **Check `export/` directory** for BSON exports
4. **Look for manual backups** created before operations
5. **Contact database administrator** if available

### Prevention Checklist
- [ ] Environment validated (dev/test only)
- [ ] Current record count documented
- [ ] Backup created and verified
- [ ] Script behavior understood
- [ ] Confirmation prompts enabled
- [ ] Force flags used sparingly

## Script Migration

### Converting Unsafe Scripts
Replace dangerous patterns:

```javascript
// ❌ DANGEROUS - No protection
await DataAsset.deleteMany({});

// ✅ SAFE - With protection
const { safeDelete } = require('./utils/dataProtection');
await safeDelete(DataAsset, {}, { skipConfirmation: false });
```

### Environment Protection
```javascript
// ✅ Add environment validation
const { validateEnvironment } = require('./utils/dataProtection');
validateEnvironment(['development', 'test']);
```

## Monitoring and Alerts

### Record Count Monitoring
```bash
# Quick count check
mongosh --eval "db.dataassets.countDocuments()" data-literacy-support

# Detailed collection stats
mongosh --eval "db.stats()" data-literacy-support
```

### Backup Verification
```bash
# List recent backups
ls -la backups/ | head -10

# Check backup file sizes
du -sh backups/*
```

## Contact and Support

For questions about data protection or recovery:
- Review this guide first
- Check backup directories
- Test recovery procedures in development
- Document any issues for future prevention

---

**Remember: Data loss is permanent. Always err on the side of caution.**
