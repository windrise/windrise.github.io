// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { geoInterpolate, geoMercator, geoPath } from 'd3-geo';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import world from '../map-route-accumulation/world-110m.json';
import { calculateChartCamera } from '../../src/camera/chartCamera.js';
const font = 'Inter, "Noto Sans SC", sans-serif';
const routePath = (projection, from, to) => {
    const interpolateGeo = geoInterpolate(from, to);
    const coordinates = Array.from({ length: 32 }, (_, i) => interpolateGeo(i / 31));
    return geoPath(projection)({ type: 'LineString', coordinates }) || '';
};
export const ParallaxMapGlide = p => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const camera = calculateChartCamera({ profile: 'parallax_data_glide', frame, fps, durationInFrames, canvasWidth: 1920, canvasHeight: 1080, focusX: 1210, focusY: 520 });
    const projection = geoMercator().center([105, 35]).scale(1080).translate([1190, 535]);
    const path = geoPath(projection);
    const origin = p.regions[0];
    const lineReveal = interpolate(frame, [fps * .8, fps * 4.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
    return React.createElement(AbsoluteFill, { style: { background: '#07131f', fontFamily: font, color: '#fff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: -100, transform: `translate(${camera.x * .12}px,${camera.y * .12}px)`, background: 'radial-gradient(circle at 68% 43%,rgba(26,149,156,.24),transparent 36%),radial-gradient(circle at 18% 18%,rgba(46,69,137,.22),transparent 31%),#07131f' } }),
        React.createElement("div", { style: { position: 'absolute', inset: -80, transform: `translate(${camera.x * .22}px,${camera.y * .22}px)`, opacity: .45, backgroundImage: 'linear-gradient(rgba(106,190,200,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(106,190,200,.06) 1px,transparent 1px)', backgroundSize: '72px 72px' } }),
        React.createElement("svg", { width: "1920", height: "1080", style: { position: 'absolute', inset: 0, transform: `translate(${camera.x * .48}px,${camera.y * .48}px) scale(${1 + (camera.scale - 1) * .42})`, transformOrigin: '1190px 535px' } },
            React.createElement("g", null, world.features.map((feature) => React.createElement("path", { key: feature.properties.NE_ID, d: path(feature) || undefined, fill: "#112c39", stroke: "#37606a", strokeWidth: "1.1", opacity: ".92" }))),
            p.regions.slice(1).map((region, i) => React.createElement("path", { key: region.name, d: routePath(projection, origin.coordinate, region.coordinate), fill: "none", stroke: i % 2 ? p.accentColor : '#5da7ff', strokeWidth: "4", opacity: .48, pathLength: 1, strokeDasharray: `${lineReveal} 1`, strokeLinecap: "round" }))),
        React.createElement("div", { style: { position: 'absolute', inset: 0, transform: `translate(${camera.x * .72}px,${camera.y * .72}px) scale(${1 + (camera.scale - 1) * .62})`, transformOrigin: '1190px 535px' } }, p.regions.map((r, i) => { const point = projection(r.coordinate); const enter = interpolate(frame, [fps * (.45 + i * .3), fps * (1.05 + i * .3)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }); return React.createElement("div", { key: r.name, style: { position: 'absolute', left: point[0], top: point[1], opacity: enter, transform: `translate(-50%,-50%) scale(${.78 + .22 * enter})` } },
            React.createElement("div", { style: { width: i === 0 ? 24 : 18, height: i === 0 ? 24 : 18, borderRadius: '50%', background: i === 0 ? '#fff' : p.accentColor, border: `5px solid ${i === 0 ? p.accentColor : '#d9fffa'}`, boxShadow: `0 0 0 ${8 + 8 * enter}px rgba(53,212,192,.13),0 0 28px ${p.accentColor}` } }),
            React.createElement("div", { style: { marginTop: 12, marginLeft: 14, padding: '10px 14px', background: 'rgba(5,20,30,.92)', borderLeft: `3px solid ${p.accentColor}`, minWidth: 118, boxShadow: '0 12px 30px rgba(0,0,0,.28)' } },
                React.createElement("b", { style: { fontSize: 18 } }, r.name),
                React.createElement("div", { style: { fontSize: 27, color: '#79eadb', fontWeight: 800 } },
                    r.value,
                    p.unit))); })),
        React.createElement("header", { style: { position: 'absolute', left: 82, top: 78, width: 520, padding: '26px 28px', background: 'rgba(5,17,28,.76)', borderLeft: `5px solid ${p.accentColor}`, backdropFilter: 'blur(10px)' } },
            React.createElement("div", { style: { color: '#72e6d6', fontWeight: 700, letterSpacing: 3, fontSize: 16 } }, "MULTIPLANE GEO NETWORK"),
            React.createElement("h1", { style: { fontSize: 52, lineHeight: 1.08, margin: '15px 0' } }, p.title),
            React.createElement("p", { style: { fontSize: 22, color: '#a5bac5', lineHeight: 1.52, margin: 0 } }, p.subtitle)),
        React.createElement("aside", { style: { position: 'absolute', left: 82, bottom: 105, width: 455, padding: '23px 27px', background: 'rgba(9,25,36,.88)', border: '1px solid #274a55' } },
            React.createElement("div", { style: { fontSize: 15, color: '#7e9aa6' } }, "\u7F51\u7EDC\u4E2D\u5FC3"),
            React.createElement("div", { style: { display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 7 } },
                React.createElement("strong", { style: { fontSize: 37 } }, origin.name),
                React.createElement("span", { style: { fontSize: 26, color: p.accentColor, fontWeight: 800 } },
                    origin.value,
                    p.unit)),
            React.createElement("div", { style: { marginTop: 12, color: '#91a8b2' } }, "\u8DEF\u7EBF\u3001\u8282\u70B9\u3001\u6570\u503C\u4E0E\u5E95\u56FE\u5206\u5C42\u8FD0\u52A8\uFF0C\u6570\u636E\u6807\u7B7E\u4FDD\u6301\u524D\u666F\u6E05\u6670\u3002")),
        React.createElement("footer", { style: { position: 'absolute', left: 82, right: 82, bottom: 40, paddingTop: 15, borderTop: '1px solid #29414c', display: 'flex', justifyContent: 'space-between', color: '#718994', fontSize: 14 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                p.source),
            React.createElement("span", null, "\u5730\u7406\u8FB9\u754C\uFF1ANatural Earth 1:110m \u00B7 \u8DEF\u5F84\u91C7\u7528\u5927\u5706\u63D2\u503C")));
};
