// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeNarrativeQuestion = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle } = contentFields(sceneContent, scene);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.18), transparent 38%), linear-gradient(135deg, #0f172a 0%, #111827 60%, #020617 100%)' } }),
        React.createElement("div", { "aria-hidden": true, style: { position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontSize: 360, fontWeight: 900, letterSpacing: '-0.05em', color: 'transparent', WebkitTextStroke: '2px rgba(56,189,248,0.32)', opacity: ease(frame, [0, 26], [0, 1]), pointerEvents: 'none', lineHeight: 1 } }, "?"),
        React.createElement(EditableTransform, { id: "runtime-narrative-question-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 80, right: 80, top: 280, textAlign: 'center', fontSize: title.length > 76 ? 48 : 64, lineHeight: 1.18, fontWeight: 850, letterSpacing: '-0.025em', color: '#ffffff', opacity: ease(frame, [14, 46], [0, 1]) } }, truncate(title.endsWith('?') ? title : `${title}?`, 92))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-narrative-question-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 0, right: 0, top: 432, textAlign: 'center', fontSize: 22, fontWeight: 500, color: '#cbd5e1', opacity: ease(frame, [40, 68], [0, 1]) } }, truncate(subtitle, 126)))) : null));
};
