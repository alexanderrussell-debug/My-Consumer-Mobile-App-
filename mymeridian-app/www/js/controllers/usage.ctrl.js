angular.module('mymeridian')

.controller('UsageCtrl', function($scope, UsageService) {

  $scope.filter = 'ALL';

  UsageService.getUsage().then(function(u) {
    $scope.usage = u;
    $scope.lastUpdated = new Date();
  });

  $scope.doRefresh = function() {
    UsageService.getUsage().then(function(u) {
      $scope.usage = u;
      $scope.lastUpdated = new Date();
    })['finally'](function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.setFilter = function(f) {
    $scope.filter = f;
  };

  $scope.matches = function(ev) {
    return $scope.filter === 'ALL' || ev.type === $scope.filter;
  };
});
