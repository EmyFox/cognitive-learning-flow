import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {integrate} from '../scripts/integrate-html.mjs';
import {resources} from '../scripts/build-resources.mjs';
import {mkdtempSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const root=new URL('../',import.meta.url);
const src=p=>readFileSync(new URL(p,root),'utf8');
const lesson=JSON.parse(src('examples/pert-cpm.lesson.json'));
function rafHarness(){
 let id=0,t=0,queue=new Map();const ctx={console,clearTimeout,setTimeout,performance:{now:()=>t},
 requestAnimationFrame(fn){queue.set(++id,fn);return id;},cancelAnimationFrame(n){queue.delete(n);}};
 for(const p of ['runtime/core.js','runtime/motion-clock.js','runtime/vector-ink.js','runtime/kit.js'])runInNewContext(src(p),ctx);
 return {ctx,frame(dt=16){t+=dt;const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn(t));},pending(){return queue.size}};
}
test('single-stroke vector plan reveals letters progressively and reversibly',()=>{
 const c={};runInNewContext(src('runtime/vector-ink.js'),c);const api=c.CLFVectorInk;
 const before=api.plan('CT=60',0);assert.ok(before.every(g=>g.visibility===0));
 const middle=api.plan('CT=60',.5);assert.ok(middle[0].visibility===1);assert.ok(middle.at(-1).visibility===0);
 const after=api.plan('CT=60',1);assert.ok(after.every(g=>g.visibility===1));
 assert.ok(after.every(g=>g.d && /M/.test(g.d)));
 assert.equal(api.normalizeText(' A \n B '),' A B ');
});
test('vector renderer uses safe SVG paths, retains source text, has no HTML injection',()=>{
 const source=src('runtime/vector-ink.js');
 assert.doesNotMatch(source,/innerHTML|eval\(|new Function\(/);
 assert.match(source,/createElementNS/);
 const c={};runInNewContext(source,c);
 assert.ok(c.CLFVectorInk.plan('<script>',1).every(g=>g.d));
});
test('modular kit advances on requestAnimationFrame, pauses and seeks without timers',()=>{
 const h=rafHarness(),c=h.ctx.CLFKit.create(lesson);let emitted=0;
 c.onChange(()=>emitted++);c.play();assert.equal(h.pending(),1);
 for(let i=0;i<30;i++)h.frame(16);
 const current=c.getState().cursor;assert.ok(current>0);assert.ok(emitted>0);
 c.pause();assert.equal(h.pending(),0);for(let i=0;i<30;i++)h.frame(16);assert.equal(c.getState().cursor,current);
 c.seekScene(3);assert.equal(c.getState().sceneIndex,3);
 c.seek(0);assert.equal(c.getState().snapshot.lines.length,0);
 c.setMode('assessment');c.play();assert.equal(h.pending(),0);
 c.destroy();assert.equal(h.pending(),0);
});
test('two modular controllers use independent clocks and release callbacks on destroy',()=>{
 const h=rafHarness(),a=h.ctx.CLFKit.create(lesson),b=h.ctx.CLFKit.create(lesson);
 a.play();assert.equal(h.pending(),1);for(let i=0;i<24;i++)h.frame(16);
 assert.ok(a.getState().cursor>0);assert.equal(b.getState().cursor,0);
 b.play();assert.equal(h.pending(),2);a.destroy();assert.equal(h.pending(),1);
 b.destroy();assert.equal(h.pending(),0);
});
test('optimized semantic checkpoints cannot be mutated by an external snapshot',()=>{
 const ctx={};runInNewContext(src('runtime/core.js'),ctx);
 const c=ctx.CLFCore,events=c.compile(lesson);let end=events.events.length;
 for(let i=64;i<=end;i+=64)c.snapshot(lesson,events,i);
 const at=c.snapshot(lesson,events,Math.min(256,end));const original=structuredClone(JSON.parse(JSON.stringify(at)));
 at.lines.push({scene:999,text:'manipulación'});at.highlights.push('Z');at.visualization={id:'fabricated',focus:[]};
 const after=c.snapshot(lesson,events,Math.min(256,end));assert.equal(JSON.stringify(after),JSON.stringify(original));
 const fromStart=c.snapshot(lesson,{events:events.events,ends:events.ends},Math.min(256,end));assert.equal(JSON.stringify(after),JSON.stringify(fromStart));
});
test('export embeds shared clock and SVG ink before kit in both packaging modes',()=>{
 const host=src('examples/existing-page.html');const html=integrate(host,lesson);
 const pos=['CLFMotion=','CLFVectorInk=','CLFKit='].map(v=>html.indexOf(v));
 assert.ok(pos.every(v=>v>0));assert.ok(pos[0]<pos[1]&&pos[1]<pos[2]);
 const directory=mkdtempSync(join(tmpdir(),'clf-smooth-'));resources(lesson,directory);
 for(const n of ['clf-motion.js','clf-vector-ink.js','clf-kit.js'])assert.ok(existsSync(join(directory,n)));
 assert.match(readFileSync(join(directory,'example-host.html'),'utf8'),/clf-vector-ink\.js/);
});
