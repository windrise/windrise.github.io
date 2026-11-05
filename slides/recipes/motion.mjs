export const clamp = n => Math.max(0, Math.min(1, n));
export function rankedFrame(rows, progress) {
  if (!Array.isArray(rows) || rows.length < 2 || rows.length > 5 || rows.some(r => !Number.isFinite(r.value) || r.value < 0)) throw new Error('Use 2–5 finite, nonnegative values');
  const max = Math.max(1, ...rows.map(r => r.value));
  return rows.map((r, i) => {
    const t = clamp(progress * 1.8 - i * .2);
    const eased = 1 - (1 - t) ** 3;
    return { ...r, shown: r.value * eased, width: r.value / max * eased * 100 };
  });
}
export function timelineFrame(points, progress) {
  if (!Array.isArray(points) || points.length < 2 || points.some(p => !Number.isFinite(p.value))) throw new Error('Use at least two finite values');
  const index = clamp(progress) * (points.length - 1);
  const left = Math.floor(index), right = Math.min(left + 1, points.length - 1);
  return { index, value: points[left].value + (points[right].value - points[left].value) * (index - left) };
}
