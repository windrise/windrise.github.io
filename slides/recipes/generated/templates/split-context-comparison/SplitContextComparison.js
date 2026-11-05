// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { comparisonMotionAtFrame } from './motion.mjs';
const fontFamily = 'Inter, "Noto Sans SC", "PingFang SC", sans-serif';
const ElectricScene = ({ accent }) => React.createElement("svg", { width: "690", height: "300", viewBox: "0 0 690 300", "aria-label": "\u7A0B\u5E8F\u5316\u7535\u52A8\u6C7D\u8F66\u5145\u7535\u573A\u666F" },
    React.createElement("defs", null,
        React.createElement("linearGradient", { id: "electric-sky", x1: "0", y1: "0", x2: "0", y2: "1" },
            React.createElement("stop", { stopColor: "#d9f1ed" }),
            React.createElement("stop", { offset: "1", stopColor: "#f6f5e9" }))),
    React.createElement("rect", { width: "690", height: "300", rx: "24", fill: "url(#electric-sky)" }),
    React.createElement("circle", { cx: "570", cy: "58", r: "30", fill: "#f6cb68", opacity: ".85" }),
    React.createElement("path", { d: "M0 192 L94 134 164 171 258 96 340 158 428 110 548 176 690 118V232H0Z", fill: "#94bcb3", opacity: ".42" }),
    React.createElement("path", { d: "M0 226H690V300H0Z", fill: "#596763" }),
    React.createElement("path", { d: "M20 262H670", stroke: "#f3e9b9", strokeWidth: "5", strokeDasharray: "35 25" }),
    React.createElement("path", { d: "M151 212h266l54 44H105z", fill: "#183d3a" }),
    React.createElement("path", { d: "M199 157h151l68 56H150z", fill: accent }),
    React.createElement("path", { d: "M218 171h113l40 36H177z", fill: "#bce6e2" }),
    React.createElement("circle", { cx: "178", cy: "250", r: "31", fill: "#17211f" }),
    React.createElement("circle", { cx: "399", cy: "250", r: "31", fill: "#17211f" }),
    React.createElement("circle", { cx: "178", cy: "250", r: "13", fill: "#cbd4cf" }),
    React.createElement("circle", { cx: "399", cy: "250", r: "13", fill: "#cbd4cf" }),
    React.createElement("rect", { x: "509", y: "120", width: "58", height: "116", rx: "12", fill: "#f7faf8", stroke: accent, strokeWidth: "5" }),
    React.createElement("rect", { x: "522", y: "139", width: "32", height: "28", rx: "4", fill: "#1c403c" }),
    React.createElement("path", { d: "M538 177v20m-10-10h20", stroke: accent, strokeWidth: "5" }),
    React.createElement("path", { d: "M508 154c-51 5-15 85-62 83", fill: "none", stroke: "#1d3532", strokeWidth: "8", strokeLinecap: "round" }));
const FuelScene = ({ accent }) => React.createElement("svg", { width: "690", height: "300", viewBox: "0 0 690 300", "aria-label": "\u7A0B\u5E8F\u5316\u71C3\u6CB9\u6C7D\u8F66\u52A0\u6CB9\u573A\u666F" },
    React.createElement("defs", null,
        React.createElement("linearGradient", { id: "fuel-sky", x1: "0", y1: "0", x2: "0", y2: "1" },
            React.createElement("stop", { stopColor: "#f3dfcf" }),
            React.createElement("stop", { offset: "1", stopColor: "#f6eee5" }))),
    React.createElement("rect", { width: "690", height: "300", rx: "24", fill: "url(#fuel-sky)" }),
    React.createElement("rect", { x: "34", y: "84", width: "75", height: "150", fill: "#b9a797" }),
    React.createElement("rect", { x: "120", y: "45", width: "96", height: "189", fill: "#c8b6a4" }),
    React.createElement("rect", { x: "226", y: "112", width: "70", height: "122", fill: "#ad9c8d" }),
    React.createElement("path", { d: "M0 226H690V300H0Z", fill: "#625d59" }),
    React.createElement("path", { d: "M20 262H670", stroke: "#efe0af", strokeWidth: "5", strokeDasharray: "35 25" }),
    React.createElement("path", { d: "M269 212h266l54 44H223z", fill: "#392e2a" }),
    React.createElement("path", { d: "M317 157h151l68 56H268z", fill: accent }),
    React.createElement("path", { d: "M336 171h113l40 36H295z", fill: "#dfd5cb" }),
    React.createElement("circle", { cx: "296", cy: "250", r: "31", fill: "#1e1a18" }),
    React.createElement("circle", { cx: "517", cy: "250", r: "31", fill: "#1e1a18" }),
    React.createElement("circle", { cx: "296", cy: "250", r: "13", fill: "#cbc5bf" }),
    React.createElement("circle", { cx: "517", cy: "250", r: "13", fill: "#cbc5bf" }),
    React.createElement("rect", { x: "114", y: "116", width: "62", height: "120", rx: "8", fill: "#f7f2ec", stroke: accent, strokeWidth: "5" }),
    React.createElement("rect", { x: "126", y: "134", width: "38", height: "29", rx: "3", fill: "#443632" }),
    React.createElement("path", { d: "M176 145c54 5 15 85 75 92", fill: "none", stroke: "#332a27", strokeWidth: "8", strokeLinecap: "round" }),
    React.createElement("path", { d: "M71 67c-12-24 20-31 4-51M96 66c-9-18 15-24 3-39", fill: "none", stroke: "#8d8076", strokeWidth: "8", strokeLinecap: "round", opacity: ".55" }));
