import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

function harness(reduced=false){
 let time=0,queue=new Map(),id=0,paints=[];
 const h={
  requestAnimationFrame(fn){const n=++id;queue.set(n,fn);return n;},
  cancelAnimationFrame(n){queue.delete(n);},
  performance:{now:()=>time},
 };
 runInNewContext(readFileSync(new URL('../runtime/motion-clock.js',import.meta.url),'utf8'),h);
 function step(dt=16){time+=dt;const batch=[...queue.entries()];queue.clear();for(const [_,fn] of batch)fn(time);}
 const events=[{type:'scene'},{type:'glyph'},{type:'glyph'},{type:'key'},{type:'equation'}];
 const clock=h.CLFMotion.createClock({events,reduced,onCursor:(position)=>paints.push(position),raf:h.requestAnimationFrame,cancel:h.cancelAnimationFrame,now:()=>time});
 return {clock,step,paints,pending:()=>queue.size};
}
test('motion clock waits for real frame time, not a setTimeout-per-character loop',()=>{
 const h=harness();h.clock.play();h.step(16);assert.equal(h.clock.getState().cursor,0);
 for(let i=0;i<20;i++)h.step(16);
 assert.ok(h.clock.getState().cursor>0);assert.ok(h.clock.getState().cursor<5);h.clock.destroy();
});
test('pause retains exact cursor and fractional progress and cancels scheduled frames',()=>{
 const h=harness();h.clock.play();for(let i=0;i<19;i++)h.step();const before=h.clock.getState();h.clock.pause();
 assert.equal(h.pending(),0);for(let i=0;i<10;i++)h.step(16);assert.equal(h.clock.getState().cursor,before.cursor);assert.equal(h.clock.getState().progress,before.progress);
 h.clock.play();for(let i=0;i<16;i++)h.step();assert.ok(h.clock.getState().cursor>before.cursor);h.clock.destroy();
});
test('seek never reveals future events and a replay is reproducible',()=>{
 const h=harness();h.clock.seek(2);assert.equal(h.clock.getState().cursor,2);
 h.clock.seek(0);assert.equal(h.clock.getState().cursor,0);
 h.clock.play();for(let i=0;i<75;i++)h.step();assert.equal(h.clock.getState().cursor,5);
 h.clock.seek(1);assert.equal(h.clock.getState().cursor,1);h.clock.destroy();
});
test('speed changes timing without changing mathematical event ordering',()=>{
 const fast=harness(),slow=harness();fast.clock.setSpeed(2);slow.clock.setSpeed(.5);
 fast.clock.play();slow.clock.play();for(let i=0;i<18;i++){fast.step();slow.step();}
 assert.ok(fast.clock.getState().cursor>slow.clock.getState().cursor);
 assert.throws(()=>slow.clock.setSpeed(8),/Velocidad/);
 fast.clock.destroy();slow.clock.destroy();
});
test('reduced motion advances semantics rapidly but preserves a finite frame budget',()=>{
 const h=harness(true);h.clock.play();h.step(16);h.step(16);assert.equal(h.clock.getState().cursor,5);assert.equal(h.pending(),0);h.clock.destroy();
});
test('clock is idempotent on repeated play and does not catch up a hidden tab all at once',()=>{
 const h=harness();h.clock.play();h.clock.play();assert.equal(h.pending(),1);h.step();h.step(25000);assert.equal(h.clock.getState().cursor,0);h.clock.destroy();assert.equal(h.pending(),0);assert.throws(()=>h.clock.play(),/destruido/);
});
test('offline HTML embeds motion clock before the school notebook and remains dependency free',async()=>{
 const {buildSchoolNotebook}=await import('../scripts/build-school-demo.mjs');
 const lesson=JSON.parse(readFileSync(new URL('../examples/line-balancing.school.json',import.meta.url),'utf8'));
 const host=readFileSync(new URL('../examples/school-notebook-host.html',import.meta.url),'utf8');
 const html=buildSchoolNotebook(lesson,host);
 assert.ok(html.indexOf('CLFMotion=')<html.indexOf('CLFSchoolNotebook='));
 assert.doesNotMatch(html,/<script[^>]+src=/);
 assert.match(html,/requestAnimationFrame/);
});

test('cached snapshots match complete replay for every stage boundary and arbitrary cursors',()=>{
 const context={};for(const file of ['runtime/core.js','runtime/ink-choreography.js','runtime/line-balancing.js','runtime/motion-clock.js','runtime/school-notebook.js'])runInNewContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),context);
 const lesson=JSON.parse(readFileSync(new URL('../examples/line-balancing.school.json',import.meta.url),'utf8'));
 const model=context.CLFLineBalancing.solve(lesson);
 const lessonStages=context.CLFSchoolNotebook.previewStages(lesson,model);
 const compiled=context.CLFSchoolNotebook.compileStages(lessonStages);
 assert.ok(compiled.checkpoints.length>3);
 const uncached={...compiled,checkpoints:[]};
 for(const cursor of [...compiled.starts,...compiled.ends,0,1,63,64,65,128,compiled.events.length-1]){
  assert.deepEqual(context.CLFSchoolNotebook.snapshot(compiled,cursor),context.CLFSchoolNotebook.snapshot(uncached,cursor));
 }
});
test('changing a returned snapshot cannot corrupt checkpoint states',()=>{
 const context={};for(const file of ['runtime/core.js','runtime/ink-choreography.js','runtime/line-balancing.js','runtime/motion-clock.js','runtime/school-notebook.js'])runInNewContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),context);
 const lesson=JSON.parse(readFileSync(new URL('../examples/line-balancing.school.json',import.meta.url),'utf8'));
 const compiled=context.CLFSchoolNotebook.compileStages(context.CLFSchoolNotebook.previewStages(lesson,context.CLFLineBalancing.solve(lesson)));
 const cursor=compiled.ends[7];const baseline=context.CLFSchoolNotebook.snapshot(compiled,cursor);
 const altered=context.CLFSchoolNotebook.snapshot(compiled,cursor);altered.lines.push('trampa');altered.focus.push('X');
 assert.deepEqual(context.CLFSchoolNotebook.snapshot(compiled,cursor),baseline);
});
