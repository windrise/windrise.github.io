import test from 'node:test';
import assert from 'node:assert/strict';
import {rankedFrame,timelineFrame} from '../recipes/motion.mjs';
const rows=[{label:'A',value:72},{label:'B',value:90},{label:'C',value:54}];
test('ranked starts at zero and ends at exact values without reordering',()=>{assert.deepEqual(rankedFrame(rows,0).map(r=>r.shown),[0,0,0]);assert.deepEqual(rankedFrame(rows,1).map(r=>r.shown),[72,90,54]);assert.deepEqual(rankedFrame(rows,1).map(r=>r.width),[80,100,60]);});
test('frames are deterministic and widths share displayed values',()=>{for(const t of [0,.2,.5,.8,1]){assert.deepEqual(rankedFrame(rows,t),rankedFrame(rows,t));for(const r of rankedFrame(rows,t))assert.ok(Math.abs(r.width-r.shown/90*100)<1e-8);}});
test('invalid ranked data rejected; all-zero remains finite',()=>{assert.throws(()=>rankedFrame([{value:-1},{value:2}],1));assert.throws(()=>rankedFrame([{value:2}],1));assert.equal(rankedFrame([{value:0},{value:0}],1)[0].width,0);});
test('timeline clamps endpoints and interpolates without invented samples',()=>{const p=[{value:0},{value:10},{value:0}];assert.equal(timelineFrame(p,-1).value,0);assert.equal(timelineFrame(p,.25).value,5);assert.equal(timelineFrame(p,.5).value,10);assert.equal(timelineFrame(p,2).value,0);assert.throws(()=>timelineFrame([{value:NaN}],1));});
