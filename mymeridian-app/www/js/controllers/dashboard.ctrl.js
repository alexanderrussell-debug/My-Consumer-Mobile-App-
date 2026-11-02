angular.module('mymeridian')

.controller('DashboardCtrl', function($scope, $rootScope, $sce, $state, AccountService, UsageService, PromoService, CONFIG) {

  $scope.loading = true;

  function load() {
    AccountService.getAccount().then(function(acc) {
      $scope.account = acc;
    });
    UsageService.getUsage().then(function(usage) {
      $scope.usage = usage;
      $scope.lastUpdated = new Date();
      $scope.loading = false;
    }, function() {
      $scope.loading = false;
      $scope.error = true;
    });
    PromoService.list().then(function(promos) {
      $scope.promos = promos.map(function(p) {
        p.trustedHtml = $sce.trustAsHtml(p.html);
        return p;
      });
    });
  }

  load();

  // keep balance fresh while the app is open
  setInterval(function() {
    AccountService.getAccount(true);
  }, CONFIG.BALANCE_POLL_MS);

  $rootScope.$on('account:updated', function(e, acc) {
    $scope.account = acc;
  });

  $scope.doRefresh = function() {
    AccountService.getAccount(true).then(function(acc) {
      $scope.account = acc;
    });
    UsageService.getUsage().then(function(usage) {
      $scope.usage = usage;
      $scope.lastUpdated = new Date();
    })['finally'](function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.lastUpdatedText = function() {
    return $scope.lastUpdated ? moment($scope.lastUpdated).fromNow() : '';
  };

  $scope.go = function(state) {
    $state.go(state);
  };
});
