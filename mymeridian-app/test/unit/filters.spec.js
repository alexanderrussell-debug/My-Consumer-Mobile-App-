describe('filters', function() {
  beforeEach(module('mymeridian'));

  it('formats SGD', inject(function(sgdFilter) {
    expect(sgdFilter(12.5)).toBe('S$12.50');
    expect(sgdFilter('5')).toBe('S$5.00');
    expect(sgdFilter(null)).toBe('');
  }));

  it('formats data sizes', inject(function(dataSizeFilter) {
    expect(dataSizeFilter(2.83)).toBe('2.8 GB');
    expect(dataSizeFilter(0.5)).toBe('512 MB');
  }));
});
