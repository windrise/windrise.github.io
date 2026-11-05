/** Supplemental Vue SSR smoke test: render every catalog sample at start/middle/end.
 * Does not establish screenshot fidelity, browser layout, loaded fonts or decoded video.
 * Writes only its temporary directory under runtime; generated sources remain untouched.
 */
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,relative,dirname,extname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const temp=fileURLToPath(new URL('./.ssr-cache/',import.meta.url));
const visited=new Set();
function target(source) {return resolve(temp,relative(root,source).replace(/\.(?:tsx?|jsx?|mjs|json)$/,'.mjs'));}
async function compile(source) {
 if(visited.has(source))return;visited.add(source);
 let contents=await readFile(source,'utf8');
 if(extname(source)==='.json') contents=`export default ${JSON.stringify(JSON.parse(contents))};`;
 else if(/\.tsx?$/.test(source))contents=ts.transpileModule(contents,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.React}}).outputText;
 const tree=ts.createSourceFile(source,contents,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 const references=tree.statements.filter(node=>(ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier)).map(node=>node.moduleSpecifier).reverse();
 for(const node of references) {
  const specifier=node.text;if(!specifier.startsWith('.'))continue;
  const dependency=resolve(dirname(source),specifier+(extname(specifier)?'':'.ts'));
  if(!dependency.startsWith(root))throw Error(`Dependency outside recipes: ${dependency}`);
  await compile(dependency);
  let replacement=relative(dirname(target(source)),target(dependency)).replaceAll('\\','/');if(!replacement.startsWith('.'))replacement='./'+replacement;
  contents=contents.slice(0,node.getStart(tree))+JSON.stringify(replacement)+contents.slice(node.getEnd());
 }
 const destination=target(source);await mkdir(dirname(destination),{recursive:true});await writeFile(destination,contents);
}
try {
 await rm(temp,{recursive:true,force:true});await mkdir(temp,{recursive:true});
 await compile(resolve(root,'generated/cards.mjs'));
 const catalog=JSON.parse(await readFile(resolve(root,'catalog.json'),'utf8'));
 await writeFile(resolve(temp,'smoke.mjs'),`
import {createSSRApp,h} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {registry,React,MotionProvider} from './generated/cards.mjs';
const catalog=${JSON.stringify(catalog)};
const failures=[];let count=0,totalElements=0;const warnings=new Set();
for(const card of catalog) {
 const frames=[0,Math.floor((card.frames-1)/2),card.frames-1];
 for(const frame of frames) {
  try {
   if(!registry[card.id])throw Error('Registry entry missing');
   const app=createSSRApp({render:()=>h(MotionProvider,{frame,fps:card.fps,width:card.width,height:card.height,durationInFrames:card.frames,assetBase:'/datamagic/'},{default:()=>React.createElement(registry[card.id],structuredClone(card.props))})});
   app.config.warnHandler=message=>warnings.add(card.id+': '+message);
   const html=await renderToString(app);
   const elements=(html.match(/<[a-z][a-z0-9-]*(?=[\\s>])/gi)||[]).length;
   if(elements<2)throw Error('Empty or trivial markup ('+elements+' elements)');
   // Inspect attributes, not text content: narrative labels may legitimately say Infinity.
   const invalid=(html.match(/(?:style|d|points|transform|x|y|cx|cy|r|width|height)="[^"]*(?:NaN|Infinity|undefined)[^"]*"/g)||[]);
   if(invalid.length)throw Error('Non-finite/undefined geometry: '+invalid.slice(0,3).join('; '));
   count++;totalElements+=elements;
  }catch(error){failures.push({id:card.id,frame,error:error.stack||String(error)});}
 }
}
for(const warning of warnings)console.warn('Vue warning:',warning);
for(const failure of failures)console.error(JSON.stringify(failure));
console.log(JSON.stringify({cards:catalog.length,expectedFrames:catalog.length*3,passedFrames:count,totalElements,failedFrames:failures.length,vueWarnings:warnings.size}));
if(failures.length||warnings.size)process.exitCode=1;
`);
 const result=spawnSync(process.execPath,[resolve(temp,'smoke.mjs')],{stdio:'inherit'});
 process.exitCode=result.status??1;
} finally {await rm(temp,{recursive:true,force:true});}
