/**
 * API URL Fixer
 * 
 * This script patches XMLHttpRequest and fetch to redirect API calls from port 3001 to port 3002
 * It works at runtime regardless of environment variables or cached builds
 */

(function() {
  console.log('API URL Fixer: Initializing port redirection (3001 → 3002)');
  
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override fetch
  window.fetch = function(resource, init) {
    // Check if this is a URL object or string
    let url = resource;
    
    if (typeof resource === 'string' && resource.includes('localhost:3001')) {
      url = resource.replace('localhost:3001', 'localhost:3002');
      console.log(`API URL Fixer: Redirecting fetch from ${resource} to ${url}`);
    } else if (resource instanceof Request && resource.url.includes('localhost:3001')) {
      const redirectedUrl = resource.url.replace('localhost:3001', 'localhost:3002');
      console.log(`API URL Fixer: Redirecting fetch from ${resource.url} to ${redirectedUrl}`);
      
      // Create new Request with corrected URL
      url = new Request(redirectedUrl, resource);
    }
    
    return originalFetch.call(this, url, init);
  };
  
  // Store original XMLHttpRequest open method
  const originalXHROpen = XMLHttpRequest.prototype.open;
  
  // Override XMLHttpRequest open method
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    let modifiedUrl = url;
    
    if (typeof url === 'string' && url.includes('localhost:3001')) {
      modifiedUrl = url.replace('localhost:3001', 'localhost:3002');
      console.log(`API URL Fixer: Redirecting XHR from ${url} to ${modifiedUrl}`);
    }
    
    return originalXHROpen.call(this, method, modifiedUrl, async, user, password);
  };
  
  // Store original axios if it exists
  if (window.axios) {
    const originalAxiosRequest = window.axios.request;
    
    // Override axios request
    window.axios.request = function(config) {
      if (config.url && config.url.includes('localhost:3001')) {
        config.url = config.url.replace('localhost:3001', 'localhost:3002');
        console.log(`API URL Fixer: Redirecting axios request from ${config.url} to ${config.url}`);
      }
      
      if (config.baseURL && config.baseURL.includes('localhost:3001')) {
        config.baseURL = config.baseURL.replace('localhost:3001', 'localhost:3002');
        console.log(`API URL Fixer: Redirecting axios baseURL from ${config.baseURL} to ${config.baseURL}`);
      }
      
      return originalAxiosRequest.call(this, config);
    };
  }
  
  console.log('API URL Fixer: Port redirection setup complete');
})();

export default {}; // Empty export to satisfy module requirements
