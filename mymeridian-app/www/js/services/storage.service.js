angular.module('mymeridian')

/**
 * localStorage wrapper + simple response cache.
 */
.factory('StorageService', function() {

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function get(key) {
    var v = localStorage.getItem(key);
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch (e) {
      return null;
    }
  }

  // ---- cache (MYM-201: reduce API calls, backend team asked for it) ----

  function setCache(key, data) {
    set('cache_' + key, { data: data, savedAt: moment().unix() });
  }

  /** returns cached data if younger than ttl, else null */
  function getCache(key, ttl) {
    var c = get('cache_' + key);
    if (!c) return null;
    if (moment().unix() - c.savedAt < ttl) {
      return c.data;
    }
    return null;
  }

  // ---- remember me ----

  function saveCredentials(msisdn, password) {
    // encoded so it's not plain text
    localStorage.setItem('mym_remember', btoa(msisdn + ':' + password));
  }

  function getCredentials() {
    var v = localStorage.getItem('mym_remember');
    if (!v) return null;
    var parts = atob(v).split(':');
    return { msisdn: parts[0], password: parts[1] };
  }

  function clearSession() {
    localStorage.removeItem('mym_token');
    localStorage.removeItem('mym_msisdn');
  }

  return {
    set: set,
    get: get,
    setCache: setCache,
    getCache: getCache,
    saveCredentials: saveCredentials,
    getCredentials: getCredentials,
    clearSession: clearSession
  };
});
