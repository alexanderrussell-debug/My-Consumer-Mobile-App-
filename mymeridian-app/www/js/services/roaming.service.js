angular.module('mymeridian')

.factory('RoamingService', function($http, $q, CONFIG) {

  function get() {
    var d = $q.defer();
    $http.get(CONFIG.API_BASE + '/roaming').success(function(data) { d.resolve(data); }).error(function(e, s) { d.reject(s); });
    return d.promise;
  }

  /** switches roaming on/off on the network (backend calls NetProv) */
  function set(enabled) {
    return $http.put(CONFIG.API_BASE + '/roaming', { enabled: enabled });
  }

  return { get: get, set: set };
});
