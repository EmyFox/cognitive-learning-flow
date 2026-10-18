#!/usr/bin/env node
// CLF v0.1 · Numeric validator independent of UI. Zero dependencies. No eval.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const near = (a, b, epsilon=1e-6) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= epsilon;
export function insist(ok, message) { if (!ok) throw new Error(message); }

/** Safe parser for numbers, +, -, *, /, unary signs and parentheses. */
export function arithmetic(input) {
  insist(typeof input === 'string' && input.trim(), 'Expresión vacía');
  const source = input.replace(/×/g,'*').replace(/[÷]/g,'/').replace(/[−]/g,'-');
  let i=0;
  const skip = () => { while (/\s/.test(source[i] ?? '')) i++; };
  function number() {
    skip(); const start=i;
    while (/[\d.]/.test(source[i] ?? '')) i++;
    insist(start<i, `Número esperado en posición ${i}`);
    const token=source.slice(start,i);
    insist(/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token), `Número inválido ${token}`);
    const value=Number(token);
    insist(Number.isFinite(value),'Número fuera de rango');
    return value;
  }
  function factor() {
    skip();
    if(source[i]==='+'){i++;return factor();}
    if(source[i]==='-'){i++;return -factor();}
    if(source[i]==='(') {
      i++;const result=expression();skip();
      insist(source[i]===')', 'Falta cerrar paréntesis');i++;return result;
    }
    return number();
  }
  function term() {
    let v=factor();
    while(true) {
      skip();
      if(source[i]==='*'){i++;v*=factor();}
      else if(source[i]==='/'){i++;const denominator=factor();insist(denominator!==0,'División por cero');v/=denominator;}
      else break;
    }
    return v;
  }
  function expression() {
    let v=term();
    while(true) {
      skip();
      if(source[i]==='+'){i++;v+=term();}
      else if(source[i]==='-'){i++;v-=term();}
      else break;
    }
    return v;
  }
  const value=expression();skip();
  insist(i===source.length,'Caracteres inesperados en la expresión');
  insist(Number.isFinite(value),'Resultado no finito');
  return value;
}

/** Build a deterministic PERT/CPM solution from a directed acyclic graph. */
export function solvePert(activities) {
  insist(Array.isArray(activities) && activities.length>0,'Se requiere lista de actividades');
  const entries=new Map();
  for(const a of activities) {
    insist(a && typeof a.id==='string' && a.id.trim(),'Actividad sin ID');
    insist(!entries.has(a.id),`Actividad duplicada: ${a.id}`);
    insist(Array.isArray(a.predecessors),`Predecesoras faltantes: ${a.id}`);
    insist([a.optimistic,a.mostLikely,a.pessimistic].every(v=>typeof v==='number' && Number.isFinite(v)),`Tiempo inválido: ${a.id}`);
    insist(0<=a.optimistic && a.optimistic<=a.mostLikely && a.mostLikely<=a.pessimistic,`Se requiere 0 ≤ a ≤ m ≤ b para ${a.id}`);
    entries.set(a.id,{...a,te:(a.optimistic+4*a.mostLikely+a.pessimistic)/6,
      variance:((a.pessimistic-a.optimistic)/6)**2,successors:[]});
  }
  for(const a of entries.values()) {
    insist(new Set(a.predecessors).size===a.predecessors.length,`Dependencia duplicada: ${a.id}`);
    for(const before of a.predecessors) {
      insist(entries.has(before),`Predecesora inexistente: ${before}`);
      entries.get(before).successors.push(a.id);
    }
  }
  const done=new Set(),order=[];
  while(order.length<entries.size){
    let progress=false;
    for(const a of entries.values()){
      if(done.has(a.id)||!a.predecessors.every(id=>done.has(id)))continue;
      a.ES=a.predecessors.length?Math.max(...a.predecessors.map(id=>entries.get(id).EF)):0;
      a.EF=a.ES+a.te;order.push(a);done.add(a.id);progress=true;
    }
    insist(progress,'Se detectó un ciclo en la red');
  }
  const duration=Math.max(...order.filter(a=>a.successors.length===0).map(a=>a.EF));
  for(const a of [...order].reverse()) {
    a.LF=a.successors.length?Math.min(...a.successors.map(id=>entries.get(id).LS)):duration;
    a.LS=a.LF-a.te;
    a.float=a.LS-a.ES;
  }
  const paths=[];
  function walk(a,path){
    const nextPath=[...path,a.id];
    const next=a.successors.map(id=>entries.get(id))
      .filter(b=>near(a.float,0)&&near(b.float,0)&&near(a.EF,b.ES));
    if(!next.length){
      if(near(a.float,0)&&near(a.EF,duration)) paths.push(nextPath);
    } else next.forEach(b=>walk(b,nextPath));
  }
  order.filter(a=>a.predecessors.length===0&&near(a.float,0)).forEach(a=>walk(a,[]));
  insist(paths.length>0,'No se encontró ruta crítica continua');
  return {duration,paths,activities:entries};
}

