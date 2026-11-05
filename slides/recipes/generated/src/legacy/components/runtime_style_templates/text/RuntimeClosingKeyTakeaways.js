// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeClosingKeyTakeaways = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, bullets } = contentFields(sceneContent, scene);
    const takeaways = (bullets.length ? bullets : subtitle ? [subtitle] : []).slice(0, 3);
    if (!title || !takeaways.length)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#101820', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #101820 0%, #172033 62%, #0b1120 100%)' } }),
        React.createElement(EditableTransform, { id: "runtime-closing-takeaways-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 78, fontSize: 54, fontWeight: 890, letterSpacing: '-0.045em', whiteSpace: 'nowrap', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(title, 48))),
        React.createElement("div", { style: { position: 'absolute', left: 138, right: 138, top: 190, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 } }, takeaways.map((item, index) => {
            const p = ease(frame, [18 + index * 9, 48 + index * 9], [0, 1]);
            return (React.createElement("div", { key: `${item}-${index}`, style: { height: 250, borderRadius: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: 28, boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 18}px)` } },
                React.createElement("div", { style: { fontSize: 42, fontWeight: 900, color: ['#38bdf8', '#34d399', '#fbbf24'][index % 3], marginBottom: 46 } },
                    "0",
                    index + 1),
                React.createElement("div", { "data-dm-text-editable": true, style: { fontSize: 25, lineHeight: 1.16, fontWeight: 850 } }, truncate(item, 70))));
        }))));
};
