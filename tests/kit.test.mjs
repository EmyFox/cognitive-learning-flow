import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runInNewContext} from 'node:vm';
import {resources} from '../scripts/build-resources.mjs';
import {integrate} from '../scripts/integrate-html.mjs';
const lesson=JSON.parse(readFileSync('examples/pert-cpm.lesson.json','utf8'));
function setup(){const ctx={console,clearTimeout,setTimeout};runInNewContext(readFileSync('runtime/core.js','utf8'),ctx);runInNewContext(readFileSync('runtime/kit.js','utf8'),ctx);return ctx.CLFKit;}
test('Kit is a separate resource controller with no forced page layout',()=>{
 const kit=setup();assert.equal(kit.version,'0.6.0');assert.ok(kit.resources.includes('notebook'));
 const c=kit.create(lesson);assert.equal(c.getState().mode,'demo');assert.equal(c.getState().cursor,0);
 c.seekScene(7);assert.equal(c.getState().snapshot.calculator,'24');
 c.seek(0);assert.equal(c.getState().snapshot.lines.length,0);
 c.seekSceneId(lesson.scenes[2].id);assert.equal(c.getState().sceneIndex,2);
 assert.throws(()=>c.seekSceneId('not-here'));c.destroy();assert.throws(()=>c.play());
});
test('Kit isolates demo notes when switching to guided and assessment',()=>{
 const c=setup().create(lesson);c.seekScene(7);assert.ok(c.getState().snapshot.lines.length>0);
 c.setMode('guided');assert.equal(c.getState().snapshot.lines.length,0);assert.equal(c.getState().guideSolved,false);
 c.setMode('assessment');assert.equal(c.getState().snapshot.lines.length,0);
 assert.deepEqual(Object.keys(c.getState().examAnswers),[]);c.destroy();
});
test('Guided requires checkpoint correctness before showing worked notes',()=>{
 const c=setup().create(lesson,{mode:'guided'});c.reveal();assert.equal(c.getState().guideSolved,true);
 c.next();c.reveal();c.next();assert.equal(c.getState().sceneIndex,2);
 assert.equal(c.answer('999'),false);assert.equal(c.getState().guideSolved,false);
 c.hint();assert.equal(c.getState().guideHint,true);
 assert.equal(c.answer('7'),true);assert.equal(c.getState().guideSolved,true);c.destroy();
});
test('Assessment answers remain sealed before submission, and reset on mode switch',()=>{
 const c=setup().create(lesson,{mode:'assessment'});const q=lesson.assessment.items[0];
 c.selectAnswer(q.id,q.correctOptionId);assert.equal(c.getState().submitted,false);
 const score=c.submit();assert.equal(score.correct,1);assert.equal(score.total,lesson.assessment.items.length);
 c.setMode('demo');c.setMode('assessment');assert.equal(c.getState().submitted,false);assert.equal(Object.keys(c.getState().examAnswers).length,0);c.destroy();
});
test('Workflow adapter listens only to requested events, maps IDs and disconnects on destroy',()=>{
 const c=setup().create(lesson);const handlers=new Map();const fake={addEventListener:(e,fn)=>handlers.set(e,fn),removeEventListener:(e)=>handlers.delete(e)};
 const dispose=c.connectWorkflow({target:fake,eventName:'app:step'});
 handlers.get('app:step')({detail:{sceneId:lesson.scenes[4].id}});assert.equal(c.getState().sceneIndex,4);
 c.setMode('assessment');handlers.get('app:step')({detail:{sceneIndex:1}});assert.equal(c.getState().mode,'assessment');
 dispose();assert.equal(handlers.size,0);const other=c.connectWorkflow({target:fake});c.destroy();assert.equal(handlers.size,0);
});
test('Separate resources export has no implicit layout or network dependencies',()=>{
 const dir=mkdtempSync(join(tmpdir(),'clf-kit-'));const out=resources(lesson,dir);
 assert.equal(out.manifest.resourceTypes.length,15);
 for(const f of ['clf-core.js','clf-kit.js','clf-lesson.js','manifest.json','example-host.html'])assert.ok(readFileSync(join(dir,f),'utf8').length>50);
 const poisoned=structuredClone(lesson);poisoned.problem.statement='</script><script>alert(4)</script>';
 resources(poisoned,dir);assert.doesNotMatch(readFileSync(join(dir,'clf-lesson.js'),'utf8'),/<script>alert\(4\)<\/script>/);
});
test('HTML integration preserves host layout and adds only inline script at body end',()=>{
 const host=readFileSync('examples/existing-page.html','utf8');const output=integrate(host,lesson);
 assert.ok(output.startsWith(host.slice(0,host.toLowerCase().lastIndexOf('</body>'))));
 assert.match(output,/data-clf-integrated="true"/);assert.match(output,/CLFKit\.create/);
 assert.match(output,/document\.dispatchEvent\(new CustomEvent\('clf:ready'/);
 assert.doesNotMatch(output,/<style>[^<]*--clf-/);
 assert.throws(()=>integrate(output,lesson),/ya tiene integración/);
 assert.throws(()=>integrate('<html><body>Vacío</body></html>',lesson),/data-clf/);
 assert.throws(()=>integrate('<html><body><div data-clf="desconocido"><\/div><\/body><\/html>',lesson),/desconocido/);
});
test('Multi-player controllers maintain independent cursors and subscriptions',()=>{
 const kit=setup(),a=kit.create(lesson),b=kit.create(lesson);let called=0;
 const detach=a.onChange(()=>called++);a.seekScene(3);assert.ok(called>0);assert.equal(b.getState().cursor,0);
 detach();const prev=called;a.seekScene(4);assert.equal(called,prev);
 a.destroy();b.destroy();
});
