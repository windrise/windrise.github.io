import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {mkdir,readdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const directory=new URL('./.test-cache/',import.meta.url);
try {
 await mkdir(directory,{recursive:true});
 for(const name of (await readdir(new URL('.',import.meta.url))).filter(n=>n.endsWith('.ts'))){
  let source=await readFile(new URL(name,import.meta.url),'utf8');
  for (const match of [...source.matchAll(/import (\w+) from ['"]([^'"]+\.json)['"];?/g)]) {
   const data=JSON.parse(await readFile(new URL(match[2],import.meta.url),'utf8'));
   source=source.replace(match[0],`const ${match[1]} = ${JSON.stringify(data)};`);
  }
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/from ['"](\.\/[^'"]+)['"]/g,(_,path)=>`from '${path}.mjs'`);
  await writeFile(new URL(name.replace(/\.ts$/,'.mjs'),directory),output);
 }
 const result=spawnSync(process.execPath,['--test',fileURLToPath(new URL('runtime.test.mjs',directory))],{stdio:'inherit'});process.exitCode=result.status??1;
} finally {await rm(directory,{recursive:true,force:true});}
