angular.module('mymeridian')

.factory('UsageService', function($http, $q, CONFIG, StorageService) {

  /**
   * @param forceRefresh bypass cache (pull-to-refresh)
   */
  function getUsage(forceRefresh) {
    var deferred = $q.defer();
    var cached = StorageService.getCache('usage', CONFIG.USAGE_CACHE_TTL);
    if (cached && !forceRefresh) {
      deferred.resolve(cached);
      return deferred.promise;
    }
    $http.get(CONFIG.API_BASE + '/usage')
      .success(function(data) {
        // convert to GB for display
        data.data.usedGb = data.data.usedKb / 1024 / 1024;
        data.data.allowanceGb = data.data.allowanceMb / 1024;
        data.data.remainingGb = Math.max(0, data.data.allowanceGb - data.data.usedGb);
        StorageService.setCache('usage', data);
        deferred.resolve(data);
      })
      .error(function(data, status) {
        deferred.reject(status);
      });
    return deferred.promise;
  }

  return {
    getUsage: getUsage
  };
});
