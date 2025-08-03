/**
 * Polyfill for Node.js async_hooks module
 * This provides empty implementations of the async_hooks functionality needed by Undici
 */

// Mock createHook function that returns an object with enable/disable methods
const createHook = () => ({
  enable: () => {},
  disable: () => {}
});

// Mock execution context tracking
const executionAsyncId = () => 0;
const triggerAsyncId = () => 0;

// Export the polyfilled functionality
module.exports = {
  createHook,
  executionAsyncId,
  triggerAsyncId,
  // Add any other async_hooks exports Undici might need
  AsyncLocalStorage: class AsyncLocalStorage {
    getStore() { return null; }
    run(store, callback, ...args) { return callback(...args); }
    exit(callback, ...args) { return callback(...args); }
    disable() { return true; }
    enterWith() {}
  }
};
