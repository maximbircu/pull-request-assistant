const config = {
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['src/di'],
    coverageDirectory: './reports/coverage',
    reporters: ['default', ['./node_modules/jest-html-reporter', {
        'pageTitle': 'Test Report',
        'append': false,
        'includeFailureMsg': true,
        'includeSuiteFailure': true,
        'outputPath': './reports/test/test-report.html'
    }]]
}

module.exports = config
