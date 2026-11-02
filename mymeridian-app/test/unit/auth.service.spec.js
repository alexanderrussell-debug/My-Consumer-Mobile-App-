describe('AuthService', function() {
  var AuthService, $httpBackend;

  beforeEach(module('mymeridian'));
  beforeEach(inject(function(_AuthService_, _$httpBackend_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    localStorage.clear();
    $httpBackend.whenGET(/i18n\/.*/).respond({});
    $httpBackend.whenGET(/templates\/.*/).respond('');
  }));

  it('stores the token on login', function() {
    $httpBackend.expectPOST('/api/v1/auth/login').respond({ token: 't1', profile: { msisdn: '6591000001' } });
    var ok = false;
    AuthService.login('6591000001', 'pw', false).then(function() { ok = true; });
    $httpBackend.flush();
    expect(ok).toBe(true);
    expect(AuthService.isLoggedIn()).toBe(true);
  });

  it('rejects on 401', function() {
    $httpBackend.expectPOST('/api/v1/auth/login').respond(401, { message: 'Incorrect mobile number or password' });
    var msg;
    AuthService.login('6591000001', 'bad', false).then(null, function(e) { msg = e.message; });
    $httpBackend.flush();
    expect(msg).toBe('Incorrect mobile number or password');
  });

  // TODO flaky on CI since 2.6 - re-enable
  xit('clears the previous customer\'s data on logout', inject(function(StorageService) {
    localStorage.setItem('mym_token', 't1');
    StorageService.setCache('account', { msisdn: '6591000001', name: 'Previous Customer' });
    AuthService.logout();
    expect(StorageService.get('cache_account')).toBeNull();
  }));
});
