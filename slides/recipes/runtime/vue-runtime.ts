/** JSX-to-Vue compatibility surface. This is not React and does not use ReactDOM. */
import {Fragment, h, defineComponent, inject, provide, computed, unref, shallowRef, getCurrentInstance, onBeforeUnmount, nextTick} from 'vue';
export {Fragment};
const wrappers = new WeakMap<Function, any>();
const unitless = new Set(('animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth').split(' '));
export function normalizeStyle(style: any): any {
  if (!style || typeof style !== 'object') return style;
  if (Array.isArray(style)) return style.map(normalizeStyle);
  return Object.fromEntries(Object.entries(style).map(([k,v]) => [k, typeof v === 'number' && v !== 0 && !k.startsWith('--') && !unitless.has(k) && !unitless.has(k.replace(/^(Webkit|Moz|ms|O)/, '').replace(/^./, s=>s.toLowerCase())) ? `${v}px` : v]));
}
const svgNames: Record<string,string> = Object.fromEntries(('fontSize fontFamily fontWeight fontStyle fontVariant fontStretch letterSpacing wordSpacing alignmentBaseline baselineShift textDecoration strokeWidth strokeLinecap strokeLinejoin strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity fillRule fillOpacity clipRule clipPath floodColor floodOpacity stopColor stopOpacity colorInterpolation colorInterpolationFilters dominantBaseline textAnchor vectorEffect paintOrder').split(' ').map(k=>[k,k.replace(/[A-Z]/g,s=>'-'+s.toLowerCase())]));
type HookState = {cursor:number; cells:any[]};
let active: HookState | null = null;
function component(fn: Function) {
  if (!wrappers.has(fn)) wrappers.set(fn, defineComponent({name: fn.name || 'RecipeElement', inheritAttrs:false,
    setup(_, {attrs}) {
      const state: HookState = {cursor:0,cells:[]};
      onBeforeUnmount(()=>state.cells.forEach(c=>c?.cleanup?.()));
      return () => {const previous=active; active=state; state.cursor=0; try{return fn({...attrs});} finally {active=previous;}};
    }
  }));
  return wrappers.get(fn);
}
export function createElement(type:any, supplied:any, ...children:any[]):any {
  const props = {...(supplied || {})};
  const content = children.length ? children : props.children === undefined ? [] : [props.children];
  if (typeof type === 'function') return h(component(type), {...props, children:content.length===1?content[0]:content});
  if (typeof type !== 'string' && type !== Fragment) return h(type, props, {default:()=>content});
  delete props.children;
  if (props.className !== undefined) {props.class=props.className; delete props.className;}
  if (props.htmlFor !== undefined) {props.for=props.htmlFor;delete props.htmlFor;}
  if (props.style) props.style=normalizeStyle(props.style);
  for (const [name, mapped] of Object.entries(svgNames)) if (name in props) {props[mapped]=props[name];delete props[name];}
  if (props.dangerouslySetInnerHTML) {props.innerHTML=props.dangerouslySetInnerHTML.__html; delete props.dangerouslySetInnerHTML;}
  if (props.ref && typeof props.ref==='object' && 'current' in props.ref) {const ref=props.ref;props.ref=(el:any)=>{ref.current=el;};}
  return h(type, props, content.flat(Infinity).filter(c=>c!==null && c!==undefined && typeof c!=='boolean'));
}
export function createContext<T>(fallback:T) {
  const key=Symbol('RecipeContext');
  const Provider=defineComponent({inheritAttrs:false,props:['value'],setup(props,{slots}){provide(key,computed(()=>props.value));return()=>slots.default?.();}});
  return {key,fallback,Provider};
}
export function useContext<T>(context:{key:symbol;fallback:T}):T {return unref(inject(context.key,context.fallback) as any);}
function cell(init:()=>any) {if (!active) throw Error('Recipe hook called outside a Vue recipe render');const index=active.cursor++;return active.cells[index]??(active.cells[index]=init());}
export function useState<T>(initial:T|(()=>T)):[T,(value:T|((old:T)=>T))=>void] {const c=cell(()=>({state:shallowRef(typeof initial==='function'?(initial as Function)():initial)}));return [c.state.value,(value:any)=>{c.state.value=typeof value==='function'?value(c.state.value):value;}];}
export function useRef<T>(initial:T) {return cell(()=>({current:initial}));}
export function useMemo<T>(fn:()=>T,deps?:any[]):T {const c=cell(()=>({}));if (!deps || !c.deps || deps.some((x,i)=>!Object.is(x,c.deps[i]))) {c.value=fn();c.deps=deps?.slice();}return c.value;}
export function useEffect(fn:()=>void|(()=>void),deps?:any[]) {const c=cell(()=>({}));if (!deps || !c.deps || deps.some((x,i)=>!Object.is(x,c.deps[i]))) {c.deps=deps?.slice();nextTick(()=>{c.cleanup?.();c.cleanup=fn();});}}
export const useLayoutEffect=useEffect;
export const useCallback=(fn:any,deps?:any[])=>useMemo(()=>fn,deps);
const React={createElement,Fragment,createContext,useContext,useState,useMemo,useRef,useEffect,useLayoutEffect,useCallback};
export default React;