/** Abramowitz & Stegun 7.1.26 approximation to standard normal CDF. */
export function normalCdf(z){
  const sign=z<0?-1:1, x=Math.abs(z)/Math.sqrt(2), t=1/(1+0.3275911*x);
  const erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
  return (1+sign*erf)/2;
}

export function validateLesson(lesson) {
  insist(lesson && lesson.schemaVersion==='0.1','schemaVersion inválida (se espera 0.1)');
  for(const key of ['id','title','domain','problem','groundTruth','scenes','assessment','sourceNotes'])
    insist(lesson[key]!==undefined,`Campo faltante: ${key}`);
  insist(Array.isArray(lesson.scenes)&&lesson.scenes.length>=3,'Se requieren al menos 3 escenas');
  insist(Array.isArray(lesson.assessment.items)&&lesson.assessment.items.length>0,'Faltan reactivos');
  const names=new Set(),allowed=new Set(['write','calculator','highlight','diagram','question','reveal']);
  for(const scene of lesson.scenes) {
    insist(scene.id && !names.has(scene.id),`Escena repetida o sin id: ${scene.id}`);names.add(scene.id);
    insist(scene.phase && scene.goal && scene.rationale && Array.isArray(scene.actions)&&scene.actions.length,`Escena incompleta: ${scene.id}`);
    for(const action of scene.actions){
      insist(allowed.has(action.type),`Tipo de acción inválido: ${action.type}`);
      if(action.type==='calculator') {
        insist(typeof action.expression==='string' && typeof action.expected==='number',`Calculadora incompleta: ${scene.id}`);
        insist(near(arithmetic(action.expression),action.expected,1e-5),`Calculadora incorrecta: ${scene.id}`);
        if(action.keys){
          insist(Array.isArray(action.keys),`Teclas incorrectas: ${scene.id}`);
          const played=action.keys.join('').replace(/=/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\s/g,'');
          insist(played===action.expression.replace(/\s/g,''),`Teclas no coinciden con expresión: ${scene.id}`);
        }
      }
    }
    if(scene.checkpoint && typeof scene.checkpoint.answer==='number')
      insist(Number.isFinite(scene.checkpoint.answer),'Respuesta del checkpoint no finita');
  }
  for(const item of lesson.assessment.items){
    insist(Array.isArray(item.options)&&[3,4].includes(item.options.length),`Se requieren 3 o 4 opciones: ${item.id}`);
    const ids=item.options.map(o=>o.id);
    insist(new Set(ids).size===ids.length && ids.includes(item.correctOptionId),`Respuesta inválida: ${item.id}`);
    insist(item.explanation && item.options.every(o=>o.feedback),`Falta feedback: ${item.id}`);
  }
  if(lesson.problem.activities){
    const result=solvePert(lesson.problem.activities);
    insist(near(result.duration,lesson.groundTruth.expectedDuration),`Duración esperada incorrecta: ${result.duration}`);
    const canonical=paths=>paths.map(path=>path.join('>')).sort();
    insist(JSON.stringify(canonical(result.paths))===JSON.stringify(canonical(lesson.groundTruth.criticalPaths)),`Rutas críticas incorrectas: ${canonical(result.paths)}`);
    const expectedVariance=lesson.groundTruth.criticalVariance;
    if(typeof expectedVariance==='number'){
      insist(result.paths.length===1,'Con rutas críticas múltiples no usar una sola varianza sin modelo adicional');
      const variance=result.paths[0].reduce((acc,id)=>acc+result.activities.get(id).variance,0);
      insist(near(variance,expectedVariance,1e-5),`Varianza incorrecta: ${variance}`);
      const deadline=lesson.groundTruth.deadline;
      if(deadline){
        insist(Number.isFinite(deadline.day)&&Number.isFinite(deadline.approxProbability),'Fecha o probabilidad inválida');
        const p=variance===0?(deadline.day>=result.duration?1:0):normalCdf((deadline.day-result.duration)/Math.sqrt(variance));
        insist(near(p,deadline.approxProbability,0.001),`Probabilidad incorrecta: ${p}`);
      }
    }
    return {id:lesson.id,scenes:lesson.scenes.length,questions:lesson.assessment.items.length,math:{duration:result.duration,criticalPaths:result.paths}};
  }
  return {id:lesson.id,scenes:lesson.scenes.length,questions:lesson.assessment.items.length,math:null};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    insist(process.argv[2],'Uso: node scripts/validate-lesson.mjs <archivo.lesson.json>');
    const lesson=JSON.parse(readFileSync(process.argv[2],'utf8'));
    const result=validateLesson(lesson);
    console.log(`OK: ${result.id} | ${result.scenes} escenas | ${result.questions} reactivos`);
    if(result.math) console.log(`PERT/CPM: ${result.math.duration} días | ${result.math.criticalPaths.map(p=>p.join('→')).join(' ; ')}`);
  } catch(err) { console.error('ERROR:',err.message); process.exitCode=1; }
}
