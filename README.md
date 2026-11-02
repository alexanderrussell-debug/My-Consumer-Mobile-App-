# MyMeridian — customer self-care app

**Hybrid mobile app (Android & iOS) for Meridian Telecom Group customers**

Customers use MyMeridian to check their usage and bills, pay, top up prepaid credit, buy add-ons, switch
roaming on or off and manage their profile. About 1.4 million monthly active users across SG and ID.

> **Status:** maintenance mode. The Android app has not been updated in the Play Store since 2023 and the
> iOS app since 2020 (see `docs/KNOWN_ISSUES.md`).

> This is a fictional company and a demonstration codebase. All accounts, keys and URLs are fake.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | Ionic Framework 1.3.5 |
| JavaScript framework | AngularJS 1.5.3 (end-of-life since December 2021) |
| Routing | angular-ui-router 0.2 (bundled with Ionic 1) |
| Native shell | Apache Cordova 6 — cordova-android 6.1, cordova-ios 4.3 (UIWebView) |
| Plugins | push (GCM), Touch ID, InAppBrowser, keyboard, statusbar, splashscreen |
| Libraries | jQuery 2.2, lodash 3.10, moment 2.18, angular-translate 2.15, ngCordova |
| Package management | Bower (libraries committed to `www/lib`) |
| Build tooling | Gulp 3, node-sass (no longer compiled), Ionic CLI 2 |
| Tests | Karma + Jasmine (a handful of unit tests) |
| Backend | "MYM Gateway" REST API (mocked locally by `mock-api/server.js`) |

## Running it in a browser (no phone needed)

Requires Node.js (any version from 6 upwards).

```bash
npm install --production      # only installs the mock server
npm start                     # http://localhost:8100
```

Open http://localhost:8100 in Chrome, then open DevTools and switch on the device toolbar (phone view).

Or with Docker:

```bash
docker build -t mymeridian:legacy .
docker run -p 8100:8100 mymeridian:legacy
```

### Demo accounts (password `password123`)

| Mobile number | Customer | Type |
|---|---|---|
| 6591000001 | Wei Ling Tan | Postpaid 5G M — 20 GB, bill due |
| 6591000002 | Rahul Menon | Postpaid 5G XL — roaming currently on |
| 6581000001 | Siti Rahmah | Prepaid — S$12.50 credit |

### Mock API helpers (not part of the real gateway)

| Call | What it does |
|---|---|
| `POST /api/_demo/burn-data` `{"msisdn":"6591000001","gb":5}` | Adds data usage on the "network" |
| `GET /api/_demo/state/:msisdn` | What the network/billing side really holds (roaming flag, balance, usage) |
| `GET /api/_demo/transactions` | All top-up payments taken |
| `POST /api/_demo/reset` | Restore the demo data |

## Building the mobile apps

> Only works on the old build Mac mini (macOS 10.13, Node 6, Xcode 10). See KNOWN_ISSUES.

```bash
npm install
bower install          # libraries are already committed in www/lib
ionic cordova platform add android@6.1.2 ios@4.3.1
ionic cordova build android --release
ionic cordova build ios --release
```

Before a release build, switch `www/js/config.js` to the PROD block.

## Tests

```bash
npm test     # Karma + Jasmine in headless Chrome
```

## Project layout

```
config.xml              Cordova config (app id, plugins, platform versions)
www/index.html          entry point - every script listed by hand
www/js/app.js           module, routes, HTTP interceptor
www/js/config.js        environment settings (commented in/out)
www/js/controllers/     one controller per screen
www/js/services/        API calls, storage/cache, push, analytics
www/js/directives/      usage-bar
www/templates/          screen templates
www/i18n/               English and Bahasa Indonesia
www/lib/                third-party libraries (committed)
mock-api/               local mock of the MYM Gateway
test/                   Karma config and unit tests
```

## Documentation

* `docs/ARCHITECTURE.md` — screens, data flow, integrations
* `docs/KNOWN_ISSUES.md` — open issues
* `CHANGELOG.md` — release history

## Contacts

Digital Channels — `digital@meridiantel.example`
