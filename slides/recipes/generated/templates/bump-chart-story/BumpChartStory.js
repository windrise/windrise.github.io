// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { EntityIcon } from '../../src/entityVisuals.js';
const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const chart = { left: 610, top: 210, width: 1190, height: 650 };
const rankAt = (series, periodIndex, seriesIndex) => {
    const ordered = series
        .map((item, index) => ({ index, value: item.values[periodIndex] ?? 0 }))
        .sort((a, b) => b.value - a.value);
    return ordered.findIndex(item => item.index === seriesIndex);
};
const smoothPath = (points) => points.reduce((path, point, index) => {
    if (index === 0)
        return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const middle = (previous.x + point.x) / 2;
    return `${path} C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
}, '');
export const BumpChartStory = props => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const intro = spring({ frame, fps, durationInFrames: Math.round(fps * 0.7), config: { damping: 180 } });
    const timeline = interpolate(frame, [fps * 0.8, fps * 6.4], [0, props.periods.length - 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
    });
    const currentPeriod = Math.min(props.periods.length - 1, Math.round(timeline));
    const currentX = chart.left + (timeline / Math.max(1, props.periods.length - 1)) * chart.width;
    const rankGap = chart.height / Math.max(1, props.series.length - 1);
    const currentPositions = props.series.map((_, index) => {
        const start = Math.floor(timeline);
        const next = Math.min(props.periods.length - 1, start + 1);
        return { x: currentX, y: chart.top + interpolate(timeline - start, [0, 1], [rankAt(props.series, start, index), rankAt(props.series, next, index)]) * rankGap };
    });
    const chartFont = props.fontFamily ?? fontFamily;
    return React.createElement(AbsoluteFill, { style: { backgroundColor: '#f4f7fb', color: '#14202b', fontFamily: chartFont, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26, 77, 121, .055) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 77, 121, .055) 1px, transparent 1px)', backgroundSize: '42px 42px' } }),
        React.createElement("div", { style: { position: 'absolute', left: 74, top: 72, width: 430, opacity: intro, transform: `translateY(${(1 - intro) * 20}px)` } },
            React.createElement("div", { style: { display: 'inline-flex', padding: '9px 13px', borderRadius: 6, backgroundColor: '#e4eeff', color: '#2869df', fontSize: 18, fontWeight: 700 } }, "RANKING OVER TIME"),
            React.createElement("h1", { style: { margin: '28px 0 18px', fontSize: 62, lineHeight: 1.12, letterSpacing: 0 } }, props.title),
            React.createElement("p", { style: { margin: 0, color: '#607080', fontSize: 24, lineHeight: 1.55 } }, props.subtitle),
            React.createElement("div", { style: { marginTop: 68, padding: '24px 25px', borderLeft: '5px solid #2869df', backgroundColor: '#fff', boxShadow: '0 18px 45px rgba(35, 62, 88, .12)', fontSize: 23, lineHeight: 1.5 } }, props.takeaway)),
        React.createElement("div", { style: { position: 'absolute', left: chart.left - 44, top: chart.top - 62, width: chart.width + 88, height: chart.height + 122, border: '1px solid #d8e0ea', borderRadius: 8, backgroundColor: 'rgba(255,255,255,.9)', boxShadow: '0 24px 60px rgba(35, 62, 88, .11)' } }),
        React.createElement("svg", { width: "1920", height: "1080", style: { position: 'absolute', inset: 0 } },
            props.series.map((item, seriesIndex) => {
                const points = props.periods.map((_, periodIndex) => ({
                    x: chart.left + (periodIndex / Math.max(1, props.periods.length - 1)) * chart.width,
                    y: chart.top + rankAt(props.series, periodIndex, seriesIndex) * rankGap,
                }));
                const path = smoothPath(points);
                const visible = interpolate(timeline, [0, props.periods.length - 1], [0.02, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const currentRank = rankAt(props.series, currentPeriod, seriesIndex);
                const currentY = currentPositions[seriesIndex].y;
                const focused = props.highlightSeries ? item.name === props.highlightSeries : seriesIndex === 0;
                const labelOnLeft = currentX > chart.left + chart.width - 210;
                return React.createElement("g", { key: item.name },
                    React.createElement("path", { d: path, fill: "none", stroke: item.color, strokeWidth: focused ? 9 : 6, opacity: focused ? .96 : .68, pathLength: 1, strokeDasharray: `${visible} 1`, strokeLinecap: "round" }),
                    points.map((point, index) => React.createElement("circle", { key: index, cx: point.x, cy: point.y, r: index <= timeline ? 8 : 5, fill: "#fff", stroke: item.color, strokeWidth: 4, opacity: index <= timeline + .15 ? 1 : .22 })),
                    React.createElement("circle", { cx: currentX, cy: currentY, r: 14, fill: item.color, stroke: "#fff", strokeWidth: 5 }),
                    React.createElement("text", { x: currentX + (labelOnLeft ? -1 : 1) * (item.iconSrc ? 44 : 28), y: currentY + 8, textAnchor: labelOnLeft ? 'end' : 'start', fontFamily: chartFont, fontSize: "22", fontWeight: "700", fill: item.color, stroke: "#fff", strokeWidth: "11", strokeLinejoin: "round", paintOrder: "stroke" },
                        item.name,
                        " \u00B7 #",
                        currentRank + 1));
            }),
            props.periods.map((period, index) => {
                const x = chart.left + (index / Math.max(1, props.periods.length - 1)) * chart.width;
                return React.createElement("g", { key: period },
                    React.createElement("line", { x1: x, y1: chart.top - 18, x2: x, y2: chart.top + chart.height + 18, stroke: "#cad4df", strokeWidth: index === currentPeriod ? 3 : 1, strokeDasharray: index === currentPeriod ? undefined : '4 8' }),
                    React.createElement("text", { x: x, y: chart.top + chart.height + 58, textAnchor: "middle", fontFamily: chartFont, fontSize: "20", fontWeight: index === currentPeriod ? 700 : 500, fill: index === currentPeriod ? '#14202b' : '#788594' }, period));
            })),
        props.series.map((item, index) => item.iconSrc ? React.createElement(EntityIcon, { key: item.name, src: item.iconSrc, size: 58, style: { position: 'absolute', left: currentPositions[index].x - 29, top: currentPositions[index].y - 29, borderRadius: '50%', backgroundColor: '#fff', border: `3px solid ${item.color}`, padding: 5, opacity: intro } }) : null),
        React.createElement("div", { style: { position: 'absolute', left: 74, right: 74, bottom: 42, display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #cfd8e2', color: '#6d7a87', fontSize: 15 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null, "\u6570\u503C\u3001\u6392\u540D\u4E0E\u8DEF\u5F84\u7531\u540C\u4E00\u65F6\u5E8F\u6570\u636E\u9A71\u52A8")));
};
