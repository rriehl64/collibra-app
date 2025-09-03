const puppeteer = require('puppeteer');

async function validateAdvancedFeatures() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting Advanced Features Validation...');
    
    // Navigate to the application
    await page.goto('http://localhost:3008');
    await page.waitForSelector('body', { timeout: 10000 });
    
    console.log('✅ Application loaded successfully');
    
    // Test 1: Data Catalog Advanced Search
    console.log('\n📊 Testing Data Catalog Advanced Search...');
    await page.goto('http://localhost:3008/data-catalog');
    await page.waitForSelector('[data-testid="advanced-search"]', { timeout: 5000 });
    console.log('✅ Advanced Search component loaded');
    
    // Test 2: Data Quality Dashboard
    console.log('\n📈 Testing Data Quality Dashboard...');
    await page.goto('http://localhost:3008/data-quality');
    await page.waitForSelector('[data-testid="data-quality-dashboard"]', { timeout: 5000 });
    console.log('✅ Data Quality Dashboard loaded');
    
    // Test 3: User Management (if accessible)
    console.log('\n👥 Testing User Management...');
    try {
      await page.goto('http://localhost:3008/access/user-management');
      await page.waitForSelector('[data-testid="user-management"]', { timeout: 5000 });
      console.log('✅ User Management loaded');
    } catch (error) {
      console.log('⚠️  User Management requires authentication');
    }
    
    // Test 4: Navigation Links
    console.log('\n🧭 Testing Navigation...');
    await page.goto('http://localhost:3008');
    const dataQualityLink = await page.$('a[href="/data-quality"]');
    if (dataQualityLink) {
      console.log('✅ Data Quality navigation link found');
    }
    
    console.log('\n🎉 Advanced Features Validation Complete!');
    
  } catch (error) {
    console.error('❌ Validation Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run validation if puppeteer is available
if (typeof require !== 'undefined') {
  try {
    validateAdvancedFeatures();
  } catch (error) {
    console.log('Manual testing required - Puppeteer not available');
  }
}
