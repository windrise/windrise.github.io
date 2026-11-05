// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../../../../runtime/vue-runtime.ts';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from '../../../../../../runtime/motion-runtime.ts';
import { EditableTransform } from '../../scenes/EditableTransform.js';
import { formatCompact, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate } from '../runtimeSlots.js';
import { useNarrationSyncedFrame } from '../narrationTiming.js';
const ease = (frame, input, output) => interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
});
export const HeroNumberSpotlightDemo = ({ sceneContent, scene }) => {
    const frame = useNarrationSyncedFrame(sceneContent, scene);
    const rawFrame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const safeFps = fps ?? 30;
    const animation = runtimeAnimationContract('stat', scene, rawFrame, safeFps);
    const cards = runtimeCards(sceneContent, scene);
    const palette = paletteFor(sceneContent, true);
    const hero = cards[0];
    const secondary = cards[1];
    const accent = hero?.color || sceneContent?.style?.accent || palette[0] || '#38bdf8';
    const p = spring({
        frame: frame - 6,
        fps: safeFps,
        config: { damping: 180, stiffness: 130 },
        durationInFrames: 36,
    });
    const title = slotTitle(sceneContent) || hero?.label || '';
    const value = hero?.displayValue || (hero ? formatCompact(hero.value, hero.label) : '');
    const subtitle = hero?.subtitle || sceneContent?.description || secondary?.subtitle || '';
    if (!hero || !title || !value)
        return null;
    const heroActive = runtimeContractMatches(animation, hero.label, title);
    const emphasis = runtimeContractEase(animation);
    const heroOpacity = runtimeContractOpacity(animation, heroActive, 1);
    return (React.createElement(AbsoluteFill, { style: { background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden' } },
        React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 62%, #020617 100%)' } }),
        React.createElement("div", { style: { position: 'absolute', left: 92, top: 74, width: 112, height: 4, borderRadius: 999, background: accent, opacity: ease(frame, [0, 20], [0, 1]) } }),
        React.createElement("div", { style: { position: 'absolute', left: 178, top: 138, right: 178, bottom: 132, border: heroActive ? `2px solid ${animation.accent}` : '1px solid rgba(148,163,184,0.20)', boxShadow: heroActive ? `${animation.glow}, 0 0 0 ${8 + emphasis * 8}px rgba(56,189,248,0.10)` : 'none', opacity: ease(frame, [0, 28], [0, heroOpacity]) } }),
        heroActive ? React.createElement("div", { style: { position: 'absolute', left: 320, right: 320, top: 150, height: 250, borderRadius: 28, background: `radial-gradient(ellipse at center, ${animation.accent}2f, transparent 66%)`, opacity: 0.58 + emphasis * 0.28 } }) : null,
        React.createElement(EditableTransform, { id: "runtime-hero-spotlight-value", role: "metric", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: value.length > 10 ? 188 : 174,
                    textAlign: 'center',
                    fontSize: value.length > 10 ? 92 : 136,
                    lineHeight: 1,
                    fontWeight: 920,
                    letterSpacing: 0,
                    color: heroActive ? animation.accent : '#ffffff',
                    opacity: ease(frame, [8, 34], [0, heroOpacity]),
                    transform: `scale(${0.86 + p * 0.14 + (heroActive ? 0.025 + emphasis * 0.018 : 0)})`,
                    filter: heroActive ? animation.glow : undefined,
                    fontVariantNumeric: 'tabular-nums',
                } }, truncate(value, 18))),
        React.createElement(EditableTransform, { id: "runtime-hero-spotlight-title", role: "title", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 150, right: 150, top: 360, textAlign: 'center', fontSize: 43, lineHeight: 1.12, fontWeight: 880, color: '#f8fafc', opacity: ease(frame, [28, 58], [0, heroOpacity]) } }, truncate(title, 74))),
        React.createElement("div", { style: { position: 'absolute', left: '50%', top: 430, transform: 'translateX(-50%)', width: 180 * ease(frame, [38, 64], [0, 1]), height: 3, borderRadius: 999, background: accent } }),
        React.createElement(EditableTransform, { id: "runtime-hero-spotlight-subtitle", role: "subtitle", style: { display: 'block' } },
            React.createElement("div", { "data-dm-text-editable": true, style: { position: 'absolute', left: 250, right: 250, top: 470, textAlign: 'center', fontSize: 21, lineHeight: 1.42, fontWeight: 620, color: 'rgba(226,232,240,0.72)', opacity: ease(frame, [42, 72], [0, Math.max(0.72, heroOpacity)]) } }, truncate(subtitle, 136)))));
};
