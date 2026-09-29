import './style.css';

const stories = [
  { id:'historia1', label:'O teu lugar', unlock:[2026,8,29] },
  { id:'historia2', label:'O traballo', unlock:[2026,8,30] },
  { id:'historia3', label:'O medo', unlock:[2026,9,1] },
  { id:'historia4', label:'As decisións', unlock:[2026,9,2] },
  { id:'historia5', label:'O que queda', unlock:[2026,9,3] },
  { id:'historia6', label:'O que vén', unlock:[2026,9,4] },
  { id:'historia7', label:'A felicidade', unlock:[2026,9,5] }
];
// Desbloqueo acumulativo usando a data local do dispositivo.
// new Date(ano, mes-1, día) representa as 00:00 locais dese día.
const today = new Date();
function storyIsAvailable(story){
  const [y,m,d] = story.unlock;
  return today >= new Date(y,m,d);
}
let activeStory='historia1';

const people = [
 {id:'maria', name:'María', icon:'👩🏻', clue:'Está na Granxa. Pepe está na mesma zona, dúas filas máis abaixo e á súa dereita.'},
 {id:'pepe', name:'Pepe', icon:'🧔🏻', clue:'Comparte zona con María. Non está na mesma fila nin columna ca ela e queda máis preto do centro do taboleiro.'},
 {id:'elva', name:'Elva', icon:'👧🏻', clue:'Está nunha zona con area. Queda en diagonal cunha persoa e ten o mar á súa dereita.'},
 {id:'brais', name:'Brais', icon:'👨🏻', clue:'Está na Feira. Os fogos quedan na súa mesma zona, por riba e á súa dereita.'},
 {id:'mariap', name:'María · Pechuchis', icon:'👩🏻‍🦰', clue:'Está no Bosque dos Pechuchis. Balú queda tres filas por arriba e unha columna á súa esquerda.'},
 {id:'toni', name:'Toni', icon:'👨🏻‍💻', clue:'Non está nin na Granxa nin na Praia. Está nunha zona con cadeiras e queda máis á dereita ca Balú.'},
 {id:'lucia', name:'Lucía', icon:'👩🏻', clue:'Está na Casa. A porta queda por debaixo e á súa dereita, pero non nunha casilla contigua.'},
 {id:'carmen', name:'Carmen', icon:'👵🏻🦋', clue:'Está soa no Xardín das Bolboretas. Hai unha bolboreta na súa mesma fila.'},
 {id:'balu', name:'Balú', icon:'🐶', clue:'Está no Bosque dos Pechuchis e queda ao lado dunha árbore.'},
 {id:'silvia', name:'Silvia', icon:'👩🏻', clue:'A súa ficha desbloquéase cando os outros nove xa están colocados. O seu lugar mira directamente cara ao solpor.'}
];

const Z=[
 ['casa','casa','casa','feira','feira','feira','xardin','xardin','xardin','xardin'],
 ['casa','casa','casa','feira','feira','feira','xardin','xardin','xardin','xardin'],
 ['casa','casa','casa','feira','feira','feira','xardin','xardin','xardin','xardin'],
 ['granxa','granxa','granxa','granxa','feira','bosque','bosque','xardin','xardin','xardin'],
 ['granxa','granxa','granxa','granxa','bosque','bosque','bosque','bosque','cafe','cafe'],
 ['granxa','granxa','granxa','granxa','bosque','bosque','bosque','cafe','cafe','cafe'],
 ['granxa','granxa','granxa','principal','bosque','bosque','bosque','cafe','cafe','cafe'],
 ['principal','principal','principal','praia','praia','bosque','praia','praia','praia','praia'],
 ['principal','principal','principal','praia','praia','bosque','praia','praia','praia','praia'],
 ['principal','principal','principal','praia','praia','praia','praia','praia','praia','praia']
];
const boardPersonIcon={carmen:'👵🏻'};
const zoneNames={casa:'CASA',feira:'FEIRA',xardin:'XARDÍN DAS BOLBORETAS',granxa:'GRANXA',bosque:'BOSQUE DOS PECHUCHIS',cafe:'CAFETERÍA',praia:'PRAIA DO SOLPOR',principal:'ÁREA PRINCIPAL'};
// Unha persoa por fila e columna. Elva e Silvia quedan en diagonal na praia.
const solution={lucia:[0,1],brais:[1,3],carmen:[2,6],maria:[3,0],balu:[4,4],pepe:[5,2],toni:[6,9],mariap:[7,5],silvia:[8,8],elva:[9,7]};

