describe('TopupService', function() {
  beforeEach(module('mymeridian'));

  it('signs requests deterministically', inject(function(TopupService) {
    expect(TopupService.sign('6581000001', 20)).toBe(TopupService.sign('6581000001', 20));
    expect(TopupService.sign('6581000001', 20)).not.toBe(TopupService.sign('6581000001', 30));
  }));
});
