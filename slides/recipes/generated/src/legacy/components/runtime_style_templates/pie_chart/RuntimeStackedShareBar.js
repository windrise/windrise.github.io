// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { RuntimeEntityLabel } from '../runtimeEntityVisuals.js';
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export const StackedShareBarDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const animation = runtimeAnimationContract('pie', scene, rawFrame, fps ?? 30);
    const emphasis = runtimeContractEase(animation);
    const palette = paletteFor(sceneContent, true);
    const items = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 12).map((row, index) => ({ ...row, color: row.color || palette[index % palette.length] }));
    const title = slotTitle(sceneContent);
    if (!items.length || !title)
        return null;
    const total = items.reduce((sum, row) => sum + row.value, 0) || 1;
    let offset = 0;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #020617 0%, #0f172a 52%, #1e293b 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-stacked-share-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 84, top: 72, width: 860, fontSize: 44, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.045em', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 60))),
        React.createElement(EditableTransform, { id: "runtime-stacked-share-chart", role: "chart", style: { display: 'block' } },
            React.createElement("svg", { width: 1280, height: 720, viewBox: "0 0 1280 720", style: { position: 'absolute', inset: 0 } },
                React.createElement("rect", { x: 92, y: 236, width: 1096, height: 88, rx: 30, fill: "rgba(255,255,255,0.08)" }),
                items.map((item, index) => {
                    const share = item.value / total;
                    const width = share * 1096 * ease(frame, [16 + index * 3, 42 + index * 3], [0, 1]);
                    const x = 92 + offset * 1096;
                    offset += share;
                    const isActive = runtimeContractMatches(animation, item.label, item.series);
                    return React.createElement("rect", { key: `${item.label}-${index}`, x: x, y: 236, width: width, height: 88, rx: index === 0 || index === items.length - 1 ? 30 : 6, fill: isActive ? animation.accent : item.color, opacity: runtimeContractOpacity(animation, isActive, 0.92), filter: isActive ? animation.glow : undefined, stroke: isActive ? animation.accent : undefined, strokeWidth: isActive ? 3 + emphasis : 0 });
                })),
            React.createElement("div", { style: { position: 'absolute', left: 92, top: 370, width: 1096, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 } }, items.slice(0, 9).map((item, index) => {
                const share = (item.value / total) * 100;
                const isActive = runtimeContractMatches(animation, item.label, item.series);
                return (React.createElement("div", { key: `${item.label}-legend`, style: { display: 'flex', alignItems: 'center', gap: 10, opacity: ease(frame, [34 + index * 3, 54 + index * 3], [0, 1]) * runtimeContractOpacity(animation, isActive, 0.88) } },
                    React.createElement("div", { style: { width: 12, height: 12, borderRadius: 3, background: isActive ? animation.accent : item.color } }),
                    React.createElement("div", { "data-dm-text-editable": true, style: { flex: 1, fontSize: 14, fontWeight: 760, color: isActive ? '#ffffff' : '#cbd5e1' } },
                        React.createElement(RuntimeEntityLabel, { sceneContent: sceneContent, label: item.label }, truncate(item.label, 18))),
                    React.createElement("div", { "data-dm-text-editable": true, style: { fontSize: 14, fontWeight: 900, color: isActive ? animation.accent : '#f8fafc' } },
                        trimNumber(share, 1),
                        "%")));
            })))));
};
