const axios = require('axios');

const API_URL = 'http://localhost:3002/api/v1';

// Test admin credentials (you'll need to use actual admin token)
const TEST_ADMIN_TOKEN = 'your-admin-token-here';

const testMenuManagement = async () => {
  console.log('🧪 Testing Menu Management API...\n');

  try {
    // Test 1: Initialize menu items
    console.log('1. Testing menu initialization...');
    try {
      const initResponse = await axios.post(
        `${API_URL}/menu-settings/initialize`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Menu items initialized successfully');
      console.log(`   Created ${initResponse.data.count} menu items\n`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already initialized')) {
        console.log('ℹ️  Menu items already initialized\n');
      } else {
        console.log('❌ Failed to initialize menu items:', error.response?.data?.message || error.message);
      }
    }

    // Test 2: Get all menu settings
    console.log('2. Testing get all menu settings...');
    try {
      const allMenusResponse = await axios.get(
        `${API_URL}/menu-settings`,
        {
          headers: {
            'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`
          }
        }
      );
      console.log('✅ Retrieved all menu settings successfully');
      console.log(`   Found ${allMenusResponse.data.count} menu items\n`);
      
      // Find E22 menu item for testing
      const e22Item = allMenusResponse.data.data.find(item => item.menuId === 'e22-classification');
      if (e22Item) {
        console.log('3. Testing E22 menu item toggle...');
        const toggleResponse = await axios.patch(
          `${API_URL}/menu-settings/${e22Item._id}/toggle`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`
            }
          }
        );
        console.log('✅ E22 menu item toggled successfully');
        console.log(`   E22 is now: ${toggleResponse.data.data.isEnabled ? 'ENABLED' : 'DISABLED'}\n`);
      }
    } catch (error) {
      console.log('❌ Failed to get menu settings:', error.response?.data?.message || error.message);
    }

    // Test 3: Get enabled menu items (public endpoint)
    console.log('4. Testing get enabled menu items (public)...');
    try {
      const enabledResponse = await axios.get(`${API_URL}/menu-settings/enabled`);
      console.log('✅ Retrieved enabled menu items successfully');
      console.log(`   Found ${enabledResponse.data.count} enabled menu items\n`);
      
      // Show E22 status
      const e22Enabled = enabledResponse.data.data.find(item => item.menuId === 'e22-classification');
      console.log(`   E22 Classification: ${e22Enabled ? 'VISIBLE' : 'HIDDEN'} in menu\n`);
    } catch (error) {
      console.log('❌ Failed to get enabled menu items:', error.response?.data?.message || error.message);
    }

    console.log('🎉 Menu Management API testing completed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Login as admin user in the web app');
    console.log('   2. Navigate to /admin/menu-management');
    console.log('   3. Click "Initialize Menu Items" if needed');
    console.log('   4. Toggle E22 Classification on/off');
    console.log('   5. Check the sidebar to see changes');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
};

// Note: This test requires an admin token
console.log('⚠️  To run this test, you need to:');
console.log('   1. Login as admin in the web app');
console.log('   2. Get your JWT token from localStorage');
console.log('   3. Replace TEST_ADMIN_TOKEN with your actual token');
console.log('   4. Run: node test-menu-management.js\n');

// Uncomment to run the test (after setting up admin token)
// testMenuManagement();
