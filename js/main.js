/* Harish M H portfolio scripts */

// Visitor names → Google Sheets. Paste the Apps Script web-app URL (ends in /exec) between the quotes.
// Setup steps are at the top of google-sheet-names.gs. Leave it empty to turn saving off.
window.SHEET_URL = 'https://script.google.com/macros/s/AKfycbzZE7Ox8vtw0feca_KybTVJNeXvin--Fmln456BImdiZ_phj4lzKvCchef_JyuVRIWOpA/exec';

(function () {
   var d = document, r = d.documentElement, red = matchMedia('(prefers-reduced-motion: reduce)').matches;
   // project screenshots, keyed by data-preview name or domain: [file, alt text, width, height]
   var IMG = {
      'Elangovan Perumal': ['assets/images/projects/elangovan-perumal.webp', 'Elangovan Perumal website', 1500, 688],
      'OUTLIV Cancer Care': ['assets/images/projects/outliv-cancer-care.webp', 'OUTLIV Cancer Care website', 1500, 689],
      'aicybermagazine.com': ['assets/images/projects/ai-cyber-magazine.webp', 'AI Cyber Magazine website', 1500, 687],
      'ramsnicefoods.com': ['assets/images/projects/rams-nice-foods.webp', 'Rams Nice Foods website', 1500, 689],
      'thevellishop.com': ['assets/images/projects/the-velli-shop.webp', 'The Velli Shop website', 1500, 688],
      'shoptruetribute.com': ['assets/images/projects/true-tribute.webp', 'True Tribute website', 1500, 689]
   };
   [].forEach.call(d.querySelectorAll('.shot'), function (a) { var raw = a.getAttribute('href'), u = raw ? raw.replace(/^https?:\/\//, '').replace(/\/$/, '') : ((a.getAttribute('data-preview') || 'Project preview')), key = a.getAttribute('data-preview') || u, m = IMG[key] || IMG[u], body = m ? '<div class="sv has"><img src="' + m[0] + '" alt="Screenshot of ' + m[1] + '" width="' + m[2] + '" height="' + m[3] + '" loading="lazy" decoding="async"></div>' : '<div class="sv"><span class="go" aria-hidden="true">\u2197</span></div>'; a.innerHTML = '<div class="win"><div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="ad"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg><span>' + u + '</span></div></div>' + body + '</div>' });

   function fill(el, s, dn, seed) {
      var W = el.clientWidth, H = el.clientHeight; if (!W || !H) return; var c = Math.ceil(W / s), rw = Math.ceil(H / s); el.style.gridTemplateColumns = 'repeat(' + c + ',' + s + 'px)'; el.style.gridAutoRows = s + 'px'; el._s = s; el._c = c; el.innerHTML = ''; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
      for (var i = 0; i < c * rw; i++) { var e = d.createElement('i'), v = rnd(); if (v < dn) e.style.background = 'var(--p' + (1 + Math.floor(rnd() * 6)) + ')'; e.style.transitionDelay = (rnd() * 1.2) + 's'; el.appendChild(e) }
   }
   function pix() { [].forEach.call(d.querySelectorAll('.px'), function (b, i) { var s = innerWidth < 600 ? 20 : 28; b.style.height = s + 'px'; fill(b, s, .5, i * 7 + 3) });[].forEach.call(d.querySelectorAll('.pf'), function (f) { var a = f.getAttribute('data-px').split(','); fill(f, innerWidth < 600 ? 34 : +a[0], +a[1], 11) }) }
   (function () {
      var hp = d.querySelector('.hp'); if (!hp) return;
      var pf = hp.querySelector('.pf'), svg = hp.querySelector('.mas'), eys = [].slice.call(svg.querySelectorAll('.ey')), hd = svg.querySelector('.hd'), jp = svg.querySelector('.jp'), bub = hp.querySelector('.bub'), cols = ['--p1', '--p2', '--p3', '--p4', '--p5', '--p6'], words = ['Hi there!', 'Meow!', "Let's build!", 'Hello!'], wi = 0, last = null, bt, mt, zt;
      function look(cx, cy) { var b = svg.getBoundingClientRect(), dx = cx - (b.left + b.width / 2), dy = cy - (b.top + b.height / 2), m = Math.hypot(dx, dy) || 1, k = Math.min(1, m / 260), ox = dx / m * 10 * k, oy = dy / m * 10 * k; eys.forEach(function (e) { e.style.transform = 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px)' }); hd.style.transform = 'rotate(' + Math.max(-8, Math.min(8, dx / 60)).toFixed(1) + 'deg)' }
      function rest() { eys.forEach(function (e) { e.style.transform = '' }); hd.style.transform = '' }
      function pos(cx, cy) { var b = pf.getBoundingClientRect(), s = pf._s, c = pf._c; if (!s) return null; var x = Math.floor((cx - b.left) / s), y = Math.floor((cy - b.top) / s); if (x < 0 || y < 0 || x >= c) return null; return { x: x, y: y, e: pf.children[y * c + x] } }
      function tint(e, col, ms) { if (!e) return; clearTimeout(e._t); e.style.transitionDelay = '0s'; if (e._o === undefined) e._o = e.style.background; e.style.background = 'var(' + col + ')'; e._t = setTimeout(function () { e.style.background = e._o || ''; e._o = undefined }, ms) }
      function anim(el, kf, o) { if (!red && el.animate) el.animate(kf, o) }
      function say(t, ms) { bub.textContent = t; bub.classList.add('on'); svg.classList.add('say'); clearTimeout(bt); clearTimeout(mt); bt = setTimeout(function () { bub.classList.remove('on') }, ms || 1600); mt = setTimeout(function () { svg.classList.remove('say') }, 700) }
      function ripple(cx, cy) {
         if (red) return; var p = pos(cx, cy), c = pf._c, kids = pf.children;
         if (p) { for (var i = 0; i < kids.length; i++) { var x = i % c, y = Math.floor(i / c), dd = Math.hypot(x - p.x, y - p.y); if (dd <= 7) { (function (e, dd) { setTimeout(function () { tint(e, cols[Math.round(dd) % 6], 800); e.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 500 }) }, dd * 70) })(kids[i], dd) } } }
      }
      function mid() { var b = svg.getBoundingClientRect(); ripple(b.left + b.width / 2, b.top + b.height / 2) }
      function hop(h) { anim(jp, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + h + 'px)' }, { transform: 'translateY(0)' }], { duration: 380 + h * 4, easing: 'ease-out' }) }
      function play(cx, cy) { ripple(cx, cy); hop(22); say(words[wi++ % words.length]) }
      if (!red) {
         hp.addEventListener('pointermove', function (ev) { look(ev.clientX, ev.clientY); var p = pos(ev.clientX, ev.clientY); if (p && p.e && p.e !== last) { last = p.e; tint(p.e, cols[Math.floor(Math.random() * 6)], 900) } });
         hp.addEventListener('pointerleave', function () { rest(); last = null });
      }
      // clicks and keys inside the name box or commands belong to them, not to the cat
      hp.addEventListener('click', function (ev) { if (ev.target.closest('.cn,.cmd')) return; play(ev.clientX, ev.clientY) });
      hp.addEventListener('keydown', function (ev) { if (ev.target !== hp) return; if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); var b = svg.getBoundingClientRect(); play(b.left + b.width / 2, b.top + b.height / 2) } });

      // Visitor's name + commands: the cat reacts and replies in its speech bubble
      var form = hp.querySelector('.cn'), inp = d.getElementById('vn'), who = '', NK = 'catName',
         C = {
            hello: ['Hi {n}!', function () { hop(26) }],
            jump: ['Boing! Higher, {n}?', function () { hop(56); mid() }],
            spin: ['Wheee! So dizzy.', function () { anim(jp, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 900, easing: 'cubic-bezier(.5,0,.25,1)' }) }],
            dance: ['Nice moves, {n}!', function () { anim(jp, [{ transform: 'rotate(0deg)' }, { transform: 'translateY(-10px) rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'translateY(-10px) rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0deg)' }], { duration: 1200, easing: 'ease-in-out' }); mid() }],
            nap: ['Zzz… /hello wakes me.', function () { svg.classList.add('zz'); clearTimeout(zt); zt = setTimeout(function () { svg.classList.remove('zz') }, 3000) }],
            hire: ["Let's build, {n}!", function () { hop(26); mid(); setTimeout(function () { goTo(d.getElementById('contact')) }, 700) }]
         };
      function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 20) }
      try { who = clean(localStorage.getItem(NK)) } catch (e) { }
      inp.value = who;
      function nudge() { form.classList.add('need'); inp.focus(); say("What's your name?", 2000); anim(form, [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 380 }) }
      // send each new name to the Google Sheet once per browser (not on every command)
      var sent = ''; try { sent = localStorage.getItem(NK + 'Sent') || '' } catch (e) { }
      function store(n, k) {
         var key = n.toLowerCase(); if (!window.SHEET_URL || !window.fetch || key === sent) return; sent = key;
         fetch(window.SHEET_URL, { method: 'POST', mode: 'no-cors', keepalive: true, body: new URLSearchParams({ name: n, cmd: '/' + k, device: matchMedia('(pointer: coarse)').matches ? 'Phone/tablet' : 'Desktop' }) })
            .then(function () { try { localStorage.setItem(NK + 'Sent', key) } catch (e) { } }).catch(function () { sent = '' })
      }
      function run(k) {
         var n = clean(inp.value); if (!n) { nudge(); return }
         inp.value = n; if (n !== who) { who = n; try { localStorage.setItem(NK, n) } catch (e) { } }
         var line = C[k][0].replace('{n}', n);
         if (k !== 'nap') svg.classList.remove('zz');
         C[k][1](); say(line, k === 'nap' ? 3000 : 1800); store(n, k)
      }
      inp.addEventListener('input', function () { form.classList.remove('need') });
      form.addEventListener('submit', function (e) { e.preventDefault(); run('hello') });
      hp.querySelector('.cmd').addEventListener('click', function (e) { var b = e.target.closest('button[data-c]'); if (b) run(b.getAttribute('data-c')) });
      if (who) setTimeout(function () { say('Welcome back, ' + who + '!', 2200) }, 1200);
   })();
   function tips() { [].forEach.call(d.querySelectorAll('.ic2'), function (c) { var cb = c.getBoundingClientRect();[].forEach.call(c.children, function (t) { t.classList.remove('l', 'r'); var tb = t.getBoundingClientRect(), x = tb.left - cb.left; if (x < 80) t.classList.add('l'); else if (tb.right > cb.right - 80) t.classList.add('r') }) }) }
   tips(); addEventListener('load', tips); if (d.fonts && d.fonts.ready) d.fonts.ready.then(tips);
   var lenis = null; if (!red && window.Lenis) { lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)) } }); (function raf(t) { lenis.raf(t); requestAnimationFrame(raf) })(performance.now()) }
   var els = [].slice.call(d.querySelectorAll('.rv'));
   els.forEach(function (e) { var k = 0, n = e.previousElementSibling; while (n) { if (n.classList.contains('rv')) k++; n = n.previousElementSibling } e.style.transitionDelay = Math.min(k, 4) * 90 + 'ms' });
   function show(e) { e.classList.add('in'); setTimeout(function () { e.style.transitionDelay = '' }, 1400) }
   var all = els.concat([].slice.call(d.querySelectorAll('.px,.pf')));
   function obs() {
      if (red || !('IntersectionObserver' in window)) { all.forEach(function (e) { e.classList.contains('rv') ? show(e) : e.classList.add('in') }); return }
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.contains('rv') ? show(x.target) : x.target.classList.add('in'); io.unobserve(x.target) } }) }, { threshold: .1, rootMargin: '0px 0px -5% 0px' }); all.forEach(function (e) { io.observe(e) })
   }
   pix(); obs();
   var links = [].slice.call(d.querySelectorAll('.chips a,#mn a:not(.btn)')), secs = links.map(function (a) { return d.querySelector(a.getAttribute('href')) });
   function upd() { var as = null; secs.forEach(function (s) { if (s && s.getBoundingClientRect().top <= innerHeight * .4) as = s }); links.forEach(function (a, i) { var on = secs[i] === as; if (on && !a.classList.contains('on') && a.parentNode.classList.contains('wrap') && a.parentNode.scrollTo) { a.parentNode.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' }) } a.classList.toggle('on', on) }) }
   var tk = false; addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; upd() }) } }, { passive: true }); upd();
   var rt, lw = innerWidth; addEventListener('resize', function () { clearTimeout(rt); if (innerWidth === lw) return; lw = innerWidth; rt = setTimeout(function () { pix(); tips();[].forEach.call(d.querySelectorAll('.px,.pf'), function (e) { e.classList.add('in') }) }, 150) });
   var mb = d.querySelector('.mb'), mn = d.getElementById('mn'); function closeM() { mn.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu' }
   mb.addEventListener('click', function () { var o = mn.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu' }); d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM() });
   function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }
   function go(y, done) { if (red) { scrollTo(0, y); return } if (lenis) { lenis.scrollTo(y, { duration: 1.5, onComplete: done }); return } var s = scrollY, c = y - s, t0 = null, du = Math.min(1400, 600 + Math.abs(c) * .25); function st(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / du, 1); scrollTo(0, s + c * ease(p)); if (p < 1) requestAnimationFrame(st); else if (done) done() } requestAnimationFrame(st) }
   // smooth-scroll to a section, landing just below the sticky header and section chips;
   // once there, re-measure and correct in case anything above changed height on the way
   function goTo(el, fix) { if (!el) return; var h = d.querySelector('header'), c = d.getElementById('ch'), pt = parseFloat(getComputedStyle(r).paddingTop) || 0, y = Math.min(Math.max(0, el.getBoundingClientRect().top + scrollY - h.offsetHeight - (c.offsetHeight || 0) - pt), r.scrollHeight - innerHeight); if (fix) { if (Math.abs(y - scrollY) > 2) go(y) } else go(y, function () { goTo(el, true) }) }
   d.addEventListener('click', function (ev) { var a = ev.target.closest && ev.target.closest('a[href^="#"]'); if (!a) return; var id = a.getAttribute('href'), el = id.length > 1 ? d.querySelector(id) : null; if (id === '#top') { ev.preventDefault(); closeM(); go(0) } else if (el) { ev.preventDefault(); closeM(); goTo(el) } });
   (function () {
      var box = d.getElementById('github'); if (!box) return;
      var USER = 'Harish1005', cal = box.querySelector('.gcal'), sc = box.querySelector('.gsc'), tt = box.querySelector('.gtt'), yr = box.querySelector('.gyr'), tip = box.querySelector('.gtip'), card = box.querySelector('.gcd'), sm = d.getElementById('gha'),
         MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], map = {}, tot = {};
      function ymd(t) { return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2) }
      function add(t, n) { return new Date(t.getFullYear(), t.getMonth(), t.getDate() + n) }
      function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()) }
      function num(n) { return n.toLocaleString('en-US') }
      function phrase(n, v) { return num(n) + ' contribution' + (n === 1 ? '' : 's') + ' in ' + (v === 'last' ? 'the last year' : v) }
      // 'last' = GitHub's rolling window: from the Sunday 52 weeks before this week, up to today
      function range(v) { var t = today(); return v === 'last' ? { s: add(t, -t.getDay() - 364), e: t } : { s: new Date(+v, 0, 1), e: new Date(+v, 11, 31) } }
      function sum(v) { var r = range(v), t = today(), n = 0; for (var x = r.s; x <= r.e && x <= t; x = add(x, 1)) { var c = map[ymd(x)]; if (c) n += c[0] } return n }
      function hide() { tip.classList.remove('on') }
      function draw(v) {
         var r = range(v), t = today(), g = add(r.s, -r.s.getDay()), wk = Math.floor(Math.round((r.e - g) / 864e5) / 7) + 1, h = '', ml = [], pm = -1;
         cal.style.setProperty('--wk', wk); h += '<span class="gdb"></span>';
         ['Mon', 'Wed', 'Fri'].forEach(function (n, i) { h += '<span class="gd" style="grid-row:' + (i * 2 + 3) + '">' + n + '</span>' });
         for (var w = 0; w < wk; w++) {
            var fm = -1;
            for (var k = 0; k < 7; k++) {
               var x = add(g, w * 7 + k); if (x < r.s || x > r.e || x > t) continue;
               if (fm < 0) fm = x.getMonth();
               var key = ymd(x), c = map[key] || [0, 0];
               h += '<i class="q' + c[1] + '" style="grid-area:' + (k + 2) + '/' + (w + 2) + '" data-d="' + key + '" data-c="' + c[0] + '"></i>'
            }
            if (fm >= 0 && fm !== pm) { if (ml.length && w - ml[ml.length - 1].w < 3) ml.pop(); if (w < wk - 1) ml.push({ w: w, m: fm }); pm = fm }
         }
         ml.forEach(function (o) { h += '<span class="gm" style="grid-column:' + (o.w + 2) + '/span ' + Math.min(3, wk - o.w) + '">' + MO[o.m] + '</span>' });
         cal.innerHTML = h; hide();
         var n = sum(v); tt.innerHTML = '<b>' + num(n) + '</b> ' + phrase(n, v).replace(/^\S+ /, '');
         cal.setAttribute('aria-label', 'GitHub contribution calendar: ' + phrase(n, v));
         [].forEach.call(yr.children, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false') });
         // on narrow screens the calendar scrolls sideways: show the latest days first for the current period
         sc.scrollLeft = 0;
         if (v === 'last' || +v === t.getFullYear()) { var lc = cal.querySelector('i:last-of-type'); if (lc) sc.scrollLeft += lc.getBoundingClientRect().right - sc.getBoundingClientRect().right + 16 }
      }
      function btn(v, label, n) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('data-v', v); b.innerHTML = '<span>' + label + '</span><small>' + num(n) + '</small>'; b.addEventListener('click', function () { draw(v) }); yr.appendChild(b) }
      cal.addEventListener('pointerover', function (e) {
         var c = e.target; if (c.tagName !== 'I') return;
         var n = +c.getAttribute('data-c'), p = c.getAttribute('data-d').split('-');
         tip.textContent = (n ? num(n) + ' contribution' + (n === 1 ? '' : 's') : 'No contributions') + ' on ' + MO[p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
         var a = c.getBoundingClientRect(), b = card.getBoundingClientRect(), hw = tip.offsetWidth / 2, x = a.left + a.width / 2 - b.left - card.clientLeft;
         tip.style.left = Math.max(hw + 8, Math.min(card.clientWidth - hw - 8, x)) + 'px'; tip.style.top = (a.top - b.top - card.clientTop - 6) + 'px'; tip.classList.add('on')
      });
      cal.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide() });
      sc.addEventListener('scroll', hide, { passive: true });
      d.addEventListener('pointerdown', function (e) { if (!cal.contains(e.target)) hide() });
      draw('last');
      fetch('https://github-contributions-api.jogruber.de/v4/' + USER + '?y=all').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() }).then(function (j) {
         (j.contributions || []).forEach(function (c) { map[c.date] = [c.count, c.level]; var y = c.date.slice(0, 4); tot[y] = (tot[y] || 0) + c.count });
         var ys = Object.keys(tot).sort().reverse(), all = 0; if (!ys.length) throw new Error('empty');
         ys.forEach(function (y) { all += tot[y] });
         btn('last', 'Last year', sum('last')); ys.forEach(function (y) { btn(y, y, tot[y]) });
         sm.textContent = num(all) + ' total since ' + ys[ys.length - 1];
         cal.classList.remove('ld'); draw('last')
      }).catch(function () { cal.classList.remove('ld'); card.classList.add('err'); tt.textContent = "Contributions couldn't load right now." });
   })();

   // footer view count: counts once per browser tab session, then only reads (stored by google-sheet-names.gs)
   // Your own visits: open the site once with ?me at the end of the address and that browser stops counting; ?me=off undoes it.
   (function () {
      var el = d.querySelector('.vc'); if (!el || !window.SHEET_URL || !window.fetch) return;
      var seen = false, me = false, q = location.search.match(/[?&]me(?:=([^&]*))?(?:&|$)/);
      try {
         if (q) { if (q[1] === 'off') localStorage.removeItem('pv-me'); else localStorage.setItem('pv-me', '1'); history.replaceState(null, '', location.pathname + location.hash) }
         me = localStorage.getItem('pv-me') === '1'; seen = me || sessionStorage.getItem('pv') === '1'
      } catch (e) { }
      if (me) el.title = 'Your visits on this browser are not counted';
      fetch(window.SHEET_URL + '?views=' + (seen ? 0 : 1)).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() }).then(function (j) {
         var n = +j.views; if (!isFinite(n) || n < 1) return;
         try { sessionStorage.setItem('pv', '1') } catch (e) { }
         el.querySelector('b').textContent = n.toLocaleString('en-IN'); el.lastChild.textContent = n === 1 ? ' view' : ' views'; el.hidden = false
      }).catch(function () { });
   })();
})();
