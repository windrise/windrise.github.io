// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { truncate, uiLabel } from '../runtimeSlots.js';
import { ease, contentFields, animationFrame } from './textTemplateShared.js';
export const RuntimeOpeningDataGrid = ({ sceneContent, scene }) => {
    const frame = animationFrame(sceneContent, scene);
    const { title, subtitle, kicker, metrics, bullets } = contentFields(sceneContent, scene);
    const gridCells = Array.from({ length: 28 }, (_, index) => index);
    const cells = [...metrics.map((metric) => `${metric.label}: ${metric.value}`), ...bullets, subtitle].filter(Boolean).slice(0, 6);
    if (!title)
        return null;
    return (React.createElement(AbsoluteFill, { style: { background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 48%, #ecfeff 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', right: 94, top: 112, width: 430, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 } }, gridCells.map((cell) => {
            const p = ease(frame, [8 + cell * 2, 34 + cell * 2], [0, 1]);
            return (React.createElement("div", { key: cell, style: { height: 42, borderRadius: 10, background: cell % 5 === 0 ? '#2563eb' : cell % 3 === 0 ? '#14b8a6' : '#ffffff', border: '1px solid rgba(148,163,184,0.22)', boxShadow: cell % 5 === 0 ? '0 14px 34px rgba(37,99,235,0.22)' : 'none', opacity: p, transform: `scale(${0.86 + p * 0.14})` } }));
        })),
        React.createElement(EditableTransform, { id: "runtime-opening-grid-kicker", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 126, fontSize: 15, fontWeight: 860, letterSpacing: '0.18em', color: '#2563eb', opacity: ease(frame, [0, 18], [0, 1]) } }, truncate(kicker || uiLabel(sceneContent, 'dataset_overview', 'DATASET OVERVIEW'), 26))),
        React.createElement(EditableTransform, { id: "runtime-opening-grid-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 92, top: 176, width: 660, fontSize: title.length > 68 ? 52 : 64, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0, opacity: ease(frame, [12, 42], [0, 1]) } }, truncate(title, 74))),
        subtitle ? (React.createElement(EditableTransform, { id: "runtime-opening-grid-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 96, top: 360, width: 560, fontSize: 20, lineHeight: 1.35, fontWeight: 650, color: '#64748b', opacity: ease(frame, [38, 68], [0, 1]) } }, truncate(subtitle, 132)))) : null,
        cells.length ? (React.createElement("div", { style: { position: 'absolute', left: 96, right: 94, top: 468, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 } }, cells.map((cell, index) => {
            const p = ease(frame, [28 + index * 5, 56 + index * 5], [0, 1]);
            return (React.createElement("div", { key: `${cell}-${index}`, style: { height: 42, border: '1px solid rgba(148,163,184,0.22)', borderRadius: 10, background: '#ffffff', padding: '8px 12px', boxSizing: 'border-box', opacity: p, overflow: 'hidden' } },
                React.createElement("div", { "data-dm-text-editable": true, style: { fontSize: 13, lineHeight: 1.2, fontWeight: 760, color: index % 3 === 0 ? '#2563eb' : '#0f172a' } }, truncate(cell, 44))));
        }))) : null));
};
