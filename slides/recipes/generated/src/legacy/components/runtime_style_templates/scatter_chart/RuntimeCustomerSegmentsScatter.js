// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { firstString, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const chart = { left: 200, top: 188, width: 860, height: 360 };
export const CustomerSegmentsScatterDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('scatter', scene, rawFrame, 30);
    const accent = firstString(animation.accent, '#2563eb');
    const palette = paletteFor(sceneContent, false);
    const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 14);
    const points = runtimeRows.map((point, index) => ({ ...point, size: point.size ?? 16, color: point.color || palette[index % palette.length] }));
    const xExt = valueExtent(points.map((point) => point.x));
    const yExt = valueExtent(points.map((point) => point.y));
    const sizeMax = Math.max(1, ...points.map((point) => Math.abs(point.size)));
    const px = (value) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
    const py = (value) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
    const title = slotTitle(sceneContent);
    const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.mapping?.x || '';
    const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.mapping?.y || '';
    if (!points.length || !title)
        return null;
    // Choose identity-label positions from final geometry, not animation frames.
    // Expanded icon labels must avoid adjacent bubbles without jumping on focus.
    const placed = [];
    const labels = points.map((point, index) => {
        const cx = px(point.x), cy = py(point.y), radius = (8 + Math.abs(point.size) / sizeMax * 12) * 1.16;
        const width = truncate(point.label, 16).length * 7.8 + 36;
        const candidates = [
            { x: cx + radius + 8, y: cy - 8, anchor: 'start' },
            { x: cx - radius - 8, y: cy - 8, anchor: 'end' },
            { x: cx, y: cy + radius + 30, anchor: 'middle' },
            { x: cx, y: cy - radius - 14, anchor: 'middle' },
        ].map(candidate => {
            const left = candidate.anchor === 'start' ? candidate.x : candidate.anchor === 'end' ? candidate.x - width : candidate.x - width / 2 - 12;
            const box = { left, right: left + width, top: candidate.y - 22, bottom: candidate.y + 6 };
            let score = (box.left < 90 || box.right > 1190 || box.top < 148 || box.bottom > 620) ? 1000 : 0;
            for (const [j, other] of points.entries())
                if (j !== index) {
                    const ox = px(other.x), oy = py(other.y), r = (8 + Math.abs(other.size) / sizeMax * 12) * 1.16 + 6;
                    const dx = ox - Math.max(box.left, Math.min(box.right, ox)), dy = oy - Math.max(box.top, Math.min(box.bottom, oy));
                    if (dx * dx + dy * dy < r * r)
                        score += 10;
                }
            for (const other of placed)
                if (box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)
                    score += 20;
            return { ...candidate, box, score };
        });
        candidates.sort((a, b) => a.score - b.score);
        const chosen = candidates[0];
        placed.push(chosen.box);
        return chosen;
    });
    return (React.createElement(AbsoluteFill, { style: { background: '#eef2f9', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #f7f9ff 0%, #eaf0fb 50%, #eef2f9 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 60, top: 56, width: 1160, height: 590, borderRadius: 28, background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.16)', boxShadow: '0 28px 80px rgba(15,23,42,0.10)', opacity: ease(frame, [0, 16], [0, 1]) } }),
        React.createElement(EditableTransform, { id: "css-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 104, top: 92, width: 820, fontSize: 42, fontWeight: 880, letterSpacing: '-0.04em', color: '#0f172a', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 60)),
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 106, top: 144, fontSize: 13, fontWeight: 760, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b', opacity: ease(frame, [6, 22], [0, 1]) } }, "Customer segments")),
        React.createElement(EditableTransform, { id: "css-axes", role: "annotation", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: chart.left + chart.width / 2 - 70, top: chart.top + chart.height + 44, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: ease(frame, [12, 28], [0, 1]) } }, xLabel),
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: chart.left - 92, top: chart.top + chart.height / 2 - 30, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'center center', opacity: ease(frame, [12, 28], [0, 1]) } }, yLabel)),
        React.createElement(EditableTransform, { id: "css-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                [0, 0.25, 0.5, 0.75, 1].map((tick) => {
                    const xValue = xExt.min + tick * (xExt.max - xExt.min);
                    const yValue = yExt.min + tick * (yExt.max - yExt.min);
                    return (React.createElement("g", { key: tick },
                        React.createElement("line", { x1: chart.left, x2: chart.left + chart.width, y1: py(yValue), y2: py(yValue), stroke: tick === 0 ? '#94a3b8' : '#e2e8f0', strokeWidth: tick === 0 ? 2 : 1 }),
                        React.createElement("line", { x1: px(xValue), x2: px(xValue), y1: chart.top, y2: chart.top + chart.height, stroke: tick === 0 ? '#94a3b8' : '#e2e8f0', strokeWidth: tick === 0 ? 2 : 1 })));
                }),
                points.map((point, index) => {
                    const progress = ease(frame, [16 + index * 6, 42 + index * 6], [0, 1]);
                    const isActive = runtimeContractMatches(animation, point.label);
                    const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
                    const radius = (8 + (Math.abs(point.size) / sizeMax) * 12) * (isActive ? 1.16 : 1);
                    const cx = px(point.x);
                    const cy = py(point.y);
                    const fill = isActive ? accent : point.color;
                    return (React.createElement("g", { key: `${point.label}-${index}`, opacity: runtimeContractOpacity(animation, isActive, progress) },
                        React.createElement("circle", { cx: cx, cy: cy, r: (radius + 12 + focus * 6) * progress, fill: fill, opacity: isActive ? 0.18 : 0.1 }),
                        React.createElement("circle", { cx: cx, cy: cy, r: radius * progress, fill: fill, stroke: "#ffffff", strokeWidth: 2.4, filter: isActive ? animation.glow : undefined }),
                        React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: labels[index].x, y: labels[index].y, textAnchor: labels[index].anchor, fontSize: 13, fontWeight: isActive ? 900 : 760, fill: isActive ? '#0f172a' : '#1e293b', sceneContent: sceneContent, label: point.label }, truncate(point.label, 16))));
                })))));
};
