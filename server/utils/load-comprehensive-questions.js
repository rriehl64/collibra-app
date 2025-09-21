#!/usr/bin/env node

/**
 * Script to load the comprehensive 500-question collection into the training system
 * This script converts the structured collection format to the training patterns format
 */

const fs = require('fs');
const path = require('path');

// Function to convert comprehensive collection to training patterns format
function convertToTrainingPatterns() {
  const collectionPath = path.join(__dirname, '../data/uscis-comprehensive-500-questions.json');
  const trainingPath = path.join(__dirname, '../data/uscis-training-patterns.json');
  
  try {
    // Read the comprehensive collection
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
    
    // Convert to training patterns format
    const trainingPatterns = {
      categories: []
    };
    
    // Flatten all questions from all categories
    collection.categories.forEach(category => {
      category.questions.forEach(question => {
        trainingPatterns.categories.push({
          pattern: question.pattern,
          template: question.template,
          confidence: question.confidence,
          category: category.name,
          keywords: question.keywords
        });
      });
    });
    
    console.log(`✅ Converted ${trainingPatterns.categories.length} questions to training format`);
    
    // Backup existing training patterns
    if (fs.existsSync(trainingPath)) {
      const backupPath = trainingPath.replace('.json', `-backup-${Date.now()}.json`);
      fs.copyFileSync(trainingPath, backupPath);
      console.log(`📋 Backed up existing patterns to: ${path.basename(backupPath)}`);
    }
    
    // Write new training patterns
    fs.writeFileSync(trainingPath, JSON.stringify(trainingPatterns, null, 2));
    console.log(`💾 Saved ${trainingPatterns.categories.length} training patterns`);
    
    return trainingPatterns;
    
  } catch (error) {
    console.error('Error converting collection:', error);
    throw error;
  }
}

// Function to merge with existing patterns (preserve custom additions)
function mergeWithExisting() {
  const collectionPath = path.join(__dirname, '../data/uscis-comprehensive-500-questions.json');
  const trainingPath = path.join(__dirname, '../data/uscis-training-patterns.json');
  
  try {
    // Read both files
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
    let existingPatterns = { categories: [] };
    
    if (fs.existsSync(trainingPath)) {
      existingPatterns = JSON.parse(fs.readFileSync(trainingPath, 'utf8'));
    }
    
    // Create a map of existing patterns to avoid duplicates
    const existingMap = new Map();
    existingPatterns.categories.forEach(pattern => {
      existingMap.set(pattern.pattern, pattern);
    });
    
    // Add new patterns from collection
    let addedCount = 0;
    collection.categories.forEach(category => {
      category.questions.forEach(question => {
        if (!existingMap.has(question.pattern)) {
          existingPatterns.categories.push({
            pattern: question.pattern,
            template: question.template,
            confidence: question.confidence,
            category: category.name,
            keywords: question.keywords
          });
          addedCount++;
        }
      });
    });
    
    console.log(`✅ Added ${addedCount} new patterns`);
    console.log(`📊 Total patterns: ${existingPatterns.categories.length}`);
    
    // Write merged patterns
    fs.writeFileSync(trainingPath, JSON.stringify(existingPatterns, null, 2));
    
    return existingPatterns;
    
  } catch (error) {
    console.error('Error merging patterns:', error);
    throw error;
  }
}

// Function to generate category statistics
function generateStats() {
  const trainingPath = path.join(__dirname, '../data/uscis-training-patterns.json');
  
  try {
    const patterns = JSON.parse(fs.readFileSync(trainingPath, 'utf8'));
    
    // Count by category
    const categoryStats = {};
    patterns.categories.forEach(pattern => {
      if (!categoryStats[pattern.category]) {
        categoryStats[pattern.category] = 0;
      }
      categoryStats[pattern.category]++;
    });
    
    console.log('\n📊 Category Statistics:');
    Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} questions`);
      });
    
    console.log(`\n🎯 Total Questions: ${patterns.categories.length}`);
    console.log(`📁 Categories: ${Object.keys(categoryStats).length}`);
    
    return categoryStats;
    
  } catch (error) {
    console.error('Error generating stats:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'merge';
  
  switch (command) {
    case 'convert':
      console.log('🔄 Converting comprehensive collection to training patterns...');
      convertToTrainingPatterns();
      break;
      
    case 'merge':
      console.log('🔄 Merging comprehensive collection with existing patterns...');
      mergeWithExisting();
      generateStats();
      break;
      
    case 'stats':
      console.log('📊 Generating statistics...');
      generateStats();
      break;
      
    default:
      console.log('Usage: node load-comprehensive-questions.js [convert|merge|stats]');
      console.log('  convert: Replace existing patterns with comprehensive collection');
      console.log('  merge:   Add new patterns from collection to existing (default)');
      console.log('  stats:   Show statistics about current patterns');
  }
}

module.exports = { convertToTrainingPatterns, mergeWithExisting, generateStats };
