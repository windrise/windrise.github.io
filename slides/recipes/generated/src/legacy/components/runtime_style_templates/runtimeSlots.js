// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import runtimeLabelSlotsData from './runtimeLabelSlots.json';
export const DEFAULT_LIGHT_PALETTE = ['#2563eb', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#0891b2'];
export const DEFAULT_DARK_PALETTE = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee'];
export const toNumber = (value, fallback = 0) => {
    if (typeof value === 'number')
        return Number.isFinite(value) ? value : fallback;
    if (typeof value !== 'string')
        return fallback;
    const raw = value.trim();
    if (!raw)
        return fallback;
    const multiplier = /([kmb])$/i.exec(raw);
    const factor = multiplier
        ? multiplier[1].toLowerCase() === 'b'
            ? 1_000_000_000
            : multiplier[1].toLowerCase() === 'm'
                ? 1_000_000
                : 1_000
        : 1;
    const normalized = raw
        .replace(/[,$]/g, '')
        .replace(/%$/, '')
        .replace(/[kmb]$/i, '');
    const n = Number(normalized);
    return Number.isFinite(n) ? n * factor : fallback;
};
export const trimNumber = (value, digits) => {
    const fixed = value.toFixed(digits);
    return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
};
export const formatCompact = (value, metricName = '') => {
    if (typeof value === 'string' && value.trim() && !Number.isFinite(Number(value))) {
        return value.trim();
    }
    const n = toNumber(value, NaN);
    if (!Number.isFinite(n))
        return String(value ?? '');
    const isPercent = /percent|percentage|growth|rate|margin|share|conversion|retention|%/i.test(metricName);
    if (isPercent) {
        const percent = Math.abs(n) <= 1 ? n * 100 : n;
        return `${trimNumber(percent, Math.abs(percent) >= 10 ? 1 : 2)}%`;
    }
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000)
        return `${trimNumber(n / 1_000_000_000, 1)}B`;
    if (abs >= 1_000_000)
        return `${trimNumber(n / 1_000_000, 1)}M`;
    if (abs >= 10_000)
        return `${trimNumber(n / 1_000, 1)}K`;
    if (abs >= 100)
        return trimNumber(n, 0);
    if (abs >= 10)
        return trimNumber(n, 1);
    return trimNumber(n, 2);
};
export const truncate = (value, max = 24) => {
    const text = String(value ?? '').trim();
    return text.length > max ? `${text.slice(0, Math.max(1, max - 1))}...` : text;
};
export const firstString = (...values) => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim())
            return value.trim();
    }
    return '';
};
const ZH_UI_LABEL_FALLBACKS = {
    after: '之后',
    average: '平均',
    background: '背景',
    before: '之前',
    before_after: '前后对比',
    change: '变化',
    cost: '成本 -8%',
    data_briefing: '数据简报',
    dataset_overview: '数据概览',
    delta_vs_target: '目标差值',
    end: '结束',
    entity: '对象',
    executive_snapshot: '执行摘要',
    from: '从',
    from_the_analysis: '来自分析',
    growth_story: '增长故事',
    in_focus: '重点关注',
    kicker: '数据简报',
    key_takeaways: '关键要点',
    latest: '最新值',
    leads_the_mix: '占比领先',
    leader: '领先',
    negative: '负相关',
    on_time: '准时 87%',
    peak: '峰值',
    peak_activity: '峰值活跃',
    positive: '正相关',
    quality: '质量 92%',
    quarterly_briefing: '季度简报',
    revenue_momentum: '收入动能',
    score: '得分',
    section: '章节',
    share: '占比',
    since: '自',
    signal_map: '信号图',
    start: '开始',
    stat_label: '趋势动能',
    strong: '强劲',
    strongest_inverse: '最强反向',
    target: '目标',
    term: '术语',
    timeline: '时间线',
    to: '到',
    total: '合计',
    trend: '趋势',
};
const hasChineseText = (value) => {
    if (typeof value === 'string')
        return /[\u4e00-\u9fff]/.test(value);
    if (Array.isArray(value))
        return value.some(hasChineseText);
    if (value && typeof value === 'object') {
        return Object.values(value).some(hasChineseText);
    }
    return false;
};
const isChineseRuntimeScene = (sceneContent) => {
    const language = String(sceneContent?.language ?? sceneContent?.output_language ?? '').toLowerCase();
    if (language.startsWith('zh') || language.startsWith('chinese') || language.includes('中文'))
        return true;
    return hasChineseText([
        sceneContent?.title,
        sceneContent?.description,
        sceneContent?.source_rows,
        sceneContent?.mapping,
        sceneContent?.template_payload,
    ]);
};
export const uiLabel = (sceneContent, key, fallback) => firstString(sceneContent?.ui_labels?.[key], isChineseRuntimeScene(sceneContent) ? ZH_UI_LABEL_FALLBACKS[key] : '', fallback);
export const runtimeLabelSlots = runtimeLabelSlotsData;
export const paletteFor = (sceneContent, dark = false) => {
    const style = sceneContent?.style ?? {};
    const palette = Array.isArray(style.palette) ? style.palette.filter((value) => typeof value === 'string' && value.trim()) : [];
    const accent = firstString(style.accent, style.accent_color);
    const base = dark ? DEFAULT_DARK_PALETTE : DEFAULT_LIGHT_PALETTE;
    return [...(accent ? [accent] : []), ...palette, ...base].filter(Boolean);
};
export const styleTheme = (sceneContent) => (String(sceneContent?.style?.theme ?? '').toLowerCase() === 'dark' ? 'dark' : 'light');
const templatePayload = (sceneContent) => sceneContent?.template_payload && typeof sceneContent.template_payload === 'object'
    ? sceneContent.template_payload
    : null;
