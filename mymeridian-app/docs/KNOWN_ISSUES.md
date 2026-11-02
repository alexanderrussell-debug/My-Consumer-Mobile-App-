# Known issues

Tracked in JIRA project MYM. Listed here because Customer Service, Security and the app store owners keep asking.

| Ticket | Issue | Workaround |
|---|---|---|
| MYM-301 | **Google Play: app can't be updated.** Play requires a recent target API level; cordova-android 6 targets API 25 | Last Android release 2023 via an exception that has now expired |
| MYM-288 | **App Store: iOS app can't be updated.** Apple rejects apps using UIWebView; switching to WKWebView broke the payment session | Last iOS release 2020 |
| MYM-310 | Push notifications stopped working after Google shut down GCM | Marketing uses SMS instead |
| MYM-410 | Customer Service: "app showed I had data left, then I got an overage charge" — ~300 contacts/month | CS explains usage can be up to 15 minutes behind; goodwill credits |
| MYM-422 | One complaint: customer saw another family member's account after logging in on a shared iPad | Could not reproduce |
| MYM-430 | Roaming bill disputes: customers say the app showed roaming as OFF | CS credits the roaming charges (~S$40k/quarter) |
| MYM-436 | Duplicate top-ups — ~40 refunds/month | Payments team refunds manually |
| MYM-455 | Bahasa Indonesia translation incomplete (top-up, add-ons, roaming screens show English) | — |
| MYM-140 | Content-Security-Policy disabled because promo banners need inline HTML | — |
| SEC-2022-031 | Pen test: API key and payment settings readable in the app bundle; remembered password stored on device | Risk accepted pending rewrite |
| MYM-500 | AngularJS 1.x end-of-life (Dec 2021); Ionic 1, Bower, Gulp 3 unsupported | Rewrite proposal (Angular/Ionic 7 + Capacitor) not funded |
| MYM-505 | Builds only work on the old Mac mini (Node 6, node-sass, Xcode 10). Nobody else can build the app | Don't upgrade the Mac mini |
| MYM-512 | Upgrading AngularJS to 1.6+ fails — app breaks immediately | Stay on 1.5.3 |
