// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from '../../../runtime/motion-runtime.ts';
import world from './world-110m.json';
import { EntityIcon } from '../../src/entityVisuals.js';
const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const mapBox = [[70, 225], [1435, 895]];
export const ChoroplethRankMap = props => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const intro = spring({ frame, fps, durationInFrames: Math.round(.7 * fps), config: { damping: 180 } });
    const projection = geoNaturalEarth1().fitExtent(mapBox, world);
    const path = geoPath(projection);
    const values = new Map(props.regions.map(item => [item.code, item]));
    const max = Math.max(...props.regions.map(item => item.value));
    const ordered = [...props.regions].sort((a, b) => b.value - a.value);
    return React.createElement(AbsoluteFill, { style: { backgroundColor: '#f5f7fa', color: '#131b24', fontFamily: props.fontFamily ?? fontFamily, overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef4f8 52%, #f7f9fb 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 76, top: 58, right: 76, opacity: intro } },
            React.createElement("div", { style: { color: props.accentColor, fontSize: 18, fontWeight: 700 } }, "GEOGRAPHIC DISTRIBUTION"),
            React.createElement("h1", { style: { margin: '14px 0 8px', fontSize: 58, lineHeight: 1.1, letterSpacing: 0 } }, props.title),
            React.createElement("p", { style: { margin: 0, color: '#687686', fontSize: 22 } }, props.subtitle)),
        React.createElement("svg", { width: "1920", height: "1080", style: { position: 'absolute', inset: 0 } },
            React.createElement("defs", null,
                React.createElement("filter", { id: "map-shadow" },
                    React.createElement("feDropShadow", { dx: "0", dy: "10", stdDeviation: "14", floodColor: "#334155", floodOpacity: ".13" }))),
            React.createElement("g", { filter: "url(#map-shadow)" }, world.features.map((feature) => {
                const code = String(feature.properties.ADM0_A3 || feature.properties.ISO_A3 || '');
                const datum = values.get(code);
                const rankIndex = datum ? ordered.findIndex(item => item.code === code) : -1;
                const regionIn = datum ? spring({ frame: frame - Math.round((.75 + rankIndex * .18) * fps), fps, durationInFrames: Math.round(.7 * fps), config: { damping: 170 } }) : 0;
                const intensity = datum ? .25 + .75 * datum.value / max : 0;
                return React.createElement("path", { key: feature.properties.NE_ID || code, d: path(feature) || undefined, fill: datum ? props.accentColor : '#dfe6ec', fillOpacity: datum ? intensity * regionIn : .82, stroke: "#fff", strokeWidth: datum ? 1.8 : .9 });
            })),
            props.regions.map((datum, index) => {
                const feature = world.features.find((item) => item.properties.ADM0_A3 === datum.code);
                if (!feature)
                    return null;
                const [x, y] = path.centroid(feature);
                const markIn = spring({ frame: frame - Math.round((1.1 + index * .18) * fps), fps, durationInFrames: Math.round(.55 * fps), config: { damping: 160 } });
                return React.createElement("g", { key: datum.code, opacity: markIn },
                    React.createElement("circle", { cx: x, cy: y, r: 8 + markIn * 5, fill: "#fff", stroke: props.accentColor, strokeWidth: "5" }),
                    React.createElement("circle", { cx: x, cy: y, r: 24, fill: "none", stroke: props.accentColor, strokeWidth: "2", opacity: .34 }));
            })),
        React.createElement("aside", { style: { position: 'absolute', right: 70, top: 250, width: 380, padding: '28px 28px 26px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,.95)', border: '1px solid #dce3ea', boxShadow: '0 22px 60px rgba(36,55,75,.14)' } },
            React.createElement("div", { style: { fontSize: 17, color: '#738090' } }, "\u533A\u57DF\u6392\u540D"),
            React.createElement("div", { style: { marginTop: 22, display: 'grid', gap: 12 } }, ordered.map((item, index) => {
                const itemIn = spring({ frame: frame - Math.round((1.15 + index * .16) * fps), fps, durationInFrames: Math.round(.55 * fps), config: { damping: 170 } });
                return React.createElement("div", { key: item.code, style: { display: 'grid', gridTemplateColumns: '34px 1fr auto', alignItems: 'center', gap: 10, padding: '13px 0', borderBottom: '1px solid #edf0f3', opacity: itemIn, transform: `translateX(${(1 - itemIn) * 18}px)` } },
                    React.createElement("span", { style: { fontSize: 15, color: '#8b96a2' } },
                        "#",
                        index + 1),
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 } },
                        React.createElement(EntityIcon, { src: item.iconSrc, size: 34 }),
                        React.createElement("strong", { style: { fontSize: 21 } }, item.label)),
                    React.createElement("span", { style: { fontSize: 24, fontWeight: 700, color: index === 0 ? props.accentColor : '#364553' } },
                        item.value,
                        props.unit));
            })),
            React.createElement("div", { style: { marginTop: 23, padding: '18px 19px', borderLeft: `5px solid ${props.accentColor}`, backgroundColor: '#f5f8fb', fontSize: 19, lineHeight: 1.48 } }, props.takeaway)),
        React.createElement("div", { style: { position: 'absolute', left: 76, right: 76, bottom: 39, paddingTop: 16, borderTop: '1px solid #ccd6df', display: 'flex', justifyContent: 'space-between', color: '#758392', fontSize: 15 } },
            React.createElement("span", null,
                "\u6765\u6E90\uFF1A",
                props.source),
            React.createElement("span", null, "\u8FB9\u754C\u5E95\u56FE\uFF1ANatural Earth 1:110m \u00B7 \u6570\u503C\u5C42\u72EC\u7ACB\u53EF\u7F16\u8F91")));
};
