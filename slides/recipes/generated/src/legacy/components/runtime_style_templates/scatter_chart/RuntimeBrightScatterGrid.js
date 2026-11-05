// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntitySvgLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const chart = { left: 190, top: 160, width: 880, height: 340 };
export const BrightScatterGridDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const safeFps = fps ?? 30;
    const animation = runtimeAnimationContract('scatter', scene, rawFrame, safeFps);
    const cardSpring = spring({ frame, fps: safeFps, config: { damping: 200, stiffness: 130 }, durationInFrames: 28 });
    const palette = paletteFor(sceneContent, false);
    const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 10);
    const points = runtimeRows.map((point, index) => ({ ...point, size: point.size ?? 16, color: point.color || palette[index % palette.length] }));
    const xExt = valueExtent(points.map((point) => point.x));
    const yExt = valueExtent(points.map((point) => point.y));
    const sizeMax = Math.max(1, ...points.map((point) => Math.abs(point.size)));
    const px = (value) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
    const py = (value) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
    const title = slotTitle(sceneContent);
    const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
    const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
    if (!points.length || !title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#fafafa', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #f0fdf4 45%, #fafafa 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 60, top: 52, width: 1160, height: 480, borderRadius: 28, background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 26px 76px rgba(15,23,42,0.09)', opacity: ease(frame, [0, 16], [0, 1]), transform: `translateY(${(1 - cardSpring) * 10}px)` } }),
        React.createElement(EditableTransform, { id: "bright-scatter-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 104, top: 94, width: 780, fontSize: 44, fontWeight: 880, letterSpacing: '-0.045em', color: '#0f172a', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "bright-scatter-axes", role: "annotation", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: chart.left + chart.width / 2 - 60, top: chart.top + chart.height + 50, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: ease(frame, [12, 28], [0, 1]) } }, xLabel),
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: chart.left - 78, top: chart.top + chart.height / 2 - 30, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'center center', opacity: ease(frame, [12, 28], [0, 1]) } }, yLabel)),
        React.createElement(EditableTransform, { id: "bright-scatter-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                [0, 0.25, 0.5, 0.75, 1].map((tick) => {
                    const xValue = xExt.min + tick * (xExt.max - xExt.min);
                    const yValue = yExt.min + tick * (yExt.max - yExt.min);
                    return (React.createElement("g", { key: tick },
                        React.createElement("line", { x1: chart.left, x2: chart.left + chart.width, y1: py(yValue), y2: py(yValue), stroke: tick === 0 ? '#94a3b8' : '#e2e8f0', strokeWidth: tick === 0 ? 2 : 1 }),
                        React.createElement("line", { x1: px(xValue), x2: px(xValue), y1: chart.top, y2: chart.top + chart.height, stroke: tick === 0 ? '#94a3b8' : '#e2e8f0', strokeWidth: tick === 0 ? 2 : 1 })));
                }),
                points.map((point, index) => {
                    const progress = ease(frame, [16 + index * 7, 42 + index * 7], [0, 1]);
                    const radius = 8 + (Math.abs(point.size) / sizeMax) * 14;
                    const cx = px(point.x);
                    const cy = py(point.y);
                    const isActive = runtimeContractMatches(animation, point.label);
                    const fill = isActive ? animation.accent : point.color;
                    return (React.createElement("g", { key: `${point.label}-${index}`, opacity: runtimeContractOpacity(animation, isActive, progress) },
                        React.createElement("circle", { className: "bubble", cx: cx, cy: cy, r: radius + (isActive ? 18 : 10), fill: fill, opacity: isActive ? 0.2 : 0.12 }),
                        React.createElement("circle", { className: "dot", cx: cx, cy: cy, r: (radius + (isActive ? 3 : 0)) * progress, fill: fill, filter: isActive ? animation.glow : undefined }),
                        React.createElement("circle", { cx: cx, cy: cy, r: (radius + (isActive ? 3 : 0)) * progress, fill: "none", stroke: "#ffffff", strokeWidth: isActive ? 3 : 2 }),
                        React.createElement(RuntimeEntitySvgLabel, { "data-dm-text-editable": true, x: cx + radius + 8, y: cy - 8, fontSize: 13, fontWeight: isActive ? 920 : 800, fill: isActive ? animation.accent : '#1e293b', sceneContent: sceneContent, label: point.label }, truncate(point.label, 14))));
                })))));
};
