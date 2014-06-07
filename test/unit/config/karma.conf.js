'use strict';

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        basePath: '../../../',
        files: [
            'test/unit/bower_components/angular/angular.min.js',
            'test/unit/bower_components/angular-mocks/angular-mocks.js',
            'src/angular-ui-tree-filter.defs.js',
            'src/add-ons/*.js',
            'test/unit/spec/**/*.defs.js',
        ],
        port: 8080,
        runnerPort: 9100,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        reporters: ['progress'],
        colors: true,
        captureTimeout: 60000,
        reportSlowerThan: 10,
    });
};
