angular.module('mymeridian')

.controller('LoginCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, AuthService, StorageService, AnalyticsService) {

  $scope.form = { msisdn: '', password: '', remember: true };

  var saved = StorageService.getCredentials();
  if (saved) {
    $scope.form.msisdn = saved.msisdn;
    $scope.form.password = saved.password;
  }

  $scope.login = function() {
    if (!$scope.form.msisdn || !$scope.form.password) {
      $ionicPopup.alert({ title: 'MyMeridian', template: 'Please enter your mobile number and password' });
      return;
    }
    $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
    AuthService.login($scope.form.msisdn, $scope.form.password, $scope.form.remember).then(function() {
      $ionicLoading.hide();
      AnalyticsService.trackEvent('auth', 'login', 'password');
      $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
      $state.go('app.dashboard');
    }, function(err) {
      $ionicLoading.hide();
      $ionicPopup.alert({ title: 'Login failed', template: err.message });
    });
  };

  $scope.touchId = function() {
    if (window.plugins && window.plugins.touchid) {
      window.plugins.touchid.verifyFingerprint('Log in to MyMeridian', function() {
        $scope.login();
      });
    } else {
      $ionicPopup.alert({ title: 'Touch ID', template: 'Touch ID is not available on this device' });
    }
  };
});
