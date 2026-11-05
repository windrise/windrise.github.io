// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { reveal, sceneFont } from '../../src/sceneTiming.js';
import { checkedText, numeric, tierIndex, validateTiers } from '../../src/editorialStory.js';
export const PersistentTierBoard = p => {
    const t = useCurrentFrame() / useVideoConfig().fps;
    validateTiers(p.tiers, p.items, p.maximum);
    checkedText(p.title, 28);
    checkedText(p.question, 44);
    checkedText(p.takeaway, 44);
    const latest = [...p.items].filter(item => item.before !== item.after && t >= item.at).sort((a, b) => b.at - a.at)[0];
    return React.createElement(AbsoluteFill, { style: { background: '#171e35', color: '#f5f0e8', fontFamily: sceneFont, overflow: 'hidden' } },
        React.createElement(AbsoluteFill, { style: { background: 'radial-gradient(ellipse at 90% 10%,#42445d,transparent 65%)' } }),
        React.createElement("header", { style: { position: 'absolute', left: 76, right: 76, top: 48, fontSize: 19, color: '#b5b4c4', letterSpacing: 2 } }, "DATAMAGIC / \u6301\u7EED\u72B6\u6001\u5206\u5C42\u677F"),
        React.createElement("h1", { style: { position: 'absolute', left: 76, top: 114, fontSize: 46, margin: 0 } }, p.title),
        React.createElement("p", { style: { position: 'absolute', left: 76, top: 176, fontSize: 26, color: '#c8c5cb' } }, p.question),
        React.createElement("div", { style: { position: 'absolute', left: 76, right: 76, top: 275, height: 516 } },
            p.tiers.map((tier, i) => React.createElement("div", { key: i, style: { position: 'absolute', top: i * 172, left: 0, right: 0, height: 150, background: ['#d2e4cb', '#d9e5e8', '#ecdcc8'][i], borderRadius: 18, color: '#293840', display: 'flex', alignItems: 'center', paddingLeft: 28 } },
                React.createElement("div", { style: { width: 280 } },
                    React.createElement("strong", { style: { fontSize: 36 } }, tier.label),
                    React.createElement("div", { style: { fontSize: 19, marginTop: 12 } },
                        i === 2 ? `0 ≤ 值 < ${p.tiers[i - 1].minimum}` : i === 0 ? `值 ≥ ${tier.minimum}` : `${tier.minimum} ≤ 值 < ${p.tiers[i - 1].minimum}`,
                        p.unit)))),
            p.items.map((item, i) => {
                const progress = reveal(t, item.at, .85);
                const before = tierIndex(p.tiers, item.before);
                const after = tierIndex(p.tiers, item.after);
                const moving = item.before !== item.after && t >= item.at && t < item.at + .85;
                return React.createElement("div", { key: item.id, style: { position: 'absolute', left: 355 + i * 265, top: before * 172 + (after - before) * 172 * progress + 19, width: 240, height: 111, padding: '16px 19px', boxSizing: 'border-box', borderRadius: 14, background: '#fffdf8', color: '#253745', boxShadow: moving ? '0 14px 35px #1d314866' : '0 8px 20px #1d31481a', outline: moving ? '3px solid #5271a7' : 'none', zIndex: moving ? 2 : 1 } },
                    React.createElement("strong", { style: { fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 } },
                        React.createElement(EntityIcon, { src: item.iconSrc, size: 30 }),
                        item.label),
                    React.createElement("div", { style: { fontSize: 34, fontWeight: 700, marginTop: 9 } },
                        numeric(progress === 1 ? item.after : item.before),
                        React.createElement("small", { style: { fontSize: 19, marginLeft: 4 } }, p.unit)));
            })),
        React.createElement("div", { style: { position: 'absolute', left: 76, right: 76, top: 835, padding: '22px 28px', borderRadius: 14, background: t >= 9.4 ? '#d5e3d3' : '#ffffff0d', color: t >= 9.4 ? '#273b36' : '#e1dfde', fontSize: 29, lineHeight: 1.5 } }, t >= 9.4 ? p.takeaway : latest ? `${latest.label}：${numeric(latest.before)}${p.unit} → ${numeric(latest.after)}${p.unit}，按同一阈值重新归类。` : p.question),
        React.createElement("footer", { style: { position: 'absolute', left: 76, right: 76, bottom: 34, fontSize: 17, color: '#a4a5b5' } },
            p.metricLabel,
            " \u00B7 ",
            p.source));
};
