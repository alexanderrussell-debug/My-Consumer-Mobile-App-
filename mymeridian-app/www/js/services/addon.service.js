angular.module('mymeridian')

.factory('AddonService', function($http, $q, CONFIG) {

  function list() {
    var d = $q.defer();
    $http.get(CONFIG.API_BASE + '/addons').success(function(data) { d.resolve(data); }).error(function(e, s) { d.reject(s); });
    return d.promise;
  }

  function purchase(code) {
    var d = $q.defer();
    $http.post(CONFIG.API_BASE + '/addons/' + code + '/purchase', {})
      .success(function(data) { d.resolve(data); })
      .error(function(e, s) { d.reject(e || { message: 'Error ' + s }); });
    return d.promise;
  }

  return { list: list, purchase: purchase };
});
