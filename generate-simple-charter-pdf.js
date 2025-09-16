const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Configuration
const OUTPUT_FILE = path.join(__dirname, 'public/templates/project-charter-data-governance-app.pdf');

// USCIS Color Scheme
const COLORS = {
  primary: '#003366',
  text: '#333333',
  white: '#FFFFFF'
};

function generateSimplePDF() {
  console.log('Generating Simple Project Charter PDF...');
  
  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Create write stream
  const stream = fs.createWriteStream(OUTPUT_FILE);
  doc.pipe(stream);

  // Title
  doc.fontSize(20)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Project Charter: Data Governance Platform Delivery', 50, 50);

  doc.fontSize(12)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('Project Code: DGP-2025-001', 50, 80)
     .text('Charter Date: September 2, 2025', 50, 95);

  let y = 130;

  // Project Overview
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('1. Project Overview', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('Deliver a comprehensive, AI-assisted data governance platform that enables organizational data literacy, compliance management, and strategic data asset management.', 50, y, { width: 500 });

  y += 40;

  // Business Case
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('2. Business Case', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('• Cost Avoidance: $23,985 vs. traditional development', 50, y)
     .text('• Time-to-Market: 75% reduction in delivery timeline', 50, y + 15)
     .text('• Compliance: Built-in Section 508 and GDPR compliance', 50, y + 30)
     .text('• Strategic Value: Foundation for enterprise data governance', 50, y + 45);

  y += 80;

  // Key Deliverables
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('3. Key Deliverables', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('• React-based web application with TypeScript', 50, y)
     .text('• Node.js/Express backend with MongoDB integration', 50, y + 15)
     .text('• Complete authentication and authorization system', 50, y + 30)
     .text('• Section 508 compliant user interface', 50, y + 45)
     .text('• Data catalog with advanced search capabilities', 50, y + 60)
     .text('• Data governance workflows and policy management', 50, y + 75);

  y += 110;

  // Timeline
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('4. Timeline & Milestones', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('Week 1: Foundation and architecture design', 50, y)
     .text('Week 2: Core development and database setup', 50, y + 15)
     .text('Week 3: Feature implementation and testing', 50, y + 30)
     .text('Week 4: Deployment and go-live', 50, y + 45);

  y += 80;

  // Budget
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('5. Budget Analysis', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('Traditional Development Cost: $34,000', 50, y)
     .text('AI-Assisted Development Cost: $2,515', 50, y + 15)
     .text('Total Savings: $31,485 (92.6% reduction)', 50, y + 30)
     .text('ROI: 1,252% return on investment', 50, y + 45);

  y += 80;

  // Success Metrics
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('6. Success Metrics', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('• 99.5% system uptime', 50, y)
     .text('• 80% user adoption within 90 days', 50, y + 15)
     .text('• >4.5/5 user satisfaction score', 50, y + 30)
     .text('• 100% Section 508 compliance', 50, y + 45);

  // Add new page for additional content
  doc.addPage();
  y = 50;

  // Risk Management
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('7. Risk Management', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('• Accessibility Compliance: Early testing and expert review', 50, y)
     .text('• User Adoption: Comprehensive training and change management', 50, y + 15)
     .text('• Security: Security-first development and penetration testing', 50, y + 30)
     .text('• Performance: Load testing and monitoring', 50, y + 45);

  y += 80;

  // Stakeholders
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('8. Key Stakeholders', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('• Chief Data Officer (Executive Sponsor)', 50, y)
     .text('• IT Director (Technical Sponsor)', 50, y + 15)
     .text('• Data Stewards (Primary Users)', 50, y + 30)
     .text('• Compliance Officer (Compliance Reviewer)', 50, y + 45)
     .text('• Security Team (Security Review)', 50, y + 60);

  y += 95;

  // Approval Section
  doc.fontSize(14)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('9. Charter Approval', 50, y);
  
  y += 25;
  doc.fontSize(10)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('Executive Sponsor: _________________________ Date: _______', 50, y)
     .text('Project Manager: __________________________ Date: _______', 50, y + 25)
     .text('Technical Lead: ___________________________ Date: _______', 50, y + 50)
     .text('Business SME: _____________________________ Date: _______', 50, y + 75);

  // Footer
  doc.fontSize(8)
     .fillColor(COLORS.text)
     .text('Data Governance Platform Charter - Internal Use', 50, 750)
     .text('Page 1 of 2', 500, 750);

  // Finalize PDF
  doc.end();
  
  stream.on('finish', () => {
    console.log(`✅ Simple PDF generated successfully: ${OUTPUT_FILE}`);
    console.log('📄 Contains essential project charter information');
    console.log('🔗 Access at: http://localhost:3008/templates/project-charter-data-governance-app.pdf');
  });

  stream.on('error', (err) => {
    console.error('❌ Error generating PDF:', err);
  });
}

// Generate the PDF
try {
  generateSimplePDF();
} catch (error) {
  console.error('❌ Error:', error);
}
