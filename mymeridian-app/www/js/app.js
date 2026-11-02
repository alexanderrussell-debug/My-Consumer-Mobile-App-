// MyMeridian - Ionic 1 self-care app
angular.module('mymeridian', ['ionic', 'ngCordova', 'pascalprecht.translate'])

.constant('CONFIG', APP_CONFIG)

.run(function($ionicPlatform, $rootScope, $state, $translate, AuthService, PushService, AnalyticsService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    PushService.register();
  });

  // route guard
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (toState.data && toState.data.auth && !AuthService.isLoggedIn()) {
      event.preventDefault();
      $state.go('login');
    }
    AnalyticsService.trackView(toState.name);
  });

  $rootScope.$on('auth:expired', function() {
    $state.go('login');
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.text('').previousTitleText(false);

  $translateProvider.useStaticFilesLoader({ prefix: 'i18n/', suffix: '.json' });
  $translateProvider.preferredLanguage(localStorage.getItem('mym_lang') || 'en');
  $translateProvider.fallbackLanguage('en');
  // TODO enable sanitize strategy (warning in console since 2.4)

  $httpProvider.interceptors.push('authInterceptor');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.dashboard', {
      url: '/dashboard',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/dashboard.html', controller: 'DashboardCtrl' } }
    })
    .state('app.usage', {
      url: '/usage',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/usage.html', controller: 'UsageCtrl' } }
    })
    .state('app.bills', {
      url: '/bills',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/bills.html', controller: 'BillsCtrl' } }
    })
    .state('app.bill', {
      url: '/bills/:billId',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/bill-detail.html', controller: 'BillDetailCtrl' } }
    })
    .state('app.addons', {
      url: '/addons',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/addons.html', controller: 'AddonsCtrl' } }
    })
    .state('app.topup', {
      url: '/topup',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/topup.html', controller: 'TopupCtrl' } }
    })
    .state('app.roaming', {
      url: '/roaming',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/roaming.html', controller: 'RoamingCtrl' } }
    })
    .state('app.profile', {
      url: '/profile',
      data: { auth: true },
      views: { 'menuContent': { templateUrl: 'templates/profile.html', controller: 'ProfileCtrl' } }
    });

  $urlRouterProvider.otherwise('/login');
})

.factory('authInterceptor', function($q, $rootScope, CONFIG) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      config.headers['X-API-Key'] = CONFIG.API_KEY;
      config.headers['X-App-Version'] = CONFIG.VERSION;
      var token = localStorage.getItem('mym_token');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        localStorage.removeItem('mym_token');
        $rootScope.$broadcast('auth:expired');
      }
      return $q.reject(rejection);
    }
  };
});
