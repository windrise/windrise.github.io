(function(){
'use strict';
const $=id=>document.getElementById(id), params=new URLSearchParams(location.search);
const localMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&params.get('local')==='1';
const STORE='rise-reading-personal-v1',validStatus=['','to_read','reading','read'];
let data,paperId='',sectionId='',personal={schemaVersion:1,papers:{}},storageError='',filters={query:'',topic:'',year:'',status:'all'},project=params.get('project')||'';
const smooth=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
function safeURL(value){
 try {if(typeof value!=='string'||/[\s\\<>"'\u0000-\u001f]/.test(value)||value.startsWith('//'))return false;
 const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password;
 }catch{return false;}
}
function el(tag,attributes={},children=[]){
 const node=document.createElement(tag);
 for(const [key,value] of Object.entries(attributes)){
  if(value==null)continue;
  if(key==='text')node.textContent=value;
  else if(key==='class')node.className=value;
  else if(key.startsWith('on'))node.addEventListener(key.slice(2),value);
  else if(key!=='href'||safeURL(value))node.setAttribute(key,value);
 }
 for(const child of children)if(child!=null)node.append(typeof child==='string'?document.createTextNode(child):child);
 return node;
}
function link(text,href,extra={}){return el('a',{text,href,...extra});}
function toast(text){$('notes-toast').textContent=text;}
function knownPapers(){return Object.values(data.papers).sort((a,b)=>(b.content_status==='deep_dive')-(a.content_status==='deep_dive')||b.year-a.year);}
function matches(p){return (!project||(p.project_links||[]).some(l=>l.project_id===project))&&(!filters.topic||p.topics.includes(filters.topic))&&(!filters.year||String(p.year)===filters.year)&&(filters.status==='all'||p.content_status===filters.status)&&(!filters.query||[p.title,p.short_title,p.arxiv_id,...p.authors].join(' ').toLowerCase().includes(filters.query));}
function renderList(){
 const selected=knownPapers().filter(matches);$('paper-list').replaceChildren();
 $('results-summary').textContent=`${selected.length} 篇符合条件 · ${knownPapers().length} 篇入库`+(project?' · 当前项目关联阅读':'');
 if(!selected.length)$('paper-list').append(el('li',{text:'没有匹配的论文，试试重置筛选。'}));
 for(const p of selected)$('paper-list').append(el('li',{},[el('button',{type:'button',class:'paper-item-btn'+(p.id===paperId?' active':''),'aria-current':p.id===paperId?'page':null,onclick:()=>selectPaper(p.id)},[el('span',{class:'paper-item-title',text:p.short_title||p.title}),el('span',{class:'paper-item-meta',text:`${p.year} · ${p.content_status==='deep_dive'?'深读初稿':'仅元信息'}`})])]));
}
function route(id,section=''){return '#'+encodeURIComponent(id)+(section?'/'+encodeURIComponent(section):'');}
function selectPaper(id){location.hash=route(id);if(matchMedia('(max-width: 900px)').matches){$('library-navigation').open=false;$('filter-details').open=false;}}
function renderToc(p){$('toc-list').replaceChildren();for(const s of p.sections||[])$('toc-list').append(el('li',{},[link(s.title,route(p.id,s.id),{class:'toc-link'})]));}
function evidenceRefs(refs){return el('div',{class:'source-refs'},refs.map(id=>{const evidence=(data.papers[paperId].evidences||[]).find(e=>e.id===id);return evidence?el('button',{class:'ev-ref-btn',type:'button',text:'出处 · '+evidence.location,onclick:()=>{const target=$('card-'+id);document.querySelectorAll('.evidence-card').forEach(e=>e.classList.remove('highlighted'));target?.classList.add('highlighted');target?.scrollIntoView({behavior:smooth(),block:'center'});target?.focus({preventScroll:true});}}):null;}));}
function renderBlock(block){
 const box=el('div',{id:block.id,class:'reading-block'});
 if(block.type==='paragraph')box.append(el('p',{text:block.text}));
 if(block.type==='step_flow')box.append(el('div',{class:'step-flow-box'},[el('p',{class:'step-flow-label',text:block.label}),el('ol',{class:'step-flow-list'},block.steps.map(s=>el('li',{text:s})))]));
 if(block.type==='table'){
  const table=el('table',{class:'comparison-table'},[el('caption',{text:block.label}),el('thead',{},[el('tr',{},block.headers.map(h=>el('th',{scope:'col',text:h})))]),el('tbody',{},block.rows.map(row=>el('tr',{},row.map(v=>el('td',{text:v===null?'N/A':String(v)}))))) ]);
  box.append(el('div',{class:'table-container',tabindex:'0','aria-label':'可横向滚动的比较表'},[table]));
  box.append(el('p',{class:'table-conditions',text:block.conditions}));
 }
 if(block.evidence_refs?.length)box.append(evidenceRefs(block.evidence_refs));
 return box;
}
function renderArticle(){
 const p=data.papers[paperId];if(!p)return;
 const root=$('article-container');root.replaceChildren();
 const title=el('header',{class:'article-header'},[el('p',{class:'article-topic-tag',text:(p.topics||[]).map(id=>data.topics[id]?.title||id).join(' · ')}),el('h1',{class:'article-title',text:p.short_title||p.title}),el('p',{class:'paper-full-title',text:p.short_title?p.title:''}),el('p',{class:'article-meta-row',text:`${p.published_date||p.year} · ${p.version||'版本未记录'} · ${p.content_status==='deep_dive'?'深读初稿':'仅元信息'} · 入库 ${p.library_entry_date||'未记录'}`}),el('details',{class:'paper-authors'},[el('summary',{text:p.authors[0]+' 等 · '+p.authors.length+' 位作者'}),el('p',{text:p.authors.join(', ')})]),el('div',{class:'paper-links'},[link('固定版本原文 ↗',p.url,{target:'_blank',rel:'noopener noreferrer'}),p.code_url?link('代码 ↗',p.code_url,{target:'_blank',rel:'noopener noreferrer'}):null])]);root.append(title);
 const body=el('div',{class:'article-body'});
 body.append(el('p',{class:'article-lead',text:p.summary||'仅收录元信息，全文深读待补充。'}));
 if(p.content_status!=='deep_dive')body.append(el('p',{class:'metadata-only-desc',text:'内容状态不代表你的阅读状态。此页尚无全文分析或实验结论。'}));
 for(const s of p.sections||[])body.append(el('section',{class:'reading-section',id:s.id},[el('h2',{text:s.title}),...s.blocks.map(renderBlock)]));
 if(p.project_links?.length)body.append(el('section',{class:'reading-section'},[el('h2',{text:'与研究项目连接'}),el('ul',{class:'project-reading-links'},p.project_links.map(l=>el('li',{},[link(l.project_title,l.link_url),el('p',{text:l.relation})])))]));
 root.append(body);renderToc(p);renderEvidences(p);renderDownloads(p);renderNotes(p);
}
function renderEvidences(p){
 const root=$('evidence-list');root.replaceChildren();
 if(!p.evidences?.length)root.append(el('p',{class:'text-muted',text:'尚未整理原文证据。'}));
 else root.append(el('p',{class:'evidence-shared',text:(p.evidences.every(e=>e.source_check?.status==='source_checked')?'本篇来源位置已核对 · '+p.version:'部分来源仍待核对')+'。来源核对不等于本地复现。'+(p.evidences.every(e=>e.verification?.status!=='reviewed')?'未记录用户人工复核。':'人工复核记录见各条证据。')}));
 for(const e of p.evidences||[])root.append(el('section',{class:'evidence-card',id:'card-'+e.id,tabindex:'-1'},[el('h3',{class:'evidence-loc',text:e.location}),el('p',{class:'evidence-summary',text:e.summary}),link('打开原文位置 ↗',e.source_url,{target:'_blank',rel:'noopener noreferrer'}),e.source_check?.status!=='source_checked'?el('p',{class:'evidence-verif',text:'来源待核对'}):null,e.verification?.status==='reviewed'?el('p',{class:'evidence-verif',text:'人工复核记录存在 · '+e.verification.by}):null]));
}
function renderDownloads(p){
 const root=$('export-links-list');root.replaceChildren();
 const exports=[['阅读稿 · Markdown',`./papers/${p.id}.md`],['本篇引用 · BibTeX',`./papers/${p.id}.bib`],['整库引用 · BibTeX','./library.bib']];
 if(p.content_status==='deep_dive')exports.splice(1,0,['六页汇报 · Slidev 源码',`./slides/${p.id}.slidev.md`]);
 for(const [title,url] of exports)root.append(link(title,url,{download:url.split('/').pop(),class:'btn btn-sm'}));
}
function ensureRecord(id){return personal.papers[id]||(personal.papers[id]={status:'',notes:{}});}
function renderNotes(p){
 $('local-notes').hidden=!localMode;if(!localMode)return;
 const record=ensureRecord(p.id);$('reading-status').value=record.status;
 $('note-section').replaceChildren(el('option',{value:'paper',text:'整篇'}),...(p.sections||[]).map(s=>el('option',{value:s.id,text:s.title})));
 $('notes-textarea').value=record.notes.paper||'';toast(storageError||'尚未编辑；保存后刷新可读回。');
}
function noteChanged(){if(!localMode)return;const rec=ensureRecord(paperId);rec.notes[$('note-section').value]=$('notes-textarea').value;rec.status=$('reading-status').value;toast('尚未保存，刷新会丢失本次修改。');}
function saveNotes(){if(!localMode)return;try{localStorage.setItem(STORE,JSON.stringify(personal));toast('已保存到当前本机浏览器。');storageError='';}catch{toast('保存失败：浏览器存储不可用或空间不足，请备份 JSON。');}}
function validatePersonal(obj){
 if(!obj||obj.schemaVersion!==1||typeof obj.papers!=='object'||Array.isArray(obj.papers))throw Error('备份格式不符');
 const clean={schemaVersion:1,papers:{}};
 for(const [id,r] of Object.entries(obj.papers)){
  if(!data.papers[id]||!r||!validStatus.includes(r.status)||!r.notes||typeof r.notes!=='object'||Array.isArray(r.notes))throw Error('备份包含未知论文或无效状态');
  const ids=['paper',...(data.papers[id].sections||[]).map(s=>s.id)];clean.papers[id]={status:r.status,notes:{}};
  for(const [section,text] of Object.entries(r.notes)){if(!ids.includes(section)||typeof text!=='string'||text.length>100000)throw Error('笔记位置或长度不符');clean.papers[id].notes[section]=text;}
 }
 return clean;
}
function backup(){if(!localMode)return;const blob=new Blob([JSON.stringify(personal,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='rise-reading-personal.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成本机笔记备份（包含尚未保存的修改）。');}
async function restore(event){if(!localMode)return;const file=event.target.files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('文件超过 1 MB');const clean=validatePersonal(JSON.parse(await file.text()));const merged={schemaVersion:1,papers:{...personal.papers,...clean.papers}};localStorage.setItem(STORE,JSON.stringify(merged));personal=merged;renderNotes(data.papers[paperId]);toast('备份已恢复并保存到当前浏览器。');}catch(err){toast('恢复失败：'+err.message);}finally{event.target.value='';}}
function onRoute(){
 let parts;try{parts=decodeURIComponent(location.hash.slice(1)).split('/');}catch{parts=[];}
 const next=data.papers[parts[0]]?parts[0]:(knownPapers().filter(matches)[0]||knownPapers()[0])?.id;
 if(!next)return;
 const hadPrevious=!!paperId,changed=paperId!==next;paperId=next;sectionId=parts[1]||'';
 if(changed){renderArticle();renderList();}
 if(sectionId){const section=$(sectionId);if((data.papers[paperId].sections||[]).some(s=>s.id===sectionId))section?.scrollIntoView({behavior:smooth(),block:'start'});}
 else if(changed&&hadPrevious)$('article-container').scrollIntoView({behavior:'instant',block:'start'});
}
async function init(){
 try{const response=await fetch('./reading-data.json');if(!response.ok)throw Error('HTTP '+response.status);data=await response.json();
  for(const t of Object.values(data.topics))$('topic-select').append(el('option',{value:t.id,text:t.title}));
  for(const year of [...new Set(knownPapers().map(p=>p.year))].sort().reverse())$('year-select').append(el('option',{value:String(year),text:String(year)}));
  if(localMode)try{const raw=localStorage.getItem(STORE);if(raw)personal=validatePersonal(JSON.parse(raw));}catch{storageError='未读取到可用本机记录；仍可阅读与备份新笔记。';}
  $('search-input').addEventListener('input',e=>{filters.query=e.target.value.trim().toLowerCase();renderList();});
  for(const [id,key] of [['topic-select','topic'],['year-select','year'],['filter-select','status']])$(id).addEventListener('change',e=>{filters[key]=e.target.value;renderList();});
  $('reset-filters').addEventListener('click',()=>{filters={query:'',topic:'',year:'',status:'all'};project='';$('search-input').value='';$('topic-select').value='';$('year-select').value='';$('filter-select').value='all';renderList();});
  if(localMode){$('notes-textarea').addEventListener('input',noteChanged);$('reading-status').addEventListener('change',noteChanged);$('note-section').addEventListener('change',()=>{$('notes-textarea').value=ensureRecord(paperId).notes[$('note-section').value]||'';});$('save-notes-btn').addEventListener('click',saveNotes);$('export-notes-btn').addEventListener('click',backup);$('import-notes-file').addEventListener('change',restore);}
  if(matchMedia('(max-width: 900px)').matches){$('library-navigation').open=false;$('filter-details').open=false;}
  window.addEventListener('hashchange',onRoute);onRoute();
 }catch(err){$('article-container').replaceChildren(el('h1',{text:'阅读台暂时无法加载'}),el('p',{text:'请通过本地 HTTP 服务或站点入口打开。'+err.message}));}
}
init();
})();
