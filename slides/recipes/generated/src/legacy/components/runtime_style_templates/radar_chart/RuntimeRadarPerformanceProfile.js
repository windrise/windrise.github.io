// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntityLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { comparisonRows, firstString, metricMax, metricNamesForRows, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, uiLabel, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const CX = 800;
const CY = 300;
const R = 164;
const SCHEME = ['#a78bfa', '#22d3ee', '#fb7185', '#facc15', '#4ade80', '#f472b6'];
export const RadarPerformanceProfileDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('radar', scene, rawFrame, 30);
    const rows = comparisonRows(sceneContent, scene).slice(0, 6);
    const axes = metricNamesForRows(rows, 6);
    const palette = paletteFor(sceneContent, true);
    const colorFor = (i) => firstString(palette[i] && i < 1 ? palette[i] : '', SCHEME[i % SCHEME.length]);
    const title = slotTitle(sceneContent);
    if (rows.length < 1 || axes.length < 3 || !title)
        return null;
    const angleFor = (i) => (i / axes.length) * 2 * Math.PI - Math.PI / 2;
    const pointAt = (i, radius) => ({
        x: CX + Math.cos(angleFor(i)) * radius,
        y: CY + Math.sin(angleFor(i)) * radius,
    });
    return (React.createElement(AbsoluteFill, { style: { background: '#0d1117', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 52%, rgba(45,212,191,0.2), transparent 26%), radial-gradient(circle at 76% 18%, rgba(124,92,255,0.18), transparent 26%), linear-gradient(135deg, #0d1117 0%, #141824 60%, #0b0f14 100%)' } }),
        React.createElement(EditableTransform, { id: "rpp-shell", role: "group", style: { display: 'block' } },
            React.createElement("div", { style: { position: 'absolute', left: 96, top: 60, width: 1088, height: 480, borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', boxShadow: '0 36px 90px rgba(0,0,0,0.34)', opacity: cl(frame, [0, 18], [0, 1]) } })),
        React.createElement(EditableTransform, { id: "rpp-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 150, top: 122, width: 360, fontSize: title.length > 24 ? 38 : 48, lineHeight: 1, fontWeight: 860, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "rpp-legend", role: "metric", style: { display: 'block' } },
            React.createElement("div", { style: { position: 'absolute', left: 154, top: 300, display: 'flex', flexDirection: 'column', gap: 14, opacity: cl(frame, [38, 58], [0, 1]) } }, rows.slice(0, 2).map((row, index) => {
                const color = index === 0 ? '#2dd4bf' : '#7c5cff';
                const avg = row.metrics.reduce((sum, metric) => sum + metric.value, 0) / Math.max(1, row.metrics.length);
                const isActive = runtimeContractMatches(animation, row.label);
                return (React.createElement("div", { key: row.label, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', margin: '-8px -10px', borderRadius: 14, background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent', opacity: runtimeContractOpacity(animation, isActive, 1) } },
                    React.createElement("span", { style: { width: 14, height: 14, borderRadius: '50%', background: isActive ? animation.accent : color, boxShadow: `0 0 22px ${(isActive ? animation.accent : color)}80` } }),
                    React.createElement("span", { "data-dm-text-editable": true, style: { fontSize: 16, fontWeight: isActive ? 920 : 780, color: '#f8fafc', minWidth: 72 } },
                        React.createElement(RuntimeEntityLabel, { sceneContent: sceneContent, label: row.label }, truncate(row.label, 12))),
                    React.createElement("span", { "data-dm-text-editable": true, style: { fontSize: 16, fontWeight: 820, color: isActive ? animation.accent : color } },
                        Math.round(avg),
                        " ",
                        uiLabel(sceneContent, 'average', 'avg'))));
            }))),
        React.createElement(EditableTransform, { id: "rpp-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                [0.25, 0.5, 0.75, 1].map((ring, ringIdx) => {
                    const path = axes.map((_, i) => {
                        const p = pointAt(i, R * ring);
                        return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                    }).join(' ') + ' Z';
                    return React.createElement("path", { key: ring, d: path, fill: ringIdx === 3 ? 'rgba(99,102,241,0.04)' : 'none', stroke: "rgba(165,180,252,0.18)", strokeWidth: ringIdx === 3 ? 1.4 : 1 });
                }),
                axes.map((axisName, i) => {
                    const rim = pointAt(i, R);
                    const lbl = pointAt(i, R + 32);
                    const anchor = lbl.x > CX + 6 ? 'start' : lbl.x < CX - 6 ? 'end' : 'middle';
                    return (React.createElement("g", { key: axisName },
                        React.createElement("line", { x1: CX, y1: CY, x2: rim.x, y2: rim.y, stroke: "rgba(165,180,252,0.22)", strokeWidth: 1, strokeDasharray: "2 4" }),
                        React.createElement("text", { "data-dm-text-editable": true, x: lbl.x, y: lbl.y + 4, textAnchor: anchor, fontSize: 15, fontWeight: 820, fill: "rgba(248,250,252,0.72)" }, truncate(axisName, 14))));
                }),
                rows.slice(0, 2).map((row, ri) => {
                    const color = ri === 0 ? '#2dd4bf' : '#7c5cff';
                    const isActive = runtimeContractMatches(animation, row.label);
                    const scale = cl(frame, [14 + ri * 6, 44 + ri * 6], [0, 1]);
                    const verts = axes.map((axisName, i) => {
                        const metric = row.metrics.find((m) => m.name === axisName);
                        const val = metric?.value ?? 0;
                        const max = metricMax(rows, axisName);
                        return pointAt(i, (Math.abs(val) / max) * R * scale);
                    });
                    const path = verts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join(' ') + ' Z';
                    return (React.createElement("g", { key: row.label },
                        React.createElement("path", { d: path, fill: isActive ? animation.accent : color, fillOpacity: isActive ? 0.28 : ri === 0 ? 0.22 : 0.16, stroke: isActive ? animation.accent : color, strokeWidth: isActive ? 6 : ri === 0 ? 4 : 3, strokeLinejoin: "round", filter: isActive ? animation.glow : `drop-shadow(0 0 10px ${color}66)`, opacity: runtimeContractOpacity(animation, isActive, 1) }),
                        verts.map((v, i) => (React.createElement("circle", { key: i, cx: v.x, cy: v.y, r: isActive ? 7 : ri === 0 ? 5.5 : 3.8, fill: ri === 0 ? '#ffffff' : '#0d1117', stroke: isActive ? animation.accent : color, strokeWidth: isActive ? 3.4 : ri === 0 ? 3 : 2.4, opacity: scale * runtimeContractOpacity(animation, isActive, 1) })))));
                })))));
};
