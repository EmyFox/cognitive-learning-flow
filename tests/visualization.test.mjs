import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runInNewContext} from 'node:vm';
import {validateLesson} from '../scripts/validate-lesson.mjs';
import {resources} from '../scripts/build-resources.mjs';
import {integrate} from '../scripts/integrate-html.mjs';
const lesson=JSON.parse(readFileSync('examples/forecast-moving-average.lesson.json','utf8'));
function setup(){
 const ctx={console,clearTimeout,setTimeout};
 runInNewContext(readFileSync('runtime/core.js','utf8'),ctx);
 runInNewContext(readFileSync('runtime/kit.js','utf8'),ctx);
 return ctx;
}
function clone(){return structuredClone(lesson);}
test('forecast example solves independently and exposes three chart kinds',()=>{
 assert.equal(validateLesson(lesson).math,null);
 assert.equal(lesson.groundTruth.forecast,124);
 assert.deepEqual(lesson.visualizations.map(v=>v.kind),['bar','line','process']);
});
test('visualization snapshots unveil the forecast only after verification scene',()=>{
 const {CLFCore}=setup();
 const timeline=CLFCore.compile(lesson);
 const before=CLFCore.snapshot(lesson,timeline,timeline.ends[3]);
 assert.equal(before.visualization.id,'metodo');
 assert.equal(before.visualization.reveal,3);
 const after=CLFCore.snapshot(lesson,timeline,timeline.ends[4]);
 assert.equal(after.visualization.id,'tendencia');
 assert.equal(after.visualization.reveal,6);
 assert.deepEqual(Array.from(after.visualization.focus),['m6']);
 const rewound=CLFCore.snapshot(lesson,timeline,timeline.ends[1]);
 assert.equal(rewound.visualization.reveal,5);
 assert.equal(rewound.visualization.id,'tendencia');
 const again=CLFCore.snapshot(lesson,timeline,timeline.ends[4]);
 assert.deepEqual(after,again);
});
test('CLFKit isolates future points from assessment and guided modes',()=>{
 const {CLFKit}=setup();const app=CLFKit.create(lesson);
 app.seekSceneId('05-verificar');assert.equal(app.getState().snapshot.visualization.reveal,6);
 app.setMode('guided');assert.equal(app.getState().snapshot.visualization,null);
 app.setMode('assessment');assert.equal(app.getState().snapshot.visualization,null);
 app.destroy();
});
test('reject references to nonexisting chart',()=>{
 const bad=clone();bad.scenes[0].actions[1].visualizationId='ghost';
 assert.throws(()=>validateLesson(bad),/Visualización no encontrada/);
});
test('reject lookahead focus and revealing too many future points',()=>{
 const bad=clone();bad.scenes[0].actions[1].focus=['m6'];
 assert.throws(()=>validateLesson(bad),/Foco fuera/);
 const later=clone();later.scenes[1].actions[0].reveal=99;
 assert.throws(()=>validateLesson(later),/Cantidad revelada/);
});
test('reject falsified forecast and nonfinite data',()=>{
 const bad=clone();bad.groundTruth.forecast=160;
 assert.throws(()=>validateLesson(bad),/Pronóstico incorrecto/);
 const nonfinite=clone();nonfinite.visualizations[0].points[0].value=Infinity;
 assert.throws(()=>validateLesson(nonfinite),/no finito/);
});
test('reject duplicate point identifiers and invalid windows',()=>{
 const dup=clone();dup.visualizations[0].points[1].id='m1';
 assert.throws(()=>validateLesson(dup),/Punto inválido/);
 const bad=clone();bad.problem.window=6;
 assert.throws(()=>validateLesson(bad),/Ventana/);
});
test('custom renderer extension registers and deregisters without changing host DOM',()=>{
 const {CLFKit}=setup(); assert.ok(CLFKit.resources.includes('visualization'));
 assert.equal(CLFKit.version,'0.5.0');
 const callback=()=>{};
 const unregister=CLFKit.registerVisualization('heatmap',callback);
 assert.throws(()=>CLFKit.registerVisualization('bar',callback),/no se reemplaza/);
 assert.throws(()=>CLFKit.registerVisualization('a b',callback),/inválido/);
 unregister();
});
test('export and embedding include independent visualization resource',()=>{
 const dir=mkdtempSync(join(tmpdir(),'clf-viz-'));
 const manifest=resources(lesson,dir).manifest;
 assert.ok(manifest.resourceTypes.includes('visualization'));
 const html=integrate(readFileSync('examples/forecast-host.html','utf8'),lesson);
 assert.ok(html.includes('data-clf="visualization"'));
 assert.ok(html.includes('CLFKit.create'));
 assert.ok(html.includes('Pronóstico de demanda'));
 assert.ok(!html.includes('https://cdn.'));
});
