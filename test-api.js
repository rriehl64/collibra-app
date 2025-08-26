const axios = require('axios');

// Function to test API endpoints
async function testEndpoints() {
  try {
    console.log('Testing E22 Overview API endpoint...');
    const overviewResponse = await axios.get('http://localhost:3002/api/v1/e22/overview');
    console.log('Overview API Status:', overviewResponse.status);
    console.log('Overview data:', JSON.stringify(overviewResponse.data, null, 2).substring(0, 300) + '...');
    console.log(`Key Features count: ${overviewResponse.data.data.keyFeatures?.length || 0}`);
    console.log(`Importance paragraphs count: ${overviewResponse.data.data.importanceDescription?.length || 0}`);
    
    console.log('\nTesting E22 Application Requirements API endpoint...');
    const requirementsResponse = await axios.get('http://localhost:3002/api/v1/e22/application-requirements/latest');
    console.log('Requirements API Status:', requirementsResponse.status);
    console.log('Requirements data:', JSON.stringify(requirementsResponse.data, null, 2).substring(0, 300) + '...');
    console.log(`Forms count: ${requirementsResponse.data.data.forms?.length || 0}`);
    console.log(`Supporting Docs count: ${requirementsResponse.data.data.supportingDocuments?.length || 0}`);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testEndpoints();
