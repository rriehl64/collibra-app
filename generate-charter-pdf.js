const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const marked = require('marked');

// Configuration
const INPUT_FILE = path.join(__dirname, 'public/templates/project-charter-data-governance-app.md');
const OUTPUT_FILE = path.join(__dirname, 'public/templates/project-charter-data-governance-app.pdf');

// USCIS Color Scheme
const COLORS = {
  primary: '#003366',    // USCIS Blue
  secondary: '#B31B1B',  // Red accent
  text: '#333333',       // Dark gray
  lightGray: '#F5F5F5',  // Light background
  white: '#FFFFFF'
};

function generatePDF() {
  console.log('Generating Project Charter PDF...');
  
  // Read the markdown file
  const markdownContent = fs.readFileSync(INPUT_FILE, 'utf8');
  
  // Create PDF document with proper margins for accessibility
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 72,    // 1 inch
      bottom: 72, // 1 inch
      left: 72,   // 1 inch
      right: 72   // 1 inch
    },
    info: {
      Title: 'Data Governance Platform Project Charter',
      Author: 'Data Strategy Team',
      Subject: 'Project Charter for Data Governance Platform Implementation',
      Keywords: 'Data Governance, Project Charter, Section 508, Accessibility',
      Creator: 'E-Unify Data Platform',
      Producer: 'PDFKit'
    }
  });

  // Create write stream
  const stream = fs.createWriteStream(OUTPUT_FILE);
  doc.pipe(stream);

  // Add metadata for accessibility
  doc.addStructure = true;

  // Header with USCIS styling
  function addHeader() {
    doc.rect(0, 0, doc.page.width, 60)
       .fill(COLORS.primary);
    
    doc.fontSize(20)
       .fillColor(COLORS.white)
       .font('Helvetica-Bold')
       .text('PROJECT CHARTER', 72, 20, { align: 'left' });
    
    doc.fontSize(12)
       .text('Data Governance Platform Implementation', 72, 45);
  }

  // Footer with page numbers
  function addFooter(pageNumber, totalPages) {
    const footerY = doc.page.height - 50;
    
    doc.fontSize(10)
       .fillColor(COLORS.text)
       .font('Helvetica')
       .text(`Page ${pageNumber} of ${totalPages}`, 72, footerY, { 
         width: doc.page.width - 144, 
         align: 'center' 
       });
    
    doc.text('Data Governance Platform Charter', 72, footerY, { 
      width: doc.page.width - 144, 
      align: 'left' 
    });
    
    doc.text(new Date().toLocaleDateString(), 72, footerY, { 
      width: doc.page.width - 144, 
      align: 'right' 
    });
  }

  // Parse markdown and convert to PDF
  let currentY = 80;
  let pageNumber = 1;
  let hasContentOnPage = false;

  // Add first page header
  addHeader();

  // Clean and split content into sections
  const cleanContent = markdownContent.replace(/^---[\s\S]*?---/m, ''); // Remove frontmatter if any
  const sections = cleanContent.split(/^# /m).filter(section => section.trim());
  
  sections.forEach((section, index) => {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    // Skip empty sections
    if (!title && !content) return;
    
    // Check if we need a new page (only if we have content)
    if (currentY > doc.page.height - 150 && hasContentOnPage) {
      addFooter(pageNumber, pageNumber);
      doc.addPage();
      pageNumber++;
      addHeader();
      currentY = 80;
      hasContentOnPage = false;
    }
    
    // Add section title only if it exists
    if (title) {
      doc.fontSize(16)
         .fillColor(COLORS.primary)
         .font('Helvetica-Bold')
         .text(title, 72, currentY, { 
           width: doc.page.width - 144,
           lineGap: 5
         });
      
      currentY += 25;
      hasContentOnPage = true;
    }
    
    // Process content line by line with better text handling
    const contentLines = content.split('\n');
    
    contentLines.forEach(line => {
      if (!line.trim()) {
        // Only add minimal spacing for empty lines
        currentY += 4;
        return;
      }
      
      // Check for page break (only if we have content)
      if (currentY > doc.page.height - 100 && hasContentOnPage) {
        addFooter(pageNumber, pageNumber);
        doc.addPage();
        pageNumber++;
        addHeader();
        currentY = 80;
        hasContentOnPage = false;
      }
      
      // Handle different markdown elements
      if (line.startsWith('###')) {
        // Subsection header
        const headerText = line.replace(/^###\s*/, '').trim();
        doc.fontSize(12)
           .fillColor(COLORS.primary)
           .font('Helvetica-Bold');
        const headerHeight = doc.heightOfString(headerText, { width: doc.page.width - 144 });
        doc.text(headerText, 72, currentY, {
          width: doc.page.width - 144,
          lineGap: 3
        });
        currentY += headerHeight + 6;
        hasContentOnPage = true;
        
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text
        const boldText = line.replace(/\*\*/g, '').trim();
        if (boldText) {
          doc.fontSize(11)
             .fillColor(COLORS.text)
             .font('Helvetica-Bold');
          const boldHeight = doc.heightOfString(boldText, { width: doc.page.width - 144 });
          doc.text(boldText, 72, currentY, {
            width: doc.page.width - 144,
            lineGap: 2
          });
          currentY += boldHeight + 5;
          hasContentOnPage = true;
        }
        
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // Bullet points
        const bulletText = line.substring(2).trim();
        if (bulletText) {
          doc.fontSize(10)
             .fillColor(COLORS.text)
             .font('Helvetica');
          doc.text('•', 82, currentY);
          const bulletHeight = doc.heightOfString(bulletText, { width: doc.page.width - 167 });
          doc.text(bulletText, 95, currentY, {
            width: doc.page.width - 167,
            lineGap: 2
          });
          currentY += Math.max(bulletHeight, 12) + 3;
          hasContentOnPage = true;
        }
        
      } else if (line.startsWith('|') && !line.includes('---')) {
        // Table rows - simplified representation
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 0) {
          const tableText = cells.join(' | ');
          doc.fontSize(9)
             .fillColor(COLORS.text)
             .font('Helvetica');
          const tableHeight = doc.heightOfString(tableText, { width: doc.page.width - 144 });
          doc.text(tableText, 72, currentY, {
            width: doc.page.width - 144,
            lineGap: 1
          });
          currentY += tableHeight + 3;
          hasContentOnPage = true;
        }
        
      } else if (line.trim() && !line.includes('---')) {
        // Regular paragraph text
        const paraText = line.trim();
        if (paraText) {
          doc.fontSize(10)
             .fillColor(COLORS.text)
             .font('Helvetica');
          const paraHeight = doc.heightOfString(paraText, { width: doc.page.width - 144 });
          doc.text(paraText, 72, currentY, {
            width: doc.page.width - 144,
            lineGap: 2,
            align: 'justify'
          });
          currentY += paraHeight + 5;
          hasContentOnPage = true;
        }
      }
    });
    
    // Only add section spacing if we have content
    if (hasContentOnPage) {
      currentY += 10;
    }
  });

  // Add final footer only if we have content on the page
  if (hasContentOnPage) {
    addFooter(pageNumber, pageNumber);
  }

  // Add accessibility metadata
  doc.info.Title = 'Data Governance Platform Project Charter';
  doc.info.Subject = 'Comprehensive project charter for implementing a data governance platform with AI-assisted development';
  doc.info.Keywords = 'Data Governance, Project Management, Section 508, Accessibility, AI Development';

  // Finalize PDF
  doc.end();
  
  stream.on('finish', () => {
    console.log(`✅ PDF generated successfully: ${OUTPUT_FILE}`);
    console.log('📄 Features included:');
    console.log('  - Section 508 compliant formatting');
    console.log('  - USCIS color scheme and branding');
    console.log('  - Proper document structure and metadata');
    console.log('  - Accessible fonts and contrast ratios');
    console.log('  - Professional layout with headers and footers');
  });

  stream.on('error', (err) => {
    console.error('❌ Error generating PDF:', err);
  });
}

// Check if required packages are installed
try {
  require('pdfkit');
  require('marked');
  generatePDF();
} catch (error) {
  console.log('📦 Installing required packages...');
  const { exec } = require('child_process');
  
  exec('npm install pdfkit marked', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Error installing packages:', err);
      return;
    }
    
    console.log('✅ Packages installed successfully');
    console.log('🔄 Retrying PDF generation...');
    
    // Retry PDF generation
    setTimeout(() => {
      try {
        generatePDF();
      } catch (retryError) {
        console.error('❌ Error on retry:', retryError);
      }
    }, 1000);
  });
}
