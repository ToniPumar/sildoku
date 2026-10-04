import './style.css';

const stories = [
  { id:'historia1', label:'O teu lugar', unlock:[2026,8,29] },
  { id:'historia2', label:'O traballo', unlock:[2026,8,30] },
  { id:'historia3', label:'O medo', unlock:[2026,9,1] },
  { id:'historia4', label:'Silvias', unlock:[2026,9,2] },
  { id:'historia5', label:'O que queda', unlock:[2026,9,3] },
  { id:'historia6', label:'Por descubrir', unlock:[2026,9,4] },
  { id:'historia7', label:'A felicidade', unlock:[2026,9,5] }
];
// Desbloqueo acumulativo usando a data local do dispositivo.
// Para probas: engade ?proba=3 (ou 1..7) á URL para mostrar ata esa historia.
// Sen ?proba=, Silvia verá exclusivamente o que corresponda pola data real.
const today = new Date();
const probaParam = Number.parseInt(new URLSearchParams(window.location.search).get('proba') || '', 10);
const proba = Number.isInteger(probaParam) && probaParam >= 1 && probaParam <= stories.length
  ? probaParam
  : null;

function storyIsAvailable(story){
  if (proba !== null) {
    return stories.findIndex(s => s.id === story.id) < proba;
  }
  const [y,m,d] = story.unlock;
  return today >= new Date(y,m,d);
}
function visibleStoryCount(){
  const unlocked = stories.filter(storyIsAvailable).length;
  return Math.min(stories.length, unlocked + (unlocked < stories.length ? 1 : 0));
}
function storyDate(story){
  const [y,m,d]=story.unlock;
  return `${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}/${y}`;
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
<nav class="storyTabs" aria-label="Historias">${stories.map((story,i)=>`<button id="${story.id}" class="storyTab ${i===0?'active':''}" data-story="${story.id}"${i < visibleStoryCount() ? '' : ' style="display:none"'}${storyIsAvailable(story)?'':' data-locked="true"'}>${story.label}</button>`).join('')}</nav>
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



// Historia 3 · O medo. Un mapa simbólico: lugares escuros que van abrindo cara a O Claro.
const fearPeople=[
 {id:'medo',name:'Medo',icon:'🌑',clue:'Está na Casa das Portas Pechadas, na fila A. Dúbida queda máis abaixo e á súa esquerda.'},
 {id:'dubida',name:'Dúbida',icon:'❓',clue:'Perdeuse no Bosque sen Saída, na columna 3.'},
 {id:'tristeza',name:'Tristeza',icon:'🌧️',clue:'Está na Praza da Choiva, na columna 2.'},
 {id:'soidade',name:'Soidade',icon:'🌙',clue:'Agarda na Estación Baleira, na columna 1.'},
 {id:'pasado',name:'Pasado',icon:'🕰️',clue:'Está nunha esquina da súa zona.'},
 {id:'incerteza',name:'Incerteza',icon:'🌫️',clue:'Está na diagonal de Pasado, pero noutra zona.'},
 {id:'calma',name:'Calma',icon:'🍃',clue:'Está ao lado dun trevo.'},
 {id:'carino',name:'Cariño',icon:'🤍',clue:'Non está nin na primeira nin na última columna.'},
 {id:'valentia',name:'Valentía',icon:'✨',clue:'Está na fila anterior á do sentimento que queda por desbloquear.'},
 {id:'fsilvia',name:'Silvia',icon:'👩🏻',clue:'Na súa zona están tamén tres cousas que forman parte dela: Calma, Cariño e Valentía.',locked:true}
];
const FZ=[
 ['estacion','estacion','bosque','bosque','bosque','portas','portas','portas','portas','portas'],
 ['estacion','estacion','bosque','bosque','bosque','portas','portas','portas','portas','portas'],
 ['estacion','choiva','choiva','bosque','bosque','portas','portas','portas','portas','portas'],
 ['estacion','choiva','choiva','choiva','choiva','pasillo','pasillo','portas','portas','portas'],
 ['calella','calella','choiva','calella','choiva','pasillo','pasillo','pasillo','ponte','ponte'],
 ['calella','calella','calella','calella','ponte','pasillo','ponte','ponte','ponte','ponte'],
 ['calella','calella','calella','ponte','ponte','ponte','ponte','ponte','claro','claro'],
 ['calella','calella','ponte','ponte','ponte','claro','claro','claro','claro','claro'],
 ['calella','ponte','ponte','ponte','claro','claro','claro','claro','claro','claro'],
 ['ponte','ponte','ponte','claro','claro','claro','claro','claro','claro','claro']
];
const fearZoneNames={estacion:'ESTACIÓN BALEIRA',bosque:'BOSQUE SEN SAÍDA',portas:'CASA DAS PORTAS PECHADAS',choiva:'PRAZA DA CHOIVA',calella:'CALELLA DO ESQUECEMENTO',pasillo:'PASILLO MISTERIOSO',ponte:'PONTE DO DESCOÑECIDO',claro:'O CLARO'};
const fearLabels={estacion:[0,0],bosque:[0,2],portas:[0,5],choiva:[2,1],calella:[4,0],pasillo:[3,5],ponte:[4,8],claro:[6,8]};
const fearSolution={medo:[0,5],dubida:[1,2],tristeza:[2,1],soidade:[3,0],pasado:[4,3],incerteza:[5,4],calma:[6,9],carino:[7,8],valentia:[8,7],fsilvia:[9,6]};
const fearObjects={'0,1':'🪑','0,4':'🌲','0,9':'🚪','1,0':'💡','1,4':'🌲','1,6':'🪟','2,3':'🌲','2,6':'🚪','3,2':'☔','3,7':'🔒','4,2':'🕯️','4,9':'🌁','5,0':'🍂','5,7':'🌁','6,1':'🍂','6,5':'🌉','7,3':'🌉','7,9':'🍀','8,2':'🌉','8,8':'🌼','9,0':'🌉','9,7':'🦋','9,9':'🌿'};

function renderFearStory(){
 storyContent.classList.remove('storyPlaceholder');
 storyContent.innerHTML=`<header class="hero fearHero"><div><span class="eyebrow">EXPEDIENTE 10×10 · HISTORIA 3</span><h1>SILDOKU</h1><p>O medo</p></div></header><div class="game fearGame"><aside class="leftPanel panel fearPanel"><h2>O QUE HABITA AQUÍ</h2><p class="muted">Non son persoas. Son cousas que ás veces nos acompañan.</p><div id="fcards" class="cards"></div></aside><main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="fboard" class="board fearBoard"></div></div></div><div class="fearLegend">Da néboa á luz · todo forma parte do mesmo mapa.</div></main><aside class="rightPanel panel fearPanel"><section class="general fearGeneral"><h2>PISTA XERAL</h2><p>Hai lugares polos que ás veces toca pasar. Uns pesan, outros doen e outros simplemente asustan porque non sabemos que hai detrás. <b>Coloca cada cousa no seu lugar.</b></p><p class="fearRule">Unha ficha por fila e unha por columna.</p></section><div id="fstatus" class="status">Coloca as nove fichas dispoñibles.</div><div class="actions"><button id="fcheck" class="primary" disabled>🔎 COMPROBAR</button><button id="freset" class="secondary">↻ LIMPAR</button></div></aside></div>`;
 const fb=document.querySelector('#fboard'),fc=document.querySelector('#fcards'),fs=document.querySelector('#fstatus'),fcheck=document.querySelector('#fcheck');
 const fp={}; const fblocked=new Set(Object.keys(fearObjects)); const fat=(r,c)=>fb.children[r*10+c];
 function fedges(r,c){const z=FZ[r][c],a=[];if(r===0||FZ[r-1][c]!==z)a.push('zt');if(r===9||FZ[r+1][c]!==z)a.push('zb');if(c===0||FZ[r][c-1]!==z)a.push('zl');if(c===9||FZ[r][c+1]!==z)a.push('zr');return a.join(' ')}
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const ce=document.createElement('div');ce.className=`cell fear-${FZ[r][c]} ${fedges(r,c)}`;ce.dataset.r=r;ce.dataset.c=c;if(fearObjects[`${r},${c}`]){ce.classList.add('blocked');ce.innerHTML=`<span class="object">${fearObjects[`${r},${c}`]}</span>`}ce.addEventListener('dragover',e=>{if(!fblocked.has(`${r},${c}`))e.preventDefault()});ce.addEventListener('drop',e=>{e.preventDefault();fplace(e.dataTransfer.getData('text/plain'),r,c)});ce.addEventListener('click',()=>{const sel=fc.querySelector('.card.selected');if(sel)fplace(sel.dataset.id,r,c)});fb.appendChild(ce)}
 for(const [z,[r,c]] of Object.entries(fearLabels)){const l=document.createElement('span');l.className='zoneLabel fearZoneLabel';l.textContent=fearZoneNames[z];fat(r,c).appendChild(l)}
 function ftoken(p){const t=document.createElement('div');t.className='token fearToken';t.dataset.id=p.id;t.draggable=true;t.innerHTML=`<span>${p.icon}</span><b>${p.name}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.ondblclick=()=>freturn(p.id);return t}
 fearPeople.forEach(p=>{const d=document.createElement('article');d.className='card fearCard'+(p.locked?' locked':'');d.dataset.id=p.id;d.innerHTML=`<div class="portrait">${p.locked?'🔒':p.icon}</div><div class="cardText"><b>${p.locked?'???':p.name}</b><small>${p.locked?'Coloca primeiro as outras nove fichas.':p.clue}</small></div>`;d.addEventListener('click',()=>{if(d.classList.contains('locked'))return;fc.querySelectorAll('.card').forEach(x=>x.classList.remove('selected'));d.classList.add('selected')});if(!p.locked)d.appendChild(ftoken(p));fc.appendChild(d)});
 function fx(){fb.querySelectorAll('.cell').forEach(x=>x.classList.remove('excluded'));const rs=new Set(),cs=new Set();Object.values(fp).forEach(([r,c])=>{rs.add(r);cs.add(c)});fb.querySelectorAll('.cell').forEach(x=>{const r=+x.dataset.r,c=+x.dataset.c;if((rs.has(r)||cs.has(c))&&!x.querySelector('.token'))x.classList.add('excluded')})}
 function freturn(id){const p=fearPeople.find(x=>x.id===id),card=fc.querySelector(`[data-id="${id}"]`);fb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());if(!card.classList.contains('locked'))card.appendChild(ftoken(p));delete fp[id];fx();fstate()}
 function fplace(id,r,c){const p=fearPeople.find(x=>x.id===id),card=fc.querySelector(`[data-id="${id}"]`);if(!p||!card||card.classList.contains('locked')||fblocked.has(`${r},${c}`))return;for(const [o,[rr,cc]] of Object.entries(fp))if(o!==id&&(rr===r||cc===c))return;const target=fat(r,c);if(target.querySelector('.token')&&target.querySelector('.token').dataset.id!==id)return;fb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());target.appendChild(ftoken(p));fp[id]=[r,c];card.classList.remove('selected');fx();fstate()}
 function fstate(){const first=fearPeople.filter(p=>p.id!=='fsilvia').filter(p=>fp[p.id]).length,sc=fc.querySelector('[data-id="fsilvia"]');if(first===9&&sc.classList.contains('locked')){sc.classList.remove('locked');sc.querySelector('.portrait').textContent='👩🏻';sc.querySelector('.cardText b').textContent='Silvia';sc.querySelector('.cardText small').textContent='Na súa zona están tamén tres cousas que forman parte dela: Calma, Cariño e Valentía.';sc.appendChild(ftoken(fearPeople.find(p=>p.id==='fsilvia')))}const unlocked=!sc.classList.contains('locked'),total=Object.keys(fp).length;fcheck.disabled=!(unlocked&&total===10);if(!unlocked)fs.textContent=`${first}/9 fichas colocadas. A última aparecerá cando atopes sitio para as demais.`;else if(!fp.fsilvia)fs.innerHTML='🌤️ <b>Silvia está desbloqueada.</b> Agora tamén hai un lugar para ela.';else fs.textContent='As 10 fichas están colocadas. Xa podes comprobar.'}
 fcheck.onclick=()=>{let good=0;fb.querySelectorAll('.token').forEach(t=>{t.classList.remove('good','bad');const a=fp[t.dataset.id],b=fearSolution[t.dataset.id],ok=b&&a[0]===b[0]&&a[1]===b[1];t.classList.add(ok?'good':'bad');if(ok)good++});fs.innerHTML=good===10?'🦋 <b>CASO RESOLTO.</b> Hai cousas que sentimos. Ningunha delas nos define.':`${good}/10 posicións correctas. Verde = ben; vermello = revisa.`};
 document.querySelector('#freset').onclick=()=>renderFearStory();fstate();
}



// Historia 4 · As decisións. Dez Silvias, sete lugares e unha última versión por descubrir.
const decisionPeople=[
 {id:'timida',name:'Silvia Tímida',icon:'🌸',clue:'Está cos Amigos, na primeira fila. Non ocupa unha esquina do taboleiro.'},
 {id:'divertida',name:'Silvia Divertida',icon:'😄',clue:'Comparte zona con Silvia Tímida e está máis abaixo e á súa dereita.'},
 {id:'bailadora',name:'Silvia Bailadora',icon:'💃',clue:'Está no medio e medio do Tablao.'},
 {id:'independente',name:'Silvia Independente',icon:'🔑',clue:'Está no Piso e ocupa a primeira columna.'},
 {id:'pensativa',name:'Silvia Pensativa',icon:'💭',clue:'Comparte o Piso con Silvia Independente, pero non comparte nin fila nin columna con ela.'},
 {id:'carinosa4',name:'Silvia Cariñosa',icon:'🤍',clue:'Está na segunda fila de onde máis cariño dou.'},
 {id:'sentimental',name:'Silvia Sentimental',icon:'🦋',clue:'Está ao lado dunha bolboreta.'},
 {id:'forte',name:'Silvia Forte',icon:'🛡️',clue:'Está coa Familia e é a que queda máis á dereita de todas as Silvias dispoñibles.'},
 {id:'chora',name:'Silvia que Chora',icon:'🌧️',clue:'Está na Habitación da Choiva. Chorar tamén é unha forma de soltar o que pesa.'},
 {id:'futuro',name:'Silvia do Futuro',icon:'👑',clue:'O seu lugar é O Trono. É a Silvia que conquistou os seus medos sen deixar de ser ningunha das anteriores.',locked:true}
];
const DZ=[
 ['amigos','amigos','amigos','amigos','amigos','tablao','tablao','tablao','tablao','tablao'],
 ['amigos','amigos','amigos','amigos','amigos','tablao','tablao','tablao','tablao','tablao'],
 ['amigos','amigos','amigos','piso','piso','tablao','tablao','tablao','tablao','tablao'],
 ['piso','piso','piso','piso','piso','piso','tablao','tablao','tablao','tablao'],
 ['piso','piso','piso','piso','piso','piso','avoa','avoa','familia','familia'],
 ['avoa','avoa','avoa','avoa','avoa','avoa','avoa','avoa','familia','familia'],
 ['avoa','avoa','avoa','avoa','avoa','avoa','avoa','avoa','familia','familia'],
 ['choiva','choiva','choiva','choiva','choiva','familia','familia','familia','familia','familia'],
 ['choiva','choiva','choiva','choiva','choiva','choiva','choiva','choiva','choiva','choiva'],
 ['choiva','choiva','choiva','choiva','choiva','choiva','trono','trono','trono','trono']
];
const decisionZoneNames={amigos:'OS AMIGOS',tablao:'O TABLAO',piso:'O PISO',avoa:'CASA DA AVOA',familia:'A FAMILIA',choiva:'HABITACIÓN DA CHOIVA',trono:'O TRONO'};
const decisionLabels={amigos:[0,0],tablao:[0,5],piso:[2,3],avoa:[5,0],familia:[4,8],choiva:[8,0],trono:[9,6]};
const decisionSolution={timida:[0,1],divertida:[1,2],bailadora:[2,7],independente:[3,0],pensativa:[4,4],carinosa4:[5,3],sentimental:[6,5],forte:[7,9],chora:[8,8],futuro:[9,6]};
const decisionObjects={'0,3':'🫂','0,8':'🎵','1,5':'🎸','1,9':'🎤','2,6':'🪭','2,9':'🎶','3,2':'🛋️','3,5':'🔑','4,1':'📦','4,7':'🏡','5,4':'🪑','5,6':'🦋','6,1':'🕯️','6,6':'🦋','7,5':'❤️','7,7':'🏠','8,2':'🪟','8,6':'💧','9,7':'🏛️','9,9':'👑'};

function renderDecisionStory(){
 storyContent.classList.remove('storyPlaceholder');
 storyContent.innerHTML=`<header class="hero decisionHero"><div><span class="eyebrow">EXPEDIENTE 10×10 · HISTORIA 4</span><h1>SILDOKU</h1><p>Silvias</p></div></header><div class="game decisionGame"><aside class="leftPanel panel decisionPanel"><h2>CANTAS SILVIAS HAI?</h2><p class="muted">A mesma persoa, moitas maneiras de estar no mundo.</p><div id="dcards" class="cards"></div></aside><main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="dboard" class="board decisionBoard"></div></div></div><div class="decisionLegend">Todas foron, son ou poden ser parte da mesma Silvia.</div></main><aside class="rightPanel panel decisionPanel"><section class="general decisionGeneral"><h2>PISTA XERAL</h2><p><b>Cantas Silvias pode haber dentro dunha mesma Silvia?</b> Algunhas rin, outras bailan, outras pensan e outras choran. Todas forman parte da mesma historia. Coloca cada Silvia no seu lugar.</p><p class="decisionRule">Unha Silvia por fila e unha por columna.</p></section><div id="dstatus" class="status">Coloca as nove Silvias dispoñibles.</div><div class="actions"><button id="dcheck" class="primary" disabled>🔎 COMPROBAR</button><button id="dreset" class="secondary">↻ LIMPAR</button></div></aside></div>`;
 const db=document.querySelector('#dboard'),dc=document.querySelector('#dcards'),ds=document.querySelector('#dstatus'),dcheck=document.querySelector('#dcheck'); const dp={}; const dat=(r,c)=>db.children[r*10+c];
 function dedges(r,c){const z=DZ[r][c],a=[];if(r===0||DZ[r-1][c]!==z)a.push('zt');if(r===9||DZ[r+1][c]!==z)a.push('zb');if(c===0||DZ[r][c-1]!==z)a.push('zl');if(c===9||DZ[r][c+1]!==z)a.push('zr');return a.join(' ')}
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const ce=document.createElement('div');ce.className=`cell decision-${DZ[r][c]} ${dedges(r,c)}`;ce.dataset.r=r;ce.dataset.c=c;if(decisionObjects[`${r},${c}`])ce.innerHTML=`<span class="object decisionObject">${decisionObjects[`${r},${c}`]}</span>`;ce.addEventListener('dragover',e=>e.preventDefault());ce.addEventListener('drop',e=>{e.preventDefault();dplace(e.dataTransfer.getData('text/plain'),r,c)});ce.addEventListener('click',()=>{const sel=dc.querySelector('.card.selected');if(sel)dplace(sel.dataset.id,r,c)});db.appendChild(ce)}
 for(const [z,[r,c]] of Object.entries(decisionLabels)){const l=document.createElement('span');l.className='zoneLabel decisionZoneLabel';l.textContent=decisionZoneNames[z];dat(r,c).appendChild(l)}
 function dtoken(p){const t=document.createElement('div');t.className='token decisionToken';t.dataset.id=p.id;t.draggable=true;t.innerHTML=`<span>${p.icon}</span><b>${p.name.replace('Silvia ','')}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.ondblclick=()=>dreturn(p.id);return t}
 decisionPeople.forEach(p=>{const d=document.createElement('article');d.className='card decisionCard'+(p.locked?' locked':'');d.dataset.id=p.id;d.innerHTML=`<div class="portrait">${p.locked?'🔒':p.icon}</div><div class="cardText"><b>${p.locked?'???':p.name}</b><small>${p.locked?'Coloca primeiro as outras nove Silvias.':p.clue}</small></div>`;d.addEventListener('click',()=>{if(d.classList.contains('locked'))return;dc.querySelectorAll('.card').forEach(x=>x.classList.remove('selected'));d.classList.add('selected')});if(!p.locked)d.appendChild(dtoken(p));dc.appendChild(d)});
 function dx(){db.querySelectorAll('.cell').forEach(x=>x.classList.remove('excluded'));const rs=new Set(),cs=new Set();Object.values(dp).forEach(([r,c])=>{rs.add(r);cs.add(c)});db.querySelectorAll('.cell').forEach(x=>{const r=+x.dataset.r,c=+x.dataset.c;if((rs.has(r)||cs.has(c))&&!x.querySelector('.token'))x.classList.add('excluded')})}
 function dreturn(id){const p=decisionPeople.find(x=>x.id===id),card=dc.querySelector(`[data-id="${id}"]`);db.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());if(!card.classList.contains('locked'))card.appendChild(dtoken(p));delete dp[id];dx();dstate()}
 function dplace(id,r,c){const p=decisionPeople.find(x=>x.id===id),card=dc.querySelector(`[data-id="${id}"]`);if(!p||!card||card.classList.contains('locked'))return;for(const [o,[rr,cc]] of Object.entries(dp))if(o!==id&&(rr===r||cc===c))return;const target=dat(r,c);if(target.querySelector('.token')&&target.querySelector('.token').dataset.id!==id)return;db.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());target.appendChild(dtoken(p));dp[id]=[r,c];card.classList.remove('selected');dx();dstate()}
 function dstate(){const first=decisionPeople.filter(p=>p.id!=='futuro').filter(p=>dp[p.id]).length,fc=dc.querySelector('[data-id="futuro"]');if(first===9&&fc.classList.contains('locked')){fc.classList.remove('locked');fc.querySelector('.portrait').textContent='👑';fc.querySelector('.cardText b').textContent='Silvia do Futuro';fc.querySelector('.cardText small').textContent=decisionPeople.find(p=>p.id==='futuro').clue;fc.appendChild(dtoken(decisionPeople.find(p=>p.id==='futuro')));ds.innerHTML='👑 <b>Silvia do Futuro está desbloqueada.</b> O Trono agarda.'}const unlocked=!fc.classList.contains('locked'),total=Object.keys(dp).length;dcheck.disabled=!(unlocked&&total===10);if(!unlocked)ds.textContent=`${first}/9 Silvias colocadas. A última aínda non chegou.`;else if(!dp.futuro)ds.innerHTML='👑 <b>Silvia do Futuro está desbloqueada.</b> O Trono agarda.';else ds.textContent='As 10 Silvias están colocadas. Xa podes comprobar.'}
 dcheck.onclick=()=>{let good=0;db.querySelectorAll('.token').forEach(t=>{t.classList.remove('good','bad');const a=dp[t.dataset.id],b=decisionSolution[t.dataset.id],ok=b&&a[0]===b[0]&&a[1]===b[1];t.classList.add(ok?'good':'bad');if(ok)good++});if(good===10){ds.innerHTML='👑 <b>CASO RESOLTO.</b> Todas elas fixeron falta para chegar ata aquí.';db.classList.add('throneSolved')}else ds.textContent=`${good}/10 posicións correctas. Verde = ben; vermello = revisa.`};
 document.querySelector('#dreset').onclick=()=>renderDecisionStory();dstate();
}



