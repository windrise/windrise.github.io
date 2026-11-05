// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const cl = (frame, i, o) => interpolate(frame, i, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export const TimelineMilestoneRoadmapDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
    const palette = paletteFor(sceneContent, false);
    const rows = runtimePoints(sceneContent, scene).slice(0, 8).map((row, index) => ({ ...row, color: row.color || palette[index % palette.length] }));
    const title = slotTitle(sceneContent);
    if (rows.length < 2 || !title)
        return null;
    const TRACK_LEFT = 110;
    const TRACK_RIGHT = 1170;
    const TRACK_Y = 300;
    const span = TRACK_RIGHT - TRACK_LEFT;
    const step = span / rows.length;
    const trackDraw = cl(frame, [14, 46], [0, 1]);
    return (React.createElement(AbsoluteFill, { style: { background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eef3ff 55%, #f8fafc 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', top: 0, left: 0, width: cl(frame, [0, 28], [0, 1280]), height: 3, background: 'linear-gradient(90deg, #2563eb, #93c5fd, transparent)' } }),
        React.createElement(EditableTransform, { id: "tlmr-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 72, top: 56, fontSize: 36, fontWeight: 860, color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "tlmr-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                React.createElement("rect", { x: TRACK_LEFT, y: TRACK_Y - 9, width: span, height: 18, rx: 9, fill: "#e2e8f0" }),
                React.createElement("rect", { x: TRACK_LEFT, y: TRACK_Y - 9, width: span * trackDraw, height: 18, rx: 9, fill: "url(#tlmrTrack)" }),
                React.createElement("defs", null,
                    React.createElement("linearGradient", { id: "tlmrTrack", x1: "0", y1: "0", x2: "1", y2: "0" },
                        React.createElement("stop", { offset: "0%", stopColor: "#2563eb" }),
                        React.createElement("stop", { offset: "100%", stopColor: "#60a5fa" }))),
                rows.map((row, i) => {
                    const cx = TRACK_LEFT + i * step + step / 2;
                    const chipPop = cl(frame, [26 + i * 7, 44 + i * 7], [0, 1]);
                    const textFade = cl(frame, [36 + i * 7, 54 + i * 7], [0, 1]);
                    const isActive = runtimeContractMatches(animation, row.label);
                    const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
                    const valueLabel = row.displayValue || formatCompact(row.value, row.label);
                    const subtitle = firstString(row.subtitle);
                    const r = 30 + focus * 4;
                    return (React.createElement("g", { key: row.label, opacity: runtimeContractOpacity(animation, isActive) },
                        React.createElement("circle", { cx: cx, cy: TRACK_Y, r: r, fill: row.color, opacity: chipPop, filter: isActive ? animation.glow : undefined }),
                        React.createElement("circle", { cx: cx, cy: TRACK_Y, r: r - 5, fill: "rgba(255,255,255,0.18)", opacity: chipPop }),
                        React.createElement("text", { x: cx, y: TRACK_Y + 8, textAnchor: "middle", fontSize: 24, fontWeight: 900, fill: "#ffffff", opacity: chipPop }, i + 1),
                        React.createElement("g", { transform: `translate(${cx}, ${TRACK_Y + 64})`, opacity: textFade },
                            React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: 0, y: 0, textAnchor: "middle", fontSize: 19, fontWeight: isActive ? 900 : 780, fill: "#0f172a", sceneContent: sceneContent, label: row.label }, truncate(row.label, 18)),
                            React.createElement("text", { "data-dm-text-editable": true, x: 0, y: 30, textAnchor: "middle", fontSize: 22, fontWeight: 900, fill: isActive ? animation.accent : '#2563eb' }, truncate(valueLabel, 16)),
                            subtitle ? React.createElement("text", { "data-dm-text-editable": true, x: 0, y: 56, textAnchor: "middle", fontSize: 13, fontWeight: 600, fill: "#64748b" }, truncate(subtitle, 26)) : null)));
                })))));
};