const getFieldFromBinding = (binding, ...keys) => {
    if (!binding || typeof binding !== 'object')
        return '';
    for (const key of keys) {
        const value = binding[key];
        if (Array.isArray(value)) {
            for (const item of value) {
                const field = firstString(item?.field, item?.key, item?.name);
                if (field)
                    return field;
            }
        }
        if (value && typeof value === 'object') {
            const field = firstString(value.field, value.key, value.name);
            if (field)
                return field;
        }
        const direct = firstString(value);
        if (direct)
            return direct;
    }
    return '';
};
const fieldHasNumbers = (rows, field) => {
    if (!field)
        return false;
    return rows.some((row) => row && typeof row === 'object' && Number.isFinite(toNumber(row[field], NaN)));
};
const labelLooksLikeValue = (label, value) => {
    const n = toNumber(label, NaN);
    return Number.isFinite(n) && Math.abs(n - value) < Math.max(0.001, Math.abs(value) * 0.0001);
};
const pointsFromSourceRows = (sceneContent) => {
    const rows = Array.isArray(sceneContent?.source_rows) ? sceneContent.source_rows : [];
    if (!rows.length)
        return [];
    const binding = sceneContent?.data_binding ?? sceneContent?.mapping ?? {};
    const chartType = String(sceneContent?.chart_type ?? '').toLowerCase();
    const xField = getFieldFromBinding(binding, 'x', 'x_axis');
    const yField = getFieldFromBinding(binding, 'y', 'y_axis', 'value');
    const yAxis = binding?.y_axis ?? binding?.y ?? binding?.value;
    const yAxisItems = Array.isArray(yAxis)
        ? yAxis
            .map((item) => ({
            field: firstString(item?.field, item?.key, item?.name),
            name: firstString(item?.label, item?.name, item?.field, item?.key),
        }))
            .filter((item) => item.field)
        : [];
    let labelField = getFieldFromBinding(binding, 'label', 'category', 'name', 'x', 'x_axis');
    let valueField = getFieldFromBinding(binding, 'value', 'metric', 'y', 'y_axis');
    if (yAxisItems.length > 1 && (chartType === 'line_chart' || chartType === 'bar_chart')) {
        const points = [];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            if (!row || typeof row !== 'object')
                continue;
            const category = firstString(row[labelField], row[xField], row.label, row.name, row.category);
            for (const item of yAxisItems) {
                const value = toNumber(row[item.field], NaN);
                if (!Number.isFinite(value))
                    continue;
                points.push({
                    label: category,
                    value,
                    displayValue: firstString(row.display_value, row.displayValue),
                    color: firstString(row.color),
                    series: item.name,
                });
            }
        }
        if (points.length)
            return points;
    }
    if (chartType === 'bar_chart' && xField && yField) {
        const xNumeric = fieldHasNumbers(rows, xField);
        const yNumeric = fieldHasNumbers(rows, yField);
        if (xNumeric && !yNumeric) {
            labelField = yField;
            valueField = xField;
        }
        else if (yNumeric && !xNumeric) {
            labelField = xField;
            valueField = yField;
        }
    }
    const points = [];
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (!row || typeof row !== 'object')
            continue;
        if (Array.isArray(row.metrics)) {
            const category = firstString(row.category, row.label, row.name, row[xField], row[labelField]);
            for (const metric of row.metrics) {
                if (!metric || typeof metric !== 'object')
                    continue;
                const value = toNumber(metric.value, NaN);
                if (!Number.isFinite(value))
                    continue;
                const metricName = firstString(metric.name, metric.label);
                if (!metricName)
                    continue;
                points.push({
                    label: category ? `${category} · ${metricName}` : metricName,
                    value,
                    displayValue: firstString(metric.display_value, metric.displayValue),
                    color: firstString(metric.color),
                    series: metricName,
                });
            }
            continue;
        }
        const value = toNumber(row[valueField], NaN);
        if (!Number.isFinite(value))
            continue;
        points.push({
            label: firstString(row[labelField], row.label, row.name, row.category, row[xField]),
            value,
            displayValue: firstString(row.display_value, row.displayValue),
            color: firstString(row.color),
            subtitle: firstString(row.subtitle, row.description),
        });
    }
    return points;
};
const insightLabels = (scene, count) => {
    const text = `${scene?.insight_summary ?? ''} ${scene?.narrative_goal ?? ''} ${scene?.content?.title ?? ''}`;
    if (!text.trim())
        return [];
    const months = {
        jan: 'Jan',
        january: 'Jan',
        feb: 'Feb',
        february: 'Feb',
        mar: 'Mar',
        march: 'Mar',
        apr: 'Apr',
        april: 'Apr',
        may: 'May',
        jun: 'Jun',
        june: 'Jun',
        jul: 'Jul',
        july: 'Jul',
        aug: 'Aug',
        august: 'Aug',
        sep: 'Sep',
        september: 'Sep',
        oct: 'Oct',
        october: 'Oct',
        nov: 'Nov',
        november: 'Nov',
        dec: 'Dec',
        december: 'Dec',
    };
    const found = [];
    for (const match of text.matchAll(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/gi)) {
        const label = months[match[1].toLowerCase()];
        if (label && !found.includes(label))
            found.push(label);
        if (found.length >= count)
            break;
    }
    return found;
};
export const runtimePoints = (sceneContent, scene) => {
    const payload = templatePayload(sceneContent);
    if (payload && Array.isArray(payload.items)) {
        return payload.items.map((item) => {
            const value = toNumber(item?.value, NaN);
            const label = firstString(item?.label);
            if (!label || !Number.isFinite(value))
                return null;
            return {
                label,
                value,
                displayValue: firstString(item?.display_value, item?.displayValue),
                color: firstString(item?.color),
                subtitle: firstString(item?.subtitle, item?.description),
                series: firstString(item?.series),
                sparkline: Array.isArray(item?.sparkline) ? item.sparkline.map((v) => toNumber(v, NaN)).filter(Number.isFinite) : [],
            };
        }).filter((point) => point !== null);
    }
    if (payload && Array.isArray(payload.series)) {
        return payload.series.flatMap((series) => {
            const seriesName = firstString(series?.name);
            const color = firstString(series?.color);
            if (!seriesName || !Array.isArray(series?.points))
                return [];
            return series.points.map((point) => {
                const value = toNumber(point?.value, NaN);
                const label = firstString(point?.label);
                if (!label || !Number.isFinite(value))
                    return null;
                return {
                    label,
                    value,
                    displayValue: firstString(point?.display_value, point?.displayValue),
                    color: firstString(point?.color, color),
                    series: seriesName,
                };
            }).filter((point) => point !== null);
        });
    }
    const raw = Array.isArray(sceneContent?.data) ? sceneContent.data : [];
    const sourceRows = pointsFromSourceRows(sceneContent);
    const chartType = String(sceneContent?.chart_type ?? '').toLowerCase();
    const templateId = firstString(sceneContent?.style_template_id, scene?.renderer?.style_template_id);
    const hasMultiSeriesBinding = Array.isArray(sceneContent?.data_binding?.y_axis) && sceneContent.data_binding.y_axis.length > 1;
    const shouldFlattenSeries = chartType === 'line_chart' || templateId === 'StyleTemplate-LightWideComparison';
    const yAxis = sceneContent?.data_binding?.y_axis;
    const primarySeries = Array.isArray(yAxis)
        ? firstString(yAxis[0]?.label, yAxis[0]?.field, sceneContent?.mapping?.y)
        : firstString(yAxis?.label, yAxis?.field, sceneContent?.mapping?.y);
    const dataPoints = raw.flatMap((item, index) => {
        const value = toNumber(item?.value ?? item?.y, NaN);
        if (!Number.isFinite(value))
            return [];
        const basePoint = {
            label: firstString(item?.label, item?.name, item?.category),
            value,
            displayValue: firstString(item?.display_value, item?.displayValue),
            color: firstString(item?.color),
            subtitle: firstString(item?.subtitle, item?.description),
            series: firstString(item?.series),
            sparkline: Array.isArray(item?.sparkline) ? item.sparkline.map((v) => toNumber(v, NaN)).filter(Number.isFinite) : [],
        };
        if (!shouldFlattenSeries || !item?.series || typeof item.series !== 'object' || Array.isArray(item.series)) {
            return [basePoint];
        }
        const expanded = [];
        if (Number.isFinite(value)) {
            expanded.push({ ...basePoint, series: primarySeries });
        }
        for (const [seriesName, seriesValue] of Object.entries(item.series)) {
            const seriesNumber = toNumber(seriesValue, NaN);
            if (!Number.isFinite(seriesNumber))
                continue;
            expanded.push({
                ...basePoint,
                value: seriesNumber,
                displayValue: formatCompact(seriesNumber, seriesName),
                series: seriesName,
            });
        }
        return expanded.length ? expanded : [basePoint];
    }).filter((point) => Number.isFinite(point.value));
    const labelsAreWeak = dataPoints.some((point) => !point.label || labelLooksLikeValue(point.label, point.value));
    const points = sourceRows.length && (labelsAreWeak || hasMultiSeriesBinding) ? sourceRows : dataPoints;
    const inferred = labelsAreWeak ? insightLabels(scene, points.length) : [];
    return points.map((point, index) => ({
        ...point,
        label: labelLooksLikeValue(point.label, point.value) && inferred[index]
            ? inferred[index]
            : point.label || '',
    }));
};
export const runtimeCards = (sceneContent, scene) => {
    const payload = templatePayload(sceneContent);
    if (payload && Array.isArray(payload.cards)) {
        return payload.cards.map((card) => {
            const value = toNumber(card?.value, NaN);
            const label = firstString(card?.label, card?.title, card?.name);
            if (!label || !Number.isFinite(value))
                return null;
            return {
                label,
                value,
                delta: Number.isFinite(toNumber(card?.delta, NaN)) ? toNumber(card?.delta, NaN) : undefined,
                displayValue: firstString(card?.display_value, card?.displayValue),
                subtitle: firstString(card?.subtitle, card?.description),
                color: firstString(card?.color),
                sparkline: Array.isArray(card?.sparkline) ? card.sparkline.map((v) => toNumber(v, NaN)).filter(Number.isFinite) : [],
            };
        }).filter((card) => card !== null);
    }
    const cards = Array.isArray(sceneContent?.cards) && sceneContent.cards.length
        ? sceneContent.cards
        : Array.isArray(sceneContent?.data)
            ? sceneContent.data
            : [];
    if (!cards.length)
        return runtimePoints(sceneContent, scene).slice(0, 4);
    return cards.slice(0, 4).map((card) => {
        const display = firstString(card?.display_value, card?.displayValue, card?.value);
        const value = toNumber(card?.raw_value ?? card?.value, NaN);
        if (!Number.isFinite(value))
            return null;
        return {
            label: firstString(card?.label, card?.title, card?.name),
            value,
            delta: Number.isFinite(toNumber(card?.delta, NaN)) ? toNumber(card?.delta, NaN) : undefined,
            displayValue: display || formatCompact(value),
            subtitle: firstString(card?.subtitle, card?.description),
            color: firstString(card?.color),
            sparkline: Array.isArray(card?.sparkline) ? card.sparkline.map((v) => toNumber(v, NaN)).filter(Number.isFinite) : [],
        };
    }).filter((card) => card !== null);
};
export const runtimeScatterPoints = (sceneContent) => {
    const payload = templatePayload(sceneContent);
    if (payload && Array.isArray(payload.items)) {
        return payload.items.map((item) => {
            const label = firstString(item?.label, item?.name, item?.category);
            const x = toNumber(item?.x, NaN);
            const y = toNumber(item?.y, NaN);
            if (!label || !Number.isFinite(x) || !Number.isFinite(y))
                return null;
            const size = toNumber(item?.size, NaN);
            return {
                label,
                x,
                y,
                size: Number.isFinite(size) ? size : undefined,
                color: firstString(item?.color),
            };
        }).filter((row) => row !== null);
    }
    const raw = Array.isArray(sceneContent?.data) ? sceneContent.data : [];
    const sourceRows = Array.isArray(sceneContent?.source_rows) ? sceneContent.source_rows : [];
    const binding = sceneContent?.data_binding ?? sceneContent?.mapping ?? {};
    const xField = getFieldFromBinding(binding, 'x', 'x_axis');
    const yField = getFieldFromBinding(binding, 'y', 'y_axis', 'value');
    const sizeField = getFieldFromBinding(binding, 'size', 'bubble_size');
    const labelField = getFieldFromBinding(binding, 'label', 'category', 'name');
    if (sourceRows.length && xField && yField) {
        const rows = sourceRows.map((row, index) => {
            if (!row || typeof row !== 'object')
                return null;
            const x = toNumber(row[xField], NaN);
            const y = toNumber(row[yField], NaN);
            if (!Number.isFinite(x) || !Number.isFinite(y))
                return null;
            const size = sizeField ? toNumber(row[sizeField], NaN) : NaN;
            return {
                label: firstString(row[labelField], row.label, row.name, row.category),
                x,
                y,
                size: Number.isFinite(size) ? size : undefined,
                color: firstString(row.color),
            };
        }).filter((row) => row !== null);
        if (rows.length)
            return rows;
    }
    return raw.map((item, index) => {
        const x = toNumber(item?.x, NaN);
        const y = toNumber(item?.y, NaN);
        if (!Number.isFinite(x) || !Number.isFinite(y))
            return null;
        return {
            label: firstString(item?.label, item?.name, item?.category),
            x,
            y,
            size: Number.isFinite(toNumber(item?.size, NaN)) ? toNumber(item.size, 0) : undefined,
            color: firstString(item?.color),
        };
    }).filter((row) => row !== null);
};
const splitCompositeLabel = (label) => {
    const parts = label.split(/\s+(?:·|\||\/|-|:)\s+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2)
        return [parts[0], parts.slice(1).join(' ')];
    return null;
};
export const comparisonRows = (sceneContent, scene) => {
    const payload = templatePayload(sceneContent);
    if (payload && Array.isArray(payload.rows)) {
        return payload.rows.map((row) => {
            const label = firstString(row?.label);
            if (!label || !Array.isArray(row?.metrics))
                return null;
            const metrics = row.metrics.map((metric) => {
                const name = firstString(metric?.name, metric?.label);
                const value = toNumber(metric?.value, NaN);
                if (!name || !Number.isFinite(value))
                    return null;
                return {
                    name,
                    value,
                    displayValue: firstString(metric?.display_value, metric?.displayValue),
                    color: firstString(metric?.color),
                };
            }).filter((metric) => metric !== null);
            return metrics.length ? { label, metrics } : null;
        }).filter((row) => row !== null);
    }
    const sourceRows = Array.isArray(sceneContent?.source_rows) ? sceneContent.source_rows : [];
    const fromSource = sourceRows
        .filter((row) => row && typeof row === 'object' && Array.isArray(row.metrics))
        .map((row, index) => ({
        label: firstString(row.category, row.label, row.name),
        metrics: row.metrics
            .filter((metric) => metric && typeof metric === 'object')
            .map((metric) => ({
            name: firstString(metric.name, metric.label),
            value: toNumber(metric.value, 0),
            displayValue: firstString(metric.display_value, metric.displayValue),
            color: firstString(metric.color),
        }))
            .filter((metric) => metric.name && Number.isFinite(metric.value)),
    }))
        .filter((row) => row.metrics.length > 0);
    if (fromSource.length)
        return fromSource;
    const grouped = new Map();
    for (const point of runtimePoints(sceneContent, scene)) {
        const split = splitCompositeLabel(point.label);
        const rowLabel = split?.[0] ?? point.label;
        const metricName = firstString(point.series, split?.[1]);
        if (!metricName)
            continue;
        const list = grouped.get(rowLabel) ?? [];
        list.push({
            name: metricName,
            value: point.value,
            displayValue: point.displayValue,
            color: point.color,
        });
        grouped.set(rowLabel, list);
    }
    return Array.from(grouped.entries()).map(([label, metrics]) => ({ label, metrics }));
};
export const metricNamesForRows = (rows, maxNames = 6) => {
    const names = [];
    for (const row of rows) {
        for (const metric of row.metrics) {
            if (!names.includes(metric.name))
                names.push(metric.name);
            if (names.length >= maxNames)
                return names;
        }
    }
    return names;
};
export const metricMax = (rows, metricName) => {
    const values = rows.flatMap((row) => row.metrics.filter((metric) => metric.name === metricName).map((metric) => Math.abs(metric.value)));
    return Math.max(1, ...values);
};
export const valueExtent = (values) => {
    const clean = values.filter(Number.isFinite);
    if (!clean.length)
        return { min: 0, max: 1 };
    const min = Math.min(...clean);
    const max = Math.max(...clean);
    if (min === max) {
        const pad = Math.max(1, Math.abs(max) * 0.12);
        return { min: Math.min(0, min - pad), max: max + pad };
    }
    return { min: Math.min(0, min), max };
};
export const linePath = (points) => points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
export const slotTitle = (sceneContent, _fallback = '') => firstString(sceneContent?.template_payload?.title, sceneContent?.title, sceneContent?.headline, sceneContent?.name);
const normalizeCueToken = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, '');
export const activeRuntimeEmphasisAnimations = (scene, frame, fps = 30) => {
    const animations = Array.isArray(scene?.animations) ? scene.animations : [];
    if (!animations.length)
        return [];
    const sceneStart = Array.isArray(scene?.time_range) ? Number(scene.time_range[0]) || 0 : 0;
    const localSeconds = frame / Math.max(1, fps || 30);
    const matches = animations
        .filter((anim) => {
        if (!anim || anim.type !== 'emphasis')
            return false;
        // Standalone Cards accept explicit emphasis timing, with or without the
        // hosted system's optional word-alignment debug metadata.
        const absoluteStart = Number(anim.time_start);
        const duration = Number(anim.duration);
        if (!Number.isFinite(absoluteStart) || !Number.isFinite(duration) || duration <= 0)
            return false;
        const localStart = absoluteStart - sceneStart;
        return localSeconds >= localStart && localSeconds <= localStart + Math.max(0.45, duration);
    })
        .sort((a, b) => Number(a?.time_start ?? 0) - Number(b?.time_start ?? 0));
    return matches.slice(-4);
};
const runtimeActiveAnimationTiming = (animations, scene, frame, fps = 30) => {
    if (!animations.length)
        return null;
    const sceneStart = Array.isArray(scene?.time_range) ? Number(scene.time_range[0]) || 0 : 0;
    const localSeconds = frame / Math.max(1, fps || 30);
    const anim = animations[animations.length - 1];
    const absoluteStart = Number(anim?.time_start);
    const duration = Math.max(0.45, Number(anim?.duration) || 0);
    if (!Number.isFinite(absoluteStart) || !Number.isFinite(duration) || duration <= 0)
        return null;
    return {
        elapsed: Math.max(0, localSeconds - (absoluteStart - sceneStart)),
        duration,
    };
};
export const runtimeEmphasisProgress = (animations, scene, frame, fps = 30) => {
    const timing = runtimeActiveAnimationTiming(animations, scene, frame, fps);
    if (!timing)
        return 1;
    return Math.max(0, Math.min(1, timing.elapsed / timing.duration));
};
export const runtimeEmphasisSustain = (animations, scene, frame, fps = 30) => {
    const timing = runtimeActiveAnimationTiming(animations, scene, frame, fps);
    if (!timing)
        return 0;
    const fadeIn = Math.min(0.35, Math.max(0.12, timing.duration * 0.18));
    const fadeOut = Math.min(0.28, Math.max(0.10, timing.duration * 0.14));
    if (timing.elapsed < fadeIn) {
        return Math.max(0, Math.min(1, timing.elapsed / fadeIn));
    }
    const remaining = timing.duration - timing.elapsed;
    if (remaining < fadeOut) {
        return Math.max(0, Math.min(1, remaining / fadeOut));
    }
    return 1;
};
export const runtimeEmphasisPulse = (animations, scene, frame, fps = 30) => {
    if (!animations.length)
        return 1;
    const progress = Math.min(1, runtimeEmphasisProgress(animations, scene, frame, fps) / 0.22);
    return 1 + Math.sin(progress * Math.PI) * 0.025;
};
const animationFilterValues = (anim) => {
    const filter = anim?.target_data?.data_filter;
    if (!filter || typeof filter !== 'object')
        return [];
    return Object.values(filter)
        .map((value) => firstString(value))
        .filter(Boolean);
};
export const runtimeEmphasisMatches = (animations, ...values) => {
    if (!animations.length)
        return false;
    const candidates = values.map((value) => normalizeCueToken(value)).filter(Boolean);
    if (!candidates.length)
        return false;
    return animations.some((anim) => animationFilterValues(anim).some((filterValue) => {
        const normalized = normalizeCueToken(filterValue);
        return normalized && candidates.some((candidate) => candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate));
    }));
};
const hexToRgb = (hex) => {
    const normalized = hex.replace('#', '').trim();
    if (!/^[a-f\d]{6}$/i.test(normalized))
        return [255, 107, 107];
    return [
        parseInt(normalized.slice(0, 2), 16),
        parseInt(normalized.slice(2, 4), 16),
        parseInt(normalized.slice(4, 6), 16),
    ];
};
const runtimeContractDefaults = (kind, accent) => {
    const [r, g, b] = hexToRgb(accent);
    const rgba = (alpha) => `rgba(${r},${g},${b},${alpha})`;
    switch (kind) {
        case 'line':
            return {
                kind,
                accent,
                strokeWidth: 3.2,
                glow: `drop-shadow(0 0 8px ${rgba(0.38)})`,
                mutedOpacity: 0.52,
                activeOpacity: 1,
                fillOpacity: 0.16,
            };
        case 'bar':
            return {
                kind,
                accent,
                strokeWidth: 2.4,
                glow: `drop-shadow(0 8px 16px ${rgba(0.24)})`,
                mutedOpacity: 0.5,
                activeOpacity: 1,
                fillOpacity: 0.1,
            };
        case 'pie':
            return {
                kind,
                accent,
                strokeWidth: 4,
                glow: `drop-shadow(0 0 12px ${rgba(0.34)})`,
                mutedOpacity: 0.42,
                activeOpacity: 1,
                fillOpacity: 0.12,
            };
        case 'stat':
            return {
                kind,
                accent,
                strokeWidth: 1.8,
                glow: `0 18px 42px ${rgba(0.16)}`,
                mutedOpacity: 0.52,
                activeOpacity: 1,
                fillOpacity: 0.1,
            };
        case 'scatter':
            return {
                kind,
                accent,
                strokeWidth: 2.8,
                glow: `drop-shadow(0 0 12px ${rgba(0.34)})`,
                mutedOpacity: 0.45,
                activeOpacity: 1,
                fillOpacity: 0.14,
            };
        case 'tile':
            return {
                kind,
                accent,
                strokeWidth: 4,
                glow: `drop-shadow(0 0 16px ${rgba(0.36)})`,
                mutedOpacity: 0.48,
                activeOpacity: 1,
                fillOpacity: 0.16,
            };
        case 'comparison':
            return {
                kind,
                accent,
                strokeWidth: 2.6,
                glow: `drop-shadow(0 10px 22px ${rgba(0.22)})`,
                mutedOpacity: 0.48,
                activeOpacity: 1,
                fillOpacity: 0.12,
            };
        case 'flow':
            return {
                kind,
                accent,
                strokeWidth: 3,
                glow: `drop-shadow(0 0 14px ${rgba(0.32)})`,
                mutedOpacity: 0.38,
                activeOpacity: 1,
                fillOpacity: 0.14,
            };
        case 'heatmap':
            return {
                kind,
                accent,
                strokeWidth: 3,
                glow: `drop-shadow(0 0 12px ${rgba(0.30)})`,
                mutedOpacity: 0.5,
                activeOpacity: 1,
                fillOpacity: 0.12,
            };
        case 'radar':
            return {
                kind,
                accent,
                strokeWidth: 4,
                glow: `drop-shadow(0 0 14px ${rgba(0.34)})`,
                mutedOpacity: 0.42,
                activeOpacity: 1,
                fillOpacity: 0.14,
            };
    }
};
export const runtimeAnimationContract = (kind, scene, frame, fps = 30) => {
    const activeAnimations = activeRuntimeEmphasisAnimations(scene, frame, fps);
    const accent = firstString(scene?.content?.style?.accent, scene?.content?.style?.accent_color, scene?.content?.template_payload?.accent, '#ff6b6b');
    const defaults = runtimeContractDefaults(kind, accent);
    return {
        ...defaults,
        activeAnimations,
        active: activeAnimations.length > 0,
        progress: activeAnimations.length ? runtimeEmphasisProgress(activeAnimations, scene, frame, fps) : 0,
        sustain: activeAnimations.length ? runtimeEmphasisSustain(activeAnimations, scene, frame, fps) : 0,
    };
};
export const runtimeContractMatches = (contract, ...values) => runtimeEmphasisMatches(contract.activeAnimations, ...values);
export const runtimeContractOpacity = (contract, isActive, baseOpacity = 1) => {
    if (!contract.active)
        return baseOpacity;
    return isActive ? contract.activeOpacity : contract.mutedOpacity * baseOpacity;
};
export const runtimeContractEase = (contract) => contract.active ? contract.sustain : 0;
