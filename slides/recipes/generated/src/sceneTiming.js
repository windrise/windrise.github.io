// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { Easing, interpolate } from '../../runtime/motion-runtime.ts';
export const sceneFont = 'Inter, "Noto Sans SC", sans-serif';
export const reveal = (seconds, start, duration = 0.65) => interpolate(seconds, [start, start + duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export function validateRows(rows, maximum, duration) {
    if (rows.length < 2 || rows.length > 5)
        throw new Error('Use 2 to 5 evidence rows.');
    if (!Number.isFinite(maximum) || maximum <= 0)
        throw new Error('The shared scale must be positive.');
    if (new Set(rows.map(row => row.id)).size !== rows.length)
        throw new Error('Evidence IDs must be unique.');
    for (const row of rows) {
        if (!row.label || row.label.length > 18)
            throw new Error('Labels must contain 1 to 18 characters.');
        if (!Number.isFinite(row.value) || row.value < 0 || row.value > maximum)
            throw new Error('Values must fit the shared non-negative scale.');
        if (!Number.isFinite(row.at) || row.at < 0 || row.at + 0.8 > duration)
            throw new Error('Reveal time must leave room for the animation.');
    }
    const times = rows.map(row => row.at).sort((a, b) => a - b);
    if (times.some((time, index) => index > 0 && time - times[index - 1] < 0.8))
        throw new Error('Reveals must be at least 0.8 seconds apart.');
}
export const activeRow = (rows, seconds) => [...rows].filter(row => seconds >= row.at).sort((a, b) => b.at - a.at)[0];
