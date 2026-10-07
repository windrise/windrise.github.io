(function(){
'use strict';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
const localMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&params.get('local')==='1';
const STORE='rise-reading-personal-v1',validStatus=['','to_read','reading','read'];
let data,paperId='',sectionId='',personal={schemaVersion:1,papers:{}},storageError='',filters={query:'',topic:'',year:'',status:'all'},project=params.get('project')||'',homeScroll=0,observer;
const smooth=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
function safeURL(value){try{if(typeof value!=='string'||/[\s\\<>"'\u0000-\u001f]/.test(value)||value.startsWith('//'))return false;const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}
function el(tag,attributes={},children=[]){const node=document.createElement(tag);for(const [key,value]of Object.entries(attributes)){if(value==null)continue;if(key==='text')node.textContent=value;else if(key==='class')node.className=value;else if(key.startsWith('on'))node.addEventListener(key.slice(2),value);else if(key!=='href'||safeURL(value))node.setAttribute(key,value);}for(const child of children)if(child!=null)node.append(typeof child==='string'?document.createTextNode(child):child);return node;}
function link(text,href,extra={}){return el('a',{text,href,...extra});}
function toast(text){$('notes-toast').textContent=text;}
function knownPapers(){return Object.values(data.papers).sort((a,b)=>(b.content_status==='deep_dive')-(a.content_status==='deep_dive')||b.year-a.year);}
function matches(p){return(!project||(p.project_links||[]).some(l=>l.project_id===project))&&(!filters.topic||p.topics.includes(filters.topic))&&(!filters.year||String(p.year)===filters.year)&&(filters.status==='all'||p.content_status===filters.status)&&(!filters.query||[p.title,p.short_title,p.arxiv_id,...p.authors].join(' ').toLowerCase().includes(filters.query));}
function route(id,section=''){return '#'+encodeURIComponent(id)+(section?'/'+encodeURIComponent(section):'');}
function shortSection(s){return s.title.replace(/^\d+\s*·\s*/,'');}
function comparison(p){return(p.sections||[]).flatMap(s=>s.blocks).find(b=>b.id==='comparison-table');}
function metrics(p,style='mini-metrics'){const table=comparison(p);if(!table)return null;const row=table.rows.find(r=>r[0]===p.short_title);if(!row)return null;return el('div',{class:style},[[row[1],'1024³ latent tokens'],[row[2],'Toys4K 全表面 F1'],[String(table.rows.length)+' 组','同分辨率对照']].slice(0,style==='mini-metrics'?2:3).map(([v,l])=>el('div',{},[el('strong',{text:v}),el('span',{text:l})])));}
function renderList(){
 const all=knownPapers(),selected=all.filter(matches),root=$('paper-list');root.replaceChildren();
 $('library-stats').textContent=`${all.length} 篇文献 · ${all.filter(p=>p.content_status==='deep_dive').length} 篇深读初稿`;
 $('results-summary').textContent=(project||filters.query||filters.topic||filters.year||filters.status!=='all')?`${selected.length} 篇符合条件`+(project?' · 当前项目关联阅读':''):'';
 if(!selected.length){root.append(el('div',{class:'empty-state'},[el('p',{text:'没有找到匹配的论文'}),el('button',{text:'重置筛选',type:'button',onclick:resetFilters})]));return;}
 selected.forEach((p,index)=>{
 const deep=p.content_status==='deep_dive';const card=el('a',{href:route(p.id),class:'paper-card',onclick:()=>{homeScroll=window.scrollY;}},[
 el('div',{class:'card-labels'},[el('span',{class:'tag',text:deep?'论文深度解读 · 初稿':'文献条目'}),el('span',{class:'tag neutral',text:p.published_date||p.year})]),
 el('h3',{text:p.short_title||p.title}),el('p',{class:'card-subtitle',text:p.title}),el('p',{class:'card-description',text:p.summary||'查看论文出处与项目关联。'}),metrics(p),
 el('div',{class:'card-bottom'},[el('span',{text:'arXiv · '+p.arxiv_id}),el('span',{class:'card-action',text:deep?'进入深读':'查看文献'})])]);root.append(card);
 if(index===0&&!project&&!filters.query&&!filters.topic&&!filters.year&&filters.status==='all'){
 const topic=Object.values(data.topics)[0];root.append(el('a',{href:route(p.id,'related'),class:'paper-card collection-card',onclick:()=>{homeScroll=window.scrollY;}},[
 el('div',{class:'card-labels'},[el('span',{class:'tag',text:'专题阅读路径'}),el('span',{class:'tag neutral',text:all.length+' 篇关联文献'})]),el('h3',{text:topic.title}),el('p',{class:'card-subtitle',text:topic.research_question}),el('p',{class:'card-description',text:'以 TRELLIS 2 为起点，把直接前作、生成模型背景与其他表示路线放在同一张阅读地图中。'}),el('div',{class:'topic-index'},['结构化潜空间','Latent Diffusion','Flow Matching','3D Gaussian Splatting'].map(t=>el('span',{text:t}))),el('div',{class:'card-bottom'},[el('span',{text:'相关工作与研究问题'}),el('span',{class:'card-action',text:'展开阅读路径'})])]));
 }
 });
}
function resetFilters(){filters={query:'',topic:'',year:'',status:'all'};project='';$('search-input').value='';$('topic-select').value='';$('year-select').value='';$('filter-select').value='all';const url=new URL(location.href);url.searchParams.delete('project');history.replaceState(null,'',url);renderList();}
function renderToc(p){const names={problem:'研究问题',related:'相关工作',method:'方法详解',evaluation:'实验比较',limitations:'局限与追问',takeaways:'研究启发'};$('toc-list').replaceChildren(...(p.sections||[]).map((s,i)=>link(String(i+1).padStart(2,'0')+' '+(names[s.id]||shortSection(s)),route(p.id,s.id),{class:'toc-link','data-section':s.id})));$('article-navigation').hidden=!p.sections?.length;observer?.disconnect();observer=new IntersectionObserver(entries=>{const v=entries.find(e=>e.isIntersecting);if(v)document.querySelectorAll('.toc-link').forEach(a=>a.setAttribute('aria-current',String(a.dataset.section===v.target.id)));},{rootMargin:'-65px 0px -65% 0px',threshold:0});document.querySelectorAll('.reading-section[id]').forEach(s=>observer.observe(s));}
function evidenceRefs(refs){return el('div',{class:'source-refs'},refs.map(id=>{const e=(data.papers[paperId].evidences||[]).find(e=>e.id===id);return e?el('button',{class:'ev-ref-btn',type:'button',text:'原文 · '+e.location,onclick:()=>{$('evidence-disclosure').open=true;const target=$('card-'+id);document.querySelectorAll('.evidence-card').forEach(e=>e.classList.remove('highlighted'));target?.classList.add('highlighted');target?.scrollIntoView({behavior:smooth(),block:'center'});target?.focus({preventScroll:true});}}):null;}));}
function renderChart(block){
 if(block.headers.length!==3||!block.headers[2].includes('F1'))return null;
 const values=block.rows.map(r=>Number(r[2]));if(values.some(v=>!Number.isFinite(v)||v<0||v>1))return null;
 return el('figure',{class:'chart-panel','aria-label':'Toys4K 全表面 F1 比较，作者报告，数值越高越好'},[el('figcaption',{text:'同一分辨率下，重建质量如何变化？'}),el('p',{class:'chart-subtitle',text:'Toys4K 全表面 F1 · 1024³ · 越高越好 · 作者报告，未复现'}),...block.rows.map((r,i)=>{const bar=el('div',{class:'chart-bar'});bar.style.width=(values[i]*100)+'%';return el('div',{class:'chart-row'+(i===block.rows.length-1?' highlight':'')},[el('span',{text:r[0]}),el('div',{class:'chart-track','aria-hidden':'true'},[bar]),el('strong',{text:r[2]})]);}),el('div',{class:'chart-axis','aria-hidden':'true'},[el('span',{text:'0'}),el('span',{text:'0.5'}),el('span',{text:'1.0'})])]);
}
function renderBlock(block){
 let cls='reading-block';if(/inference|question|takeaways-cvpr|takeaways-medical/.test(block.id)&&block.id!=='problem-question')cls+=' analysis-block';if(block.id==='problem-scope')cls+=' scope-block';
 const box=el('div',{id:block.id,class:cls});
 if(block.type==='paragraph')box.append(el('p',{text:block.text}));
 if(block.type==='step_flow')box.append(el('div',{class:'step-flow-box'},[el('p',{class:'step-flow-label',text:block.label}),el('ol',{class:'step-flow-list'},block.steps.map(s=>{const split=s.indexOf('：');return el('li',{},split>=0?[el('strong',{text:s.slice(0,split)}),s.slice(split+1)]:[s]);}))]));
 if(block.type==='table'){
 const chart=renderChart(block);if(chart)box.append(chart);
 const table=el('table',{class:'comparison-table'},[el('caption',{text:block.label}),el('thead',{},[el('tr',{},block.headers.map(h=>el('th',{scope:'col',text:h})))]),el('tbody',{},block.rows.map(row=>el('tr',{},row.map(v=>el('td',{text:v===null?'N/A':String(v)})))))]);
 box.append(el('div',{class:'table-container',tabindex:'0','aria-label':'可横向滚动的比较表'},[table]),el('p',{class:'table-conditions',text:block.conditions}));
 }
 if(block.evidence_refs?.length)box.append(evidenceRefs(block.evidence_refs));return box;
}
function relatedGrid(p){const topic=data.topics[p.topics[0]];if(!topic)return null;const roles={'paper-trellis-1':['直接前作','结构化 3D 潜空间'],'paper-ldm':['建模背景','潜空间中的扩散生成'],'paper-flow-matching':['建模背景','Flow Matching 训练视角'],'paper-3dgs':['另一种表示路线','表示与渲染的不同取舍']};return el('div',{class:'related-grid'},topic.included_paper_ids.filter(id=>id!==p.id&&data.papers[id]).map(id=>{const q=data.papers[id],r=roles[id]||['关联阅读','方法背景'];return el('a',{href:route(id),class:'related-item'},[el('small',{text:r[0]+' · '+q.year}),el('b',{text:q.short_title}),el('p',{text:r[1]}),el('small',{text:q.content_status==='deep_dive'?'深读初稿':'全文待深读'})]);}));}
function renderArticle(){
 const p=data.papers[paperId];if(!p)return;const deep=p.content_status==='deep_dive';document.title=(p.short_title||p.title)+' · Rise Research';
 const head=el('div',{class:'article-hero-inner'},[link('返回阅读首页','#',{class:'back-link'}),el('p',{class:'article-topic-tag',text:(p.topics||[]).map(id=>data.topics[id]?.title||id).join(' · ')+' / '+(deep?'论文深度解读 · 初稿':'文献条目')}),el('h1',{class:'article-title'},[el('span',{text:p.short_title||p.title}),p.id==='paper-trellis-2'?'：原生且紧凑的结构化 3D 潜空间':'']),el('p',{class:'paper-full-title',text:p.short_title?p.title:''}),el('p',{class:'article-lead',text:p.summary||'仅收录元信息，全文深读待补充。'}),el('p',{class:'article-meta-row',text:`arXiv:${p.arxiv_id} · ${p.published_date||p.year} · 入库 ${p.library_entry_date||'未记录'}`}),el('div',{class:'paper-links'},[link('论文原文 · '+(p.version||'固定版本'),p.url,{target:'_blank',rel:'noopener noreferrer'}),p.code_url?link('代码仓库',p.code_url,{target:'_blank',rel:'noopener noreferrer'}):null]),el('details',{class:'paper-authors'},[el('summary',{text:p.authors[0]+' 等 · '+p.authors.length+' 位作者'}),el('p',{text:p.authors.join(', ')})]),metrics(p,'metric-strip')]);$('article-heading').replaceChildren(head);
 const root=$('article-container');root.replaceChildren();
 if(!deep)root.append(el('section',{class:'reading-section'},[el('p',{class:'section-kicker',text:'READING STATUS'}),el('h2',{text:'全文深读待补充'}),el('p',{text:'已收录论文出处与研究关联。方法、数据和实验解读将在后续阅读中逐项补齐。'})]));
 const labels={problem:'THE QUESTION',related:'RELATED WORK',method:'METHOD',evaluation:'EXPERIMENTS',limitations:'LIMITATIONS',takeaways:'RESEARCH NOTES'};
 for(const [i,s]of(p.sections||[]).entries()){const section=el('section',{class:'reading-section',id:s.id},[el('p',{class:'section-kicker',text:'SECTION '+String(i+1).padStart(2,'0')+' · '+(labels[s.id]||'READING')}),el('h2',{text:shortSection(s)}),...s.blocks.map(renderBlock)]);if(s.id==='related')section.append(relatedGrid(p));root.append(section);}
 if(p.project_links?.length)root.append(el('section',{class:'reading-section'},[el('p',{class:'section-kicker',text:'CONNECTED RESEARCH'}),el('h2',{text:'连接到正在做的研究'}),el('ul',{class:'project-reading-links'},p.project_links.map(l=>el('li',{},[link(l.project_title,l.link_url),el('p',{text:l.relation})])))]));
 renderToc(p);renderEvidences(p);renderDownloads(p);renderNotes(p);
}
function renderEvidences(p){const root=$('evidence-list');root.replaceChildren();if(!p.evidences?.length){root.append(el('p',{class:'evidence-shared',text:'本条目尚未整理逐节证据，可通过论文原文继续阅读。'}));return;}root.append(el('p',{class:'evidence-shared',text:(p.evidences.every(e=>e.source_check?.status==='source_checked')?'本篇来源位置已核对 · '+p.version:'部分来源位置仍待核对')+'。来源核对不等于本地复现；人工复核状态见各条记录。'}));for(const e of p.evidences||[])root.append(el('section',{class:'evidence-card',id:'card-'+e.id,tabindex:'-1'},[el('h3',{class:'evidence-loc',text:e.location}),el('p',{class:'evidence-summary',text:e.summary}),link('打开原文位置',e.source_url,{target:'_blank',rel:'noopener noreferrer'}),e.source_check?.status!=='source_checked'?el('p',{class:'evidence-verif',text:'来源待核对'}):null,e.verification?.status==='reviewed'?el('p',{class:'evidence-verif',text:'人工复核记录存在 · '+e.verification.by}):null]));}
function renderDownloads(p){const root=$('export-links-list');root.replaceChildren();const exports=[['阅读稿 · Markdown',`./papers/${p.id}.md`],['本篇引用 · BibTeX',`./papers/${p.id}.bib`],['整库引用 · BibTeX','./library.bib']];if(p.content_status==='deep_dive')exports.splice(1,0,['六页汇报 · Slidev 源码',`./slides/${p.id}.slidev.md`]);for(const [title,url]of exports)root.append(link(title,url,{download:url.split('/').pop(),class:'btn'}));}
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
 if(parts[0]==='main-content')return;
 const next=data.papers[parts[0]]?parts[0]:null;
 if(!next){$('library-view').hidden=false;$('paper-view').hidden=true;$('home-link').setAttribute('aria-current','page');document.title='Rise Research · 论文阅读与研究进展';renderList();if(paperId){paperId='';window.scrollTo({top:homeScroll,behavior:'instant'});}if(parts[0]==='library')$('library').scrollIntoView({behavior:smooth()});return;}
 const changed=paperId!==next;paperId=next;sectionId=parts[1]||'';$('library-view').hidden=true;$('paper-view').hidden=false;$('home-link').removeAttribute('aria-current');
 if(changed)renderArticle();
 if(sectionId&&(data.papers[paperId].sections||[]).some(s=>s.id===sectionId))$(sectionId)?.scrollIntoView({behavior:smooth(),block:'start'});
 else if(changed)window.scrollTo({top:0,behavior:'instant'});
}
async function init(){try{
 const response=await fetch('./reading-data.json');if(!response.ok)throw Error('HTTP '+response.status);data=await response.json();
 for(const t of Object.values(data.topics))$('topic-select').append(el('option',{value:t.id,text:t.title}));
 for(const year of[...new Set(knownPapers().map(p=>p.year))].sort().reverse())$('year-select').append(el('option',{value:String(year),text:String(year)}));
 if(localMode)try{const raw=localStorage.getItem(STORE);if(raw)personal=validatePersonal(JSON.parse(raw));}catch{storageError='未读取到可用本机记录；仍可阅读与备份新笔记。';}
 $('search-input').addEventListener('input',e=>{filters.query=e.target.value.trim().toLowerCase();renderList();});
 for(const[id,key]of[['topic-select','topic'],['year-select','year'],['filter-select','status']])$(id).addEventListener('change',e=>{filters[key]=e.target.value;renderList();});
 $('reset-filters').addEventListener('click',resetFilters);
 if(localMode){$('notes-textarea').addEventListener('input',noteChanged);$('reading-status').addEventListener('change',noteChanged);$('note-section').addEventListener('change',()=>{$('notes-textarea').value=ensureRecord(paperId).notes[$('note-section').value]||'';});$('save-notes-btn').addEventListener('click',saveNotes);$('export-notes-btn').addEventListener('click',backup);$('import-notes-file').addEventListener('change',restore);}
 window.addEventListener('hashchange',onRoute);onRoute();
 }catch(err){$('library-view').hidden=true;$('paper-view').hidden=false;$('article-container').replaceChildren(el('h1',{text:'阅读台暂时无法加载'}),el('p',{text:'请通过本地 HTTP 服务或站点入口打开。'+err.message}));}
}
init();
})();
