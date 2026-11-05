// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeOpeningEditorialTitle = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker } = contentFields(sceneContent, scene);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 54%, #f8fafc 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-opening-editorial-kicker", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 112, top: 142, fontSize: 15, fontWeight: 860, letterSpacing: '0.18em', color: '#2563eb', opacity: ease(frame, [0, 20], [0, 1]) } }, truncate(kicker || uiLabel(sceneContent, 'data_briefing', 'DATA BRIEFING'), 34))),
        React.createElement(EditableTransform, { id: "runtime-opening-editorial-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 108, top: 188, width: 790, fontSize: title.length > 78 ? 58 : 76, lineHeight: 0.98, fontWeight: 900, letterSpacing: '-0.06em', opacity: ease(frame, [12, 42], [0, 1]) } }, truncate(title, 84))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-opening-editorial-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 112, top: 414, width: 540, fontSize: 24, lineHeight: 1.38, fontWeight: 650, color: '#64748b', opacity: ease(frame, [38, 66], [0, 1]) } }, truncate(subtitle, 158)))) : null));
};
