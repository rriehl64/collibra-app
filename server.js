const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

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

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Documentation path:', path.join(__dirname, 'docs'));
});
