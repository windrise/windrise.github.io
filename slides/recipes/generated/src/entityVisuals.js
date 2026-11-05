// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../runtime/vue-runtime.ts';
import { Img, staticFile } from '../../runtime/motion-runtime.ts';
export const entityImageSource = (src) => /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src);
export const EntityIcon = ({ src, size = 48, style }) => src
    ? React.createElement(Img, { src: entityImageSource(src), style: { width: size, height: size, objectFit: 'contain', flexShrink: 0, boxSizing: 'border-box', ...style } })
    : null;
