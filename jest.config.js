/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: [
    "**/test/**/*.[jt]s?(x)",
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testTimeout: 2000,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ]
};
