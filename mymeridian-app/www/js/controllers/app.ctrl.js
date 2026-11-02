angular.module('mymeridian')

.controller('AppCtrl', function($scope, $rootScope, $state, $ionicHistory, AuthService) {

  $scope.state = window.APP_STATE;

  $scope.isPrepaid = function() {
    return window.APP_STATE.account && window.APP_STATE.account.paymentType === 'PRE';
  };

  $scope.logout = function() {
    AuthService.logout();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $state.go('login');
  };
});
