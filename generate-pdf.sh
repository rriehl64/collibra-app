#!/bin/bash
# PDF Generation Script for Documentation
# Removes emojis and creates professional PDFs

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📄 PDF Generation Script${NC}"
echo "================================"

# Check if filename provided
if [ -z "$1" ]; then
    echo "Usage: ./generate-pdf.sh <filename-without-extension>"
    echo ""
    echo "Examples:"
    echo "  ./generate-pdf.sh JANUSGRAPH_DSSS3_CAPABILITIES"
    echo "  ./generate-pdf.sh JANUSGRAPH_EXECUTIVE_BRIEFING"
    echo "  ./generate-pdf.sh JANUSGRAPH_ROI_CALCULATIONS"
    exit 1
fi

FILENAME=$1
INPUT_FILE="docs/${FILENAME}.md"
TEMP_FILE="docs/${FILENAME}_PRINT.md"
OUTPUT_FILE="${FILENAME}.pdf"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: File not found: $INPUT_FILE"
    exit 1
fi

echo "📝 Processing: $INPUT_FILE"

# Remove emojis and create print version
echo "🔄 Removing emojis..."
sed 's/🎯/[PHASE 1]/g; 
     s/🔍/[PHASE 2]/g; 
     s/🏗️/[TECHNICAL]/g; 
     s/📊/[VISUALIZATION]/g; 
     s/🚀/[FUTURE]/g; 
     s/📋/[ACCESS]/g; 
     s/🔒/[SECURITY]/g; 
     s/📞/[SUPPORT]/g; 
     s/📈/[METRICS]/g; 
     s/🎓/[CONCLUSION]/g;
     s/💰/[FINANCIAL]/g;
     s/💡/[KEY POINT]/g;
     s/📚/[DOCUMENTATION]/g;
     s/🎯/[TARGET]/g;
     s/✅/[CHECKMARK]/g;
     s/❌/[X]/g;
     s/⚠️/[WARNING]/g;
     s/🤔/[QUESTION]/g;
     s/📄/[DOCUMENT]/g;
     s/🔐/[SECURE]/g' "$INPUT_FILE" > "$TEMP_FILE"

# Generate PDF
echo "📄 Generating PDF..."
pandoc "$TEMP_FILE" \
    -o "$OUTPUT_FILE" \
    --pdf-engine=xelatex \
    --metadata title="$(basename $FILENAME | sed 's/_/ /g')" \
    --metadata subtitle="USCIS Data Strategy Support Services 3" \
    --metadata date="$(date '+%B %d, %Y')" \
    -V geometry:margin=1in \
    -V mainfont="Arial" \
    --toc \
    --toc-depth=2 \
    2>&1 | grep -v "Missing character"

# Clean up temp file
rm "$TEMP_FILE"

# Check if PDF was created
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo -e "${GREEN}✅ PDF created successfully!${NC}"
    echo "📍 Location: $(pwd)/$OUTPUT_FILE"
    echo "📏 Size: $FILE_SIZE"
    echo ""
    echo "Opening PDF..."
    open "$OUTPUT_FILE"
else
    echo "❌ Error: PDF generation failed"
    exit 1
fi
