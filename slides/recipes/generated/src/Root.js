// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../runtime/vue-runtime.ts';
import { PresenterDataTakeover } from '../templates/presenter-data-takeover/PresenterDataTakeover.js';
import presenterTakeoverSample from '../templates/presenter-data-takeover/sample-data.json';
import { ContrastContributionStory } from '../templates/contrast-contribution-story/ContrastContributionStory.js';
import contributionStorySample from '../templates/contrast-contribution-story/sample-data.json';
import { PersistentTierBoard } from '../templates/persistent-tier-board/PersistentTierBoard.js';
import tierBoardSample from '../templates/persistent-tier-board/sample-data.json';
import { CharacterPerspectiveBoard } from '../templates/character-perspective-board/CharacterPerspectiveBoard.js';
import characterPerspectiveSample from '../templates/character-perspective-board/sample-data.json';
import characterPerspectiveAlternate from '../templates/character-perspective-board/alternate-data.json';
import { PresenterEvidenceBoard } from '../templates/presenter-evidence-board/PresenterEvidenceBoard.js';
import presenterEvidence from '../templates/presenter-evidence-board/sample-data.json';
import { FootageEvidenceReveal } from '../templates/footage-evidence-reveal/FootageEvidenceReveal.js';
import footageEvidence from '../templates/footage-evidence-reveal/sample-data.json';
import { RankedReveal } from '../templates/ranked-reveal/RankedReveal.js';
import rankedReveal from '../templates/ranked-reveal/sample-data.json';
import { PortraitRankedReveal } from '../templates/portrait-ranked-reveal/PortraitRankedReveal.js';
import portraitRankedReveal from '../templates/portrait-ranked-reveal/sample-data.json';
import { Composition, Folder } from '../../runtime/motion-runtime.ts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/700.css';
import { BarChartRace } from '../templates/bar-chart-race/BarChartRace.js';
import sampleData from '../templates/bar-chart-race/sample-data.json';
import { EditorialLedgerRace } from '../templates/editorial-ledger-race/EditorialLedgerRace.js';
import editorialLedgerRaceSample from '../templates/editorial-ledger-race/sample-data.json';
import { CinematicTrackRace } from '../templates/cinematic-track-race/CinematicTrackRace.js';
import cinematicTrackRaceSample from '../templates/cinematic-track-race/sample-data.json';
import { SpatialPercentOverlay } from '../templates/spatial-percent-overlay/SpatialPercentOverlay.js';
import spatialPercentSample from '../templates/spatial-percent-overlay/sample-data.json';
import { BumpChartStory } from '../templates/bump-chart-story/BumpChartStory.js';
import bumpChartSample from '../templates/bump-chart-story/sample-data.json';
import { DataMagnifierLens } from '../templates/data-magnifier-lens/DataMagnifierLens.js';
import dataMagnifierSample from '../templates/data-magnifier-lens/sample-data.json';
import { SourceToInsight } from '../templates/source-to-insight/SourceToInsight.js';
import sourceToInsightSample from '../templates/source-to-insight/sample-data.json';
import { ChoroplethRankMap } from '../templates/choropleth-rank-map/ChoroplethRankMap.js';
import choroplethRankMapSample from '../templates/choropleth-rank-map/sample-data.json';
import { MapRouteAccumulation } from '../templates/map-route-accumulation/MapRouteAccumulation.js';
import mapRouteAccumulationSample from '../templates/map-route-accumulation/sample-data.json';
import { ChartFocusPush } from '../templates/chart-focus-push/ChartFocusPush.js';
import chartFocusPushSample from '../templates/chart-focus-push/sample-data.json';
import { ChartTimelineTravel } from '../templates/chart-timeline-travel/ChartTimelineTravel.js';
import chartTimelineTravelSample from '../templates/chart-timeline-travel/sample-data.json';
import { CraneRiseDashboard } from '../templates/crane-rise-dashboard/CraneRiseDashboard.js';
import craneRiseSample from '../templates/crane-rise-dashboard/sample-data.json';
import { ParallaxMapGlide } from '../templates/parallax-map-glide/ParallaxMapGlide.js';
import parallaxMapSample from '../templates/parallax-map-glide/sample-data.json';
import { PullBackIsolation } from '../templates/pull-back-isolation/PullBackIsolation.js';
import pullBackSample from '../templates/pull-back-isolation/sample-data.json';
import { SplitContextComparison } from '../templates/split-context-comparison/SplitContextComparison.js';
import splitContextSample from '../templates/split-context-comparison/sample-data.json';
import { NegativeSpaceChartDock } from '../templates/negative-space-chart-dock/NegativeSpaceChartDock.js';
import negativeSpaceSample from '../templates/negative-space-chart-dock/sample-data.json';
import { SourceToReconstruction } from '../templates/source-to-reconstruction/SourceToReconstruction.js';
import sourceReconstructionSample from '../templates/source-to-reconstruction/sample-data.json';
import { PresenterChartStage } from '../templates/presenter-chart-stage/PresenterChartStage.js';
import presenterStageSample from '../templates/presenter-chart-stage/sample-data.json';
import { SharedDataElementTransition } from '../templates/shared-data-element-transition/SharedDataElementTransition.js';
import sharedElementSample from '../templates/shared-data-element-transition/sample-data.json';
import { StorySequenceGenerator } from '../templates/story-sequence-generator/StorySequenceGenerator.js';
import storySequenceSample from '../templates/story-sequence-generator/sample-data.json';
import { VideoDataOverlay } from '../templates/video-data-overlay/VideoDataOverlay.js';
import videoMetricOverlaySample from '../templates/video-data-overlay/negative-space-data.json';
import trackedVideoCalloutSample from '../templates/video-data-overlay/tracked-callout-data.json';
export const ShotCraftRoot = () => (React.createElement(Folder, { name: "Advanced-Data-Visuals" },
    React.createElement(Composition, { id: "ShotCraft-PresenterDataTakeover", component: PresenterDataTakeover, durationInFrames: 360, fps: 30, width: 1920, height: 1080, defaultProps: presenterTakeoverSample }),
    React.createElement(Composition, { id: "ShotCraft-ContrastContributionStory", component: ContrastContributionStory, durationInFrames: 360, fps: 30, width: 1920, height: 1080, defaultProps: contributionStorySample }),
    React.createElement(Composition, { id: "ShotCraft-PersistentTierBoard", component: PersistentTierBoard, durationInFrames: 360, fps: 30, width: 1920, height: 1080, defaultProps: tierBoardSample }),
    React.createElement(Composition, { id: "ShotCraft-CharacterPerspectiveBoard", component: CharacterPerspectiveBoard, durationInFrames: 420, fps: 30, width: 1920, height: 1080, defaultProps: characterPerspectiveSample }),
    React.createElement(Composition, { id: "CharacterPerspectiveBoard-Alternate", component: CharacterPerspectiveBoard, durationInFrames: 420, fps: 30, width: 1920, height: 1080, defaultProps: characterPerspectiveAlternate }),
    React.createElement(Composition, { id: "ShotCraft-PortraitRankedReveal", component: PortraitRankedReveal, defaultProps: portraitRankedReveal, durationInFrames: 300, fps: 30, width: 1080, height: 1920 }),
    React.createElement(Composition, { id: "ShotCraft-PresenterEvidenceBoard", component: PresenterEvidenceBoard, defaultProps: presenterEvidence, durationInFrames: 300, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "ShotCraft-FootageEvidenceReveal", component: FootageEvidenceReveal, defaultProps: footageEvidence, durationInFrames: 240, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "ShotCraft-RankedReveal", component: RankedReveal, defaultProps: rankedReveal, durationInFrames: 300, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "ShotCraft-BarChartRace", component: BarChartRace, durationInFrames: 360, fps: 30, width: 1920, height: 1080, defaultProps: sampleData }),
    React.createElement(Composition, { id: "ShotCraft-EditorialLedgerRace", component: EditorialLedgerRace, durationInFrames: 330, fps: 30, width: 1920, height: 1080, defaultProps: editorialLedgerRaceSample }),
    React.createElement(Composition, { id: "ShotCraft-CinematicTrackRace", component: CinematicTrackRace, durationInFrames: 330, fps: 30, width: 1920, height: 1080, defaultProps: cinematicTrackRaceSample }),
    React.createElement(Composition, { id: "ShotCraft-SpatialPercentOverlay", component: SpatialPercentOverlay, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: spatialPercentSample }),
    React.createElement(Composition, { id: "ShotCraft-BumpChartStory", component: BumpChartStory, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: bumpChartSample }),
    React.createElement(Composition, { id: "ShotCraft-DataMagnifierLens", component: DataMagnifierLens, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: dataMagnifierSample }),
    React.createElement(Composition, { id: "ShotCraft-SourceToInsight", component: SourceToInsight, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: sourceToInsightSample }),
    React.createElement(Composition, { id: "ShotCraft-ChoroplethRankMap", component: ChoroplethRankMap, durationInFrames: 270, fps: 30, width: 1920, height: 1080, defaultProps: choroplethRankMapSample }),
    React.createElement(Composition, { id: "ShotCraft-MapRouteAccumulation", component: MapRouteAccumulation, durationInFrames: 300, fps: 30, width: 1920, height: 1080, defaultProps: mapRouteAccumulationSample }),
    React.createElement(Composition, { id: "ShotCraft-ChartFocusPush", component: ChartFocusPush, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: chartFocusPushSample }),
    React.createElement(Composition, { id: "ShotCraft-ChartTimelineTravel", component: ChartTimelineTravel, durationInFrames: 300, fps: 30, width: 1920, height: 1080, defaultProps: chartTimelineTravelSample }),
    React.createElement(Composition, { id: "ShotCraft-CraneRiseDashboard", component: CraneRiseDashboard, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: craneRiseSample }),
    React.createElement(Composition, { id: "ShotCraft-ParallaxMapGlide", component: ParallaxMapGlide, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: parallaxMapSample }),
    React.createElement(Composition, { id: "ShotCraft-PullBackIsolation", component: PullBackIsolation, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: pullBackSample }),
    React.createElement(Composition, { id: "ShotCraft-SplitContextComparison", component: SplitContextComparison, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: splitContextSample }),
    React.createElement(Composition, { id: "ShotCraft-NegativeSpaceChartDock", component: NegativeSpaceChartDock, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: negativeSpaceSample }),
    React.createElement(Composition, { id: "ShotCraft-SourceToReconstruction", component: SourceToReconstruction, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: sourceReconstructionSample }),
    React.createElement(Composition, { id: "ShotCraft-PresenterChartStage", component: PresenterChartStage, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: presenterStageSample }),
    React.createElement(Composition, { id: "ShotCraft-SharedDataElementTransition", component: SharedDataElementTransition, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: sharedElementSample }),
    React.createElement(Composition, { id: "ShotCraft-StorySequenceGenerator", component: StorySequenceGenerator, durationInFrames: 360, fps: 30, width: 1920, height: 1080, defaultProps: storySequenceSample }),
    React.createElement(Composition, { id: "ShotCraft-VideoMetricOverlay", component: VideoDataOverlay, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: videoMetricOverlaySample }),
    React.createElement(Composition, { id: "ShotCraft-TrackedVideoCallout", component: VideoDataOverlay, durationInFrames: 240, fps: 30, width: 1920, height: 1080, defaultProps: trackedVideoCalloutSample })));
