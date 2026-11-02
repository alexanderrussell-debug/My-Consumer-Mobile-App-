/*
 * MyMeridian mock backend for local development and demos.
 * Serves the app from www/ and fakes the self-care API (normally the "MYM Gateway" on WebLogic,
 * which fronts BillCore, UMS usage, the OCS and NetProv).
 *
 *   npm install && npm start   ->  http://localhost:8100
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fixtures = require('./fixtures/accounts');

var PORT = process.env.PORT || 8100;
var PAYMENT_SECRET = 'pg-secret-5d8a1c77e0f64b29';

var app = express();
app.use(bodyParser.json());

var state = fixtures.load();
var tokens = {};
var transactions = [];

function log(req) {
  console.log(new Date().toISOString() + ' ' + req.method + ' ' + req.url);
}

function auth(req, res, next) {
  log(req);
  var h = req.headers.authorization || '';
  var msisdn = tokens[h.replace('Bearer ', '')];
  if (!msisdn) {
    return res.status(401).json({ message: 'Session expired' });
  }
  req.user = state.accounts[msisdn];
  next();
}

function hash(s) {
  var h = 5381;
  for (var i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) & 0xffffffff;
  }
  return (h >>> 0).toString(16);
}

// ---------------------------------------------------------------- auth

app.post('/api/v1/auth/login', function(req, res) {
  log(req);
  var acc = state.accounts[(req.body.msisdn || '').replace(/\D/g, '')];
  if (!acc || acc.password !== req.body.password) {
    return res.status(401).json({ message: 'Incorrect mobile number or password' });
  }
  var token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  tokens[token] = acc.msisdn;
  res.json({ token: token, expiresIn: 3600, profile: { msisdn: acc.msisdn, name: acc.name } });
});

app.post('/api/v1/auth/logout', function(req, res) {
  log(req);
  var h = req.headers.authorization || '';
  delete tokens[h.replace('Bearer ', '')];
  res.json({ ok: true });
});

// ---------------------------------------------------------------- account & usage

app.get('/api/v1/account', auth, function(req, res) {
  var a = req.user;
  res.json({
    msisdn: a.msisdn, name: a.name, email: a.email, planName: a.planName, paymentType: a.paymentType,
    balance: a.balance, outstanding: a.outstanding, dueDate: a.dueDate
  });
});

app.put('/api/v1/profile', auth, function(req, res) {
  req.user.name = req.body.name || req.user.name;
  req.user.email = req.body.email || req.user.email;
  res.json({ ok: true });
});

app.get('/api/v1/usage', auth, function(req, res) {
  res.json(req.user.usage);
});

// ---------------------------------------------------------------- bills

app.get('/api/v1/bills', auth, function(req, res) {
  res.json(req.user.bills.map(function(b) {
    return { id: b.id, period: b.period, amount: b.amount, dueDate: b.dueDate, status: b.status };
  }));
});

app.get('/api/v1/bills/:id', auth, function(req, res) {
  var b = req.user.bills.filter(function(x) { return x.id === req.params.id; })[0];
  if (!b) return res.status(404).json({ message: 'Bill not found' });
  res.json(b);
});

app.get('/api/v1/payment-page', function(req, res) {
  log(req);
  res.send('<html><body style="font-family:sans-serif;padding:20px"><h2>Payment gateway (demo)</h2>' +
    '<p>Merchant: ' + req.query.merchant + '<br>Reference: ' + req.query.ref + '<br>Amount: S$' + req.query.amount +
    '</p><p style="color:#999;font-size:12px">Query string received: ' + req.url.replace(/</g, '&lt;') + '</p></body></html>');
});

// ---------------------------------------------------------------- add-ons

app.get('/api/v1/addons', auth, function(req, res) {
  res.json(fixtures.addons);
});

app.post('/api/v1/addons/:code/purchase', auth, function(req, res) {
  var a = fixtures.addons.filter(function(x) { return x.code === req.params.code; })[0];
  if (!a) return res.status(404).json({ message: 'Unknown add-on' });
  req.user.purchases = (req.user.purchases || []).concat([{ code: a.code, at: new Date().toISOString() }]);
  if (a.dataMb) req.user.usage.data.allowanceMb += a.dataMb;
  res.json({ ok: true, reference: 'ADD' + Date.now() });
});

// ---------------------------------------------------------------- top-up

app.post('/api/v1/topup', auth, function(req, res) {
  var b = req.body;
  var expected = hash(b.merchantId + '|' + b.msisdn + '|' + b.amount + '|' + PAYMENT_SECRET);
  if (b.signature !== expected) {
    return res.status(400).json({ message: 'Invalid signature' });
  }
  var amount = Number(b.amount);
  var bonus = amount >= 30 ? amount * 0.1 : 0;
  req.user.balance = Math.round((req.user.balance + amount + bonus) * 100) / 100;
  var txn = { reference: 'TU' + (100000 + transactions.length + 1), msisdn: b.msisdn, amount: amount, card: b.cardToken,
              at: new Date().toISOString() };
  transactions.push(txn);
  setTimeout(function() {
    res.json({ reference: txn.reference, newBalance: req.user.balance.toFixed(2) });
  }, 1200); // gateway latency
});

// ---------------------------------------------------------------- roaming

app.get('/api/v1/roaming', auth, function(req, res) {
  res.json({ enabled: req.user.roaming, zones: ['ASEAN', 'Asia Pacific', 'Rest of World'] });
});

app.put('/api/v1/roaming', auth, function(req, res) {
  if (req.user.roamingFails) {
    // NetProv order times out for this account (simulates provisioning fallout)
    return setTimeout(function() {
      res.status(504).json({ message: 'Provisioning timeout (NetProv)' });
    }, 1500);
  }
  req.user.roaming = !!req.body.enabled;
  res.json({ enabled: req.user.roaming });
});

// ---------------------------------------------------------------- promos (CMS)

app.get('/api/v1/promos', function(req, res) {
  log(req);
  res.json(fixtures.promos);
});

app.post('/api/v1/push/register', auth, function(req, res) {
  res.json({ ok: true });
});

// ---------------------------------------------------------------- demo helpers (not in the real gateway)

app.post('/api/_demo/burn-data', function(req, res) {
  log(req);
  var acc = state.accounts[req.body.msisdn];
  if (!acc) return res.status(404).json({ message: 'unknown msisdn' });
  acc.usage.data.usedKb += Math.round((req.body.gb || 5) * 1024 * 1024);
  res.json({ msisdn: acc.msisdn, usedGb: +(acc.usage.data.usedKb / 1024 / 1024).toFixed(2),
             allowanceGb: acc.usage.data.allowanceMb / 1024 });
});

app.get('/api/_demo/state/:msisdn', function(req, res) {
  var acc = state.accounts[req.params.msisdn];
  if (!acc) return res.status(404).json({ message: 'unknown msisdn' });
  res.json({ msisdn: acc.msisdn, roamingOnNetwork: acc.roaming, balance: acc.balance,
             dataUsedGb: +(acc.usage.data.usedKb / 1024 / 1024).toFixed(2), purchases: acc.purchases || [] });
});

app.get('/api/_demo/transactions', function(req, res) {
  res.json(transactions);
});

app.post('/api/_demo/reset', function(req, res) {
  state = fixtures.load();
  tokens = {};
  transactions = [];
  res.json({ ok: true });
});

// ---------------------------------------------------------------- static app

app.use(express.static(path.join(__dirname, '..', 'www')));

app.listen(PORT, function() {
  console.log('MyMeridian mock API + app on http://localhost:' + PORT);
});
