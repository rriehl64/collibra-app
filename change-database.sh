#!/bin/bash

# Stop the server if it's running
echo "Stopping any running servers..."
npx kill-port 3002 3006

# Update the MongoDB URI in the .env file
echo "Updating .env file to use data-literacy-support database..."
if grep -q "MONGO_URI=" .env; then
  # Replace existing MONGO_URI line
  sed -i '' 's|MONGO_URI=.*|MONGO_URI=mongodb://localhost:27017/data-literacy-support|' .env
else
  # Add MONGO_URI line if it doesn't exist
  echo "MONGO_URI=mongodb://localhost:27017/data-literacy-support" >> .env
fi

echo "Done! MongoDB is now configured to use data-literacy-support database."
echo "You can restart your server with 'npm run dev'"
