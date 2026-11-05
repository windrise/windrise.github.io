// Test-only original React/Remotion reference. Never included in the published deck.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const slides=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const upstream=path.resolve(process.env.DATAMAGIC_UPSTREAM || '.reference-upstream/cards');
const root=path.resolve('.reference-site');fs.mkdirSync(root,{recursive:true});
const catalog=JSON.parse(fs.readFileSync(path.join(slides,'recipes/catalog.json')));
const replacements=JSON.parse(fs.readFileSync(path.join(slides,'recipes/assets-replacements/mapping.json'))).mappings;
let imports=`import React,{useEffect,useRef} from '${upstream}/node_modules/react/index.js';\nimport {createRoot} from '${upstream}/node_modules/react-dom/client.js';\nimport {Player} from '${upstream}/node_modules/@remotion/player/dist/esm/index.mjs';\nimport {RuntimeCard} from '${upstream}/src/runtime/RuntimeCard.tsx';\n`;
let entries=[];for(const [i,c] of catalog.entries()){if(c.native){imports+=`import {${c.exportName} as C${i}} from '${upstream}/${c.source.component}';\n`;entries.push(`${JSON.stringify(c.id)}:C${i}`)}else entries.push(`${JSON.stringify(c.id)}:RuntimeCard`);}
for(const weight of [400,600,700])imports+=`import '${slides}/node_modules/@fontsource/inter/${weight}.css';\n`;
fs.writeFileSync(path.join(root,'catalog.json'),JSON.stringify(catalog));
fs.writeFileSync(path.join(root,'main.tsx'),imports+`
import catalog from './catalog.json';
const params=new URLSearchParams(location.search),id=params.get('id')||catalog[0].id,frame=Number(params.get('frame')||0);
const item=catalog.find(c=>c.id===id);if(!item)throw Error('Unknown reference recipe '+id);
const registry={${entries.join(',')}};
function App(){const ref=useRef(null);useEffect(()=>{ref.current?.seekTo(frame);document.documentElement.dataset.referenceReady='true';},[]);return <div data-datamagic-reference-stage style={{width:item.width,height:item.height,position:'relative',fontFamily:'Arial,sans-serif',fontSize:16,lineHeight:'normal',color:'#000'}}><Player ref={ref} component={registry[id]} inputProps={item.props} compositionWidth={item.width} compositionHeight={item.height} durationInFrames={item.frames} fps={item.fps} initialFrame={frame} autoPlay={false} controls={false} style={{width:item.width,height:item.height}}/></div>}
createRoot(document.getElementById('root')).render(<App/>);
`);
fs.writeFileSync(path.join(root,'index.html'),`<!doctype html><html><head><style>body{margin:0} @font-face{font-family:'Noto Sans SC';font-weight:400;src:url('/fonts/noto-sans-sc-400.woff2')} @font-face{font-family:'Noto Sans SC';font-weight:700;src:url('/fonts/noto-sans-sc-700.woff2')}</style></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>`);
fs.cpSync(path.join(slides,'decks/design-recipes/public/datamagic'),path.join(root,'public'),{recursive:true});
fs.writeFileSync(path.join(root,'remotion-safe.tsx'),`import React from '${upstream}/node_modules/react/index.js'; import {OffthreadVideo as OriginalVideo,Img} from '${upstream}/node_modules/remotion/dist/esm/index.mjs'; export * from '${upstream}/node_modules/remotion/dist/esm/index.mjs'; export const OffthreadVideo=(props:any)=>/\\.(svg|png|webp|jpg)([?#]|$)/i.test(props.src)?<Img {...props}/>:<OriginalVideo {...props}/>;`);
fs.writeFileSync(path.join(root,'vite.config.mjs'),`export default {root:${JSON.stringify(root)},publicDir:'public',server:{host:'127.0.0.1',port:4174,fs:{allow:[${JSON.stringify(path.dirname(upstream))},${JSON.stringify(slides)},${JSON.stringify(root)}]}},resolve:{alias:[{find:/^react$/,replacement:${JSON.stringify(path.join(upstream,'node_modules/react/index.js'))}},{find:/^react-dom$/,replacement:${JSON.stringify(path.join(upstream,'node_modules/react-dom/index.js'))}},{find:/^remotion$/,replacement:${JSON.stringify(path.join(root,'remotion-safe.tsx'))}}]},plugins:[{name:'safe-reference-assets',transform(code,id){if(!/\\.[tj]sx?$/.test(id))return;for(const item of ${JSON.stringify(replacements)})code=code.replaceAll(item.source,'replacements/'+item.replacement);return code;}}]};`);
console.log('Reference prepared at '+root+' using pinned upstream source. Asset substitutions match the port; media equivalence is excluded.');
