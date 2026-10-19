import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildHtml} from '../scripts/build-html.mjs';
import {resources} from '../scripts/build-resources.mjs';
import {mkdtempSync,readFileSync as read,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const lesson=JSON.parse(readFileSync('examples/pert-cpm.lesson.json','utf8'));
const setup=()=>{
 const ctx={console,clearTimeout,setTimeout};
 runInNewContext(readFileSync('runtime/core.js','utf8'),ctx);
 runInNewContext(readFileSync('runtime/kit.js','utf8'),ctx);
 return ctx.CLFKit;
};
test('school notebook is the default for any new kit resource',()=>{
 const kit=setup();
 assert.equal(kit.defaultTheme,'school-notebook');
 assert.equal(kit.version,'0.11.0');
 assert.deepEqual(Array.from(kit.themes),['school-notebook','neutral']);
 const controller=kit.create(lesson);
 assert.equal(controller.getState().theme,'school-notebook');
 assert.equal(controller.getState().sceneIndex,0);
 controller.destroy();
});
test('neutral theme and dynamic switching preserve all mathematical state',()=>{
 const kit=setup();const controller=kit.create(lesson,{theme:'neutral'});
 controller.seekScene(7);
 const before=controller.getState();
 assert.equal(before.snapshot.calculator,'24');
 controller.setTheme('school-notebook');
 const after=controller.getState();
 assert.equal(after.theme,'school-notebook');
 assert.equal(after.cursor,before.cursor);
 assert.deepEqual(after.snapshot,before.snapshot);
 controller.setTheme('neutral');
 assert.equal(controller.getState().cursor,before.cursor);
 assert.throws(()=>controller.setTheme('unknown'),/Tema desconocido/);
 assert.throws(()=>kit.create(lesson,{theme:'nope'}),/Tema desconocido/);
 controller.destroy();
});
test('theme switch triggers change listener without losing current mode',()=>{
 const kit=setup(),controller=kit.create(lesson,{mode:'guided'});
 let last;
 const off=controller.onChange(s=>last=s);
 controller.setTheme('neutral');
 assert.equal(last.theme,'neutral');
 assert.equal(last.mode,'guided');
 assert.equal(last.guideSolved,false);
 off();controller.destroy();
});
test('full page HTML uses school notebook by default and neutral as opt-out',()=>{
 const school=buildHtml(lesson),neutral=buildHtml(lesson,{theme:'neutral'});
 assert.match(school,/school-notebook for the optional full-page/);
 assert.match(school,/#e9e6de;color:var\(--text\)/);
 assert.doesNotMatch(neutral,/school-notebook for the optional full-page/);
 assert.match(neutral,/color-scheme:dark/);
 assert.throws(()=>buildHtml(lesson,{theme:'other'}),/Tema desconocido/);
});
test('resource manifest declares default theme and generated code is self-contained',()=>{
 const dir=mkdtempSync(join(tmpdir(),'clf-theme-'));
 const exported=resources(lesson,dir);
 assert.equal(exported.manifest.defaultTheme,'school-notebook');
 assert.equal(exported.manifest.themes.length,2);
 assert.ok(existsSync(join(dir,'clf-kit.js')));
 assert.match(read(join(dir,'clf-kit.js'),'utf8'),/school-notebook/);
});
