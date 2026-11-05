// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { validateRows } from '../../src/sceneTiming.js';
export function validateStory(rows, maximum, duration, conclusionAt, tilt) {
    validateRows(rows, maximum, duration);
    if (rows.length > 3)
        throw new Error('Use 2 or 3 rows.');
    if (!Number.isFinite(tilt) || Math.abs(tilt) > 10)
        throw new Error('Tilt must be within -10 to 10 degrees.');
    if (Math.min(...rows.map(row => row.at)) < 2)
        throw new Error('Reserve 2 seconds for the question.');
    if (!Number.isFinite(conclusionAt) || conclusionAt < Math.max(...rows.map(row => row.at)) + 1.2 || conclusionAt > duration - 2)
        throw new Error('Leave time for evidence and 2 seconds for the conclusion.');
}
export const heldMediaFrame = (frame, fps, seconds) => {
    if (!(Number.isFinite(seconds) && seconds > 0))
        throw new Error('Presenter duration must be positive.');
    return Math.min(frame, Math.max(0, Math.floor(seconds * fps) - 1));
};
