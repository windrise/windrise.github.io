// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeClosingSimpleOutro = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle } = contentFields(sceneContent, scene);
    const titleProgress = ease(frame, [0, 26], [0, 1]);
    const subtitleProgress = ease(frame, [14, 42], [0, 1]);
    const lineProgress = ease(frame, [28, 58], [0, 1]);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 54%, #020617 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 96, right: 96, top: 96, height: 1, background: 'rgba(148,163,184,0.22)', transform: `scaleX(${lineProgress})`, transformOrigin: 'left center' } }),
        React.createElement(EditableTransform, { id: "runtime-closing-simple-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 214, width: 760, fontSize: title.length > 66 ? 56 : 72, lineHeight: 0.94, fontWeight: 920, letterSpacing: '-0.055em', opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 18}px)` } }, truncate(title, 76))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-closing-simple-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 100, top: 396, width: 610, fontSize: 23, lineHeight: 1.42, fontWeight: 620, color: 'rgba(226,232,240,0.78)', opacity: subtitleProgress, transform: `translateY(${(1 - subtitleProgress) * 12}px)` } }, truncate(subtitle, 140)))) : null,
        React.createElement("div", { style: { position: 'absolute', right: 104, bottom: 102, display: 'flex', alignItems: 'center', gap: 14, opacity: lineProgress } },
            React.createElement("div", { style: { width: 44, height: 3, borderRadius: 999, background: '#38bdf8' } }),
            React.createElement("div", { style: { fontSize: 13, fontWeight: 850, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.7)' } }, "DataMagic"))));
};