// Historia 5 · O que queda. Os nomes escólleos quen xoga; o puzzle mantén dez roles fixos.
const remainsRoles=[
 {id:'q1',role:'Persoa 1',icon:'🧑🏻',clue:'Está na primeira fila, onde todo nace.'},
 {id:'q2',role:'Persoa 2',icon:'👩🏼',clue:'Está ao norte dunha bolboreta.'},
 {id:'q3',role:'Persoa 3',icon:'👨🏽',clue:'Está na terceira fila, nunha esquina da súa zona.'},
 {id:'q4',role:'Persoa 4',icon:'🧑🏾',clue:'Queda 2 filas máis o sur ca Persoa 2.'},
 {id:'q5',role:'Persoa 5',icon:'👩🏻',clue:'5 - 5.'},
 {id:'q6',role:'Persoa 6',icon:'👨🏼',clue:'Está na primeira columna.'},
 {id:'q7',role:'Persoa 7',icon:'🧑🏽',clue:'Está ao lado dunha cámara.'},
 {id:'q8',role:'Persoa 8',icon:'👩🏾',clue:'Na súa fila hai un libro e na súa columna, un corazón.'},
 {id:'q9',role:'Persoa 9',icon:'👨🏻',clue:'Está no medio dos recordos.'},
 {id:'q10',role:'Persoa 10',icon:'🧑🏼',clue:'Está na última fila, na columna dun corazón.'}
];
const QZ=[
 ['raices','raices','raices','raices','raices','pegada','pegada','pegada','pegada','pegada'],
 ['raices','raices','raices','raices','raices','pegada','pegada','pegada','pegada','pegada'],
 ['sorrisos','sorrisos','sorrisos','sorrisos','raices','pegada','pegada','pegada','pegada','pegada'],
 ['sorrisos','sorrisos','sorrisos','sorrisos','corazon','corazon','caminho','caminho','caminho','caminho'],
 ['sorrisos','sorrisos','sorrisos','corazon','corazon','corazon','caminho','caminho','caminho','caminho'],
 ['refuxio','refuxio','refuxio','corazon','corazon','corazon','caminho','caminho','caminho','caminho'],
 ['refuxio','refuxio','refuxio','refuxio','corazon','caminho','caminho','recordos','recordos','recordos'],
 ['refuxio','refuxio','refuxio','refuxio','refuxio','recordos','recordos','recordos','recordos','recordos'],
 ['refuxio','refuxio','refuxio','refuxio','refuxio','recordos','recordos','recordos','recordos','recordos'],
 ['refuxio','refuxio','refuxio','refuxio','refuxio','recordos','recordos','recordos','recordos','recordos']
];
const remainsZoneNames={raices:'AS RAÍCES',pegada:'A PEGADA',sorrisos:'OS SORRISOS',caminho:'O CAMIÑO',corazon:'O CORAZÓN',refuxio:'O REFUXIO',recordos:'OS RECORDOS'};
const remainsLabels={raices:[0,0],pegada:[0,5],sorrisos:[2,0],caminho:[3,6],corazon:[3,4],refuxio:[5,0],recordos:[6,7]};
const remainsSolution={q1:[0,1],q2:[1,6],q3:[2,3],q4:[3,8],q5:[4,4],q6:[5,0],q7:[6,9],q8:[7,2],q9:[8,7],q10:[9,5]};
const remainsObjects={'0,3':'🌿','0,8':'🦋','1,0':'🌳','1,9':'🍃','2,1':'😊','2,6':'🦋','3,2':'☀️','3,7':'👣','4,0':'🎈','4,5':'❤️','5,2':'🫶','5,7':'🛤️','6,3':'🏡','6,8':'📷','7,0':'🪴','7,6':'📖','8,4':'🕯️','8,9':'⭐','9,1':'🪵','9,8':'🌌'};
const remainsDescriptions=[
 ['🌳','As Raíces','Persoas que forman parte de onde vés e da túa historia.'],
 ['🦋','A Pegada','Persoas que deixaron algo en ti, grande ou pequeno.'],
 ['🛤️','O Camiño','Persoas que percorreron ou percorren contigo unha parte da vida.'],
 ['😊','Os Sorrisos','Persoas coas que quedan risas, parvadas e momentos bos.'],
 ['🤍','O Refuxio','Persoas que algunha vez foron apoio, calma ou un lugar seguro.'],
 ['📖','Os Recordos','Persoas ligadas a momentos que seguen aparecendo cando miras atrás.'],
 ['❤️','O Corazón','Hai persoas que poderían estar en todas as anteriores. No centro sempre ten que haber alguén.']
];

