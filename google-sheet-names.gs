/**
 * Portfolio cat: saves the names visitors type into the name box to this Google Sheet.
 * Also keeps the footer view count, and adds one row per visit to a "Visits" tab
 * (created automatically the first time someone visits). Each visit row is filled in
 * as the visitor uses the site: their name, time on site, how far they scrolled,
 * which sections they saw and what they clicked.
 *
 * Setup (one time):
 *   1. Open the Google Sheet → Extensions → Apps Script.
 *   2. Delete the sample code, paste this whole file, click Save.
 *   3. Deploy → New deployment → gear icon → Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *      Click Deploy and allow access when Google asks.
 *   4. Copy the "Web app URL" (it ends in /exec) and paste it into
 *      window.SHEET_URL at the top of js/main.js.
 *
 * After changing this code later: Deploy → Manage deployments → Edit (pencil)
 * → Version: New version → Deploy. The URL stays the same.
 */

var SHEET_TAB = '';            // tab to write to; '' = the first tab in the spreadsheet
var MAX_ROWS_PER_MINUTE = 30;  // flood guard for the whole site
var REPEAT_WINDOW_SEC = 600;   // the same name again within 10 minutes is ignored

var HEADERS = ['Time', 'Name', 'First command', 'Device'];

var VISITS_TAB = 'Visits';        // tab for visit details; created at the end if it doesn't exist
var MAX_VIEWS_PER_MINUTE = 60;    // flood guard for the view count and new Visits rows
var MAX_UPDATES_PER_MINUTE = 120; // flood guard for filling in visit rows
// Rows are written by column name, so the columns can be moved around in the sheet.
// A column missing from the tab is added at the end.
var VISIT_HEADERS = ['Time', 'View #', 'Visitor', 'Name', 'City', 'Region', 'Country', 'Internet provider',
  'Came from', 'Device', 'OS', 'Browser', 'Time on site', 'Scrolled', 'Sections seen', 'Clicked',
  'Screen', 'Language', 'Time zone', 'IP address', 'Visit ID'];

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.type === 'visit') return updateVisit_(p);

  var name = clean_(p.name, 40);
  if (!name) return reply_('skipped: empty name');

  var cache = CacheService.getScriptCache();
  var nameKey = 'n:' + name.toLowerCase();
  if (cache.get(nameKey)) return reply_('skipped: repeat');

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return reply_('busy');
  try {
    var minuteKey = 'm:' + Math.floor(Date.now() / 60000);
    var count = Number(cache.get(minuteKey) || 0);
    if (count >= MAX_ROWS_PER_MINUTE) return reply_('skipped: rate limit');
    cache.put(minuteKey, String(count + 1), 120);
    cache.put(nameKey, '1', REPEAT_WINDOW_SEC);

    sheet_().appendRow([new Date(), safe_(name), safe_(clean_(p.cmd, 20)), safe_(clean_(p.device, 20))]);
  } finally {
    lock.releaseLock();
  }
  return reply_('ok');
}

// Footer view counter. The site calls ?views=1 (plus visit details) to add a view and ?views=0 to only read it.
// The total is kept in Project Settings → Script properties as "views"; edit it there to change the number.
// Opening the web-app URL with no ?views shows the status message, which is a quick way to check the deployment.
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.views == null) return reply_('Portfolio name logger is running.');

  var props = PropertiesService.getScriptProperties();
  var views = Number(props.getProperty('views') || 0);
  if (p.views === '1') {
    var lock = LockService.getScriptLock();
    if (lock.tryLock(5000)) {
      try {
        var cache = CacheService.getScriptCache();
        var minuteKey = 'v:' + Math.floor(Date.now() / 60000);
        var recent = Number(cache.get(minuteKey) || 0);
        if (recent < MAX_VIEWS_PER_MINUTE) {
          cache.put(minuteKey, String(recent + 1), 120);
          views = Number(props.getProperty('views') || 0) + 1;
          props.setProperty('views', String(views));
          logVisit_(p, views);
        }
      } finally {
        lock.releaseLock();
      }
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ views: views }))
    .setMimeType(ContentService.MimeType.JSON);
}

// A new row in the Visits tab. A problem writing the row never stops the view from counting.
function logVisit_(p, views) {
  try {
    var n = Math.max(1, Math.floor(Number(p.vn) || 1));
    var sh = tab_(VISITS_TAB, VISIT_HEADERS);
    var cols = columns_(sh, VISIT_HEADERS);
    var row = [];
    for (var i = 0; i < sh.getLastColumn(); i++) row.push('');
    var data = {
      'Time': new Date(),
      'View #': views,
      'Visitor': n > 1 ? 'Returning (visit ' + n + ')' : 'New',
      'Name': text_(p.name, 40),
      'City': text_(p.city, 60),
      'Region': text_(p.region, 60),
      'Country': text_(p.country, 60),
      'Internet provider': text_(p.isp, 100),
      'Came from': text_(p.from, 60),
      'Device': text_(p.dev, 20),
      'OS': text_(p.os, 20),
      'Browser': text_(p.br, 30),
      'Screen': text_(p.scr, 20),
      'Language': text_(p.lang, 20),
      'Time zone': text_(p.tz, 40),
      'IP address': text_(p.ip, 45),
      'Visit ID': visitId_(p.vid)
    };
    for (var k in data) row[cols[k] - 1] = data[k];
    sh.appendRow(row);
  } catch (err) {
    console.error(err);
  }
}

