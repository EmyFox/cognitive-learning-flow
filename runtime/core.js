/* Cognitive Learning Flow v0.2 — universal deterministic timeline and safe arithmetic. */
(function (root) {
  'use strict';
  function assert(ok, message) { if (!ok) throw new Error(message); }
  function calculate(input) {
    assert(typeof input === 'string' && input.trim(), 'Expresión vacía');
    const s = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    let i = 0;
    const skip = () => { while (/\s/.test(s[i] || '')) i++; };
    function number() {
      skip(); const start = i;
      while (/[\d.]/.test(s[i] || '')) i++;
      const token = s.slice(start, i);
      assert(/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token), 'Número inválido: ' + token);
      return Number(token);
    }
    function factor() {
      skip();
      if (s[i] === '+') { i++; return factor(); }
      if (s[i] === '-') { i++; return -factor(); }
      if (s[i] === '(') {
        i++; const value = expression(); skip();
        assert(s[i] === ')', 'Falta cerrar paréntesis'); i++; return value;
      }
      return number();
    }
    function term() {
      let value = factor();
      while (true) {
        skip();
        if (s[i] === '*') { i++; value *= factor(); }
        else if (s[i] === '/') {
          i++; const denominator = factor(); assert(denominator !== 0, 'División entre cero'); value /= denominator;
        } else return value;
      }
    }
    function expression() {
      let value = term();
      while (true) {
        skip();
        if (s[i] === '+') { i++; value += term(); }
        else if (s[i] === '-') { i++; value -= term(); }
        else return value;
      }
    }
    const result = expression(); skip();
    assert(i === s.length && Number.isFinite(result), 'Expresión no válida');
    return result;
  }
  function format(value) { return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6))); }
  function compile(lesson) {
    assert(lesson && Array.isArray(lesson.scenes), 'Lección inválida');
    const events = [], ends = [];
    for (let si = 0; si < lesson.scenes.length; si++) {
      const scene = lesson.scenes[si];
      events.push({type:'scene', si});
      for (let ai = 0; ai < scene.actions.length; ai++) {
        const action = scene.actions[ai];
        events.push({type:'cue',si,ai});
        if (action.type === 'write') {
          events.push({type:'line', si, ai});
          for (const glyph of Array.from(action.text || '')) events.push({type:'glyph', si, ai, glyph});
        } else if (action.type === 'calculator') {
          events.push({type:'calcClear', si, ai});
          const keys = action.keys || (action.expression.replace(/\*/g,'×').replace(/\//g,'÷').split('').concat('='));
          for (const key of keys) events.push({type:'key', si, ai, key});
          events.push({type:'calcDone', si, ai, value:calculate(action.expression)});
        } else if (action.type === 'highlight') {
          events.push({type:'highlight', si, targets:action.target || []});
        } else if (action.type === 'diagram') {
          events.push({type:'diagram', si, text:action.text || ''});
        } else if (action.type === 'question') {
          events.push({type:'question', si, text:action.text || ''});
        } else if (action.type === 'reveal') {
          events.push({type:'reveal', si, text:action.text || ''});
        }
      }
      ends.push(events.length);
    }
    return {events, ends};
  }
  function snapshot(lesson, compiled, cursor) {
    const state={sceneIndex:0, lines:[], calculator:'0', lastKey:'', highlights:[], diagram:false, diagramText:'', question:'', reveals:[], cue:null, actionType:null, actionIndex:-1};
    const limit=Math.max(0,Math.min(compiled.events.length,Math.trunc(cursor)));
    for(let i=0;i<limit;i++) {
      const e=compiled.events[i];
      if(e.type==='scene') { state.sceneIndex=e.si; state.highlights=[]; state.lastKey=''; state.cue=null; }
      else if(e.type==='cue') {state.cue={sceneIndex:e.si,actionIndex:e.ai};state.actionIndex=e.ai;state.actionType=lesson.scenes[e.si].actions[e.ai].type;}
      else if(e.type==='line') state.lines.push({scene:e.si,text:''});
      else if(e.type==='glyph') state.lines[state.lines.length-1].text+=e.glyph;
      else if(e.type==='calcClear') {state.calculator='';state.lastKey='';}
      else if(e.type==='key') {state.lastKey=e.key; if(e.key!=='=')state.calculator+=e.key;}
      else if(e.type==='calcDone') {state.calculator=format(e.value);state.lastKey='=';}
      else if(e.type==='highlight') state.highlights=e.targets.slice();
      else if(e.type==='diagram') {state.diagram=true;state.diagramText=e.text;}
      else if(e.type==='question')state.question=e.text;
      else if(e.type==='reveal')state.reveals.push(e.text);
    }
    return state;
  }
  function checkNumeric(actual, expected, tolerance) {
    const clean=String(actual).trim().replace(',', '.');
    if(!clean || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean))return false;
    const num=Number(clean);
    return Number.isFinite(num) && Number.isFinite(expected) && Math.abs(num-expected)<=Math.max(0,tolerance||0);
  }
  // A semantic cue always describes an OBSERVABLE instructional decision, never private thought.
  // Derive it from the same timeline cursor driving the notebook, calculator and diagram.
  function choreography(lesson, compiled, cursor) {
    const state=snapshot(lesson,compiled,cursor);
    const scene=lesson.scenes[state.sceneIndex];
    const cue=state.cue;
    const action=cue?scene.actions[cue.actionIndex]:null;
    const map={write:['Anotar','write'],calculator:['Calcular','calculate'],highlight:['Relacionar','focus'],diagram:['Representar','draw'],question:['Predecir','predict'],reveal:['Comprobar','verify']};
    const [verb,kind]=action?(map[action.type]||['Examinar','focus']):['Comprender','orient'];
    let content=action?(action.callout||action.text||action.expression||''):scene.goal;
    const targets=action?(action.focus||action.target||[]):[];
    // Keep the most recently VERIFIED calculator operation visible while later
    // highlight/reasoning cues animate: formula and notebook stay synchronized.
    let expression=action?.type==='calculator'?action.expression:null;
    if(expression===null){
      for(let j=Math.min(cursor,compiled.events.length)-1;j>=0;j--){
        const e=compiled.events[j];
        if(e.type==='calcDone') {expression=lesson.scenes[e.si].actions[e.ai].expression;break;}
      }
    }
    const verified=expression!==null?calculate(expression):null;
    const phase=action?.animation?.kind||kind;
    const reason=action?.why||scene.rationale;
    const notes=action?.type==='write'?state.lines.at(-1)?.text||'':'';
    const id=cue?scene.id+':'+cue.actionIndex:scene.id+':intro';
    return Object.freeze({id,sceneIndex:state.sceneIndex,actionIndex:cue?.actionIndex??-1,
      phase:scene.phase||'understand',kind:phase,verb,goal:scene.goal,reason,content,
      targets:Array.isArray(targets)?targets.slice():[],expression,verified,
      currentKey:state.lastKey,notes,progress:Math.max(0,Math.min(1,cursor/Math.max(1,compiled.events.length)))});
  }
  root.CLFCore={calculate,format,compile,snapshot,checkNumeric,choreography};
})(globalThis);
