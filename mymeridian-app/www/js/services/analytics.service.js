angular.module('mymeridian')

/** Google Analytics (cordova-plugin-google-analytics removed in 2.6, web GA never wired back). */
.factory('AnalyticsService', function(CONFIG) {
  return {
    trackView: function(name) {
      if (CONFIG.ENV !== 'PROD') console.log('[analytics] view ' + name);
    },
    trackEvent: function(category, action, label) {
      if (CONFIG.ENV !== 'PROD') console.log('[analytics] event ' + category + '/' + action + '/' + (label || ''));
    }
  };
});