function renderRemainsStory(){
 storyContent.classList.remove('storyPlaceholder','lockedStoryPreview');
 storyContent.innerHTML=`<header class="hero remainsHero"><div><span class="eyebrow">EXPEDIENTE 10×10 · HISTORIA 5</span><h1>SILDOKU</h1><p>O que queda</p></div></header>
 <section class="remainsIntro panel"><h2>O que queda</h2><p class="remainsIntroLead">Un recordo do que queda.</p><p>Hai persoas que botan raíces, outras deixan pegada, algunhas comparten camiño, deixan sorrisos, convértense en refuxio ou quedan nos recordos. E ás veces hai alguén que podería estar en todas partes.</p><p><b>Esta vez os nomes pólos ti.</b> Nun taboleiro só caben dez, pero na vida cabe moita máis xente. Podes repetir persoas e volver xogar cantas veces queiras.</p><div class="roomGuide">${remainsDescriptions.map(([i,n,d])=>`<article><span>${i}</span><div><b>${n}</b><small>${d}</small></div></article>`).join('')}</div></section>
 <div class="game remainsGame"><aside class="leftPanel panel remainsPanel"><h2>OS 10 NOMES</h2><p class="muted">Le as pistas primeiro e escribe un nome en cada ficha. Podes repetir nomes.</p><div id="qcards" class="cards remainsCards"></div><button id="qstart" class="primary remainsStart" disabled>COMEZAR A PARTIDA</button></aside>
 <main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="qboard" class="board remainsBoard boardDisabled"></div></div></div><div class="remainsLegend">As habitacións falan do que queda; os nomes escóllelos ti.</div></main>
 <aside class="rightPanel panel remainsPanel"><section class="general remainsGeneral"><h2>PISTA XERAL</h2><p>Hai <b>unha persoa por fila e unha por columna</b>. Todas as zonas teñen <b>1 persoa</b>, agás <b>O Refuxio, que ten 2</b>, e <b>Os Recordos, que teñen 3</b>. <b>O Corazón sempre ten que quedar ocupado.</b></p><p>Non poderás colocar fichas ata escribir os dez nomes. Ao comezar, os nomes quedan bloqueados.</p></section><div id="qstatus" class="status">Escribe os 10 nomes para poder comezar.</div><div class="actions"><button id="qcheck" class="primary" disabled>🔎 COMPROBAR</button><button id="qreset" class="secondary">↻ LIMPAR</button></div></aside></div>`;
 const qb=document.querySelector('#qboard'),qc=document.querySelector('#qcards'),qs=document.querySelector('#qstatus'),qcheck=document.querySelector('#qcheck'),qstart=document.querySelector('#qstart');
 let started=false; const qp={}; const names={}; const qat=(r,c)=>qb.children[r*10+c];
 function qedges(r,c){const z=QZ[r][c],a=[];if(r===0||QZ[r-1][c]!==z)a.push('zt');if(r===9||QZ[r+1][c]!==z)a.push('zb');if(c===0||QZ[r][c-1]!==z)a.push('zl');if(c===9||QZ[r][c+1]!==z)a.push('zr');return a.join(' ')}
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const ce=document.createElement('div');ce.className=`cell remains-${QZ[r][c]} ${qedges(r,c)}`;ce.dataset.r=r;ce.dataset.c=c;if(remainsObjects[`${r},${c}`])ce.innerHTML=`<span class="object remainsObject">${remainsObjects[`${r},${c}`]}</span>`;ce.addEventListener('dragover',e=>{if(started)e.preventDefault()});ce.addEventListener('drop',e=>{e.preventDefault();if(started)qplace(e.dataTransfer.getData('text/plain'),r,c)});ce.addEventListener('click',()=>{if(!started)return;const sel=qc.querySelector('.card.selected');if(sel)qplace(sel.dataset.id,r,c)});qb.appendChild(ce)}
 for(const [z,[r,c]] of Object.entries(remainsLabels)){const l=document.createElement('span');l.className='zoneLabel remainsZoneLabel';l.textContent=remainsZoneNames[z];qat(r,c).appendChild(l)}
 function qtoken(p){const t=document.createElement('div');t.className='token remainsToken';t.dataset.id=p.id;t.draggable=true;t.innerHTML=`<span>${p.icon}</span><b>${names[p.id]}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.ondblclick=()=>qreturn(p.id);return t}
 remainsRoles.forEach((p,i)=>{const d=document.createElement('article');d.className='card remainsNameCard';d.dataset.id=p.id;d.innerHTML=`<div class="portrait">${p.icon}</div><div class="cardText"><b>${p.role}</b><small>${p.clue}</small><input class="nameInput" maxlength="28" autocomplete="off" placeholder="Escribe un nome…" aria-label="Nome para ${p.role}"></div>`;const inp=d.querySelector('input');inp.addEventListener('input',()=>{names[p.id]=inp.value.trim();qstart.disabled=!remainsRoles.every(x=>names[x.id]);qs.textContent=qstart.disabled?'Escribe os 10 nomes para poder comezar.':'Xa están os 10 nomes. Cando queiras, comeza a partida.'});d.addEventListener('click',e=>{if(!started||e.target.tagName==='INPUT')return;qc.querySelectorAll('.card').forEach(x=>x.classList.remove('selected'));d.classList.add('selected')});qc.appendChild(d)});
 qstart.onclick=()=>{if(!remainsRoles.every(x=>names[x.id]))return;started=true;qb.classList.remove('boardDisabled');qstart.disabled=true;qstart.textContent='NOMES BLOQUEADOS';remainsRoles.forEach(p=>{const card=qc.querySelector(`[data-id="${p.id}"]`);card.querySelector('.cardText b').textContent=names[p.id];card.querySelector('input')?.remove();card.appendChild(qtoken(p));});qs.textContent='0/10 persoas colocadas. Agora xa podes resolver o Sildoku.'};
 function qx(){qb.querySelectorAll('.cell').forEach(x=>x.classList.remove('excluded'));const rs=new Set(),cs=new Set();Object.values(qp).forEach(([r,c])=>{rs.add(r);cs.add(c)});qb.querySelectorAll('.cell').forEach(x=>{const r=+x.dataset.r,c=+x.dataset.c;if((rs.has(r)||cs.has(c))&&!x.querySelector('.token'))x.classList.add('excluded')})}
 function qreturn(id){if(!started)return;const p=remainsRoles.find(x=>x.id===id),card=qc.querySelector(`[data-id="${id}"]`);qb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());card.appendChild(qtoken(p));delete qp[id];qx();qstate()}
 function qplace(id,r,c){if(!started)return;const p=remainsRoles.find(x=>x.id===id);if(!p)return;for(const [o,[rr,cc]] of Object.entries(qp))if(o!==id&&(rr===r||cc===c))return;const target=qat(r,c);if(target.querySelector('.token')&&target.querySelector('.token').dataset.id!==id)return;qb.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());target.appendChild(qtoken(p));qp[id]=[r,c];qc.querySelector(`[data-id="${id}"]`).classList.remove('selected');qx();qstate()}
 function qstate(){const n=Object.keys(qp).length;qcheck.disabled=n!==10;qs.textContent=n===10?'As 10 persoas están colocadas. Xa podes comprobar.':`${n}/10 persoas colocadas.`}
 qcheck.onclick=()=>{let good=0;qb.querySelectorAll('.token').forEach(t=>{t.classList.remove('good','bad');const a=qp[t.dataset.id],b=remainsSolution[t.dataset.id],ok=b&&a[0]===b[0]&&a[1]===b[1];t.classList.add(ok?'good':'bad');if(ok)good++});qs.innerHTML=good===10?'❤️ <b>CASO RESOLTO.</b> Hai xente que queda de maneiras distintas.':`${good}/10 posicións correctas. Verde = ben; vermello = revisa.`};
 document.querySelector('#qreset').onclick=()=>{
  if(!started){ renderRemainsStory(); return; }

  const borrarNomes=window.confirm('Que queres limpar?\n\nAceptar → borrar os nomes e o taboleiro.\nCancelar → conservar os nomes e escoller se queres limpar só o taboleiro.');
  if(borrarNomes){ renderRemainsStory(); return; }

  const soTaboleiro=window.confirm('Queres limpar só o taboleiro e conservar os 10 nomes?');
  if(!soTaboleiro)return;

  // Conservamos os nomes e a partida iniciada, pero devolvemos todas as fichas ás súas tarxetas.
  remainsRoles.forEach(p=>{
    qb.querySelectorAll(`.token[data-id=\"${p.id}\"]`).forEach(t=>t.remove());
    const card=qc.querySelector(`[data-id=\"${p.id}\"]`);
    card.classList.remove('selected');
    card.appendChild(qtoken(p));
  });
  Object.keys(qp).forEach(id=>delete qp[id]);
  qb.querySelectorAll('.token').forEach(t=>t.classList.remove('good','bad'));
  qx();
  qstate();
  qs.textContent='Taboleiro limpo. Os 10 nomes mantéñense.';
};
}


