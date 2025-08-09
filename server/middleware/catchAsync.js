/**
 * Middleware to catch async errors in Express routes and forward them to error handlers
 * This eliminates the need for try/catch blocks in controllers
 * 
 * @param {Function} fn - The asynchronous controller function to wrap
 * @returns {Function} Express middleware function
 */

module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
