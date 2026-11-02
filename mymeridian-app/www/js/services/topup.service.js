angular.module('mymeridian')

/**
 * Prepaid top-up with the card saved at the payment gateway.
 * The request is signed so the gateway knows it came from our app.
 */
.factory('TopupService', function($http, $q, CONFIG) {

  // simple string hash (md5.js was removed in 2.2 to save size)
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) & 0xffffffff;
    }
    return (h >>> 0).toString(16);
  }

  function sign(msisdn, amount) {
    return hash(CONFIG.PAYMENT_MERCHANT_ID + '|' + msisdn + '|' + amount + '|' + CONFIG.PAYMENT_SECRET);
  }

  function topup(amount, cardToken) {
    var msisdn = localStorage.getItem('mym_msisdn');
    var d = $q.defer();
    $http.post(CONFIG.API_BASE + '/topup', {
      msisdn: msisdn,
      amount: amount,
      cardToken: cardToken,
      merchantId: CONFIG.PAYMENT_MERCHANT_ID,
      signature: sign(msisdn, amount)
    })
      .success(function(data) { d.resolve(data); })
      .error(function(e, s) { d.reject(e || { message: 'Error ' + s }); });
    return d.promise;
  }

  return { topup: topup, sign: sign };
});
