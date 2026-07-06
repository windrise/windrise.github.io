/* Gaussian Observatory homepage — ambient canvas, citation sparkline, paper filtering.
   Content is server-rendered by Hugo; this file only adds interactivity. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var dataEl = document.getElementById('obs-data');
    var DATA = { hist: [], accent: '#0E7C86', catColors: [] };
    try { DATA = JSON.parse(dataEl.textContent); } catch (e) { /* keep defaults */ }

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }
    function sv(name, attrs) {
      var e = document.createElementNS('http://www.w3.org/2000/svg', name);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function rgba(hex, a) {
      var h = hex.replace('#', '');
      return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' +
        parseInt(h.slice(4, 6), 16) + ',' + a + ')';
    }
    var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: true };

    /* ---- ambient gaussian canvas ---- */
    var cv = document.querySelector('.obs-sky');
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
      var hues = [DATA.accent, DATA.accent, DATA.accent].concat(DATA.catColors);
      var blobs = [];
      for (var i = 0; i < 40; i++) {
        blobs.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 44 + Math.random() * 130,
          c: hues[i % hues.length],
          a: 0.04 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.11,
          vy: (Math.random() - 0.5) * 0.09
        });
      }
      var draw = function () {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < blobs.length; i++) {
          var b = blobs[i];
          var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0, rgba(b.c, b.a));
          g.addColorStop(1, rgba(b.c, 0));
          ctx.fillStyle = g;
          ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        }
      };
      var step = function () {
        for (var i = 0; i < blobs.length; i++) {
          var b = blobs[i];
          b.x += b.vx; b.y += b.vy;
          if (b.x < -b.r) b.x = W + b.r;
          if (b.x > W + b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = H + b.r;
          if (b.y > H + b.r) b.y = -b.r;
        }
      };
      var running = false;
      var tick = function () {
        if (reduceMotion.matches) { running = false; return; }
        step(); draw();
        requestAnimationFrame(tick);
      };
      draw();
      if (!reduceMotion.matches) { running = true; requestAnimationFrame(tick); }
      if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener('change', function () {
          if (!reduceMotion.matches && !running) { running = true; requestAnimationFrame(tick); }
        });
      }
    }

    /* ---- citation sparkline ---- */
    var wrap = document.querySelector('.obs-spark-wrap');
    var hist = DATA.hist || [];
    if (wrap && hist.length >= 2) {
      var SW = 460, SH = 152, X0 = 12, X1 = 420, Y0 = 12, Y1 = 124;
      var ts = hist.map(function (p) { return Date.parse(p.date); });
      var t0 = ts[0], t1 = ts[ts.length - 1];
      var vals = hist.map(function (p) { return p.count; });
      var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
      var pad = (mx - mn) * 0.1 || 1;
      var lo = mn - pad, hi = mx + pad;
      var first = hist[0], last = hist[hist.length - 1];
      function sx(i) { return X0 + (ts[i] - t0) / (t1 - t0) * (X1 - X0); }
      function sy(v) { return Y0 + (hi - v) / (hi - lo) * (Y1 - Y0); }

      var svg = sv('svg', {
        class: 'obs-spark', viewBox: '0 0 ' + SW + ' ' + SH, role: 'img',
        'aria-label': 'Citation growth from ' + fmt(first.count) + ' (' + first.date + ') to ' +
          fmt(last.count) + ' (' + last.date + ')'
      });

      /* gridlines at round thousands within range (max 4) */
      var stepV = Math.max(1000, Math.round((mx - mn) / 3000) * 1000);
      var glines = [];
      for (var v = Math.ceil(lo / stepV) * stepV; v <= hi && glines.length < 4; v += stepV) glines.push(v);
      glines.forEach(function (v) {
        var gy = sy(v);
        svg.appendChild(sv('line', { class: 'gl', x1: X0, x2: X1, y1: gy, y2: gy }));
        var t = sv('text', { class: 'glab', x: X1 + 7, y: gy + 3 });
        t.textContent = fmt(v);
        svg.appendChild(t);
      });

      var pts = vals.map(function (v, i) { return sx(i).toFixed(1) + ',' + sy(v).toFixed(1); });
      svg.appendChild(sv('path', { class: 'ar', d: 'M' + pts.join('L') + 'L' + X1 + ',' + Y1 + 'L' + X0 + ',' + Y1 + 'Z' }));
      svg.appendChild(sv('path', { class: 'ln', d: 'M' + pts.join('L') }));

      var d1 = sv('text', { class: 'ax', x: X0, y: SH - 6, 'text-anchor': 'start' });
      d1.textContent = first.date;
      svg.appendChild(d1);
      var d2 = sv('text', { class: 'ax', x: X1, y: SH - 6, 'text-anchor': 'end' });
      d2.textContent = last.date;
      svg.appendChild(d2);
      svg.appendChild(sv('circle', { class: 'dot', cx: sx(vals.length - 1), cy: sy(last.count), r: 3.5 }));

      var mark = sv('circle', { class: 'mark', r: 3 });
      svg.appendChild(mark);
      var tt = wrap.querySelector('.obs-tt');
      function showTT(i) {
        var x = sx(i), y = sy(vals[i]), px = x / SW * 100;
        tt.textContent = '';
        tt.appendChild(el('span', null, hist[i].date + ' — '));
        tt.appendChild(el('strong', null, fmt(vals[i])));
        tt.style.left = px + '%';
        tt.style.top = (y / SH * 100) + '%';
        tt.style.transform = 'translate(' + (px > 84 ? '-88%' : (px < 16 ? '-12%' : '-50%')) + ',-135%)';
        tt.classList.add('on');
        mark.setAttribute('cx', x);
        mark.setAttribute('cy', y);
        mark.classList.add('on');
      }
      function hideTT() { tt.classList.remove('on'); mark.classList.remove('on'); }
      hist.forEach(function (p, i) {
        var h = sv('circle', {
          class: 'hit', cx: sx(i), cy: sy(vals[i]), r: 11, tabindex: '0', role: 'img',
          'aria-label': p.date + ' — ' + fmt(p.count) + ' citations'
        });
        h.addEventListener('mouseenter', function () { showTT(i); });
        h.addEventListener('mouseleave', hideTT);
        h.addEventListener('focus', function () { showTT(i); });
        h.addEventListener('blur', hideTT);
        svg.appendChild(h);
      });
      wrap.insertBefore(svg, tt);
    }

    /* ---- paper browser filtering ---- */
    var plist = document.querySelector('.obs-plist');
    if (plist) {
      var rows = Array.prototype.map.call(plist.querySelectorAll('article'), function (a) {
        return {
          elm: a,
          hay: a.getAttribute('data-search') || '',
          cats: (a.getAttribute('data-cats') || '').split(' ').filter(Boolean)
        };
      });
      var input = document.getElementById('obs-q');
      var countEl = document.querySelector('.obs-count');
      var empty = document.querySelector('.obs-empty');
      var chips = Array.prototype.slice.call(document.querySelectorAll('.obs-fchip'));
      var activeCat = 'all';

      function filter() {
        var q = (input.value || '').trim().toLowerCase();
        var shown = 0;
        rows.forEach(function (r) {
          var m = (!q || r.hay.indexOf(q) >= 0) &&
            (activeCat === 'all' || r.cats.indexOf(activeCat) >= 0);
          r.elm.hidden = !m;
          if (m) shown++;
        });
        countEl.textContent = shown + ' / ' + rows.length + ' papers';
        empty.hidden = shown !== 0;
      }
      function setCat(id) {
        activeCat = id;
        chips.forEach(function (b) {
          var on = b.getAttribute('data-cat') === id;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        filter();
      }
      chips.forEach(function (b) {
        b.addEventListener('click', function () { setCat(b.getAttribute('data-cat')); });
      });
      input.addEventListener('input', filter);
      document.querySelector('.obs-clear').addEventListener('click', function () {
        input.value = '';
        setCat('all');
      });
      filter();
    }
  });
})();
