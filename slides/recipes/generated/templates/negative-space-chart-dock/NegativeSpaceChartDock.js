// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { dockMotionAtFrame, resolveDockRegion } from './layout.mjs';
const fontFamily = 'Inter, "Noto Sans SC", "PingFang SC", sans-serif';
const TurbineSubject = ({ box, accent, reveal }) => React.createElement("div", { style: { position: 'absolute', left: box.x, top: box.y, width: box.width, height: box.height, opacity: reveal, transform: `translateX(${(1 - reveal) * 42}px)`, transformOrigin: 'bottom center' } },
    React.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 500 560", "aria-label": "\u7A0B\u5E8F\u5316\u6D77\u4E0A\u98CE\u673A\u4E3B\u4F53" },
        React.createElement("defs", null,
            React.createElement("linearGradient", { id: "tower", x1: "0", x2: "1" },
                React.createElement("stop", { stopColor: "#d8e6e4" }),
                React.createElement("stop", { offset: ".5", stopColor: "#fff" }),
                React.createElement("stop", { offset: "1", stopColor: "#9fb9b5" }))),
        React.createElement("ellipse", { cx: "278", cy: "515", rx: "176", ry: "24", fill: "#143a42", opacity: ".22" }),
        React.createElement("path", { d: "M253 191h42l26 326h-94z", fill: "url(#tower)" }),
        React.createElement("rect", { x: "243", y: "168", width: "64", height: "34", rx: "14", fill: accent }),
        React.createElement("circle", { cx: "275", cy: "183", r: "21", fill: "#f7fbfa", stroke: accent, strokeWidth: "8" }),
        React.createElement("g", { transform: "translate(275 183)" },
            React.createElement("path", { d: "M4-8C31-88 92-150 115-137 132-127 90-64 13 5Z", fill: "#eef5f4", stroke: "#b6cac7", strokeWidth: "4" }),
            React.createElement("path", { d: "M7 9c82 15 155 62 148 88-6 20-81-4-153-75Z", fill: "#eef5f4", stroke: "#b6cac7", strokeWidth: "4" }),
            React.createElement("path", { d: "M-11 3c-56 63-91 144-68 158 18 11 64-55 80-148Z", fill: "#eef5f4", stroke: "#b6cac7", strokeWidth: "4" })),
        React.createElement("path", { d: "M40 500c90-44 151-33 227 0 76-39 139-38 208 2", fill: "none", stroke: "#70aeb4", strokeWidth: "12", strokeLinecap: "round", opacity: ".65" }),
        React.createElement("g", { fill: accent },
            React.createElement("circle", { cx: "80", cy: "93", r: "5" }),
            React.createElement("circle", { cx: "113", cy: "62", r: "3" }),
            React.createElement("circle", { cx: "415", cy: "119", r: "4" }))));
