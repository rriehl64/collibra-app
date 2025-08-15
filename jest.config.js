// jest.config.js
module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    // Handle TypeScript files with ts-jest
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // Handle JavaScript files with babel-jest
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Transform these modules which are usually excluded from transformation
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|axios)/)'
  ],
  // Setup files for Jest environment
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
  ],
  // Tell Jest to handle CSS and other non-JavaScript files
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  }
};
