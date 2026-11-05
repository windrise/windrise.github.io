// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { calculateChartCamera } from '../../src/camera/chartCamera.js';
const font = 'Inter, "Noto Sans SC", sans-serif';
export const PullBackIsolation = p => { const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const focus = Math.min(p.items.length - 1, Math.max(0, p.focusIndex)); const cam = calculateChartCamera({ profile: 'pull_back_isolation', frame, fps, durationInFrames, canvasWidth: 1920, canvasHeight: 1080, focusX: 330 + focus * 250, focusY: 530 }); const isolate = interpolate(frame, [fps * 3.1, fps * 5.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); return React.createElement(AbsoluteFill, { style: { background: '#090b12', fontFamily: font, color: '#fff', overflow: 'hidden' } },
    React.createElement("div", { style: { position: 'absolute', inset: 0, background: `radial-gradient(circle at ${(330 + focus * 250) / 19.2}% 50%,rgba(113,82,255,.28),transparent ${34 - 12 * isolate}%),#090b12` } }),
    React.createElement("div", { style: { position: 'absolute', inset: 0, transformOrigin: `${cam.origin.x}px ${cam.origin.y}px`, transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.scale})` } },
        React.createElement("header", { style: { position: 'absolute', left: 90, top: 76 } },
            React.createElement("div", { style: { color: p.accentColor, letterSpacing: 3, fontWeight: 700 } }, "PULL BACK \u00B7 ISOLATE"),
            React.createElement("h1", { style: { fontSize: 55, margin: '15px 0 8px' } }, p.title),
            React.createElement("p", { style: { fontSize: 23, color: '#9aa1b3' } }, p.subtitle)),
        React.createElement("div", { style: { position: 'absolute', left: 90, right: 90, top: 350, display: 'flex', gap: 35 } }, p.items.map((item, i) => { const active = i === focus; return React.createElement("div", { key: item.label, style: { width: 215, height: 330, padding: '28px', borderRadius: 22, background: active ? 'linear-gradient(160deg,#30266d,#17172c)' : '#151821', border: `1px solid ${active ? p.accentColor : '#2a2e3a'}`, opacity: active ? 1 : 1 - isolate * .88, transform: `translateY(${active ? -18 * isolate : 20 * isolate}px) scale(${active ? 1 + .06 * isolate : 1 - .08 * isolate})`, boxShadow: active ? `0 30px 90px rgba(92,70,255,${.12 + .25 * isolate})` : 'none' } },
            React.createElement("span", { style: { color: '#9299aa' } }, String(i + 1).padStart(2, '0')),
            React.createElement("div", { style: { fontSize: 25, fontWeight: 700, marginTop: 48 } },
                React.createElement(EntityIcon, { src: item.iconSrc, size: 48 }),
                React.createElement("div", { style: { marginTop: 10 } }, item.label)),
            React.createElement("strong", { style: { display: 'block', fontSize: 57, color: active ? p.accentColor : '#c9ced8', marginTop: 20 } },
                item.value,
                React.createElement("small", { style: { fontSize: 20 } }, p.unit))); }))),
    React.createElement("aside", { style: { position: 'absolute', right: 100, bottom: 70, width: 620, padding: '24px 30px', borderLeft: `5px solid ${p.accentColor}`, background: 'rgba(13,15,24,.88)', opacity: isolate } },
        React.createElement("div", { style: { fontSize: 25, lineHeight: 1.5 } }, p.insight)),
    React.createElement("footer", { style: { position: 'absolute', left: 90, bottom: 65, color: '#71798b' } },
        "\u6765\u6E90\uFF1A",
        p.source)); };
