angular.module('mymeridian')

.factory('BillService', function($http, $q, CONFIG) {

  function list() {
    var d = $q.defer();
    $http.get(CONFIG.API_BASE + '/bills').success(function(data) { d.resolve(data); }).error(function(e, s) { d.reject(s); });
    return d.promise;
  }

  function get(id) {
    var d = $q.defer();
    $http.get(CONFIG.API_BASE + '/bills/' + id).success(function(data) { d.resolve(data); }).error(function(e, s) { d.reject(s); });
    return d.promise;
  }

  /** opens the payment gateway hosted page */
  function payUrl(bill) {
    return CONFIG.PAYMENT_PAGE + '?merchant=' + CONFIG.PAYMENT_MERCHANT_ID + '&ref=' + bill.id
      + '&amount=' + bill.amount + '&msisdn=' + localStorage.getItem('mym_msisdn')
      + '&token=' + localStorage.getItem('mym_token');
  }

  return { list: list, get: get, payUrl: payUrl };
});
