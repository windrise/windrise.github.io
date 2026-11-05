// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeClosingLightOutro = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle } = contentFields(sceneContent, scene);
    const titleProgress = ease(frame, [0, 24], [0, 1]);
    const card = ease(frame, [18, 48], [0, 1]);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef6ff 54%, #f8fafc 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', right: 96, top: 88, width: 230, height: 230, borderRadius: 999, border: '1px solid rgba(37,99,235,0.14)', opacity: card } }),
        React.createElement("div", { style: { position: 'absolute', right: 152, top: 144, width: 118, height: 118, borderRadius: 999, background: 'rgba(37,99,235,0.08)', opacity: card } }),
        React.createElement(EditableTransform, { id: "runtime-closing-light-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 104, top: 208, width: 780, fontSize: title.length > 70 ? 58 : 74, lineHeight: 0.96, fontWeight: 930, letterSpacing: '-0.06em', opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 16}px)` } }, truncate(title, 82))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-closing-light-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 108, top: 390, width: 560, fontSize: 23, lineHeight: 1.44, fontWeight: 650, color: '#64748b', opacity: card } }, truncate(subtitle, 140)))) : null,
        React.createElement("div", { style: { position: 'absolute', left: 108, right: 108, top: 472, height: 1, background: '#dbeafe', transform: `scaleX(${ease(frame, [28, 62], [0, 1])})`, transformOrigin: 'left center' } })));
};
