// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { reveal, sceneFont } from '../../src/sceneTiming.js';
import { checkedText, contributionSteps, numeric } from '../../src/editorialStory.js';
export const ContrastContributionStory = p => {
    const t = useCurrentFrame() / useVideoConfig().fps;
    const result = contributionSteps(p.baseline, p.contributions, p.maximum);
    checkedText(p.title, 28);
    checkedText(p.question, 44);
    checkedText(p.takeaway, 44);
    if (!Number.isFinite(p.hook.before) || p.hook.before <= 0 || !Number.isFinite(p.hook.after) || p.hook.after < 0)
        throw new Error('Hook values must be non-negative with a positive baseline.');
    const hookRate = (p.hook.after - p.hook.before) / p.hook.before * 100;
    const hookValue = `${hookRate > 0 ? '+' : ''}${numeric(hookRate)}%`;
    const chart = reveal(t, 2, .8);
    const closing = reveal(t, 9.2, .6);
    const width = 1360 / (result.steps.length + 2);
    const y = (v) => 400 - v / p.maximum * 320;
    return React.createElement(AbsoluteFill, { style: { background: '#f4eedf', color: '#252b39', fontFamily: sceneFont, overflow: 'hidden' } },
        React.createElement("header", { style: { position: 'absolute', left: 76, right: 76, top: 48, display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#7b7770', letterSpacing: 2 } },
            React.createElement("span", null, "DATAMAGIC / \u53CD\u5DEE\u4E0E\u89E3\u91CA"),
            React.createElement("span", null, "\u7528\u540C\u4E00\u8D26\u672C\u6838\u5BF9\u53D8\u5316")),
        React.createElement("div", { style: { position: 'absolute', left: 96, top: 195, opacity: 1 - chart } },
            React.createElement("div", { style: { fontSize: 30, color: '#777a6c' } }, p.hookLabel),
            React.createElement("strong", { style: { display: 'block', fontSize: 174, lineHeight: 1.15, color: '#226f65', marginTop: 16 } }, hookValue),
            React.createElement("div", { style: { fontSize: 48, marginTop: 20, maxWidth: 1450, lineHeight: 1.5 } }, p.question)),
        React.createElement("section", { style: { position: 'absolute', left: 76, right: 76, top: 134, height: 674, padding: '32px 44px', boxSizing: 'border-box', background: '#fffdf6', borderRadius: 26, border: '1px solid #dbd4c4', boxShadow: '0 24px 60px #65543114', opacity: chart, transform: `translateY(${(1 - chart) * 24}px)` } },
            React.createElement("h1", { style: { margin: '0 0 13px', fontSize: 45, lineHeight: 1.3 } }, p.title),
            React.createElement("div", { style: { fontSize: 23, color: '#777c73' } },
                "\u5171\u540C\u5C3A\u5EA6 0\u2013",
                p.maximum,
                p.unit,
                " \u00B7 \u5404\u6BB5\u53D8\u5316\u53EF\u76F8\u52A0\u6838\u5BF9"),
            React.createElement("svg", { width: "1620", height: "485", viewBox: "0 0 1620 485", style: { marginTop: 8, overflow: 'visible' } },
                [0, p.maximum / 2, p.maximum].map(v => React.createElement("g", { key: v },
                    React.createElement("line", { x1: "70", x2: "1550", y1: y(v), y2: y(v), stroke: "#e3e1d4" }),
                    React.createElement("text", { x: "52", y: y(v) + 7, textAnchor: "end", fill: "#898980", fontSize: "20" }, numeric(v)))),
                React.createElement("rect", { x: "110", y: y(p.baseline), width: width * .56, height: 400 - y(p.baseline), fill: "#82969a", rx: "5" }),
                React.createElement("text", { x: 110 + width * .28, y: y(p.baseline) - 17, textAnchor: "middle", fontSize: "30", fontWeight: "700" }, numeric(p.baseline)),
                React.createElement("foreignObject", { x: 110 + width * .28 - 18, y: 416, width: 36, height: 36 },
                    React.createElement(EntityIcon, { src: p.baselineIconSrc, size: 36 })),
                React.createElement("text", { x: 110 + width * .28, y: "470", textAnchor: "middle", fontSize: "23" }, p.baselineLabel),
                result.steps.map((step, i) => {
                    const progress = reveal(t, step.at, .7);
                    const left = 110 + (i + 1) * width;
                    const end = step.start + (step.end - step.start) * progress;
                    return React.createElement("g", { key: i, opacity: progress },
                        React.createElement("line", { x1: left - width * .44, x2: left, y1: y(step.start), y2: y(step.start), stroke: "#b7bdb5", strokeDasharray: "6 5" }),
                        React.createElement("rect", { x: left, y: y(Math.max(step.start, end)), width: width * .56, height: Math.abs(y(step.start) - y(end)), rx: "5", fill: step.value >= 0 ? '#238477' : '#c47553' }),
                        React.createElement("text", { x: left + width * .28, y: y(Math.max(step.start, step.end)) - 17, textAnchor: "middle", fontSize: "30", fontWeight: "700" },
                            step.value > 0 ? '+' : '',
                            numeric(step.value)),
                        React.createElement("foreignObject", { x: left + width * .28 - 18, y: 416, width: 36, height: 36 },
                            React.createElement(EntityIcon, { src: step.iconSrc, size: 36 })),
                        React.createElement("text", { x: left + width * .28, y: "470", textAnchor: "middle", fontSize: "23" }, step.label));
                }),
                React.createElement("g", { opacity: closing },
                    React.createElement("rect", { x: 110 + (result.steps.length + 1) * width, y: y(result.final), width: width * .56, height: 400 - y(result.final), rx: "5", fill: "#334c65" }),
                    React.createElement("text", { x: 110 + (result.steps.length + 1.28) * width, y: y(result.final) - 17, textAnchor: "middle", fontSize: "34", fontWeight: "700" }, numeric(result.final)),
                    React.createElement("foreignObject", { x: 110 + (result.steps.length + 1.28) * width - 18, y: 416, width: 36, height: 36 },
                        React.createElement(EntityIcon, { src: p.finalIconSrc, size: 36 })),
                    React.createElement("text", { x: 110 + (result.steps.length + 1.28) * width, y: "470", textAnchor: "middle", fontSize: "23" }, p.finalLabel)))),
        React.createElement("div", { style: { position: 'absolute', left: 76, right: 76, top: 851, minHeight: 100, padding: '22px 28px', boxSizing: 'border-box', background: t >= 9.2 ? '#d2e2d4' : '#e5dfd1', borderRadius: 14, fontSize: 29, lineHeight: 1.5 } }, t >= 9.2 ? p.takeaway : [...p.contributions].reverse().find(part => t >= part.at)?.caption || p.question),
        React.createElement("footer", { style: { position: 'absolute', bottom: 34, left: 76, right: 76, fontSize: 17, color: '#827f74' } }, p.source));
};