const ContextPanel = ({ context, side, progress }) => {
    const offset = (1 - progress.split) * (side === 'left' ? -90 : 90);
    const Scene = context.scene === 'electric' ? ElectricScene : FuelScene;
    return React.createElement("section", { style: { position: 'relative', width: 812, height: 670, borderRadius: 32, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 70px rgba(31,40,38,.1)', opacity: progress.split, transform: `translateX(${offset}px)` } },
        React.createElement("div", { style: { padding: '30px 38px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 16, fontWeight: 800, letterSpacing: 2, color: context.accent } }, context.label),
                React.createElement("h2", { style: { fontSize: 32, margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 10 } },
                    React.createElement(EntityIcon, { src: context.iconSrc, size: 36 }),
                    context.name)),
            React.createElement("span", { style: { padding: '9px 14px', borderRadius: 30, background: `${context.accent}18`, color: context.accent, fontSize: 16, fontWeight: 700 } }, "\u771F\u5B9E\u60C5\u5883\u5BF9\u6BD4")),
        React.createElement("div", { style: { margin: '24px 38px 0', opacity: progress.subjects, transform: `scale(${.96 + progress.subjects * .04})`, transformOrigin: 'center bottom' } },
            React.createElement(Scene, { accent: context.accent })),
        React.createElement("div", { style: { position: 'absolute', left: 38, right: 38, bottom: 32, display: 'flex', alignItems: 'end', justifyContent: 'space-between', opacity: progress.metrics, transform: `translateY(${(1 - progress.metrics) * 24}px)` } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 74, lineHeight: 1, fontWeight: 850, color: context.accent, fontVariantNumeric: 'tabular-nums' } },
                    context.value,
                    React.createElement("span", { style: { fontSize: 27, marginLeft: 8 } }, context.unit)),
                React.createElement("div", { style: { fontSize: 19, color: '#68726f', marginTop: 12 } }, context.detail)),
            React.createElement("div", { style: { width: 188, height: 12, borderRadius: 8, background: '#eceeeb', overflow: 'hidden' } },
                React.createElement("div", { style: { width: `${progress.metrics * 100}%`, height: '100%', background: context.accent } }))));
};
export const SplitContextComparison = props => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const motion = comparisonMotionAtFrame({ frame, fps });
    return React.createElement(AbsoluteFill, { style: { width: 1920, height: 1080, background: '#f2f1eb', color: '#17201e', fontFamily, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 12% 18%,rgba(62,169,146,.11),transparent 28%),radial-gradient(circle at 90% 22%,rgba(207,112,75,.11),transparent 29%)' } }),
        React.createElement("header", { style: { position: 'absolute', left: 80, right: 80, top: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'end', opacity: motion.title, transform: `translateY(${(1 - motion.title) * -18}px)` } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 17, fontWeight: 800, letterSpacing: 3, color: '#69736f' } }, "CONTEXTUAL DATA COMPARISON"),
                React.createElement("h1", { style: { fontSize: 52, lineHeight: 1.08, margin: '12px 0 8px', letterSpacing: -1 } }, props.title),
                React.createElement("p", { style: { fontSize: 21, color: '#6c7471', margin: 0 } }, props.subtitle)),
            React.createElement("div", { style: { fontSize: 15, color: '#737b78' } }, "\u540C\u4E00\u6307\u6807 \u00B7 \u4E24\u4E2A\u771F\u5B9E\u4F7F\u7528\u60C5\u5883")),
        React.createElement("main", { style: { position: 'absolute', left: 80, right: 80, top: 205, display: 'flex', gap: 136 } },
            React.createElement(ContextPanel, { context: props.left, side: "left", progress: motion }),
            React.createElement(ContextPanel, { context: props.right, side: "right", progress: motion })),
        React.createElement("div", { style: { position: 'absolute', left: 874, top: 386, width: 172, height: 172, borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', background: '#182421', color: '#fff', boxShadow: '0 20px 54px rgba(24,36,33,.24)', opacity: motion.difference, transform: `scale(${.72 + motion.difference * .28})` } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 15, color: '#b5c5c0', marginBottom: 8 } }, props.differenceLabel),
                React.createElement("strong", { style: { fontSize: 39, lineHeight: 1.05 } }, props.differenceValue))),
        React.createElement("div", { style: { position: 'absolute', left: 350, right: 350, bottom: 58, height: 88, borderRadius: 18, background: '#182421', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 38px', fontSize: 22, fontWeight: 650, letterSpacing: .2, opacity: motion.takeaway, transform: `translateY(${(1 - motion.takeaway) * 18}px)` } }, props.takeaway),
        React.createElement("div", { style: { position: 'absolute', left: 80, bottom: 26, fontSize: 14, color: '#747c79' } },
            "\u6765\u6E90\uFF1A",
            props.source));
};
