// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { comparisonRows, firstString, formatCompact, metricNamesForRows, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export const SwissMinimalReportDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
    const rows = comparisonRows(sceneContent, scene).slice(0, 4);
    const metrics = metricNamesForRows(rows).slice(0, 1);
    const colors = paletteFor(sceneContent, false);
    const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#111827');
    const title = slotTitle(sceneContent);
    if (!rows.length || !metrics.length || !title)
        return null;
    const chart = {
        left: 96,
        top: 186,
        width: 1088,
        height: 308,
        labelWidth: 210,
        valueWidth: 96,
        rowHeight: 62,
        barHeight: 28,
    };
    const metricName = metrics[0];
    const maxValue = Math.max(...rows.map((row) => row.metrics.find((candidate) => candidate.name === metricName)?.value ?? 0), 1);
    const barStart = chart.labelWidth + 32;
    const barMaxWidth = chart.width - barStart - chart.valueWidth - 44;
    return (React.createElement(AbsoluteFill, { style: { background: '#f7f7f2', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 40, border: '2px solid #111111' } }),
        React.createElement(EditableTransform, { id: "smr-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: {
                    position: 'absolute', left: chart.left, top: 76, width: 860,
                    fontSize: 46, fontWeight: 920, letterSpacing: 0, color: '#111827', lineHeight: 1.02,
                    opacity: cl(frame, [0, 18], [0, 1]),
                } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "smr-chart", role: "chart", style: { position: 'absolute', left: chart.left, top: chart.top, width: chart.width, height: chart.height, display: 'block' } },
            React.createElement("svg", { width: chart.width, height: chart.height, viewBox: `0 0 ${chart.width} ${chart.height}`, style: { overflow: 'visible' } },
                React.createElement("line", { x1: barStart, x2: barStart, y1: 0, y2: chart.rowHeight * rows.length + 30, stroke: "#111111", strokeWidth: 2, opacity: cl(frame, [6, 22], [0, 1]) }),
                [0, 25, 50, 75, 100].map((tick) => {
                    const x = barStart + (tick / 100) * barMaxWidth;
                    return (React.createElement("g", { key: tick, opacity: cl(frame, [10, 28], [0, 1]) },
                        React.createElement("line", { x1: x, x2: x, y1: 0, y2: chart.rowHeight * rows.length + 20, stroke: "#d1d5db" }),
                        React.createElement("text", { x: x, y: chart.rowHeight * rows.length + 46, textAnchor: "middle", fontSize: 12, fontWeight: 800, fill: "#111111" }, tick)));
                }),
                rows.map((row, index) => {
                    const metric = row.metrics.find((candidate) => candidate.name === metricName);
                    const value = metric?.value ?? 0;
                    const progress = cl(frame, [18 + index * 8, 48 + index * 8], [0, 1]);
                    const y = index * chart.rowHeight + 22;
                    const width = Math.max(8, (value / maxValue) * barMaxWidth);
                    const color = index === 0 ? '#ef4444' : firstString(metric?.color, colors[index % colors.length], '#111111');
                    const isActive = runtimeContractMatches(animation, row.label, metricName, `${row.label} ${metricName}`);
                    return (React.createElement("g", { key: row.label, opacity: runtimeContractOpacity(animation, isActive, 1) },
                        React.createElement("text", { "data-dm-text-editable": true, x: barStart - 26, y: y + 21, textAnchor: "end", fontSize: 21, fontWeight: 900, fill: isActive ? animation.accent : '#111111', opacity: progress }, truncate(row.label, 18)),
                        React.createElement("rect", { x: barStart, y: y, width: width * progress, height: chart.barHeight, fill: isActive ? animation.accent : color, filter: isActive ? animation.glow : undefined }),
                        React.createElement("text", { "data-dm-text-editable": true, x: barStart + width + 18, y: y + 21, fontSize: 20, fontWeight: 900, fill: isActive ? animation.accent : '#111111', opacity: progress }, metric?.displayValue || formatCompact(value, metricName))));
                })))));
};
