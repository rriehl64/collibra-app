const http = require('http');

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/v1/e22/overview/latest',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing E22 overview API endpoint...');

// Make the HTTP request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  // Collect data chunks
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // Process the complete response
  res.on('end', () => {
    try {
      const jsonResponse = JSON.parse(data);
      console.log('\nAPI Response (formatted):');
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.success && jsonResponse.data) {
        console.log('\n✅ API endpoint is working correctly!');
        console.log(`Document ID: ${jsonResponse.data._id}`);
        console.log(`Title: ${jsonResponse.data.mainTitle}`);
        
        // Check key features
        const features = jsonResponse.data.keyFeatures || [];
        console.log(`Key Features count: ${features.length}`);
        
        // Check importance sections
        const importance = jsonResponse.data.importanceDescription || [];
        console.log(`Importance paragraphs count: ${importance.length}`);
      } else {
        console.log('\n❌ API returned success:false or missing data');
      }
    } catch (e) {
      console.error('\n❌ Failed to parse JSON response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

// Handle errors
req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
});

// End the request
req.end();
