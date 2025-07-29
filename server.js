const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const dataAssets = require('./server/routes/dataAssets');
const auth = require('./server/routes/auth');
const policies = require('./server/routes/policies');
const dashboard = require('./server/routes/dashboard');

const app = express();

// Enable CORS for specific origin
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3002',
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Body parser
app.use(express.json());

// Cookie parser with proper configuration for cross-origin cookies
app.use(cookieParser());

// Configure cookie settings for JWT
app.use((req, res, next) => {
  // Set sameSite to 'lax' for development to allow cross-origin cookies
  res.cookie = res.cookie.bind(res);
  const originalCookie = res.cookie;
  res.cookie = function(name, value, options) {
    const newOptions = {
      ...options,
      sameSite: 'lax',  // Required for cross-origin cookies
      secure: process.env.NODE_ENV === 'production'
    };
    return originalCookie.call(this, name, value, newOptions);
  };
  next();
});

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve documentation files with explicit handling
app.get('/docs/:file', (req, res) => {
  const filePath = path.join(__dirname, 'docs', req.params.file);
  console.log('Attempting to serve file:', filePath);
  
  if (fs.existsSync(filePath)) {
    console.log('File exists, sending...');
    res.setHeader('Content-Type', 'text/markdown');
    res.sendFile(filePath);
  } else {
    console.log('File not found');
    res.status(404).send('File not found');
  }
});

// Mount API routers
app.use('/api/v1/data-assets', dataAssets);
app.use('/api/v1/auth', auth);
app.use('/api/v1/policies', policies);
app.use('/api/v1/dashboard', dashboard);

// Only serve static files and handle React routing in production mode
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // In development mode, the React dev server handles the frontend
  app.get('/', (req, res) => {
    res.json({ message: 'API server running. Frontend is served by React dev server on port 3000.' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const port = process.env.PORT || 3001;  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Documentation path:', path.join(__dirname, 'docs'));
});
