// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
const font = 'Inter, "Noto Sans SC", sans-serif';
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const trackingPosition = (keyframes, frame) => {
    const points = [...keyframes].sort((left, right) => left.frame - right.frame);
    if (!points.length)
        return { x: 0.72, y: 0.42 };
    if (frame <= points[0].frame)
        return points[0];
    if (frame >= points.at(-1).frame)
        return points.at(-1);
    const rightIndex = points.findIndex(point => point.frame >= frame);
    const left = points[rightIndex - 1];
    const right = points[rightIndex];
    const progress = (frame - left.frame) / Math.max(1, right.frame - left.frame);
    return { x: left.x + (right.x - left.x) * progress, y: left.y + (right.y - left.y) * progress };
};
const VideoDataOverlay = props => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const freezeAt = durationInFrames - Math.round(1.2 * fps);
    const motionFrame = Math.min(frame, freezeAt);
    const intro = interpolate(motionFrame, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const evidence = interpolate(motionFrame, [42, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
    const settle = interpolate(motionFrame, [156, 194], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const anchor = trackingPosition(props.tracking.keyframes, motionFrame);
    const anchorX = anchor.x * 1920;
    const anchorY = anchor.y * 1080;
    const isTracked = props.layout === 'tracked_callout';
    const max = Math.max(1, ...props.metrics.map(metric => Math.abs(metric.value)));
    return React.createElement(AbsoluteFill, { style: { background: '#071014', color: '#f7f8f7', fontFamily: font, overflow: 'hidden' } },
        React.createElement(Freeze, { frame: motionFrame },
            React.createElement(OffthreadVideo, { src: staticFile(props.videoSrc), muted: true, style: { width: '100%', height: '100%', objectFit: 'cover' } })),
        React.createElement(AbsoluteFill, { style: { background: isTracked
                    ? 'linear-gradient(90deg,rgba(4,10,13,.88) 0%,rgba(4,10,13,.54) 31%,rgba(4,10,13,.08) 58%,rgba(4,10,13,.18) 100%)'
                    : 'linear-gradient(90deg,rgba(4,10,13,.96) 0%,rgba(4,10,13,.78) 29%,rgba(4,10,13,.16) 60%,rgba(4,10,13,.08) 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,.08)' } }),
        React.createElement("header", { style: { position: 'absolute', left: 72, right: 72, top: 48, opacity: intro } },
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
                React.createElement("span", { style: { fontSize: 15, fontWeight: 850, letterSpacing: 3, color: props.tracking.color } }, "VIDEO \u00D7 DATA"),
                React.createElement("span", { style: { fontSize: 14, color: '#bac4c7' } }, "\u771F\u5B9E\u89C6\u9891\u8F93\u5165 \u00B7 \u65F6\u95F4\u540C\u6B65 \u00B7 \u4E3B\u4F53\u907F\u8BA9")),
            React.createElement("div", { style: { height: 1, marginTop: 20, background: 'rgba(255,255,255,.22)' } })),
        React.createElement("section", { style: { position: 'absolute', left: 78, top: 150, width: isTracked ? 600 : 650, opacity: intro, transform: `translateY(${(1 - intro) * 18}px)` } },
            React.createElement("h1", { style: { margin: 0, fontSize: isTracked ? 52 : 59, lineHeight: 1.16, letterSpacing: -1 } }, props.title),
            React.createElement("p", { style: { maxWidth: 590, margin: '18px 0 0', fontSize: 22, lineHeight: 1.55, color: '#c2cccf' } }, props.subtitle)),
        isTracked ? React.createElement(React.Fragment, null,
            React.createElement("div", { style: { position: 'absolute', left: 80, top: 430, width: 540, padding: '22px 24px', border: '1px solid rgba(255,255,255,.24)', borderRadius: 13, background: 'rgba(4,15,18,.78)', backdropFilter: 'blur(8px)', opacity: evidence } },
                React.createElement("div", { style: { fontSize: 13, color: '#9cb0b6', letterSpacing: 2 } }, "LIVE SIGNAL"),
                React.createElement("div", { style: { marginTop: 13, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' } },
                    React.createElement("strong", { style: { fontSize: 26, display: 'flex', alignItems: 'center', gap: 12 } },
                        React.createElement(EntityIcon, { src: props.tracking.iconSrc, size: 38 }),
                        props.tracking.label),
                    React.createElement("b", { style: { fontSize: 47, color: props.tracking.color } },
                        props.tracking.value,
                        React.createElement("small", { style: { marginLeft: 8, fontSize: 18, color: '#c5ced0' } }, props.tracking.unit))),
                React.createElement("div", { style: { height: 6, marginTop: 18, borderRadius: 5, background: 'rgba(255,255,255,.12)' } },
                    React.createElement("div", { style: { height: '100%', width: `${evidence * 100}%`, borderRadius: 5, background: props.tracking.color } }))),
            React.createElement("svg", { width: "1920", height: "1080", style: { position: 'absolute', inset: 0, overflow: 'visible', opacity: evidence } },
                React.createElement("path", { d: `M 620 545 C 840 545, ${anchorX - 180} ${anchorY - 46}, ${anchorX} ${anchorY}`, fill: "none", stroke: props.tracking.color, strokeWidth: "3", strokeDasharray: "9 9" }),
                React.createElement("circle", { cx: anchorX, cy: anchorY, r: 18 + 7 * Math.sin(motionFrame / 7), fill: "none", stroke: props.tracking.color, strokeWidth: "3" }),
                React.createElement("circle", { cx: anchorX, cy: anchorY, r: "6", fill: props.tracking.color }))) : React.createElement("div", { style: { position: 'absolute', left: 78, top: 455, width: 630, display: 'grid', gap: 15 } }, props.metrics.slice(0, 4).map((metric, index) => React.createElement("div", { key: metric.id, style: { display: 'grid', gridTemplateColumns: '170px minmax(0,1fr) 118px', alignItems: 'center', gap: 15, opacity: interpolate(evidence, [index * .13, index * .13 + .42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateX(${(1 - evidence) * -14}px)` } },
            React.createElement("span", { style: { fontSize: 19, color: '#d3dadc', display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(EntityIcon, { src: metric.iconSrc, size: 32 }),
                metric.label),
            React.createElement("div", { style: { height: 13, borderRadius: 8, background: 'rgba(255,255,255,.13)' } },
                React.createElement("div", { style: { height: '100%', width: `${Math.abs(metric.value) / max * evidence * 100}%`, borderRadius: 8, background: metric.color } })),
            React.createElement("strong", { style: { fontSize: 28, textAlign: 'right' } },
                Math.round(metric.value * evidence * 10) / 10,
                React.createElement("small", { style: { marginLeft: 5, fontSize: 15, color: '#9daeb3' } }, metric.unit))))),
        React.createElement("div", { style: { position: 'absolute', left: 330, right: 330, bottom: 72, padding: '18px 25px', border: `1px solid ${props.tracking.color}`, borderRadius: 12, background: 'rgba(4,17,20,.9)', backdropFilter: 'blur(10px)', textAlign: 'center', fontSize: 21, lineHeight: 1.45, fontWeight: 720, opacity: settle, transform: `translateY(${(1 - settle) * 15}px)` } }, props.conclusion),
        React.createElement("footer", { style: { position: 'absolute', left: 72, right: 72, bottom: 28, display: 'flex', justifyContent: 'space-between', color: '#aab7bb', fontSize: 13 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null,
                isTracked ? '关键帧锚点跟踪' : '负空间数据叠加',
                " \u00B7 \u6700\u7EC8\u9759\u6B62 1.2 \u79D2")));
};
export { VideoDataOverlay, trackingPosition };
