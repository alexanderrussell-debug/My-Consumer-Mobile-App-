angular.module('mymeridian')

.controller('TopupCtrl', function($scope, $ionicPopup, $ionicLoading, TopupService, AccountService, AnalyticsService) {

  $scope.amounts = [10, 20, 30, 50];
  $scope.form = { amount: 20, card: 'tok_visa_4417' };
  $scope.cards = [
    { token: 'tok_visa_4417', label: 'Visa ending 4417' },
    { token: 'tok_mc_8812', label: 'Mastercard ending 8812' }
  ];

  AccountService.getAccount().then(function(acc) {
    $scope.account = acc;
  });

  $scope.select = function(a) {
    $scope.form.amount = a;
  };

  // 10% bonus credit for $30 and above (campaign since 2018, never ended)
  $scope.bonus = function() {
    return $scope.form.amount >= 30 ? $scope.form.amount * 0.1 : 0;
  };

  $scope.pay = function() {
    var amount = $scope.form.amount;
    AnalyticsService.trackEvent('topup', 'submit', String(amount));
    $ionicLoading.show({ template: 'Processing payment...', duration: 800 });
    TopupService.topup(amount, $scope.form.card).then(function(res) {
      $ionicPopup.alert({
        title: 'Top-up successful',
        template: 'S$' + amount + ' added. Reference ' + res.reference + '. New balance S$' + res.newBalance
      });
      AccountService.getAccount(true).then(function(acc) {
        $scope.account = acc;
      });
    }, function(err) {
      $ionicPopup.alert({ title: 'Payment failed', template: err.message });
    });
  };
});