export const NegativeSpaceChartDock = props => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const motion = dockMotionAtFrame({ frame, fps });
    const dock = resolveDockRegion({ focalBox: props.focalBox, safeRegion: props.safeRegion });
    const max = Math.max(1, ...props.series.map(item => item.value));
    const panelTop = Math.max(dock.y, 242);
    const panelHeight = Math.min(dock.height - Math.max(0, panelTop - dock.y), 686);
    return React.createElement(AbsoluteFill, { style: { width: 1920, height: 1080, background: '#dfeaed', color: '#10272b', fontFamily, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg,#eaf3f2 0%,#c8dde0 60%,#9dc4ca 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: -80, right: -80, bottom: 0, height: 330, opacity: motion.scene, transform: `translateX(${(1 - motion.scene) * -30}px)` } },
            React.createElement("svg", { width: "2080", height: "330", viewBox: "0 0 2080 330", preserveAspectRatio: "none" },
                React.createElement("path", { d: "M0 158C250 101 413 214 650 157s422-35 607 14 439-26 823-65v224H0Z", fill: "#5b9da5" }),
                React.createElement("path", { d: "M0 212c310-68 535 68 822 5 304-66 541 45 753-18 155-46 302-45 505-15v146H0Z", fill: "#287783", opacity: ".78" }))),
        React.createElement("header", { style: { position: 'absolute', left: 72, right: 72, top: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'start', opacity: motion.scene } },
            React.createElement("div", { style: { maxWidth: 1060 } },
                React.createElement("div", { style: { fontSize: 16, fontWeight: 800, letterSpacing: 3, color: props.accentColor } }, "NEGATIVE-SPACE DATA DOCK"),
                React.createElement("h1", { style: { fontSize: 52, lineHeight: 1.08, margin: '12px 0 8px' } }, props.title),
                React.createElement("p", { style: { fontSize: 21, color: '#4d676b', margin: 0 } }, props.subtitle)),
            React.createElement("div", { style: { padding: '12px 18px', borderRadius: 25, background: 'rgba(255,255,255,.64)', fontSize: 16, fontWeight: 700 } }, "\u4E3B\u4F53\u4FDD\u62A4\u533A\u5DF2\u542F\u7528")),
        React.createElement(TurbineSubject, { box: props.focalBox, accent: props.accentColor, reveal: motion.scene }),
        React.createElement("div", { style: { position: 'absolute', left: props.focalBox.x + props.focalBox.width - 156, top: props.focalBox.y + props.focalBox.height - 44, padding: '11px 16px', borderRadius: 24, background: 'rgba(13,45,51,.85)', color: '#fff', fontSize: 15, fontWeight: 700, opacity: motion.scene } }, props.subjectLabel),
        React.createElement("section", { style: { position: 'absolute', left: dock.x, top: panelTop, width: dock.width, height: panelHeight, borderRadius: 30, padding: '32px 38px', boxSizing: 'border-box', background: 'rgba(250,252,250,.94)', boxShadow: '0 28px 90px rgba(17,55,61,.18)', opacity: motion.panel, transform: `translateY(${(1 - motion.panel) * 26}px)` } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } },
                React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: props.accentColor, letterSpacing: 1.5 } }, props.metricLabel),
                    React.createElement("div", { style: { fontSize: 62, lineHeight: 1, marginTop: 12, fontWeight: 850, fontVariantNumeric: 'tabular-nums' } },
                        props.metricValue,
                        React.createElement("span", { style: { fontSize: 24, marginLeft: 8, color: '#55696c' } }, props.unit))),
                React.createElement("div", { style: { width: 12, height: 62, borderRadius: 8, background: props.accentColor } })),
            React.createElement("div", { style: { marginTop: 30, display: 'grid', gap: 17 } }, props.series.map((item, index) => React.createElement("div", { key: `${item.label}-${index}`, style: { display: 'grid', gridTemplateColumns: '82px 1fr 72px', gap: 14, alignItems: 'center', fontSize: 17 } },
                React.createElement("span", { style: { color: '#52676a' } }, item.label),
                React.createElement("div", { style: { height: 16, borderRadius: 10, background: '#dbe5e4', overflow: 'hidden' } },
                    React.createElement("div", { style: { height: '100%', width: `${motion.bars * item.value / max * 100}%`, background: index === props.series.length - 1 ? props.accentColor : '#88aeb0', borderRadius: 10 } })),
                React.createElement("strong", { style: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, item.value)))),
            React.createElement("div", { style: { position: 'absolute', left: 38, right: 38, bottom: 30, padding: '19px 22px', borderLeft: `5px solid ${props.accentColor}`, background: '#e5efed', fontSize: 19, lineHeight: 1.42, fontWeight: 650, opacity: motion.callout } }, props.callout)),
        React.createElement("div", { style: { position: 'absolute', left: 72, bottom: 26, fontSize: 14, color: '#e9f5f4' } },
            "\u6765\u6E90\uFF1A",
            props.source));
};
