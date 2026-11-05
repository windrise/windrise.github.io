// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, cleanText, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeNarrativeChapterTitle = ({ sceneContent, scene }) => {
    const forceLight = false;
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker } = contentFields(sceneContent, scene);
    const sectionLabel = uiLabel(sceneContent, 'section', 'SECTION');
    const indexText = cleanText(kicker, scene?.index ? `${sectionLabel} ${scene.index}` : '', scene?.scene_index ? `${sectionLabel} ${scene.scene_index}` : '', sectionLabel);
    const accent = forceLight ? '#2563eb' : '#f59e0b';
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: forceLight ? '#f8fafc' : '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: forceLight ? '#0f172a' : '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: forceLight ? 'linear-gradient(145deg, #ffffff 0%, #eff6ff 55%, #f8fafc 100%)' : 'linear-gradient(135deg, #0f172a 0%, #111827 60%, #020617 100%)' } }),
        forceLight ? (React.createElement("div", { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, #60a5fa, transparent)`, opacity: ease(frame, [0, 16], [0, 1]) } })) : null,
        React.createElement(EditableTransform, { id: "runtime-narrative-chapter-kicker", role: "kicker", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 188, fontSize: 16, fontWeight: 800, letterSpacing: '0.22em', color: accent, textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(indexText, 34))),
        React.createElement(EditableTransform, { id: "runtime-narrative-chapter-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 244, width: 980, fontSize: title.length > 70 ? 58 : 78, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.035em', color: forceLight ? '#0f172a' : '#ffffff', opacity: ease(frame, [12, 42], [0, 1]) } }, truncate(title, 84))),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 422, width: 240 * ease(frame, [30, 56], [0, 1]), height: forceLight ? 3 : 2, background: accent, borderRadius: 2, opacity: forceLight ? 0.7 : 0.75 } }),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-narrative-chapter-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 446, width: 820, fontSize: 22, lineHeight: 1.5, fontWeight: 500, color: forceLight ? '#475569' : '#cbd5e1', opacity: ease(frame, [40, 70], [0, 1]) } }, truncate(subtitle, 150)))) : null));
};
