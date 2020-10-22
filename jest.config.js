module.exports = {
  verbose: false,
  roots: ['<rootDir>/__tests__'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  preset: 'jest-puppeteer',
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testEnvironment: 'jest-environment-puppeteer',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: false,
  reporters: ['default'],
  setupFilesAfterEnv: [
    '<rootDir>/setupFile.ts',
    '<rootDir>/jest-screenshot.ts',
  ],
}
