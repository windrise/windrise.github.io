/** Native Vue frame primitives and numerical easing, with no Remotion runtime. */
import {computed, defineComponent, h, inject, provide, ref, watch, onMounted, onBeforeUnmount, nextTick} from 'vue';
import React, {normalizeStyle} from './vue-runtime';
import assetReplacements from '../assets-replacements/mapping.json';
export type VideoConfig={fps:number;width:number;height:number;durationInFrames:number;id?:string};
export const MotionContext=Symbol('DataMagicFrame');
const defaults={frame:0,fps:30,width:1920,height:1080,durationInFrames:300,assetBase:'/datamagic/'};
export const MotionProvider=defineComponent({name:'MotionProvider',inheritAttrs:false,props:['frame','fps','width','height','durationInFrames','assetBase'],setup(props,{slots}){
  provide(MotionContext,computed(()=>Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,(props as any)[k]??v]))));
  return()=>slots.default?.();
}});
function context():any {const ctx:any=inject(MotionContext,null);return ctx?.value??defaults;}
export function useCurrentFrame():number {return context().frame;}
export function useVideoConfig():VideoConfig {const {fps,width,height,durationInFrames}=context();return {fps,width,height,durationInFrames};}
export const AbsoluteFill=({style,children,...props}:any)=>React.createElement('div',{...props,style:{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%',display:'flex',flexDirection:'column',...style}},children);
export const Img=({children,...props}:any)=>React.createElement('img',props);
export function staticFile(path:string):string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const source=path.replace(/^\//,'');
  const replacement=assetReplacements.mappings.find(item=>item.source===source)?.replacement;
  return `${context().assetBase.replace(/\/$/,'')}/${replacement?'replacements/'+replacement:source}`;
}
export const Freeze=defineComponent({name:'Freeze',inheritAttrs:false,props:['frame','active'],setup(props,{slots}){
  const parent:any=inject(MotionContext,computed(()=>defaults));
  provide(MotionContext,computed(()=>({...parent.value,frame:props.active===false?parent.value.frame:Number(props.frame??0)})));
  return()=>slots.default?.();
}});
export const Sequence=defineComponent({name:'Sequence',inheritAttrs:false,props:['from','durationInFrames','layout'],setup(props,{slots}){
  const parent:any=inject(MotionContext,computed(()=>defaults));
  provide(MotionContext,computed(()=>({...parent.value,frame:parent.value.frame-Number(props.from??0)})));
  return()=>{const f=parent.value.frame-Number(props.from??0);if(f<0||f>=Number(props.durationInFrames??Infinity))return null;return props.layout==='none'?slots.default?.():h('div',{style:{position:'absolute',inset:0}},slots.default?.());};
}});
/** Paused video seeks to the frame context. Browser decoding is asynchronous, not export-grade frame extraction. */
export const OffthreadVideo=defineComponent({name:'FrameVideo',inheritAttrs:false,setup(_,{attrs}){
  const parent:any=inject(MotionContext,computed(()=>defaults));
  const video=ref<HTMLVideoElement|null>(null),duration=ref(Infinity);
  const ready=ref(false),revision=ref(0),presentedTime=ref<number|null>(null),error=ref<string|null>(null);
  const requestedTime=computed(()=>Math.max(0,parent.value.frame*Number(attrs.playbackRate??1)+Number(attrs.startFrom??attrs.trimBefore??0))/parent.value.fps);
  const targetTime=computed(()=>Math.min(requestedTime.value,Number.isFinite(duration.value)?Math.max(0,duration.value-1/parent.value.fps):Infinity));
  let callback:number|undefined,raf:number|undefined,disposed=false;
  let presentedRevision=-1;
  const cancelPending=()=>{const el=video.value;if(callback!==undefined&&el?.cancelVideoFrameCallback)el.cancelVideoFrameCallback(callback);callback=undefined;if(raf!==undefined)cancelAnimationFrame(raf);raf=undefined;};
  const atTarget=()=>{const el=video.value;return !!el&&el.readyState>=2&&!el.seeking&&Math.abs(el.currentTime-targetTime.value)<.0001;};
  // Two animation frames also allow the newly decoded image to reach the compositor.
  const finish=()=>{const version=revision.value;if(!atTarget()||ready.value)return;if(video.value?.requestVideoFrameCallback&&presentedRevision!==version)return;
    if(raf!==undefined)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{raf=requestAnimationFrame(()=>{raf=undefined;if(!disposed&&revision.value===version&&atTarget()&&(!video.value?.requestVideoFrameCallback||presentedRevision===version))ready.value=true;});});
  };
  const awaitPresentedFrame=()=>{const el=video.value;if(!el||!el.requestVideoFrameCallback||callback!==undefined)return;const version=revision.value;
    callback=el.requestVideoFrameCallback((_now,metadata)=>{callback=undefined;if(disposed||version!==revision.value)return;
      // mediaTime is a decoded source-frame timestamp, which can precede the exact seek time.
      presentedTime.value=metadata.mediaTime;
      if(Math.abs(metadata.mediaTime-targetTime.value)<=1/parent.value.fps+.001){presentedRevision=version;finish();}
      else awaitPresentedFrame();
    });
  };
  const seek=()=>{const el=video.value;if(!el||disposed)return;el.pause();if(el.readyState<1)return;
    const alreadyPresented=presentedTime.value!==null&&Math.abs(presentedTime.value-targetTime.value)<=1/parent.value.fps+.001;
    if(Math.abs(el.currentTime-targetTime.value)>.0001){awaitPresentedFrame();el.currentTime=targetTime.value;}
    else if(!el.seeking&&el.readyState>=2&&alreadyPresented){presentedRevision=revision.value;finish();}
    else {awaitPresentedFrame();finish();}
  };
  watch(()=>[targetTime.value,attrs.src],(_value,previous)=>{
    cancelPending();revision.value++;ready.value=false;error.value=null;presentedRevision=-1;
    // Clear the DOM flag immediately, before Vue's next DOM patch or media events.
    if(video.value)video.value.dataset.frameReady='false';
    if(previous&&previous[1]!==attrs.src){duration.value=Infinity;presentedTime.value=null;}
    nextTick(seek);
  },{flush:'sync',immediate:true});
  const metadata=()=>{duration.value=video.value?.duration??Infinity;seek();};
  const loaded=()=>{seek();finish();};
  const failed=()=>{ready.value=false;error.value=video.value?.error?.message||'Media failed to load or decode';};
  onMounted(()=>{awaitPresentedFrame();seek();});
  onBeforeUnmount(()=>{disposed=true;cancelPending();video.value?.pause();});
  return()=>{const {startFrom,trimBefore,endAt,trimAfter,playbackRate,children,...rest}=attrs;
    if (/\.(svg|png|webp|jpe?g)(?:[?#]|$)/i.test(String(attrs.src??''))) return h('img',{src:attrs.src,alt:attrs.alt??'Illustrative replacement for source footage',style:normalizeStyle(attrs.style),'data-media-replacement':'still-image'});
    return h('video',{...rest,ref:video,style:normalizeStyle(attrs.style),muted:attrs.muted??true,playsinline:true,preload:'auto',onLoadedmetadata:metadata,onLoadeddata:loaded,onCanplay:finish,onSeeked:finish,onError:failed,
      'data-frame-seek':parent.value.frame,'data-frame-target-time':targetTime.value,'data-frame-ready':String(ready.value),'data-frame-version':revision.value,'data-frame-presented-time':presentedTime.value??'','data-frame-error':error.value??''});
  };
}});
export const Audio=OffthreadVideo;
export type Extrapolation='extend'|'clamp'|'identity'|'wrap';
export function interpolate(value:number,input:number[],output:number[],options:{easing?:(x:number)=>number;extrapolateLeft?:Extrapolation;extrapolateRight?:Extrapolation}={}) {
  if(input.length<2||input.length!==output.length)throw Error('interpolate requires equally sized ranges with at least two values');
  if(input.some((v,i)=>i>0&&v<=input[i-1]))throw Error('interpolate input must increase strictly');
  let x=value;const first=input[0],last=input[input.length-1];const mode=x<first?options.extrapolateLeft:x>last?options.extrapolateRight:undefined;
  if(mode==='identity')return x;if(mode==='clamp')x=Math.max(first,Math.min(last,x));if(mode==='wrap')x=first+(((x-first)%(last-first))+(last-first))%(last-first);
  let i=0;while(i<input.length-2&&x>=input[i+1])i++;
  const t=(x-input[i])/(input[i+1]-input[i]);return output[i]+(output[i+1]-output[i])*(options.easing??Easing.linear)(t);
}
function bezier(x1:number,y1:number,x2:number,y2:number) {const axis=(t:number,a:number,b:number)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;return (x:number)=>{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1;for(let i=0;i<45;i++){const m=(lo+hi)/2;if(axis(m,x1,x2)<x)lo=m;else hi=m;}return axis((lo+hi)/2,y1,y2);};}
export const Easing={linear:(x:number)=>x,quad:(x:number)=>x*x,cubic:(x:number)=>x*x*x,poly:(n:number)=>(x:number)=>x**n,sin:(x:number)=>1-Math.cos(x*Math.PI/2),circle:(x:number)=>1-Math.sqrt(1-x*x),exp:(x:number)=>2**(10*(x-1)),bezier,in:(f:(x:number)=>number)=>f,out:(f:(x:number)=>number)=>(x:number)=>1-f(1-x),inOut:(f:(x:number)=>number)=>(x:number)=>x<.5?f(x*2)/2:1-f((1-x)*2)/2};
type SpringConfig={damping?:number;mass?:number;stiffness?:number;overshootClamping?:boolean};
const calculations=new Map<string,{position:number;velocity:number;time:number}>();
function springPosition(frame:number,fps:number,config:SpringConfig) {
  const damping=config.damping??10,mass=config.mass??1,stiffness=config.stiffness??100;
  if(!(fps>0&&damping>0&&mass>0&&stiffness>0))throw Error('Spring parameters must be positive');
  const key=`${fps}/${damping}/${mass}/${stiffness}/`;const f=Math.max(0,frame);const cached=calculations.get(key+f);if(cached)return cached.position;
  const prev=Math.ceil(f)-1;let state=calculations.get(key+prev);let start=prev+1;if(!state){state={position:0,velocity:0,time:0};start=0;}
  const step=(at:number)=>{const time=at/fps;const t=Math.min((time-state!.time),.064);const w=Math.sqrt(stiffness/mass),z=damping/(2*Math.sqrt(stiffness*mass));const x=1-state!.position,v=-state!.velocity;let position:number,velocity:number;
    if(z<1){const wd=w*Math.sqrt(1-z*z),env=Math.exp(-z*w*t),a=(v+z*w*x)/wd,s=Math.sin(wd*t),c=Math.cos(wd*t),frag=env*(a*s+x*c);position=1-frag;velocity=z*w*frag-env*(c*(v+z*w*x)-wd*x*s);}
    else{const env=Math.exp(-w*t);position=1-env*(x+(v+w*x)*t);velocity=env*(v*(t*w-1)+t*x*w*w);}
    state={position,velocity,time};};
  for(let n=start;n<=Math.floor(f);n++){step(n);calculations.set(key+n,state!);}if(f%1)step(f);calculations.set(key+f,state!);return state!.position;
}
const durations=new Map<string,number>();
export function measureSpring({fps,config={},threshold=.005}:{fps:number;config?:SpringConfig;threshold?:number}) {if(threshold===0)return Infinity;if(threshold===1)return 0;if(!(threshold>0&&Number.isFinite(threshold)))throw Error('Invalid spring threshold');const key=JSON.stringify([fps,config,threshold]);if(durations.has(key))return durations.get(key)!;let frame=0;while(Math.abs(1-springPosition(frame,fps,config))>=threshold){if(++frame>100000)throw Error('Spring failed to settle');}let finished=frame;for(let i=0;i<20;i++){frame++;if(Math.abs(1-springPosition(frame,fps,config))>=threshold){i=0;finished=frame+1;}}durations.set(key,finished);return finished;}
export function spring({frame,fps,config={},from=0,to=1,durationInFrames,durationRestThreshold,delay=0,reverse=false}:{frame:number;fps:number;config?:SpringConfig;from?:number;to?:number;durationInFrames?:number;durationRestThreshold?:number;delay?:number;reverse?:boolean}) {
  const natural=reverse||durationInFrames!==undefined?measureSpring({fps,config,threshold:durationRestThreshold}):0;
  const elapsed=(reverse?(durationInFrames??natural)-frame:frame)+(reverse?delay:-delay);
  if(durationInFrames&&elapsed>durationInFrames)return to;
  const f=durationInFrames===undefined?elapsed:elapsed/(durationInFrames/natural);
  let p=springPosition(f,fps,config);if(config.overshootClamping)p=Math.min(p,1);return from+(to-from)*p;
}
// Font-load lifecycle is handled by the browser; these only preserve upstream setup call signatures.
export const delayRender=(_label?:string)=>0;
export const continueRender=(_handle?:number)=>{};
export const cancelRender=(error:any)=>{throw error instanceof Error?error:new Error(String(error));};
