angular.module('mymeridian')

.controller('BillsCtrl', function($scope, BillService) {
  BillService.list().then(function(bills) {
    $scope.bills = bills;
  });
})

.controller('BillDetailCtrl', function($scope, $stateParams, BillService, AnalyticsService) {
  BillService.get($stateParams.billId).then(function(bill) {
    $scope.bill = bill;
  });

  $scope.pay = function() {
    AnalyticsService.trackEvent('bill', 'pay', $scope.bill.id);
    // InAppBrowser on device; new tab in browser
    window.open(BillService.payUrl($scope.bill), '_blank', 'location=yes');
  };
});
