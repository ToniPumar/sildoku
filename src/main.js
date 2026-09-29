import './style.css';

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
const general=`Hai exactamente <b>un personaxe en cada fila e un en cada columna</b>. Cada casilla pertence a unha única zona. Unha zona pode ter unha, varias ou ningunha persoa. Os elementos do escenario ocupan a súa casilla e non se poden tapar.`;

document.querySelector('#app').innerHTML=`
<header class="hero"><div><span class="eyebrow">EXPEDIENTE 10×10</span><h1>MURDOKU</h1><p>O teu lugar</p></div><button id="rulesBtn" class="ghost">Como xogar</button></header>
<div class="game">
 <aside class="leftPanel panel"><h2>PERSONAXES</h2><p class="muted">A pista de cada persoa está na súa ficha. Arrástraa a unha casilla libre.</p><div id="cards" class="cards"></div></aside>
 <main class="center"><div class="boardShell"><div class="colCoords">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join('')}</div><div class="boardLine"><div class="rowCoords">${'ABCDEFGHIJ'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div id="board" class="board"></div></div></div><div class="legend"><span>■ Elemento non ocupable</span><span class="okdot">● Correcto</span><span class="baddot">● Incorrecto</span></div></main>
 <aside class="rightPanel panel"><section class="general"><h2>PISTA XERAL</h2><p>${general}</p></section><div id="status" class="status">Coloca os nove personaxes dispoñibles.</div><div class="actions"><button id="check" class="primary" disabled>🔎 COMPROBAR</button><button id="reset" class="secondary">↻ LIMPAR</button></div></aside>
</div><dialog id="rules"><button id="closeRules" class="close">×</button><h2>Como xogar</h2><p>${general}</p><p><b>COMPROBAR</b> só se activa cando os dez personaxes están colocados. Silvia desbloquéase automaticamente ao colocar os outros nove. Verde = posición correcta; vermello = posición incorrecta. Non hai límite de intentos.</p></dialog>`;

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
function makeToken(p){const t=document.createElement('div');t.className='token';t.dataset.id=p.id;t.draggable=true;const tokenIcon=p.id==='carmen'?'👵🏻':p.icon;t.innerHTML=`<span>${tokenIcon}</span><b>${p.name}</b>`;t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',p.id));t.ondblclick=()=>returnToCard(p.id);return t}
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
 // Ao mover unha ficha, a súa posición anterior non conta para a regra fila/columna.
 for(const [other,[rr,cc]] of Object.entries(placements)){
   if(other!==id && (rr===r||cc===c)) return;
 }
 document.querySelectorAll(`.token[data-id="${id}"]`).forEach(t=>t.remove());
 target.appendChild(makeToken(people.find(x=>x.id===id)));
 placements[id]=[r,c];card.classList.remove('selected');updateExclusions();updateCheckState();
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
checkBtn.onclick=check;document.querySelector('#reset').onclick=()=>location.reload();const dlg=document.querySelector('#rules');document.querySelector('#rulesBtn').onclick=()=>dlg.showModal();document.querySelector('#closeRules').onclick=()=>dlg.close();updateCheckState();
