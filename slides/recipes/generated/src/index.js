// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import { registerRoot } from '../../runtime/motion-runtime.ts';
import React from '../../runtime/vue-runtime.ts';
import { ShotCraftRoot } from './Root.js';
import { RuntimeCardsRoot } from './runtime/RuntimeCardsRoot.js';
import './stableFonts.js';
registerRoot(() => React.createElement(React.Fragment, null, React.createElement(ShotCraftRoot), React.createElement(RuntimeCardsRoot)));
