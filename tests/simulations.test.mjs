import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runInNewContext} from 'node:vm';
import {validateLesson} from '../scripts/validate-lesson.mjs';
import {resources} from '../scripts/build-resources.mjs';
import {integrate} from '../scripts/integrate-html.mjs';
const lesson=JSON.parse(readFileSync('examples/operations-lab.lesson.json','utf8'));
function setup(){
  const ctx={console,setTimeout,clearTimeout};
  for(const path of ['runtime/core.js','runtime/simulations.js','runtime/kit.js'])runInNewContext(readFileSync(path,'utf8'),ctx);
  return ctx;
}
const scenario=id=>lesson.simulations.find(s=>s.id===id);
const round=(v)=>Math.round(v*1e6)/1e6;
test('operations lesson validates with three mathematically grounded models',()=>{
  assert.equal(validateLesson(lesson).scenes,7);
  assert.equal(lesson.simulations.length,3);
  assert.equal(lesson.groundTruth.simulations.stock.annualRelevantCost,5600);
});
test('EOQ balances relevant costs at economic optimum',()=>{
  const {CLFSim}=setup(),stock=scenario('stock');
  const r=CLFSim.solve(stock),opt=r.metrics.eoq;
  assert.equal(r.metrics.annualRelevantCost,5600);
  assert.ok(Math.abs(opt-Math.sqrt(480000))<1e-9);
  const min=CLFSim.solve(stock,{orderQuantity:opt}).metrics.annualRelevantCost;
  assert.ok(min<r.metrics.annualRelevantCost);
  assert.ok(CLFSim.solve(stock,{orderQuantity:300}).metrics.annualRelevantCost>min);
  assert.ok(CLFSim.solve(stock,{orderQuantity:1100}).metrics.annualRelevantCost>min);
});
test('EOQ rejects invalid demand, holding costs and zero order quantity',()=>{
  const {CLFSim}=setup(),s=scenario('stock');
  for(const override of [{annualDemand:0},{holdingCost:0},{orderQuantity:-1},{workingDays:500}])
    assert.throws(()=>CLFSim.solve(s,override));
});
test('inventory stock stays within [0,Q] and goes through two cycles',()=>{
  const {CLFSim}=setup(),{series}=CLFSim.solve(scenario('stock'));
  assert.equal(series.length,61);
  assert.ok(series.every(x=>x.stock>=0&&x.stock<=600));
  assert.equal(round(series.at(0).stock),600);
  assert.equal(round(series.at(-1).stock),600);
});
test('queue theoretical Lq and Wq match M/M/1 theory',()=>{
  const {CLFSim}=setup(),r=CLFSim.solve(scenario('queue'));
  assert.equal(round(r.metrics.utilization),round(2/3));
  assert.equal(round(r.metrics.expectedQueueWait),round(1/3));
  assert.equal(round(r.metrics.expectedQueueSize),round(4/3));
  assert.ok(r.events.every(e=>e.start>=e.arrival&&e.finish>e.start));
});
test('queue seeded sample reproduces exactly and distinguishes theory',()=>{
  const {CLFSim}=setup(),s=scenario('queue');
  const a=CLFSim.solve(s),b=CLFSim.solve(s),c=CLFSim.solve(s,{seed:11});
  assert.equal(JSON.stringify(a.events),JSON.stringify(b.events));
  assert.notEqual(JSON.stringify(a.events),JSON.stringify(c.events));
  assert.notEqual(round(a.metrics.observedQueueWait),round(a.metrics.expectedQueueWait));
});
test('queue instability is disclosed, not assigned a misleading finite theoretical wait',()=>{
  const {CLFSim}=setup(),s=scenario('queue');
  for(const x of [{serviceRate:4},{serviceRate:3}]){
    const r=CLFSim.solve(s,x);assert.equal(r.stable,false);
    assert.equal(r.metrics.expectedQueueWait,null);
    assert.equal(r.metrics.expectedQueueSize,null);
    assert.ok(Number.isFinite(r.metrics.observedQueueWait));
  }
});
test('finite queue sensitivity breaks at unstable regime rather than connecting it',()=>{
  const {CLFSim}=setup();
  const result=CLFSim.sensitivity(scenario('queue'),'serviceRate',2,12,21);
  assert.equal(result.points[0].y,null);
  assert.ok(result.points.some(x=>Number.isFinite(x.y)));
});
test('station line preserves precedence and bottleneck capacity',()=>{
  const {CLFSim}=setup(),r=CLFSim.solve(scenario('line'));
  assert.equal(r.metrics.bottleneckMinutes,5);
  assert.equal(r.metrics.bottleneckStation,2);
  assert.equal(r.metrics.theoreticalCapacityPerHour,12);
  assert.equal(r.metrics.makespan,67);
  assert.ok(r.metrics.sampleThroughputPerHour<r.metrics.theoreticalCapacityPerHour);
  for(const job of r.jobs){
    for(let i=1;i<job.stations.length;i++)assert.ok(job.stations[i].start>=job.stations[i-1].end);
  }
  for(let j=1;j<r.jobs.length;j++)for(let k=0;k<r.jobs[j].stations.length;k++){
    assert.ok(r.jobs[j].stations[k].start>=r.jobs[j-1].stations[k].end);
  }
});
test('slowing production intake changes paced capacity but not machine bottleneck',()=>{
  const {CLFSim}=setup(),s=scenario('line');
  const slow=CLFSim.solve(s,{arrivalInterval:9});
  assert.equal(slow.metrics.bottleneckStation,2);
  assert.equal(slow.metrics.inputPacedCapacityPerHour,60/9);
  assert.ok(slow.metrics.makespan>67);
});
test('reject wrong simulation groundTruth and undefined scenario reference',()=>{
  const corrupted=structuredClone(lesson);corrupted.groundTruth.simulations.line.makespan=12;
  assert.throws(()=>validateLesson(corrupted),/Indicador de simulación incorrecto/);
  const ghost=structuredClone(lesson);ghost.scenes[0].actions[1].scenarioId='missing';
  assert.throws(()=>validateLesson(ghost),/Escenario no encontrado/);
});
test('reject invalid controls and oversized animation frame count',()=>{
  const wrong=structuredClone(lesson);wrong.simulations[0].controls[0].max=500;
  assert.throws(()=>validateLesson(wrong),/Valor inicial fuera de límites/);
  const more=structuredClone(lesson);more.scenes[0].actions[1].frames=10000;
  assert.throws(()=>validateLesson(more),/Fotogramas de simulación inválidos/);
});
test('scenario timeline can be rebuilt after seeking backwards',()=>{
  const {CLFCore}=setup(),timeline=CLFCore.compile(lesson);
  const at=CLFCore.snapshot(lesson,timeline,timeline.ends[3]);
  assert.equal(at.simulation.id,'queue');assert.equal(at.simulation.progress,1);
  const back=CLFCore.snapshot(lesson,timeline,timeline.ends[0]);
  assert.equal(back.simulation.id,'stock');
  const again=CLFCore.snapshot(lesson,timeline,timeline.ends[3]);
  assert.equal(JSON.stringify(again),JSON.stringify(at));
  assert.ok(timeline.events.some(e=>e.type==='simulationFrame'&&e.frame===0));
});
test('CLFKit scenario changes react to inputs and reset without mutating lesson',()=>{
  const {CLFKit}=setup(),app=CLFKit.create(lesson);
  assert.equal(app.getScenario().result.metrics.annualRelevantCost,5600);
  app.setScenarioParameter('orderQuantity',800);
  assert.equal(app.getScenario().parameters.orderQuantity,800);
  assert.equal(scenario('stock').parameters.orderQuantity,600);
  app.resetScenario();assert.equal(app.getScenario().parameters.orderQuantity,600);
  app.selectScenario('queue');assert.equal(app.getScenario().id,'queue');
  app.setScenarioParameter('serviceRate',4);assert.equal(app.getScenario().result.stable,false);
  assert.throws(()=>app.setScenarioParameter('serviceRate',100));
  app.destroy();
});
test('assessment must not expose simulations or metrics on state and reset clears choices',()=>{
  const {CLFKit}=setup(),app=CLFKit.create(lesson);
  app.selectScenario('queue');app.setMode('assessment');
  assert.equal(app.getState().simulation,null);
  assert.equal(app.getScenario(),null);
  assert.equal(app.selectScenario('stock'),false);
  app.setMode('demo');assert.equal(app.getScenario().id,'stock');app.destroy();
});
test('legacy lessons continue to render without simulations runtime injected',()=>{
  const {CLFKit}=setup();
  const old=JSON.parse(readFileSync('examples/pert-cpm.lesson.json','utf8'));
  const app=CLFKit.create(old);assert.equal(app.getScenario(),null);app.destroy();
});
test('resource export includes simulation runtime and independent mount types',()=>{
  const dir=mkdtempSync(join(tmpdir(),'clf-sim-'));
  const manifest=resources(lesson,dir).manifest;
  assert.equal(manifest.version,'0.11.0');
  assert.ok(manifest.resourceTypes.includes('simulation'));
  assert.ok(manifest.resourceTypes.includes('sensitivity'));
  assert.ok(readFileSync(join(dir,'clf-simulations.js'),'utf8').includes('CLFSim'));
  const host=readFileSync('examples/operations-host.html','utf8');
  const html=integrate(host,lesson);
  assert.match(html,/CLFSim/);
  assert.match(html,/data-clf="simulation"/);
  assert.doesNotMatch(html,/<script[^>]+src=/);
});
test('guided progressive hints count is bounded and resets after mode change',()=>{
  const {CLFKit}=setup(),app=CLFKit.create(lesson,{mode:'guided'});
  app.reveal();app.next();assert.equal(app.getState().sceneIndex,1);
  assert.equal(app.answer('3200'),false);
  app.hint();assert.equal(app.getState().guideHintLevel,1);
  app.hint();app.hint();assert.equal(app.getState().guideHintLevel,2);
  assert.equal(app.answer('5600'),true);
  app.setMode('demo');app.setMode('guided');
  assert.equal(app.getState().guideHintLevel,0);app.destroy();
});
test('validator rejects malformed hint ladders and misconception descriptions',()=>{
  const bad=structuredClone(lesson);bad.scenes[1].checkpoint.hints=[];
  assert.throws(()=>validateLesson(bad),/Pistas graduadas inválidas/);
  const wrong=structuredClone(lesson);wrong.scenes[1].checkpoint.misconceptions[0].feedback='';
  assert.throws(()=>validateLesson(wrong),/Diagnóstico inválido/);
});
