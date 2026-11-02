angular.module('mymeridian')

.factory('AuthService', function($http, $q, CONFIG, StorageService) {

  function login(msisdn, password, remember) {
    var deferred = $q.defer();
    $http.post(CONFIG.API_BASE + '/auth/login', { msisdn: msisdn, password: password })
      .success(function(data) {
        localStorage.setItem('mym_token', data.token);
        localStorage.setItem('mym_msisdn', data.profile.msisdn);
        if (remember) {
          StorageService.saveCredentials(msisdn, password);
        }
        deferred.resolve(data);
      })
      .error(function(data, status) {
        deferred.reject({ status: status, message: (data && data.message) || 'Login failed' });
      });
    return deferred.promise;
  }

  function isLoggedIn() {
    return !!localStorage.getItem('mym_token');
  }

  function logout() {
    $http.post(CONFIG.API_BASE + '/auth/logout', {});
    StorageService.clearSession();
    window.APP_STATE.account = null;
  }

  function currentMsisdn() {
    return localStorage.getItem('mym_msisdn');
  }

  return {
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    currentMsisdn: currentMsisdn
  };
});
