/**
 * Portfolio cat: saves the names visitors type into the name box to this Google Sheet.
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

function doPost(e) {
  var p = (e && e.parameter) || {};
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

// Footer view counter. The site calls ?views=1 to add a view and ?views=0 to only read it.
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
        views = Number(props.getProperty('views') || 0) + 1;
        props.setProperty('views', String(views));
      } finally {
        lock.releaseLock();
      }
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ views: views }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = SHEET_TAB ? (ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB)) : ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
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
