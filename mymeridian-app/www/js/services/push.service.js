angular.module('mymeridian')

/** phonegap-plugin-push 1.x (GCM). FCM migration: MYM-310. */
.factory('PushService', function($http, CONFIG) {

  function register() {
    if (!window.PushNotification) {
      console.log('[push] plugin not available (browser?)');
      return;
    }
    var push = PushNotification.init({
      android: { senderID: CONFIG.GCM_SENDER_ID },
      ios: { alert: 'true', badge: 'true', sound: 'true' }
    });
    push.on('registration', function(data) {
      localStorage.setItem('mym_push_token', data.registrationId);
      $http.post(CONFIG.API_BASE + '/push/register', { token: data.registrationId, platform: ionic.Platform.platform() });
    });
    push.on('notification', function(data) {
      alert(data.title + '\n' + data.message);
    });
  }

  return { register: register };
});
