// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { comparisonRows, formatCompact, metricNamesForRows, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const LEFT_X = 200;
const RIGHT_X = 1000;
const NODE_W = 18;
const TOP = 180;
const BOTTOM = 500;
const ribbon = (x0, y0, x1, y1, thick) => {
    const cx = (x0 + x1) / 2;
    const t = thick / 2;
    return `M ${x0} ${y0 - t} C ${cx} ${y0 - t} ${cx} ${y1 - t} ${x1} ${y1 - t} L ${x1} ${y1 + t} C ${cx} ${y1 + t} ${cx} ${y0 + t} ${x0} ${y0 + t} Z`;
};
const layout = (entries, height, gap) => {
    const sum = entries.reduce((acc, e) => acc + e.total, 0) || 1;
    const usable = height - gap * Math.max(0, entries.length - 1);
    let cursor = TOP;
    return entries.map((e) => {
        const h = Math.max(6, (e.total / sum) * usable);
        const node = { label: e.label, total: e.total, y0: cursor, y1: cursor + h };
        cursor += h + gap;
        return node;
    });
};
export const LongFlowSankeyDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('flow', scene, rawFrame, 30);
    // Denser layout: keep up to 8 sources.
    const rows = comparisonRows(sceneContent, scene).slice(0, 8);
    const targets = metricNamesForRows(rows);
    const colors = paletteFor(sceneContent, true);
    const title = slotTitle(sceneContent);
    if (rows.length < 1 || targets.length < 1 || !title)
        return null;
    const flowOf = (r, t) => rows[r].metrics.find((m) => m.name === t)?.value ?? 0;
    const grand = rows.reduce((acc, _r, ri) => acc + targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0), 0) || 1;
    // Tighter gaps when node count is high.
    const srcGap = rows.length > 5 ? 8 : 12;
    const tgtGap = targets.length > 5 ? 8 : 12;
    const height = BOTTOM - TOP;
    const sources = layout(rows.map((row, ri) => ({ label: row.label, total: targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0) })), height, srcGap);
    const tgts = layout(targets.map((t) => ({ label: t, total: rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, t)), 0) })), height, tgtGap);
    const srcCursor = sources.map((n) => n.y0);
    const tgtCursor = tgts.map((n) => n.y0);
    const labelSize = rows.length > 5 ? 13 : 15;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f1419', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff' } },
        React.createElement(EditableTransform, { id: "lfs-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 100, top: 60, width: 1080, fontSize: 38, fontWeight: 850, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "lfs-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', left: 0, top: 0, overflow: 'visible' } },
                rows.map((_row, ri) => targets.map((t, ti) => {
                    const raw = Math.abs(flowOf(ri, t));
                    if (raw / grand < 0.003)
                        return null;
                    const thick = Math.max(1.5, (raw / grand) * height * 1.15);
                    const y0 = srcCursor[ri] + thick / 2;
                    const y1 = tgtCursor[ti] + thick / 2;
                    srcCursor[ri] += thick;
                    tgtCursor[ti] += thick;
                    const color = colors[ri % colors.length];
                    const reveal = cl(frame, [12 + ri * 3 + ti * 2, 40 + ri * 3 + ti * 2], [0, 1]);
                    const isActive = runtimeContractMatches(animation, rows[ri].label, t, `${rows[ri].label} ${t}`);
                    return (React.createElement("path", { key: `${ri}-${t}`, d: ribbon(LEFT_X + NODE_W, y0, RIGHT_X, y1, thick * reveal), fill: isActive ? animation.accent : color, opacity: (isActive ? 0.58 : 0.32) * runtimeContractOpacity(animation, isActive, 1), filter: isActive ? animation.glow : undefined }));
                })),
                sources.map((n, ri) => {
                    const reveal = cl(frame, [5 + ri * 3, 28 + ri * 3], [0, 1]);
                    const color = colors[ri % colors.length];
                    const isActive = runtimeContractMatches(animation, n.label);
                    return (React.createElement("g", { key: `s-${ri}`, opacity: reveal * runtimeContractOpacity(animation, isActive, 1) },
                        React.createElement("rect", { x: LEFT_X, y: n.y0, width: NODE_W, height: Math.max(6, (n.y1 - n.y0) * reveal), rx: 3, fill: isActive ? animation.accent : color, filter: isActive ? animation.glow : undefined }),
                        React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: LEFT_X - 12, y: (n.y0 + n.y1) / 2 - 1, textAnchor: "end", fontSize: labelSize, fontWeight: isActive ? 900 : 760, fill: isActive ? animation.accent : '#e5e7eb', sceneContent: sceneContent, label: n.label }, truncate(n.label, 20)),
                        React.createElement("text", { "data-dm-text-editable": true, x: LEFT_X - 12, y: (n.y0 + n.y1) / 2 + 15, textAnchor: "end", fontSize: 11, fontWeight: 640, fill: "#94a3b8" }, formatCompact(n.total))));
                }),
                tgts.map((n, ti) => {
                    const reveal = cl(frame, [18 + ti * 3, 44 + ti * 3], [0, 1]);
                    const color = colors[(rows.length + ti) % colors.length];
                    const isActive = runtimeContractMatches(animation, n.label);
                    return (React.createElement("g", { key: `t-${ti}`, opacity: reveal * runtimeContractOpacity(animation, isActive, 1) },
                        React.createElement("rect", { x: RIGHT_X, y: n.y0, width: NODE_W, height: Math.max(6, (n.y1 - n.y0) * reveal), rx: 3, fill: isActive ? animation.accent : color, filter: isActive ? animation.glow : undefined }),
                        React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: RIGHT_X + NODE_W + 12, y: (n.y0 + n.y1) / 2 - 1, textAnchor: "start", fontSize: labelSize, fontWeight: isActive ? 900 : 760, fill: isActive ? animation.accent : '#e5e7eb', sceneContent: sceneContent, label: n.label }, truncate(n.label, 20)),
                        React.createElement("text", { "data-dm-text-editable": true, x: RIGHT_X + NODE_W + 12, y: (n.y0 + n.y1) / 2 + 15, textAnchor: "start", fontSize: 11, fontWeight: 640, fill: "#94a3b8" }, formatCompact(n.total))));
                })))));
};