const objects={
 '0,2':'🌳','0,4':'🎆','0,6':'🌷','0,8':'🦋',
 '1,2':'🚪','1,5':'🎡','1,8':'🌿','1,9':'🦋',
 '2,1':'🪴','2,4':'🎪','2,7':'🦋','2,9':'🌸',
 '3,1':'🐄','3,2':'🌾','3,6':'🌳','3,8':'🌺',
 '4,1':'🚜','4,5':'🌲','4,6':'🐾','4,9':'☕',
 '5,0':'🌾','5,4':'🪨','5,6':'🌿','5,9':'🪑',
 '6,1':'🐄','6,4':'🌲','6,6':'🐕','6,8':'☕',
 '7,0':'🪧','7,3':'⛱️','7,7':'🪨',
 '8,1':'🪨','8,6':'🐚',
 '9,2':'🌴','9,6':'🪨'
};
const blocked=new Set([...Object.keys(objects),'8,9']);
const decor={'8,9':'sun'};
const labels={casa:[0,0],feira:[0,3],xardin:[0,6],granxa:[3,0],bosque:[3,5],cafe:[4,8],principal:[7,0],praia:[7,3]};
const workPeople=[
 {id:'wsilvia',name:'Silvia',icon:'👩🏻',clue:'Hoxe non está na mesa de Contabilidade. Está nun lugar onde se pode tomar un café.'},
 {id:'marcos',name:'Marcos',icon:'👨🏻',clue:'Está na mesma zona ca Silvia, pero non na súa fila nin na súa columna.'},
 {id:'wbrais',name:'Brais',icon:'🚚',clue:'Está no exterior e dentro dunha das furgonetas.'},
 {id:'xefe1',name:'Xefe 1',icon:'👨🏻‍💼',clue:'Comparte o mesmo despacho coa Xefa 2.'},
 {id:'xefa2',name:'Xefa 2',icon:'👩🏻‍💼',clue:'Comparte o mesmo despacho co Xefe 1 e está máis á dereita ca el.'},
 {id:'conta2',name:'Contabilidade 2',icon:'🧑🏻‍💻',clue:'Está en Contabilidade, máis arriba ca Contabilidade 3.'},
 {id:'conta3',name:'Contabilidade 3',icon:'👩🏻‍💻',clue:'Está en Contabilidade e non comparte fila con ningún dos xefes.'},
 {id:'com1',name:'Comercial 1',icon:'🧑🏻‍💼',clue:'Hoxe está fóra das oficinas, máis á esquerda ca Comercial 2.'},
 {id:'com2',name:'Comercial 2',icon:'👩🏻‍💼',clue:'Está fóra das oficinas e máis á dereita ca Comercial 1.'},
 {id:'repartidor',name:'Repartidor',icon:'📦',clue:'Está fóra das oficinas, na zona de carga.'},
 {id:'lesionada',name:'Oficinista lesionada',icon:'🤕',trap:true,clue:'Nin aquí nin alá.'}
];
const WZ=[
 ['conta','conta','conta','conta','desp','desp','desp','com','com','com'],
 ['conta','conta','conta','conta','desp','desp','desp','com','com','com'],
 ['conta','conta','conta','cafe','desp','desp','desp','com','com','com'],
 ['conta','conta','cafe','cafe','cafe','cafe','com','com','com','com'],
 ['arquivo','arquivo','cafe','cafe','cafe','cafe','paso','paso','paso','paso'],
 ['arquivo','arquivo','cafe','cafe','cafe','cafe','paso','paso','paso','paso'],
 ['parking','parking','parking','parking','parking','parking','carga','carga','carga','carga'],
 ['parking','parking','parking','parking','parking','parking','carga','carga','carga','carga'],
 ['parking','parking','parking','parking','parking','parking','carga','carga','carga','carga'],
 ['parking','parking','parking','parking','parking','parking','carga','carga','carga','carga']
];
const workZoneNames={conta:'CONTABILIDADE',desp:'DESPACHO',com:'COMERCIAL',cafe:'CAFETERÍA',arquivo:'ARQUIVO',paso:'SAÍDA',parking:'EXTERIOR · FURGONETAS',carga:'ZONA DE CARGA'};
const workLabels={conta:[0,0],desp:[0,4],com:[0,7],cafe:[3,2],arquivo:[4,0],paso:[4,6],parking:[6,0],carga:[6,6]};
const workSolution={conta2:[0,1],xefe1:[1,4],xefa2:[2,6],conta3:[3,0],wsilvia:[4,3],marcos:[5,5],wbrais:[6,2],com1:[7,7],com2:[8,9],repartidor:[9,8]};
const workObjects={'0,3':'🖨️','0,5':'🗄️','0,9':'☎️','1,2':'🧮','1,6':'🪴','2,2':'📚','2,8':'💼','3,4':'☕','4,2':'🪑','4,5':'🪑','5,2':'🥤','5,4':'🪑','6,0':'🚐','6,2':'🚐','6,4':'🚐','7,1':'🚐','7,4':'🚐','8,0':'🚐','8,3':'🚐','8,5':'🚐','6,8':'📦','7,6':'🪵','8,8':'📦','9,6':'📦','9,9':'📦'};
// Todas as furgonetas teñen exactamente o mesmo aspecto e son candidatas para Brais.
const workVans=new Set(['6,0','6,2','6,4','7,1','7,4','8,0','8,3','8,5']);
const workPassableDecor=workVans;

