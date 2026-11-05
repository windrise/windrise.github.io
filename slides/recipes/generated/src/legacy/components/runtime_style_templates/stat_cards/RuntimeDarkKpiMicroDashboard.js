// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
});
const pathFor = (values) => {
    const left = 52;
    const top = 26;
    const width = 468;
    const height = 112;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return values
        .map((value, index) => {
        const x = left + (index / (values.length - 1)) * width;
        const y = top + height - ((value - min) / (max - min || 1)) * height;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
        .join(' ');
};
export const DarkKpiMicroDashboardDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const animation = runtimeAnimationContract('stat', scene, rawFrame, 30);
    const cardProgress = ease(frame, [0, 20], [0, 1]);
    const cards = runtimeCards(sceneContent, scene);
    const palette = paletteFor(sceneContent, true);
    const hero = cards[0];
    const heroActive = runtimeContractMatches(animation, hero?.label);
    const segmentRows = cards.length > 1
        ? cards.slice(1, 4).map((card, index) => ({
            label: card.label,
            value: card.value,
            color: card.color || palette[(index + 1) % palette.length],
            displayValue: card.displayValue,
        }))
        : [];
    const trendValues = hero?.sparkline && hero.sparkline.length >= 2 ? hero.sparkline : [];
    const numberValue = Math.round(ease(frame, [18, 58], [0, hero?.value ?? 0]));
    const lineProgress = ease(frame, [24, 76], [0, 1]);
    const linePath = trendValues.length >= 2 ? pathFor(trendValues) : '';
    const title = slotTitle(sceneContent);
    if (!hero || !title)
        return null;
    return (React.createElement(AbsoluteFill, { style: {
            background: '#07111f',
            color: '#f8fafc',
            fontFamily: 'Inter, Helvetica, Arial, sans-serif',
            overflow: 'hidden',
        } },
        React.createElement(EditableTransform, { id: "dark-kpi-card", role: "group", style: { display: 'block' } },
            React.createElement("div", { style: {
                    position: 'absolute',
                    left: 104,
                    top: 84,
                    width: 1072,
                    padding: '44px 56px 40px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.86)',
                    border: '1px solid rgba(148,163,184,0.22)',
                    boxShadow: heroActive ? `0 34px 90px ${(hero?.color || '#60a5fa')}33` : '0 34px 90px rgba(0,0,0,0.45)',
                    display: 'grid',
                    gridTemplateColumns: '580px 1fr',
                    gap: 42,
                    overflow: 'hidden',
                    opacity: cardProgress,
                    transform: `translateY(${(1 - cardProgress) * 18}px)`,
                } },
                React.createElement("div", null,
                    React.createElement(EditableTransform, { id: "dark-kpi-title", role: "title", style: { display: 'block' } },
                        React.createElement("div", { "data-dm-text-editable": true, style: {
                                fontSize: 18,
                                fontWeight: 820,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#94a3b8',
                                marginBottom: 14,
                            } }, truncate(title, 60))),
                    React.createElement(EditableTransform, { id: "dark-kpi-main-metric", role: "metric", style: { display: 'block' } },
                        React.createElement("div", { "data-dm-text-editable": true, style: {
                                fontSize: 82,
                                lineHeight: 0.95,
                                fontWeight: 880,
                                color: '#f8fafc',
                                marginBottom: 14,
                                letterSpacing: 0,
                                fontVariantNumeric: 'tabular-nums',
                            } }, hero.displayValue || numberValue.toLocaleString('en-US'))),
                    React.createElement("div", { style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 9,
                            padding: '8px 12px',
                            borderRadius: 999,
                            background: 'rgba(52,211,153,0.12)',
                            color: '#34d399',
                            fontSize: 13,
                            fontWeight: 820,
                            opacity: ease(frame, [34, 54], [0, 1]),
                        } },
                        React.createElement("span", { style: { width: 8, height: 8, borderRadius: '50%', background: '#34d399' } }),
                        hero.subtitle),
                    trendValues.length >= 2 ? React.createElement(EditableTransform, { id: "dark-kpi-trend", role: "chart", style: { display: 'block', marginTop: 24 } },
                        React.createElement("svg", { width: 560, height: 158, viewBox: "0 0 560 158", style: { display: 'block' } },
                            [0, 1, 2].map((tick) => (React.createElement("line", { key: tick, x1: 52, x2: 520, y1: 26 + tick * 56, y2: 26 + tick * 56, stroke: "rgba(148,163,184,0.16)" }))),
                            React.createElement("g", { style: {
                                    opacity: lineProgress,
                                    transform: `scaleX(${lineProgress})`,
                                    transformOrigin: '52px 138px',
                                } },
                                React.createElement("path", { d: linePath, fill: "none", stroke: hero.color || '#60a5fa', strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" })))) : null),
                React.createElement(EditableTransform, { id: "dark-kpi-segments", role: "group", style: { display: 'block' } },
                    React.createElement("div", { style: { display: 'grid', gap: 18, paddingTop: 12 } }, segmentRows.map((segment, index) => {
                        const progress = ease(frame, [22 + index * 7, 54 + index * 7], [0, 1]);
                        const maxValue = Math.max(1, ...segmentRows.map((row) => Math.abs(row.value)));
                        const isActive = runtimeContractMatches(animation, segment.label);
                        return (React.createElement("div", { key: segment.label, style: { opacity: runtimeContractOpacity(animation, isActive) } },
                            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 } },
                                React.createElement("span", { "data-dm-text-editable": true, style: { fontSize: 16, fontWeight: 780, color: isActive ? segment.color : '#e2e8f0' } }, truncate(segment.label, 18)),
                                React.createElement("span", { "data-dm-text-editable": true, style: { fontSize: 16, fontWeight: 840, color: segment.color } }, segment.displayValue || formatCompact(segment.value, segment.label))),
                            React.createElement("div", { style: { height: 13, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' } },
                                React.createElement("div", { style: {
                                        width: `${(Math.abs(segment.value) / maxValue) * 100 * progress}%`,
                                        height: '100%',
                                        borderRadius: 999,
                                        background: segment.color,
                                        boxShadow: `0 3px 14px ${segment.color}55`,
                                    } }))));
                    })))))));
};
