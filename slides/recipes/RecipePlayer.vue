<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { rankedFrame, timelineFrame } from './motion.mjs'
const props = defineProps({ sourceLabel: {type:String, default:'合成演示数据 · SYNTHETIC DATA'}, kind: { default: 'ranked', type: String }, rows: { type: Array, default: () => [{label:'方案 A',value:72},{label:'方案 B',value:90},{label:'方案 C',value:54}] }, points: { type: Array, default: () => [{label:'Q1',value:28},{label:'Q2',value:42},{label:'Q3',value:36},{label:'Q4',value:78}] }, unit: { type:String, default:'分' } })
const progress = ref(1), playing = ref(false), reduced = ref(false)
let raf, last, media
const bars = computed(() => rankedFrame(props.rows, progress.value))
const cursor = computed(() => timelineFrame(props.points, progress.value))
const min = computed(() => Math.min(0, ...props.points.map(p=>p.value)))
const max = computed(() => Math.max(1,...props.points.map(p=>p.value)))
const x = i => 55 + i/(props.points.length-1)*650
const y = v => { const range = max.value - min.value; const offset = v - min.value; const scaled = offset / range * 175; return 210 - scaled }
const line = computed(() => props.points.map((p,i)=>`${x(i)},${y(p.value)}`).join(' '))
function pause(){ playing.value=false; cancelAnimationFrame(raf) }
function tick(time){ if(!playing.value)return; if(last!=null) progress.value=Math.min(1,progress.value+(time-last)/4000); last=time; if(progress.value<1)raf=requestAnimationFrame(tick); else pause() }
function play(){ pause(); if(reduced.value){progress.value=1;return}; progress.value=0; last=null; playing.value=true; raf=requestAnimationFrame(tick) }
function preference(){ reduced.value=media.matches; if(reduced.value){pause();progress.value=1} }
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');preference();media.addEventListener('change',preference)})
onUnmounted(()=>{pause();media?.removeEventListener('change',preference)})
</script>
<template>
<section class="recipe-player" :aria-label="kind === 'ranked' ? '排名揭晓示例' : '趋势时间游标示例'" @keydown.stop>
  <div class="recipe-label">{{sourceLabel}}</div>
  <div v-if="kind === 'ranked'" class="bars">
    <div v-for="(row,i) in bars" :key="i" class="bar-row"><span>{{row.label}}</span><div class="track"><div class="fill" :style="{width:row.width+'%',background:i===1?'#d78648':'#73d7bd'}"></div></div><strong>{{row.shown.toFixed(0)}}<small>{{unit}}</small></strong></div>
    <div class="axis">0 <span>共同零基线 · 揭晓顺序不等于排名</span></div>
  </div>
  <svg v-else viewBox="0 0 760 255" role="img" :aria-label="points.map(p => p.label + '：' + p.value + unit).join('，') + '。拖动时间游标查看插值。'">
    <line x1="55" y1="210" x2="705" y2="210" stroke="#506578"/>
    <text x="12" y="215" fill="#afc2cf" font-size="15">{{min}}</text><text x="12" y="40" fill="#afc2cf" font-size="15">{{max}}</text>
    <polyline :points="line" fill="none" stroke="#73d7bd" stroke-width="4"/>
    <g v-for="(point,i) in points" :key="i"><circle :cx="x(i)" :cy="y(point.value)" r="5" fill="#73d7bd"/><text :x="x(i)" y="244" text-anchor="middle" fill="#afc2cf" font-size="17">{{point.label}}</text></g>
    <line :x1="x(cursor.index)" y1="24" :x2="x(cursor.index)" y2="210" stroke="#d78648" stroke-dasharray="5 5"/>
    <circle :cx="x(cursor.index)" :cy="y(cursor.value)" r="8" fill="#d78648"/>
  </svg>
  <div v-if="kind !== 'ranked'" class="readout">当前插值 <strong>{{cursor.value.toFixed(1)}} {{unit}}</strong><span>插值不是新增观测</span></div>
  <div class="controls" @click.stop><button type="button" @click="playing ? pause() : play()">{{playing?'暂停':reduced?'显示终态':'重播动画'}}</button><label>进度 <input aria-label="动画进度" type="range" min="0" max="1" step="0.01" v-model.number="progress" @input="pause" /></label><output>{{Math.round(progress*100)}}%</output></div>
  <p v-if="reduced" class="reduced">已遵循减少动态效果偏好。可手动拖动进度。</p>
</section>
</template>
<style scoped>
.recipe-player{background:#122a3c;border:1px solid #335268;border-radius:18px;padding:16px 24px;color:#eff7f9;font-family:system-ui}.recipe-label{font-size:11px;letter-spacing:2px;color:#a5bac8;margin-bottom:12px}.bars{padding:0 0 6px}.bar-row{display:grid;grid-template-columns:85px 1fr 75px;align-items:center;gap:16px;margin:12px 0}.bar-row>span{font-size:17px}.track{height:27px;background:#233e50;border-radius:4px;overflow:hidden}.fill{height:100%;border-radius:4px}.bar-row strong{text-align:right;font-size:24px;font-variant-numeric:tabular-nums}small{font-size:12px;margin-left:5px;color:#b2c6d3}.axis{margin-left:101px;font-size:12px;color:#a5bac8;display:flex;justify-content:space-between}.controls{display:flex;align-items:center;gap:20px;margin-top:16px;font-size:13px}.controls label{display:flex;align-items:center;gap:12px;flex:1}.controls input{width:100%;accent-color:#73d7bd}.controls button{background:#73d7bd;color:#122a3c;padding:9px 15px;border:0;border-radius:6px;font-weight:700;cursor:pointer}.controls button:focus-visible,.controls input:focus-visible{outline:3px solid #fff;outline-offset:4px}.controls output{width:40px;font-variant-numeric:tabular-nums}.readout{display:flex;gap:15px;align-items:center;font-size:14px}.readout strong{color:#f4bc8e;font-size:22px}.readout span{margin-left:auto;color:#a5bac8;font-size:12px}.reduced{font-size:12px;color:#b9cbd7;margin-bottom:0}svg{display:block;width:100%;max-height:180px}
</style>
