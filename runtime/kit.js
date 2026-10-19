/* Cognitive Learning Flow v0.6 — host-independent resource kit.
 * Depends on runtime/core.js. Only exposes globalThis.CLFKit; no global stylesheet.
 */
(function(root) {
  'use strict';
  const TYPES=['notebook','calculator','diagram','controls','steps','transcript','guided','assessment','status','reasoning','formula','data','visualization','simulation','sensitivity'];
  const STYLE=`:host{display:block;--clf-ink:#15243b;--clf-surface:#fff;--clf-line:#dde5ef;--clf-accent:#245ecc;--clf-muted:#586a81;--clf-paper:#fbfdfb;color:var(--clf-ink);font:inherit;line-height:1.5}*{box-sizing:border-box}.frame{border:1px solid var(--clf-line);border-radius:14px;background:var(--clf-surface);padding:14px;min-width:0}.head{font-size:.83em;letter-spacing:.07em;text-transform:uppercase;color:var(--clf-muted);font-weight:700;margin:0 0 9px}.muted{color:var(--clf-muted)}.paper{min-height:160px;max-height:380px;overflow:auto;background:var(--clf-paper);border-radius:9px;padding:15px 13px 15px 24px;background-image:repeating-linear-gradient(transparent 0 30px,#dae4ef 31px,transparent 32px);white-space:pre-wrap;overflow-wrap:anywhere;font:500 15px/32px ui-monospace,SFMono-Regular,Consolas,monospace}.line{min-height:32px}.display{background:#12213a;color:#f0f7ff;padding:13px 16px;text-align:right;border-radius:9px;font:600 1.3rem ui-monospace,monospace;min-height:58px;overflow-wrap:anywhere}.keypad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.keypad button{min-width:0}.actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}button,select,input{font:inherit;min-height:44px;max-width:100%;border-radius:9px;border:1px solid var(--clf-line);padding:8px 12px}button{cursor:pointer;background:var(--clf-surface);color:var(--clf-ink)}button:hover{border-color:var(--clf-accent)}button:disabled{opacity:.5;cursor:not-allowed}.primary{background:var(--clf-accent);color:white;border-color:var(--clf-accent)}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--clf-accent);outline-offset:2px}.active{box-shadow:inset 0 0 0 2px var(--clf-accent)}input{min-width:120px;max-width:100%;width:220px}.tag{color:var(--clf-muted);font-size:.87em}.graph{overflow:auto;max-width:100%}.graph svg{display:block;max-width:none;height:auto}.graph p{color:var(--clf-muted)}.quiz fieldset{margin:0 0 16px;border:1px solid var(--clf-line);border-radius:10px;padding:12px;min-width:0}.quiz legend{font-weight:700}.choice{display:flex;gap:10px;align-items:center;margin:9px 0;cursor:pointer}.choice input{width:auto;min-width:0;min-height:0}.feedback{margin:10px 0;white-space:pre-wrap}.error{color:#a62c42}.okay{color:#14704a}progress{display:block;width:100%;height:10px;margin:10px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}details{margin-top:10px}h3{font-size:1.15rem;margin:0 0 8px}.notice{margin:0 0 12px}.timeline{display:flex;flex-wrap:wrap;gap:8px;align-items:center}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
/* CLF Motion Language v0.4 — semantic cues, not ambient decorations. */
:host{--clf-ink:#e9f3ff;--clf-surface:#101d31;--clf-line:#2a415f;--clf-accent:#66e4d3;--clf-muted:#9fb4cd;--clf-paper:#16263b;--clf-faint:#192c45;--clf-emphasis:#f8c67e;color:var(--clf-ink);font-family:ui-sans-serif,system-ui,sans-serif}
.frame{position:relative;overflow:hidden;background:linear-gradient(155deg,var(--clf-surface),#0b192c);border:1px solid var(--clf-line);border-radius:19px;box-shadow:0 13px 37px #0002;padding:17px;isolation:isolate}
.frame:before{content:'';position:absolute;top:0;left:16px;right:16px;height:1px;background:linear-gradient(90deg,transparent,var(--clf-accent),transparent);opacity:.3;pointer-events:none}
.head{font-size:.7em;letter-spacing:.17em;color:var(--clf-accent)}.frame h3{letter-spacing:-.02em;font-size:1.07em}.muted,.tag{color:var(--clf-muted)}
button,select,input{background:#1c2d44;border:1px solid #3c536e;color:var(--clf-ink);border-radius:11px}button:hover{background:#273b55;border-color:var(--clf-accent)}.primary{background:#236866;border-color:#5ce2ce;color:#e8fff9}.primary:hover{background:#317b76}
.paper{background-color:#15253a;background-image:linear-gradient(90deg,transparent 0 34px,#3e667f55 35px,transparent 36px),repeating-linear-gradient(transparent 0 31px,#37516d66 32px,transparent 33px);color:#eef6ff;padding-left:45px;border:1px solid #37516d}
.line{line-height:33px}.line:last-child{color:#fff}.display{background:#050f1b;color:#c9ffde;border:1px solid #315d5d;box-shadow:inset 0 1px 12px #0008;font-size:clamp(1.1rem,2.2vw,1.55rem)}.keypad button{background:#1e3049}.keypad button.active{color:#092c2c;background:#86efdc;box-shadow:0 0 0 3px #86efdc55,0 0 28px #61f5d688}
.graph{border-radius:14px;background:radial-gradient(circle at 50% 10%,#1a3455,#0c1c30);border:1px solid #2b4a6a;padding:11px}.graph svg{filter:drop-shadow(0 3px 8px #0005)}
.clf-reason{display:grid;gap:12px}.clf-beat{display:flex;align-items:center;justify-content:space-between;gap:8px}.clf-chip{padding:5px 9px;border-radius:30px;background:#244e53;border:1px solid #377879;color:#a5fff2;font-size:.73rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.clf-kind{color:var(--clf-emphasis);font-size:.8rem;font-weight:700}.clf-goal{font-size:clamp(1.05rem,2.4vw,1.3rem);font-weight:800;letter-spacing:-.035em;line-height:1.3}.clf-explain{font-size:.94rem;line-height:1.7;color:var(--clf-muted)}.clf-action{padding:13px;border-radius:12px;background:var(--clf-faint);border-left:3px solid var(--clf-accent);font:500 .92rem/1.6 ui-monospace,monospace;overflow-wrap:anywhere}
.clf-progress{height:5px;border-radius:8px;background:#2b4761;overflow:hidden}.clf-progress>i{display:block;height:100%;background:linear-gradient(90deg,#4bc9d4,#8dffce);border-radius:8px;transition:width .19s linear}
.clf-formula{font:600 clamp(1rem,2.4vw,1.4rem)/1.6 ui-monospace,monospace;overflow-wrap:anywhere;padding:15px;color:#b3f7e3;border-radius:14px;background:#061727;border:1px solid #36576a}.clf-formula strong{color:#f5c37d}.clf-result{font-size:1.8rem;font-weight:900;color:#9dffcf;letter-spacing:-.045em}.clf-data-list{display:flex;flex-wrap:wrap;gap:8px}.clf-data-pill{display:flex;flex-direction:column;min-width:70px;padding:9px 12px;background:#1c304b;border:1px solid #365470;border-radius:11px;color:#b4cce3;gap:2px;transition:border-color .22s,background .22s,box-shadow .22s,transform .22s}.clf-data-pill b{font-size:1rem;color:#f2f9ff}.clf-data-pill.is-focused{background:#185c5b;border-color:#8cf6dc;box-shadow:0 0 0 2px #66e4d333,0 0 19px #3bd6bf33;transform:translateY(-2px)}
.clf-phasebar{display:flex;gap:3px;margin:8px 0 14px}.clf-phasebar span{height:5px;flex:1;background:#30465e;border-radius:8px}.clf-phasebar span.is-current{background:#76ebd3;box-shadow:0 0 12px #76ebd399}.clf-phasebar span.is-past{background:#528e9f}
.clf-spotlight{animation:clf-beat .32s ease-out both}.clf-writing{animation:clf-ink .33s ease-out both}.clf-draw{stroke-dasharray:5 4;animation:clf-trace 1s linear infinite}.clf-link{transition:stroke .24s,stroke-width .24s}.clf-node{transition:stroke .26s,fill .26s}.clf-active-link{animation:clf-line-reveal .65s ease-out both}@keyframes clf-line-reveal{0%{stroke-opacity:.25;stroke-dasharray:1 25}100%{stroke-opacity:1;stroke-dasharray:1000 0}}.clf-focused{filter:drop-shadow(0 0 7px #4ff5cf88)}
@keyframes clf-beat{0%{opacity:.25;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}@keyframes clf-ink{from{opacity:.55;filter:blur(1.5px)}to{opacity:1;filter:blur(0)}}@keyframes clf-trace{to{stroke-dashoffset:-18}}
.clf-viz{min-width:0}.clf-viz h3{margin:0 0 12px;font-size:1rem}.clf-viz-scroll{max-width:100%;overflow:auto;border:1px solid #304b64;background:linear-gradient(160deg,#142840,#091929);border-radius:14px;padding:10px}.clf-viz-scroll svg{display:block;max-width:none;height:auto}.clf-viz-focus{filter:drop-shadow(0 0 9px #63edce88);animation:clf-viz-in .38s ease-out both}.clf-viz-enter{animation:clf-viz-in .35s ease-out both}.clf-viz-path{stroke-dasharray:1500;stroke-dashoffset:0;animation:clf-viz-draw 1.05s ease-out both}.clf-process{display:flex;align-items:stretch;gap:10px;overflow-x:auto;padding:6px 2px 14px}.clf-process-step{flex:1;min-width:114px;padding:12px;background:#203653;border:1px solid #3a5878;border-radius:13px;display:flex;flex-direction:column;gap:5px;position:relative;animation:clf-viz-in .38s ease-out both}.clf-process-step:not(:last-child):after{content:'→';position:absolute;right:-12px;top:33%;z-index:1;color:#9abdd5}.clf-process-step.is-focused{background:#195b57;border-color:#70edcf;box-shadow:0 0 0 1px #70edcf66}.clf-process-step strong{font-size:.86rem}.clf-viz details{margin-top:10px;color:var(--clf-muted)}.clf-viz ul{font-size:.8rem}.clf-viz summary{cursor:pointer}@keyframes clf-viz-in{from{opacity:.2;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes clf-viz-draw{from{stroke-dashoffset:1500}to{stroke-dashoffset:0}}
@media(prefers-reduced-motion:reduce){.clf-viz-focus,.clf-viz-enter,.clf-viz-path,.clf-process-step{animation:none!important}.clf-spotlight,.clf-writing,.clf-draw{animation:none!important}.clf-data-pill,.clf-progress i,.clf-node,.clf-link{transition:none!important}}
/* CLF v0.6: deterministic interactive operations lab */
.clf-sim-toolbar{display:flex;align-items:center;justify-content:space-between;gap:9px;flex-wrap:wrap;margin:7px 0 15px}.clf-sim-toolbar select{flex:1;min-width:0}
.clf-sim-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:12px;padding:12px 0}
.clf-sim-control{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;font-size:.86rem;color:var(--clf-muted)}
.clf-sim-control b{color:var(--clf-emphasis)}.clf-sim-control input{grid-column:1/-1;width:100%;min-width:0;accent-color:var(--clf-accent)}
.clf-sim-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:9px;margin:12px 0}
.clf-sim-metric{background:#18334a;border:1px solid #33576f;border-radius:12px;padding:10px 12px;display:grid;gap:4px}
.clf-sim-metric span{color:var(--clf-muted);font-size:.77em}.clf-sim-metric strong{color:#afffe2;font-size:clamp(1.1rem,2vw,1.4rem);overflow-wrap:anywhere}
.clf-sim-insight{border-left:3px solid #f4c77e;background:#18283f;border-radius:8px;padding:12px;line-height:1.6;color:#dceafb}
.clf-sim-viz{background:linear-gradient(180deg,#12273e,#0e1b2f);border-radius:14px;padding:12px;margin-top:10px;border:1px solid #2d4c67}
.clf-sim-scroll{width:100%;max-width:100%;overflow-x:auto}.clf-sim-scroll svg{min-width:530px;width:100%;height:auto;display:block}
@media(max-width:440px){.clf-sim-toolbar select{width:100%;flex-basis:100%}.clf-sim-controls{grid-template-columns:minmax(0,1fr)}.clf-sim-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
  /* Domain-agnostic renderer registry: consumers can register additional chart kinds. */
  const renderers=new Map();
  function registerVisualization(kind,render){
    if(!/^[a-z][a-z0-9-]{1,40}$/.test(kind)||typeof render!=='function')throw new TypeError('Renderer inválido');
    if(['bar','line','process'].includes(kind))throw new Error('El renderer integrado no se reemplaza');
    renderers.set(kind,render);
    return ()=>{if(renderers.get(kind)===render)renderers.delete(kind);};
  }
  const svgNS='http://www.w3.org/2000/svg';
  const E=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
  const S=(tag,attrs)=>{const e=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));return e;};
  const KEYS=['7','8','9','÷','4','5','6','×','1','2','3','−','C','0','.','+','(',')','=','⌫'];
  function create(lesson, options={}) {
    const core=root.CLFCore,sim=root.CLFSim;
    if((lesson.simulations||[]).length&&!sim)throw new Error('Carga CLFSim antes de CLFKit para esta lección');
    if(!core)throw new Error('Carga CLFCore antes de CLFKit');
    if(!lesson || !Array.isArray(lesson.scenes)||!lesson.scenes.length)throw new Error('Lección sin escenas');
    const compiled=core.compile(lesson), mounts=new Map(), listeners=new Set(), cueListeners=new Set();
    let previousCue=null;
    const available=new Set(TYPES);let timer=null,destroyed=false;
    let selectedScenario=null,scenarioOverrides={};
    let mode=['demo','guided','assessment'].includes(options.mode)?options.mode:'demo';
    let cursor=0,playing=false,speed=1,guideIndex=0,guideSolved=false,guideHint=false,guideHintLevel=0,attempts=0,guideMessage='',guideDraft='',manual='',examAnswers={},submitted=false;
    const workflowListeners=new Set();
    const reduced=typeof root.matchMedia==='function'&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function assertLive(){if(destroyed)throw new Error('Instancia destruida');}
    function stopTimer(){playing=false;if(timer!==null){clearTimeout(timer);timer=null;}}
    function index(){const current=core.snapshot(lesson,compiled,cursor);return current.sceneIndex;}
    function sceneEnd(n){return compiled.ends[Math.max(0,Math.min(compiled.ends.length-1,n))];}
    function view(){
      const demo=core.snapshot(lesson,compiled,cursor);
      const guided=guideSolved?core.snapshot(lesson,compiled,sceneEnd(guideIndex)):{lines:[],calculator:manual||'0',lastKey:'',highlights:[],diagram:true,visualization:null};
      const blank={lines:[],calculator:'0',lastKey:'',highlights:[],diagram:false,visualization:null};
      return mode==='demo'?demo:mode==='guided'?guided:blank;
    }
    function scenarioView(){
      if(!sim||mode==='assessment'||(mode==='guided'&&!guideSolved))return null;
      const snap=view();const specs=lesson.simulations||[];
      const id=selectedScenario || snap.simulation?.id || specs[0]?.id;
      const spec=specs.find(x=>x.id===id);
      if(!spec)return null;
      const parameters=scenarioOverrides[id]||{};
      const result=sim.solve(spec,parameters);
      return {id,kind:spec.kind,title:spec.title,parameters:{...spec.parameters,...parameters},result,progress:mode==='demo'&&snap.simulation?.id===id?snap.simulation.progress:1};
    }
    function selectScenario(id){
      assertLive();if(mode==='assessment')return false;
      if(!(lesson.simulations||[]).some(x=>x.id===id))throw new Error('Escenario no encontrado: '+id);
      selectedScenario=id;emit();return true;
    }
    function setScenarioParameter(key,value){
      assertLive();if(mode==='assessment'||(mode==='guided'&&!guideSolved))return false;
      const view=scenarioView();if(!view)return false;
      const spec=lesson.simulations.find(x=>x.id===view.id);
      const control=spec.controls?.find(x=>x.key===key);
      if(!control)throw new Error('Parámetro no controlable: '+key);
      const v=Number(value);
      if(!Number.isFinite(v)||v<control.min||v>control.max)throw new RangeError('Valor fuera del rango permitido');
      const next={...(scenarioOverrides[view.id]||{}),[key]:v};
      sim.solve(spec,next); // Validar antes de modificar el estado.
      scenarioOverrides[view.id]=next;emit();return true;
    }
    function resetScenario(){assertLive();if(mode==='assessment')return;const current=scenarioView();if(current)delete scenarioOverrides[current.id];emit();}
    function state(){return Object.freeze({simulation:mode==='assessment'?null:scenarioView(),cue:mode==='demo'?core.choreography(lesson,compiled,cursor):mode==='guided'&&guideSolved?core.choreography(lesson,compiled,sceneEnd(guideIndex)):null,mode,cursor,playing,speed,sceneIndex:mode==='demo'?index():guideIndex,totalScenes:lesson.scenes.length,guideSolved,guideHint,guideHintLevel,attempts,submitted,examAnswers:{...examAnswers},snapshot:view()});}
    function emit(){if(destroyed)return;
      const current=state();
      for(const fn of listeners){try{fn(current);}catch(error){console.error('CLFKit listener:',error);}}
      const id=current.cue?.id||null;
      if(id!==previousCue){previousCue=id;
        if(current.cue)for(const fn of cueListeners){try{fn(current.cue,current);}catch(error){console.error('CLFKit cue listener:',error);}}
      }
      for(const item of mounts.values())render(item,current);
    }
    function onChange(fn){assertLive();if(typeof fn!=='function')throw new TypeError('Listener no válido');listeners.add(fn);return ()=>listeners.delete(fn);}
    function onCue(fn){assertLive();if(typeof fn!=='function')throw new TypeError('Listener no válido');cueListeners.add(fn);return ()=>cueListeners.delete(fn);}
    // Seek to a semantic action without moving or controlling any host layout.
    function seekAction(sceneId, actionIndex, stage='start'){
      assertLive();const si=lesson.scenes.findIndex(s=>s.id===sceneId);
      if(si<0||!Number.isInteger(actionIndex)||actionIndex<0||actionIndex>=lesson.scenes[si].actions.length)throw new Error('Acción CLF desconocida');
      if(!['start','end'].includes(stage))throw new Error('Posición desconocida');
      const start=compiled.events.findIndex(e=>e.type==='cue'&&e.si===si&&e.ai===actionIndex);
      if(start<0)throw new Error('Cue sin compilar');
      const end=compiled.events.findIndex((e,i)=>i>start&&(e.type==='cue'||e.type==='scene'));
      seek(stage==='start'?start+1:end>=0?end:compiled.events.length);
    }
    function pause(){assertLive();stopTimer();emit();}
    function tick(){if(!playing||destroyed)return;if(cursor>=compiled.events.length){stopTimer();emit();return;}cursor++;const event=compiled.events[cursor-1];if(event.type==='simulationFrame'&&event.frame===0)selectedScenario=null;emit();const delay=reduced?1:event.type==='glyph'?48:170;timer=setTimeout(tick,Math.max(1,delay/speed));}
    function play(){assertLive();if(mode!=='demo')return;if(cursor>=compiled.events.length)cursor=0;stopTimer();playing=true;emit();tick();}
    function seek(to){assertLive();stopTimer();selectedScenario=null;cursor=Math.max(0,Math.min(compiled.events.length,Math.trunc(to)||0));emit();}
    function seekScene(to){const n=Math.max(0,Math.min(lesson.scenes.length-1,Math.trunc(to)||0));seek(sceneEnd(n));}
    function seekSceneId(id){assertLive();const n=lesson.scenes.findIndex(s=>s.id===id);if(n===-1)throw new Error('Etapa no reconocida: '+id);seekScene(n);}
    function connectWorkflow({target=typeof document!=='undefined'?document:null,eventName='workflow:step',resolve}={}){
      assertLive();if(!target||typeof target.addEventListener!=='function')throw new Error('Destino de eventos inválido');
      if(typeof eventName!=='string'||!eventName.trim())throw new Error('Nombre de evento inválido');
      const listener=(event)=>{
        if(destroyed||mode!=='demo')return;
        const detail=event.detail||{};
        const step=typeof resolve==='function'?resolve(detail):detail.sceneId??detail.sceneIndex;
        if(typeof step==='string'){
          const index=lesson.scenes.findIndex(s=>s.id===step);
          if(index>=0)seekScene(index);
        } else if(Number.isInteger(step)&&step>=0&&step<lesson.scenes.length)seekScene(step);
      };
      target.addEventListener(eventName,listener);
      const detach=()=>{target.removeEventListener(eventName,listener);workflowListeners.delete(detach);};
      workflowListeners.add(detach);return detach;
    }
    function next(){assertLive();if(mode==='demo')seekScene(Math.min(index()+1,lesson.scenes.length-1));else if(mode==='guided'&&guideSolved){if(guideIndex<lesson.scenes.length-1){guideIndex++;guideSolved=false;guideHint=false;guideHintLevel=0;guideMessage='';attempts=0;guideDraft='';manual='';emit();}else setMode('assessment');}}
    function previous(){assertLive();if(mode==='demo')seek(index()<=0?0:sceneEnd(index()-1));else if(mode==='guided'){guideIndex=Math.max(0,guideIndex-1);guideSolved=false;guideHint=false;guideHintLevel=0;guideMessage='';attempts=0;guideDraft='';manual='';emit();}}
    function setSpeed(value){assertLive();if(![.5,1,1.5,2].includes(Number(value)))throw new RangeError('Velocidad no admitida');speed=Number(value);emit();}
    function setMode(value){assertLive();if(!['demo','guided','assessment'].includes(value))throw new Error('Modo desconocido');stopTimer();mode=value;cursor=0;guideIndex=0;guideSolved=false;guideHint=false;guideHintLevel=0;attempts=0;guideMessage='';guideDraft='';manual='';submitted=false;examAnswers={};selectedScenario=null;scenarioOverrides={};emit();}
    function restart(){setMode(mode);}
    function answer(value){assertLive();if(mode!=='guided'||guideSolved)return false;const cp=lesson.scenes[guideIndex].checkpoint;if(!cp)return false;const ok=typeof cp.answer==='number'?core.checkNumeric(value,cp.answer,cp.tolerance):String(value).trim().toLowerCase()===String(cp.answer).trim().toLowerCase();attempts++;if(ok){guideSolved=true;guideMessage=cp.feedback||'Respuesta correcta';}else {const misconception=(cp.misconceptions||[]).find(item=>typeof item.value==='number'?core.checkNumeric(value,item.value,cp.tolerance||0.001):String(value).trim().toLowerCase()===String(item.value).trim().toLowerCase());guideMessage=misconception?.feedback||'Todavía no coincide; revisa las unidades y el procedimiento.';}emit();return ok;}
    function hint(){assertLive();if(mode!=='guided'||guideSolved)return;guideHint=true;const cp=lesson.scenes[guideIndex].checkpoint;guideHintLevel=Math.min(guideHintLevel+1,Math.max(1,cp?.hints?.length||0));emit();}
    function reveal(){assertLive();if(mode!=='guided'||guideSolved)return;if(lesson.scenes[guideIndex].checkpoint)return;guideSolved=true;guideMessage=lesson.scenes[guideIndex].rationale;emit();}
    function manualKey(key){assertLive();if(mode!=='guided'||guideSolved)return;if(key==='C')manual='';else if(key==='⌫')manual=manual.slice(0,-1);else if(key==='='){try{manual=core.format(core.calculate(manual));}catch{manual='Error';}}else if(manual.length<64&&KEYS.includes(key))manual+=key;emit();}
    function selectAnswer(id,option){assertLive();if(mode!=='assessment'||submitted)return;const item=lesson.assessment.items.find(q=>q.id===id);if(!item||!item.options.some(o=>o.id===option))return;examAnswers[id]=option;emit();}
    function submit(){assertLive();if(mode!=='assessment'||submitted)return null;submitted=true;let correct=0;for(const item of lesson.assessment.items)if(examAnswers[item.id]===item.correctOptionId)correct++;emit();return {correct,total:lesson.assessment.items.length};}
    function mount(type,host){assertLive();if(!available.has(type))throw new Error('Recurso CLF desconocido: '+type);if(typeof host==='string')host=document.querySelector(host);if(!host || !host.appendChild)throw new Error('Contenedor destino inexistente');const wrapper=E('div');wrapper.dataset.clfResource=type;const shadow=wrapper.attachShadow({mode:'open'});const style=E('style',STYLE);const body=E('section');shadow.append(style,body);host.append(wrapper);const item={type,host,wrapper,shadow,body};mounts.set(wrapper,item);render(item);return ()=>unmount(wrapper);}
    function unmount(wrapper){const item=mounts.get(wrapper);if(item){item.wrapper.remove();mounts.delete(wrapper);}}
    function destroy(){if(destroyed)return;stopTimer();for(const detach of [...workflowListeners])detach();for(const item of [...mounts.values()])unmount(item.wrapper);listeners.clear();cueListeners.clear();destroyed=true;}
    function buildGraph(highlights,allowed){
      const box=E('div',undefined,'graph');const data=lesson.problem.activities;
      if(!allowed||!Array.isArray(data)||!data.length){box.append(E('p','Este procedimiento no requiere red de precedencias.'));return box;}
      const depth=new Map(),seen=new Set();let loops=0;
      while(seen.size<data.length&&loops++<data.length+1){for(const a of data)if(!seen.has(a.id)&&a.predecessors.every(id=>seen.has(id))){depth.set(a.id,a.predecessors.length?Math.max(...a.predecessors.map(id=>depth.get(id)))+1:0);seen.add(a.id);}}
      if(seen.size!==data.length){box.textContent='Red inválida';return box;}
      const layers=new Map();for(const a of data){const d=depth.get(a.id);if(!layers.has(d))layers.set(d,[]);layers.get(d).push(a.id);}
      const width=(Math.max(...layers.keys())+1)*152+80,height=Math.max(235,Math.max(...[...layers.values()].map(x=>x.length))*90+65);
      const pos=new Map();for(const [d,ids] of layers)ids.forEach((id,i)=>pos.set(id,{x:48+d*152,y:height/2+(i-(ids.length-1)/2)*90}));
      const svg=S('svg',{viewBox:`0 0 ${width} ${height}`,width,height,role:'img','aria-label':'Red de precedencias de actividades'});
      const active=new Set(highlights);for(const a of data)for(const p of a.predecessors){const from=pos.get(p),to=pos.get(a.id);svg.append(S('path',{d:`M${from.x+29} ${from.y} C${from.x+77} ${from.y},${to.x-77} ${to.y},${to.x-29} ${to.y}`,stroke:active.has(p)&&active.has(a.id)?'#86ffe0':'#708aaa','stroke-width':active.has(p)&&active.has(a.id)?3:1.8,'class':active.has(p)&&active.has(a.id)?'clf-active-link':'clf-link',fill:'none'}));}
      for(const a of data){const p=pos.get(a.id),selected=active.has(a.id);svg.append(S('rect',{x:p.x-29,y:p.y-25,width:58,height:50,rx:9,fill:selected?'#1b6965':'#1d304a',stroke:selected?'#8dffdc':'#6685a2','stroke-width':2}));const t=S('text',{x:p.x,y:p.y-4,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#eaf5ff'});t.textContent=a.id;svg.append(t);const s=S('text',{x:p.x,y:p.y+14,'text-anchor':'middle','font-size':10,fill:'#a9c6df'});s.textContent=mode==='guided'&&!guideSolved?'a/m/b':core.format((a.optimistic+4*a.mostLikely+a.pessimistic)/6)+' d';svg.append(s);}
      box.append(svg);return box;
    }
    function buildVisualization(current, allowed){
      const wrap=E('div',undefined,'clf-viz');
      if(!allowed || !current){wrap.append(E('p',allowed?'La representación se mostrará en la etapa indicada.':'Visualización oculta durante la evaluación.','muted'));return wrap;}
      const spec=(lesson.visualizations||[]).find(v=>v.id===current.id);
      if(!spec){wrap.append(E('p','Visualización no encontrada.','muted'));return wrap;}
      wrap.append(E('h3',spec.title));
      const points=(spec.points||[]).slice(0,current.reveal);
      if(spec.kind==='process'){
        const row=E('div',undefined,'clf-process');
        for(const [i,p] of points.entries()){
          const item=E('div',undefined,'clf-process-step'+(current.focus.includes(p.id)?' is-focused':''));
          item.append(E('span',String(i+1).padStart(2,'0'),'tag'),E('strong',p.label));
          if(p.detail)item.append(E('small',p.detail,'muted'));
          row.append(item);
        }
        wrap.append(row);
      }else if(spec.kind==='bar'||spec.kind==='line'){
        const w=Math.max(480,points.length*83+100),h=276;
        const svg=S('svg',{viewBox:`0 0 ${w} ${h}`,width:w,height:h,role:'img','aria-label':spec.title});
        const title=S('title');title.textContent=spec.title;svg.append(title);
        const desc=S('desc');desc.textContent=points.map(p=>`${p.label}: ${p.value} ${spec.unit||''}`).join('; ');svg.append(desc);
        const left=53,right=w-25,top=28,bottom=h-56;
        const values=points.map(p=>p.value);
        const low=values.length?Math.min(0,...values):0,high=values.length?Math.max(0,...values):1;
        const max=low===high?high+1:high,min=low===high?low-1:low;
        const y=v=>top+(max-v)/(max-min)*(bottom-top);
        for(let i=0;i<=4;i++){
          const value=min+(max-min)*i/4,Y=y(value);
          svg.append(S('line',{x1:left,x2:right,y1:Y,y2:Y,stroke:'#34526c','stroke-width':1,'stroke-dasharray':'3 6'}));
          const label=S('text',{x:left-9,y:Y+4,'text-anchor':'end','font-size':11,fill:'#aac7df'});
          label.textContent=Number(value.toFixed(1)).toString();svg.append(label);
        }
        const zero=y(0);
        const coordinates=[];
        points.forEach((p,i)=>{
          const x=left+(i+.5)*(right-left)/Math.max(1,points.length),selected=current.focus.includes(p.id);
          coordinates.push([x,y(p.value)]);
          if(spec.kind==='bar'){
            const width=Math.min(49,(right-left)/Math.max(1,points.length)*.68);
            svg.append(S('rect',{x:x-width/2,y:Math.min(zero,y(p.value)),width,height:Math.max(1,Math.abs(zero-y(p.value))),rx:5,fill:selected?'#78edc8':'#428cbd',class:selected?'clf-viz-focus':'clf-viz-enter'}));
          }
          const txt=S('text',{x,y:bottom+21,'text-anchor':'middle','font-size':12,fill:selected?'#a8ffe7':'#c1d4e9','font-weight':selected?800:500});txt.textContent=p.label;svg.append(txt);
          if(selected||spec.kind==='bar'){
            const value=S('text',{x,y:Math.max(14,Math.min(zero,y(p.value))-8),'text-anchor':'middle','font-size':11,fill:selected?'#b9ffe5':'#bcd3e9'});
            value.textContent=String(p.value);svg.append(value);
          }
        });
        if(spec.kind==='line'&&coordinates.length){
          const poly=S('polyline',{points:coordinates.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#68d8d4','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',class:'clf-viz-path'});
          svg.append(poly);
          coordinates.forEach(([x,Y],i)=>svg.append(S('circle',{cx:x,cy:Y,r:current.focus.includes(points[i].id)?7:4.5,fill:current.focus.includes(points[i].id)?'#e6ffa8':'#68d8d4',stroke:'#10233a','stroke-width':2,class:'clf-viz-enter'})));
        }
        const area=E('div',undefined,'clf-viz-scroll');area.append(svg);wrap.append(area);
      }else if(renderers.has(spec.kind)){
        // Deliberate extension point: custom code belongs to the consuming app.
        const panel=E('div',undefined,'clf-viz-scroll');
        renderers.get(spec.kind)({spec,points,current,host:panel,dom:{createElement:E,createSVG:S}});
        wrap.append(panel);
      }else wrap.append(E('p','No hay renderer para '+spec.kind+'. Regístralo con CLFKit.registerVisualization.','muted'));
      if(spec.unit)wrap.append(E('small','Unidad: '+spec.unit,'tag'));
      if(spec.note)wrap.append(E('p',spec.note,'muted'));
      const accessible=E('details'),sum=E('summary','Leer datos de esta visualización');accessible.append(sum);
      const list=E('ul');for(const p of points)list.append(E('li',`${p.label}: ${p.value??p.detail??''}`));
      accessible.append(list);wrap.append(accessible);
      return wrap;
    }
    function drawSimulation(current){
      const box=E('div',undefined,'clf-sim-viz'),{result,progress}=current;
      const w=780,h=260,svg=S('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-label':'Simulación '+current.title});
      const headline=S('title');headline.textContent=current.title;svg.append(headline);
      const desc=S('desc');desc.textContent=result.insight;svg.append(desc);
      const border=S('line',{x1:40,y1:218,x2:742,y2:218,stroke:'#54738d','stroke-width':2});svg.append(border);
      if(current.kind==='inventory-eoq'){
        const series=result.series;const max=Math.max(...series.map(x=>x.stock),1);
        const shown=series.slice(0,Math.max(1,Math.round((series.length-1)*progress)+1));
        const d=shown.map((p,i)=>`${i?'L':'M'}${40+702*(p.t/series.at(-1).t)} ${207-157*p.stock/max}`).join(' ');
        svg.append(S('path',{d,fill:'none',stroke:'#7ef5d3','stroke-width':4,'stroke-linecap':'round'}));
        const tip=shown.at(-1);svg.append(S('circle',{cx:40+702*(tip.t/series.at(-1).t),cy:207-157*tip.stock/max,r:7,fill:'#ffd48d'}));
        box.append(E('p','Trayectoria de existencias: consumo a tasa constante, reposición instantánea.','tag'));
      }else if(current.kind==='queue-mm1'){
        const ev=result.events,end=ev.at(-1).finish;
        const shown=ev.slice(0,Math.max(1,Math.round(ev.length*progress)));
        shown.forEach((e,i)=>{
          const y=34+i*8;const x=40+690*e.start/end;
          svg.append(S('line',{x1:40+690*e.arrival/end,x2:x,y1:y,y2:y,stroke:'#ffc078','stroke-width':5}));
          svg.append(S('line',{x1:x,x2:40+690*e.finish/end,y1:y,y2:y,stroke:'#7de6d3','stroke-width':5}));
        });
        box.append(E('p','Cada línea representa una llegada (ámbar: espera; verde: servicio). Datos de una muestra reproducible.','tag'));
      }else if(current.kind==='production-line'){
        const jobs=result.jobs,end=result.metrics.makespan;
        const shown=jobs.slice(0,Math.max(1,Math.round(jobs.length*progress)));
        const cycles=current.parameters.stationCycles;
        const rowHeight=Math.min(45,150/cycles.length);
        shown.forEach((job,i)=>job.stations.forEach(t=>{
          const y=35+(t.station-1)*rowHeight+(i%2)*3;
          svg.append(S('rect',{x:40+690*t.start/end,y,width:Math.max(2,690*(t.end-t.start)/end),height:rowHeight/2,rx:3,fill:(t.station===result.metrics.bottleneckStation)?'#ffd08c':'#6de0d5',opacity:0.8}));
        }));
        cycles.forEach((v,i)=>{const text=S('text',{x:42,y:29+i*rowHeight,'font-size':12,fill:'#b9d2e8'});text.textContent='E'+(i+1)+': '+v+' min';svg.append(text);});
        box.append(E('p','Gantt de piezas y estaciones: ámbar identifica el cuello de botella. Incluye arranque y vaciado.','tag'));
      }
      const scroll=E('div',undefined,'clf-sim-scroll');scroll.append(svg);box.append(scroll);
      const pct=E('div',`Progreso visual: ${Math.round(progress*100)}%`,'tag');box.append(pct);
      return box;
    }
    function drawSensitivity(model,selected){
      const outer=E('div',undefined,'clf-sim-viz');
      const pts=model.points.filter(p=>Number.isFinite(p.y));
      if(pts.length<2){outer.append(E('p','No hay suficientes resultados estables en el rango seleccionado.','muted'));return outer;}
      const w=780,h=250,left=55,right=738,top=24,bottom=205;
      const lo=Math.min(...pts.map(p=>p.y)),hi=Math.max(...pts.map(p=>p.y));
      const minY=lo===hi?lo-1:lo,maxY=lo===hi?hi+1:hi;
      const minX=model.points[0].x,maxX=model.points.at(-1).x;
      const X=x=>left+(right-left)*(x-minX)/(maxX-minX);
      const Y=y=>top+(bottom-top)*(maxY-y)/(maxY-minY);
      const svg=S('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-label':'Sensibilidad: '+model.label});
      const title=S('title');title.textContent=model.label;svg.append(title);
      for(let i=0;i<=4;i++){const y=top+(bottom-top)*i/4;svg.append(S('line',{x1:left,x2:right,y1:y,y2:y,stroke:'#3e596e','stroke-dasharray':'4 6'}));}
      // Leave a gap at unstable values: do not connect across invalid parameter regimes.
      let path='';let open=false;
      for(const p of model.points){if(!Number.isFinite(p.y)){open=false;continue;}path+=(open?'L':'M')+X(p.x).toFixed(1)+' '+Y(p.y).toFixed(1)+' ';open=true;}
      svg.append(S('path',{d:path,stroke:'#7becd0','stroke-width':3,fill:'none','stroke-linecap':'round'}));
      svg.append(S('line',{x1:X(Math.max(minX,Math.min(maxX,selected))),x2:X(Math.max(minX,Math.min(maxX,selected))),y1:top,y2:bottom,stroke:'#ffd18a','stroke-dasharray':'6 6','stroke-width':2}));
      const x0=S('text',{x:left,y:h-12,'font-size':12,fill:'#aac6dc'});x0.textContent=String(Number(minX.toFixed(2)));svg.append(x0);
      const x1=S('text',{x:right,y:h-12,'font-size':12,fill:'#aac6dc','text-anchor':'end'});x1.textContent=String(Number(maxX.toFixed(2)));svg.append(x1);
      const sc=E('div',undefined,'clf-sim-scroll');sc.append(svg);outer.append(sc);
      outer.append(E('p',`${model.label} · parámetro: ${model.parameter} · línea ámbar = selección actual.`,'tag'));
      return outer;
    }
    function render(item,frame){
      const {type,body}=item;
      const st=frame||state(),snap=st.snapshot,cue=st.cue;
      // Avoid recreating expensive SVG/quiz/paper DOM on every written character.
      // One shared cursor still drives all resources, while each widget redraws only when its own data changes.
      let signature='';
      if(type==='notebook')signature=mode+'|'+snap.lines.map(l=>l.text).join('\n');
      else if(type==='calculator')signature=mode+'|'+snap.calculator+'|'+snap.lastKey+'|'+guideSolved;
      else if(type==='diagram')signature=mode+'|'+String(snap.diagram)+'|'+JSON.stringify(cue?.targets?.length?cue.targets:snap.highlights)+'|'+guideSolved;
      else if(type==='steps'||type==='transcript')signature=mode+'|'+st.sceneIndex+'|'+guideSolved;
      else if(type==='guided')signature=mode+'|'+guideIndex+'|'+guideSolved+'|'+guideHint+'|'+guideHintLevel+'|'+attempts+'|'+guideMessage;
      else if(type==='assessment')signature=mode+'|'+submitted+'|'+JSON.stringify(examAnswers);
      else if(type==='data')signature=mode+'|'+JSON.stringify(cue?.targets||[]);
      else if(type==='formula')signature=mode+'|'+cue?.expression+'|'+snap.lastKey+'|'+snap.calculator;
      else if(type==='reasoning')signature=mode+'|'+cue?.id;
      else if(type==='visualization')signature=mode+'|'+JSON.stringify(snap.visualization)+'|'+guideSolved;
      else if(type==='simulation'||type==='sensitivity')signature=mode+'|'+JSON.stringify(st.simulation)+'|'+JSON.stringify(scenarioOverrides)+'|'+guideSolved;
      else signature=mode+'|'+cursor+'|'+playing+'|'+speed;
      if(item.lastSignature===signature){
        if(type==='reasoning'&&cue){const fill=body.querySelector('.clf-progress i');if(fill)fill.style.width=(cue.progress*100).toFixed(2)+'%';}
        return;
      }
      item.lastSignature=signature;body.replaceChildren();
      const fresh=!!cue&&item.lastCue!==cue.id;item.lastCue=cue?.id||null;const inExam=mode==='assessment';const f=E('div',undefined,'frame');const title=label=>f.append(E('p',label,'head'));if(fresh && ['reasoning','formula','data'].includes(type)) f.classList.add('clf-spotlight');
      const button=(label,fn,cls='',disabled=false)=>{const b=E('button',label,cls);b.type='button';b.disabled=disabled;b.addEventListener('click',fn);return b;};
      if(type==='notebook'){title('Cuaderno · escritura en curso');const paper=E('div',undefined,'paper');paper.setAttribute('aria-label','Anotaciones del procedimiento');for(const line of snap.lines)paper.append(E('div',line.text,'line'));if(!snap.lines.length)paper.append(E('div',inExam?'Cuaderno disponible después de la evaluación.':'Las anotaciones aparecerán aquí.','muted'));f.append(paper);}
      if(type==='calculator'){
        title('Calculadora');const display=E('div',snap.calculator||'0','display');display.setAttribute('role','status');f.append(display);
        if(mode==='demo'){const demoKeys=E('div',undefined,'keypad');for(const key of KEYS){const keyButton=E('button',key,key===snap.lastKey?'active':'');keyButton.type='button';keyButton.disabled=true;keyButton.setAttribute('aria-label','Tecla '+key);demoKeys.append(keyButton);}f.append(demoKeys);}
        if(mode==='demo'&&cue?.expression){f.append(E('p',cue.expression,'tag'));}if(mode==='guided'&&!guideSolved){const keys=E('div',undefined,'keypad');for(const key of KEYS)keys.append(button(key,()=>manualKey(key)));f.append(keys);}else if(mode==='demo'){const p=E('div','Operación sincronizada con la escena.','tag');f.append(p);}else f.append(E('p','Sin ayuda de calculadora durante la evaluación.','muted'));
      }
      if(type==='diagram'){title('Diagrama · conexiones vivas');f.append(buildGraph(cue?.targets?.length?cue.targets:snap.highlights,!inExam&&(mode==='guided'||snap.diagram)));}
      if(type==='visualization'){title('Representación · visualización sincronizada');f.append(buildVisualization(snap.visualization,!inExam));}
      if(type==='simulation'||type==='sensitivity'){
        title(type==='simulation'?'Simulador · sistema dinámico':'Sensibilidad · decisión cuantitativa');
        if(inExam){f.append(E('p','Las simulaciones y sus resultados se desbloquean después de la evaluación.','muted'));}
        else if(!st.simulation){f.append(E('p',mode==='guided'?'Resuelve este paso antes de explorar resultados.':'Esta lección no tiene simulaciones activas.','muted'));}
        else {
          const current=st.simulation,spec=(lesson.simulations||[]).find(s=>s.id===current.id);
          const picker=E('select');picker.setAttribute('aria-label','Elegir escenario de simulación');
          for(const scenario of lesson.simulations){const opt=E('option',scenario.title);opt.value=scenario.id;opt.selected=scenario.id===current.id;picker.append(opt);}
          picker.addEventListener('change',()=>selectScenario(picker.value));
          const toolbar=E('div',undefined,'clf-sim-toolbar');toolbar.append(picker,button('Restablecer',resetScenario));f.append(toolbar);
          const controls=E('div',undefined,'clf-sim-controls');
          for(const c of spec.controls||[]){
            const row=E('label',undefined,'clf-sim-control');const label=E('span',c.label);
            const val=E('b',core.format(current.parameters[c.key]));
            const range=E('input');range.type='range';range.min=c.min;range.max=c.max;range.step=c.step;range.value=current.parameters[c.key];range.setAttribute('aria-label',c.label);
            range.addEventListener('input',()=>{val.textContent=core.format(Number(range.value));});
            range.addEventListener('change',()=>setScenarioParameter(c.key,Number(range.value)));
            row.append(label,val,range);controls.append(row);
          }
          f.append(controls);
          if(type==='simulation'){
            const metrics=E('div',undefined,'clf-sim-metrics');
            const labels={'eoq':'EOQ (u)','annualRelevantCost':'Costo anual ($)','cycleDays':'Ciclo (días)','utilization':'Utilización ρ','expectedQueueWait':'Espera teórica (h)','observedQueueWait':'Muestra (h)','bottleneckStation':'Cuello de botella','theoreticalCapacityPerHour':'Capacidad ideal (u/h)','sampleThroughputPerHour':'Muestra (u/h)'};
            for(const [key,value] of Object.entries(current.result.metrics)){
              if(!labels[key])continue;const pill=E('div',undefined,'clf-sim-metric');
              pill.append(E('span',labels[key]),E('strong',value===null?'No estable':core.format(value)));metrics.append(pill);
            }
            f.append(metrics);
            f.append(E('p',current.result.insight,'clf-sim-insight'));
            f.append(drawSimulation(current));
          }else{
            const model=spec.sensitivity;
            if(!model)f.append(E('p','Este escenario aún no tiene una curva de sensibilidad configurada.','muted'));
            else{
              const points=sim.sensitivity(spec,model.parameter,model.min,model.max,31,scenarioOverrides[current.id]||{});
              const focus=current.parameters[model.parameter];
              f.append(E('p','Mueve el control y observa la respuesta del sistema. La curva solo altera una variable a la vez.','muted'));
              f.append(drawSensitivity(points,focus));
            }
          }
        }
      }
      if(type==='controls'){
        title('Controles');const modes=E('div',undefined,'actions');for(const [id,label] of [['demo','Demostración'],['guided','Guiada'],['assessment','Evaluación']])modes.append(button(label,()=>setMode(id),id===mode?'primary':''));f.append(modes);
        if(mode==='demo'){
          const actions=E('div',undefined,'timeline');actions.style.marginTop='10px';actions.append(button(playing?'Pausar':'Reproducir',()=>playing?pause():play(),'primary'),button('Anterior',previous),button('Siguiente',next),button('Reiniciar',restart));
          const sel=E('select');sel.setAttribute('aria-label','Velocidad de reproducción');for(const val of [.5,1,1.5,2]){const op=E('option',val+'×');op.value=val;op.selected=val===speed;sel.append(op);}sel.addEventListener('change',()=>setSpeed(sel.value));actions.append(sel);
          const jump=E('select');jump.setAttribute('aria-label','Seleccionar escena');for(let i=0;i<lesson.scenes.length;i++){const op=E('option',(i+1)+'. '+lesson.scenes[i].goal);op.value=i;op.selected=i===index();jump.append(op);}jump.addEventListener('change',()=>seekScene(jump.value));actions.append(jump);f.append(actions);
          const bar=E('progress');bar.max=compiled.events.length;bar.value=cursor;f.append(bar);f.append(E('span',Math.round(100*cursor/compiled.events.length)+'%','tag'));
        }
      }
      if(type==='reasoning'){
        title('Estrategia observable');const area=E('div',undefined,'clf-reason');
        if(inExam){area.append(E('p','Describe tu propia estrategia antes de revisar una solución.','muted'));}
        else if(cue){const topline=E('div',undefined,'clf-beat');topline.append(E('span',cue.phase,'clf-chip'),E('span',cue.verb,'clf-kind'));area.append(topline);
          area.append(E('div',cue.goal,'clf-goal'),E('div',cue.reason,'clf-explain'));
          if(cue.content)area.append(E('div',cue.content,'clf-action'));
          const bar=E('div',undefined,'clf-progress');const fill=E('i');fill.style.width=(cue.progress*100).toFixed(2)+'%';bar.append(fill);area.append(bar);
        }else area.append(E('p','Selecciona una etapa para explorar su justificación.','muted'));f.append(area);
      }
      if(type==='formula'){
        title('Mesa de cálculo');if(inExam) f.append(E('p','Resultado oculto durante la evaluación.','muted'));
        else if(cue?.expression){f.append(E('div',cue.expression,'clf-formula'));const isFinished=snap.lastKey==='=';
          f.append(E('div',isFinished?'= '+core.format(cue.verified):'Sustituyendo valores…',isFinished?'clf-result':'muted'));
          f.append(E('p',cue.reason,'muted'));
        }else f.append(E('p','La fórmula se mostrará cuando llegue su operación.','muted'));
      }
      if(type==='data'){
        title('Datos y variables');if(inExam)f.append(E('p','Utiliza los datos del enunciado y elige tu método.','muted'));
        else if(Array.isArray(lesson.problem.activities)){
          const list=E('div',undefined,'clf-data-list');for(const a of lesson.problem.activities){const pill=E('div',undefined,'clf-data-pill'+(cue?.targets.includes(a.id)?' is-focused':''));
            pill.append(E('span',a.name||a.id,'tag'),E('b',a.id+' · '+a.optimistic+'/'+a.mostLikely+'/'+a.pessimistic));list.append(pill);
          }f.append(list);
        }else f.append(E('p','Esta lección no requiere un conjunto de actividades.','muted'));
      }
      if(type==='steps'){
        title('Proceso de resolución');const s=lesson.scenes[mode==='demo'?index():guideIndex];if(inExam)f.append(E('p','Resuelve antes de consultar las etapas del procedimiento.','muted'));else {f.append(E('h3',s.goal));if(mode==='demo'||guideSolved)f.append(E('p',s.rationale,'muted'));else f.append(E('p','Formula una estrategia antes de mostrar la explicación.','muted'));f.append(E('span',`${mode==='demo'?index()+1:guideIndex+1} de ${lesson.scenes.length}`,'tag'));}
      }
      if(type==='transcript'){
        title('Transcripción');if(mode!=='demo')f.append(E('p','La transcripción solo está disponible durante la demostración.','muted'));else {const d=E('details');const s=E('summary','Leer procedimiento completo hasta la etapa actual');d.append(s);const rows=lesson.scenes.slice(0,index()+1).map((s,i)=>`${i+1}. ${s.goal}\n${s.rationale}\n${s.actions.map(a=>a.text||a.expression||'').filter(Boolean).join('\n')}`);d.append(E('pre',rows.join('\n\n')));f.append(d);}
      }
      if(type==='guided'){
        title('Práctica guiada');if(mode!=='guided')f.append(E('p','Activa la modalidad guiada en los controles.','muted'));else {
          const s=lesson.scenes[guideIndex],cp=s.checkpoint;f.append(E('h3',s.goal));f.append(E('p',cp?cp.prompt:'¿Qué decisión tomarías?'));
          if(!guideSolved&&cp){const row=E('div',undefined,'actions');const input=E('input');input.setAttribute('aria-label','Respuesta');input.inputMode='decimal';input.value=guideDraft;input.addEventListener('input',()=>{guideDraft=input.value;});row.append(input,button('Comprobar',()=>answer(input.value),'primary'));input.addEventListener('keydown',e=>{if(e.key==='Enter')answer(input.value);});f.append(row);if(guideHint){const hints=cp.hints?.length?cp.hints.slice(0,guideHintLevel):[cp.hint||'Revisa los datos antes de responder.'];hints.forEach((text,i)=>f.append(E('p',`Pista ${i+1}: ${text}`,'muted')));}f.append(button('Pista',hint));}
          if(!guideSolved&&!cp)f.append(button('Ver explicación',reveal));
          if(guideMessage)f.append(E('p',guideMessage,guideSolved?'okay':'error'));
          if(guideSolved){f.append(E('p',s.rationale,'muted'));f.append(button(guideIndex===lesson.scenes.length-1?'Continuar a evaluación':'Siguiente',next,'primary'));}
          if(guideIndex>0)f.append(button('Anterior',previous));
        }
      }
      if(type==='assessment'){
        title('Evaluación de práctica');if(mode!=='assessment')f.append(E('p','Activa la modalidad evaluación en los controles.','muted'));else{
          const quiz=E('div',undefined,'quiz');for(const q of lesson.assessment.items){const field=E('fieldset'),legend=E('legend',q.stem);field.append(legend);for(const o of q.options){const label=E('label',undefined,'choice'),radio=E('input');radio.type='radio';radio.name='clf-'+q.id;radio.checked=examAnswers[q.id]===o.id;radio.disabled=submitted;radio.addEventListener('change',()=>selectAnswer(q.id,o.id));label.append(radio,E('span',o.id+'. '+o.text));field.append(label);}if(submitted){const chosen=q.options.find(o=>o.id===examAnswers[q.id]);field.append(E('p',(chosen?.feedback||'Sin responder.')+' '+q.explanation,'feedback'));}quiz.append(field);}f.append(quiz);
          if(!submitted)f.append(button('Entregar respuestas',submit,'primary'));else {const correct=lesson.assessment.items.filter(q=>examAnswers[q.id]===q.correctOptionId).length;f.append(E('p',`Resultado: ${correct}/${lesson.assessment.items.length}`,'okay'));f.append(button('Nuevo intento',restart));}f.append(E('small','Práctica no oficial; el código HTML no protege las soluciones.','muted'));
        }
      }
      if(type==='status'){title('Estado');f.append(E('p',`Modalidad: ${mode} · Etapa ${mode==='demo'?index()+1:guideIndex+1}/${lesson.scenes.length} · ${playing?'Reproduciendo':'Pausado'}`));}
      body.append(f);
    }
    return Object.freeze({mount,onChange,onCue,seekAction,selectScenario,setScenarioParameter,resetScenario,getScenario:scenarioView,getState:state,play,pause,seek,seekScene,seekSceneId,connectWorkflow,next,previous,setMode,setSpeed,restart,answer,hint,reveal,manualKey,selectAnswer,submit,destroy,resources:Object.freeze([...TYPES])});
  }
  if(root.CLFKit)throw new Error('CLFKit ya está definido: evita cargarlo dos veces');
  root.CLFKit=Object.freeze({create,registerVisualization,resources:Object.freeze([...TYPES]),version:'0.6.0'});
})(globalThis);
