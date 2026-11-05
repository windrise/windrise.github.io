<script setup>
import { computed, defineComponent, h, markRaw, nextTick, onBeforeUnmount, onErrorCaptured, onMounted, ref, shallowRef, watch } from 'vue'
import catalog from './catalog.json'
import replacements from './assets-replacements/mapping.json'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import Ajv from 'ajv'
import Ajv2020 from 'ajv/dist/2020.js'

const props = defineProps({ id: String, data: Object, active: { type: Boolean, default: true }, gallery: Boolean })
const search = ref(''), category = ref(''), editing = ref(false)
const selected = ref(props.id || catalog[0]?.id)
const recipe = computed(() => catalog.find(item => item.id === selected.value) || catalog[0])
const categories = computed(() => [...new Set(catalog.map(item => item.category))].sort())
const filtered = computed(() => catalog.filter(item => (!category.value || item.category === category.value) && `${item.id} ${item.name?.en} ${item.name?.zh} ${item.category}`.toLowerCase().includes(search.value.toLowerCase())))
const pageOf = id => catalog.findIndex(item => item.id === id) + 2
const title = item => item?.name?.en || item?.name?.zh || item?.id || 'DataMagic'
const frame = ref(0), playing = ref(false), reduced = ref(false)
const payload = shallowRef({}), draft = ref(''), error = ref(''), runtimeError = ref('')
const bundle = shallowRef(null), loading = ref(false)
const viewport = ref(null), host = ref(null), shadow = shallowRef(null), size = ref({ width: 850, height: 340 })
const usesReplacement = computed(() => /Illustrated$/.test(selected.value) || selected.value === 'SpatialPercentOverlay' || replacements.mappings.some(item => JSON.stringify(payload.value).includes(item.source) || JSON.stringify(payload.value).includes('replacements/' + item.replacement)))
const frames = computed(() => Math.max(1, Number(recipe.value?.frames) || 180))
const fps = computed(() => Number(recipe.value?.fps) || 30)
const width = computed(() => Number(recipe.value?.width) || 1280)
const height = computed(() => Number(recipe.value?.height) || 720)
const scale = computed(() => Math.min(size.value.width / width.value, size.value.height / height.value))
const sceneStyle = computed(() => ({ width: `${width.value}px`, height: `${height.value}px`, transform: `scale(${scale.value})`, transformOrigin: 'top left', position: 'absolute', left: `${(size.value.width - width.value * scale.value) / 2}px`, top: `${(size.value.height - height.value * scale.value) / 2}px` }))
let raf = 0, start = 0, startFrame = 0, observer, media
function stop() { playing.value = false; cancelAnimationFrame(raf) }
function tick(now) {
  if (!playing.value || !props.active) return stop()
  frame.value = Math.min(frames.value - 1, startFrame + Math.floor((now - start) * fps.value / 1000))
  if (frame.value >= frames.value - 1) return stop()
  raf = requestAnimationFrame(tick)
}
function play() {
  if (frame.value >= frames.value - 1) frame.value = 0
  playing.value = true; startFrame = frame.value; start = performance.now(); raf = requestAnimationFrame(tick)
}
function replay() { stop(); frame.value = 0; play() }
function scrub(event) { stop(); frame.value = Number(event.target.value) }
function reset() {
  stop(); frame.value = 0; error.value = ''; runtimeError.value = ''
  payload.value = JSON.parse(JSON.stringify(props.data || recipe.value?.props || {}))
  draft.value = JSON.stringify(payload.value, null, 2)
}
const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false })
const ajv2020 = new Ajv2020({ allErrors: true, strict: false, validateFormats: false })
const validators = new Map()
function validate(value, schema) {
  if (!schema || typeof schema !== 'object') return
  let validator = validators.get(selected.value)
  if (!validator) {
    validator = (schema.$schema?.includes('2020-12') ? ajv2020 : ajv).compile(schema)
    validators.set(selected.value, validator)
  }
  if (!validator(value)) throw Error(validator.errors.slice(0, 3).map(e => `${e.instancePath || '$'} ${e.message}`).join('; '))
}
function selectRecipe(event) { window.location.hash = `/${pageOf(event.target.value)}` }
function apply() {
  try {
    const value = JSON.parse(draft.value)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Top-level JSON must be an object.')
    validate(value, recipe.value.schema)
    stop(); payload.value = value; frame.value = 0; error.value = ''; runtimeError.value = ''
  } catch (e) { error.value = e.message }
}
async function load() {
  if (props.gallery || bundle.value || loading.value || !props.active) return
  loading.value = true
  try { bundle.value = markRaw(await import('./generated/cards.mjs')) }
  catch (e) { runtimeError.value = `The native scene could not load. ${e.message}` }
  finally { loading.value = false }
}
const NativeScene = defineComponent({
  setup() { return () => {
    if (!bundle.value || !props.active) return null
    const { registry, MotionProvider, React } = bundle.value
    const card = registry?.[recipe.value.id]
    if (!card) return h('div', { style: { padding: '50px', color: '#ffffff' } }, 'This card is not available in the current build.')
    return h(MotionProvider, { frame: frame.value, fps: fps.value, width: width.value, height: height.value, durationInFrames: frames.value, assetBase: `${import.meta.env.BASE_URL}datamagic/` }, { default: () => React.createElement(card, payload.value) })
  } },
})
onErrorCaptured(e => { runtimeError.value = `Scene error: ${e.message}`; stop(); return false })
watch(() => props.id, value => { if (value) selected.value = value })
watch([selected, () => props.data], reset, { immediate: true })
watch(() => props.active, active => { if (active) load(); else stop() })
function motionPreference() { reduced.value = !!media?.matches; if (reduced.value) stop() }
onMounted(async () => {
  if (!document.getElementById('datamagic-local-fonts')) {
    const fonts = document.createElement('style'); fonts.id = 'datamagic-local-fonts'
    const base = `${import.meta.env.BASE_URL}datamagic/fonts/`
    fonts.textContent = `@font-face{font-family:'Noto Sans SC';font-style:normal;font-weight:400;font-display:swap;src:url('${base}noto-sans-sc-400.woff2') format('woff2')}@font-face{font-family:'Noto Sans SC';font-style:normal;font-weight:700;font-display:swap;src:url('${base}noto-sans-sc-700.woff2') format('woff2')}`
    document.head.appendChild(fonts)
  }
  media = window.matchMedia('(prefers-reduced-motion: reduce)'); motionPreference(); media.addEventListener('change', motionPreference)
  if (host.value) {
    const root = host.value.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = ':host{all:initial;display:block;width:100%;height:100%}.dm-scene{font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:normal;color:#000;text-align:left;letter-spacing:normal;font-weight:400}*,*::before,*::after{box-sizing:border-box}svg{display:inline-block}button,input,textarea,select{font:inherit}'
    root.appendChild(style); shadow.value = root
  }
  await nextTick()
  if (viewport.value) {
    observer = new ResizeObserver(entries => { const { width, height } = entries[0].contentRect; size.value = { width, height } })
    observer.observe(viewport.value)
  }
  load()
})
onBeforeUnmount(() => { stop(); observer?.disconnect(); media?.removeEventListener('change', motionPreference) })
</script>

