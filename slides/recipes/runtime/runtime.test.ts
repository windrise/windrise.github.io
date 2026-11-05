import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp,h} from 'vue';
import {renderToString} from '@vue/server-renderer';
import React,{normalizeStyle,useContext} from './vue-runtime';
import {MotionProvider,Freeze,Sequence,AbsoluteFill,OffthreadVideo,interpolate,Easing,spring,measureSpring,useCurrentFrame,useVideoConfig,staticFile} from './motion-runtime';
import {EditableTransform,EditableSceneContext} from './EditableTransform';
const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);
test('piecewise interpolation, extrapolation and cubic Bezier',()=>{
 close(interpolate(15,[0,10,20],[0,100,50]),75);
 close(interpolate(-3,[0,10],[0,100],{extrapolateLeft:'clamp'}),0);
 close(interpolate(-3,[0,10],[0,100],{extrapolateLeft:'identity'}),-3);
 close(interpolate(12,[0,10],[0,100],{extrapolateRight:'wrap'}),20);
 close(Easing.bezier(.42,0,.58,1)(.5),.5);
 close(Easing.out(Easing.quad)(.5),.75);
});
test('spring matches closed form at 30 fps including critical damping and duration',()=>{
 close(spring({frame:15,fps:30,config:{damping:180}}),1-Math.exp(-5)*(1+5));
 const t=.5,w=10,z=.5,wd=w*Math.sqrt(1-z*z);
 close(spring({frame:15,fps:30}),1-Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t)));
 assert.equal(spring({frame:-5,fps:30}),0);
 assert.equal(spring({frame:31,fps:30,durationInFrames:30}),1);
 assert.equal(measureSpring({fps:30,config:{damping:180}}),23);
 close(spring({frame:15,fps:30,durationInFrames:30,config:{damping:180}}),spring({frame:11.5,fps:30,config:{damping:180}}));
});
test('numeric CSS is converted but unitless and SVG values preserved',()=>{
 assert.deepEqual(normalizeStyle({width:120,opacity:.4,lineHeight:1.2,zIndex:2,'--step':3,margin:0,WebkitLineClamp:2}),{width:'120px',opacity:.4,lineHeight:1.2,zIndex:2,'--step':3,margin:0,WebkitLineClamp:2});
});
test('true Vue SSR preserves nested frame contexts, props children, SVG attrs and saved transforms',async()=>{
 const Read=()=>React.createElement('span',{'data-frame':useCurrentFrame(),'data-width':useVideoConfig().width},staticFile('photo.png'));
 const Card=()=>React.createElement(AbsoluteFill,{style:{fontSize:24}},React.createElement(Read),React.createElement(Freeze,{frame:7},React.createElement(Read)),React.createElement(Sequence,{from:10,layout:'none'},React.createElement(Read)),React.createElement(EditableSceneContext.Provider,{value:{sceneContent:{layout_overrides:{title:{transform:{x:42,rotation:12}}}}}},React.createElement(EditableTransform,{id:'title'},React.createElement('svg',null,React.createElement('path',{strokeWidth:4,fillRule:'evenodd',fontSize:24,fontFamily:'Inter'})))));
 const html=await renderToString(createSSRApp({render:()=>h(MotionProvider,{frame:20,width:1000,assetBase:'/assets/dm'},()=>React.createElement(Card))}));
 assert.match(html,/data-frame="20" data-width="1000"/);assert.match(html,/data-frame="7"/);assert.match(html,/data-frame="10"/);assert.match(html,/font-size:24px/);assert.match(html,/\/assets\/dm\/photo.png/);assert.match(html,/translate\(42px, 0px\) scale\(1\) rotate\(12deg\)/);assert.match(html,/stroke-width="4"/);assert.match(html,/fill-rule="evenodd"/);assert.match(html,/font-size="24"/);assert.match(html,/font-family="Inter"/);
});

test('central asset mapping is applied to original JSON and footage substitution is an image',async()=>{
 const Card=()=>React.createElement(OffthreadVideo,{src:staticFile('assets/recycling-facility-plate.mp4'),style:{width:800,height:450,objectFit:'cover'}});
 const html=await renderToString(createSSRApp({render:()=>h(MotionProvider,{frame:80,assetBase:'/slides/datamagic/'},()=>React.createElement(Card))}));
 assert.match(html,/<img /);assert.match(html,/src="\/slides\/datamagic\/replacements\/recycling-facility-plate.svg"/);assert.match(html,/data-media-replacement="still-image"/);assert.match(html,/width:800px;height:450px;object-fit:cover/);assert.doesNotMatch(html,/<video/);
});
