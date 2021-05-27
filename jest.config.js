module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    '\\.{scss|css|sass}$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.spec.(ts|tsx)',
    '!src/**/_app.(ts|tsx)',
    '!src/**/_doc.(ts|tsx)',
  ],
  coverageReporters: ['lcov', 'json'],
};
