// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { useCurrentFrame, useVideoConfig } from '../../../../../runtime/motion-runtime.ts';
export const useNarrationSyncedFrame = (sceneContent, scene, baseFrames = 120) => {
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const safeFps = fps || 30;
    const cues = Array.isArray(sceneContent?.narration_cues) ? sceneContent.narration_cues : [];
    if (!cues.length)
        return rawFrame;
    const lastCue = cues[cues.length - 1];
    const cueEnd = Number(lastCue?.end);
    if (!Number.isFinite(cueEnd) || cueEnd <= 0)
        return rawFrame;
    const sceneRange = Array.isArray(scene?.time_range) ? scene.time_range : [];
    const sceneDuration = Number(sceneRange[1]) - Number(sceneRange[0]);
    const durationSeconds = Math.max(cueEnd, Number.isFinite(sceneDuration) && sceneDuration > 0 ? sceneDuration : cueEnd);
    const targetFrames = Math.max(baseFrames, durationSeconds * safeFps);
    return rawFrame * (baseFrames / targetFrames);
};
