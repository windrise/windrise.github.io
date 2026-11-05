// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const clamp = (value) => Math.min(100, Math.max(0, value));
export const SpatialPercentOverlay = props => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const intro = spring({ frame, fps, durationInFrames: Math.round(0.8 * fps), config: { damping: 180 } });
    const metricProgress = interpolate(frame, [0.7 * fps, 2.6 * fps], [0, clamp(props.value) / 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const displayValue = metricProgress * 100;
    const waveY = 410 - metricProgress * 380;
    const waveOffset = Math.sin((frame / fps) * Math.PI * 2 * 0.55) * 14;
    const backgroundScale = interpolate(frame, [0, durationInFrames], [1.045, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad),
    });
    const calloutCenterX = 1450;
    const calloutCenterY = 570;
    return (React.createElement(AbsoluteFill, { style: { backgroundColor: '#0d1621', color: '#fff', fontFamily, overflow: 'hidden' } },
        React.createElement(Img, { src: staticFile(props.backgroundSrc), style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${backgroundScale})`, filter: 'brightness(.58) saturate(.82) contrast(1.06)' } }),
        React.createElement("div", { style: { position: 'absolute', inset: 0, backgroundColor: 'rgba(7, 16, 28, .25)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 780, backgroundColor: 'rgba(5, 13, 24, .72)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 84, top: 70, display: 'flex', alignItems: 'center', gap: 16, opacity: intro } },
            React.createElement("span", { style: { width: 6, height: 42, backgroundColor: props.accentColor } }),
            React.createElement("strong", { style: { fontSize: 22 } }, "DATAMAGIC CARDS"),
            React.createElement("span", { style: { color: 'rgba(255,255,255,.65)', fontSize: 20 } }, props.context)),
        React.createElement("div", { style: { position: 'absolute', left: 84, top: 252, width: 620, opacity: intro, transform: `translateY(${(1 - intro) * 26}px)` } },
            React.createElement("p", { style: { margin: 0, color: props.accentColor, fontSize: 19, fontWeight: 700 } }, "CONTEXTUAL DATA OVERLAY"),
            React.createElement("h1", { style: { margin: '22px 0 18px', fontSize: 68, lineHeight: 1.12, fontWeight: 700, letterSpacing: 0 } }, props.title),
            React.createElement("p", { style: { margin: 0, maxWidth: 570, color: 'rgba(255,255,255,.76)', fontSize: 25, lineHeight: 1.58 } }, props.takeaway)),
        React.createElement("div", { style: { position: 'absolute', left: 84, bottom: 128, width: 620, padding: '22px 25px', borderLeft: `5px solid ${props.accentColor}`, backgroundColor: 'rgba(8, 18, 30, .72)', opacity: intro } },
            React.createElement("div", { style: { color: 'rgba(255,255,255,.57)', fontSize: 16 } }, "\u955C\u5934\u89C4\u5219"),
            React.createElement("div", { style: { marginTop: 9, fontSize: 20, lineHeight: 1.5 } }, "\u5B9E\u666F\u8D1F\u8D23\u8BED\u5883\uFF1B\u6570\u503C\u3001\u6807\u7B7E\u3001\u6DB2\u4F4D\u4E0E\u6765\u6E90\u5168\u90E8\u7531\u7ED3\u6784\u5316\u6570\u636E\u6E32\u67D3\u3002")),
        React.createElement("div", { style: { position: 'absolute', left: calloutCenterX - 220, top: calloutCenterY - 220, width: 440, height: 440, opacity: intro, transform: `scale(${0.9 + intro * 0.1})` } },
            [0, 1, 2].map(index => (React.createElement("div", { key: index, style: { position: 'absolute', inset: index * -34, border: `2px solid rgba(115, 220, 255, ${0.24 - index * 0.05})`, borderRadius: '50%' } }))),
            React.createElement("svg", { width: "440", height: "440", viewBox: "0 0 440 440", style: { position: 'absolute', inset: 0 } },
                React.createElement("defs", null,
                    React.createElement("clipPath", { id: "spatial-percent-circle" },
                        React.createElement("circle", { cx: "220", cy: "220", r: "190" })),
                    React.createElement("linearGradient", { id: "spatial-percent-liquid", x1: "0", y1: "0", x2: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: props.accentColor, stopOpacity: "0.7" }),
                        React.createElement("stop", { offset: "100%", stopColor: "#0b4057", stopOpacity: "0.96" }))),
                React.createElement("circle", { cx: "220", cy: "220", r: "190", fill: "rgba(7, 19, 32, .82)", stroke: "rgba(182,232,248,.62)", strokeWidth: "4" }),
                React.createElement("g", { clipPath: "url(#spatial-percent-circle)" },
                    React.createElement("path", { d: `M -20 ${waveY} Q 65 ${waveY - waveOffset} 140 ${waveY} T 300 ${waveY} T 460 ${waveY} L 460 430 L -20 430 Z`, fill: "url(#spatial-percent-liquid)" }),
                    React.createElement("path", { d: `M -20 ${waveY} Q 65 ${waveY - waveOffset} 140 ${waveY} T 300 ${waveY} T 460 ${waveY}`, fill: "none", stroke: props.accentColor, strokeWidth: "9" }))),
            React.createElement("div", { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', textShadow: '0 3px 16px rgba(0,0,0,.52)' } },
                React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.82)' } }, props.metricLabel),
                React.createElement("div", { style: { marginTop: 12, fontSize: 92, lineHeight: 1, fontWeight: 700, letterSpacing: 0, color: '#fff' } },
                    displayValue.toFixed(1),
                    React.createElement("span", { style: { marginLeft: 3, fontSize: 42, color: 'rgba(255,255,255,.86)' } }, props.unit)),
                React.createElement("div", { style: { width: 52, height: 3, margin: '20px 0 14px', borderRadius: 2, backgroundColor: props.accentColor } }),
                React.createElement("div", { style: { fontSize: 21, fontWeight: 600, color: 'rgba(255,255,255,.82)', display: 'flex', alignItems: 'center', gap: 12 } },
                    React.createElement(EntityIcon, { src: props.entityIconSrc, size: 40 }),
                    props.entityLabel))),
        React.createElement("div", { style: { position: 'absolute', left: 84, right: 84, bottom: 52, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.28)', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,.67)', fontSize: 15 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null, "\u6F14\u793A\u80CC\u666F\u7531\u751F\u6210\u6A21\u578B\u521B\u5EFA\uFF1B\u6570\u636E\u5C42\u72EC\u7ACB\u4E14\u53EF\u7F16\u8F91"))));
};
