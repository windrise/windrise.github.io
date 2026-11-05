// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Img, staticFile } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame, textList } from './textTemplateShared.js';
export const RuntimeNarrativeBulletsIllustrated = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker, bullets } = contentFields(sceneContent, scene);
    const ACCENT = '#34d399';
    const rawItems = textList(bullets).length ? textList(bullets) : (subtitle ? [subtitle] : []);
    const items = rawItems.slice(0, 3);
    if (!title && items.length === 0)
        return null;
    const illustrationPath = typeof scene?.illustration_image === 'string' ? scene.illustration_image.trim() : '';
    const imgSrc = illustrationPath
        ? staticFile(illustrationPath)
        : staticFile('replacements/narrative-bullets.svg');
    const imgReveal = ease(frame, [12, 44], [0, 1]);
    const imgScale = 0.96 + 0.04 * imgReveal;
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #0f172a 0%, #0c1a2e 60%, #020617 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-bullets-ill-kicker", role: "kicker", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 104, fontSize: 14, fontWeight: 800, letterSpacing: '0.22em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(kicker || uiLabel(sceneContent, 'key_takeaways', 'KEY TAKEAWAYS'), 40))),
        React.createElement(EditableTransform, { id: "runtime-bullets-ill-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 150, width: 620, fontSize: 40, lineHeight: 1.18, fontWeight: 880, letterSpacing: '-0.025em', color: '#f1f5f9', opacity: ease(frame, [8, 32], [0, 1]) } }, truncate(title || '', 70))),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 230, width: 180 * ease(frame, [24, 44], [0, 1]), height: 2, background: ACCENT, opacity: 0.7, borderRadius: 1 } }),
        items.map((text, i) => (React.createElement("div", { key: i, style: { position: 'absolute', left: 96, top: 258 + i * 68, width: 620, display: 'flex', alignItems: 'flex-start', gap: 14, opacity: ease(frame, [30 + i * 12, 54 + i * 12], [0, 1]) } },
            React.createElement("div", { style: { width: 7, height: 7, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginTop: 9 } }),
            React.createElement("div", { style: { fontSize: 20, lineHeight: 1.55, fontWeight: 450, color: '#cbd5e1' } }, truncate(text, 80))))),
        React.createElement("div", { style: { position: 'absolute', right: 80, top: 110, width: 420, height: 360, borderRadius: 24, overflow: 'hidden', opacity: imgReveal, transform: `scale(${imgScale})`, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)', userSelect: 'none' } },
            React.createElement(Img, { src: imgSrc, draggable: false, style: { width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' } }),
            React.createElement("div", { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(transparent, rgba(15,23,42,0.55))' } }))));
};
