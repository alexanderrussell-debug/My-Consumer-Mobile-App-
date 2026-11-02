angular.module('mymeridian')

.filter('sgd', function() {
  return function(v) {
    if (v === undefined || v === null || v === '') return '';
    return 'S$' + parseFloat(v).toFixed(2);
  };
})

/** GB number -> "1.2 GB" / "850 MB" */
.filter('dataSize', function() {
  return function(gb) {
    if (gb === undefined || gb === null) return '';
    if (gb < 1) return Math.round(gb * 1024) + ' MB';
    return (Math.round(gb * 10) / 10) + ' GB';
  };
})

.filter('shortDate', function() {
  return function(d) {
    return d ? moment(d).format('D MMM YYYY') : '';
  };
})

.filter('dateTime', function() {
  return function(d) {
    return d ? moment(d).format('D MMM, HH:mm') : '';
  };
});
