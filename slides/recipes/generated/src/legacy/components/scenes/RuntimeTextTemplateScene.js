// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../runtime/vue-runtime.ts';
import { firstString } from '../runtime_style_templates/runtimeSlots.js';
// One template per file (see ../runtime_style_templates/text/). Imported
// individually rather than from a barrel so the backend eject step can resolve
// each style_template_id back to its own source file — see the contract note
// above RUNTIME_TEXT_TEMPLATE_ADAPTERS below.
import { RuntimeClosingActionPlan } from '../runtime_style_templates/text/RuntimeClosingActionPlan.js';
import { RuntimeClosingGradientSignal } from '../runtime_style_templates/text/RuntimeClosingGradientSignal.js';
import { RuntimeClosingKeyTakeaways } from '../runtime_style_templates/text/RuntimeClosingKeyTakeaways.js';
import { RuntimeClosingLightOutro } from '../runtime_style_templates/text/RuntimeClosingLightOutro.js';
import { RuntimeClosingMetricSummary } from '../runtime_style_templates/text/RuntimeClosingMetricSummary.js';
import { RuntimeClosingSimpleOutro } from '../runtime_style_templates/text/RuntimeClosingSimpleOutro.js';
import { RuntimeNarrativeBullets } from '../runtime_style_templates/text/RuntimeNarrativeBullets.js';
import { RuntimeNarrativeBulletsLight } from '../runtime_style_templates/text/RuntimeNarrativeBulletsLight.js';
import { RuntimeNarrativeChapterTitle } from '../runtime_style_templates/text/RuntimeNarrativeChapterTitle.js';
import { RuntimeNarrativeChapterTitleLight } from '../runtime_style_templates/text/RuntimeNarrativeChapterTitleLight.js';
import { RuntimeNarrativeContext } from '../runtime_style_templates/text/RuntimeNarrativeContext.js';
import { RuntimeNarrativeContextLight } from '../runtime_style_templates/text/RuntimeNarrativeContextLight.js';
import { RuntimeNarrativeQuestion } from '../runtime_style_templates/text/RuntimeNarrativeQuestion.js';
import { RuntimeNarrativeQuote } from '../runtime_style_templates/text/RuntimeNarrativeQuote.js';
import { RuntimeNarrativeStatHook } from '../runtime_style_templates/text/RuntimeNarrativeStatHook.js';
import { RuntimeNarrativeVersus } from '../runtime_style_templates/text/RuntimeNarrativeVersus.js';
import { RuntimeNarrativeDefinition } from '../runtime_style_templates/text/RuntimeNarrativeDefinition.js';
import { RuntimeNarrativeBeforeAfter } from '../runtime_style_templates/text/RuntimeNarrativeBeforeAfter.js';
import { RuntimeNarrativeMiniTimeline } from '../runtime_style_templates/text/RuntimeNarrativeMiniTimeline.js';
import { RuntimeNarrativeStatHookLight } from '../runtime_style_templates/text/RuntimeNarrativeStatHookLight.js';
import { RuntimeNarrativeQuoteLight } from '../runtime_style_templates/text/RuntimeNarrativeQuoteLight.js';
import { RuntimeNarrativeStatHookIllustrated } from '../runtime_style_templates/text/RuntimeNarrativeStatHookIllustrated.js';
import { RuntimeNarrativeContextIllustrated } from '../runtime_style_templates/text/RuntimeNarrativeContextIllustrated.js';
import { RuntimeNarrativeBulletsIllustrated } from '../runtime_style_templates/text/RuntimeNarrativeBulletsIllustrated.js';
import { RuntimeNarrativeQuoteIllustrated } from '../runtime_style_templates/text/RuntimeNarrativeQuoteIllustrated.js';
import { RuntimeNarrativeChapterTitleIllustrated } from '../runtime_style_templates/text/RuntimeNarrativeChapterTitleIllustrated.js';
import { RuntimeOpeningCinematicHeadline } from '../runtime_style_templates/text/RuntimeOpeningCinematicHeadline.js';
import { RuntimeOpeningDataGrid } from '../runtime_style_templates/text/RuntimeOpeningDataGrid.js';
import { RuntimeOpeningEditorialTitle } from '../runtime_style_templates/text/RuntimeOpeningEditorialTitle.js';
import { RuntimeOpeningExecutiveBrief } from '../runtime_style_templates/text/RuntimeOpeningExecutiveBrief.js';
import { RuntimeOpeningSplitMetrics } from '../runtime_style_templates/text/RuntimeOpeningSplitMetrics.js';
// ── Adapter map: style_template_id → runtime text component ─────────────────
// Same contract as the chart dispatcher (RuntimeStyleTemplateScene.tsx): this map
// + the per-file imports above are the source of truth the backend eject step reads
// (web/server.py: _parse_runtime_dispatcher / _eject_runtime_scene_source). Keep
// each template in its own file under runtime_style_templates/text/, with the
// signature `export const RuntimeXxx: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {`,
// importing shared helpers from './textTemplateShared'. Light/dark variants are
// each their own self-contained file (forceLight baked as a const), not thin wrappers,
// so they carry real editable code.
//
// This adapter map is also the renderable narrative set the fast-runtime flow may
// pick from: when adding/removing a template here, mirror it in
// FAST_RUNTIME_NARRATIVE_TEMPLATE_IDS (scene_builder/style_template_registry.py) so
// the Narrative Director is only offered cards the converter can render, and in
// _RUNTIME_TEXT_TEMPLATE_META (web/server.py).
const RUNTIME_TEXT_TEMPLATE_ADAPTERS = {
    'StyleTemplate-OpeningExecutiveBrief': RuntimeOpeningExecutiveBrief,
    'StyleTemplate-OpeningSplitMetrics': RuntimeOpeningSplitMetrics,
    'StyleTemplate-OpeningDataGrid': RuntimeOpeningDataGrid,
    'StyleTemplate-OpeningCinematicHeadline': RuntimeOpeningCinematicHeadline,
    'StyleTemplate-OpeningEditorialTitle': RuntimeOpeningEditorialTitle,
    'StyleTemplate-NarrativeStatHook': RuntimeNarrativeStatHook,
    'StyleTemplate-NarrativeQuestion': RuntimeNarrativeQuestion,
    'StyleTemplate-NarrativeBullets': RuntimeNarrativeBullets,
    'StyleTemplate-NarrativeBulletsLight': RuntimeNarrativeBulletsLight,
    'StyleTemplate-NarrativeContext': RuntimeNarrativeContext,
    'StyleTemplate-NarrativeContextLight': RuntimeNarrativeContextLight,
    'StyleTemplate-NarrativeChapterTitle': RuntimeNarrativeChapterTitle,
    'StyleTemplate-NarrativeChapterTitleLight': RuntimeNarrativeChapterTitleLight,
    'StyleTemplate-NarrativeQuote': RuntimeNarrativeQuote,
    'StyleTemplate-NarrativeVersus': RuntimeNarrativeVersus,
    'StyleTemplate-NarrativeDefinition': RuntimeNarrativeDefinition,
    'StyleTemplate-NarrativeBeforeAfter': RuntimeNarrativeBeforeAfter,
    'StyleTemplate-NarrativeMiniTimeline': RuntimeNarrativeMiniTimeline,
    'StyleTemplate-NarrativeStatHookLight': RuntimeNarrativeStatHookLight,
    'StyleTemplate-NarrativeQuoteLight': RuntimeNarrativeQuoteLight,
    'StyleTemplate-NarrativeStatHookIllustrated': RuntimeNarrativeStatHookIllustrated,
    'StyleTemplate-NarrativeContextIllustrated': RuntimeNarrativeContextIllustrated,
    'StyleTemplate-NarrativeBulletsIllustrated': RuntimeNarrativeBulletsIllustrated,
    'StyleTemplate-NarrativeQuoteIllustrated': RuntimeNarrativeQuoteIllustrated,
    'StyleTemplate-NarrativeChapterTitleIllustrated': RuntimeNarrativeChapterTitleIllustrated,
    'StyleTemplate-ClosingSimpleOutro': RuntimeClosingSimpleOutro,
    'StyleTemplate-ClosingLightOutro': RuntimeClosingLightOutro,
    'StyleTemplate-ClosingKeyTakeaways': RuntimeClosingKeyTakeaways,
    'StyleTemplate-ClosingMetricSummary': RuntimeClosingMetricSummary,
    'StyleTemplate-ClosingActionPlan': RuntimeClosingActionPlan,
    'StyleTemplate-ClosingGradientSignal': RuntimeClosingGradientSignal,
};
const runtimeTextTemplateId = (sceneContent, scene) => firstString(sceneContent?.style_template_id, scene?.renderer?.style_template_id, scene?.content?.style_template_id);
const fallbackTextTemplateId = (scene) => {
    const sceneType = String(scene?.type ?? '').toLowerCase();
    if (sceneType === 'opening')
        return 'StyleTemplate-OpeningExecutiveBrief';
    if (sceneType === 'closing')
        return 'StyleTemplate-ClosingSimpleOutro';
    return 'StyleTemplate-NarrativeContext';
};
export const hasRuntimeTextTemplateAdapter = (templateId) => typeof templateId === 'string' && Boolean(RUNTIME_TEXT_TEMPLATE_ADAPTERS[templateId]);
export const RuntimeTextTemplateScene = ({ sceneContent, scene }) => {
    const explicit = runtimeTextTemplateId(sceneContent, scene);
    const templateId = RUNTIME_TEXT_TEMPLATE_ADAPTERS[explicit] ? explicit : fallbackTextTemplateId(scene);
    const Adapter = RUNTIME_TEXT_TEMPLATE_ADAPTERS[templateId];
    return React.createElement(Adapter, { sceneContent: sceneContent, scene: scene });
};
