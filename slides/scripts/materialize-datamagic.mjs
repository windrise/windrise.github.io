import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(repo,'slides/recipes/asset-data/manifest.json')));
for(const asset of manifest.assets){const data=Buffer.from(asset.chunks.map(p=>fs.readFileSync(path.join(repo,p),'utf8')).join(''),'base64');if(data.length!==asset.bytes||crypto.createHash('sha256').update(data).digest('hex')!==asset.sha256)throw Error('Corrupt DataMagic asset: '+asset.path);const dest=path.join(repo,asset.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);}
console.log(`Verified and materialized ${manifest.assets.length} original binary assets.`);
