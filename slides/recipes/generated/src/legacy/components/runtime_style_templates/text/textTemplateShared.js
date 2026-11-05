// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
// Shared helpers for the runtime text templates. Split out so each template can
// live in its own file (one-file-per-template) and stay independently ejectable.
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from '../../../../../../runtime/motion-runtime.ts';
export const ease = (frame, input, output) => interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
});
export const cleanText = (...values) => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim())
            return value.trim();
        if (typeof value === 'number' && Number.isFinite(value))
            return String(value);
    }
    return '';
};
export const textList = (value) => {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => {
        if (typeof item === 'string' || typeof item === 'number')
            return cleanText(item);
        if (item && typeof item === 'object') {
            const row = item;
            return cleanText(row.text, row.title, row.label, row.name, row.subtitle, row.description);
        }
        return '';
    })
        .filter(Boolean)
        .slice(0, 4);
};
export const metricItems = (content) => {
    const candidates = [
        ...(Array.isArray(content?.metrics) ? content.metrics : []),
        ...(Array.isArray(content?.cards) ? content.cards : []),
        ...(Array.isArray(content?.data) ? content.data : []),
    ];
    const items = [];
    for (const item of candidates) {
        if (!item || typeof item !== 'object')
            continue;
        const row = item;
        const label = cleanText(row.label, row.title, row.name, row.category, row.metric);
        let value = cleanText(row.display_value, row.displayValue, row.value, row.raw_value);
        if (!value) {
            const numeric = Object.entries(row).find(([, v]) => typeof v === 'number' && Number.isFinite(v));
            value = numeric ? cleanText(numeric[1]) : '';
        }
        if (!label || !value)
            continue;
        items.push({
            label,
            value,
            accent: cleanText(row.color, row.accent),
        });
        if (items.length >= 4)
            break;
    }
    return items;
};
export const extractNumber = (...values) => {
    const text = values.map((value) => cleanText(value)).join(' ');
    const match = text.match(/[+-]?\$?\d[\d,]*(?:\.\d+)?%?[KMBkmb]?/);
    return match?.[0] ?? '';
};
export const payloadFields = (content) => content?.template_payload && typeof content.template_payload === 'object' ? content.template_payload : {};
export const contentFields = (sceneContent, scene) => {
    const content = sceneContent ?? scene?.content ?? {};
    const payload = payloadFields(content);
    const narrations = Array.isArray(scene?.narration) ? scene.narration : [];
    const narrationText = cleanText(narrations.find((narr) => cleanText(narr?.text))?.text);
    const title = cleanText(payload.title, content.title, content.headline, scene?.title);
    const subtitle = cleanText(payload.subtitle, content.subtitle, content.summary, content.description, content.body, narrationText);
    const kicker = cleanText(payload.kicker, content.kicker, content.label);
    const bullets = textList(payload.bullets).length
        ? textList(payload.bullets)
        : textList(content.bullets).length
            ? textList(content.bullets)
            : textList(payload.takeaways).length
                ? textList(payload.takeaways)
                : textList(content.takeaways).length
                    ? textList(content.takeaways)
                    : textList(payload.steps).length
                        ? textList(payload.steps)
                        : textList(content.steps).length
                            ? textList(content.steps)
                            : subtitle
                                ? subtitle.split(/[.;]\s+/).map((item) => item.trim()).filter(Boolean).slice(0, 3)
                                : [];
    return { content, payload, title, subtitle, kicker, bullets, metrics: metricItems({ ...content, ...payload }) };
};
export const animationFrame = (sceneContent, scene) => {
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const cues = Array.isArray(sceneContent?.narration_cues) ? sceneContent.narration_cues : [];
    if (!cues.length)
        return rawFrame;
    const lastCue = cues[cues.length - 1];
    const endSeconds = Number(lastCue?.end);
    if (!Number.isFinite(endSeconds) || endSeconds <= 0)
        return rawFrame;
    const sceneRange = Array.isArray(scene?.time_range) ? scene.time_range : [];
    const durationSeconds = Math.max(endSeconds, Number(sceneRange[1]) - Number(sceneRange[0]) || endSeconds);
    const targetFrames = Math.max(120, durationSeconds * (fps || 30));
    return rawFrame * (120 / targetFrames);
};
