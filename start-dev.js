/**
 * Custom development start script 
 * This sets the correct API URL before starting the application
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Set environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3002/api/v1';
console.log('Setting REACT_APP_API_URL to:', process.env.REACT_APP_API_URL);

// Function to start the frontend
const startFrontend = () => {
  console.log('Starting React frontend on port 3006...');
  const frontend = spawn('npm', ['start'], {
    env: { ...process.env, PORT: 3006 },
    stdio: 'inherit',
    shell: true
  });

  frontend.on('close', code => {
    console.log(`Frontend process exited with code ${code}`);
  });
};

// Function to start the backend
const startBackend = () => {
  console.log('Starting Node.js backend on port 3002...');
  const backend = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: 3002 },
    stdio: 'inherit',
    shell: true
  });

  backend.on('close', code => {
    console.log(`Backend process exited with code ${code}`);
  });
};

// Start both processes
startBackend();
startFrontend();

console.log('Development environment started!');
console.log('- Frontend: http://localhost:3006');
console.log('- Backend: http://localhost:3002/api/v1');
