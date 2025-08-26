const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'  // no rewrite needed, just for clarity
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log(`Proxying: ${req.method} ${req.path} to http://localhost:3002${req.path}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );
};
