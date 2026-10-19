#!/usr/bin/env node
/** Export autonomous lesson resources without prescribing host layout. */
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve,dirname,basename,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateLesson} from './validate-lesson.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const types=['notebook','calculator','diagram','controls','steps','transcript','guided','assessment','status','reasoning','formula','data','visualization','simulation','sensitivity'];
export function safeData(data) {
  return JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
export function resources(lesson,directory){
  validateLesson(lesson);
  const dest=resolve(directory);mkdirSync(dest,{recursive:true});
  copyFileSync(join(ROOT,'runtime/core.js'),join(dest,'clf-core.js'));
  copyFileSync(join(ROOT,'runtime/simulations.js'),join(dest,'clf-simulations.js'));
  copyFileSync(join(ROOT,'runtime/motion-clock.js'),join(dest,'clf-motion.js'));
  copyFileSync(join(ROOT,'runtime/vector-ink.js'),join(dest,'clf-vector-ink.js'));
  copyFileSync(join(ROOT,'runtime/kit.js'),join(dest,'clf-kit.js'));
  writeFileSync(join(dest,'clf-lesson.js'),'globalThis.CLF_RESOURCE_LESSON='+safeData(lesson)+';\n');
  const manifest={version:'0.11.0',defaultTheme:'school-notebook',themes:['school-notebook','neutral'],title:lesson.title,lessonId:lesson.id||'lesson',resourceTypes:types,
    files:['clf-core.js','clf-simulations.js','clf-motion.js','clf-vector-ink.js','clf-kit.js','clf-lesson.js'],
    mount:'const app=CLFKit.create(CLF_RESOURCE_LESSON); app.mount("notebook",document.querySelector("#my-notebook"));',
    warning:'El proyecto anfitrión decide qué componentes montar y en qué lugar. No se modifica su CSS.'};
  writeFileSync(join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  const script='<script src="./clf-core.js"></script><script src="./clf-simulations.js"></script><script src="./clf-motion.js"></script><script src="./clf-vector-ink.js"></script><script src="./clf-kit.js"></script><script src="./clf-lesson.js"></script>';
  const demo=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Integración modular CLF</title><style>body{font:16px system-ui;max-width:1080px;margin:auto;padding:24px;background:#f6f8fc}main{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))}main>*{min-width:0}h1{font-size:1.5rem}</style><h1>Integración de recursos: tú eliges la distribución</h1><div id="control"></div><main><div id="my-notebook"></div><div id="my-reasoning"></div><div id="my-formula"></div><div id="my-data"></div><div id="my-diagram"></div><div id="my-visualization"></div><div id="my-calculator"></div><div id="my-simulation"></div><div id="my-sensitivity"></div><div id="my-guided"></div><div id="my-assessment"></div></main>${script}<script>const app=CLFKit.create(CLF_RESOURCE_LESSON);app.mount('controls','#control');app.mount('notebook','#my-notebook');app.mount('reasoning','#my-reasoning');app.mount('formula','#my-formula');app.mount('data','#my-data');app.mount('diagram','#my-diagram');app.mount('visualization','#my-visualization');app.mount('calculator','#my-calculator');app.mount('simulation','#my-simulation');app.mount('sensitivity','#my-sensitivity');app.mount('guided','#my-guided');app.mount('assessment','#my-assessment');</script></html>`;
  writeFileSync(join(dest,'example-host.html'),demo);
  return {directory:dest,manifest};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const input=process.argv[2]||'examples/pert-cpm.lesson.json';const out=process.argv[3]||'dist/resources';const info=resources(JSON.parse(readFileSync(resolve(input),'utf8')),out);console.log('Recursos autónomos:',info.directory);}catch(error){console.error('ERROR:',error.message);process.exitCode=1;}
}
