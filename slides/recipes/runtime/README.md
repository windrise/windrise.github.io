# Native Vue recipe runtime

This adapter retains the original recipe functions as distinct Vue-rendered implementations. It contains no React, ReactDOM, Remotion Player or Remotion renderer dependency. `React` is only the source-compatible JSX factory name used by the transpiler. It creates genuine Vue VNodes and wraps each function in a Vue component; it does not render into an iframe or play a pre-rendered animation.

## Player API

```ts
import {h} from 'vue'
import React from './vue-runtime'
import {MotionProvider} from './motion-runtime'
h(MotionProvider, {frame, fps:30, width:1920, height:1080,
  durationInFrames:300, assetBase:'/datamagic/'},
  {default:()=>React.createElement(RecipeComponent, recipeProps)})
```

Changing `frame` updates reactive context consumers. Nested Freeze and Sequence contexts override only their subtree. Recipe component props and scene layout overrides remain editable. Map the upstream EditableTransform module to `EditableTransform.ts` here.

## Fidelity and limits

- AbsoluteFill, SVG attributes, React numeric CSS units, nested JSX children, scene context, saved translate/scale/rotate transforms, interpolation and easing are preserved.
- Spring positions use the same per-frame damped oscillator recurrence, 64 ms step cap, critical-damping fallback, fractional-frame step, 0.005 default duration threshold and 20-frame settling check as the inspected Remotion spring algorithm. There is no spring approximation based on generic CSS transitions. The numerical implementation is independent of the Remotion runtime. Algorithm references: https://github.com/remotion-dev/remotion/tree/main/packages/core/src/spring and https://www.remotion.dev/docs/spring .
- OffthreadVideo is a paused native HTML video seeking to `frame/fps`, including Freeze. This is **not** Remotion's off-thread FFmpeg frame extraction. Seek completion is asynchronous, browsers may choose nearby decoded frames, and exports require waiting for decoded media. Video fidelity is not certified frame-for-frame. When an asset is intentionally replaced with SVG/PNG/WebP/JPEG, the runtime renders that still image and marks it `data-media-replacement="still-image"`; it does not pretend to animate the replacement footage.
- `EditableTransform` retains initial/saved transforms and positioning but omits upstream pointer selection, resize handles, inline text editing and cross-window editor events. Change recipe JSON/layout overrides instead.
- Font lifecycle functions preserve call signatures but do not block a browser render. Wait for `document.fonts.ready` before capture. Browser fonts, antialiasing and native video decode can differ from the source rendering environment.
- This is a recipe-specific JSX compatibility surface, not a complete React implementation. The imported hooks are supported for these functional renderers. React classes, portals, concurrent effects and a general React component ecosystem are not supported. None are required by the selected card render graph.
- Composition/Folder/registerRoot and studio-specific APIs are intentionally not supplied: the Slidev player owns composition selection and timing.

## Tests

Run `node recipes/runtime/run-tests.mjs` from `slides`. Uses the existing TypeScript compiler to transpile a temporary local test tree and Node's test runner. Covers interpolation, easing, closed-form spring values, natural duration, unit conversion, true Vue SSR, nested frame contexts, SVG attributes and saved transforms.

### Full-catalog SSR smoke test

Run `node recipes/runtime/smoke-all.mjs` from `slides`. It traverses the actual registry dependency graph, transpiles source/JSON into a temporary directory, and renders all 139 samples at frame 0, midpoint and final frame with Vue's server renderer. It rejects missing entries, trivial/empty markup, non-finite geometry attributes, render exceptions and Vue warnings. The temporary files are deleted and generated sources are not modified. Latest run: **417/417 frames passed; 22,684 elements; zero errors or warnings**. This is supplementary structural validation, not browser layout, screenshot equivalence, font loading or video decoding validation.
