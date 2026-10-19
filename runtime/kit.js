/* Cognitive Learning Flow v0.3 — host-independent resource kit.
 * Depends on runtime/core.js. Only exposes globalThis.CLFKit; no global stylesheet.
 */
(function(root) {
  'use strict';
  const TYPES=['notebook','calculator','diagram','controls','steps','transcript','guided','assessment','status'];
  const STYLE=`:host{display:block;--clf-ink:#15243b;--clf-surface:#fff;--clf-line:#dde5ef;--clf-accent:#245ecc;--clf-muted:#586a81;--clf-paper:#fbfdfb;color:var(--clf-ink);font:inherit;line-height:1.5}*{box-sizing:border-box}.frame{border:1px solid var(--clf-line);border-radius:14px;background:var(--clf-surface);padding:14px;min-width:0}.head{font-size:.83em;letter-spacing:.07em;text-transform:uppercase;color:var(--clf-muted);font-weight:700;margin:0 0 9px}.muted{color:var(--clf-muted)}.paper{min-height:160px;max-height:380px;overflow:auto;background:var(--clf-paper);border-radius:9px;padding:15px 13px 15px 24px;background-image:repeating-linear-gradient(transparent 0 30px,#dae4ef 31px,transparent 32px);white-space:pre-wrap;overflow-wrap:anywhere;font:500 15px/32px ui-monospace,SFMono-Regular,Consolas,monospace}.line{min-height:32px}.display{background:#12213a;color:#f0f7ff;padding:13px 16px;text-align:right;border-radius:9px;font:600 1.3rem ui-monospace,monospace;min-height:58px;overflow-wrap:anywhere}.keypad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.keypad button{min-width:0}.actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}button,select,input{font:inherit;min-height:44px;max-width:100%;border-radius:9px;border:1px solid var(--clf-line);padding:8px 12px}button{cursor:pointer;background:var(--clf-surface);color:var(--clf-ink)}button:hover{border-color:var(--clf-accent)}button:disabled{opacity:.5;cursor:not-allowed}.primary{background:var(--clf-accent);color:white;border-color:var(--clf-accent)}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--clf-accent);outline-offset:2px}.active{box-shadow:inset 0 0 0 2px var(--clf-accent)}input{min-width:120px;max-width:100%;width:220px}.tag{color:var(--clf-muted);font-size:.87em}.graph{overflow:auto;max-width:100%}.graph svg{display:block;max-width:none;height:auto}.graph p{color:var(--clf-muted)}.quiz fieldset{margin:0 0 16px;border:1px solid var(--clf-line);border-radius:10px;padding:12px;min-width:0}.quiz legend{font-weight:700}.choice{display:flex;gap:10px;align-items:center;margin:9px 0;cursor:pointer}.choice input{width:auto;min-width:0;min-height:0}.feedback{margin:10px 0;white-space:pre-wrap}.error{color:#a62c42}.okay{color:#14704a}progress{display:block;width:100%;height:10px;margin:10px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}details{margin-top:10px}h3{font-size:1.15rem;margin:0 0 8px}.notice{margin:0 0 12px}.timeline{display:flex;flex-wrap:wrap;gap:8px;align-items:center}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`;
  const svgNS='http://www.w3.org/2000/svg';
  const E=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
  const S=(tag,attrs)=>{const e=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));return e;};
  const KEYS=['7','8','9','÷','4','5','6','×','1','2','3','−','C','0','.','+','(',')','=','⌫'];
  function create(lesson, options={}) {
    const core=root.CLFCore;
    if(!core)throw new Error('Carga CLFCore antes de CLFKit');
    if(!lesson || !Array.isArray(lesson.scenes)||!lesson.scenes.length)throw new Error('Lección sin escenas');
    const compiled=core.compile(lesson), mounts=new Map(), listeners=new Set();
    const available=new Set(TYPES);let timer=null,destroyed=false;
    let mode=['demo','guided','assessment'].includes(options.mode)?options.mode:'demo';
    let cursor=0,playing=false,speed=1,guideIndex=0,guideSolved=false,guideHint=false,attempts=0,guideMessage='',guideDraft='',manual='',examAnswers={},submitted=false;
    const workflowListeners=new Set();
    const reduced=typeof root.matchMedia==='function'&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function assertLive(){if(destroyed)throw new Error('Instancia destruida');}
    function stopTimer(){playing=false;if(timer!==null){clearTimeout(timer);timer=null;}}
    function index(){const current=core.snapshot(lesson,compiled,cursor);return current.sceneIndex;}
    function sceneEnd(n){return compiled.ends[Math.max(0,Math.min(compiled.ends.length-1,n))];}
    function view(){
      const demo=core.snapshot(lesson,compiled,cursor);
      const guided=guideSolved?core.snapshot(lesson,compiled,sceneEnd(guideIndex)):{lines:[],calculator:manual||'0',lastKey:'',highlights:[],diagram:true};
      const blank={lines:[],calculator:'0',lastKey:'',highlights:[],diagram:false};
      return mode==='demo'?demo:mode==='guided'?guided:blank;
    }
    function state(){return Object.freeze({mode,cursor,playing,speed,sceneIndex:mode==='demo'?index():guideIndex,totalScenes:lesson.scenes.length,guideSolved,guideHint,attempts,submitted,examAnswers:{...examAnswers},snapshot:view()});}
    function emit(){if(destroyed)return;for(const fn of listeners){try{fn(state());}catch(error){console.error('CLFKit listener:',error);}}for(const item of mounts.values())render(item);}
    function onChange(fn){assertLive();if(typeof fn!=='function')throw new TypeError('Listener no válido');listeners.add(fn);return ()=>listeners.delete(fn);}
    function pause(){assertLive();stopTimer();emit();}
    function tick(){if(!playing||destroyed)return;if(cursor>=compiled.events.length){stopTimer();emit();return;}cursor++;emit();const event=compiled.events[cursor-1];const delay=reduced?1:event.type==='glyph'?48:170;timer=setTimeout(tick,Math.max(1,delay/speed));}
    function play(){assertLive();if(mode!=='demo')return;if(cursor>=compiled.events.length)cursor=0;stopTimer();playing=true;emit();tick();}
    function seek(to){assertLive();stopTimer();cursor=Math.max(0,Math.min(compiled.events.length,Math.trunc(to)||0));emit();}
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
    function next(){assertLive();if(mode==='demo')seekScene(Math.min(index()+1,lesson.scenes.length-1));else if(mode==='guided'&&guideSolved){if(guideIndex<lesson.scenes.length-1){guideIndex++;guideSolved=false;guideHint=false;guideMessage='';attempts=0;guideDraft='';manual='';emit();}else setMode('assessment');}}
    function previous(){assertLive();if(mode==='demo')seek(index()<=0?0:sceneEnd(index()-1));else if(mode==='guided'){guideIndex=Math.max(0,guideIndex-1);guideSolved=false;guideHint=false;guideMessage='';attempts=0;guideDraft='';manual='';emit();}}
    function setSpeed(value){assertLive();if(![.5,1,1.5,2].includes(Number(value)))throw new RangeError('Velocidad no admitida');speed=Number(value);emit();}
    function setMode(value){assertLive();if(!['demo','guided','assessment'].includes(value))throw new Error('Modo desconocido');stopTimer();mode=value;cursor=0;guideIndex=0;guideSolved=false;guideHint=false;attempts=0;guideMessage='';guideDraft='';manual='';submitted=false;examAnswers={};emit();}
    function restart(){setMode(mode);}
    function answer(value){assertLive();if(mode!=='guided'||guideSolved)return false;const cp=lesson.scenes[guideIndex].checkpoint;if(!cp)return false;const ok=typeof cp.answer==='number'?core.checkNumeric(value,cp.answer,cp.tolerance):String(value).trim().toLowerCase()===String(cp.answer).trim().toLowerCase();attempts++;if(ok){guideSolved=true;guideMessage=cp.feedback||'Respuesta correcta';}else guideMessage='Todavía no coincide; revisa las unidades y el procedimiento.';emit();return ok;}
    function hint(){assertLive();if(mode!=='guided'||guideSolved)return;guideHint=true;emit();}
    function reveal(){assertLive();if(mode!=='guided'||guideSolved)return;if(lesson.scenes[guideIndex].checkpoint)return;guideSolved=true;guideMessage=lesson.scenes[guideIndex].rationale;emit();}
    function manualKey(key){assertLive();if(mode!=='guided'||guideSolved)return;if(key==='C')manual='';else if(key==='⌫')manual=manual.slice(0,-1);else if(key==='='){try{manual=core.format(core.calculate(manual));}catch{manual='Error';}}else if(manual.length<64&&KEYS.includes(key))manual+=key;emit();}
    function selectAnswer(id,option){assertLive();if(mode!=='assessment'||submitted)return;const item=lesson.assessment.items.find(q=>q.id===id);if(!item||!item.options.some(o=>o.id===option))return;examAnswers[id]=option;emit();}
    function submit(){assertLive();if(mode!=='assessment'||submitted)return null;submitted=true;let correct=0;for(const item of lesson.assessment.items)if(examAnswers[item.id]===item.correctOptionId)correct++;emit();return {correct,total:lesson.assessment.items.length};}
    function mount(type,host){assertLive();if(!available.has(type))throw new Error('Recurso CLF desconocido: '+type);if(typeof host==='string')host=document.querySelector(host);if(!host || !host.appendChild)throw new Error('Contenedor destino inexistente');const wrapper=E('div');wrapper.dataset.clfResource=type;const shadow=wrapper.attachShadow({mode:'open'});const style=E('style',STYLE);const body=E('section');shadow.append(style,body);host.append(wrapper);const item={type,host,wrapper,shadow,body};mounts.set(wrapper,item);render(item);return ()=>unmount(wrapper);}
    function unmount(wrapper){const item=mounts.get(wrapper);if(item){item.wrapper.remove();mounts.delete(wrapper);}}
    function destroy(){if(destroyed)return;stopTimer();for(const detach of [...workflowListeners])detach();for(const item of [...mounts.values()])unmount(item.wrapper);listeners.clear();destroyed=true;}
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
      const active=new Set(highlights);for(const a of data)for(const p of a.predecessors){const from=pos.get(p),to=pos.get(a.id);svg.append(S('path',{d:`M${from.x+29} ${from.y} C${from.x+77} ${from.y},${to.x-77} ${to.y},${to.x-29} ${to.y}`,stroke:active.has(p)&&active.has(a.id)?'#158f78':'#9cb0c7','stroke-width':active.has(p)&&active.has(a.id)?3:1.8,fill:'none'}));}
      for(const a of data){const p=pos.get(a.id),selected=active.has(a.id);svg.append(S('rect',{x:p.x-29,y:p.y-25,width:58,height:50,rx:9,fill:selected?'#c0f4e6':'#ebf1f7',stroke:selected?'#168a76':'#8ca0bb','stroke-width':2}));const t=S('text',{x:p.x,y:p.y-4,'text-anchor':'middle','font-size':16,'font-weight':700,fill:'#15243b'});t.textContent=a.id;svg.append(t);const s=S('text',{x:p.x,y:p.y+14,'text-anchor':'middle','font-size':10,fill:'#475975'});s.textContent=mode==='guided'&&!guideSolved?'a/m/b':core.format((a.optimistic+4*a.mostLikely+a.pessimistic)/6)+' d';svg.append(s);}
      box.append(svg);return box;
    }
    function render(item){
      const {type,body}=item;body.replaceChildren();const snap=view();const inExam=mode==='assessment';const f=E('div',undefined,'frame');const title=label=>f.append(E('p',label,'head'));
      const button=(label,fn,cls='',disabled=false)=>{const b=E('button',label,cls);b.type='button';b.disabled=disabled;b.addEventListener('click',fn);return b;};
      if(type==='notebook'){title('Cuaderno');const paper=E('div',undefined,'paper');paper.setAttribute('aria-label','Anotaciones del procedimiento');for(const line of snap.lines)paper.append(E('div',line.text,'line'));if(!snap.lines.length)paper.append(E('div',inExam?'Cuaderno disponible después de la evaluación.':'Las anotaciones aparecerán aquí.','muted'));f.append(paper);}
      if(type==='calculator'){
        title('Calculadora');const display=E('div',snap.calculator||'0','display');display.setAttribute('role','status');f.append(display);
        if(mode==='guided'&&!guideSolved){const keys=E('div',undefined,'keypad');for(const key of KEYS)keys.append(button(key,()=>manualKey(key)));f.append(keys);}else if(mode==='demo'){const p=E('div','Operación sincronizada con la escena.','tag');f.append(p);}else f.append(E('p','Sin ayuda de calculadora durante la evaluación.','muted'));
      }
      if(type==='diagram'){title('Diagrama');f.append(buildGraph(snap.highlights,!inExam&&(mode==='guided'||snap.diagram)));}
      if(type==='controls'){
        title('Controles');const modes=E('div',undefined,'actions');for(const [id,label] of [['demo','Demostración'],['guided','Guiada'],['assessment','Evaluación']])modes.append(button(label,()=>setMode(id),id===mode?'primary':''));f.append(modes);
        if(mode==='demo'){
          const actions=E('div',undefined,'timeline');actions.style.marginTop='10px';actions.append(button(playing?'Pausar':'Reproducir',()=>playing?pause():play(),'primary'),button('Anterior',previous),button('Siguiente',next),button('Reiniciar',restart));
          const sel=E('select');sel.setAttribute('aria-label','Velocidad de reproducción');for(const val of [.5,1,1.5,2]){const op=E('option',val+'×');op.value=val;op.selected=val===speed;sel.append(op);}sel.addEventListener('change',()=>setSpeed(sel.value));actions.append(sel);
          const jump=E('select');jump.setAttribute('aria-label','Seleccionar escena');for(let i=0;i<lesson.scenes.length;i++){const op=E('option',(i+1)+'. '+lesson.scenes[i].goal);op.value=i;op.selected=i===index();jump.append(op);}jump.addEventListener('change',()=>seekScene(jump.value));actions.append(jump);f.append(actions);
          const bar=E('progress');bar.max=compiled.events.length;bar.value=cursor;f.append(bar);f.append(E('span',Math.round(100*cursor/compiled.events.length)+'%','tag'));
        }
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
          if(!guideSolved&&cp){const row=E('div',undefined,'actions');const input=E('input');input.setAttribute('aria-label','Respuesta');input.inputMode='decimal';input.value=guideDraft;input.addEventListener('input',()=>{guideDraft=input.value;});row.append(input,button('Comprobar',()=>answer(input.value),'primary'));input.addEventListener('keydown',e=>{if(e.key==='Enter')answer(input.value);});f.append(row);if(guideHint)f.append(E('p',cp.hint||'Revisa los datos antes de responder.','muted'));f.append(button('Pista',hint));}
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
    return Object.freeze({mount,onChange,getState:state,play,pause,seek,seekScene,seekSceneId,connectWorkflow,next,previous,setMode,setSpeed,restart,answer,hint,reveal,manualKey,selectAnswer,submit,destroy,resources:Object.freeze([...TYPES])});
  }
  if(root.CLFKit)throw new Error('CLFKit ya está definido: evita cargarlo dos veces');
  root.CLFKit=Object.freeze({create,resources:Object.freeze([...TYPES]),version:'0.3.0'});
})(globalThis);
