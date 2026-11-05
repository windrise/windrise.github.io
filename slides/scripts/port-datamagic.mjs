// Reproducible TSX -> native Vue VNode compile; no React/Remotion runtime.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../recipes');
const replacements=JSON.parse(fs.readFileSync(path.join(root,'assets-replacements/mapping.json'))).mappings;
const src=path.join(root,'ported');const out=path.join(root,'generated');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
fs.mkdirSync(out,{recursive:true});
for(const f of walk(src)) {
 const rel=path.relative(src,f);if(!/\.(tsx?|m?js|json)$/.test(f)||/\.d\./.test(f))continue;
 const dest=path.join(out,rel.replace(/\.tsx?$/,'.js')); fs.mkdirSync(path.dirname(dest),{recursive:true});
 if(f.endsWith('.json')){fs.copyFileSync(f,dest);continue;}
 let code=fs.readFileSync(f,'utf8');
 for(const replacement of replacements)code=code.replaceAll(replacement.source,'replacements/'+replacement.replacement);
 if(rel==='src/legacy/components/scenes/EditableTransform.tsx'){fs.writeFileSync(dest,"export * from '../../../../../runtime/EditableTransform.ts';\n");continue;}
 code=code.replace(/(from\s*|import\s*)['"](react|remotion)['"]/g,(_,prefix,mod)=>`${prefix}'${path.relative(path.dirname(dest),path.join(root,'runtime',mod==='react'?'vue-runtime.ts':'motion-runtime.ts')).replaceAll('\\','/')}'`);
 code=code.replace(/(from\s*|import\s*)['"](\.[^'"]+)['"]/g,(all,prefix,ref)=>{
  const base=path.resolve(path.dirname(f),ref);if(/\.(ts|tsx|js|mjs|json)$/.test(ref))return all;
  for(const ext of ['.ts','.tsx','.js','.mjs','.json'])if(fs.existsSync(base+ext))return `${prefix}'${ref+ext.replace(/\.tsx?$/,'.js')}'`;
  return all;
 });
 const result=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.React,jsxFactory:'React.createElement',jsxFragmentFactory:'React.Fragment',verbatimModuleSyntax:false}});
 fs.writeFileSync(dest,'// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.\n'+result.outputText);
}
const catalog=JSON.parse(fs.readFileSync(path.join(root,'catalog.json')));
let entry="import React from '../runtime/vue-runtime.ts';\nexport {default as React} from '../runtime/vue-runtime.ts';\nexport {MotionProvider} from '../runtime/motion-runtime.ts';\nimport {RuntimeCard} from './src/runtime/RuntimeCard.js';\n";
let registry=[];
for(const [i,c] of catalog.entries()){
 if(c.native){entry+=`import {${c.exportName} as Card${i}} from './${c.source.component.replace(/\.tsx$/,'.js')}';\n`;registry.push(`${JSON.stringify(c.id)}:Card${i}`);}
 else registry.push(`${JSON.stringify(c.id)}:RuntimeCard`);
}
entry+=`export const registry={${registry.join(',\n')}};\n`;
fs.writeFileSync(path.join(out,'cards.mjs'),entry);
console.log(`Compiled ${catalog.length} separately mapped DataMagic recipes to Vue VNodes.`);
