// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeClosingGradientSignal = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle } = contentFields(sceneContent, scene);
    const titleProgress = ease(frame, [0, 24], [0, 1]);
    const lineProgress = ease(frame, [24, 58], [0, 1]);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 28%, rgba(56,189,248,0.24), transparent 30%), radial-gradient(circle at 18% 78%, rgba(168,85,247,0.18), transparent 28%), linear-gradient(135deg, #111827 0%, #172033 58%, #020617 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 96, width: 170 * lineProgress, height: 4, borderRadius: 999, background: '#38bdf8' } }),
        React.createElement(EditableTransform, { id: "runtime-closing-signal-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 214, width: 760, fontSize: title.length > 72 ? 58 : 74, lineHeight: 0.95, fontWeight: 930, letterSpacing: '-0.06em', opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 18}px)` } }, truncate(title, 82))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-closing-signal-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 100, top: 424, width: 620, fontSize: 23, lineHeight: 1.42, fontWeight: 620, color: 'rgba(226,232,240,0.78)', opacity: ease(frame, [18, 44], [0, 1]) } }, truncate(subtitle, 128)))) : null,
        React.createElement("div", { style: { position: 'absolute', right: 104, bottom: 102, display: 'flex', gap: 10, opacity: lineProgress } }, [0, 1, 2].map((item) => React.createElement("div", { key: item, style: { width: 10, height: 10, borderRadius: 999, background: ['#38bdf8', '#a78bfa', '#34d399'][item] } })))));
};
