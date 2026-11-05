// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { firstString, formatCompact, linePath, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, uiLabel, valueExtent, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
});
export const MetricTrendRibbonDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
    const emphasisEase = runtimeContractEase(animation);
    const chart = { left: 210, top: 210, width: 860, height: 230 };
    const chartBox = { left: 154, top: 184, width: 972, height: 344 };
    const p = ease(frame, [18, 76], [0, 1]);
    const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 12);
    const hasRuntimeRows = runtimeRows.length >= 2;
    const values = hasRuntimeRows ? runtimeRows.map((row) => row.value) : [];
    const ext = valueExtent(values);
    const accent = firstString(sceneContent?.style?.line_color, sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#4f46e5');
    const title = slotTitle(sceneContent);
    const latest = runtimeRows[runtimeRows.length - 1];
    if (!hasRuntimeRows || !latest || !title)
        return null;
    const points = values.map((value, index) => ({
        x: chart.left + (index / Math.max(1, values.length - 1)) * chart.width,
        y: chart.top + chart.height - ((value - ext.min) / (ext.max - ext.min || 1)) * chart.height,
    }));
    const visibleCount = Math.max(2, Math.ceil(p * points.length));
    const path = linePath(points.slice(0, visibleCount));
    const area = `${path} L ${points[Math.min(visibleCount - 1, points.length - 1)].x} ${chart.top + chart.height} L ${points[0].x} ${chart.top + chart.height} Z`;
    return (React.createElement(AbsoluteFill, { style: { background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 48%, #f8fafc 100%)' } }),
        React.createElement(EditableTransform, { id: "trend-ribbon-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 106, top: 78, right: 330, fontSize: 50, fontWeight: 890, letterSpacing: '-0.05em', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "trend-ribbon-metric", role: "metric", style: { display: 'block' } },
            React.createElement("div", { style: { position: 'absolute', right: 112, top: 78, width: 186, height: 92, borderRadius: 24, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 24px 60px rgba(15,23,42,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: ease(frame, [30, 52], [0, 1]) } },
                React.createElement("div", { "data-dm-text-editable": true, style: { fontSize: 11, fontWeight: 860, letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase' } }, uiLabel(sceneContent, 'latest', 'Latest')),
                React.createElement("div", { "data-dm-text-editable": true, style: { marginTop: 6, fontSize: 34, lineHeight: 1, fontWeight: 920, color: accent } }, latest.displayValue || formatCompact(latest.value, sceneContent?.data_binding?.y_axis?.label)))),
        React.createElement(EditableTransform, { id: "trend-ribbon-chart", role: "chart", style: { position: 'absolute', left: chartBox.left, top: chartBox.top, width: chartBox.width, height: chartBox.height, display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', left: -chartBox.left, top: -chartBox.top } },
                React.createElement("rect", { x: 154, y: 184, width: 972, height: 344, rx: 30, fill: "#ffffff", filter: "drop-shadow(0 32px 78px rgba(15,23,42,0.12))" }),
                [0, 25, 50, 75, 100].map((tick) => {
                    const y = chart.top + chart.height - (tick / 100) * chart.height;
                    return React.createElement("line", { key: tick, x1: chart.left, x2: chart.left + chart.width, y1: y, y2: y, stroke: "#e5e7eb" });
                }),
                React.createElement("path", { className: "area", d: area, fill: accent, opacity: 0.14 }),
                React.createElement("path", { className: "chart-line", d: path, fill: "none", stroke: accent, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" }),
                points.map((point, index) => {
                    const isActive = runtimeContractMatches(animation, runtimeRows[index]?.label, runtimeRows[index]?.series);
                    return (React.createElement("g", { key: `${runtimeRows[index]?.label}-${index}`, opacity: ease(frame, [28 + index * 6, 48 + index * 6], [0, runtimeContractOpacity(animation, isActive)]) },
                        React.createElement("circle", { className: "dot", cx: point.x, cy: point.y, r: isActive ? 7 + emphasisEase * 0.8 : 7, fill: "#ffffff", stroke: isActive ? animation.accent : accent, strokeWidth: isActive ? animation.strokeWidth : 4, filter: isActive ? animation.glow : undefined }),
                        React.createElement("text", { "data-dm-text-editable": true, x: point.x, y: chart.top + chart.height + 34, textAnchor: "middle", fontSize: 14, fontWeight: 820, fill: "#64748b" }, truncate(runtimeRows[index]?.label, 10))));
                })))));
};
