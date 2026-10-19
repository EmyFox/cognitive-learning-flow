import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildSchoolNotebook} from '../scripts/build-school-demo.mjs';
const root = new URL('../',import.meta.url);
const file=(p)=>readFileSync(new URL(p,root),'utf8');
const context={};
runInNewContext(file('runtime/core.js'),context);
runInNewContext(file('runtime/ink-choreography.js'),context);
runInNewContext(file('runtime/line-balancing.js'),context);
runInNewContext(file('runtime/school-notebook.js'),context);
const lesson=JSON.parse(file('examples/line-balancing.school.json'));
const result=context.CLFLineBalancing.solve(lesson);
const stages=context.CLFSchoolNotebook.previewStages(lesson,result);
const timeline=context.CLFSchoolNotebook.compileStages(stages);
test('ink validates a symbolic expression against an independently computed result',()=>{
 assert.equal(context.CLFInk.verify(stages[1].equation,context.CLFCore.calculate),60);
 assert.throws(()=>context.CLFInk.verify({...stages[1].equation,computed:61},context.CLFCore.calculate),/contradice/);
 assert.throws(()=>context.CLFInk.verify({...stages[1].equation,expression:'process.exit(1)'},context.CLFCore.calculate));
});
test('theoretical lower bound explicitly rounds up',()=>{
 assert.equal(context.CLFInk.verify(stages[3].equation,context.CLFCore.calculate),4);
});
test('three phases hide future results until the matching event',()=>{
 const eq=stages[1].equation;
 const show=phase=>Array.from(context.CLFInk.project(eq,phase).parts,v=>v.visible);
 assert.deepEqual(show(0),[false,false,false]);assert.deepEqual(show(1),[true,false,false]);
 assert.deepEqual(show(2),[true,true,false]);assert.deepEqual(show(3),[true,true,true]);
 assert.equal(context.CLFInk.project(eq,2).insight,'');
 assert.match(context.CLFInk.project(eq,3).insight,/Cada estación/);
});
test('same cursor reconstructs same lesson state regardless of seeking history',()=>{
 const n=timeline.ends[2];
 const before=context.CLFSchoolNotebook.snapshot(timeline,n);
 context.CLFSchoolNotebook.snapshot(timeline,5);
 const after=context.CLFSchoolNotebook.snapshot(timeline,n);
 assert.deepEqual(before,after);assert.equal(before.equationPhase,3);
});
test('equation phases have independent timeline events before calculator result',()=>{
 const index=timeline.events.findIndex(e=>e.type==='scene'&&e.scene===1);
 const slice=timeline.events.slice(index,timeline.ends[1]);
 const phases=slice.filter(e=>e.type==='equation').map(e=>e.phase);
 assert.deepEqual(Array.from(phases),[1,2,3]);
 assert.ok(slice.findIndex(e=>e.type==='result')<slice.findIndex(e=>e.type==='equation'&&e.phase===3));
});
test('station cannot appear before its station event',()=>{
 const idx=timeline.events.findIndex(e=>e.type==='station'&&e.station===1);
 assert.equal(context.CLFSchoolNotebook.snapshot(timeline,idx).station,0);
 assert.equal(context.CLFSchoolNotebook.snapshot(timeline,idx+1).station,1);
});
test('stroke underline follows deterministic progress and is clamped',()=>{
 assert.equal(context.CLFInk.underline(0),100);
 assert.equal(context.CLFInk.underline(.5),50);
 assert.equal(context.CLFInk.underline(1),0);
 assert.equal(context.CLFInk.underline(5),0);
});
test('all generated stage equations are verified after a demand change',()=>{
 for(const demand of [400,480,600]){
  const scenario={...lesson,demand};const model=context.CLFLineBalancing.solve(scenario);
  for(const stage of context.CLFSchoolNotebook.previewStages(scenario,model))if(stage.equation)context.CLFInk.verify(stage.equation,context.CLFCore.calculate);
 }
});
test('standalone generator embeds the independent ink module with isolated Shadow DOM',()=>{
 const html=buildSchoolNotebook(lesson,file('examples/school-notebook-host.html'));
 assert.match(html,/CLFInk/);assert.match(html,/equation-board/);assert.match(html,/id="scrub"/);assert.match(html,/attachShadow/);
 assert.doesNotMatch(html,/<script[^>]+src=/);
});
