angular.module('mymeridian')

/** Marketing banners from the CMS (HTML snippets). */
.factory('PromoService', function($http, $q, CONFIG) {

  function list() {
    var d = $q.defer();
    $http.get(CONFIG.API_BASE + '/promos').success(function(data) { d.resolve(data); }).error(function() { d.resolve([]); });
    return d.promise;
  }

  return { list: list };
});
