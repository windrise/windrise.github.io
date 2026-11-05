// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const chart = { left: 132, top: 150, width: 980, height: 385 };
export const DenseScatterCloudDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const animation = runtimeAnimationContract('scatter', scene, rawFrame, fps ?? 30);
    const emphasis = runtimeContractEase(animation);
    const palette = paletteFor(sceneContent, true);
    const points = runtimeScatterPoints(sceneContent).slice(0, 30).map((point, index) => ({ ...point, color: point.color || palette[index % palette.length] }));
    const title = slotTitle(sceneContent);
    if (!points.length || !title)
        return null;
    const xExt = valueExtent(points.map((point) => point.x));
    const yExt = valueExtent(points.map((point) => point.y));
    const xFor = (value) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
    const yFor = (value) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
    return (React.createElement(AbsoluteFill, { style: { background: '#08111f', color: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-dense-cloud-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 84, top: 58, width: 780, fontSize: 40, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "runtime-dense-cloud-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                React.createElement("rect", { x: chart.left - 32, y: chart.top - 28, width: chart.width + 64, height: chart.height + 56, rx: 26, fill: "rgba(255,255,255,0.055)", stroke: "rgba(148,163,184,0.18)" }),
                [0, 0.25, 0.5, 0.75, 1].map((t) => React.createElement("g", { key: t },
                    React.createElement("line", { x1: chart.left + chart.width * t, x2: chart.left + chart.width * t, y1: chart.top, y2: chart.top + chart.height, stroke: "rgba(148,163,184,0.12)" }),
                    React.createElement("line", { x1: chart.left, x2: chart.left + chart.width, y1: chart.top + chart.height * t, y2: chart.top + chart.height * t, stroke: "rgba(148,163,184,0.12)" }))),
                points.map((point, index) => {
                    const reveal = ease(frame, [12 + index * 2, 34 + index * 2], [0, 1]);
                    const isActive = runtimeContractMatches(animation, point.label);
                    const hero = isActive || index < 3;
                    return (React.createElement("g", { key: `${point.label}-${index}`, opacity: reveal * runtimeContractOpacity(animation, isActive, 0.76) },
                        React.createElement("circle", { cx: xFor(point.x), cy: yFor(point.y), r: (isActive ? 12 + emphasis * 4 : 7) * reveal, fill: isActive ? animation.accent : point.color, stroke: "#f8fafc", strokeOpacity: hero ? 0.7 : 0.22, strokeWidth: hero ? 2 : 1, filter: isActive ? animation.glow : undefined }),
                        hero ? React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: xFor(point.x) + 14, y: yFor(point.y) + 5, fontSize: 13, fontWeight: 820, fill: isActive ? animation.accent : '#dbeafe', sceneContent: sceneContent, label: point.label }, truncate(point.label, 14)) : null));
                })))));
};
