require('dotenv').config();
const axios = require('axios');

// Function to test updating an asset through the API
async function testApiUpdate() {
  try {
    // First, authenticate to get a token
    console.log('Authenticating...');
    const authResponse = await axios.post('http://localhost:3002/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'admin123!'
    });
    
    const token = authResponse.data.token;
    console.log('Authentication successful, got token');
    
    // Set up axios with the authentication token
    const api = axios.create({
      baseURL: 'http://localhost:3002/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // First, get the asset we want to update
    console.log('\nFetching Customer Data Warehouse 567...');
    const searchResponse = await api.get('/data-assets?q=567');
    
    if (searchResponse.data.data.length === 0) {
      console.error('Asset not found');
      return;
    }
    
    const asset = searchResponse.data.data[0];
    console.log(`Found asset: ${asset.name} (${asset._id})`);
    
    // Prepare update payload
    const updatePayload = {
      ...asset,
      description: `Updated via test script at ${new Date().toISOString()}`
    };
    
    // Update the asset
    console.log('\nUpdating asset...');
    try {
      const updateResponse = await api.put(`/data-assets/${asset._id}`, updatePayload);
      console.log('✅ Update successful!');
      console.log(`Status: ${updateResponse.status}`);
      console.log('Updated asset:', updateResponse.data);
    } catch (updateError) {
      console.error('❌ Update failed!');
      console.error('Status:', updateError.response?.status);
      console.error('Error:', updateError.response?.data || updateError.message);
      
      // Let's try a minimal update with just essential fields
      console.log('\nTrying minimal update with essential fields only...');
      try {
        const minimalPayload = {
          name: asset.name,
          type: asset.type,
          domain: asset.domain,
          owner: asset.owner || 'Data Team',
          status: asset.status || 'Development',
          description: `Minimal update at ${new Date().toISOString()}`
        };
        
        const minUpdateResponse = await api.put(`/data-assets/${asset._id}`, minimalPayload);
        console.log('✅ Minimal update successful!');
        console.log(`Status: ${minUpdateResponse.status}`);
      } catch (minError) {
        console.error('❌ Minimal update failed!');
        console.error('Status:', minError.response?.status);
        console.error('Error:', minError.response?.data || minError.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the test
testApiUpdate();
