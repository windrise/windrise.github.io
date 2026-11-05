// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { reveal, sceneFont } from '../../src/sceneTiming.js';
import { checkedText, numeric, validateSeries } from '../../src/editorialStory.js';
import { heldMediaFrame } from '../character-perspective-board/timing.js';
export const PresenterDataTakeover = p => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    validateSeries(p.points, p.domain, p.focusIndex);
    checkedText(p.title, 28);
    checkedText(p.question, 44);
    checkedText(p.takeaway, 44);
    const handoff = reveal(t, 1.8, 1.2);
    const chart = reveal(t, 2.7, .8);
    const focus = reveal(t, 7.2);
    const y = (value) => 390 - (value - p.domain[0]) / (p.domain[1] - p.domain[0]) * 340;
    const zero = y(0);
    const step = 1170 / p.points.length;
    return React.createElement(AbsoluteFill, { style: { background: '#12263a', color: '#eef2ed', fontFamily: sceneFont, overflow: 'hidden' } },
        React.createElement(AbsoluteFill, { style: { background: 'radial-gradient(ellipse at 25% 45%,#2e5466,transparent 65%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 72, top: 46, fontSize: 20, color: '#92bfc4', letterSpacing: 2 } }, "DATAMAGIC / \u4E3B\u753B\u9762\u4EA4\u63A5"),
        React.createElement("section", { style: { position: 'absolute', left: 396, top: 134, right: 72, height: 682, background: '#faf7ed', color: '#1e3745', borderRadius: 24, padding: '32px 38px', boxSizing: 'border-box', opacity: chart, transform: `translateY(${(1 - chart) * 22}px)` } },
            React.createElement("div", { style: { fontSize: 18, color: '#5b858d' } }, "\u4ECE\u4E3B\u6301\u4EBA\u8BB2\u8FF0\uFF0C\u5207\u5165\u53EF\u6838\u5BF9\u7684\u6570\u636E"),
            React.createElement("h1", { style: { fontSize: 43, margin: '14px 0 10px', lineHeight: 1.25 } }, p.title),
            React.createElement("div", { style: { fontSize: 22, color: '#5d737a' } },
                p.metricLabel,
                " \u00B7 \u5355\u4F4D\uFF1A",
                p.unit),
            React.createElement("svg", { width: "1250", height: "432", viewBox: "0 0 1250 432", style: { marginTop: 16, overflow: 'visible' } },
                [p.domain[0], 0, p.domain[1]].map(value => React.createElement("g", { key: value },
                    React.createElement("line", { x1: "70", x2: "1240", y1: y(value), y2: y(value), stroke: value === 0 ? '#75858b' : '#d8dfd7', strokeWidth: value === 0 ? 2 : 1 }),
                    React.createElement("text", { x: "50", y: y(value) + 7, textAnchor: "end", fill: "#6c7a7c", fontSize: "19" }, numeric(value)))),
                p.points.map((point, i) => {
                    const progress = reveal(t, 3.2 + i * .42, .6);
                    const end = y(point.value * progress);
                    const active = i === p.focusIndex;
                    return React.createElement("g", { key: i, opacity: active ? 1 : 1 - focus * .32 },
                        React.createElement("rect", { x: 70 + i * step + step * .22, y: Math.min(zero, end), width: step * .56, height: Math.abs(end - zero), rx: "4", fill: point.value >= 0 ? '#247d95' : '#cc8058' }),
                        React.createElement("text", { x: 70 + i * step + step * .5, y: point.value >= 0 ? end - 13 : end + 28, textAnchor: "middle", fill: "#244451", fontSize: "26", fontWeight: "700", opacity: progress }, numeric(point.value)),
                        React.createElement("text", { x: 70 + i * step + step * .5, y: "427", textAnchor: "middle", fill: "#47616b", fontSize: "21" }, point.label));
                }))),
        React.createElement("div", { style: { position: 'absolute', left: 72 + (210 - 72) * (1 - handoff), top: 150, width: 620 + (242 - 620) * handoff, height: 640 + (242 - 640) * handoff, borderRadius: 24 + 110 * handoff, overflow: 'hidden', border: '4px solid #a5ced0', boxShadow: '0 22px 70px #0005' } }, p.presenter.type === 'image' ? React.createElement(Img, { src: staticFile(p.presenter.src), style: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' } }) : React.createElement(Freeze, { frame: heldMediaFrame(frame, fps, Number(p.presenter.durationSeconds)) },
            React.createElement(OffthreadVideo, { muted: true, src: staticFile(p.presenter.src), style: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' } }))),
        React.createElement("div", { style: { position: 'absolute', left: 72, top: 432, width: 242, fontSize: 22, lineHeight: 1.5, color: '#b9d5d2', opacity: chart } },
            p.presenter.label,
            React.createElement("div", { style: { fontSize: 20, color: '#94b7bb', marginTop: 14 } },
                "\u5148\u770B\u5168\u8C8C",
                React.createElement("br", null),
                "\u518D\u770B\u5173\u952E\u53D8\u5316")),
        React.createElement("div", { style: { position: 'absolute', left: 950, top: 280, width: 800, fontSize: 44, lineHeight: 1.5, fontWeight: 700, textWrap: 'balance', opacity: 1 - handoff } }, p.question),
        React.createElement("div", { style: { position: 'absolute', left: 72, right: 72, top: 860, padding: '22px 28px', borderRadius: 12, background: t >= 9 ? '#cbe2d5' : '#ffffff10', color: t >= 9 ? '#24443e' : '#d7e9e4', fontSize: 29, lineHeight: 1.45 } }, t >= 9 ? p.takeaway : `下一步：用${p.metricLabel}核对 ${p.points.length} 个时间点。`),
        React.createElement("footer", { style: { position: 'absolute', left: 72, right: 72, bottom: 34, fontSize: 17, color: '#89a6b2' } }, p.source));
};
