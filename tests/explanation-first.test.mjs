import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {build} from '../scripts/build-mental-tutor.mjs';
const lesson=JSON.parse(readFileSync('examples/eoq-mental-tutor.json','utf8'));
function start(options){const ctx={Intl,setTimeout,clearTimeout};runInNewContext(readFileSync('runtime/mental-steps.js','utf8'),ctx);runInNewContext(readFileSync('runtime/mental-tutor.js','utf8'),ctx);return {core:ctx.CLFMental,tutor:ctx.CLFMentalTutor,controller:ctx.CLFMentalTutor.create(lesson,options)};}
test('Default mode explains immediately and navigation never waits for an answer',()=>{
 const {controller}=start();
 assert.equal(controller.getState().mode,'study');
 assert.equal(controller.getState().solved,true);
 assert.equal(controller.getState().progress,5);
 for(let i=1;i<20;i++){assert.equal(controller.next(),true);assert.equal(controller.getState().index,i);assert.equal(controller.getState().solved,true);}
 assert.equal(controller.getState().progress,100);
 assert.equal(controller.go(2),true);
 assert.equal(controller.getState().index,2);
 controller.destroy();
});
test('Practice is disabled unless explicitly enabled by the caller',()=>{
 const {controller}=start();
 assert.throws(()=>controller.setMode('practice'),/no habilitada/i);
 const answer=controller.answer('irrelevant');assert.equal(answer.correct,false);
 assert.equal(controller.getState().index,0);
 controller.destroy();
 const opted=start({allowPractice:true}).controller;
 opted.setMode('practice');assert.equal(opted.getState().mode,'practice');assert.equal(opted.getState().solved,false);opted.destroy();
});
test('Purely explanatory lessons do not need question schemas',()=>{
 const ctx={Intl};runInNewContext(readFileSync('runtime/mental-steps.js','utf8'),ctx);
 const item=structuredClone(lesson);
 for(const step of item.steps){delete step.check;delete step.prompt;delete step.preview;}
 assert.equal(ctx.CLFMental.compile(item).steps.length,20);
 const html=build(item);
 assert.match(html,/CLFMentalTutor\.create/);
 const tutorCtx={Intl};runInNewContext(readFileSync('runtime/mental-steps.js','utf8'),tutorCtx);runInNewContext(readFileSync('runtime/mental-tutor.js','utf8'),tutorCtx);
 assert.equal(tutorCtx.CLFMentalTutor.create(item).getState().solved,true);
 assert.throws(()=>tutorCtx.CLFMentalTutor.create(item,{allowPractice:true}),/reactivos/i);
});
test('Playback starts, pauses, and resets at the end without asking anything',()=>{
 const {controller}=start();
 assert.equal(controller.play(),true);assert.equal(controller.getState().playing,true);
 controller.pause();assert.equal(controller.getState().playing,false);
 controller.setSpeed(1.5);assert.equal(controller.getState().speed,1.5);
 assert.throws(()=>controller.setSpeed(22),/Velocidad/);
 controller.go(19);assert.equal(controller.getState().index,19);
 controller.play();assert.equal(controller.getState().index,0);
 controller.destroy();
});
test('Default exported lesson renders explanatory instructions without a required practice option',()=>{
 const html=build(lesson);
 assert.match(html,/CLASE PASO A PASO · SIN PREGUNTAS/);
 assert.match(html,/POR QUÉ VAMOS EN ESTE ORDEN/);
 assert.match(html,/Reproducir explicación/);
});
