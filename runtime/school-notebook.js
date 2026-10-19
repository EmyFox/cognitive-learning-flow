/* CLF v0.7: independent, Shadow DOM school notebook for deterministic lessons. */
(function (root) {
'use strict';
const CSS=String.raw`
:host{display:block;color:#223954;font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;--ink:#245583;--clfred:#d56a6a;--clfyellow:#fff0ac;--clfgreen:#d8edd4}*,*::before,*::after{box-sizing:border-box}
button,input,select{font:inherit}button{cursor:pointer;touch-action:manipulation}button:disabled{opacity:.38;cursor:not-allowed}
button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #0d77cb;outline-offset:3px}
.topline{display:flex;gap:15px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:0 0 14px}
.pretitle{font-size:11px;letter-spacing:.16em;color:#526885;font-weight:800;text-transform:uppercase}.topic{font:700 clamp(21px,3vw,31px)/1.15 Georgia,serif;color:#203d63;margin:4px 0}.lede{color:#68788b;font-size:13px;margin:4px 0 0}
.pill{display:inline-flex;gap:6px;align-items:center;padding:7px 11px;border:1px solid #d3dbc9;background:#faf8ee;border-radius:999px;color:#3a5578;font-size:12px;font-weight:700}
.tabs{display:flex;gap:8px;flex-wrap:wrap;padding:9px;background:#e0e6e8;border-radius:14px;border:1px solid #cbd3d8;margin:4px 0 16px}
.tabs button{border:1px solid transparent;background:transparent;color:#52708d;border-radius:11px;padding:11px 14px;min-height:44px;font-weight:750}
.tabs button.active{background:#fffdf8;border-color:#c9d6e4;box-shadow:0 3px 7px #183a5f18;color:#174f83}
.board{display:grid;grid-template-columns:minmax(0,1.48fr) minmax(310px,.92fr);align-items:start;gap:17px}
.sheet{position:relative;min-width:0;background:#fffef8;border:1px solid #d4cbbc;border-radius:7px 15px 15px 7px;box-shadow:2px 5px 0 #c9c4b7,10px 14px 24px #2d364125;overflow:hidden}
.sheet:before{content:'';position:absolute;left:47px;top:0;bottom:0;width:2px;background:#dc8587;z-index:1;opacity:.72;pointer-events:none}
.sheet:after{content:'';position:absolute;top:0;bottom:0;left:0;width:35px;background:radial-gradient(circle at 18px 39px,#ece6da 0 7px,#afa9a3 7.8px 8.5px,transparent 9px) 0 0 / 35px 85px repeat-y;pointer-events:none;z-index:1}
.paper{min-height:620px;padding:20px 22px 24px 64px;background-image:linear-gradient(90deg,#96b1ce14 1px,transparent 1px),linear-gradient(#96b1ce16 1px,transparent 1px);background-size:24px 24px}
.paper-head{display:flex;justify-content:space-between;gap:9px;align-items:start;border-bottom:2px solid #aec5de80;padding:0 0 12px;margin-bottom:13px}
.subject{font-family:Georgia,serif;font-size:20px;font-weight:800;color:#1b527f}.folio{font-size:11px;text-transform:uppercase;font-weight:800;letter-spacing:.11em;color:#7a88a0}
.step-kicker{font-size:11px;color:#d56b54;font-weight:900;text-transform:uppercase;letter-spacing:.13em;margin:8px 0 2px}.step-title{font:800 clamp(22px,3vw,29px)/1.2 Georgia,serif;color:#24547c;margin:0 0 10px}
.why{position:relative;padding:12px 13px 12px 17px;margin:0 0 14px;background:#fff0b7;border:1px solid #ead898;box-shadow:3px 3px 0 #c7b26434;transform:rotate(-.5deg);font-size:13px;color:#6e5c2b}.why strong{display:block;color:#79601e;margin-bottom:2px;font-size:10px;text-transform:uppercase;letter-spacing:.14em}
.inklines{min-height:154px;max-height:330px;overflow-y:auto;padding:4px 2px 12px;scrollbar-width:thin}
.inkline{font:600 16px/32px 'Segoe Print','Comic Sans MS',cursive;white-space:pre-wrap;overflow-wrap:anywhere;min-height:33px;color:#275e91;letter-spacing:.01em;/* Ink stays stable during each typed glyph; cursor is animated separately. */}
.inkline.emphasis{font-weight:900;color:#af4d49;background:linear-gradient(transparent 55%,#ffea9ebf 55%);width:fit-content;padding-right:5px}
.inkline small{font-size:10px}.cursor{display:inline-block;height:20px;width:2px;vertical-align:middle;background:#2b5d9b;animation:blink .7s infinite}
.worksheet-divider{border-top:2px dashed #becddc;margin:16px 0 12px}.margin-note{font-size:11px;color:#879ab1;margin-top:6px}
.legend{display:flex;gap:12px;flex-wrap:wrap;color:#62738a;font-size:11px;margin:6px 0 12px}.legend b{color:#205a8c}.graph-scroll{overflow-x:auto;overflow-y:hidden;max-width:100%;border-radius:10px;border:1px dashed #cad8e2;background:#fcfffdad}
.graph-scroll svg{width:100%;min-width:440px;height:auto;display:block}.edge{fill:none;stroke:#a8bac9;stroke-width:2.4;transition:stroke .3s,stroke-width .3s}.edge.on{stroke:#f09d42;stroke-width:4;stroke-dasharray:8 4;animation:travel 1s linear infinite}.node rect{fill:#f0f7f4;stroke:#9fbbbd;stroke-width:2;transition:fill .25s,stroke .25s}.node.on rect{fill:#fff1b4;stroke:#ed9c3f;stroke-width:3}.node text{fill:#294a72;font-weight:800}.station-strip{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:11px}.station{background:#eff5fa;border:1px solid #c9d9e5;border-radius:10px;padding:10px;animation:pop .35s both}.station .tag{display:flex;align-items:center;gap:6px;color:#49688a;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.station .load{font:800 21px Georgia,serif;color:#244f83;margin:5px 0}.station .tasklist{font-size:12px;color:#3b5272}.station .meter{background:#d6e2e9;height:6px;border-radius:10px;margin-top:7px;overflow:hidden}.station .meter i{display:block;height:100%;background:#51a98e;border-radius:10px;transition:width .45s}.station.placeholder{opacity:.48;border-style:dashed}
.panel{border:1px solid #d5dce0;border-radius:15px;background:#f9fbfc;box-shadow:0 4px 13px #203b4a0d;padding:15px;min-width:0;margin-bottom:14px}
.panel h3{font:800 17px Georgia,serif;margin:0 0 6px;color:#294e79}.panel p{color:#687d90;font-size:13px;margin:0 0 9px}.smallcap{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:#71839c}.actionbar{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
.btn{border:1px solid #cad6e0;background:white;border-radius:9px;color:#305982;min-height:44px;padding:10px 12px;font-weight:750;font-size:13px;transition:transform .15s,box-shadow .15s}.btn:hover{transform:translateY(-1px);box-shadow:0 3px 8px #0001}.btn.primary{background:#295a8d;color:white;border-color:#295a8d}.btn.orange{background:#fff0b0;border-color:#ead694;color:#785b25}.btn.tiny{font-size:12px}
.stepbox{display:flex;align-items:center;justify-content:space-between;gap:8px}.stepbox label{font-weight:700;color:#456180;font-size:12px}.stepbox select,.speed{max-width:100%;min-height:42px;border:1px solid #cbd6df;padding:8px;border-radius:9px;background:#fff;color:#355370;font:inherit;font-size:12px}.bar{height:8px;border-radius:10px;overflow:hidden;background:#dce7ef;margin:10px 0}.bar>i{height:100%;background:linear-gradient(90deg,#65a9d8,#3e8b85);display:block;transition:width .15s}
.calc{background:#e6ebea;border:1px solid #becbd0;border-radius:16px;padding:11px;box-shadow:4px 5px 0 #abb7bb4a}.screen{min-height:74px;background:#233e47;color:#f0f6d0;border-radius:9px;border:3px solid #718c8c;text-align:right;padding:9px 12px;overflow-wrap:anywhere}.screen .expr{color:#bed0c5;font:600 12px/1.3 ui-monospace,monospace;min-height:16px}.screen .digits{font:700 27px/1.4 ui-monospace,monospace;min-height:36px}.keys{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.key{min-width:0;min-height:43px;border:1px solid #bdcbd2;background:white;color:#345370;border-radius:8px;font:800 15px ui-monospace,monospace;box-shadow:0 3px 0 #bcc9cd}.key.op{background:#dae7f5}.key.equal{background:#f5bd68;border-color:#dfaa52}.key.flash{background:#f6de7a;transform:translateY(2px);box-shadow:0 1px 0 #cca857}
.metric-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}.metric{background:#f2f6ee;border:1px dashed #aac3a3;border-radius:10px;padding:12px}.metric .num{font:800 26px Georgia,serif;color:#2c715e}.metric small{display:block;color:#648075;font-size:11px}
.question{background:#f1f6ff;border:1px solid #c3d8ec;padding:13px;border-radius:11px;margin:13px 0}.question strong{font:800 19px Georgia,serif;color:#315981}.answer{min-width:0;max-width:240px;width:100%;min-height:46px;padding:9px;border:1px solid #9db6c5;border-radius:9px;font-size:18px;background:white;color:#234761}.message{font-size:13px;line-height:1.55;padding:9px 12px;border-radius:8px;margin:10px 0}.message.ok{background:#dcefe0;color:#30603b}.message.warn{background:#fff0d6;color:#845b25}.message.err{background:#fbe9e7;color:#8c4141}
.chipline{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.chip{border:1px solid #b8cbd6;background:white;border-radius:99px;padding:10px 14px;min-height:44px;color:#345977;font-weight:700}.chip.active{background:#2f6d83;color:white;border-color:#2f6d83}.table-like{margin:12px 0;width:100%;font-size:13px;border-collapse:collapse}.table-like td,.table-like th{padding:9px 7px;border-bottom:1px dashed #bdccd5;text-align:left}.table-like th{color:#607789;font-size:11px;letter-spacing:.05em;text-transform:uppercase}
.note{background:#ffefbd;border-left:4px solid #db9d53;padding:12px;margin:12px 0;color:#6f5e3c;font-size:12px;transform:rotate(-.25deg)}[hidden]{display:none!important}
@keyframes fadeInk{from{opacity:.25}to{opacity:1}}@keyframes blink{50%{opacity:0}}@keyframes travel{to{stroke-dashoffset:-24}}@keyframes pop{from{opacity:0;transform:translateY(9px) scale(.98)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1050px){.board{grid-template-columns:minmax(0,1fr)}.paper{min-height:540px}.aside{display:grid;grid-template-columns:1fr 1fr;gap:13px}.aside .panel{margin:0}.aside .calcwrap{grid-column:1/-1}}
@media(max-width:600px){.topline{gap:8px}.paper{padding:18px 12px 20px 44px;min-height:490px}.sheet:before{left:35px}.sheet:after{left:0;width:26px;background-size:26px 78px;background-image:radial-gradient(circle at 13px 38px,#ebe4d7 0 5px,#aaa49a 6px,transparent 7px)}.inkline{font-size:13.5px;line-height:29px}.aside{display:block}.aside .panel{margin-bottom:12px}.station-strip{grid-template-columns:1fr 1fr}.graph-scroll svg{min-width:490px}.stepbox{align-items:stretch;flex-direction:column}.subject{font-size:18px}.panel{padding:12px}}
@media print{.tabs,.aside,.controls,.chipline{display:none!important}.sheet{box-shadow:none;break-inside:avoid}.paper{background-image:linear-gradient(#96b1ce20 1px,transparent 1px);height:auto}.graph-scroll{overflow:visible}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;
const KEYS=['7','8','9','÷','4','5','6','×','1','2','3','−','C','0','.','+','(',')','=','⌫'];
const mk=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e;};
const fmt=n=>Number(n.toFixed(2)).toLocaleString('es-MX',{maximumFractionDigits:2});
const exact=n=>Number(n.toFixed(6));
const svg=(tag,attrs)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
function buildStages(data,result){
  const n=result.stations.length,ct=result.cycle,work=result.total,eff=100*result.efficiency;
  const A=(id)=>data.tasks.find(t=>t.id===id);
  const lines=t=>t;
  const stages=[
    {label:'00 · identificar',title:'¿Qué problema vamos a resolver?',why:'Separamos lo que pide la planta de los datos que conocemos. Todavía no operamos.',lines:[`Turno productivo = ${fmt(data.availableSeconds/3600)} h`, `Demanda = ${fmt(data.demand)} unidades / turno`,'Objetivo → diseñar estaciones sin violar precedencias.'],focus:[],mark:'Datos del problema'},
    {label:'01 · modelar',title:'Encontramos el tiempo de ciclo',why:'Dividimos el tiempo disponible entre las unidades requeridas: indica el máximo por pieza en cada estación.',lines:['CT = tiempo disponible / demanda',`CT = ${fmt(data.availableSeconds)} ÷ ${fmt(data.demand)}`,`CT = ${fmt(ct)} segundos / unidad`],calc:`${data.availableSeconds}/${data.demand}`,value:ct,focus:[],mark:'Ritmo objetivo'},
    {label:'02 · sumar',title:'Sumamos el contenido de trabajo',why:'Sumamos todas las tareas una sola vez: eso mide trabajo, no duración de la línea.',lines:[`Contenido total = ${data.tasks.map(t=>t.seconds).join(' + ')} s`,`Σti = ${fmt(work)} segundos por unidad`],calc:data.tasks.map(t=>t.seconds).join('+'),value:work,focus:data.tasks.map(t=>t.id),mark:'Contenido de trabajo'},
    {label:'03 · estimar',title:'¿Cuántas estaciones como mínimo?',why:'La capacidad total obliga a usar al menos techo(Σti / CT); es solo un límite, no garantiza una asignación factible.',lines:[`Nmín = ⌈${fmt(work)} / ${fmt(ct)}⌉`,`Nmín = ${fmt(result.theoreticalMin)} estaciones`],calc:`${work}/${ct}`,value:work/ct,focus:[],mark:'Límite matemático'},
    {label:'04 · restricciones',title:'Leemos las precedencias',why:'Una tarea solo puede asignarse si todas sus predecesoras ya terminaron en esa estación o en una anterior.',lines:['Las flechas significan “debe realizarse antes”.','Buscamos tareas elegibles sin exceder CT.'],focus:data.tasks.map(t=>t.id),mark:'Red de precedencias'},
  ];
  for(const st of result.stations){
    stages.push({label:`${String(st.id).padStart(2,'0')} · asignar`,title:`Construimos la estación ${st.id}`,why:'Agrupamos tareas elegibles en orden de la lista, respetando el ciclo. Este procedimiento es una heurística, no una garantía de óptimo.',lines:[`Estación ${st.id} → ${st.tasks.map(id=>`${id} (${A(id).seconds}s)`).join(' + ')}`,`Carga = ${fmt(st.load)} s · Ocio = ${fmt(st.idle)} s`],calc:st.tasks.map(id=>A(id).seconds).join('+'),value:st.load,focus:st.tasks,station:st.id,mark:`Estación ${st.id} lista`});
  }
  stages.push({label:'08 · evaluar',title:'Calculamos la eficiencia',why:'El porcentaje de ocupación compara el trabajo requerido con el tiempo disponible en todas las estaciones.',lines:[`Eficiencia = Σti / (N × CT) × 100`, `η = ${fmt(work)} / (${n} × ${fmt(ct)}) × 100`, `η = ${fmt(eff)} % · Ocio total = ${fmt(result.idleSeconds)} s`],calc:`${work}/(${n}*${ct})*100`,value:eff,focus:data.tasks.map(t=>t.id),mark:'Eficiencia de la línea'});
  stages.push({label:'09 · interpretar',title:'¿Qué decisión tomaría un ingeniero?',why:'Una solución factible cumple ritmo y precedencias. Comparamos alternativas antes de comprar equipos o contratar personal.',lines:[`Resultado: ${n} estaciones, ${fmt(eff)}% de eficiencia.`,`Mínimo teórico: ${result.theoreticalMin}. Diferencia: ${n-result.theoreticalMin} estación(es).`,'Si cambia la demanda, vuelve a calcular el ciclo.'],focus:[],mark:'Conclusión técnica'});
  return stages;
}
function compileStages(stages){
  const events=[],starts=[],ends=[];
  stages.forEach((stage,i)=>{
    starts.push(events.length);events.push({type:'scene',scene:i,focus:stage.focus||[]});
    for(const line of stage.lines){events.push({type:'line',scene:i});for(const ch of Array.from(line))events.push({type:'glyph',ch,scene:i});}
    if(stage.calc){events.push({type:'clear',scene:i});for(const key of [...stage.calc.replaceAll('*','×').replaceAll('/','÷'),'='])events.push({type:'key',key,scene:i});events.push({type:'result',value:stage.value,scene:i});}
    if(stage.station)events.push({type:'station',station:stage.station,scene:i});
    ends.push(events.length);
  });return {events,starts,ends};
}
function snapshot(timeline,cursor){
  const state={scene:0,lines:[],focus:[],calc:'0',expression:'',key:'',station:0};
  for(let k=0;k<Math.min(cursor,timeline.events.length);k++){
    const e=timeline.events[k];
    if(e.type==='scene'){state.scene=e.scene;state.focus=e.focus;state.key='';}
    else if(e.type==='line')state.lines.push('');
    else if(e.type==='glyph')state.lines[state.lines.length-1]+=e.ch;
    else if(e.type==='clear'){state.calc='';state.expression='';}
    else if(e.type==='key'){state.key=e.key;if(e.key!=='='){state.expression+=e.key;state.calc=state.expression;}}
    else if(e.type==='result'){state.calc=fmt(e.value);state.key='=';}
    else if(e.type==='station')state.station=e.station;
  }return state;
}
function mount(host,rawLesson){
 if(!host||!host.appendChild)throw Error('Contenedor CLF inexistente');
 const solver=root.CLFLineBalancing;
 if(!solver)throw Error('El motor CLFLineBalancing debe cargarse primero');
 const data=JSON.parse(JSON.stringify(rawLesson));let demand=data.demand,result,stages,timeline,cursor=0,playing=false,timer=null,speed=1,mode='demo',practiceIndex=0,practiceSolved=false,practiceAttempts=0,practiceHint=false,practiceDraft='',calcManual='',labDemand=demand,broken=false;
 const reduce=!!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion:reduce)').matches);
 const mountpoint=mk('div');const shadow=mountpoint.attachShadow({mode:'open'});
 const st=mk('style');st.textContent=CSS;shadow.append(st);
 const main=mk('div');main.innerHTML=`
 <div class="topline"><div><div class="pretitle">Lección interactiva · Procesos productivos · 07</div><h2 class="topic">Balanceo de una línea de ensamble</h2><p class="lede">Del enunciado a la decisión, paso a paso y con cuentas verificables.</p></div><span class="pill">✦ Método · Tiempos · Estaciones</span></div>
 <nav class="tabs" aria-label="Modos de aprendizaje"><button data-tab="demo" class="active" aria-pressed="true">✎ Ver explicación</button><button data-tab="practice" aria-pressed="false">◎ Ahora tú</button><button data-tab="lab" aria-pressed="false">⚙ Laboratorio</button></nav>
 <div class="board">
  <div class="sheet"><div class="paper"><div class="paper-head"><div><div class="folio">Materia · Ingeniería de métodos</div><div class="subject">Balanceo de línea</div></div><div class="folio">Hoja 01 / ejercicio 07</div></div>
   <div id="demo-body"><div id="step-kicker" class="step-kicker">Tema de hoy</div><h3 id="step-title" class="step-title">Aprender a balancear</h3><div id="reason" class="why"><strong>¿Por qué hacemos esto?</strong><span id="reason-text">Calcularemos el ritmo antes de asignar tareas.</span></div><div class="inklines" id="inklines" aria-label="Apuntes animados del procedimiento"></div></div>
   <div id="practice-body" hidden><div class="step-kicker">Ejercicio · resolver sin mirar</div><h3 class="step-title">Tu turno, ingeniero</h3><div class="why"><strong>Piensa antes de calcular</strong><span>Comprueba cada resultado. Si te equivocas, la pista explica dónde revisar.</span></div><div id="practice-content"></div></div>
   <div id="lab-body" hidden><div class="step-kicker">Experimento · ¿qué pasa si...?</div><h3 class="step-title">Cambia la demanda</h3><p>La línea responde a tus decisiones sin inventar resultados.</p><div class="chipline" id="demand-options"></div><div class="metric-grid" id="lab-metrics"></div><div class="note">El balanceo usa una heurística de asignación elegible y puede no encontrar la solución óptima.</div></div>
   <div class="worksheet-divider"></div><div class="smallcap">Red de actividades · precedencias</div><div class="graph-scroll" id="graph-scroll"><div id="graph"></div></div><div class="legend"><span>↳ Flechas: <b>orden obligatorio</b></span><span>✦ Amarillo: <b>tareas actuales</b></span></div>
   <div class="smallcap">Estaciones de trabajo · distribución</div><div id="stations" class="station-strip"></div><div class="margin-note">Cuaderno digital · las simulaciones ilustran un procedimiento, no sustituyen un estudio de tiempos de campo.</div>
  </div></div>
  <aside class="aside">
   <section id="controls" class="panel"><div class="smallcap">Control de clase</div><h3>El ritmo del razonamiento</h3><p>Detén la escritura cuando quieras y revisa por qué se hizo cada operación.</p><div class="actionbar"><button id="play" class="btn primary">▶ Reproducir</button><button id="prev" class="btn" aria-label="Etapa anterior">← Atrás</button><button id="next" class="btn" aria-label="Etapa siguiente">Siguiente →</button></div><div class="stepbox"><label for="stages">Saltar a una etapa</label><select id="stages" aria-label="Escoger etapa"></select></div><div class="actionbar"><button id="restart" class="btn tiny">↻ Reiniciar</button><label class="smallcap" for="speed">Velocidad</label><select id="speed" class="speed" aria-label="Velocidad"><option value=".5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></div><div class="bar" aria-label="Progreso"><i id="fill" style="width:0"></i></div><div class="stepbox"><span id="count" class="smallcap">Etapa 1</span><span id="pct" class="smallcap">0%</span></div></section>
   <section class="panel calcwrap"><div class="smallcap">Instrumento sincronizado</div><h3>Calculadora de mesa</h3><div class="calc"><div class="screen"><div id="calc-expr" class="expr">lista para calcular</div><div id="calc-digits" class="digits">0</div></div><div id="keys" class="keys"></div></div><p class="margin-note" id="calc-caption">Durante la demostración, observarás las pulsaciones. En práctica puedes utilizarla.</p></section>
   <section class="panel"><div class="smallcap">Ficha de producción</div><h3>Datos del turno</h3><table class="table-like"><tr><th>Jornada</th><td id="shift">8 h productivas</td></tr><tr><th>Pedido</th><td id="target">480 pzas</td></tr><tr><th>Tareas</th><td id="numtasks">7 actividades</td></tr></table><div class="note">Una estación puede ejecutar varias tareas consecutivas, siempre que no exceda el ciclo y cumpla sus precedencias.</div></section>
  </aside>
 </div>
 <div aria-live="polite" id="announcer" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"></div>`;
 shadow.append(main);host.append(mountpoint);
 const $=id=>shadow.getElementById(id);
 const keyButtons=new Map();for(const key of KEYS){const btn=mk('button','key '+('÷×−+'.includes(key)?'op':'')+(key==='='?' equal':''),key);btn.type='button';btn.setAttribute('aria-label',key==='⌫'?'Borrar':key);btn.addEventListener('click',()=>manualKey(key));$('keys').append(btn);keyButtons.set(key,btn);}
 const tasks=data.tasks;
 function layoutNodes(){
   const depth=new Map();for(const id of result.taskOrder){const task=tasks.find(t=>t.id===id);depth.set(id,task.predecessors.length?Math.max(...task.predecessors.map(p=>depth.get(p)))+1:0);}
   const layers=new Map();for(const t of tasks){const n=depth.get(t.id);if(!layers.has(n))layers.set(n,[]);layers.get(n).push(t.id);}
   const width=Math.max(700,(Math.max(...depth.values())+1)*160+110);
   const height=Math.max(280,Math.max(...Array.from(layers.values()).map(a=>a.length))*95+85);
   const pos=new Map();for(const [level,ids] of layers)ids.forEach((id,i)=>pos.set(id,[68+level*160,height/2+(i-(ids.length-1)/2)*95]));
   return {positions:pos,width,height};
 }
 function graph(focus=[]){
   const container=$('graph');if(!container.firstChild){const {positions,width,height}=layoutNodes();const image=svg('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':'Red de actividades y precedencias'});const defs=svg('defs',{}),marker=svg('marker',{id:'clf-school-arrow',markerWidth:8,markerHeight:8,refX:7,refY:3,orient:'auto'});marker.append(svg('path',{d:'M 0 0 L 7 3 L 0 6',fill:'none',stroke:'#99adbc','stroke-width':1.5}));defs.append(marker);image.append(defs);
   for(const task of tasks)for(const dep of task.predecessors){const a=positions.get(dep),b=positions.get(task.id);if(!a||!b)continue;image.append(svg('path',{d:`M ${a[0]+31} ${a[1]} C ${a[0]+95} ${a[1]}, ${b[0]-93} ${b[1]}, ${b[0]-32} ${b[1]}`,class:'edge','data-from':dep,'data-to':task.id,'marker-end':'url(#clf-school-arrow)'}));}
   for(const task of tasks){const p=positions.get(task.id)||[60,60],g=svg('g',{class:'node','data-node':task.id});g.append(svg('rect',{x:p[0]-29,y:p[1]-28,width:58,height:56,rx:11}));const name=svg('text',{x:p[0],y:p[1]-5,'text-anchor':'middle','font-size':19});name.textContent=task.id;g.append(name);const sec=svg('text',{x:p[0],y:p[1]+15,'text-anchor':'middle','font-size':11});sec.textContent=task.seconds+' s';g.append(sec);image.append(g);}container.append(image);
   }
   const active=new Set(focus);for(const g of container.querySelectorAll('.node'))g.classList.toggle('on',active.has(g.dataset.node));for(const path of container.querySelectorAll('.edge'))path.classList.toggle('on',active.has(path.dataset.from)&&active.has(path.dataset.to));
 }
 function drawStations(reveal){
  const box=$('stations');box.replaceChildren();result.stations.forEach(s=>{const shown=s.id<=reveal||mode==='lab';const card=mk('div','station'+(shown?'':' placeholder'));card.append(mk('div','tag',`▣ Estación ${s.id}`),mk('div','load',shown?fmt(s.load)+' s':'— s'),mk('div','tasklist',shown?s.tasks.join(' · '):'Por asignar'));const meter=mk('div','meter'),bar=mk('i');bar.style.width=shown?Math.min(100,100*s.load/result.cycle)+'%':'0%';meter.append(bar);card.append(meter);box.append(card);});
 }
 function refreshCalc(snap){const value=(mode==='demo'?snap.calc:calcManual)||'0';$('calc-digits').textContent=value;$('calc-expr').textContent=mode==='demo'?(snap.expression||'Observa la operación…'):(calcManual||'Calculadora manual');for(const [key,node] of keyButtons)node.classList.toggle('flash',mode==='demo'&&key===snap.key);$('calc-caption').textContent=mode==='demo'?'Observa la operación sincronizada con la libreta.':'Puedes usar la calculadora para comprobar tus ideas.';}
 function manualKey(key){if(mode==='demo')return;if(key==='C')calcManual='';else if(key==='⌫')calcManual=calcManual.slice(0,-1);else if(key==='='){try{calcManual=root.CLFCore.format(root.CLFCore.calculate(calcManual));}catch{calcManual='Error';}}else if(calcManual.length<65&&KEYS.includes(key))calcManual+=key;refreshCalc({});}
 function configure(){const newResult=solver.solve({...data,demand});result=newResult;stages=buildStages({...data,demand},result);timeline=compileStages(stages);cursor=0;labDemand=demand;const opts=$('stages');opts.replaceChildren();stages.forEach((stage,i)=>{const opt=mk('option',undefined,`${i+1}. ${stage.title}`);opt.value=String(i);opts.append(opt);});$('shift').textContent=data.availableSeconds/3600+' h productivas';$('target').textContent=demand+' piezas';$('numtasks').textContent=data.tasks.length+' tareas';}
 function render(){if(broken)return;const snap=snapshot(timeline,cursor),stage=stages[snap.scene];
   $('step-kicker').textContent=stage.label;$('step-title').textContent=stage.title;$('reason-text').textContent=stage.why;
   const lines=$('inklines');const oldText=lines.textContent;lines.replaceChildren();snap.lines.forEach((text,i)=>{const row=mk('div','inkline'+(/=|Σ|CT |η |Nmín|Resultado:/.test(text)?' emphasis':''),text);lines.append(row);});if(mode==='demo'&&playing&&snap.lines.length){const c=mk('span','cursor','');lines.lastChild?.append(c);}if(oldText!==lines.textContent)lines.scrollTop=lines.scrollHeight;
   graph(snap.focus);drawStations(snap.station);refreshCalc(snap);
   $('play').textContent=playing?'Ⅱ Pausar':'▶ Reproducir';$('prev').disabled=cursor<=0;$('next').disabled=cursor>=timeline.events.length;$('stages').value=String(snap.scene);$('fill').style.width=(100*cursor/Math.max(1,timeline.events.length))+'%';$('count').textContent=`Etapa ${snap.scene+1} de ${stages.length}`;$('pct').textContent=Math.round(100*cursor/Math.max(1,timeline.events.length))+'%';
 }
 function stop(){playing=false;if(timer!==null){clearTimeout(timer);timer=null;}}
 function tick(){if(!playing)return;if(cursor>=timeline.events.length){stop();render();return;}const e=timeline.events[cursor++];render();const wait=reduce?40:e.type==='glyph'?37:e.type==='key'?160:220;timer=setTimeout(tick,wait/speed);}
 function play(){if(mode!=='demo')return;if(cursor>=timeline.events.length)cursor=0;stop();playing=true;render();tick();}
 function pause(){stop();if(mode==='demo')render();}
 function seek(to){stop();cursor=Math.max(0,Math.min(timeline.events.length,Math.trunc(to)||0));if(mode==='demo'){render();$('announcer').textContent='Etapa '+(snapshot(timeline,cursor).scene+1)+': '+stages[snapshot(timeline,cursor).scene].title;}}
 function seekScene(n){n=Math.max(0,Math.min(stages.length-1,Math.trunc(n)||0));seek(timeline.ends[n]);}
 function changeMode(next){if(!['demo','practice','lab'].includes(next))throw Error('Modo inválido');stop();mode=next;for(const b of shadow.querySelectorAll('[data-tab]')){b.classList.toggle('active',b.dataset.tab===mode);b.setAttribute('aria-pressed',String(b.dataset.tab===mode));}for(const [name,id] of [['demo','demo-body'],['practice','practice-body'],['lab','lab-body']])$(id).hidden=name!==mode;$('controls').hidden=mode!=='demo';$('stations').hidden=mode==='practice';$('graph-scroll').hidden=mode==='practice';$('demand-options').hidden=mode!=='lab';$('count').textContent='';if(next==='demo')render();else if(next==='practice'){practiceIndex=0;practiceSolved=false;practiceAttempts=0;practiceHint=false;practiceDraft='';refreshCalc({});renderPractice();}else{calcManual='';renderLab();}}
 function problems(){return [
   {question:`Hay ${fmt(data.availableSeconds)} s disponibles y un pedido de ${demand} piezas. ¿Cuántos segundos por pieza permite el tiempo de ciclo?`,value:result.cycle,tol:.05,unit:'s/pieza',hint:'Divide el tiempo disponible entre la demanda.',explain:`CT = ${fmt(data.availableSeconds)} ÷ ${demand} = ${fmt(result.cycle)} s/pieza.`},
   {question:`El contenido de trabajo suma ${fmt(result.total)} s. ¿Cuál es el número mínimo teórico de estaciones?`,value:result.theoreticalMin,tol:0,unit:'estaciones',hint:'Calcula techo(Σti/CT); redondea siempre hacia arriba.',explain:`Nmín = techo(${fmt(result.total)}/${fmt(result.cycle)}) = ${result.theoreticalMin}. Es un límite inferior.`},
   {question:`La heurística obtuvo ${result.stations.length} estaciones. ¿Cuántos segundos ociosos hay en total por ciclo?`,value:result.idleSeconds,tol:.1,unit:'s',hint:'Ocio = (número de estaciones × ciclo) − Σti.',explain:`Ocio = ${result.stations.length} × ${fmt(result.cycle)} − ${fmt(result.total)} = ${fmt(result.idleSeconds)} s.`},
   {question:`¿Cuál es la eficiencia de la línea, expresada como porcentaje?`,value:100*result.efficiency,tol:.12,unit:'%',hint:'Divide contenido de trabajo entre (N × CT), y multiplica por 100.',explain:`Eficiencia = ${fmt(result.total)} / (${result.stations.length} × ${fmt(result.cycle)}) × 100 = ${fmt(100*result.efficiency)}%.`}
 ];}
 function renderPractice(message='',status=''){
   const q=problems()[practiceIndex],out=$('practice-content');out.replaceChildren();const card=mk('div','question');card.append(mk('div','smallcap',`Pregunta ${practiceIndex+1} de ${problems().length}`),mk('strong',undefined,q.question));out.append(card);
   if(!practiceSolved){const input=mk('input','answer');input.value=practiceDraft;input.addEventListener('input',()=>practiceDraft=input.value);input.id='practice-answer';input.setAttribute('inputmode','decimal');input.setAttribute('aria-label','Tu respuesta numérica');const send=mk('button','btn primary','Comprobar');send.addEventListener('click',()=>{const raw=input.value.trim().replace(',','.');const v=Number(raw);if(!raw||!Number.isFinite(v)||!/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(raw)){renderPractice('Escribe un número válido.','err');return;}practiceAttempts++;if(Math.abs(v-q.value)<=q.tol){practiceSolved=true;renderPractice('✓ ¡Correcto! '+q.explain,'ok');}else renderPractice(practiceAttempts>=2?`Ese valor no coincide. ${q.hint}`:'Aún no coincide. Revisa unidades y planteamiento.','warn');});input.addEventListener('keydown',e=>{if(e.key==='Enter')send.click();});out.append(input,mk('span','smallcap',' '+q.unit),send);const help=mk('button','btn orange','✦ Dame una pista');help.addEventListener('click',()=>renderPractice(q.hint,'warn'));out.append(help);
   }else{const next=mk('button','btn primary',practiceIndex+1>=problems().length?'↻ Practicar de nuevo':'Siguiente ejercicio →');next.addEventListener('click',()=>{practiceIndex=(practiceIndex+1)%problems().length;practiceSolved=false;practiceAttempts=0;practiceDraft='';renderPractice();});out.append(next);}
   if(message)out.append(mk('div','message '+status,message));
 }
 function renderLab(){const choices=$('demand-options');choices.replaceChildren();for(const val of [400,480,600]){const btn=mk('button','chip'+(val===demand?' active':''),val+' piezas');btn.addEventListener('click',()=>{demand=val;configure();renderLab();});choices.append(btn);}
   const grid=$('lab-metrics');grid.replaceChildren();for(const [label,value] of [['Ciclo permitido',fmt(result.cycle)+' s'],['Estaciones asignadas',result.stations.length],['Eficiencia',fmt(100*result.efficiency)+' %'],['Ocio por ciclo',fmt(result.idleSeconds)+' s']]){const box=mk('div','metric');box.append(mk('div','smallcap',label),mk('div','num',value));grid.append(box);}graph(data.tasks.map(t=>t.id));drawStations(result.stations.length);refreshCalc({});$('target').textContent=demand+' piezas';}
 for(const b of shadow.querySelectorAll('[data-tab]'))b.addEventListener('click',()=>changeMode(b.dataset.tab));
 $('play').addEventListener('click',()=>playing?pause():play());$('prev').addEventListener('click',()=>seekScene(Math.max(0,snapshot(timeline,cursor).scene-1)));$('next').addEventListener('click',()=>seekScene(Math.min(stages.length-1,snapshot(timeline,cursor).scene+1)));$('restart').addEventListener('click',()=>seek(0));$('stages').addEventListener('change',()=>seekScene(Number($('stages').value)));$('speed').addEventListener('change',()=>{speed=Number($('speed').value);});
 configure();graph();drawStations(0);render();
 const controller={play,pause,seek,seekScene,setMode:changeMode,setDemand(value){if(!Number.isFinite(value)||value<=0)throw Error('Demanda inválida');solver.solve({...data,demand:value});stop();demand=value;configure();if(mode==='lab')renderLab();else if(mode==='practice')renderPractice();else render();},getState(){return {mode,demand,cursor,totalEvents:timeline.events.length,stage:snapshot(timeline,cursor).scene,playing,stations:result.stations.length,cycle:result.cycle,efficiency:result.efficiency};},destroy(){stop();mountpoint.remove();broken=true;}};
 return Object.freeze(controller);
}
root.CLFSchoolNotebook=Object.freeze({mount,version:'0.7.0'});
})(globalThis);
