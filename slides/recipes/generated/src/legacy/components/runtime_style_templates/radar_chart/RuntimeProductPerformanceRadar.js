// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntityLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { comparisonRows, firstString, metricMax, metricNamesForRows, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, uiLabel, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const CX = 640;
const CY = 392;
const R = 190;
export const ProductPerformanceRadarDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('radar', scene, rawFrame, 30);
    const rows = comparisonRows(sceneContent, scene).slice(0, 6);
    const axes = metricNamesForRows(rows, 6);
    const colors = paletteFor(sceneContent, true);
    const title = slotTitle(sceneContent);
    if (rows.length < 1 || axes.length < 3 || !title)
        return null;
    const angleFor = (i) => (i / axes.length) * 2 * Math.PI - Math.PI / 2;
    const pointAt = (i, radius) => ({
        x: CX + Math.cos(angleFor(i)) * radius,
        y: CY + Math.sin(angleFor(i)) * radius,
    });
    return (React.createElement(AbsoluteFill, { style: { background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(20,184,166,0.18), transparent 38%), linear-gradient(145deg, #111827 0%, #172033 55%, #0f172a 100%)' } }),
        React.createElement(EditableTransform, { id: "ppr-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 0, right: 0, top: 72, textAlign: 'center', fontSize: 48, fontWeight: 850, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 178, width: 260, fontSize: 20, fontWeight: 780, opacity: cl(frame, [12, 32], [0, 1]) } }, rows.slice(0, 1).map((row) => React.createElement("span", { key: row.label },
            React.createElement(RuntimeEntityLabel, { sceneContent: sceneContent, label: row.label }, truncate(row.label, 26))))),
        React.createElement(EditableTransform, { id: "ppr-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                [0.25, 0.5, 0.75, 1].map((ring) => {
                    const path = axes.map((_, i) => {
                        const p = pointAt(i, R * ring);
                        return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                    }).join(' ') + ' Z';
                    return React.createElement("path", { key: ring, d: path, fill: "none", stroke: "rgba(255,255,255,0.13)", strokeWidth: 1.5 });
                }),
                axes.map((axisName, i) => {
                    const rim = pointAt(i, R);
                    const lbl = pointAt(i, R + 34);
                    const anchor = lbl.x > CX + 6 ? 'start' : lbl.x < CX - 6 ? 'end' : 'middle';
                    return (React.createElement("g", { key: axisName },
                        React.createElement("line", { x1: CX, y1: CY, x2: rim.x, y2: rim.y, stroke: "rgba(255,255,255,0.13)", strokeWidth: 1 }),
                        React.createElement("text", { "data-dm-text-editable": true, x: lbl.x, y: lbl.y + 4, textAnchor: anchor, fontSize: 16, fontWeight: 820, fill: "rgba(255,255,255,0.72)" }, truncate(axisName, 14))));
                }),
                rows.slice(0, 1).map((row, ri) => {
                    const color = firstString(row.metrics[0]?.color, colors[ri % colors.length]);
                    const isActive = runtimeContractMatches(animation, row.label);
                    const scale = cl(frame, [12 + ri * 5, 40 + ri * 5], [0, 1]);
                    const verts = axes.map((axisName, i) => {
                        const metric = row.metrics.find((m) => m.name === axisName);
                        const val = metric?.value ?? 0;
                        const max = metricMax(rows, axisName);
                        return pointAt(i, (Math.abs(val) / max) * R * scale);
                    });
                    const path = verts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join(' ') + ' Z';
                    return (React.createElement("g", { key: row.label },
                        React.createElement("path", { d: path, fill: isActive ? animation.accent : color, fillOpacity: isActive ? 0.34 : 0.28, stroke: isActive ? animation.accent : color, strokeWidth: isActive ? 7 : 5, strokeLinejoin: "round", filter: isActive ? animation.glow : `drop-shadow(0 0 8px ${color}55)`, opacity: runtimeContractOpacity(animation, isActive, 1) }),
                        verts.map((v, i) => (React.createElement("circle", { key: i, cx: v.x, cy: v.y, r: isActive ? 9 : 7, fill: "#ffffff", stroke: isActive ? animation.accent : undefined, strokeWidth: isActive ? 3 : 0, opacity: scale * runtimeContractOpacity(animation, isActive, 1) })))));
                }),
                React.createElement("circle", { cx: CX, cy: CY, r: 72, fill: "rgba(255,255,255,0.07)" }),
                React.createElement("text", { "data-dm-text-editable": true, x: CX, y: CY - 4, textAnchor: "middle", fontSize: 38, fontWeight: 870, fill: "#ffffff" }, Math.round(76 * cl(frame, [20, 68], [0, 1]))),
                React.createElement("text", { "data-dm-text-editable": true, x: CX, y: CY + 28, textAnchor: "middle", fontSize: 13, fontWeight: 850, fill: "rgba(255,255,255,0.5)", letterSpacing: "0.16em" }, uiLabel(sceneContent, 'score', 'SCORE'))))));
};
