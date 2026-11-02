// Demo accounts. All passwords: password123
var moment = require('moment');

function events(n, seed) {
  var out = [];
  var types = [
    { type: 'DATA', d: 'Mobile data', a: function(i) { return (120 + (i * 37) % 900) + ' MB'; } },
    { type: 'VOICE', d: 'Call to 9123 4567', a: function(i) { return (1 + i % 14) + ' min'; } },
    { type: 'SMS', d: 'SMS to 8765 4321', a: function() { return '1 SMS'; } },
    { type: 'VOICE', d: 'IDD call to +44 20 7123 4567', a: function(i) { return (2 + i % 5) + ' min'; } }
  ];
  for (var i = 0; i < n; i++) {
    var t = types[(i + seed) % types.length];
    out.push({ type: t.type, description: t.d, amount: t.a(i), time: moment().subtract(i * 7 + 1, 'hours').toISOString() });
  }
  return out;
}

function period() {
  return { periodStart: moment().startOf('month').toISOString(), periodEnd: moment().endOf('month').toISOString() };
}

function usage(usedGb, allowanceGb, usedMin, allowMin, usedSms, allowSms, seed) {
  var p = period();
  return {
    periodStart: p.periodStart, periodEnd: p.periodEnd,
    data: { usedKb: Math.round(usedGb * 1024 * 1024), allowanceMb: allowanceGb * 1024 },
    voice: { usedMin: usedMin, allowanceMin: allowMin },
    sms: { used: usedSms, allowance: allowSms },
    events: events(14, seed)
  };
}

function bills(amounts) {
  return amounts.map(function(a, i) {
    var m = moment().subtract(i + 1, 'months');
    return {
      id: 'B' + m.format('YYYYMM') + '01',
      period: m.format('MMMM YYYY'),
      amount: a,
      dueDate: moment().subtract(i, 'months').date(20).toISOString(),
      status: i === 0 ? 'UNPAID' : 'PAID',
      lines: [
        { label: 'Monthly plan', amount: 48.0 },
        { label: 'Add-ons', amount: Math.round((a - 48.0 - 4.12) * 100) / 100 },
        { label: 'IDD & roaming', amount: 0 },
        { label: 'GST', amount: 4.12 }
      ]
    };
  });
}

exports.load = function() {
  return {
    accounts: {
      '6591000001': {
        msisdn: '6591000001', password: 'password123', name: 'Wei Ling Tan', email: 'weiling.tan@example.com',
        planName: 'Postpaid 5G M', paymentType: 'POST', outstanding: 68.45, dueDate: moment().date(20).toISOString(),
        roaming: false, usage: usage(17.2, 20, 312, 1000, 45, 500, 0), bills: bills([68.45, 52.12, 61.3])
      },
      '6591000002': {
        msisdn: '6591000002', password: 'password123', name: 'Rahul Menon', email: 'rahul.menon@example.com',
        planName: 'Postpaid 5G XL', paymentType: 'POST', outstanding: 0, dueDate: null,
        roaming: true, roamingFails: true, usage: usage(41.5, 100, 820, 3000, 12, 1000, 1), bills: bills([0, 98.1, 102.4])
      },
      '6581000001': {
        msisdn: '6581000001', password: 'password123', name: 'Siti Rahmah', email: 'siti.rahmah@example.com',
        planName: 'Prepaid Value', paymentType: 'PRE', balance: 12.5,
        roaming: false, usage: usage(2.1, 5, 64, 200, 20, 100, 2), bills: []
      }
    }
  };
};

exports.addons = [
  { code: 'DATA5', name: '5GB Data Booster', description: '5GB extra data, valid until end of bill cycle', price: '5.00', dataMb: 5120 },
  { code: 'IDD100', name: 'IDD 100 minutes', description: '100 minutes to 30 countries', price: '12.00' },
  { code: 'ROAM_ASEAN', name: 'ASEAN Roam 7 days', description: '3GB roaming data in ASEAN for 7 days', price: '15.00' },
  { code: 'DATA30', name: '30GB Data Booster', description: '30GB extra data for the bill cycle', price: '25.00', dataMb: 30720 }
];

exports.promos = [
  { id: 'P101', html: '<h3>Double data weekends</h3><p>Get 2x data on Saturdays and Sundays this month. No sign-up needed.</p>' },
  { id: 'P102', html: '<h3>ASEAN Roam from S$15</h3><p>Travel to 10 ASEAN countries with 3GB.' +
      '<img src="x" style="display:none" onerror="console.warn(\'[promo P102] script inside CMS content executed\')"></p>' }
];
