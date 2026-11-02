angular.module('mymeridian')

.controller('ProfileCtrl', function($scope, $translate, $ionicPopup, AccountService, CONFIG) {

  $scope.version = CONFIG.VERSION;
  $scope.env = CONFIG.ENV;
  $scope.form = {};
  $scope.lang = { value: $translate.use() || 'en' };

  AccountService.getAccount().then(function(acc) {
    $scope.form = { name: acc.name, email: acc.email };
  });

  $scope.save = function() {
    AccountService.updateProfile($scope.form)
      .success(function() {
        $ionicPopup.alert({ title: 'Profile', template: 'Saved' });
        AccountService.getAccount(true);
      })
      .error(function() {
        $ionicPopup.alert({ title: 'Profile', template: 'Could not save, please try again' });
      });
  };

  $scope.setLanguage = function() {
    $translate.use($scope.lang.value);
    localStorage.setItem('mym_lang', $scope.lang.value);
  };
});
