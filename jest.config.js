module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/**/*.spec.js',
  ],
  coverageDirectory: './build/coverage',
  projects: [
    {
      displayName: 'web tests',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/**/?(*.)spec.js',
        '**/src/**/?(*.)web.spec.js',
        '!**/src/**/?(*.)node.spec.js',
      ],
    },
    {
      displayName: 'node tests',
      testEnvironment: 'node',
      testMatch: [
        '**/src/**/?(*.)spec.js',
        '**/src/**/?(*.)node.spec.js',
        '!**/src/**/?(*.)web.spec.js',
      ],
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
