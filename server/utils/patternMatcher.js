const fs = require('fs');
const path = require('path');

class PatternMatcher {
  constructor() {
    this.patterns = [];
    this.loadPatterns();
  }

  loadPatterns() {
    try {
      const patternsPath = path.join(__dirname, '../data/uscis-training-patterns.json');
      const patternsData = fs.readFileSync(patternsPath, 'utf8');
      const data = JSON.parse(patternsData);
      this.patterns = data.categories || [];
      console.log(`Loaded ${this.patterns.length} training patterns`);
    } catch (error) {
      console.error('Error loading training patterns:', error);
      this.patterns = [];
    }
  }

  // Normalize text for pattern matching
  normalizeText(text) {
    return text
      .toUpperCase()
      .replace(/[^\w\s*]/g, ' ') // Keep letters, numbers, spaces, and wildcards
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Convert pattern to regex, handling wildcards
  patternToRegex(pattern) {
    const normalized = this.normalizeText(pattern);
    // Replace * with regex pattern that matches any words
    const regexPattern = normalized
      .replace(/\*/g, '.*?')
      .replace(/\s+/g, '\\s+');
    
    return new RegExp(`^${regexPattern}$`, 'i');
  }

  // Calculate similarity score between query and pattern
  calculateSimilarity(query, pattern) {
    const normalizedQuery = this.normalizeText(query);
    const normalizedPattern = this.normalizeText(pattern);
    
    // Exact match gets highest score
    if (normalizedQuery === normalizedPattern) {
      return 1.0;
    }

    // Try regex pattern matching for wildcards
    const regex = this.patternToRegex(pattern);
    if (regex.test(normalizedQuery)) {
      return 0.95;
    }

    // Keyword-based similarity
    const queryWords = normalizedQuery.split(/\s+/);
    const patternWords = normalizedPattern.replace(/\*/g, '').split(/\s+/).filter(w => w.length > 0);
    
    if (patternWords.length === 0) return 0;

    let matchCount = 0;
    for (const patternWord of patternWords) {
      if (queryWords.some(queryWord => 
        queryWord.includes(patternWord) || patternWord.includes(queryWord)
      )) {
        matchCount++;
      }
    }

    return matchCount / patternWords.length;
  }

  // Find best matching pattern for a query
  findBestMatch(query) {
    if (!query || this.patterns.length === 0) {
      return null;
    }

    let bestMatch = null;
    let bestScore = 0;
    const minThreshold = 0.6; // Minimum similarity threshold

    for (const pattern of this.patterns) {
      const score = this.calculateSimilarity(query, pattern.pattern);
      
      // Also check against keywords
      const keywordScore = this.calculateKeywordScore(query, pattern.keywords || []);
      const combinedScore = Math.max(score, keywordScore * 0.8);

      if (combinedScore > bestScore && combinedScore >= minThreshold) {
        bestScore = combinedScore;
        bestMatch = {
          ...pattern,
          matchScore: combinedScore
        };
      }
    }

    return bestMatch;
  }

  // Calculate score based on keyword matching
  calculateKeywordScore(query, keywords) {
    if (!keywords || keywords.length === 0) return 0;

    const normalizedQuery = this.normalizeText(query);
    let matchCount = 0;

    for (const keyword of keywords) {
      const normalizedKeyword = this.normalizeText(keyword);
      if (normalizedQuery.includes(normalizedKeyword)) {
        matchCount++;
      }
    }

    return matchCount / keywords.length;
  }

  // Process template with any dynamic replacements
  processTemplate(template, query, matchData = {}) {
    let processedTemplate = template;

    // Add timestamp if needed
    if (template.includes('{timestamp}')) {
      processedTemplate = processedTemplate.replace('{timestamp}', new Date().toLocaleString());
    }

    // Add query context if needed
    if (template.includes('{query}')) {
      processedTemplate = processedTemplate.replace('{query}', query);
    }

    return processedTemplate;
  }

  // Main method to get response for a query
  getResponse(query) {
    const match = this.findBestMatch(query);
    
    if (!match) {
      return null;
    }

    const processedTemplate = this.processTemplate(match.template, query);

    return {
      answer: processedTemplate,
      confidence: match.confidence * match.matchScore,
      category: match.category,
      pattern: match.pattern,
      matchScore: match.matchScore,
      sources: ['USCIS Training Data', 'Pattern Matching System'],
      isTrainedResponse: true
    };
  }

  // Add new pattern (for dynamic training)
  addPattern(pattern, template, options = {}) {
    const newPattern = {
      pattern: pattern.toUpperCase(),
      template,
      confidence: options.confidence || 0.9,
      category: options.category || 'custom',
      keywords: options.keywords || []
    };

    this.patterns.push(newPattern);
    return newPattern;
  }

  // Get all patterns (for management interface)
  getAllPatterns() {
    return this.patterns;
  }

  // Reload patterns from file
  reloadPatterns() {
    this.loadPatterns();
  }
}

module.exports = PatternMatcher;
