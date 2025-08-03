// Script to create minimal valid ending for DataCatalog.tsx
const fs = require('fs');

// Find accessibility announcer section
const content = fs.readFileSync('./src/pages/DataCatalog.tsx', 'utf8');
fs.writeFileSync('./src/pages/DataCatalog.tsx.minimal_fix.bak', content);

// Find a reliable marker before the problematic ending
const markerIndex = content.indexOf('id="accessibility-announcer"');

if (markerIndex !== -1) {
  // Get content up to the marker
  const safeContent = content.substring(0, markerIndex + 25);
  
  // Add the rest of the accessibility announcer and proper component ending
  const fixedContent = `${safeContent}"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      />
    </Box>
  );
};

export default DataCatalog;
`;

  // Write the fixed content to the file
  fs.writeFileSync('./src/pages/DataCatalog.tsx', fixedContent);
  console.log('Created minimal valid ending for DataCatalog.tsx');
} else {
  console.log('Could not find marker in file');
}
