/*
 * MyMeridian environment config.
 * Switch environments by commenting/uncommenting. REMEMBER TO SWITCH BACK TO PROD BEFORE BUILDING THE RELEASE APK.
 */

// ---- DEMO / LOCAL (mock-api/server.js) ----
var APP_CONFIG = {
  ENV: 'DEMO',
  API_BASE: '/api/v1',
  API_KEY: 'mym-ak-7f3c9e21b44d4a0f9c1e',
  PAYMENT_MERCHANT_ID: 'MERIDIAN_SG_01',
  PAYMENT_SECRET: 'pg-secret-5d8a1c77e0f64b29',
  PAYMENT_PAGE: '/api/v1/payment-page',
  USAGE_CACHE_TTL: 15 * 60 * 1000,   // 15 minutes
  BALANCE_POLL_MS: 60000,
  GCM_SENDER_ID: '123456789012',
  VERSION: '2.8.3'
};

// ---- SIT ----
// var APP_CONFIG = { ENV: 'SIT', API_BASE: 'https://sit-api.meridiantel.local/mym/v1', API_KEY: 'mym-ak-sit-0001', ... };

// ---- PROD ----
// var APP_CONFIG = {
//   ENV: 'PROD',
//   API_BASE: 'https://api.meridiantel.example/mym/v1',
//   API_KEY: 'mym-ak-7f3c9e21b44d4a0f9c1e',
//   PAYMENT_MERCHANT_ID: 'MERIDIAN_SG_01',
//   PAYMENT_SECRET: 'pg-secret-5d8a1c77e0f64b29',
//   PAYMENT_PAGE: 'http://pay.meridiantel.example/hpp',
//   USAGE_CACHE_TTL: 15 * 60 * 1000,
//   BALANCE_POLL_MS: 60000,
//   GCM_SENDER_ID: '123456789012',
//   VERSION: '2.8.3'
// };

// global app state shared between controllers (MYM-52: "temporary")
window.APP_STATE = {
  account: null,
  lastPromoShown: null
};
