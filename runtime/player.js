/* Cognitive Learning Flow v0.2 — zero-dependency browser player. */
(function () {
  'use strict';
  const lesson=globalThis.CLF_LESSON, core=globalThis.CLFCore;
  if(!lesson||!core)throw new Error('Falta el contrato CLF_LESSON o CLFCore');
  const $=id=>document.getElementById(id);
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=String(text);if(className)node.className=className;return node;};
  const svgNS='http://www.w3.org/2000/svg';
  const sv=(tag,attrs)=>{const e=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));return e;};
  const compiled=core.compile(lesson);
  const scenes=lesson.scenes;
  const modes=['demo','guided','exam'];
  let mode='demo',cursor=0,status='idle',timer=null,speed=1,sceneNumber=0;
  let guideIndex=0,guideSolved=false,guideMistakes=0,guideHint=false,manual='',manualResult='0',examSubmitted=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const actionsMap={};
  const digitKeys=['7','8','9','÷','4','5','6','×','1','2','3','−','C','0','.','+','(',')','=','⌫'];
  function stop(){if(timer!==null){clearTimeout(timer);timer=null;}if(status==='playing')status='paused';}
  function setFeedback(node,text,isError){node.textContent=text;node.classList.toggle('error',!!isError);}
  function sceneEnd(i){return compiled.ends[Math.max(0,Math.min(i,compiled.ends.length-1))];}
  function modeView(next){
    stop();mode=next;status='idle';cursor=0;sceneNumber=0;guideIndex=0;guideSolved=false;guideMistakes=0;guideHint=false;manual='';manualResult='0';examSubmitted=false;
    for(const name of modes){$('view-'+name).hidden=name!==mode;$('tab-'+name).setAttribute('aria-pressed',String(name===mode));}
    $('work-area').hidden=mode==='exam';$('data-panel').hidden=mode==='exam';
    $('transcript').hidden=mode!=='demo';$('network-panel').hidden=mode==='exam';
    $('calculator-panel').hidden=mode==='exam';
    if(mode==='demo')renderDemo();else if(mode==='guided')renderGuide();else renderExam();
  }
  function play(){
    if(mode!=='demo')return;
    if(cursor>=compiled.events.length)cursor=0;
    stop();status='playing';renderDemo();tick();
  }
  function tick(){
    if(status!=='playing')return;
    if(cursor>=compiled.events.length){status='completed';timer=null;renderDemo();return;}
    cursor++;renderDemo();
    const last=compiled.events[cursor-1];
    timer=setTimeout(tick,(reduced?8:(last.type==='glyph'?52:190))/speed);
  }
  function seekCursor(to){stop();cursor=Math.max(0,Math.min(compiled.events.length,to));status=cursor===compiled.events.length?'completed':'paused';renderDemo();}
  function gotoScene(index){const n=Math.max(0,Math.min(scenes.length-1,index));seekCursor(sceneEnd(n));}
  function renderNotes(snapshot){
    const notebook=$('notebook');notebook.replaceChildren();
    if(!snapshot.lines.length)notebook.append(el('div','Los cálculos aparecerán aquí, paso a paso.','muted'));
    else for(const row of snapshot.lines){notebook.append(el('div',row.text,'note-line'));}
    notebook.scrollTop=notebook.scrollHeight;
  }
  function renderCalc(output,key){$('calc-display').textContent=output||'0';for(const button of $('keypad').querySelectorAll('button'))button.classList.toggle('active',button.dataset.key===key);}
  function drawGraph(highlights,enabled){
    const view=$('network');view.replaceChildren();
    const activities=lesson.problem.activities;
    if(!enabled||!Array.isArray(activities)||!activities.length){view.append(el('p','Diagrama disponible cuando el procedimiento lo necesite.','muted'));return;}
    const map=new Map(activities.map(a=>[a.id,a]));
    const depth=new Map(),done=new Set();let iter=0;
    while(done.size<activities.length&&iter++<activities.length+1){
      for(const a of activities)if(!done.has(a.id)&&a.predecessors.every(p=>done.has(p))){depth.set(a.id,a.predecessors.length?Math.max(...a.predecessors.map(p=>depth.get(p)))+1:0);done.add(a.id);}
    }
    if(done.size!==activities.length){view.textContent='Red inválida: precedencias circulares';return;}
    const layers=new Map();for(const a of activities){const d=depth.get(a.id);if(!layers.has(d))layers.set(d,[]);layers.get(d).push(a.id);}
    const width=(Math.max(...layers.keys())+1)*170+100;
    const height=Math.max(275,Math.max(...Array.from(layers.values()).map(a=>a.length))*95+85);
    const positions=new Map();for(const [d,ids] of layers){ids.forEach((id,i)=>positions.set(id,{x:65+d*170,y:height/2+(i-(ids.length-1)/2)*98}));}
    const svg=sv('svg',{viewBox:'0 0 '+width+' '+height,width:width,height:height,role:'img','aria-label':'Diagrama de dependencias de actividades'});
    const defs=sv('defs');const marker=sv('marker',{id:'arrow',markerWidth:8,markerHeight:8,refX:7,refY:3,orient:'auto'});marker.append(sv('path',{d:'M0 0 L7 3 L0 6',fill:'none',stroke:'#91a9c4','stroke-width':1.3}));defs.append(marker);svg.append(defs);
    const marked=new Set(highlights||[]);
    for(const a of activities)for(const p of a.predecessors){const from=positions.get(p),to=positions.get(a.id);const active=marked.has(p)&&marked.has(a.id);svg.append(sv('path',{d:'M'+(from.x+36)+' '+from.y+' C'+(from.x+89)+' '+from.y+' '+(to.x-86)+' '+to.y+' '+(to.x-36)+' '+to.y,fill:'none',stroke:active?'#67dec4':'#54708b','stroke-width':active?3:1.7,'marker-end':'url(#arrow)'}));}
    for(const a of activities){const p=positions.get(a.id),active=marked.has(a.id);const g=sv('g',{});const circle=sv('rect',{x:p.x-36,y:p.y-27,width:72,height:54,rx:13,stroke:active?'#67dec4':'#5a7493','stroke-width':active?3:1.5,fill:active?'#124f53':'#182c44'});g.append(circle);const id=sv('text',{x:p.x,y:p.y-3,'text-anchor':'middle',fill:'#f2f8ff','font-size':17,'font-weight':750});id.textContent=a.id;g.append(id);const duration=(a.optimistic+4*a.mostLikely+a.pessimistic)/6;const time=sv('text',{x:p.x,y:p.y+16,'text-anchor':'middle',fill:active?'#9beeda':'#bbd0e4','font-size':12});time.textContent=core.format(duration)+' d';g.append(time);svg.append(g);}
    view.append(svg);
  }
  function renderDemo(){
    const current=core.snapshot(lesson,compiled,cursor);sceneNumber=current.sceneIndex;
    const scene=scenes[sceneNumber];
    $('step').textContent='ETAPA '+(sceneNumber+1)+' / '+scenes.length;
    $('goal').textContent=scene.goal;
    $('reason').textContent=scene.rationale;
    $('transcript-body').textContent=scenes.slice(0,sceneNumber+1).map((s,i)=>(i+1)+'. '+s.goal+'\n'+s.rationale+'\n'+s.actions.map(a=>a.text||a.expression||'').filter(Boolean).join('\n')).join('\n\n');
    renderNotes(current);renderCalc(current.calculator,current.lastKey);
    drawGraph(current.highlights,current.diagram);
    $('scene-choice').value=String(sceneNumber);
    $('progress').value=cursor;$('progress').max=compiled.events.length;
    $('pct').textContent=Math.round(100*cursor/Math.max(1,compiled.events.length))+'%';
    $('play').textContent=status==='playing'?'⏸ Pausar':'▶ Reproducir';
    $('prev').disabled=cursor===0;$('next').disabled=cursor>=compiled.events.length;
    $('step-question').textContent=current.question||'';
  }
  function renderGuide(){
    const scene=scenes[guideIndex],checkpoint=scene.checkpoint;
    $('guide-step').textContent='PASO '+(guideIndex+1)+' / '+scenes.length;
    $('guide-goal').textContent=scene.goal;
    $('guide-question').textContent=checkpoint?checkpoint.prompt:'¿Qué operación realizarías y por qué?';
    $('guide-input-wrap').hidden=!checkpoint||guideSolved;
    $('guide-unlock').hidden=!!checkpoint||guideSolved;
    $('guide-next').disabled=!guideSolved;
    $('guide-next').textContent=guideIndex===scenes.length-1?'Terminar':'Siguiente paso';
    $('guide-prev').disabled=guideIndex===0;
    $('guide-answer').value='';$('guide-hint').hidden=!checkpoint||guideSolved;
    const snap=guideSolved?core.snapshot(lesson,compiled,sceneEnd(guideIndex)):{lines:[],calculator:'0',lastKey:'',highlights:[],diagram:true};
    renderNotes(snap);renderCalc(guideSolved?snap.calculator:manualResult,guideSolved?snap.lastKey:'');
    drawGraph(guideSolved?snap.highlights:[],true);
    $('guide-reason').textContent=guideSolved?scene.rationale:'';
    $('guide-feedback').textContent=guideSolved?(checkpoint?(checkpoint.feedback||'Correcto.'):scene.rationale):'';
  }
  function guideEnter(){
    const scene=scenes[guideIndex],c=scene.checkpoint;
    if(!c)return;
    const okay=typeof c.answer==='number'?core.checkNumeric($('guide-answer').value,c.answer,c.tolerance):$('guide-answer').value.trim().toLowerCase()===String(c.answer).trim().toLowerCase();
    if(okay){guideSolved=true;guideMistakes=0;guideHint=false;renderGuide();}
    else{guideMistakes++;setFeedback($('guide-feedback'),guideMistakes>1?'Revisa el procedimiento; puedes pedir una pista.':'Aún no coincide. Revisa datos y unidades.',true);}
  }
  function nextGuide(){
    if(!guideSolved)return;
    if(guideIndex===scenes.length-1){modeView('exam');return;}
    guideIndex++;guideSolved=false;guideMistakes=0;guideHint=false;manual='';manualResult='0';renderGuide();
  }
  function manualKey(key){
    if(mode!=='guided'||guideSolved)return;
    if(key==='C'){manual='';manualResult='0';}
    else if(key==='⌫'){manual=manual.slice(0,-1);manualResult=manual||'0';}
    else if(key==='=') {try{manualResult=core.format(core.calculate(manual));}catch{manualResult='Error';}}
    else if(manual.length<60){manual+=key;manualResult=manual;}
    renderCalc(manualResult,key);
  }
  function renderExam(){
    const form=$('quiz');form.replaceChildren();
    const intro=el('p','Responde y envía para ver las explicaciones. Las respuestas no aparecen antes de entregar.','muted');form.append(intro);
    for(const [idx,item] of lesson.assessment.items.entries()){
      const field=el('fieldset',undefined,'quiz-item');const legend=el('legend',(idx+1)+'. '+item.stem);field.append(legend);
      for(const option of item.options){const label=el('label',undefined,'option'),radio=document.createElement('input');radio.type='radio';radio.name='q'+idx;radio.value=option.id;label.append(radio,el('span',option.id+'. '+option.text));field.append(label);}
      const feedback=el('div','', 'feedback');feedback.id='feedback-'+idx;field.append(feedback);form.append(field);
    }
    $('quiz-submit').disabled=false;$('quiz-result').textContent='';examSubmitted=false;
  }
  function submitExam(){
    if(examSubmitted)return;
    let correct=0;
    lesson.assessment.items.forEach((item,idx)=>{
      const chosen=$('quiz').querySelector('input[name="q'+idx+'"]:checked');const choice=chosen?chosen.value:null;
      if(choice===item.correctOptionId)correct++;
      const feedback=$('feedback-'+idx);
      const details=choice?item.options.find(o=>o.id===choice)?.feedback:'Sin respuesta.';
      setFeedback(feedback,(choice===item.correctOptionId?'✓ Correcto. ':'✗ Incorrecto. ')+(details||'')+'\n'+item.explanation,choice!==item.correctOptionId);
    });
    $('quiz').querySelectorAll('input').forEach(i=>i.disabled=true);
    $('quiz-submit').disabled=true;
    $('quiz-result').textContent=correct+' de '+lesson.assessment.items.length+' respuestas correctas · '+Math.round(correct/lesson.assessment.items.length*100)+'%';
    examSubmitted=true;
  }
  function init(){
    $('title').textContent=lesson.title;
    $('statement').textContent=lesson.problem.statement;
    $('source-note').textContent=(lesson.sourceNotes||[]).join(' · ');
    const data=$('activities');data.replaceChildren();
    if(Array.isArray(lesson.problem.activities))for(const a of lesson.problem.activities){const li=el('li',a.id+' · '+a.name+' · antes: '+(a.predecessors.join(', ')||'—')+' · a/m/b: '+a.optimistic+'/'+a.mostLikely+'/'+a.pessimistic);data.append(li);}
    for(const [i,scene] of scenes.entries()){
      const option=document.createElement('option');option.value=String(i);option.textContent=(i+1)+'. '+scene.goal;$('scene-choice').append(option);
    }
    for(const key of digitKeys){const button=el('button',key,/^[+×÷−=]$/.test(key)?'operator':'');button.type='button';button.dataset.key=key;button.setAttribute('aria-label','Calculadora '+key);button.addEventListener('click',()=>manualKey(key));$('keypad').append(button);}
    $('tab-demo').addEventListener('click',()=>modeView('demo'));
    $('tab-guided').addEventListener('click',()=>modeView('guided'));
    $('tab-exam').addEventListener('click',()=>modeView('exam'));
    $('play').addEventListener('click',()=>status==='playing'?(stop(),renderDemo()):play());
    $('prev').addEventListener('click',()=>gotoScene(sceneNumber-1));
    $('next').addEventListener('click',()=>gotoScene(sceneNumber+1));
    $('restart').addEventListener('click',()=>seekCursor(0));
    $('scene-choice').addEventListener('change',e=>gotoScene(Number(e.target.value)));
    $('speed').addEventListener('change',e=>{speed=Number(e.target.value);});
    $('guide-check').addEventListener('click',guideEnter);
    $('guide-answer').addEventListener('keydown',e=>{if(e.key==='Enter')guideEnter();});
    $('guide-hint').addEventListener('click',()=>{setFeedback($('guide-feedback'),scenes[guideIndex].checkpoint?.hint||'Piensa qué te piden.',false);});
    $('guide-unlock').addEventListener('click',()=>{guideSolved=true;renderGuide();});
    $('guide-next').addEventListener('click',nextGuide);
    $('guide-prev').addEventListener('click',()=>{if(guideIndex>0){guideIndex--;guideSolved=false;guideMistakes=0;renderGuide();}});
    $('quiz-submit').addEventListener('click',submitExam);
    $('quiz-restart').addEventListener('click',renderExam);
    modeView('demo');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
