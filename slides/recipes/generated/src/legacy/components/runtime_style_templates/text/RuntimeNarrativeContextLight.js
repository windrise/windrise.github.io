// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeNarrativeContextLight = ({ sceneContent, scene }) => {
    const forceLight = true;
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker } = contentFields(sceneContent, scene);
    const accent = forceLight ? '#d97706' : '#f59e0b';
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: forceLight ? '#fffbeb' : '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: forceLight ? '#0f172a' : '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: forceLight ? 'linear-gradient(145deg, #ffffff 0%, #fffbeb 55%, #fef3c7 100%)' : 'linear-gradient(135deg, #0f172a 0%, #111827 70%, #020617 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 72, top: 148, width: 4, height: (forceLight ? 300 : 280) * ease(frame, [0, 36], [0, 1]), background: forceLight ? `linear-gradient(180deg, ${accent}, rgba(217,119,6,0.1))` : `linear-gradient(180deg, ${accent}, transparent)`, borderRadius: 2 } }),
        React.createElement(EditableTransform, { id: "runtime-narrative-context-label", role: "kicker", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 108, top: 152, fontSize: 14, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: ease(frame, [0, 20], [0, 1]) } }, truncate(kicker || uiLabel(sceneContent, 'background', 'BACKGROUND'), 32))),
        React.createElement(EditableTransform, { id: "runtime-narrative-context-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 108, top: 202, width: 900, fontSize: title.length > 78 ? 44 : 54, lineHeight: 1.14, fontWeight: 880, letterSpacing: '-0.025em', color: forceLight ? '#0f172a' : '#f1f5f9', opacity: ease(frame, [12, 40], [0, 1]) } }, truncate(title, 92))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-narrative-context-body", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 108, top: forceLight ? 348 : 330, width: 860, fontSize: 22, lineHeight: 1.65, fontWeight: 400, color: forceLight ? '#475569' : '#94a3b8', opacity: ease(frame, [28, 58], [0, 1]) } }, truncate(subtitle, 190)))) : null));
};
