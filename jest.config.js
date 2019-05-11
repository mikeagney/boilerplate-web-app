module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/**/*.spec.js'],
  coverageDirectory: './build/coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 96,
      lines: 98,
      statements: 98,
    },
  },
  projects: [
    {
      displayName: 'web tests',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/**/?(*.)spec.js',
        '**/src/**/?(*.)web.spec.js',
        '!**/src/**/?(*.)node.spec.js',
      ],
      setupFiles: ['<rootDir>/test/jest-setup.js'],
    },
    {
      displayName: 'node tests',
      testEnvironment: 'node',
      testMatch: [
        '**/src/**/?(*.)spec.js',
        '**/src/**/?(*.)node.spec.js',
        '!**/src/**/?(*.)web.spec.js',
      ],
      setupFiles: ['<rootDir>/test/jest-setup.js'],
    },
  ],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'TestReport',
        outputPath: './build/test-report.html',
      },
    ],
  ],
};
