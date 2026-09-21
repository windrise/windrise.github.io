(() => {
  const scene = document.getElementById('gaussian-scene');
  const canvas = document.getElementById('gs-canvas');
  if (!scene || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = document.getElementById('gs-pause');
  const reset = document.getElementById('gs-reset');
  const shapeButtons = [...scene.querySelectorAll('[data-shape]')];
  let width = 0, height = 0, points = [], shape = 'knot';
  let yaw = .48, pitch = -.32, paused = reducedMotion.matches;
  let visible = true, dragging = false, pointer = null, previousX = 0, previousY = 0;
  let request = 0, previousTime = 0, lastPaint = 0;
  const sprites = ['#c5d5ba', '#c9a272', '#72a998'].map((color) => {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const context = sprite.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, color + 'ef');
    gradient.addColorStop(.24, color + 'df');
    gradient.addColorStop(.54, color + '91');
    gradient.addColorStop(1, color + '00');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    return sprite;
  });
  const center = (t) => shape === 'knot'
    ? [(1 + .36 * Math.cos(3 * t)) * Math.cos(2 * t), (1 + .36 * Math.cos(3 * t)) * Math.sin(2 * t), .43 * Math.sin(3 * t)]
    : [1.08 * Math.cos(t), (t / Math.PI - 2) * .55, 1.08 * Math.sin(t)];
  const normalize = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  function makePoints() {
    points = [];
    const steps = width < 380 ? 104 : 148;
    const ring = 13;
    for (let i = 0; i < steps; i += 1) {
      const t = i / steps * Math.PI * (shape === 'knot' ? 2 : 4);
      const c = center(t), next = center(t + .001);
      const tangent = normalize(next.map((v, j) => v - c[j]));
      const n = normalize(cross(tangent, [0, 0, 1]));
      const b = normalize(cross(tangent, n));
      const tube = shape === 'knot' ? .23 : .19 + .06 * Math.sin(t * .5);
      for (let j = 0; j < ring; j += 1) {
        const angle = j / ring * Math.PI * 2 + i * .29;
        const jitter = Math.sin(i * 57.1 + j * 31.7);
        const r = tube + jitter * .008;
        const p = c.map((v, k) => v + r * (Math.cos(angle) * n[k] + Math.sin(angle) * b[k]));
        points.push({ x: p[0], y: p[1], z: p[2], size: 1 + .13 * jitter, color: Math.sin(t + angle * .3) > .15 ? 0 : (Math.cos(t * .5) > .1 ? 1 : 2) });
      }
    }
  }
  function project(x, y, z) {
    const a = x * Math.cos(yaw) + z * Math.sin(yaw);
    const c = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const b = y * Math.cos(pitch) - c * Math.sin(pitch);
    const d = y * Math.sin(pitch) + c * Math.cos(pitch);
    const perspective = 4.8 / (4.8 + d);
    const scale = Math.min(width, height * 1.15) * .265;
    return { x: width * .5 + a * scale * perspective, y: height * .48 + b * scale * perspective, z: d, scale: perspective };
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    // A grounded shadow and perspective grid make the depth legible at rest.
    const shadow = ctx.createRadialGradient(width * .5, height * .85, 0, width * .5, height * .85, width * .35);
    shadow.addColorStop(0, '#061a2199'); shadow.addColorStop(1, '#061a2100');
    ctx.save(); ctx.translate(0, height * .51); ctx.scale(1, .4);
    ctx.fillStyle = shadow; ctx.fillRect(0, 0, width, height * 2); ctx.restore();
    ctx.strokeStyle = '#8baea616'; ctx.lineWidth = .7;
    for (let i = -4; i <= 4; i += 1) {
      const v = i * .55;
      [[v, 1.75, -2.2, v, 1.75, 2.2], [-2.2, 1.75, v, 2.2, 1.75, v]].forEach((line) => {
        const a = project(...line.slice(0, 3)), b = project(...line.slice(3));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
    }
    const projected = points.map((p) => ({ ...project(p.x, p.y, p.z), size: p.size, color: p.color })).sort((a, b) => b.z - a.z);
    const base = Math.max(2.6, width / 113);
    projected.forEach((p) => {
      const radius = base * p.scale * p.size;
      ctx.globalAlpha = Math.min(.95, Math.max(.3, .69 - p.z * .13));
      ctx.drawImage(sprites[p.color], p.x - radius, p.y - radius, radius * 2, radius * 2);
    });
    ctx.globalAlpha = 1;
  }
  function syncControls() {
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    pause.setAttribute('aria-pressed', String(paused));
    scene.dataset.motion = paused ? 'paused' : 'playing';
    scene.dataset.view = `${shape}:${yaw.toFixed(2)}:${pitch.toFixed(2)}`;
  }
  function frame(time) {
    request = 0;
    if (!visible || document.hidden || paused || dragging) { previousTime = 0; return; }
    if (time - lastPaint >= 1000 / 30) {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, .07) : 0;
      yaw += dt * .115;
      previousTime = time; lastPaint = time;
      draw();
    }
    request = requestAnimationFrame(frame);
  }
  function start() {
    if (!request && visible && !document.hidden && !paused && !dragging) request = requestAnimationFrame(frame);
  }
  function stop() { if (request) cancelAnimationFrame(request); request = 0; previousTime = 0; }
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    makePoints(); draw();
  }
  pause.addEventListener('click', () => { paused = !paused; syncControls(); paused ? stop() : start(); });
  reset.addEventListener('click', () => { yaw = .48; pitch = -.32; draw(); syncControls(); });
  shapeButtons.forEach((button) => button.addEventListener('click', () => {
    shape = button.dataset.shape;
    shapeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    makePoints(); draw(); syncControls();
  }));
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    pointer = event.pointerId; dragging = true; previousX = event.clientX; previousY = event.clientY;
    canvas.setPointerCapture(pointer); stop();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== pointer) return;
    yaw += (event.clientX - previousX) * .009;
    // Vertical touch gestures belong to page scrolling; mouse users can orbit both axes.
    if (event.pointerType !== 'touch') pitch = Math.max(-1.1, Math.min(1.1, pitch + (event.clientY - previousY) * .008));
    previousX = event.clientX; previousY = event.clientY; draw(); syncControls();
  });
  const release = () => { dragging = false; pointer = null; start(); };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release); canvas.addEventListener('lostpointercapture', release);
  canvas.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') yaw -= .16;
    if (event.key === 'ArrowRight') yaw += .16;
    if (event.key === 'ArrowUp') pitch = Math.max(-1.1, pitch - .12);
    if (event.key === 'ArrowDown') pitch = Math.min(1.1, pitch + .12);
    if (event.key === 'Home') { yaw = .48; pitch = -.32; }
    draw(); syncControls();
  });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  reducedMotion.addEventListener('change', (event) => { paused = event.matches; syncControls(); paused ? stop() : start(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }, { threshold: .05 }).observe(scene);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas.parentElement);
  else window.addEventListener('resize', resize);
  canvas.hidden = false;
  scene.querySelector('.gs-fallback').hidden = true;
  // SVG's hidden attribute is not consistently reflected as a property.
  scene.querySelector('.gs-fallback').setAttribute('hidden', '');
  scene.querySelector('.gs-controls').hidden = false;
  document.getElementById('gs-drag').hidden = false;
  scene.dataset.ready = 'true';
  resize(); syncControls(); start();
})();
