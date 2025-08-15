#!/bin/bash

# Run DataAssetCard tests with detailed output
echo "Running DataAssetCard Accessibility Tests..."
npx jest DataAssetCard.accessibility.test.tsx --verbose

echo ""
echo "Running DataAssetCard Functional Tests..."
npx jest DataAssetCard.functional.test.tsx --verbose

# Generate coverage report
echo ""
echo "Generating test coverage report..."
npx jest --coverage --collectCoverageFrom="src/components/DataCatalog/*.tsx"

echo ""
echo "Tests completed. Opening browser-based test runner..."
open src/tests/browser-tests/accessibility-test-runner.html
