// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { activeRow, reveal, sceneFont, validateRows } from '../../src/sceneTiming.js';
import { EntityIcon } from '../../src/entityVisuals.js';
export function validatePortraitRanking(props, duration = 10) {
    validateRows(props.rows, props.maximum, duration);
    if (props.rows.length > 4)
        throw new Error('Portrait ranking supports 2 to 4 rows.');
    for (const [key, limit] of Object.entries({ title: 24, question: 48, metricLabel: 16, unit: 6, source: 56, takeaway: 48 })) {
        const value = props[key];
        if (typeof value !== 'string' || !value.trim() || value.length > limit)
            throw new Error(`${key} must contain 1 to ${limit} characters.`);
    }
    for (const row of props.rows) {
        if (row.label.length > 12 || row.caption.length > 40 || row.at < 1.5 || row.at > duration - 2.8)
            throw new Error('Portrait rows need short labels/captions and room for the hook and conclusion.');
    }
    const ordered = [...props.rows].sort((a, b) => a.at - b.at);
    if (ordered.some((row, index) => index > 0 && row.value < ordered[index - 1].value))
        throw new Error('Countdown reveals must proceed from the lowest to the highest value.');
}
export const PortraitRankedReveal = props => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    validatePortraitRanking(props, durationInFrames / fps);
    const seconds = frame / fps;
    const sorted = [...props.rows].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const active = activeRow(props.rows, seconds);
    const end = Math.max(...props.rows.map(row => row.at)) + 1.0;
    const conclusion = reveal(seconds, end, 0.5);
    return React.createElement(AbsoluteFill, { style: { background: '#101c2c', color: '#f5f7fc', fontFamily: props.fontFamily ?? sceneFont } },
        React.createElement("div", { style: { position: 'absolute', left: 80, right: 160, top: 135 } },
            React.createElement("div", { style: { fontSize: 27, fontWeight: 700, letterSpacing: 2, color: '#72ddd1' } }, "DATAMAGIC CARDS / \u7AD6\u5C4F\u699C\u5355"),
            React.createElement("h1", { style: { fontSize: 66, lineHeight: 1.25, margin: '32px 0 22px', overflowWrap: 'anywhere' } }, props.title),
            React.createElement("div", { style: { fontSize: 32, lineHeight: 1.55, color: '#c7d2e1' } }, props.question)),
        React.createElement("section", { style: { position: 'absolute', left: 80, right: 160, top: 510 } },
            React.createElement("div", { style: { fontSize: 26, color: '#c7d2e1', display: 'flex', justifyContent: 'space-between', marginBottom: 28 } },
                React.createElement("span", null, props.metricLabel),
                React.createElement("span", null,
                    "0\u2013",
                    props.maximum,
                    " ",
                    props.unit)),
            sorted.map(row => {
                const progress = reveal(seconds, row.at, 0.7);
                const visible = seconds >= row.at;
                const rank = sorted.findIndex(other => other.value === row.value) + 1;
                const highlighted = active?.id === row.id || (seconds >= end && rank === 1);
                return React.createElement("div", { key: row.id, style: { height: 168, borderTop: '1px solid #354355', paddingTop: 26, boxSizing: 'border-box' } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 20 } },
                        React.createElement("span", { style: { fontSize: 30, color: '#8594a9', width: 48 } }, String(rank).padStart(2, '0')),
                        row.iconSrc ? React.createElement("div", { style: { width: 56, height: 56, flexShrink: 0, opacity: progress } }, visible ? React.createElement(EntityIcon, { src: row.iconSrc, size: 56 }) : null) : null,
                        React.createElement("strong", { style: { fontSize: 36, flex: 1, minWidth: 0, color: highlighted ? '#72ddd1' : '#f5f7fc' } }, visible ? row.label : '待揭晓'),
                        React.createElement("strong", { style: { fontSize: 48, opacity: progress, fontVariantNumeric: 'tabular-nums' } }, row.value)),
                    React.createElement("div", { style: { height: 22, background: '#263449', marginTop: 22, borderRadius: 5, overflow: 'hidden' } },
                        React.createElement("div", { style: { height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: row.color ?? (highlighted ? '#72ddd1' : '#7697bc'), opacity: row.color && !highlighted ? 0.75 : 1 } })));
            })),
        React.createElement("div", { style: { position: 'absolute', left: 80, right: 160, top: 1295, minHeight: 205, padding: '28px 32px', boxSizing: 'border-box', background: '#1d3044', borderLeft: '5px solid #72ddd1' } },
            React.createElement("div", { style: { fontSize: 25, color: '#72ddd1', marginBottom: 14 } }, seconds >= end ? '关键结论' : `${props.rows.filter(row => row.at <= seconds).length} / ${props.rows.length} 已揭晓`),
            React.createElement("div", { style: { fontSize: 35, lineHeight: 1.5 } }, seconds >= end ? props.takeaway : active?.caption || '从榜单末位开始，看看谁最终领先。'),
            React.createElement("div", { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: '#72ddd1', transform: `scaleX(${conclusion})`, transformOrigin: 'left' } })),
        React.createElement("footer", { style: { position: 'absolute', left: 80, right: 160, bottom: 265, fontSize: 24, lineHeight: 1.5, color: '#a7b7cc', borderTop: '1px solid #354355', paddingTop: 24 } }, props.source));
};
