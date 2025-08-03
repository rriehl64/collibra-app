#!/bin/bash
# Create backup
cp src/pages/DataCatalog.tsx src/pages/DataCatalog.tsx.final_fix.bak

# Find the line number where we have the accessibility announcer
ANNOUNCER_LINE=$(grep -n "id=\"accessibility-announcer\"" src/pages/DataCatalog.tsx | cut -d':' -f1)

# Calculate end of file line and cut the file there
if [ ! -z "$ANNOUNCER_LINE" ]; then
  END_LINE=$((ANNOUNCER_LINE + 15))
  head -n $END_LINE src/pages/DataCatalog.tsx > src/pages/DataCatalog.tsx.tmp
  
  # Add proper ending
  cat >> src/pages/DataCatalog.tsx.tmp << 'EOT'
      />
    </Box>
  );
};

export default DataCatalog;
EOT

  # Replace the original file
  mv src/pages/DataCatalog.tsx.tmp src/pages/DataCatalog.tsx
  echo "Fixed file structure successfully"
else
  echo "Could not find accessibility announcer to anchor the fix"
fi
