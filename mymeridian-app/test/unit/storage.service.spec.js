describe('StorageService', function() {
  var StorageService;

  beforeEach(module('mymeridian'));
  beforeEach(inject(function(_StorageService_) {
    StorageService = _StorageService_;
    localStorage.clear();
  }));

  it('stores and reads JSON', function() {
    StorageService.set('k', { a: 1 });
    expect(StorageService.get('k').a).toBe(1);
  });

  it('returns cached data while fresh', function() {
    StorageService.setCache('usage', { x: 42 });
    expect(StorageService.getCache('usage', 15 * 60 * 1000).x).toBe(42);
  });

  it('remembers credentials', function() {
    StorageService.saveCredentials('6591000001', 'secret');
    expect(StorageService.getCredentials().password).toBe('secret');
  });

  it('clears the session on logout', function() {
    localStorage.setItem('mym_token', 'abc');
    StorageService.clearSession();
    expect(localStorage.getItem('mym_token')).toBeNull();
  });
});