// Historia 6 · Por descubrir
const discoverPeople=[
 {id:'dsilvia',name:'Silvia',icon:'👩🏻',clue:'Está na última fila.'},
 {id:'comezo',name:'Un novo comezo',icon:'🌱',clue:'Está na última columna.'},
 {id:'boa_noticia',name:'Unha boa noticia',icon:'⭐',clue:'Está na esquina da súa zona.'},
 {id:'sorpresa',name:'Unha sorpresa',icon:'🎁',clue:'Está esperando o tren xusto ao seu carón.'},
 {id:'casualidade',name:'Unha casualidade',icon:'🍀',clue:'Está na esquina do Comedor.'},
 {id:'reencontro',name:'Un reencontro',icon:'🤗',clue:'Está ao lado dun fieito.'},
 {id:'risa',name:'Unha risa',icon:'😄',clue:'Non está na última fila.'},
 {id:'logro',name:'Un logro',icon:'🏆',clue:'Está mollado.'},
 {id:'dia',name:'Un día inesquecible',icon:'✨',clue:'Está na area, na fila máis ao sur.'},
 {id:'inesperado',name:'Algo inesperado',icon:'💫',clue:'Está ao lado dunha maleta e tamén dun avión.'}
];
const discoverSolution={inesperado:[0,0],reencontro:[1,2],casualidade:[2,4],dia:[3,7],comezo:[4,9],logro:[5,1],boa_noticia:[6,6],sorpresa:[7,5],risa:[8,8],dsilvia:[9,3]};
const discoverZones=[
 ['aeroporto','aeroporto','natureza','natureza','natureza','comedor','praia','praia','praia','traballo'],
 ['aeroporto','aeroporto','natureza','natureza','natureza','comedor','praia','praia','praia','traballo'],
 ['aeroporto','aeroporto','natureza','natureza','comedor','comedor','comedor','praia','praia','traballo'],
 ['aeroporto','aeroporto','natureza','natureza','comedor','comedor','comedor','praia','praia','traballo'],
 ['aeroporto','aeroporto','comedor','comedor','comedor','comedor','comedor','hotel','hotel','traballo'],
 ['piscina','piscina','comedor','comedor','comedor','comedor','hotel','hotel','hotel','hotel'],
 ['piscina','piscina','construir','construir','construir','construir','hotel','hotel','hotel','hotel'],
 ['piscina','piscina','piscina','construir','construir','estacion','estacion','hotel','hotel','cine'],
 ['piscina','piscina','piscina','construir','estacion','estacion','estacion','estacion','cine','cine'],
 ['piscina','piscina','piscina','construir','estacion','estacion','estacion','estacion','cine','cine']
];
const discoverZoneNames={aeroporto:'AEROPORTO',natureza:'NATUREZA',comedor:'COMEDOR',praia:'PRAIA',traballo:'TRABALLO',piscina:'PISCINA',construir:'POR CONSTRUÍR',estacion:'ESTACIÓN',hotel:'HOTEL',cine:'CINE'};
const discoverLabels={aeroporto:[0,0],natureza:[0,2],comedor:[2,4],praia:[0,6],traballo:[0,9],piscina:[5,0],construir:[6,2],estacion:[8,4],hotel:[4,7],cine:[7,9]};
const discoverObjects={'0,1':'🧳','1,0':'✈️','2,1':'🧳','0,3':'🌳','2,2':'🌿','3,3':'🌼','2,5':'🍽️','3,6':'🪑','4,4':'👥','0,7':'☀️','1,8':'🏖️','2,8':'🌊','0,9':'💻','2,9':'📎','3,9':'🗂️','6,0':'🏊','7,1':'💦','9,0':'🛟','6,3':'🏗️','7,4':'🧱','9,2':'🪜','8,5':'🚆','9,6':'🕐','9,5':'🧳','4,8':'🛎️','5,7':'🛏️','6,8':'🗝️','7,9':'🎬','8,9':'🍿','9,9':'🎟️'};
function renderDiscoverStory(){
 storyContent.classList.remove('storyPlaceholder','lockedStoryPreview');storyContent.innerHTML=`<header class="hero discoverHero"><div><span class="eyebrow">EXPEDIENTE 10×10 · HISTORIA 6</span><h1>SILDOKU</h1><p>Por descubrir</p></div></header><div class="game"><aside class="leftPanel panel discoverPanel"><h2>POR DESCUBRIR</h2><p class="muted">Cousas boas que poden aparecer polo camiño. As pistas indican onde colocar cada ficha.</p><div id="discoverCards" class="cards"></div></aside><main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="discoverBoard" class="board discoverBoard"></div></div></div></main><aside class="rightPanel panel discoverPanel"><section class="general discoverGeneral"><h2>PISTA XERAL</h2><p>Hai exactamente <b>unha ficha en cada fila, unha en cada columna e unha en cada habitación</b>.</p><p>Os elementos do escenario ocupan a súa casilla e non se poden tapar.</p></section><div id="discoverStatus" class="status">Coloca as 10 fichas no taboleiro.</div><div class="actions"><button id="discoverCheck" class="primary" disabled>🔎 COMPROBAR</button><button id="discoverReset" class="secondary">↻ LIMPAR</button></div></aside></div>`;
 const b=document.querySelector('#discoverBoard'),cards=document.querySelector('#discoverCards'),status=document.querySelector('#discoverStatus'),check=document.querySelector('#discoverCheck');let placements={};
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const z=discoverZones[r][c],cell=document.createElement('div');cell.className=`cell discover-${z}`;if(r===0||discoverZones[r-1][c]!==z)cell.classList.add('zt');if(r===9||discoverZones[r+1][c]!==z)cell.classList.add('zb');if(c===0||discoverZones[r][c-1]!==z)cell.classList.add('zl');if(c===9||discoverZones[r][c+1]!==z)cell.classList.add('zr');cell.dataset.r=r;cell.dataset.c=c;cell.dataset.zone=z;if(discoverLabels[z]?.[0]===r&&discoverLabels[z]?.[1]===c)cell.innerHTML+=`<span class="zoneLabel discoverZoneLabel">${discoverZoneNames[z]}</span>`;if(discoverObjects[`${r},${c}`])cell.innerHTML+=`<span class="object discoverObject">${discoverObjects[`${r},${c}`]}</span>`;b.appendChild(cell)}
 const token=p=>{const t=document.createElement('div');t.className='token discoverToken';t.draggable=true;t.dataset.id=p.id;t.innerHTML=`<span>${p.icon}</span><b>${p.name}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.onclick=(e)=>{e.stopPropagation();if(t.closest('#discoverBoard')){if(placements[p.id]){delete placements[p.id];render();}}else{const card=t.closest('.personCard');if(card)cards.querySelectorAll('.personCard').forEach(x=>x.classList.toggle('selected',x===card&&!card.classList.contains('selected')));}};return t};
 discoverPeople.forEach(p=>{const card=document.createElement('div');card.className='card personCard';card.dataset.id=p.id;card.innerHTML=`<div class="portrait">${p.icon}</div><div class="cardText"><b>${p.name}</b><small>${p.clue}</small></div>`;card.appendChild(token(p));cards.appendChild(card)});
 function render(){b.querySelectorAll('.discoverToken').forEach(x=>x.remove());b.querySelectorAll('.cell').forEach(x=>x.classList.remove('excluded'));for(const [id,[r,c]] of Object.entries(placements)){const p=discoverPeople.find(x=>x.id===id),cell=b.querySelector(`[data-r="${r}"][data-c="${c}"]`);cell?.appendChild(token(p))}for(const [id,[r,c]]of Object.entries(placements))b.querySelectorAll('.cell').forEach(cell=>{if(!cell.querySelector('.discoverToken')&&(Number(cell.dataset.r)===r||Number(cell.dataset.c)===c))cell.classList.add('excluded')});state()}
 function state(){const n=Object.keys(placements).length;check.disabled=n!==10;status.textContent=n<10?`${n}/10 fichas colocadas.`:'As 10 fichas están colocadas. Xa podes comprobar.'}
 function canPlace(id,r,c){if(discoverObjects[`${r},${c}`])return false;for(const [oid,[rr,cc]]of Object.entries(placements))if(oid!==id&&(rr===r||cc===c))return false;return true}
 b.querySelectorAll('.cell').forEach(cell=>{cell.addEventListener('dragover',e=>e.preventDefault());cell.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(!id)return;const r=+cell.dataset.r,c=+cell.dataset.c;if(canPlace(id,r,c)){placements[id]=[r,c];render()}});cell.addEventListener('click',()=>{const selected=cards.querySelector('.personCard.selected');if(!selected)return;const id=selected.dataset.id,r=+cell.dataset.r,c=+cell.dataset.c;if(canPlace(id,r,c)){placements[id]=[r,c];cards.querySelectorAll('.personCard').forEach(x=>x.classList.remove('selected'));render()}})});
 cards.querySelectorAll('.personCard').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('.token'))return;cards.querySelectorAll('.personCard').forEach(x=>x.classList.toggle('selected',x===card&&!card.classList.contains('selected')))}));
 check.onclick=()=>{if(phase===1){let good=0;clearRoomFeedback();for(const room of happyRooms){const ok=roomAssign[room.zone]===room.name;if(ok)good++;const btn=choices.querySelector(`[data-room="${CSS.escape(room.name)}"]`);if(btn)btn.classList.add(ok?'correct':'wrong')}if(good===7){setTimeout(()=>{phase=2;selected=null;status.innerHTML='✓ <b>As 7 habitacións están ben.</b> Agora descubre a quen pertence cada descrición.';renderPhase2()},650)}else status.textContent=`${good}/7 habitacións correctas. Revisa os recadros marcados.`;return}if(phase===2){let good=0;clearClueFeedback();for(const p of happyPeople){const ok=clueAssign[p.id]===p.id;if(ok)good++;const clue=choices.querySelector(`[data-clue="${p.id}"]`);if(clue)clue.classList.add(ok?'correct':'wrong')}if(good===10){setTimeout(()=>{phase=3;selected=null;choices.innerHTML=`<div class="happyFinal"><small>UNHA ÚLTIMA PREGUNTA</small><h2>Onde está a felicidade?</h2><p>Escolle calquera cela do taboleiro.</p></div>`;document.querySelector('#happyLeftTitle').textContent='A FELICIDADE';document.querySelector('#happyHelp').textContent='Todo está xa no seu lugar.';status.innerHTML='As habitacións e as persoas están identificadas. Só queda unha pregunta.';check.disabled=true;board.querySelectorAll('.happyToken').forEach(t=>{t.classList.remove('selectedPerson');t.querySelector('.happyAssigned')?.remove()})},650)}else status.textContent=`${good}/10 descricións correctas. Revisa os recadros marcados.`}};
 document.querySelector('#discoverReset').onclick=()=>renderDiscoverStory();state();
}


// Historia 7 · A felicidade · Sildoku inverso
const happyPeople=[
 {id:'carmen',name:'Avoa',icon:'👵🏻',zone:'z1',clue:'Hai lugares e persoas aos que o tempo non consegue facer pequenos. Aínda que xa non poidas volver a certos momentos, hai quen segue estando moi presente.'},
 {id:'elva',name:'Elva',icon:'👧🏻',zone:'z2',clue:'Probablemente non sexa a máis grande deste taboleiro. O sitio que ocupa, en cambio...'},
 {id:'mariav',name:'María',icon:'👩🏻',zone:'z3',clue:'Cando as cousas se poñen difíciles, hai persoas que saben quedar, escoitar e estar sen facer demasiado ruído.'},
 {id:'balu',name:'Balú',icon:'🐶',zone:'z4',clue:'Chegou nun momento no que facía falta algo bo. É amigo de todo o mundo... e se te descoidas, lámbeche a cara 😂.'},
 {id:'brais',name:'Brais',icon:'👨🏻',zone:'z5',clue:'Virgo. ♍'},
 {id:'mama',name:'Mamá',icon:'👩🏻',zone:'z5',clue:'Hai relacións nas que ás veces non fai falta explicar demasiado para entenderse.'},
 {id:'rocio',name:'Rocío',icon:'👩🏻‍🦱',zone:'z6',clue:'Houbo un aniversario lonxe da casa no que fixeches que un regalo chegase ata un hotel.'},
 {id:'marcos',name:'Marcos',icon:'👨🏻',zone:'z6',clue:'Coñecéstesvos no traballo. Por sorte, o cariño non figura no contrato laboral.'},
 {id:'nely',name:'Nely',icon:'👩🏻‍🦰',zone:'z6',clue:'Ya tú sabeeeh 😏 🇩🇴'},
 {id:'silvia7',name:'Silvia',icon:'👩🏻',zone:'z7',clue:'Unha persoa que levou golpes, inquedanzas e momentos nos que todo pesaba máis do debido, pero que seguiu tirando para diante. Capaz de levantarse, de querer de verdade, de coidar á súa xente e de seguir atopando motivos para sorrir. Ten un sorriso dos que cambian un momento e un corazón no que caben estas nove persoas e moitas máis. Chegar ata o Sildoku 7 tamén di algo dela: segue aquí, avanzando, descubrindo cousas e demostrando que pode saír adiante, incluso cando ela mesma dubida. E ás veces, entre tanto querer aos demais, tamén merece lembrar todo o que vale ela.'}
];
const happyRooms=[
 {zone:'z1',name:'Vedra'},
 {zone:'z2',name:'Cuarto de Xogos'},
 {zone:'z3',name:'Banco das Conversas'},
 {zone:'z4',name:'Parque dos Paseos'},
 {zone:'z5',name:'Mesa Familiar'},
 {zone:'z6',name:'Amizade'},
 {zone:'z7',name:'O Espello'}
];
const HZ=[
 ['z1','z1','z1','z3','z3','z3','z3','z6','z6','z6'],
 ['z1','z1','z2','z2','z3','z3','z6','z6','z6','z6'],
 ['z1','z2','z2','z2','z2','z3','z3','z6','z6','z6'],
 ['z4','z4','z2','z2','z5','z5','z3','z6','z6','z6'],
 ['z4','z4','z4','z5','z5','z5','z5','z6','z6','z6'],
 ['z4','z4','z5','z5','z5','z5','z6','z6','z6','z6'],
 ['z4','z5','z5','z5','z5','z6','z6','z6','z6','z6'],
 ['z5','z5','z5','z7','z7','z7','z6','z6','z6','z6'],
 ['z5','z5','z7','z7','z7','z7','z7','z6','z6','z6'],
 ['z5','z7','z7','z7','z7','z7','z7','z7','z6','z6']
];
const happyPos={carmen:[0,1],elva:[1,2],mariav:[2,5],balu:[3,0],brais:[4,4],mama:[5,3],rocio:[6,6],marcos:[7,9],nely:[8,8],silvia7:[9,7]};
const happyDecor={'0,0':'🦋','1,3':'🧸','2,4':'💬','3,1':'🌳','4,5':'🍽️','5,2':'🏠','6,7':'🎁','7,8':'🤝','8,9':'💛','9,6':'🪞'};
function renderHappyStory(){
 storyContent.classList.remove('storyPlaceholder','lockedStoryPreview');
 storyContent.innerHTML=`<header class="hero happyHero"><div><span class="eyebrow">EXPEDIENTE FINAL · HISTORIA 7</span><h1>SILDOKU</h1><p>A felicidade</p></div></header><div class="game"><aside class="leftPanel panel happyPanel"><h2 id="happyLeftTitle">NOMES DAS HABITACIÓNS</h2><p id="happyHelp" class="muted">Xa sabes resolver posicións. Esta vez dámoschas nós: todas as persoas están xa colocadas. O reto é reconstruír o que falta. Este último Sildoku ten dúas partes: primeiro pon nome ás 7 habitacións; despois descubrirás a quen pertence cada pista. Hai habitacións compartidas, así que mira ben todo o taboleiro antes de decidir.</p><div id="happyChoices" class="happyChoiceList"></div></aside><main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="happyBoard" class="board happyBoard"></div></div></div></main><aside class="rightPanel panel happyPanel"><section class="general"><h2>COMO SE XOGA</h2><p><b>Esta vez as posicións xa están resoltas.</b> Ti tes que completar o significado do taboleiro.</p><p><b>Parte 1.</b> Coloca os nomes das <b>7 habitacións</b>. Algunhas teñen unha persoa e outras están compartidas.</p><p><b>Parte 2.</b> Aparecerán <b>9 pistas</b>: asóciaas coa persoa correcta. Ao colocar as nove descubrirase a <b>pista 10</b>.</p><p>E cando todo encaixe, quedará unha última pregunta.</p></section><div id="happyStatus" class="status">0/7 habitacións identificadas.</div><div class="actions"><button id="happyCheck" class="primary" disabled>🔎 COMPROBAR</button><button id="happyReset" class="secondary">↻ LIMPAR</button></div></aside></div>`;
 const board=document.querySelector('#happyBoard'),choices=document.querySelector('#happyChoices'),status=document.querySelector('#happyStatus'),check=document.querySelector('#happyCheck');
 let phase=1,selected=null,roomAssign={},clueAssign={};
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){const z=HZ[r][c],cell=document.createElement('div');cell.className=`cell happy-${z}`;cell.dataset.r=r;cell.dataset.c=c;cell.dataset.zone=z;if(r===0||HZ[r-1][c]!==z)cell.classList.add('zt');if(r===9||HZ[r+1][c]!==z)cell.classList.add('zb');if(c===0||HZ[r][c-1]!==z)cell.classList.add('zl');if(c===9||HZ[r][c+1]!==z)cell.classList.add('zr');if(happyDecor[`${r},${c}`])cell.innerHTML=`<span class="object">${happyDecor[`${r},${c}`]}</span>`;board.appendChild(cell)}
 for(const p of happyPeople){const [r,c]=happyPos[p.id],cell=board.querySelector(`[data-r="${r}"][data-c="${c}"]`),t=document.createElement('div');t.className='happyToken';t.dataset.person=p.id;t.innerHTML=`<span>${p.icon}</span><b>${p.name}</b>`;cell.appendChild(t)}
 function clearRoomFeedback(){board.querySelectorAll('.cell').forEach(c=>c.classList.remove('roomCorrect','roomWrong'));choices.querySelectorAll('.happyChoice').forEach(b=>b.classList.remove('correct','wrong'))}
 function paintRoomTags(){board.querySelectorAll('.happyZoneTag').forEach(x=>x.remove());for(const [zone,roomName] of Object.entries(roomAssign)){const cells=[...board.querySelectorAll(`[data-zone="${zone}"]`)];const first=cells.find(c=>!c.querySelector('.happyToken')&&!c.querySelector('.object'))||cells[0];if(first){const tag=document.createElement('span');tag.className='happyZoneTag';tag.textContent=roomName;first.appendChild(tag)}}}
 function renderPhase1(){choices.innerHTML='';const roomOrder=['z6','z2','z7','z4','z1','z5','z3'];roomOrder.map(z=>happyRooms.find(r=>r.zone===z)).forEach(room=>{const b=document.createElement('button');b.type='button';b.className='happyChoice';b.textContent=room.name;b.dataset.room=room.name;if(Object.values(roomAssign).includes(room.name))b.classList.add('used');if(selected===room.name)b.classList.add('selected');b.onclick=()=>{clearRoomFeedback();selected=selected===room.name?null:room.name;renderPhase1()};choices.appendChild(b)});paintRoomTags();check.disabled=Object.keys(roomAssign).length!==7;status.textContent=`${Object.keys(roomAssign).length}/7 habitacións identificadas.`}
 board.addEventListener('click',e=>{if(phase===1){const cell=e.target.closest('.cell');if(!cell||!selected)return;clearRoomFeedback();const zone=cell.dataset.zone;for(const z of Object.keys(roomAssign))if(roomAssign[z]===selected)delete roomAssign[z];roomAssign[zone]=selected;selected=null;renderPhase1();return}if(phase===2){const token=e.target.closest('.happyToken');if(!token||!selected)return;clearClueFeedback();const pid=token.dataset.person;for(const p of Object.keys(clueAssign))if(clueAssign[p]===selected)delete clueAssign[p];clueAssign[pid]=selected;selected=null;renderPhase2();return}if(phase===3){finishFinal()}});
 function clearClueFeedback(){choices.querySelectorAll('.happyClue').forEach(d=>d.classList.remove('correct','wrong'))}
 function renderPhase2(){document.querySelector('#happyLeftTitle').textContent='A QUEN PERTENCE?';document.querySelector('#happyHelp').textContent='Selecciona unha pista e toca a persoa á que cres que pertence. Cada persoa recibe unha soa pista. A pista 10 aparecerá cando coloques as outras nove.';choices.className='';choices.innerHTML='';const firstNine=happyPeople.slice(0,9);const nineAssigned=firstNine.every(p=>Object.values(clueAssign).includes(p.id));const clueOrder=['nely','mariav','brais','rocio','balu','mama','elva','marcos','carmen'];const visiblePeople=clueOrder.map(id=>happyPeople.find(p=>p.id===id));if(nineAssigned)visiblePeople.push(happyPeople.find(p=>p.id==='silvia7'));visiblePeople.forEach(p=>{const d=document.createElement('div');d.className='happyClue'+(p.id==='silvia7'?' silviaReveal':'');d.dataset.clue=p.id;if(selected===p.id)d.classList.add('selected');if(Object.values(clueAssign).includes(p.id))d.classList.add('used');d.textContent=p.clue;d.onclick=()=>{clearClueFeedback();selected=selected===p.id?null:p.id;renderPhase2()};choices.appendChild(d)});if(!nineAssigned){const lock=document.createElement('div');lock.className='happyClue lockedClue';lock.textContent='🔒 A última descrición descubrirase cando coloques as outras nove.';choices.appendChild(lock)}board.querySelectorAll('.happyToken').forEach(t=>{const clueId=clueAssign[t.dataset.person];t.classList.toggle('selectedPerson',!!clueId);const old=t.querySelector('.happyAssigned');if(old)old.remove();if(clueId){const a=document.createElement('span');a.className='happyAssigned';a.textContent='✓';t.appendChild(a)}});check.disabled=Object.keys(clueAssign).length!==10;status.textContent=`${Object.keys(clueAssign).length}/10 descricións asociadas.`}
 check.onclick=()=>{if(phase===1){let good=0;clearRoomFeedback();for(const room of happyRooms){const ok=roomAssign[room.zone]===room.name;if(ok)good++;const btn=choices.querySelector(`[data-room="${CSS.escape(room.name)}"]`);if(btn)btn.classList.add(ok?'correct':'wrong')}if(good===7){setTimeout(()=>{phase=2;selected=null;status.innerHTML='✓ <b>As 7 habitacións están ben.</b> Agora descubre a quen pertence cada descrición.';board.querySelectorAll('.cell').forEach(c=>c.classList.remove('roomCorrect','roomWrong'));renderPhase2()},650)}else status.textContent=`${good}/7 habitacións correctas. Verde = correcta · Vermello = incorrecta.`;return}if(phase===2){let good=0;clearClueFeedback();for(const p of happyPeople){const ok=clueAssign[p.id]===p.id;if(ok)good++;const clue=choices.querySelector(`[data-clue="${p.id}"]`);if(clue)clue.classList.add(ok?'correct':'wrong')}if(good===10){phase=3;selected=null;choices.innerHTML=`<div class="happyFinal"><small>UNHA ÚLTIMA PREGUNTA</small><h2>Onde está a felicidade?</h2><p>Escolle calquera cela do taboleiro.</p></div>`;document.querySelector('#happyLeftTitle').textContent='A FELICIDADE';document.querySelector('#happyHelp').textContent='Todo está xa no seu lugar.';status.innerHTML='As habitacións e as persoas están identificadas. Só queda unha pregunta.';check.disabled=true;board.querySelectorAll('.happyToken').forEach(t=>{t.classList.remove('selectedPerson');t.querySelector('.happyAssigned')?.remove()})}else status.textContent=`${good}/10 descricións correctas. Revisa as asociacións.`}};
 function finishFinal(){
  if(phase!==3)return;
  phase=4;
  const picked=board.querySelector('.cell:hover');
  if(picked)picked.classList.add('happyFirstLight');
  board.classList.add('finalGlow');
  const cells=[...board.querySelectorAll('.cell')];
  cells.forEach((cell,i)=>{cell.style.setProperty('--happy-delay',`${i*17}ms`);cell.classList.add('happyLightCell')});
  choices.innerHTML=`<div class="happyFinal"><small>FIN · 🦋</small><h2>Unha soa cela nunca conta toda a historia.</h2><p><b>A vida tampouco.</b></p><p>Hai días difíciles, pero tamén persoas, momentos, risas, recordos e cousas que aínda quedan por descubrir.</p><p><b>Quizais a felicidade estea en aprender a mirar o taboleiro enteiro. 🦋</b></p><button type="button" id="happyCreditsStart" class="primary happyCreditsStart">🎬 VER OS CRÉDITOS</button></div>`;
  status.innerHTML='✨ <b>CASO RESOLTO.</b>';
  choices.querySelector('#happyCreditsStart').onclick=()=>openHappyCredits();
  // O peche é opcional: a reflexión pode lerse sen que os créditos tapen o taboleiro.
  const startCredits=window.setTimeout(()=>{if(phase===4&&!document.querySelector('#happyCreditsOverlay'))openHappyCredits()},10000);
  function openHappyCredits(){
    window.clearTimeout(startCredits);
    if(document.querySelector('#happyCreditsOverlay'))return;
    const overlay=document.createElement('section');overlay.id='happyCreditsOverlay';overlay.className='happyCreditsOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label','Créditos finais do Sildoku');
    overlay.innerHTML=`<div class="happyCreditsControls"><button type="button" id="happyCreditsSkip">Saltar créditos</button><button type="button" id="happyCreditsSound" aria-pressed="false">♪ Activar música</button></div><div class="happyCreditsScroll" id="happyCreditsScroll"><div class="happyCreditsRoll"><h2>SILDOKU</h2><p class="happyCreditsSub">Unha historia contada en sete capítulos.</p><div class="happyCredit"><span>PROTAGONISTA</span><p>Silvia, nas súas mil e unha versións.</p></div><div class="happyCredit"><span>REPARTO</span><p>Todas esas persoas que, dalgunha maneira, forman parte da súa historia.</p></div><div class="happyCredit"><span>ARTISTAS CONVIDADOS</span><p>Os recordos que volven cando menos os esperamos.</p></div><div class="happyCredit"><span>EFECTOS ESPECIAIS</span><p>As bolboretas, as casualidades e os pequenos momentos que o cambian todo.</p></div><div class="happyCredit"><span>BANDA SONORA</span><p>As gargalladas, os abrazos e os silencios que tamén teñen algo que contar.</p></div><div class="happyCredit"><span>ESCENARIOS</span><p>Os lugares que foron importantes e os que aínda quedan por descubrir.</p></div><div class="happyCredit"><span>GUIÓN</span><p>A vida, que nunca sae exactamente como estaba escrita.</p></div><div class="happyCredit"><span>PRODUCIÓN E PROGRAMACIÓN</span><p>Toni Pumar</p></div><div class="happyCredit"><span>DIRECCIÓN</span><p>Toni Pumar</p></div></div></div><div class="happyCreditsEpilogue" id="happyCreditsEpilogue" hidden><p>Hai persoas que chegan á nosa vida sen facer ruído e que, pouco a pouco, se converten en parte da nosa historia.</p><p>Ás veces, os medos fan que sexa máis doado quedar onde estamos que descubrir cara a onde queremos ir.</p><p>Pero o tempo non se detén e, mesmo cando non escollemos, a vida segue avanzando.</p><p>Quizais non se trate de ter sempre a resposta correcta, senón de aprender a escoitarnos, de ser sinceros co que sentimos e de coidar aquilo que forma parte da nosa vida.</p><p>Porque hai decisións que dan medo, pero tamén hai silencios que pesan.</p><div class="happyCreditsNext"><div class="happyCreditsButterfly">🦋</div><p>Aínda queda unha última cousa…</p><button type="button" id="happyCreditsContinue">Continuar ↓</button></div><div id="happyCreditsFarewell" class="happyCreditsFarewell"><h2>Unha última cousa...</h2><p>Esta pequena aventura tamén ten o seu final. Dentro duns días, esta páxina deixará de estar dispoñible. Os taboleiros, as pistas e as sete historias desaparecerán da pantalla.</p><p>Pero hai cousas que non necesitan permanecer nunha pantalla para seguir formando parte dos nosos recordos.</p><h2>Grazas por xogar.</h2><p>Fin dos sete Sildokus. 🦋</p><div class="happyCreditsEndActions"><button type="button" id="happyCreditsReplay">↻ Repetir os créditos</button><button type="button" id="happyCreditsClose">Volver ás historias</button></div></div></div><div class="happyCreditsDown" id="happyCreditsDown" aria-hidden="true">↓<span>Segue lendo</span></div>`;
    document.body.appendChild(overlay);
    const scroll=overlay.querySelector('#happyCreditsScroll'),epilogue=overlay.querySelector('#happyCreditsEpilogue');
    let creditsTimer=null,fadeTimer=null,available=false,playing=false;
    const musicButton=overlay.querySelector('#happyCreditsSound');
    const music=new Audio(`${import.meta.env.BASE_URL}musica/creditos.mp3`);
    music.loop=true;music.preload='auto';music.volume=0;
    musicButton.hidden=true;
    function stopFade(){if(fadeTimer!==null){window.clearInterval(fadeTimer);fadeTimer=null}}
    function fadeTo(target,duration=1300,after){stopFade();const start=music.volume;const startTime=performance.now();fadeTimer=window.setInterval(()=>{const t=Math.min(1,(performance.now()-startTime)/duration);music.volume=Math.max(0,Math.min(1,start+(target-start)*t));if(t>=1){stopFade();if(after)after()}},50)}
    function updateMusicButton(){musicButton.textContent=playing?'♫ Silenciar música':'♪ Activar música';musicButton.setAttribute('aria-pressed',String(playing))}
    function stopMusic(){playing=false;stopFade();music.pause();music.currentTime=0;music.volume=0;updateMusicButton()}
    async function startMusic(){if(!available)return;try{await music.play();playing=true;updateMusicButton();fadeTo(.25)}catch{playing=false;updateMusicButton()}}
    function toggleMusic(){if(!available)return;if(playing){playing=false;updateMusicButton();fadeTo(0,700,()=>music.pause())}else startMusic()}
    music.addEventListener('canplay',()=>{if(!available){available=true;musicButton.hidden=false;startMusic()}},{once:true});
    music.addEventListener('error',()=>{available=false;playing=false;musicButton.hidden=true;stopFade();music.pause()});
    music.load();
    function cleanup(){window.clearTimeout(creditsTimer);stopMusic();music.removeAttribute('src');music.load();overlay.remove()}
    function updateDown(){const hint=overlay.querySelector('#happyCreditsDown');if(!overlay.classList.contains('happyEpilogueVisible')){hint.hidden=true;return}hint.hidden=overlay.scrollTop+overlay.clientHeight>=overlay.scrollHeight-75}
    function showEpilogue(){window.clearTimeout(creditsTimer);scroll.hidden=true;epilogue.hidden=false;overlay.classList.add('happyEpilogueVisible');overlay.querySelector('#happyCreditsFarewell').hidden=true;overlay.scrollTop=0;window.requestAnimationFrame(updateDown)}
    overlay.addEventListener('scroll',updateDown,{passive:true});
    overlay.querySelector('#happyCreditsContinue').onclick=()=>{if(playing)fadeTo(0,2600,()=>{music.pause();playing=false;updateMusicButton()});const farewell=overlay.querySelector('#happyCreditsFarewell');farewell.hidden=false;window.requestAnimationFrame(()=>{farewell.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});window.setTimeout(updateDown,600)})};
    function playCredits(){if(available&&!playing)startMusic();scroll.hidden=false;epilogue.hidden=true;overlay.querySelector('#happyCreditsDown').hidden=true;overlay.classList.remove('happyEpilogueVisible');const roll=scroll.querySelector('.happyCreditsRoll');roll.style.animation='none';void roll.offsetWidth;roll.style.animation='';creditsTimer=window.setTimeout(showEpilogue,34000)}
    overlay.querySelector('#happyCreditsSkip').onclick=showEpilogue;
    musicButton.onclick=toggleMusic;
    overlay.querySelector('#happyCreditsReplay').onclick=playCredits;
    overlay.querySelector('#happyCreditsClose').onclick=cleanup;
    playCredits();
  }
}
 document.querySelector('#happyReset').onclick=()=>renderHappyStory();renderPhase1();
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
function setPageTitle(story){document.title=`Sildoku - ${story.label}`;}
function renderStoryById(storyId, title){
  const current=stories.find(s=>s.id===storyId); if(current) setPageTitle(current);
  if(storyId==='historia1'){
    location.reload();
  } else if(storyId==='historia2'){
    renderWorkStory();
  } else if(storyId==='historia3'){
    renderFearStory();
  } else if(storyId==='historia4'){
    renderDecisionStory();
  } else if(storyId==='historia5'){
    renderRemainsStory();
  } else if(storyId==='historia6'){
    renderDiscoverStory();
  } else if(storyId==='historia7'){
    renderHappyStory();
  } else {
    storyContent.classList.add('storyPlaceholder');
    const game=storyContent.querySelector('.game'); if(game) game.style.display='none';
    const hero=storyContent.querySelector('.hero'); if(hero) hero.style.display='none';
    let ph=storyContent.querySelector('.comingSoon');
    if(!ph){ph=document.createElement('section');ph.className='comingSoon';storyContent.appendChild(ph)}
    ph.innerHTML=`<span>PRÓXIMO EXPEDIENTE</span><h2>${title}</h2><p>Aquí irá un novo Sildoku coa súa propia historia, personaxes, pistas e taboleiro.</p>`;
  }
}
function showLockedStory(story){
  // Debuxa o expediente por detrás cando xa existe, pero queda practicamente oculto.
  if(story.id==='historia2') renderWorkStory();
  else if(story.id==='historia3') renderFearStory();
  else if(story.id==='historia4') renderDecisionStory();
  else if(story.id==='historia5') renderRemainsStory();
  else if(story.id==='historia6') renderDiscoverStory();
  else if(story.id==='historia7') renderHappyStory();
  else {
    storyContent.classList.add('storyPlaceholder');
    storyContent.innerHTML=`<section class="comingSoon lockedPreviewDummy"><span>EXPEDIENTE PECHADO</span><h2>${story.label}</h2><p>O contido aparecerá cando chegue o seu día.</p></section>`;
  }
  storyContent.classList.add('lockedStoryPreview');
  const overlay=document.createElement('div');
  overlay.className='lockedDateOverlay';
  overlay.innerHTML=`<div class="lockedDateCard"><span>DISPOÑIBLE O</span><strong>${storyDate(story)}</strong><small>ás 00:00</small></div>`;
  storyContent.appendChild(overlay);
}
document.querySelectorAll('.storyTab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.storyTab').forEach(x=>x.classList.toggle('active',x===btn));
  activeStory=btn.dataset.story;
  const story=stories.find(s=>s.id===activeStory);
  setPageTitle(story);
  if(!storyIsAvailable(story)){
    showLockedStory(story);
    return;
  }
  renderStoryById(activeStory, btn.textContent);
}));
updateCheckState();

setPageTitle(stories.find(s=>s.id===activeStory));
