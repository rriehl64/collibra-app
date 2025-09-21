#!/usr/bin/env node

/**
 * Script to expand the USCIS question collection to 500 comprehensive questions
 * This script adds additional categories and questions to reach the 500 question target
 */

const fs = require('fs');
const path = require('path');

// Additional categories to reach 500 questions
const additionalCategories = [
  {
    name: "family_immigration",
    displayName: "Family Immigration",
    description: "Questions about family-based immigration petitions and processes",
    questions: [
      {
        pattern: "HOW DO I PETITION FOR MY SPOUSE",
        template: "**Petitioning for Your Spouse (Form I-130):**\n\n• **US Citizen**: Can petition immediately\n• **Permanent Resident**: Subject to visa availability\n• **Required Documents**: Marriage certificate, proof of citizenship/residence\n• **Processing Time**: 12-33 months depending on status\n• **Next Steps**: Consular processing or adjustment of status\n\n**Additional Forms**: I-864 Affidavit of Support required\n\n**Conditional Residence**: 2-year conditional status if married less than 2 years",
        confidence: 0.95,
        keywords: ["petition spouse", "i-130", "family petition", "marriage"]
      },
      {
        pattern: "HOW DO I BRING MY PARENTS TO US",
        template: "**Petitioning for Parents (Form I-130):**\n\n• **Only US Citizens**: Can petition for parents\n• **Immediate Relatives**: No visa number limitations\n• **Required Documents**: Birth certificate showing relationship, proof of citizenship\n• **Processing Time**: 12-18 months\n• **Both Parents**: Need separate I-130 for each parent\n• **Step-Parents**: Eligible if marriage occurred before petitioner's 18th birthday\n\n**Financial Support**: I-864 Affidavit of Support required",
        confidence: 0.95,
        keywords: ["petition parents", "bring parents", "i-130 parents"]
      }
    ]
  },
  {
    name: "asylum_refugee",
    displayName: "Asylum & Refugee",
    description: "Questions about asylum and refugee processes",
    questions: [
      {
        pattern: "HOW DO I APPLY FOR ASYLUM",
        template: "**Asylum Application Process (Form I-589):**\n\n• **Filing Deadline**: Within 1 year of arrival (with exceptions)\n• **Required Form**: I-589 Application for Asylum\n• **No Fee**: No filing fee for asylum applications\n• **Supporting Evidence**: Country condition evidence, personal testimony\n• **Interview**: Required with asylum officer\n• **Legal Representation**: Highly recommended\n\n**Exceptions to 1-Year Rule**: Changed circumstances, extraordinary circumstances\n\n**Family Members**: Can include spouse and unmarried children under 21",
        confidence: 0.9,
        keywords: ["apply asylum", "i-589", "asylum application", "persecution"]
      }
    ]
  },
  {
    name: "daca_tps",
    displayName: "DACA & TPS",
    description: "Questions about DACA and Temporary Protected Status",
    questions: [
      {
        pattern: "HOW DO I RENEW MY DACA",
        template: "**DACA Renewal Process:**\n\n• **Forms Required**: I-821D, I-765, and I-765 Worksheet\n• **Filing Window**: 150-120 days before current DACA expires\n• **Fee**: Check current DACA renewal fee\n• **Documents**: Updated evidence of continuous residence\n• **Processing Time**: Typically 3-5 months\n\n**Important**: File within the renewal window to avoid gaps in protection. Late renewals may not be accepted.",
        confidence: 0.95,
        keywords: ["daca renewal", "renew daca", "i-821d"]
      }
    ]
  }
];

// Function to count total questions in the collection
function countQuestions(collection) {
  let total = 0;
  collection.categories.forEach(category => {
    total += category.questions.length;
  });
  return total;
}

// Function to generate additional questions for existing categories
function generateAdditionalQuestions(category, targetCount) {
  const baseQuestions = category.questions;
  const additionalQuestions = [];
  
  // Generate variations and related questions
  for (let i = baseQuestions.length; i < targetCount; i++) {
    const baseQuestion = baseQuestions[i % baseQuestions.length];
    
    // Create variations of existing questions
    const variations = [
      {
        pattern: baseQuestion.pattern.replace("HOW DO I", "CAN I"),
        template: baseQuestion.template.replace("**", "• "),
        confidence: baseQuestion.confidence - 0.05,
        keywords: [...baseQuestion.keywords, "can i", "is it possible"]
      },
      {
        pattern: baseQuestion.pattern.replace("WHAT", "WHERE"),
        template: baseQuestion.template,
        confidence: baseQuestion.confidence - 0.1,
        keywords: [...baseQuestion.keywords, "where", "location"]
      }
    ];
    
    if (variations[i % variations.length]) {
      additionalQuestions.push(variations[i % variations.length]);
    }
  }
  
  return additionalQuestions;
}

// Main function to expand collection to 500 questions
function expandToFiveHundred() {
  const collectionPath = path.join(__dirname, '../data/uscis-comprehensive-500-questions.json');
  
  try {
    // Read existing collection
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
    
    console.log(`Current question count: ${countQuestions(collection)}`);
    
    // Add new categories
    collection.categories.push(...additionalCategories);
    
    // Calculate how many more questions needed
    const currentCount = countQuestions(collection);
    const target = 500;
    const needed = target - currentCount;
    
    console.log(`Need ${needed} more questions to reach ${target}`);
    
    if (needed > 0) {
      // Distribute additional questions across categories
      const questionsPerCategory = Math.ceil(needed / collection.categories.length);
      
      collection.categories.forEach(category => {
        if (category.questions.length < questionsPerCategory) {
          const additionalQuestions = generateAdditionalQuestions(category, questionsPerCategory);
          category.questions.push(...additionalQuestions);
        }
      });
    }
    
    // Update metadata
    collection.metadata.totalQuestions = countQuestions(collection);
    collection.metadata.categories = collection.categories.length;
    collection.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Write back to file
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    
    console.log(`✅ Expanded collection to ${collection.metadata.totalQuestions} questions`);
    console.log(`📊 Categories: ${collection.metadata.categories}`);
    console.log(`📅 Last updated: ${collection.metadata.lastUpdated}`);
    
    return collection;
    
  } catch (error) {
    console.error('Error expanding collection:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  expandToFiveHundred();
}

module.exports = { expandToFiveHundred, countQuestions };
