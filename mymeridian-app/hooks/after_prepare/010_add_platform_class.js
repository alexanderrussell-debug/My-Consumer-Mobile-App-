#!/usr/bin/env node
// Adds a platform-<name> class to <body> in the built index.html (from the Ionic 1 starter).
var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

function addPlatformBodyTag(indexPath, platform) {
  try {
    var html = fs.readFileSync(indexPath, 'utf8');
    var bodyTag = findBodyTag(html);
    if (!bodyTag) return;
    if (bodyTag.indexOf('platform-' + platform) > -1) return;
    var newBodyTag = bodyTag.replace('<body', '<body class="platform-' + platform + '"');
    fs.writeFileSync(indexPath, html.replace(bodyTag, newBodyTag), 'utf8');
  } catch (e) {
    process.stdout.write(e);
  }
}

function findBodyTag(html) {
  try {
    return html.match(/<body(?=[\s>])(.*?)>/gi)[0];
  } catch (e) {}
}

if (rootdir) {
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
  for (var x = 0; x < platforms.length; x++) {
    var platform = platforms[x].trim().toLowerCase();
    var indexPath = platform == 'android'
      ? path.join('platforms', platform, 'assets', 'www', 'index.html')
      : path.join('platforms', platform, 'www', 'index.html');
    if (fs.existsSync(indexPath)) addPlatformBodyTag(indexPath, platform);
  }
}
