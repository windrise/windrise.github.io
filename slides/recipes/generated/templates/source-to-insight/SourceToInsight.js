// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
export const SourceToInsight = props => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const intro = spring({ frame, fps, durationInFrames: Math.round(.7 * fps), config: { damping: 180 } });
    const tableIn = spring({ frame: frame - Math.round(.5 * fps), fps, durationInFrames: Math.round(.7 * fps), config: { damping: 170 } });
    const pipeline = interpolate(frame, [fps * 1.5, fps * 3.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const chartIn = spring({ frame: frame - Math.round(2.6 * fps), fps, durationInFrames: Math.round(.8 * fps), config: { damping: 160 } });
    const insightIn = spring({ frame: frame - Math.round(4.8 * fps), fps, durationInFrames: Math.round(.8 * fps), config: { damping: 160 } });
    const max = Math.max(...props.rows.map(row => row.value));
    return React.createElement(AbsoluteFill, { style: { backgroundColor: '#f7f5f0', color: '#15191e', fontFamily, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', left: 82, top: 64, right: 82, opacity: intro } },
            React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: '#cf7416' } }, "SOURCE \u2192 TRANSFORM \u2192 INSIGHT"),
            React.createElement("h1", { style: { margin: '16px 0 8px', fontSize: 56, lineHeight: 1.1, letterSpacing: 0 } }, props.title),
            React.createElement("p", { style: { margin: 0, fontSize: 23, color: '#68717a' } }, props.question)),
        React.createElement("section", { style: { position: 'absolute', left: 82, top: 255, width: 520, height: 580, padding: '28px', border: '1px solid #d8d3c9', borderRadius: 8, backgroundColor: '#fff', opacity: tableIn, transform: `translateY(${(1 - tableIn) * 24}px)` } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
                React.createElement("strong", { style: { fontSize: 22 } }, "01 \u539F\u59CB\u6570\u636E"),
                React.createElement("span", { style: { fontSize: 15, color: '#878176' } }, "CSV")),
            React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 135px', padding: '12px 14px', backgroundColor: '#f1eee8', color: '#777167', fontSize: 16 } },
                React.createElement("span", null, "\u5730\u533A"),
                React.createElement("span", { style: { textAlign: 'right' } }, "\u6D3B\u8DC3\u7528\u6237")),
            props.rows.map((row, index) => {
                const rowIn = spring({ frame: frame - Math.round((.8 + index * .12) * fps), fps, durationInFrames: Math.round(.45 * fps), config: { damping: 170 } });
                return React.createElement("div", { key: row.label, style: { display: 'grid', gridTemplateColumns: '1fr 135px', padding: '20px 14px', borderBottom: '1px solid #ece8e0', fontSize: 20, opacity: rowIn } },
                    React.createElement("span", { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                        React.createElement(EntityIcon, { src: row.iconSrc, size: 30 }),
                        row.label),
                    React.createElement("strong", { style: { textAlign: 'right' } },
                        row.value,
                        props.unit));
            })),
        React.createElement("section", { style: { position: 'absolute', left: 650, top: 337, width: 260, textAlign: 'center' } },
            React.createElement("div", { style: { fontSize: 16, color: '#8a8174' } }, "02 \u7ED3\u6784\u8F6C\u6362"),
            React.createElement("svg", { width: "260", height: "270", viewBox: "0 0 260 270" },
                React.createElement("path", { d: "M 22 135 C 85 20, 175 20, 238 135 C 175 250, 85 250, 22 135", fill: "none", stroke: "#d3b48a", strokeWidth: "7", pathLength: 1, strokeDasharray: `${pipeline} 1` }),
                React.createElement("circle", { cx: "130", cy: "135", r: "54", fill: "#15191e", opacity: pipeline }),
                React.createElement("text", { x: "130", y: "128", textAnchor: "middle", fill: "#fff", fontFamily: fontFamily, fontSize: "18", fontWeight: "700" }, "SORT"),
                React.createElement("text", { x: "130", y: "154", textAnchor: "middle", fill: "#cfb99d", fontFamily: fontFamily, fontSize: "15" }, "NORMALIZE")),
            React.createElement("div", { style: { fontSize: 17, color: '#766f65', opacity: pipeline } }, "\u6E05\u6D17 \u00B7 \u6392\u5E8F \u00B7 \u6620\u5C04")),
        React.createElement("section", { style: { position: 'absolute', left: 955, top: 255, right: 82, height: 580, padding: '28px 34px', borderRadius: 8, backgroundColor: '#15191e', color: '#fff', opacity: chartIn, transform: `translateX(${(1 - chartIn) * 34}px)` } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement("strong", { style: { fontSize: 22 } }, "03 \u53EF\u89C6\u5316\u7ED3\u8BBA"),
                React.createElement("span", { style: { fontSize: 15, color: '#a7adb3' } }, "RANKED BAR")),
            React.createElement("div", { style: { marginTop: 38, display: 'grid', gap: 18 } }, [...props.rows].sort((a, b) => b.value - a.value).map((row, index) => { const bar = interpolate(frame, [fps * (3 + index * .12), fps * (4 + index * .12)], [0, row.value / max], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }); return React.createElement("div", { key: row.label },
                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 18, marginBottom: 9 } },
                    React.createElement("span", { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                        React.createElement(EntityIcon, { src: row.iconSrc, size: 30 }),
                        row.label),
                    React.createElement("strong", null,
                        row.value,
                        props.unit)),
                React.createElement("div", { style: { height: 18, backgroundColor: '#2d3339', borderRadius: 3, overflow: 'hidden' } },
                    React.createElement("div", { style: { width: `${bar * 100}%`, height: '100%', backgroundColor: index === 0 ? '#f4a340' : '#6d7d8d' } }))); })),
            React.createElement("div", { style: { position: 'absolute', left: 34, right: 34, bottom: 30, padding: '20px 22px', borderLeft: '5px solid #f4a340', backgroundColor: '#242a30', fontSize: 22, lineHeight: 1.45, opacity: insightIn } }, props.takeaway)),
        React.createElement("div", { style: { position: 'absolute', left: 82, right: 82, bottom: 38, paddingTop: 16, borderTop: '1px solid #d3cec4', display: 'flex', justifyContent: 'space-between', color: '#777168', fontSize: 15 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null, "\u6570\u636E\u8868\u3001\u6392\u5E8F\u7ED3\u679C\u4E0E\u7ED3\u8BBA\u4FDD\u6301\u53EF\u8FFD\u6EAF")));
};
