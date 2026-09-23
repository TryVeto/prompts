const $=s=>document.querySelector(s);
const keyMap={'1':'01','2':'02','3':'03','4':'04','5':'05','6':'06','7':'07','8':'08','9':'09','0':'10',r:'R',c:'C',x:'X',q:'Q',s:'S',b:'B',j:'J',n:'N'};
let prompts=[],matches=[],chosen=null,openId=null,composing=false;
const row=id=>prompts.find(p=>p.id===id);
const normalize=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function fuzzy(q,t){if(!q)return 1;if(t===q)return 1000;if(t.startsWith(q))return 850;if(t.includes(q))return 700;if(q.split(' ').every(w=>t.includes(w)))return 550;if(q.includes(' ')||q.length<3)return 0;let at=0,first=-1,last=0;for(const c of q){const i=t.indexOf(c,at);if(i<0)return 0;if(first<0)first=i;last=i;at=i+1}return Math.max(0,170-(last-first-q.length)*4-first)}
function search(query){const q=normalize(query);if(!q)return prompts;return prompts.map((p,i)=>({p,i,score:Math.max(fuzzy(q,normalize(p.title))*1.3,fuzzy(q,normalize(p.aliases))*1.1,fuzzy(q,normalize(p.subtitle))*.6,fuzzy(q,p.key.toLowerCase())*1.5)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.p)}
function node(tag,cls='',text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function notify(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.hidden=true,1600)}
function setChosen(id,focus=false,announce=false){chosen=id;document.querySelectorAll('.prompt-row').forEach(x=>{const on=x.dataset.row===id;x.classList.toggle('selected',on);x.setAttribute('aria-selected',String(on))});if(focus)document.querySelector(`[data-open="${id}"]`)?.focus({preventScroll:false});if(announce){const p=row(id);if(p){$('#key-hint').textContent=`${p.key} selected · Enter to open ${p.title}`;notify(`${p.key} · ${p.title} selected — Enter to open`)}}}
function render(){const out=$('#results');out.replaceChildren();matches=search($('#find').value);if(!matches.some(p=>p.id===chosen))chosen=matches[0]?.id||null;if(!matches.length){out.append(node('div','empty','No matching prompts.'));return}let last=null;
for(const p of matches){if(!$('#find').value.trim()&&last!==p.group){if(last!==null)out.append(node('hr','group-break'));const h=node('h2','group-heading'+(!last?' first':''),p.group==='building'?'Building Stuff':p.group==='helper'?'When needed':'Prompts');out.append(h);last=p.group}
const wrap=node('div','prompt-row');wrap.dataset.row=p.id;wrap.classList.toggle('selected',p.id===chosen);const b=node('button','copy-row');b.type='button';b.dataset.open=p.id;b.setAttribute('aria-label',`Open ${p.title}`);b.append(node('kbd','shortcut',p.key),node('span','label',p.title),node('span','row-caret','›'));b.addEventListener('focus',()=>setChosen(p.id));b.addEventListener('click',()=>openReader(p.id));wrap.append(b);out.append(wrap)}}
function prose(text,target){
 target.replaceChildren();
 const labels={'MY ROUGH IDEA':'Your idea','STARTING MATERIAL':'Starting material','RETURN':'What to deliver','DEPTH AND AMBITION':'Depth and ambition','AVAILABLE CAPABILITIES':'Tools and resources','AUTHORITY AND CONTINUITY':'Authority and continuity','TASK AND STARTING MATERIAL':'Task and starting material','ASSIGNMENT / OPEN CHOICE':'The open question'};
 for(const block of text.split(/\n\s*\n/)){
  const lines=block.split('\n');
  if(/^[A-Z][A-Z /&—-]+$/.test(lines[0])&&lines[0].length<65){
   const label=lines.shift(),h=document.createElement('h3');
   h.textContent=labels[label]||label.charAt(0)+label.slice(1).toLowerCase();target.append(h);
  }
  if(lines.length){const p=document.createElement('p');p.textContent=lines.join('\n');if(/^\[.*\]$/s.test(p.textContent.trim()))p.className='prompt-input';target.append(p);}
 }
}
function routeId(){const m=location.pathname.match(/^\/prompt\/([^/]+)\/?$/);return m?decodeURIComponent(m[1]):null}
function openReader(id,push=true){const p=row(id);if(!p)return;openId=id;chosen=id;$('#launcher').hidden=true;$('#reader').hidden=false;$('#reader-key').textContent=`${p.key} · Prompt`;$('#reader-title').textContent=p.title;$('#reader-subtitle').textContent=p.subtitle;$('#reader-use').textContent=p.useWhen;prose(p.body,$('#reader-text'));window.scrollTo(0,0);if(push&&location.pathname!==`/prompt/${encodeURIComponent(id)}`)history.pushState({prompt:id},'',`/prompt/${encodeURIComponent(id)}`);$('#reader-back').focus({preventScroll:true})}
function closeReader(push=true){openId=null;$('#reader').hidden=true;$('#launcher').hidden=false;if(push&&location.pathname!=='/')history.pushState({},'','/');requestAnimationFrame(()=>{$('#launcher').focus({preventScroll:true});setChosen(chosen,true)})}
function goBack(){if(history.state?.prompt===openId)history.back();else{history.replaceState({},'','/');closeReader(false)}}
async function copyPrompt(){const p=row(openId);if(!p)return;try{await navigator.clipboard.writeText(p.body);notify(`${p.title} copied`)}catch{$('#manual-text').value=p.body;$('#manual').showModal();$('#manual-text').focus();$('#manual-text').select()}}
async function copySelected(id){const p=row(id);if(!p)return;try{await navigator.clipboard.writeText(p.body);$('#key-hint').textContent=p.key+' copied · Enter to open '+p.title;notify('Copied: '+p.key+' · '+p.title+' — Enter to open')}catch{$('#manual-text').value=p.body;$('#manual').showModal();$('#manual-text').focus();$('#manual-text').select()}}
function move(delta){if(!matches.length)return;let i=matches.findIndex(p=>p.id===chosen);i=(i+delta+matches.length)%matches.length;setChosen(matches[i].id,true)}
function activeInput(e){return e.composedPath().some(x=>x instanceof Element&&(x.matches('input,textarea,select,[contenteditable=true]')||x.isContentEditable))}
$('#find').addEventListener('input',render);
$('#focus-search').addEventListener('click',()=>{$('#find').focus();$('#find').select()});
$('#find').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(row(chosen))openReader(chosen)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();move(e.key==='ArrowDown'?1:-1)}else if(e.key==='Escape'){e.preventDefault();$('#find').value='';render();$('#launcher').focus()}});
$('#reader-back').addEventListener('click',goBack);
$('#reader-copy').addEventListener('click',copyPrompt);
$('.close-dialog').addEventListener('click',()=>$('#manual').close());
$('#manual').addEventListener('cancel',e=>{e.preventDefault();$('#manual').close()});
document.addEventListener('compositionstart',()=>composing=true);
document.addEventListener('compositionend',()=>composing=false);
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.isComposing||composing||e.repeat)return;const mod=e.metaKey||e.ctrlKey;if(openId){if(e.key==='Escape'){e.preventDefault();goBack()}else if(mod&&e.key==='Enter'){e.preventDefault();copyPrompt()}return}if(mod&&!e.altKey&&e.key.toLowerCase()==='k'){e.preventDefault();$('#find').focus();$('#find').select();return}if(activeInput(e))return;if(e.key==='Enter'){e.preventDefault();if(row(chosen))openReader(chosen);return}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();move(e.key==='ArrowDown'?1:-1);return}if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;const id=keyMap[e.key.toLowerCase()];if(id&&row(id)){e.preventDefault();setChosen(id,true,false);copySelected(id)}});
window.addEventListener('popstate',()=>{const id=routeId();if(id&&row(id))openReader(id,false);else if(openId)closeReader(false)});
try{prompts=await fetch('/prompts.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()});render();const id=routeId();if(id&&row(id))openReader(id,false);else $('#launcher').focus({preventScroll:true})}catch{$('#load-error').hidden=false;$('#load-error').textContent='Could not load the prompt library.'}
