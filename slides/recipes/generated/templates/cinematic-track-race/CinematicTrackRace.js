// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { createRaceFrame, formatRaceValue } from '../bar-chart-race/model.js';
const font = 'Inter, "Noto Sans SC", sans-serif';
export const CinematicTrackRace = props => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const hold = Math.round(1.55 * fps);
    const motionFrame = Math.min(frame, durationInFrames - hold);
    const progress = interpolate(motionFrame, [22, durationInFrames - hold - 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear });
    const state = createRaceFrame(props, progress);
    const intro = interpolate(motionFrame, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const crashCenter = Math.round(durationInFrames * .53);
    const crash = interpolate(motionFrame, [crashCenter - 10, crashCenter, crashCenter + 14], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
    const settle = interpolate(motionFrame, [durationInFrames - hold - 30, durationInFrames - hold], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const focus = props.entities.find(entity => entity.id === props.story.focusEntityId) || state.leader;
    const focusRow = state.rows.find(row => row.id === focus.id) || state.leader;
    const rowHeight = 92, trackLeft = 402, trackWidth = 1050;
    return React.createElement(AbsoluteFill, { style: { background: '#071014', color: '#f4f7f5', fontFamily: font, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 45%,rgba(36,211,171,.16),transparent 32%),linear-gradient(120deg,#071014,#0c1b21 55%,#071014)' } }),
        React.createElement("div", { style: { position: 'absolute', inset: 0, opacity: .22, background: 'linear-gradient(90deg,transparent 49.8%,rgba(255,255,255,.08) 50%,transparent 50.2%)', backgroundSize: '72px 100%' } }),
        React.createElement("header", { style: { position: 'absolute', left: 72, right: 72, top: 50, display: 'flex', justifyContent: 'space-between', opacity: intro } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 14, fontWeight: 800, letterSpacing: 3, color: '#38d6b4' } }, "CINEMATIC RACE \u00B7 LIVE TRACK"),
                React.createElement("h1", { style: { margin: '12px 0 6px', fontSize: 53 } }, props.title),
                React.createElement("p", { style: { margin: 0, color: '#91a5aa', fontSize: 20 } }, props.subtitle)),
            React.createElement("div", { style: { width: 430, padding: '15px 18px', border: '1px solid #244047', borderRadius: 12, background: 'rgba(8,22,27,.75)', fontSize: 18, lineHeight: 1.5 } }, props.story.hook)),
        React.createElement("div", { style: { position: 'absolute', left: 72, right: 72, top: 204, height: 1, background: '#20373d' } }),
        React.createElement("div", { style: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', transform: `translateX(${crash * 28}px) scale(${1 + crash * .025})`, transformOrigin: '56% 51%' } }, state.rows.map(row => {
            const y = 248 + row.rank * rowHeight;
            const width = Math.max(5, (row.value / state.maxValue) * trackWidth);
            const leader = row.displayRank === 0;
            const isFocus = row.id === focus.id;
            return React.createElement("div", { key: row.id, style: { position: 'absolute', left: 0, top: 0, width: '100%', height: 78, transform: `translateY(${y}px)`, opacity: row.opacity * intro } },
                React.createElement("div", { style: { position: 'absolute', left: 72, top: 13, width: 46, height: 46, borderRadius: '50%', border: `1px solid ${leader ? '#38d6b4' : '#31515a'}`, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 800, color: leader ? '#38d6b4' : '#789097' } }, row.displayRank + 1),
                React.createElement("div", { style: { position: 'absolute', left: 137, top: 8, width: 235, padding: '7px 10px', background: '#071014', opacity: row.contentOpacity, display: 'flex', alignItems: 'center', gap: 10 } },
                    React.createElement(EntityIcon, { src: row.iconSrc, size: 40 }),
                    React.createElement("div", null,
                        React.createElement("strong", { style: { display: 'block', fontSize: 22, color: leader ? '#fff' : '#c7d1d2' } }, row.label),
                        React.createElement("small", { style: { display: 'block', marginTop: 4, color: row.rankDelta > 0 ? '#38d6b4' : row.rankDelta < 0 ? '#ff765f' : '#71868b', fontSize: 12 } }, row.rankDelta > 0 ? `▲ +${row.rankDelta}` : row.rankDelta < 0 ? `▼ ${row.rankDelta}` : '— HOLD'))),
                React.createElement("div", { style: { position: 'absolute', left: trackLeft, top: 24, width: trackWidth, height: 19, borderRadius: 20, background: '#15292f', boxShadow: 'inset 0 0 0 1px #203940' } }),
                React.createElement("div", { style: { position: 'absolute', left: trackLeft, top: 24, width, height: 19, borderRadius: 20, background: `linear-gradient(90deg,${row.color}55,${row.color})`, boxShadow: leader ? `0 0 24px ${row.color}88` : 'none' } },
                    React.createElement("span", { style: { position: 'absolute', right: -8, top: -7, width: 32, height: 32, borderRadius: '50%', background: row.color, boxShadow: `0 0 ${leader ? 32 : 15}px ${row.color}` } })),
                React.createElement("div", { style: { position: 'absolute', left: Math.min(trackLeft + width + 35, 1454), top: 10, padding: '5px 8px', background: '#071014', fontSize: 22, fontWeight: 800, opacity: row.contentOpacity, whiteSpace: 'nowrap' } }, formatRaceValue(row.value, props.locale, props.decimals)),
                isFocus && crash > .05 ? React.createElement("div", { style: { position: 'absolute', left: Math.min(trackLeft + width - 78, 1330), top: -31, padding: '5px 9px', borderRadius: 5, background: '#ff765f', color: '#071014', fontSize: 11, fontWeight: 900, opacity: crash } }, "\u5173\u952E\u8D85\u8D8A") : null);
        })),
        React.createElement("aside", { style: { position: 'absolute', right: 72, top: 264, width: 330, padding: '22px', border: '1px solid #26434b', borderRadius: 16, background: 'rgba(7,18,22,.88)' } },
            React.createElement("small", { style: { fontSize: 11, color: '#779098', letterSpacing: 2 } },
                "LEADER / ",
                state.time),
            React.createElement("strong", { style: { display: 'block', marginTop: 10, fontSize: 30, color: state.leader.color } },
                React.createElement("span", { style: { display: 'flex', alignItems: 'center', gap: 12 } },
                    React.createElement(EntityIcon, { src: state.leader.iconSrc, size: 38 }),
                    state.leader.label)),
            React.createElement("div", { style: { marginTop: 5, fontSize: 50, fontWeight: 800 } },
                formatRaceValue(state.leader.value, props.locale, props.decimals),
                React.createElement("span", { style: { marginLeft: 7, fontSize: 14, color: '#779098' } }, props.unit)),
            React.createElement("div", { style: { marginTop: 20, height: 4, background: '#193037' } },
                React.createElement("div", { style: { width: `${state.progress * 100}%`, height: '100%', background: '#38d6b4', boxShadow: '0 0 12px #38d6b4' } }))),
        React.createElement("div", { style: { position: 'absolute', right: 72, top: 552, width: 330, padding: '20px 22px', borderLeft: '3px solid #ff765f', background: 'rgba(16,34,39,.88)', fontSize: 16, lineHeight: 1.55 } },
            React.createElement("small", { style: { display: 'block', marginBottom: 8, color: '#ff8a76', fontSize: 10, fontWeight: 900 } }, "TURNING POINT"),
            props.story.turningPoint),
        React.createElement("div", { style: { position: 'absolute', left: 270, right: 270, bottom: 68, padding: '19px 25px', border: '1px solid #38d6b4', borderRadius: 12, background: 'rgba(14,40,43,.95)', boxShadow: '0 0 45px rgba(56,214,180,.13)', fontSize: 21, fontWeight: 750, textAlign: 'center', opacity: settle, transform: `translateY(${(1 - settle) * 12}px)` } },
            React.createElement("span", { style: { color: focus.color } },
                focus.label,
                " ",
                formatRaceValue(focusRow.value, props.locale, props.decimals)),
            " \u00B7 ",
            props.story.takeaway),
        React.createElement("footer", { style: { position: 'absolute', left: 72, right: 72, bottom: 28, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6f858b' } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null, "\u5355\u6B21\u51B2\u51FB\u805A\u7126 \u00B7 \u6392\u540D\u4E0E\u6570\u503C\u9010\u5E27\u8BA1\u7B97")));
};
