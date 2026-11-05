// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeNarrativeDefinition = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker } = contentFields(sceneContent, scene);
    const ACCENT = '#f59e0b';
    if (!title || !subtitle)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #0f172a 0%, #0c1a2e 60%, #020617 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-def-kicker", role: "kicker", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 100, fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(kicker || uiLabel(sceneContent, 'term', 'TERM'), 24))),
        React.createElement(EditableTransform, { id: "runtime-def-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 148, width: 960, fontSize: title.length > 12 ? 56 : 72, lineHeight: 1.08, fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', opacity: ease(frame, [8, 32], [0, 1]) } }, truncate(title, 48))),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 248, width: 240 * ease(frame, [22, 44], [0, 1]), height: 2, background: ACCENT, opacity: 0.8, borderRadius: 1 } }),
        React.createElement(EditableTransform, { id: "runtime-def-body", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 278, width: 960, fontSize: 22, lineHeight: 1.7, fontWeight: 400, color: '#94a3b8', opacity: ease(frame, [30, 58], [0, 1]) } }, truncate(subtitle, 200)))));
};