const general=`Hai exactamente <b>un personaxe en cada fila e un en cada columna</b>. Cada casilla pertence a unha única zona. Unha zona pode ter unha, varias ou ningunha persoa. Os elementos do escenario ocupan a súa casilla e non se poden tapar.`;

document.querySelector('#app').innerHTML=`
<nav class="storyTabs" aria-label="Historias">${stories.map((story,i)=>`<button id="${story.id}" class="storyTab ${i===0?'active':''}" data-story="${story.id}"${storyIsAvailable(story)?'': ' style="display:none"'}>${story.label}</button>`).join('')}</nav>
<div id="storyContent">
<header class="hero"><div><span class="eyebrow">EXPEDIENTE 10×10</span><h1>MURDOKU</h1><p>O teu lugar</p></div><button id="rulesBtn" class="ghost">Como xogar</button></header>
<div class="game">
 <aside class="leftPanel panel"><h2>PERSONAXES</h2><p class="muted">A pista de cada persoa está na súa ficha. Arrástraa a unha casilla libre.</p><div id="cards" class="cards"></div></aside>
 <main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="board" class="board"></div></div></div><div class="legend"><span>■ Elemento non ocupable</span><span class="okdot">● Correcto</span><span class="baddot">● Incorrecto</span></div></main>
 <aside class="rightPanel panel"><section class="general"><h2>PISTA XERAL</h2><p>${general}</p></section><div id="status" class="status">Coloca os nove personaxes dispoñibles.</div><div class="actions"><button id="check" class="primary" disabled>🔎 COMPROBAR</button><button id="reset" class="secondary">↻ LIMPAR</button></div></aside>
</div></div><dialog id="rules"><button id="closeRules" class="close">×</button><h2>Como xogar</h2><p>${general}</p><p><b>COMPROBAR</b> só se activa cando os dez personaxes están colocados. Silvia desbloquéase automaticamente ao colocar os outros nove. Verde = posición correcta; vermello = posición incorrecta. Non hai límite de intentos.</p></dialog>`;

