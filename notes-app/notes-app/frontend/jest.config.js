export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/tests/**/*.test.jsx', '<rootDir>/tests/**/*.test.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
