angular.module('mymeridian')

.factory('AccountService', function($http, $q, $rootScope, CONFIG, StorageService) {

  function getAccount(force) {
    var deferred = $q.defer();
    var cached = StorageService.getCache('account', CONFIG.USAGE_CACHE_TTL);
    if (cached && !force) {
      window.APP_STATE.account = cached;
      deferred.resolve(cached);
      return deferred.promise;
    }
    $http.get(CONFIG.API_BASE + '/account')
      .success(function(data) {
        StorageService.setCache('account', data);
        window.APP_STATE.account = data;
        $rootScope.$broadcast('account:updated', data);
        deferred.resolve(data);
      })
      .error(function(data, status) {
        deferred.reject(status);
      });
    return deferred.promise;
  }

  function updateProfile(profile) {
    return $http.put(CONFIG.API_BASE + '/profile', profile);
  }

  return {
    getAccount: getAccount,
    updateProfile: updateProfile
  };
});