// Fills in an existing visit row (found by its Visit ID) with what the visitor did on the site.
function updateVisit_(p) {
  var vid = visitId_(p.vid);
  if (!vid) return reply_('skipped: no visit id');

  var cache = CacheService.getScriptCache();
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return reply_('busy');
  try {
    var minuteKey = 'u:' + Math.floor(Date.now() / 60000);
    var count = Number(cache.get(minuteKey) || 0);
    if (count >= MAX_UPDATES_PER_MINUTE) return reply_('skipped: rate limit');
    cache.put(minuteKey, String(count + 1), 120);

    var sh = tab_(VISITS_TAB, VISIT_HEADERS);
    var cols = columns_(sh, VISIT_HEADERS);
    var last = sh.getLastRow();
    if (last < 2) return reply_('skipped: visit not found');
    var cell = sh.getRange(2, cols['Visit ID'], last - 1, 1).createTextFinder(vid).matchEntireCell(true).findNext();
    if (!cell) return reply_('skipped: visit not found');

    var r = cell.getRow();
    var scroll = Math.min(100, Math.max(0, Math.round(Number(p.scroll) || 0)));
    var data = {
      'Time on site': duration_(p.time),
      'Scrolled': scroll + '%',
      'Sections seen': text_(p.sections, 200),
      'Clicked': text_(p.clicks, 400)
    };
    var name = text_(p.name, 40);
    if (name) data['Name'] = name;
    for (var k in data) sh.getRange(r, cols[k]).setValue(data[k]);
  } finally {
    lock.releaseLock();
  }
  return reply_('ok');
}

function sheet_() {
  return tab_(SHEET_TAB, HEADERS);
}

// The named tab (added as the last tab if missing), or the first tab when name is ''. Adds bold, frozen headers to an empty tab.
function tab_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = name ? (ss.getSheetByName(name) || ss.insertSheet(name, ss.getNumSheets())) : ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Column number (1-based) of each header in row 1. Any header that's missing is added as a new column at the end.
function columns_(sh, headers) {
  var top = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  var cols = {};
  for (var i = 0; i < top.length; i++) if (top[i] !== '' && !cols[top[i]]) cols[top[i]] = i + 1;
  var next = top.length + 1;
  for (var j = 0; j < headers.length; j++) {
    if (cols[headers[j]]) continue;
    sh.getRange(1, next).setValue(headers[j]).setFontWeight('bold');
    cols[headers[j]] = next++;
  }
  return cols;
}

// "45 s", "3 min 12 s" or "1 h 5 min"; capped at one day.
function duration_(v) {
  var s = Math.min(86400, Math.max(0, Math.floor(Number(v) || 0)));
  if (s < 60) return s + ' s';
  if (s < 3600) return Math.floor(s / 60) + ' min ' + (s % 60) + ' s';
  return Math.floor(s / 3600) + ' h ' + Math.floor((s % 3600) / 60) + ' min';
}

function visitId_(v) {
  v = String(v == null ? '' : v);
  return /^[a-z0-9]{8,24}$/.test(v) ? v : '';
}

function text_(v, max) {
  return safe_(clean_(v, max));
}

function clean_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

// A cell starting with = + - or @ would be treated as a formula; a leading apostrophe keeps it plain text.
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply_(msg) {
  return ContentService.createTextOutput(msg);
}

// Run this from the Apps Script editor (select testAppend → Run) to add one test row.
function testAppend() {
  Logger.log(doPost({ parameter: { name: 'Test visitor', cmd: '/hello', device: 'Desktop' } }).getContent());
}

// Run this (select testVisit → Run) to add one test row to the Visits tab and then fill in its activity.
// It also adds 1 to the view count.
function testVisit() {
  var vid = 'test' + Date.now().toString(36);
  Logger.log(doGet({ parameter: { views: '1', vid: vid, vn: '1', name: 'Test visitor', city: 'Chennai',
    region: 'Tamil Nadu', country: 'India', isp: 'Test ISP', ip: '0.0.0.0', from: 'Test', dev: 'Desktop',
    os: 'Windows', br: 'Chrome', scr: '1920 × 1080', lang: 'en-IN', tz: 'Asia/Kolkata' } }).getContent());
  Logger.log(doPost({ parameter: { type: 'visit', vid: vid, time: '95', scroll: '80',
    sections: 'About, Work', clicks: 'Project: The Velli Shop, LinkedIn' } }).getContent());
}
