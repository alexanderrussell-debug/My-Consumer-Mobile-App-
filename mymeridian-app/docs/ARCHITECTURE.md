# MyMeridian architecture

_Written for release 2.0 (2016). Updated occasionally._

## Overview

```
 ┌───────────────────────────── Phone ─────────────────────────────┐
 │  Cordova shell (Android WebView / iOS UIWebView)                │
 │  ┌──────────────── Ionic 1 / AngularJS 1.5 SPA ───────────────┐ │
 │  │ templates ─ controllers ─ services ─ $http ─ authInterceptor│ │
 │  │                        │                                    │ │
 │  │                 localStorage (token, cache, remember-me)    │ │
 │  └─────────────────────────────────────────────────────────────┘ │
 └───────────────────────────────┬─────────────────────────────────┘
                                 │ HTTPS + X-API-Key + Bearer token
                       ┌─────────▼─────────┐
                       │   MYM Gateway     │  (WebLogic, owned by Integration team)
                       └─┬─────┬─────┬───┬─┘
                BillCore │ UMS │ OCS │   │ NetProv (roaming on/off)
                         ▼     ▼     ▼   ▼
                     bills  usage  prepaid  network
                                            Payment gateway hosted page (InAppBrowser)
```

## Screens

| State | Controller | Purpose |
|---|---|---|
| `login` | `LoginCtrl` | Password login, remember me, Touch ID |
| `app.dashboard` | `DashboardCtrl` | Balance / amount due, usage bars, quick actions, promo banners |
| `app.usage` | `UsageCtrl` | Usage this cycle and recent events |
| `app.bills`, `app.bill` | `BillsCtrl`, `BillDetailCtrl` | Bills and payment (opens payment gateway page) |
| `app.addons` | `AddonsCtrl` | Buy add-ons (charged to bill) |
| `app.topup` | `TopupCtrl` | Prepaid top-up with a saved card |
| `app.roaming` | `RoamingCtrl` | Switch roaming on/off |
| `app.profile` | `ProfileCtrl` | Name, email, language |

`AppCtrl` drives the side menu. All `app.*` states require a token (`$stateChangeStart` guard).

## Data and caching

* Token, MSISDN, language, remembered credentials and cached API responses live in `localStorage`.
* Account and usage responses are cached for 15 minutes (`USAGE_CACHE_TTL`) to reduce gateway load (MYM-201).
* The dashboard polls the account every 60 s while open.
* `window.APP_STATE` holds the current account for the side menu.

## Integrations

| Feature | Gateway endpoint | Behind it |
|---|---|---|
| Login | `POST /auth/login` | LDAP + subscriber DB |
| Account, bills | `GET /account`, `/bills` | BillCore |
| Usage | `GET /usage` | UMS mediation output (up to ~15 min behind the network) |
| Top-up | `POST /topup` | Payment gateway (saved card), then OCS |
| Add-ons | `POST /addons/{code}/purchase` | BillCore + NetProv |
| Roaming | `GET/PUT /roaming` | NetProv order (synchronous, can take up to 2 min) |
| Promos | `GET /promos` | Marketing CMS (HTML snippets) |
| Push | `POST /push/register` | GCM |

## Environments

`www/js/config.js` contains DEMO, SIT and PROD blocks; the right one is uncommented before building.
There is no build-time configuration.
