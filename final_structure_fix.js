// Script to fix the structure of DataCatalog.tsx
const fs = require('fs');

// Make backup of original file
const origFile = './src/pages/DataCatalog.tsx';
const backupFile = './src/pages/DataCatalog.tsx.final_structure.bak';
fs.copyFileSync(origFile, backupFile);

// Read the file content
let content = fs.readFileSync(origFile, 'utf8');

// Find an alternative approach - look for the end of the first major Container which should be at line ~1160
const firstContainerMatch = content.match(/(\s*)<Container maxWidth="lg">/);
if (firstContainerMatch) {
  // Get the indentation used before the container
  const indent = firstContainerMatch[1];
  
  // Find a point right after the container that we can keep most of the file but fix the ending
  const keepContentUpTo = content.indexOf('{/* Accessibility announcer for screen readers');
  
  if (keepContentUpTo !== -1) {
    // Keep everything up to the accessibility announcer
    const goodPart = content.substring(0, keepContentUpTo);
    
    // Add a clean, properly formatted accessibility announcer and component ending
    const cleanEnding = `${indent}{/* Accessibility announcer for screen readers - invisible but read by assistive technology */}
${indent}<div
${indent}  id="accessibility-announcer"
${indent}  aria-live="polite"
${indent}  aria-atomic="true"
${indent}  style={{
${indent}    position: 'absolute',
${indent}    width: '1px',
${indent}    height: '1px',
${indent}    margin: '-1px',
${indent}    padding: 0,
${indent}    overflow: 'hidden',
${indent}    clip: 'rect(0, 0, 0, 0)',
${indent}    whiteSpace: 'nowrap',
${indent}    border: 0
${indent}  }}
${indent}/>
${indent.substring(0, indent.length - 2)}</Box>
${indent.substring(0, indent.length - 4)});
};

export default DataCatalog;
`;

    // Create the fixed file
    fs.writeFileSync(origFile, goodPart + cleanEnding);
    console.log('Successfully fixed the structure of DataCatalog.tsx');
  } else {
    console.error('Could not find accessibility announcer marker');
  }
} else {
  console.error('Could not find container marker');
}
