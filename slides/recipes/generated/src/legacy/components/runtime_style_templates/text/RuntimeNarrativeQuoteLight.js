// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeNarrativeQuoteLight = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker } = contentFields(sceneContent, scene);
    const QUOTE_COLOR = '#dc2626';
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#fafafa', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #fff1f2 45%, #fafafa 100%)' } }),
        React.createElement("div", { "aria-hidden": true, style: { position: 'absolute', left: 80, top: 124, fontSize: 220, lineHeight: 0.6, fontWeight: 900, color: QUOTE_COLOR, opacity: ease(frame, [0, 24], [0, 0.18]), pointerEvents: 'none' } }, "\""),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 220, width: 4, height: 200 * ease(frame, [8, 34], [0, 1]), background: QUOTE_COLOR, borderRadius: 2 } }),
        React.createElement(EditableTransform, { id: "runtime-quote-light-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 128, right: 96, top: 220, fontSize: title.length > 88 ? 42 : 56, lineHeight: 1.22, fontWeight: 880, letterSpacing: '-0.025em', color: '#0f172a', opacity: ease(frame, [14, 46], [0, 1]) } }, truncate(title, 118))),
        React.createElement(EditableTransform, { id: "runtime-quote-light-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 128, top: 468, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', opacity: ease(frame, [40, 68], [0, 1]) } }, truncate(kicker || subtitle || '', 60)))));
};
