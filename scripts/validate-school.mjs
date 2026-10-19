#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function validateSchool(lesson){
  const context={};runInNewContext(readFileSync(resolve(ROOT,'runtime/line-balancing.js'),'utf8'),context);
  if(!lesson || typeof lesson.title!=='string' || !lesson.title.trim())throw Error('Título de la lección inválido');
  if(!lesson.id || !/^[a-z0-9-]+$/.test(lesson.id))throw Error('ID inválido');
  const output=context.CLFLineBalancing.solve(lesson);
  const expected=lesson.reference;
  if(expected){for(const [key,value] of Object.entries(expected)){
    if(typeof value==='number' && !(Math.abs(output[key]-value)<1e-6))throw Error('Referencia no coincide: '+key);
  }}
  return output;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
try{const p=resolve(process.argv[2]||resolve(ROOT,'examples/line-balancing.school.json'));const result=validateSchool(JSON.parse(readFileSync(p,'utf8')));console.log('Cuaderno verificado:',result.stations.length,'estaciones; CT',result.cycle,'s; eficiencia',Number((result.efficiency*100).toFixed(2))+'%');}catch(e){console.error('ERROR:',e.message);process.exitCode=1;}
}
