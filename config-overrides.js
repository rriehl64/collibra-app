module.exports = function override(config, env) {
  // Add rules for handling .mjs files
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Just ensure fullySpecified is false for all JS files
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Add module alias for the Elasticsearch client
  config.resolve.alias = {
    ...config.resolve.alias,
    '@elastic/elasticsearch': require.resolve('./src/polyfills/elasticsearch-browser-client.js')
  };
  
  // Still replace Undici with null-loader as it's causing issues
  config.module.rules.push({
    test: /[\\/]node_modules[\\/]undici[\\/].*\.js$/,
    use: 'null-loader',
  });

  // Add Node.js core module polyfills
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      // Basic Node.js polyfills
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "buffer": require.resolve("buffer/"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,
      "os": require.resolve("os-browserify/browser"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "url": require.resolve("url/"),
      "events": require.resolve("events/"),
      "querystring": require.resolve("querystring-es3"),
      
      // Additional polyfills for Undici and other libraries
      "net": false,
      "tls": false,
      "dns": false,
      "child_process": false,
      "worker_threads": false,
      "perf_hooks": false,
      "diagnostics_channel": false,
      "console": require.resolve("console-browserify"),
      "util/types": false,
      "sqlite": false,
      "timers": false,
      "timers/promises": false,
      "async_hooks": false
    },
  };
  
  // Get webpack module
  const webpack = require('webpack');
  
  // Use NormalModuleReplacementPlugin to handle node: protocol imports and problematic modules
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^node:(.*)/,
      (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        resource.request = mod;
      }
    ),
    // Handle async_hooks imports in Undici
    new webpack.NormalModuleReplacementPlugin(
      /async_hooks/,
      require.resolve('./src/polyfills/async-hooks-polyfill.js')
    ),
    // Handle util/types imports in Undici
    new webpack.NormalModuleReplacementPlugin(
      /util\/types$/,
      require.resolve('./src/polyfills/util-types-polyfill.js')
    )
  );

  // Add buffer polyfill
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  return config;
};
