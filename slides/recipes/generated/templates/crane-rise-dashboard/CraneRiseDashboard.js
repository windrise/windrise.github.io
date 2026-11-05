// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { EntityIcon } from '../../src/entityVisuals.js';
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import { calculateChartCamera } from '../../src/camera/chartCamera.js';
const font = 'Inter, "Noto Sans SC", sans-serif';
export const CraneRiseDashboard = p => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const max = Math.max(...p.values);
    const focus = Math.max(0, p.categories.indexOf(p.focusLabel));
    const camera = calculateChartCamera({ profile: 'crane_rise_reveal', frame, fps, durationInFrames, canvasWidth: 1920, canvasHeight: 1080, focusX: 520 + focus * 170, focusY: 700 - p.values[focus] / max * 390 });
    const reveal = interpolate(frame, [0, fps * .9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const context = interpolate(frame, [fps * 2.5, fps * 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return React.createElement(AbsoluteFill, { style: { background: '#eef1ed', fontFamily: font, color: '#13221f', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: -80, background: 'radial-gradient(circle at 24% 26%,#d9eee7 0,transparent 34%),linear-gradient(135deg,#f7f3e9,#e9efec)' } }),
        React.createElement("div", { style: { position: 'absolute', inset: 0, transformOrigin: `${camera.origin.x}px ${camera.origin.y}px`, transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})` } },
            React.createElement("header", { style: { position: 'absolute', left: 110, top: 75, opacity: context } },
                React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: p.accentColor, letterSpacing: 3 } }, "FROM DETAIL TO SYSTEM"),
                React.createElement("h1", { style: { fontSize: 56, margin: '14px 0 8px' } }, p.title),
                React.createElement("div", { style: { fontSize: 24, color: '#60716d' } }, p.subtitle)),
            React.createElement("section", { style: { position: 'absolute', left: 100, top: 260, width: 1260, height: 650, background: 'rgba(255,255,255,.88)', boxShadow: '0 28px 80px rgba(29,52,45,.13)', borderRadius: 28, padding: '60px 62px' } },
                React.createElement("div", { style: { display: 'flex', alignItems: 'end', gap: 38, height: 420, borderBottom: '2px solid #cbd6d1' } }, p.values.map((v, i) => React.createElement("div", { key: p.categories[i], style: { width: 128, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', gap: 15 } },
                    React.createElement("strong", { style: { fontSize: 25, color: i === focus ? p.accentColor : '#65736f', opacity: reveal } },
                        v,
                        p.unit),
                    React.createElement("div", { style: { width: 92, height: `${Math.max(8, v / max * 350 * reveal)}px`, borderRadius: '15px 15px 2px 2px', background: i === focus ? `linear-gradient(#79dcc3,${p.accentColor})` : '#c8d2ce' } }),
                    React.createElement("span", { style: { fontSize: 19, fontWeight: i === focus ? 800 : 500, display: 'flex', alignItems: 'center', gap: 6 } },
                        React.createElement(EntityIcon, { src: p.categoryIcons?.[p.categories[i]], size: 28 }),
                        p.categories[i])))),
                React.createElement("div", { style: { marginTop: 38, display: 'flex', justifyContent: 'space-between', color: '#71807b' } },
                    React.createElement("span", null,
                        "\u6765\u6E90\uFF1A",
                        p.source),
                    React.createElement("span", null, "\u955C\u5934\u5148\u9501\u5B9A\u5173\u952E\u67F1\uFF0C\u518D\u62C9\u5347\u63ED\u793A\u5B8C\u6574\u6BD4\u8F83\u7ED3\u6784"))),
            React.createElement("aside", { style: { position: 'absolute', right: 100, top: 310, width: 360, padding: '34px', background: '#132a26', color: '#fff', borderRadius: 24, opacity: context, transform: `translateX(${(1 - context) * 50}px)` } },
                React.createElement("div", { style: { color: '#86dec8', fontSize: 18 } }, "\u5173\u952E\u53D1\u73B0"),
                React.createElement("div", { style: { fontSize: 68, fontWeight: 800, margin: '12px 0' } },
                    p.focusValue,
                    p.unit),
                React.createElement("div", { style: { fontSize: 25, lineHeight: 1.5 } },
                    p.focusLabel,
                    "\u6210\u4E3A\u7ED3\u6784\u63ED\u793A\u7684\u89C6\u89C9\u951A\u70B9"))));
};
