export default {
  collectCoverage: true,
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts'],
  coveragePathIgnorePatterns: [],
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.ts'],
  moduleNameMapper: {
    '@/__test__/(.*)': '<rootDir>/test/$1',
    '@monitor/(.*)': '<rootDir>/packages/$1/src/index'
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      diagnostics: false
    },
    fetch: function(url, options) {
      return Promise.resolve(options)
    },
    XMLHttpRequest: function() {
      
    }
  },
  testEnvironment: 'jsdom',
}
