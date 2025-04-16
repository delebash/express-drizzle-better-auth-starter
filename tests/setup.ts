// Global test setup
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Add global test setup here
beforeAll(async () => {
  // Setup global test environment
  console.log('Setting up test environment');
});

afterAll(async () => {
  // Clean up global test environment
  console.log('Cleaning up test environment');
});