const board=document.querySelector('#board'),cards=document.querySelector('#cards'),status=document.querySelector('#status'),checkBtn=document.querySelector('#check');
const placements={}; const cellAt=(r,c)=>board.children[r*10+c];
function edgeClasses(r,c){const z=Z[r][c],a=[];if(r===0||Z[r-1][c]!==z)a.push('zt');if(r===9||Z[r+1][c]!==z)a.push('zb');if(c===0||Z[r][c-1]!==z)a.push('zl');if(c===9||Z[r][c+1]!==z)a.push('zr');return a.join(' ')}
function beachClass(r,c){if(Z[r][c]!=='praia')return''; return c===9?'sea':''}
for(let r=0;r<10;r++)for(let c=0;c<10;c++){
 const cell=document.createElement('div'); cell.className=`cell zone-${Z[r][c]} ${edgeClasses(r,c)} ${beachClass(r,c)}`; cell.dataset.r=r;cell.dataset.c=c;
 if(objects[`${r},${c}`]){cell.classList.add('blocked');cell.innerHTML=`<span class="object">${objects[`${r},${c}`]}</span>`}
 if(decor[`${r},${c}`]==='sun'){cell.innerHTML+=`<span class="decor sun-in-cell" aria-label="Solpor"><i class="sun-disc"></i><i class="sun-reflection"></i></span>`}
 cell.addEventListener('dragover',e=>{if(!blocked.has(`${r},${c}`))e.preventDefault()});
 cell.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)place(id,r,c)});
 cell.addEventListener('click',()=>{const selected=document.querySelector('.card.selected');if(selected)place(selected.dataset.id,r,c)});board.appendChild(cell);
}
for(const [z,[r,c]] of Object.entries(labels)){const lab=document.createElement('span');lab.className='zoneLabel';lab.textContent=zoneNames[z];cellAt(r,c).appendChild(lab)}
function makeToken(p){const t=document.createElement('div');t.className='token';t.dataset.id=p.id;t.draggable=true;t.innerHTML=`<span>${boardPersonIcon[p.id] || p.icon}</span><b>${p.name}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.ondblclick=()=>returnToCard(p.id);return t}
function makeCard(p){const d=document.createElement('article');d.className='card'+(p.id==='silvia'?' locked':'');d.dataset.id=p.id;d.innerHTML=`<div class="portrait">${p.icon}</div><div class="cardText"><b>${p.name}${p.id==='silvia'?' 🔒':''}</b><small>${p.clue}</small></div>`;d.addEventListener('click',()=>{if(d.classList.contains('locked'))return;document.querySelectorAll('.card').forEach(x=>x.classList.remove('selected'));d.classList.add('selected')});return d}
people.forEach(p=>{const card=makeCard(p);card.appendChild(makeToken(p));cards.appendChild(card)});
function updateExclusions(){
 document.querySelectorAll('.cell').forEach(cell=>cell.classList.remove('excluded'));
 const usedRows=new Set(),usedCols=new Set();
 Object.values(placements).forEach(([r,c])=>{usedRows.add(r);usedCols.add(c)});
 document.querySelectorAll('.cell').forEach(cell=>{
   const r=+cell.dataset.r,c=+cell.dataset.c;
   if((usedRows.has(r)||usedCols.has(c)) && !cell.querySelector('.token')) cell.classList.add('excluded');
 });
}
function returnToCard(id){const p=people.find(x=>x.id===id),card=cards.querySelector(`[data-id="${id}"]`);document.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());card.appendChild(makeToken(p));delete placements[id];updateExclusions();updateCheckState()}
function place(id,r,c){
 const card=cards.querySelector(`[data-id="${id}"]`);
 if(!card||card.classList.contains('locked')||blocked.has(`${r},${c}`))return;
 const target=cellAt(r,c),occupying=target.querySelector('.token');
 if(occupying&&occupying.dataset.id!==id)return;
 for(const [other,[rr,cc]] of Object.entries(placements)){
   if(other!==id && (rr===r||cc===c)) return;
 }
 document.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());
 target.appendChild(makeToken(people.find(x=>x.id===id)));
 placements[id]=[r,c];
 card.classList.remove('selected');
 updateExclusions();
 updateCheckState();
}

function renderWorkStory(){
 storyContent.classList.remove('storyPlaceholder');
 storyContent.innerHTML=`<header class="hero"><div><span class="eyebrow">EXPEDIENTE 10×10 · HISTORIA 2</span><h1>SILDOKU</h1><p>O traballo</p></div></header><div class="game"><aside class="leftPanel panel"><h2>PERSONAXES</h2><p class="muted">Hai 11 fichas á vista... pero o taboleiro segue sendo 10×10.</p><div id="wcards" class="cards"></div></aside><main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="wboard" class="board workBoard"></div></div></div></main><aside class="rightPanel panel"><section class="general workGeneral"><h2>PISTA XERAL</h2><p><b>Quizais hoxe alguén debería estar traballando e non está...</b> Por iso hai zonas baleiras. Hai unha persoa por fila e unha por columna.</p><div class="workKey"><span>🏢 INTERIOR</span><span>🚐 EXTERIOR</span></div></section><div id="wstatus" class="status">Coloca as 10 persoas que realmente viñeron traballar.</div><div class="actions"><button id="wcheck" class="primary" disabled>🔎 COMPROBAR</button><button id="wreset" class="secondary">↻ LIMPAR</button></div></aside></div><div id="toast" class="workToast" aria-live="polite"></div>`;
 const wb=document.querySelector('#wboard'), wc=document.querySelector('#wcards'), ws=document.querySelector('#wstatus'), wcheck=document.querySelector('#wcheck');
 const wp={}; const blockedW=new Set(Object.keys(workObjects).filter(k=>!workPassableDecor.has(k)));
 const wat=(r,c)=>wb.children[r*10+c];
 function wedges(r,c){const z=WZ[r][c],a=[];if(r===0||WZ[r-1][c]!==z)a.push('zt');if(r===9||WZ[r+1][c]!==z)a.push('zb');if(c===0||WZ[r][c-1]!==z)a.push('zl');if(c===9||WZ[r][c+1]!==z)a.push('zr');return a.join(' ')}
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const ce=document.createElement('div');ce.className=`cell work-${WZ[r][c]} ${wedges(r,c)}`;ce.dataset.r=r;ce.dataset.c=c;if(workObjects[`${r},${c}`]){if(!workPassableDecor.has(`${r},${c}`))ce.classList.add('blocked');else ce.classList.add('vehicleSeat');ce.innerHTML=`<span class="object">${workObjects[`${r},${c}`]}</span>`}ce.addEventListener('dragover',e=>{if(!blockedW.has(`${r},${c}`))e.preventDefault()});ce.addEventListener('drop',e=>{e.preventDefault();wplace(e.dataTransfer.getData('text/plain'),r,c)});ce.addEventListener('click',()=>{const sel=wc.querySelector('.card.selected');if(sel)wplace(sel.dataset.id,r,c)});wb.appendChild(ce)}
 for(const [z,[r,c]] of Object.entries(workLabels)){const l=document.createElement('span');l.className='zoneLabel';l.textContent=workZoneNames[z];wat(r,c).appendChild(l)}
 function toast(){const t=document.querySelector('#toast');t.textContent='🏠 Hoxe toca teletraballo 😂';t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1800)}
 function token(p){const t=document.createElement('div');t.className='token';t.dataset.id=p.id;t.draggable=true;t.innerHTML=`<span>${p.icon}</span><b>${p.name}</b>`;t.addEventListener('dragstart',e=>{if(p.trap){e.preventDefault();toast()}else e.dataTransfer.setData('text/plain',p.id)});t.ondblclick=()=>wreturn(p.id);return t}
 workPeople.forEach(p=>{const d=document.createElement('article');d.className='card'+(p.trap?' trapCard':'');d.dataset.id=p.id;d.innerHTML=`<div class="portrait">${p.icon}</div><div class="cardText"><b>${p.name}${p.trap?' · 11':''}</b><small>${p.clue}</small></div>`;d.addEventListener('click',()=>{if(p.trap){toast();return}wc.querySelectorAll('.card').forEach(x=>x.classList.remove('selected'));d.classList.add('selected')});d.appendChild(token(p));wc.appendChild(d)});
 function wx(){wb.querySelectorAll('.cell').forEach(x=>x.classList.remove('excluded'));const rs=new Set(),cs=new Set();Object.values(wp).forEach(([r,c])=>{rs.add(r);cs.add(c)});wb.querySelectorAll('.cell').forEach(x=>{const r=+x.dataset.r,c=+x.dataset.c;if((rs.has(r)||cs.has(c))&&!x.querySelector('.token'))x.classList.add('excluded')})}
 function wreturn(id){if(id==='lesionada')return;const p=workPeople.find(x=>x.id===id),card=wc.querySelector(`[data-id="${id}"]`);wb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());card.appendChild(token(p));delete wp[id];wx();state()}
 function wplace(id,r,c){const p=workPeople.find(x=>x.id===id);if(!p)return;if(p.trap){toast();return}if(blockedW.has(`${r},${c}`))return;if(workVans.has(`${r},${c}`) && id!=='wbrais')return;for(const [o,[rr,cc]] of Object.entries(wp))if(o!==id&&(rr===r||cc===c))return;const target=wat(r,c);if(target.querySelector('.token')&&target.querySelector('.token').dataset.id!==id)return;wb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());target.appendChild(token(p));wp[id]=[r,c];wc.querySelector(`[data-id="${id}"]`).classList.remove('selected');wx();state()}
 function state(){const n=Object.keys(wp).length;wcheck.disabled=n!==10;ws.textContent=n===10?'As 10 persoas están colocadas. Xa podes comprobar.':`${n}/10 persoas colocadas. A nº 11 parece ter outros plans...`}
 wcheck.onclick=()=>{let good=0;wb.querySelectorAll('.token').forEach(t=>{t.classList.remove('good','bad');const pos=wp[t.dataset.id],sol=workSolution[t.dataset.id],ok=sol&&pos[0]===sol[0]&&pos[1]===sol[1];t.classList.add(ok?'good':'bad');if(ok)good++});ws.innerHTML=good===10?'🏢 <b>CASO RESOLTO.</b> Hoxe si apareceu todo o mundo... máis ou menos.':`${good}/10 posicións correctas. Verde = ben; vermello = revisa.`};
 document.querySelector('#wreset').onclick=()=>renderWorkStory();state();
}

function unlockedIds(){return people.filter(p=>!cards.querySelector(`[data-id="${p.id}"]`).classList.contains('locked')).map(p=>p.id)}
function updateCheckState(){
 const silviaCard=cards.querySelector('[data-id="silvia"]');
 const firstNine=people.filter(p=>p.id!=='silvia').map(p=>p.id);
 const nFirst=firstNine.filter(id=>placements[id]).length;
 if(nFirst===9 && silviaCard.classList.contains('locked')){
   silviaCard.classList.remove('locked');
   silviaCard.querySelector('.cardText b').textContent='Silvia';
 }
 const silviaUnlocked=!silviaCard.classList.contains('locked');
 const totalPlaced=people.filter(p=>placements[p.id]).length;
 checkBtn.disabled=!(silviaUnlocked && totalPlaced===10);
 if(!silviaUnlocked){
   status.textContent=`${nFirst}/9 fichas colocadas. Ao colocar a novena desbloquéase Silvia.`;
 } else if(!placements.silvia){
   status.innerHTML='🔓 <b>Silvia está desbloqueada.</b> Colócaa para poder comprobar.';
 } else {
   status.textContent='As 10 fichas están colocadas. Xa podes comprobar.';
 }
}
function conflicts(id,[r,c]){for(const [other,[rr,cc]]of Object.entries(placements))if(other!==id&&(rr===r||cc===c))return true;return false}
function unlockSilvia(){const card=cards.querySelector('[data-id="silvia"]');if(card.classList.contains('locked')){card.classList.remove('locked');card.querySelector('.cardText b').textContent='Silvia';status.innerHTML='🔓 <b>Silvia está desbloqueada.</b> Só queda completar o taboleiro.';updateCheckState()}}
function check(){if(checkBtn.disabled)return;let correctOthers=0;document.querySelectorAll('.board .token').forEach(t=>t.classList.remove('good','bad'));for(const [id,pos]of Object.entries(placements)){const t=document.querySelector(`.board .token[data-id="${id}"]`),sol=solution[id],ok=sol&&sol[0]===pos[0]&&sol[1]===pos[1]&&!conflicts(id,pos);t?.classList.add(ok?'good':'bad');if(ok&&id!=='silvia')correctOthers++}const s=placements.silvia;if(s&&s[0]===solution.silvia[0]&&s[1]===solution.silvia[1]&&!conflicts('silvia',s)){status.innerHTML='🌅 <b>CASO RESOLTO.</b> Todo está no seu lugar.';document.body.classList.add('solved');checkBtn.disabled=true;return}status.textContent=`${correctOthers}/9 posicións previas correctas. Verde = ben; vermello = revisa.`}
checkBtn.onclick=check;document.querySelector('#reset').onclick=()=>location.reload();const dlg=document.querySelector('#rules');document.querySelector('#rulesBtn').onclick=()=>dlg.showModal();document.querySelector('#closeRules').onclick=()=>dlg.close();
const storyContent=document.querySelector('#storyContent');
document.querySelectorAll('.storyTab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.storyTab').forEach(x=>x.classList.toggle('active',x===btn));
  activeStory=btn.dataset.story;
  if(activeStory==='historia1'){
    location.reload();
  } else if(activeStory==='historia2'){
    renderWorkStory();
  } else {
    storyContent.classList.add('storyPlaceholder');
    storyContent.querySelector('.game').style.display='none';
    storyContent.querySelector('.hero').style.display='none';
    let ph=storyContent.querySelector('.comingSoon');
    if(!ph){ph=document.createElement('section');ph.className='comingSoon';storyContent.appendChild(ph)}
    ph.innerHTML=`<span>PRÓXIMO EXPEDIENTE</span><h2>${btn.textContent}</h2><p>Aquí irá un novo Sildoku coa súa propia historia, personaxes, pistas e taboleiro.</p>`;
  }
}));
updateCheckState();
