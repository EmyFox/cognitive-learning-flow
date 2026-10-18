import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { arithmetic,solvePert,normalCdf,validateLesson } from '../scripts/validate-lesson.mjs';

const source=JSON.parse(readFileSync(new URL('../examples/pert-cpm.lesson.json',import.meta.url),'utf8'));
const copy=()=>structuredClone(source);

test('calculator expression parser obeys precedence and grouping',()=>{
  assert.equal(arithmetic('(5+4*7+9)/6'),7);
  assert.equal(arithmetic('24-2'),22);
  assert.equal(arithmetic('-2*3+10'),4);
  assert.equal(arithmetic('3+5+7+3+4+2'),24);
});
test('parser rejects injection and invalid operations',()=>{
  assert.throws(()=>arithmetic('process.exit(1)'));
  assert.throws(()=>arithmetic('3/0'),/División por cero/);
  assert.throws(()=>arithmetic('2..3'),/inválido/);
});
test('reference problem duration and critical path',()=>{
  const result=solvePert(source.problem.activities);
  assert.equal(result.duration,24);
  assert.deepEqual(result.paths,[['A','C','E','F','G','I']]);
  assert.equal(result.activities.get('F').ES,15);
  assert.equal(result.activities.get('H').float,13);
  assert.equal(result.activities.get('B').float,2);
});
test('normal PERT deadline probability',()=>{
  const p=normalCdf((26-24)/Math.sqrt(5/3));
  assert.ok(Math.abs(p-0.9394)<0.001);
});
test('valid reference lesson',()=>{
  assert.equal(validateLesson(copy()).math.duration,24);
});
test('rejects wrong project duration',()=>{
  const l=copy();l.groundTruth.expectedDuration=21;
  assert.throws(()=>validateLesson(l),/Duración/);
});
test('rejects graph cycle',()=>{
  const l=copy();l.problem.activities.find(a=>a.id==='A').predecessors=['I'];
  assert.throws(()=>validateLesson(l),/ciclo/);
});
test('rejects unknown predecessor',()=>{
  const l=copy();l.problem.activities[0].predecessors=['UNKNOWN'];
  assert.throws(()=>validateLesson(l),/Predecesora inexistente/);
});
test('rejects invalid PERT estimates',()=>{
  const l=copy();l.problem.activities[0].optimistic=999;
  assert.throws(()=>validateLesson(l),/0 ≤ a ≤ m ≤ b/);
});
test('detects multiple critical paths',()=>{
  const rows=[
    {id:'A',predecessors:[],optimistic:2,mostLikely:2,pessimistic:2},
    {id:'B',predecessors:['A'],optimistic:3,mostLikely:3,pessimistic:3},
    {id:'C',predecessors:['A'],optimistic:3,mostLikely:3,pessimistic:3},
  ];
  const result=solvePert(rows);
  assert.equal(result.duration,5);
  assert.deepEqual(result.paths,[['A','B'],['A','C']]);
});
test('rejects calculator keys diverging from expression',()=>{
  const l=copy();l.scenes.find(s=>s.id==='03-pert').actions.find(a=>a.type==='calculator').keys=['9','='];
  assert.throws(()=>validateLesson(l),/Teclas no coinciden/);
});
test('rejects changed route',()=>{
  const l=copy();l.groundTruth.criticalPaths=[['A','B','D','F','G','I']];
  assert.throws(()=>validateLesson(l),/Rutas críticas/);
});
