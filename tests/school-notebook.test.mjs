import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {validateSchool} from '../scripts/validate-school.mjs';
import {buildSchoolNotebook} from '../scripts/build-school-demo.mjs';

const lesson=JSON.parse(readFileSync(new URL('../examples/line-balancing.school.json',import.meta.url),'utf8'));
const host=readFileSync(new URL('../examples/school-notebook-host.html',import.meta.url),'utf8');
const solve=(data)=>{const c={};runInNewContext(readFileSync(new URL('../runtime/line-balancing.js',import.meta.url),'utf8'),c);return c.CLFLineBalancing.solve(data);};

test('Line balancing computes exact cycle, work, theoretical lower bound and utilization',()=>{
 const r=validateSchool(lesson);assert.equal(r.cycle,60);assert.equal(r.total,190);assert.equal(r.theoreticalMin,4);assert.equal(r.stations.length,4);assert.equal(r.efficiency,190/240);assert.equal(r.idleSeconds,50);
 assert.deepEqual([...r.stations.map(s=>s.tasks.join(''))],['AB','CD','E','FG']);
});
test('High demand changes the assignment without violating constraints',()=>{
 const r=solve({...lesson,demand:600});assert.equal(r.cycle,48);assert.equal(r.stations.length,5);assert.equal(r.efficiency,190/(48*5));assert.deepEqual([...r.stations.map(s=>s.tasks.join(''))],['A','BD','C','E','FG']);
});
test('All station loads and precedence ordering remain feasible',()=>{
 for(const demand of [400,450,480,500,550,600,650]){
 const r=solve({...lesson,demand});const position=r.assignments;
 for(const s of r.stations)assert.ok(s.load<=r.cycle+1e-8);
 for(const t of lesson.tasks)for(const p of t.predecessors)assert.ok(position[p]<=position[t.id]);
 }
});
test('Reject invalid cycle, missing parent, cycles, repeated IDs, self-dependency and zero times',()=>{
 assert.throws(()=>solve({...lesson,demand:2000}),/supera el tiempo de ciclo/);
 assert.throws(()=>solve({...lesson,demand:0}),/positivas/);
 assert.throws(()=>solve({...lesson,availableSeconds:-1}),/positivas/);
 assert.throws(()=>solve({...lesson,tasks:lesson.tasks.map((t,i)=>i===1?{...t,id:'A'}:t)}),/duplicados/);
 assert.throws(()=>solve({...lesson,tasks:lesson.tasks.map((t,i)=>i===0?{...t,predecessors:['G']}:t)}),/cíclica/);
 assert.throws(()=>solve({...lesson,tasks:lesson.tasks.map((t,i)=>i===0?{...t,predecessors:['Q']}:t)}),/Precedencia inválida/);
 assert.throws(()=>solve({...lesson,tasks:lesson.tasks.map((t,i)=>i===0?{...t,seconds:0}:t)}),/inválida/);
});
test('Numeric reference mismatches fail before rendering HTML',()=>{
 const bad=structuredClone(lesson);bad.reference.cycle=59;
 assert.throws(()=>validateSchool(bad),/Referencia no coincide: cycle/);
});
test('Portable HTML has isolated component, independent content, no CDNs',()=>{
 const html=buildSchoolNotebook(lesson,host);
 assert.match(html,/attachShadow/);assert.match(html,/CLFSchoolNotebook/);
 assert.match(html,/28800/); // The available time is serialized inside the standalone lesson
 assert.doesNotMatch(html,/<script[^>]+src=/);
 assert.doesNotMatch(html,/<link[^>]+href=/);
 assert.match(html,/Mi cuaderno de Ingeniería Industrial/);
});
test('User-provided lesson text cannot escape the generated script',()=>{
 const bad=structuredClone(lesson);bad.title='</script><img src=x onerror=alert(8)>';
 const html=buildSchoolNotebook(bad,host);
 assert.doesNotMatch(html,/<img src=x onerror/);
 assert.match(html,/\\u003c\/script\\u003e/);
});
test('HTML host insertion is explicitly opt-in, never rewrites unmarked HTML',()=>{
 assert.throws(()=>buildSchoolNotebook(lesson,'<html><body>sin marcador</body></html>'),/marcador/);
 assert.throws(()=>buildSchoolNotebook(lesson,'<div id="clf-school-mount"></div>'),/body/);
});
test('School notebook module keeps its styles inside Shadow DOM only',()=>{
 const text=readFileSync(new URL('../runtime/school-notebook.js',import.meta.url),'utf8');
 assert.match(text,/attachShadow\(\{mode:'open'\}\)/);
 assert.doesNotMatch(text,/document\.head\.append/);
 assert.doesNotMatch(text,/\beval\(/);
});
