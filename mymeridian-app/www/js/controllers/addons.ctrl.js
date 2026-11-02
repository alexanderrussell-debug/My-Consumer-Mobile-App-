angular.module('mymeridian')

.controller('AddonsCtrl', function($scope, $ionicPopup, $ionicLoading, AddonService, AccountService) {

  AddonService.list().then(function(list) {
    $scope.addons = list;
    // cheapest first
    $scope.addons.sort(function(a, b) {
      return a.price > b.price ? 1 : -1;
    });
  });

  $scope.buy = function(addon) {
    $ionicPopup.confirm({
      title: addon.name,
      template: 'Add ' + addon.name + ' for S$' + addon.price + '? It will be charged to your bill.'
    }).then(function(ok) {
      if (!ok) return;
      $ionicLoading.show({ template: 'Processing...' });
      AddonService.purchase(addon.code).then(function() {
        $ionicLoading.hide();
        $('.addon-' + addon.code).addClass('purchased');
        $ionicPopup.alert({ title: 'Done', template: addon.name + ' has been added.' });
        AccountService.getAccount(true);
      }, function(err) {
        $ionicLoading.hide();
        $ionicPopup.alert({ title: 'Sorry', template: err.message });
      });
    });
  };
});
