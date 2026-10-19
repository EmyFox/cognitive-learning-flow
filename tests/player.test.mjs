import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildHtml} from '../scripts/build-html.mjs';
const context={};
runInNewContext(readFileSync('runtime/core.js','utf8'),context);
const core=context.CLFCore;
const lesson=JSON.parse(readFileSync('examples/pert-cpm.lesson.json','utf8'));
test('calculator supports operator precedence and parentheses',()=>{
  assert.equal(core.calculate('5+4*7'),33);
  assert.equal(core.calculate('(5+4*7+9)/6'),7);
  assert.equal(core.calculate('24−2'),22);
  assert.equal(core.calculate('2/(1+1)'),1);
});
test('calculator refuses executable text and division by zero',()=>{
  for(const bad of ['alert(1)','process.exit(1)','2/0','1+','1..2']) assert.throws(()=>core.calculate(bad));
});
test('timeline snapshots reconstruct identical states on repeated seeks',()=>{
  const timeline=core.compile(lesson);
  const at8=core.snapshot(lesson,timeline,timeline.ends[7]);
  const at3=core.snapshot(lesson,timeline,timeline.ends[2]);
  const again=core.snapshot(lesson,timeline,timeline.ends[7]);
  assert.deepEqual(at8,again);
  assert.equal(at3.sceneIndex,2);
  assert.equal(at8.calculator,'24');
  assert.ok(at8.lines.some(x=>x.text.includes('ruta crítica')));
  assert.deepEqual(Array.from(at8.highlights),['A','C','E','F','G','I']);
});
test('incomplete text animation is preserved character by character',()=>{
  const timeline=core.compile(lesson);
  const line=timeline.events.findIndex(e=>e.type==='line');
  const s=core.snapshot(lesson,timeline,line+4);
  assert.equal(s.lines[0].text.length,3);
});
test('numeric checkpoints require parsable finite values and tolerance',()=>{
  assert.equal(core.checkNumeric('7,000',7,0.01),true);
  assert.equal(core.checkNumeric('6.99',7,0.001),false);
  assert.equal(core.checkNumeric('7anything',7,0.001),false);
  assert.equal(core.checkNumeric('',0,0.001),false);
});
test('single-file HTML includes all scripts, no network references, and escaped input',()=>{
  const result=buildHtml(lesson);
  assert.match(result,/CLF_LESSON/);
  assert.match(result,/id="quiz"/);
  assert.match(result,/id="network"/);
  assert.doesNotMatch(result,/<script[^>]+src=/);
  const poisoned=structuredClone(lesson);
  poisoned.problem.statement='Peligro </script><script>alert(1)</script>';
  const safe=buildHtml(poisoned);
  assert.doesNotMatch(safe,/<script>alert\(1\)<\/script>/);
  assert.match(safe,/\\u003c\/script\\u003e/);
});
