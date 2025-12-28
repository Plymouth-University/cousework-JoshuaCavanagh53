module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'Backend/**/*.js',
    '!Backend/node_modules/**',
  ],
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};