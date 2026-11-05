// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export const ConversionFunnelCleanDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
    const palette = paletteFor(sceneContent, false);
    const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 7);
    // Funnel stages read top-to-bottom in the data's given order (widest first).
    const rows = runtimeRows.map((row, index) => ({ ...row, color: row.color || palette[index % palette.length] }));
    const title = slotTitle(sceneContent);
    if (rows.length < 2 || !title)
        return null;
    const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
    const top = rows[0].value || maxValue;
    const TOP = 192;
    const STAGE_H = Math.min(58, Math.floor((560 - TOP) / rows.length) - 12);
    const GAP = 12;
    const CENTER = 470;
    const MAX_W = 660;
    return (React.createElement(AbsoluteFill, { style: { background: '#f7f9fc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eef2ff 52%, #f7f9fc 100%)' } }),
        React.createElement(EditableTransform, { id: "cfc-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 80, top: 70, width: 1040, fontSize: 38, fontWeight: 880, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "cfc-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } }, rows.map((row, index) => {
                const progress = cl(frame, [12 + index * 6, 40 + index * 6], [0, 1]);
                const isActive = runtimeContractMatches(animation, row.label);
                const wTop = (Math.abs(row.value) / maxValue) * MAX_W;
                const nextVal = index < rows.length - 1 ? Math.abs(rows[index + 1].value) : Math.abs(row.value);
                const wBot = (nextVal / maxValue) * MAX_W;
                const y = TOP + index * (STAGE_H + GAP);
                const halfTop = (wTop / 2) * progress;
                const halfBot = (wBot / 2) * progress;
                const pct = top ? (row.value / top) * 100 : 0;
                const points = `${CENTER - halfTop},${y} ${CENTER + halfTop},${y} ${CENTER + halfBot},${y + STAGE_H} ${CENTER - halfBot},${y + STAGE_H}`;
                return (React.createElement("g", { key: `${row.label}-${index}`, opacity: runtimeContractOpacity(animation, isActive) },
                    React.createElement("polygon", { points: points, fill: row.color, opacity: isActive ? 1 : 0.9, stroke: isActive ? animation.accent : 'transparent', strokeWidth: isActive ? animation.strokeWidth : 0, filter: isActive ? animation.glow : undefined }),
                    React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: CENTER, y: y + STAGE_H / 2 + 6, textAnchor: "middle", fontSize: 16, fontWeight: 860, fill: "#ffffff", opacity: progress, sceneContent: sceneContent, label: row.label }, truncate(row.label, 22)),
                    React.createElement("text", { "data-dm-text-editable": true, x: CENTER + MAX_W / 2 + 40, y: y + STAGE_H / 2 - 2, fontSize: 20, fontWeight: 900, fill: isActive ? animation.accent : '#0f172a', opacity: progress }, row.displayValue || formatCompact(row.value, row.label)),
                    React.createElement("text", { "data-dm-text-editable": true, x: CENTER + MAX_W / 2 + 40, y: y + STAGE_H / 2 + 20, fontSize: 13, fontWeight: 740, fill: "#64748b", opacity: progress },
                        trimNumber(pct, 1),
                        "%")));
            })))));
};
