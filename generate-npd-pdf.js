const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const PDF_OUTPUT = path.join(__dirname, 'national-production-dataset-documentation.pdf');
const BASE_URL = 'http://localhost:3008/national-production-dataset';

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Tab information with their selectors
const tabs = [
  { name: 'Overview', selector: 'button[aria-label="Overview tab"]', index: 0 },
  { name: 'Data Integration', selector: 'button[aria-label="Data Integration tab"]', index: 1 },
  { name: 'System Architecture', selector: 'button[aria-label="System Architecture tab"]', index: 2 },
  { name: 'Governance', selector: 'button[aria-label="Governance tab"]', index: 3 },
  { name: 'Key Metrics', selector: 'button[aria-label="Key Metrics tab"]', index: 4 },
  { name: 'Development Timeline', selector: 'button[aria-label="Development Timeline tab"]', index: 5 },
  { name: 'Resources', selector: 'button[aria-label="Resources tab"]', index: 6 }
];

async function captureTabScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the National Production Dataset page
    console.log('Navigating to National Production Dataset page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for the page to load completely
    await page.waitForSelector('#root', { timeout: 10000 });
    
    console.log('Capturing full page screenshot...');
    const fullPagePath = path.join(SCREENSHOT_DIR, 'npd-full-page.png');
    await page.screenshot({ path: fullPagePath, fullPage: true });
    
    // Extract content and capture screenshots for each tab
    const tabData = [];
    
    for (const tab of tabs) {
      console.log(`Processing ${tab.name} tab...`);
      
      try {
        // Click on the tab
        await page.waitForSelector(tab.selector, { visible: true, timeout: 5000 });
        await page.click(tab.selector);
        
        // Wait for content to load
        await page.waitForTimeout(1000);
        
        // Capture screenshot of the tab content
        const screenshotPath = path.join(SCREENSHOT_DIR, `npd-${tab.name.toLowerCase().replace(/ /g, '-')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        // Extract tab content
        const content = await page.evaluate(() => {
          const tabContent = document.querySelector('[role="tabpanel"]');
          return tabContent ? tabContent.innerText : '';
        });
        
        tabData.push({
          name: tab.name,
          screenshotPath,
          content
        });
        
        console.log(`${tab.name} tab processed successfully`);
      } catch (error) {
        console.error(`Error processing ${tab.name} tab:`, error);
      }
    }
    
    return {
      fullPagePath,
      tabData
    };
  } finally {
    await browser.close();
  }
}

function generatePDF(data) {
  console.log('Generating PDF...');
  
  const doc = new PDFDocument({
    size: 'letter',
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    },
    info: {
      Title: 'National Production Dataset Documentation',
      Author: 'E-Unify Application',
      Subject: 'Comprehensive documentation of the National Production Dataset module',
      Keywords: 'NPD, USCIS, E-Unify, Production, Dataset'
    }
  });
  
  doc.pipe(fs.createWriteStream(PDF_OUTPUT));
  
  // Cover page
  doc.fontSize(24).font('Helvetica-Bold').text('National Production Dataset', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).font('Helvetica').text('Comprehensive Documentation', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);
  
  // Add full page screenshot
  if (fs.existsSync(data.fullPagePath)) {
    const imgWidth = doc.page.width - 100;
    doc.image(data.fullPagePath, {
      fit: [imgWidth, 300],
      align: 'center'
    });
  }
  
  // Table of Contents
  doc.addPage();
  doc.fontSize(18).font('Helvetica-Bold').text('Table of Contents', { align: 'left' });
  doc.moveDown(1);
  
  let currentPage = 2; // Start counting from the current page
  data.tabData.forEach((tab, index) => {
    doc.fontSize(12).font('Helvetica')
      .text(`${index + 1}. ${tab.name}`, { align: 'left', continued: true })
      .text(`Page ${currentPage + index + 1}`, { align: 'right' });
    doc.moveDown(0.5);
  });
  
  // Add each tab's content and screenshot
  data.tabData.forEach(tab => {
    doc.addPage();
    
    // Tab header
    doc.fontSize(20).font('Helvetica-Bold').text(tab.name, { align: 'center' });
    doc.moveDown(1);
    
    // Add screenshot
    if (fs.existsSync(tab.screenshotPath)) {
      const imgWidth = doc.page.width - 100;
      doc.image(tab.screenshotPath, {
        fit: [imgWidth, 300],
        align: 'center'
      });
      doc.moveDown(1);
    }
    
    // Add extracted content
    doc.fontSize(12).font('Helvetica-Bold').text('Content Summary:', { align: 'left' });
    doc.moveDown(0.5);
    doc.font('Helvetica').text(tab.content || 'No content extracted for this tab.', {
      align: 'left',
      columns: 1
    });
  });
  
  // Finalize PDF
  doc.end();
  console.log(`PDF generated successfully: ${PDF_OUTPUT}`);
}

async function main() {
  try {
    const data = await captureTabScreenshots();
    generatePDF(data);
  } catch (error) {
    console.error('Error generating documentation:', error);
  }
}

main();
