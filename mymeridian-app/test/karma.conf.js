// Karma config. Was PhantomJS until 2.7 (PhantomJS abandoned) - now Chrome.
// Run: npm test   (needs Chrome installed; CI uses the ChromeNoSandbox launcher)
module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'www/lib/jquery/dist/jquery.min.js',
      'www/lib/ionic/js/ionic.bundle.js',
      'www/lib/angular-translate/angular-translate.js',
      'www/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'www/lib/moment/min/moment.min.js',
      'www/lib/lodash/lodash.js',
      'www/lib/ngCordova/dist/ng-cordova.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/js/config.js',
      'www/js/app.js',
      'www/js/**/*.js',
      'test/unit/**/*.spec.js'
    ],
    browsers: ['ChromeNoSandbox'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--headless', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    reporters: ['progress'],
    singleRun: true
  });
};
