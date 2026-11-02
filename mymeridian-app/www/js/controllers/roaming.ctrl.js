angular.module('mymeridian')

.controller('RoamingCtrl', function($scope, $ionicLoading, RoamingService, StorageService, AnalyticsService) {

  var local = StorageService.get('roaming_state');
  $scope.roaming = { enabled: local === null ? false : local };

  // only ask the server if we don't know yet (saves an API call, MYM-201)
  if (local === null) {
    RoamingService.get().then(function(r) {
      $scope.roaming.enabled = r.enabled;
      $scope.roaming.zones = r.zones;
      StorageService.set('roaming_state', r.enabled);
    });
  }

  $scope.toggle = function() {
    var enabled = $scope.roaming.enabled;
    AnalyticsService.trackEvent('roaming', enabled ? 'on' : 'off');
    StorageService.set('roaming_state', enabled);
    $ionicLoading.show({ template: enabled ? 'Roaming is now ON' : 'Roaming is now OFF', duration: 1500 });
    RoamingService.set(enabled).then(function() {
      // ok
    }, function(err) {
      console.log('roaming update failed', err && err.status);
    });
  };
});