<template>
  <section class="dm-player" :class="{ 'dm-gallery': gallery }" @keydown.stop @pointerdown.stop @click.stop>
    <template v-if="gallery">
      <header class="dm-gallery-head"><div><div class="dm-overline">DATAMAGIC / NATIVE VUE COLLECTION</div><h1>让每一帧，都有表达。</h1><p>{{ catalog.length }} 个原始配方 · 按帧播放 · 数据可编辑</p></div><span class="dm-count">{{ catalog.length }}<small>RECIPES</small></span></header>
      <div class="dm-filters"><input v-model="search" aria-label="搜索配方 / Search recipes" placeholder="搜索名称、类别… / Search recipes"><select v-model="category" aria-label="Filter category"><option value="">全部类别 / All categories</option><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></select><span>{{ filtered.length }} results</span></div>
      <nav class="dm-card-grid" aria-label="Animation recipes"><a v-for="item in filtered" :key="item.id" :href="`#/${pageOf(item.id)}`" class="dm-card"><small>{{ item.category }}</small><b>{{ title(item) }}</b><span>{{ item.name?.zh }} <i>↗</i></span></a><p v-if="!filtered.length" class="dm-empty">没有匹配项。试试其他名称或类别。</p></nav>
      <footer class="dm-footer"><span>HKUST Dial Lab · DataMagic · MIT · 原始示例数据</span><a href="./reference/README.md" target="_blank" rel="noopener">使用指南 ↗</a><a href="https://datamagic.chat/cards/" target="_blank" rel="noopener">原始配方库 ↗</a><a href="./reference/THIRD_PARTY_LICENSES.md" target="_blank" rel="noopener">许可 ↗</a></footer>
    </template>
    <template v-else>
      <header class="dm-heading"><a href="#/1" class="dm-back" aria-label="All recipes">← 全部</a><div class="dm-title"><small>{{ recipe.category }}</small><h2>{{ title(recipe) }}</h2></div><select :value="selected" aria-label="Choose recipe" @change="selectRecipe"><option v-for="item in catalog" :key="item.id" :value="item.id">{{ title(item) }}</option></select><button :aria-pressed="editing" @click="editing = !editing">{{ editing ? '关闭编辑' : '编辑数据 {}' }}</button></header>
      <div class="dm-workspace">
        <div ref="viewport" class="dm-viewport">
          <div ref="host" class="dm-shadow-host"></div>
          <Teleport v-if="shadow && active && bundle && !runtimeError" :to="shadow"><div class="dm-scene" :style="sceneStyle"><NativeScene :key="selected" /></div></Teleport>
          <div v-if="loading || runtimeError || !active" class="dm-status" role="status">{{ runtimeError || (loading ? '正在加载原始场景…' : '打开此页以加载场景') }}</div>
        </div>
        <aside v-if="editing" class="dm-editor"><div class="dm-editor-heading"><b>配方参数 · JSON</b><button @click="reset">恢复示例</button></div><textarea v-model="draft" aria-label="Recipe JSON data" spellcheck="false" /><p v-if="error" class="dm-error" role="alert">{{ error }}</p><div class="dm-editor-actions"><span>本地预览，不会上传</span><button class="dm-primary" @click="apply">应用参数</button></div></aside>
      </div>
      <div class="dm-controls"><button class="dm-primary dm-play" :aria-label="playing ? 'Pause animation' : 'Play animation'" @click="playing ? stop() : play()">{{ playing ? 'Ⅱ 暂停' : '▶ 播放' }}</button><button aria-label="Replay animation" @click="replay">↺ 重播</button><input type="range" min="0" :max="frames - 1" :value="frame" aria-label="Animation frame" @input="scrub"><output>{{ frame }} / {{ frames - 1 }}</output><span>{{ (frame / fps).toFixed(2) }}s</span></div>
      <footer class="dm-footer"><span>{{ width }} × {{ height }} · {{ fps }} fps · {{ reduced ? '减少动效已开启 · 手动播放' : '手动播放 · 可逐帧拖动' }}</span><a v-if="usesReplacement" href="./reference/assets-replacements/mapping.json" target="_blank" rel="noopener" style="color:#f5d79d">自制背景替代 · 非原素材</a><a :href="`#/${pageOf(selected)}`">此配方链接 ↗</a><a href="./reference/README.md" target="_blank" rel="noopener">使用指南 ↗</a><a href="https://datamagic.chat/cards/" target="_blank" rel="noopener">DataMagic · MIT ↗</a></footer>
    </template>
  </section>
