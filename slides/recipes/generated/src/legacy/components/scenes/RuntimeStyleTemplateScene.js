// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../runtime/vue-runtime.ts';
import { BasicBarChartDemo as RuntimeBasicBarChart } from '../runtime_style_templates/bar_chart/RuntimeBasicBarChart.js';
import { ExecutiveHorizontalBarsDemo as RuntimeExecutiveHorizontalBars } from '../runtime_style_templates/bar_chart/RuntimeExecutiveHorizontalBars.js';
import { DarkCompactBarRankingDemo as RuntimeDarkCompactBarRanking } from '../runtime_style_templates/bar_chart/RuntimeDarkCompactBarRanking.js';
import { DenseRankingTableDemo as RuntimeDenseRankingTable } from '../runtime_style_templates/bar_chart/RuntimeDenseRankingTable.js';
import { LightDenseRankingBarDemo as RuntimeLightDenseRankingBar } from '../runtime_style_templates/bar_chart/RuntimeLightDenseRankingBar.js';
import { CompactColumnKpiDemo as RuntimeCompactColumnKpi } from '../runtime_style_templates/bar_chart/RuntimeCompactColumnKpi.js';
import { LeaderboardCardGridDemo as RuntimeLeaderboardCardGrid } from '../runtime_style_templates/bar_chart/RuntimeLeaderboardCardGrid.js';
import { SteppedBarStripDemo as RuntimeSteppedBarStrip } from '../runtime_style_templates/bar_chart/RuntimeSteppedBarStrip.js';
import { LightWideComparisonDemo as RuntimeLightWideComparison } from '../runtime_style_templates/comparison_chart/RuntimeLightWideComparison.js';
import { LightComparisonPanelDemo as RuntimeLightComparisonPanel } from '../runtime_style_templates/comparison_chart/RuntimeLightComparisonPanel.js';
import { DarkComparisonPanelDemo as RuntimeDarkComparisonPanel } from '../runtime_style_templates/comparison_chart/RuntimeDarkComparisonPanel.js';
import { HorizontalBarMatrixDemo as RuntimeHorizontalBarMatrix } from '../runtime_style_templates/bar_chart/RuntimeHorizontalBarMatrix.js';
import { SalesByRegionDarkColumnDemo as RuntimeSalesByRegionDarkColumn } from '../runtime_style_templates/bar_chart/RuntimeSalesByRegionDarkColumn.js';
import { CoffeeRatingHorizontalRankingDemo as RuntimeCoffeeRatingHorizontalRanking } from '../runtime_style_templates/bar_chart/RuntimeCoffeeRatingHorizontalRanking.js';
import { AreaStackTrendDemo as RuntimeAreaStackTrend } from '../runtime_style_templates/line_chart/RuntimeAreaStackTrend.js';
import { SteppedLineRankingDemo as RuntimeSteppedLineRanking } from '../runtime_style_templates/line_chart/RuntimeSteppedLineRanking.js';
import { NestedRingShareDemo as RuntimeNestedRingShare } from '../runtime_style_templates/pie_chart/RuntimeNestedRingShare.js';
import { LabeledScatterGridDemo as RuntimeLabeledScatterGrid } from '../runtime_style_templates/scatter_chart/RuntimeLabeledScatterGrid.js';
import { MultiEntityScatterMatrixDemo as RuntimeMultiEntityScatterMatrix } from '../runtime_style_templates/scatter_chart/RuntimeMultiEntityScatterMatrix.js';
import { DepartmentHeadcountDarkBarDemo as RuntimeDepartmentHeadcountDarkBar } from '../runtime_style_templates/bar_chart/RuntimeDepartmentHeadcountDarkBar.js';
import { CustomerSegmentsScatterDemo as RuntimeCustomerSegmentsScatter } from '../runtime_style_templates/scatter_chart/RuntimeCustomerSegmentsScatter.js';
import { PortfolioBubbleMatrixDemo as RuntimePortfolioBubbleMatrix } from '../runtime_style_templates/scatter_chart/RuntimePortfolioBubbleMatrix.js';
import { QuarterlyRevenueGroupedBarDemo as RuntimeQuarterlyRevenueGroupedBar } from '../runtime_style_templates/comparison_chart/RuntimeQuarterlyRevenueGroupedBar.js';
import { SwissMinimalReportDemo as RuntimeSwissMinimalReport } from '../runtime_style_templates/comparison_chart/RuntimeSwissMinimalReport.js';
import { WideComparisonGridDemo as RuntimeWideComparisonGrid } from '../runtime_style_templates/comparison_chart/RuntimeWideComparisonGrid.js';
import { MarketTreemapMosaicDemo as RuntimeMarketTreemapMosaic } from '../runtime_style_templates/pie_chart/RuntimeMarketTreemapMosaic.js';
import { SegmentTreemapVerticalDemo as RuntimeSegmentTreemapVertical } from '../runtime_style_templates/pie_chart/RuntimeSegmentTreemapVertical.js';
import { SemiGaugeProgressDemo as RuntimeSemiGaugeProgress } from '../runtime_style_templates/pie_chart/RuntimeSemiGaugeProgress.js';
import { SlopeChangeRankingDemo as RuntimeSlopeChangeRanking } from '../runtime_style_templates/line_chart/RuntimeSlopeChangeRanking.js';
import { SmallMultiplesTrendDemo as RuntimeSmallMultiplesTrend } from '../runtime_style_templates/line_chart/RuntimeSmallMultiplesTrend.js';
import { RuntimeEditorialDataStory } from '../runtime_style_templates/line_chart/RuntimeEditorialDataStory.js';
import { ProductPerformanceRadarDemo as RuntimeProductPerformanceRadar } from '../runtime_style_templates/radar_chart/RuntimeProductPerformanceRadar.js';
import { RadarPerformanceProfileDemo as RuntimeRadarPerformanceProfile } from '../runtime_style_templates/radar_chart/RuntimeRadarPerformanceProfile.js';
import { LightRadarScorecardDemo as RuntimeLightRadarScorecard } from '../runtime_style_templates/radar_chart/RuntimeLightRadarScorecard.js';
import { CorrelationHeatmapMatrixDemo as RuntimeCorrelationHeatmapMatrix } from '../runtime_style_templates/heatmap/RuntimeCorrelationHeatmapMatrix.js';
import { DarkCorrelationMatrixDemo as RuntimeDarkCorrelationMatrix } from '../runtime_style_templates/heatmap/RuntimeDarkCorrelationMatrix.js';
import { WeeklyActivityHeatmapDemo as RuntimeWeeklyActivityHeatmap } from '../runtime_style_templates/heatmap/RuntimeWeeklyActivityHeatmap.js';
import { SupplyFlowSankeyDemo as RuntimeSupplyFlowSankey } from '../runtime_style_templates/flow_sankey/RuntimeSupplyFlowSankey.js';
import { SupplyChainSankeyFlowDemo as RuntimeSupplyChainSankeyFlow } from '../runtime_style_templates/flow_sankey/RuntimeSupplyChainSankeyFlow.js';
import { LongFlowSankeyDemo as RuntimeLongFlowSankey } from '../runtime_style_templates/flow_sankey/RuntimeLongFlowSankey.js';
import { LightFlowSankeyDemo as RuntimeLightFlowSankey } from '../runtime_style_templates/flow_sankey/RuntimeLightFlowSankey.js';
import { ConversionFunnelCleanDemo as RuntimeConversionFunnelClean } from '../runtime_style_templates/flow_sankey/RuntimeConversionFunnelClean.js';
import { WaterfallProfitBridgeDemo as RuntimeWaterfallProfitBridge } from '../runtime_style_templates/waterfall_chart/RuntimeWaterfallProfitBridge.js';
import { RevenueWaterfallBridgeDemo as RuntimeRevenueWaterfallBridge } from '../runtime_style_templates/waterfall_chart/RuntimeRevenueWaterfallBridge.js';
import { DarkWaterfallBridgeDemo as RuntimeDarkWaterfallBridge } from '../runtime_style_templates/waterfall_chart/RuntimeDarkWaterfallBridge.js';
import { TimelineMilestonesDemo as RuntimeTimelineMilestones } from '../runtime_style_templates/timeline/RuntimeTimelineMilestones.js';
import { TimelineMilestoneRoadmapDemo as RuntimeTimelineMilestoneRoadmap } from '../runtime_style_templates/timeline/RuntimeTimelineMilestoneRoadmap.js';
import { DarkTimelineMilestonesDemo as RuntimeDarkTimelineMilestones } from '../runtime_style_templates/timeline/RuntimeDarkTimelineMilestones.js';
import { BasicLineChartDemo as RuntimeBasicLineChart } from '../runtime_style_templates/line_chart/RuntimeBasicLineChart.js';
import { MetricTrendRibbonDemo as RuntimeMetricTrendRibbon } from '../runtime_style_templates/line_chart/RuntimeMetricTrendRibbon.js';
import { DarkEditorialTrendDemo as RuntimeDarkEditorialTrend } from '../runtime_style_templates/line_chart/RuntimeDarkEditorialTrend.js';
import { CleanTrendCardDemo as RuntimeCleanTrendCard } from '../runtime_style_templates/line_chart/RuntimeCleanTrendCard.js';
import { LightFocusLineDemo as RuntimeLightFocusLine } from '../runtime_style_templates/line_chart/RuntimeLightFocusLine.js';
import { DualSeriesPulseLineDemo as RuntimeDualSeriesPulseLine } from '../runtime_style_templates/line_chart/RuntimeDualSeriesPulseLine.js';
import { LongTrendlineDemo as RuntimeLongTrendline } from '../runtime_style_templates/line_chart/RuntimeLongTrendline.js';
import { MarginSlopeComparisonDemo as RuntimeMarginSlopeComparison } from '../runtime_style_templates/line_chart/RuntimeMarginSlopeComparison.js';
import { BasicPieChartDemo as RuntimeBasicPieChart } from '../runtime_style_templates/pie_chart/RuntimeBasicPieChart.js';
import { MarketShareDonutDemo as RuntimeMarketShareDonut } from '../runtime_style_templates/RuntimeMarketShareDonut.js';
import { DarkCompactDonutShareDemo as RuntimeDarkCompactDonutShare } from '../runtime_style_templates/pie_chart/RuntimeDarkCompactDonutShare.js';
import { LightMultiSlicePieDemo as RuntimeLightMultiSlicePie } from '../runtime_style_templates/pie_chart/RuntimeLightMultiSlicePie.js';
import { MultiSliceDonutDemo as RuntimeMultiSliceDonut } from '../runtime_style_templates/pie_chart/RuntimeMultiSliceDonut.js';
import { RaceTrackShareDemo as RuntimeRaceTrackShare } from '../runtime_style_templates/pie_chart/RuntimeRaceTrackShare.js';
import { StackedShareBarDemo as RuntimeStackedShareBar } from '../runtime_style_templates/pie_chart/RuntimeStackedShareBar.js';
import { ScatterOpportunityMapDemo as RuntimeScatterOpportunityMap } from '../runtime_style_templates/RuntimeScatterOpportunityMap.js';
import { DarkCompactScatterPanelDemo as RuntimeDarkCompactScatterPanel } from '../runtime_style_templates/scatter_chart/RuntimeDarkCompactScatterPanel.js';
import { BrightScatterGridDemo as RuntimeBrightScatterGrid } from '../runtime_style_templates/scatter_chart/RuntimeBrightScatterGrid.js';
import { DenseScatterCloudDemo as RuntimeDenseScatterCloud } from '../runtime_style_templates/scatter_chart/RuntimeDenseScatterCloud.js';
import { LightDenseScatterDemo as RuntimeLightDenseScatter } from '../runtime_style_templates/scatter_chart/RuntimeLightDenseScatter.js';
import { QuadrantSplitScatterDemo as RuntimeQuadrantSplitScatter } from '../runtime_style_templates/scatter_chart/RuntimeQuadrantSplitScatter.js';
import { KpiMicroDashboardDemo as RuntimeKpiMicroDashboard } from '../runtime_style_templates/RuntimeKpiMicroDashboard.js';
import { BasicStatCardsDemo as RuntimeBasicStatCards } from '../runtime_style_templates/stat_cards/RuntimeBasicStatCards.js';
import { DarkKpiMicroDashboardDemo as RuntimeDarkKpiMicroDashboard } from '../runtime_style_templates/stat_cards/RuntimeDarkKpiMicroDashboard.js';
import { StatCardsKpiTrioDemo as RuntimeStatCardsKpiTrio } from '../runtime_style_templates/stat_cards/RuntimeStatCardsKpiTrio.js';
import { LightHeroNumberDemo as RuntimeLightHeroNumber } from '../runtime_style_templates/stat_cards/RuntimeLightHeroNumber.js';
import { HeroNumberSpotlightDemo as RuntimeHeroNumberSpotlight } from '../runtime_style_templates/stat_cards/RuntimeHeroNumberSpotlight.js';
import { LuxuryBlackGoldMetricsDemo as RuntimeLuxuryBlackGoldMetrics } from '../runtime_style_templates/stat_cards/RuntimeLuxuryBlackGoldMetrics.js';
import { CyberCommandCenterDemo as RuntimeCyberCommandCenter } from '../runtime_style_templates/stat_cards/RuntimeCyberCommandCenter.js';
import { firstString, styleTheme } from '../runtime_style_templates/runtimeSlots.js';
// ── Adapter map: style_template_id → runtime chart component ────────────────
// IMPORTANT — this map is also the source of truth for the backend "eject" step
// (web/server.py: _parse_runtime_chart_dispatcher / _eject_runtime_chart_source).
// At quick-visual generation time the backend copies the matched template's source
// into a standalone per-task scene TSX so it gets full edit parity with the normal
// flow. The backend reads this file's `import {Export as Alias} from '...'` lines and
// the `'StyleTemplate-X': Alias,` entries below — so just keep registering templates
// here as usual; no separate backend table to update.
//
// For a new template to be ejectable (otherwise it silently falls back to the shared
// renderer — still works, just not deeply editable), it MUST follow the contract that
// every template here already follows:
//   1. One template per file under runtime_style_templates/<category>/.
//   2. Signature exactly: `export const XxxDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {`
//   3. Relative imports only from the known set: '../../scenes/EditableTransform',
//      '../runtimeSlots', '../narrationTiming', '../../style_templates/shared'
//      (add new shared deps to _RUNTIME_EJECT_IMPORT_REWRITES in server.py).
//   4. Wrap editable regions in <EditableTransform id="..." role="..."> with ids
//      unique within the file.
const RUNTIME_TEMPLATE_ADAPTERS = {
    'StyleTemplate-BasicBarChart': RuntimeBasicBarChart,
    'StyleTemplate-ExecutiveHorizontalBars': RuntimeExecutiveHorizontalBars,
    'StyleTemplate-LightDenseRankingBar': RuntimeLightDenseRankingBar,
    'StyleTemplate-DenseRankingTable': RuntimeDenseRankingTable,
    'StyleTemplate-DarkCompactBarRanking': RuntimeDarkCompactBarRanking,
    'StyleTemplate-CompactColumnKpi': RuntimeCompactColumnKpi,
    'StyleTemplate-LeaderboardCardGrid': RuntimeLeaderboardCardGrid,
    'StyleTemplate-SteppedBarStrip': RuntimeSteppedBarStrip,
    'StyleTemplate-BasicLineChart': RuntimeBasicLineChart,
    'StyleTemplate-MetricTrendRibbon': RuntimeMetricTrendRibbon,
    'StyleTemplate-LightFocusLine': RuntimeLightFocusLine,
    'StyleTemplate-DarkEditorialTrend': RuntimeDarkEditorialTrend,
    'StyleTemplate-CleanTrendCard': RuntimeCleanTrendCard,
    'StyleTemplate-DualSeriesPulseLine': RuntimeDualSeriesPulseLine,
    'StyleTemplate-LongTrendline': RuntimeLongTrendline,
    'StyleTemplate-DarkSignalTrendline': RuntimeLongTrendline,
    'StyleTemplate-MarginSlopeComparison': RuntimeMarginSlopeComparison,
    'StyleTemplate-BasicPieChart': RuntimeBasicPieChart,
    'StyleTemplate-MarketShareDonut': RuntimeMarketShareDonut,
    'StyleTemplate-DarkCompactDonutShare': RuntimeDarkCompactDonutShare,
    'StyleTemplate-LightMultiSlicePie': RuntimeLightMultiSlicePie,
    'StyleTemplate-MultiSliceDonut': RuntimeMultiSliceDonut,
    'StyleTemplate-RaceTrackShare': RuntimeRaceTrackShare,
    'StyleTemplate-StackedShareBar': RuntimeStackedShareBar,
    'StyleTemplate-ScatterOpportunityMap': RuntimeScatterOpportunityMap,
    'StyleTemplate-DarkCompactScatterPanel': RuntimeDarkCompactScatterPanel,
    'StyleTemplate-DenseScatterCloud': RuntimeDenseScatterCloud,
    'StyleTemplate-BrightScatterGrid': RuntimeBrightScatterGrid,
    'StyleTemplate-LightDenseScatter': RuntimeLightDenseScatter,
    'StyleTemplate-QuadrantSplitScatter': RuntimeQuadrantSplitScatter,
    'StyleTemplate-KpiMicroDashboard': RuntimeKpiMicroDashboard,
    'StyleTemplate-BasicStatCards': RuntimeBasicStatCards,
    'StyleTemplate-StatCardsKpiTrio': RuntimeStatCardsKpiTrio,
    'StyleTemplate-LightHeroNumber': RuntimeLightHeroNumber,
    'StyleTemplate-DarkKpiMicroDashboard': RuntimeDarkKpiMicroDashboard,
    'StyleTemplate-HeroNumberSpotlight': RuntimeHeroNumberSpotlight,
    'StyleTemplate-LuxuryBlackGoldMetrics': RuntimeLuxuryBlackGoldMetrics,
    'StyleTemplate-CyberCommandCenter': RuntimeCyberCommandCenter,
    'StyleTemplate-LightWideComparison': RuntimeLightWideComparison,
    'StyleTemplate-LightComparisonPanel': RuntimeLightComparisonPanel,
    'StyleTemplate-DarkComparisonPanel': RuntimeDarkComparisonPanel,
    'StyleTemplate-HorizontalBarMatrix': RuntimeHorizontalBarMatrix,
    'StyleTemplate-SalesByRegionDarkColumn': RuntimeSalesByRegionDarkColumn,
    'StyleTemplate-CoffeeRatingHorizontalRanking': RuntimeCoffeeRatingHorizontalRanking,
    'StyleTemplate-AreaStackTrend': RuntimeAreaStackTrend,
    'StyleTemplate-SteppedLineRanking': RuntimeSteppedLineRanking,
    'StyleTemplate-NestedRingShare': RuntimeNestedRingShare,
    'StyleTemplate-LabeledScatterGrid': RuntimeLabeledScatterGrid,
    'StyleTemplate-MultiEntityScatterMatrix': RuntimeMultiEntityScatterMatrix,
    'StyleTemplate-DepartmentHeadcountDarkBar': RuntimeDepartmentHeadcountDarkBar,
    'StyleTemplate-CustomerSegmentsScatter': RuntimeCustomerSegmentsScatter,
    'StyleTemplate-PortfolioBubbleMatrix': RuntimePortfolioBubbleMatrix,
    'StyleTemplate-QuarterlyRevenueGroupedBar': RuntimeQuarterlyRevenueGroupedBar,
    'StyleTemplate-SwissMinimalReport': RuntimeSwissMinimalReport,
    'StyleTemplate-WideComparisonGrid': RuntimeWideComparisonGrid,
    'StyleTemplate-MarketTreemapMosaic': RuntimeMarketTreemapMosaic,
    'StyleTemplate-SegmentTreemapVertical': RuntimeSegmentTreemapVertical,
    'StyleTemplate-SemiGaugeProgress': RuntimeSemiGaugeProgress,
    'StyleTemplate-SlopeChangeRanking': RuntimeSlopeChangeRanking,
    'StyleTemplate-SmallMultiplesTrend': RuntimeSmallMultiplesTrend,
    'StyleTemplate-EditorialDataStory': RuntimeEditorialDataStory,
    'StyleTemplate-ProductPerformanceRadar': RuntimeProductPerformanceRadar,
    'StyleTemplate-RadarPerformanceProfile': RuntimeRadarPerformanceProfile,
    'StyleTemplate-LightRadarScorecard': RuntimeLightRadarScorecard,
    'StyleTemplate-CorrelationHeatmapMatrix': RuntimeCorrelationHeatmapMatrix,
    'StyleTemplate-DarkCorrelationMatrix': RuntimeDarkCorrelationMatrix,
    'StyleTemplate-WeeklyActivityHeatmap': RuntimeWeeklyActivityHeatmap,
    'StyleTemplate-SupplyFlowSankey': RuntimeSupplyFlowSankey,
    'StyleTemplate-SupplyChainSankeyFlow': RuntimeSupplyChainSankeyFlow,
    'StyleTemplate-LongFlowSankey': RuntimeLongFlowSankey,
    'StyleTemplate-LightFlowSankey': RuntimeLightFlowSankey,
    'StyleTemplate-ConversionFunnelClean': RuntimeConversionFunnelClean,
    'StyleTemplate-WaterfallProfitBridge': RuntimeWaterfallProfitBridge,
    'StyleTemplate-RevenueWaterfallBridge': RuntimeRevenueWaterfallBridge,
    'StyleTemplate-DarkWaterfallBridge': RuntimeDarkWaterfallBridge,
    'StyleTemplate-TimelineMilestones': RuntimeTimelineMilestones,
    'StyleTemplate-TimelineMilestoneRoadmap': RuntimeTimelineMilestoneRoadmap,
    'StyleTemplate-DarkTimelineMilestones': RuntimeDarkTimelineMilestones,
};
const runtimeTemplateId = (sceneContent, scene) => firstString(sceneContent?.style_template_id, scene?.renderer?.style_template_id, scene?.content?.style_template_id);
const runtimeAdapterFallbackId = (sceneContent) => {
    const chartType = String(sceneContent?.chart_type ?? '').toLowerCase();
    const sourceChartType = String(sceneContent?.source_chart_type ?? '').toLowerCase();
    const theme = styleTheme(sceneContent);
    if (chartType === 'stat_cards') {
        return theme === 'dark' ? 'StyleTemplate-DarkKpiMicroDashboard' : 'StyleTemplate-KpiMicroDashboard';
    }
    if (chartType === 'scatter_chart') {
        return theme === 'dark' ? 'StyleTemplate-DarkCompactScatterPanel' : 'StyleTemplate-BrightScatterGrid';
    }
    if (chartType === 'pie_chart') {
        return theme === 'dark' ? 'StyleTemplate-RaceTrackShare' : 'StyleTemplate-MarketShareDonut';
    }
    if (chartType === 'line_chart') {
        return theme === 'dark' ? 'StyleTemplate-DualSeriesPulseLine' : 'StyleTemplate-MetricTrendRibbon';
    }
    if (sourceChartType === 'comparison_chart') {
        return theme === 'dark' ? 'StyleTemplate-DarkCompactBarRanking' : 'StyleTemplate-LightWideComparison';
    }
    return theme === 'dark' ? 'StyleTemplate-CompactColumnKpi' : 'StyleTemplate-ExecutiveHorizontalBars';
};
const resolveRuntimeTemplateId = (sceneContent, scene) => {
    const explicit = runtimeTemplateId(sceneContent, scene);
    return RUNTIME_TEMPLATE_ADAPTERS[explicit] ? explicit : runtimeAdapterFallbackId(sceneContent);
};
export const hasRuntimeStyleTemplateAdapter = (templateId) => typeof templateId === 'string' && Boolean(RUNTIME_TEMPLATE_ADAPTERS[templateId]);
export const RuntimeStyleTemplateScene = ({ sceneContent, scene }) => {
    const templateId = resolveRuntimeTemplateId(sceneContent, scene);
    const Adapter = RUNTIME_TEMPLATE_ADAPTERS[templateId];
    return React.createElement(Adapter, { sceneContent: sceneContent, scene: scene });
};
