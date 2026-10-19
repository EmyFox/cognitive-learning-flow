import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {integrate} from '../scripts/integrate-html.mjs';
import {resources} from '../scripts/build-resources.mjs';
const lesson=JSON.parse(readFileSync('examples/pert-cpm.lesson.json','utf8'));
const ctx={console,setTimeout,clearTimeout};
runInNewContext(readFileSync('runtime/core.js','utf8'),ctx);
runInNewContext(readFileSync('runtime/kit.js','utf8'),ctx);
const core=ctx.CLFCore;
const timeline=core.compile(lesson);
test('semantic cue uses same timeline cursor as notebook and calculator',()=>{
 const at=timeline.events.findIndex(e=>e.type==='calcDone');
 const before=core.choreography(lesson,timeline,at);
 const after=core.choreography(lesson,timeline,at+1);
 assert.equal(before.expression,'(5+4*7+9)/6');
 assert.equal(after.verified,7);
 assert.equal(core.snapshot(lesson,timeline,at+1).calculator,'7');
 assert.equal(after.verb,'Calcular');
 assert.deepEqual(Array.from(after.targets),['E']);
});
test('rewind and replay reconstruct the same visual narration',()=>{
 const pos=timeline.ends[7];
 const a=core.choreography(lesson,timeline,pos);
 core.choreography(lesson,timeline,timeline.ends[2]);
 const b=core.choreography(lesson,timeline,pos);
 assert.deepEqual(a,b);
});
test('all semantic cues reference existing scenes and action indexes',()=>{
 for(let pos=0;pos<=timeline.events.length;pos++){
  const cue=core.choreography(lesson,timeline,pos);
  assert.ok(cue.reason && cue.goal);
  assert.ok(cue.sceneIndex>=0&&cue.sceneIndex<lesson.scenes.length);
  assert.ok(cue.actionIndex<lesson.scenes[cue.sceneIndex].actions.length);
 }
});
test('assessment mode does not expose solved cue or notebook content',()=>{
 const player=ctx.CLFKit.create(lesson,{mode:'assessment'});
 const state=player.getState();
 assert.equal(state.cue,null);
 assert.equal(state.snapshot.lines.length,0);
 assert.equal(state.snapshot.diagram,false);
 player.destroy();
});
test('guidance hides cue before solving checkpoint',()=>{
 const player=ctx.CLFKit.create(lesson,{mode:'guided'});
 player.reveal();player.next();player.reveal();player.next();
 assert.equal(player.getState().cue,null);
 assert.equal(player.answer('7'),true);
 assert.equal(player.getState().cue.expression,'(5+4*7+9)/6');
 player.destroy();
});
test('independent resource manifest includes all semantic widgets',()=>{
 assert.ok(ctx.CLFKit.resources.includes('reasoning'));
 assert.ok(ctx.CLFKit.resources.includes('formula'));
 assert.ok(ctx.CLFKit.resources.includes('data'));
});
test('host insertion does not introduce global styles or overwrite source',()=>{
 const host=readFileSync('examples/existing-page.html','utf8');
 const result=integrate(host,lesson);
 assert.ok(result.includes('data-clf="reasoning"'));
 assert.ok(result.includes('data-clf="formula"'));
 assert.ok(result.includes('data-clf="data"'));
 assert.ok(result.includes('Este encabezado, color y distribución'));
 assert.equal((result.match(/data-clf-integrated="true"/g)||[]).length,1);
});
test('onCue emits once per semantic action, not per calculator keystroke',()=>{
 const c=ctx.CLFKit.create(lesson);
 const cues=[];const stop=c.onCue(cue=>cues.push(cue.id));
 const keyAt=timeline.events.findIndex(e=>e.type==='key');
 const begin=timeline.events.findLastIndex((e,i)=>i<keyAt&&e.type==='cue');
 c.seek(begin+1);
 const cueCount=cues.length;
 c.seek(keyAt+1);
 c.seek(keyAt+2);
 assert.equal(cues.length,cueCount);
 const next=timeline.events.findIndex((e,i)=>i>keyAt&&e.type==='cue');
 c.seek(next+1);
 assert.equal(cues.length,cueCount+1);
 stop();c.destroy();
});
test('seekAction jumps to the intended semantic action with matching source metadata',()=>{
 const c=ctx.CLFKit.create(lesson);
 c.seekAction('03-pert',1,'start');
 const cue=c.getState().cue;
 assert.equal(cue.actionIndex,1);
 assert.equal(cue.verified,7);
 assert.equal(cue.reason,lesson.scenes[2].actions[1].why);
 c.seekAction('03-pert',1,'end');
 assert.equal(c.getState().snapshot.calculator,'7');
 assert.throws(()=>c.seekAction('bad',0));
 assert.throws(()=>c.seekAction('03-pert',100));
 c.destroy();
});
test('new widgets remain optional and keep the v0.3 API stable',()=>{
 const c=ctx.CLFKit.create(lesson);
 for(const key of ['mount','play','pause','seek','seekScene','seekSceneId','connectWorkflow','onChange','setMode','destroy'])
  assert.equal(typeof c[key],'function');
 for(const key of ['reasoning','formula','data'])assert.ok(c.resources.includes(key));
 c.destroy();
});

test('semantic animation payload is validated against an allowlist', async ()=>{
 const {validateLesson}=await import('../scripts/validate-lesson.mjs');
 const bad=structuredClone(lesson);bad.scenes[2].actions[0].animation={kind:'arbitrary-script'};
 assert.throws(()=>validateLesson(bad),/Coreografía inválida/);
 const good=structuredClone(lesson);validateLesson(good);
});