</template>

<style scoped>
.dm-player{height:475px;color:#e9edf3;font:13px/1.4 system-ui,sans-serif;display:flex;flex-direction:column;gap:12px;--dm-line:#2b3545;--dm-muted:#9caabd;--dm-accent:#bbf5d2}.dm-player *{box-sizing:border-box}.dm-player button,.dm-player select,.dm-player input,.dm-player textarea{font:inherit;color:inherit}.dm-player button,.dm-player select,.dm-filters input{background:#172131;border:1px solid var(--dm-line);border-radius:7px;padding:7px 10px}.dm-player button{cursor:pointer;white-space:nowrap}.dm-player button:hover,.dm-player a:hover{border-color:#81cda2;color:#d1ffe2}.dm-player button:focus-visible,.dm-player a:focus-visible,.dm-player input:focus-visible,.dm-player select:focus-visible,.dm-player textarea:focus-visible{outline:2px solid var(--dm-accent);outline-offset:3px}.dm-player a{color:inherit;text-decoration:none;border-bottom:0}.dm-heading{height:48px;display:flex;gap:12px;align-items:center;flex-shrink:0}.dm-back{color:var(--dm-muted)!important;font-size:12px;white-space:nowrap}.dm-title{min-width:0;flex:1}.dm-title small{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:var(--dm-accent)}.dm-title h2{font-size:22px;line-height:1.2;font-weight:650;margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dm-heading select{max-width:185px;font-size:11px}.dm-heading button{font-size:11px}.dm-workspace{flex:1;display:flex;min-height:0;border:1px solid var(--dm-line);border-radius:10px;overflow:hidden;background:#090e16}.dm-viewport{min-width:0;flex:1;position:relative;overflow:hidden;isolation:isolate}.dm-shadow-host{position:absolute;inset:0}.dm-status{position:absolute;inset:0;display:grid;place-content:center;padding:30px;text-align:center;color:var(--dm-muted);font-size:14px;overflow:auto}.dm-controls{display:flex;gap:10px;align-items:center;height:34px;flex-shrink:0}.dm-controls input{flex:1;min-width:60px;accent-color:#bbf5d2;cursor:pointer}.dm-controls output{font-size:11px;font-variant-numeric:tabular-nums;width:70px;text-align:right}.dm-controls>span{font-size:11px;color:var(--dm-muted);width:42px;text-align:right}.dm-player .dm-primary{background:var(--dm-accent);color:#0d291a;border-color:transparent;font-weight:650}.dm-play{min-width:73px}.dm-footer{display:flex;gap:18px;align-items:center;flex-shrink:0;font-size:9px;color:var(--dm-muted);min-height:14px}.dm-footer>span{flex:1}.dm-footer a{white-space:nowrap}.dm-editor{width:330px;flex-shrink:0;border-left:1px solid var(--dm-line);background:#111a27;display:flex;flex-direction:column;padding:12px;gap:9px}.dm-editor-heading,.dm-editor-actions{display:flex;align-items:center;justify-content:space-between;font-size:10px}.dm-editor-heading button{font-size:10px;padding:4px 7px}.dm-editor textarea{flex:1;min-height:0;resize:none;width:100%;background:#0b121d;border:1px solid var(--dm-line);border-radius:5px;padding:10px;font:10px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:#cee4de;tab-size:2}.dm-editor-actions span{color:var(--dm-muted);font-size:9px}.dm-editor-actions button{font-size:10px}.dm-error{font-size:10px!important;line-height:1.4!important;color:#ffb4a9;margin:0!important;max-height:50px;overflow:auto}.dm-gallery-head{display:flex;align-items:center;justify-content:space-between}.dm-overline{letter-spacing:2px;font-size:10px;color:var(--dm-accent)}.dm-gallery-head h1{font-size:34px;font-weight:700;letter-spacing:-1px;margin:10px 0 8px;line-height:1.2}.dm-gallery-head p{margin:0;color:var(--dm-muted);font-size:13px}.dm-count{font-size:58px;line-height:1;font-weight:300;letter-spacing:-3px;color:var(--dm-accent);text-align:right}.dm-count small{display:block;font-size:9px;letter-spacing:2px;margin-top:6px}.dm-filters{display:flex;gap:10px;align-items:center;margin-top:10px}.dm-filters input{flex:1;font-size:12px}.dm-filters select{width:200px;font-size:11px}.dm-filters>span{color:var(--dm-muted);font-size:10px;width:65px;text-align:right}.dm-card-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;overflow-y:auto;min-height:0;flex:1;align-content:start;padding:2px 8px 2px 2px;scrollbar-color:#42556a transparent}.dm-card{display:flex;flex-direction:column;gap:5px;padding:12px;border:1px solid var(--dm-line)!important;border-radius:8px;background:linear-gradient(140deg,#182332,#111a27);min-height:88px}.dm-card small{color:#8cbca4;font-size:8px;text-transform:uppercase;letter-spacing:.9px}.dm-card b{font-size:13px;font-weight:600;line-height:1.2}.dm-card>span{font-size:10px;color:var(--dm-muted);margin-top:auto}.dm-card i{float:right;font-style:normal;color:var(--dm-accent)}.dm-empty{color:var(--dm-muted);grid-column:1/-1;padding:20px}
</style>
