angular.module('mymeridian')

/**
 * <usage-bar label="Data" used="usage.data.usedGb" total="usage.data.allowanceGb" unit="GB"></usage-bar>
 */
.directive('usageBar', function() {
  return {
    restrict: 'E',
    scope: { used: '=', total: '=', unit: '@', label: '@' },
    template:
      '<div class="usage-bar">' +
      '  <div class="usage-bar-head"><span class="usage-label">{{label}}</span>' +
      '    <span class="usage-figures">{{remaining()}} {{unit}} left of {{total}} {{unit}}</span></div>' +
      '  <div class="usage-track"><div class="usage-fill"></div></div>' +
      '</div>',
    link: function(scope, element) {
      scope.remaining = function() {
        if (scope.total === undefined) return '';
        var r = Math.max(0, scope.total - scope.used);
        return Math.round(r * 10) / 10;
      };
      scope.$watch(function() { return [scope.used, scope.total]; }, function() {
        if (!scope.total) return;
        var pct = Math.min(100, Math.round(scope.used / scope.total * 100));
        var fill = $(element).find('.usage-fill');
        fill.css('width', pct + '%');
        fill.removeClass('low mid high').addClass(pct >= 90 ? 'high' : (pct >= 70 ? 'mid' : 'low'));
      }, true);
    }
  };
});
