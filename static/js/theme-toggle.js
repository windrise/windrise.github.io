/* Papers theme toggle (auto/light/dark)
 * Applies class on <body>: papers-theme-dark / papers-theme-light.
 */
(function () {
  'use strict';

  const KEY = 'papersTheme'; // 'auto' | 'dark' | 'light'

  function apply(mode) {
    document.body.classList.remove('papers-theme-dark', 'papers-theme-light');
    if (mode === 'dark') document.body.classList.add('papers-theme-dark');
    if (mode === 'light') document.body.classList.add('papers-theme-light');
  }

  function next(mode) {
    if (mode === 'auto') return 'light';
    if (mode === 'light') return 'dark';
    return 'auto';
  }

  function label(mode) {
    if (mode === 'auto') return '🌓 Auto';
    if (mode === 'light') return '☀️ Light';
    return '🌙 Dark';
  }

  function init() {
    const btn = document.getElementById('papers-theme-toggle');
    if (!btn) return;

    let mode = localStorage.getItem(KEY) || 'auto';
    apply(mode);
    btn.textContent = label(mode);
    btn.setAttribute('data-theme', mode);

    btn.addEventListener('click', () => {
      mode = next(mode);
      localStorage.setItem(KEY, mode);
      apply(mode);
      btn.textContent = label(mode);
      btn.setAttribute('data-theme', mode);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
