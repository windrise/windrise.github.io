// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { Easing, interpolate } from '../../../../../runtime/motion-runtime.ts';
export const ease = (frame, input, output) => interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
});
export const softShadow = '0 30px 80px rgba(15,23,42,0.14)';
