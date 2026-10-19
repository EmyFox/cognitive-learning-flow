#!/usr/bin/env node
/** Build a portable, non-invasive school-notebook resource, completely offline. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateSchool} from './validate-school.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function buildSchoolNotebook(lesson,hostSource){
  const solverCode=readFileSync(resolve(ROOT,'runtime/line-balancing.js'),'utf8');
  const notebookCode=readFileSync(resolve(ROOT,'runtime/school-notebook.js'),'utf8');
  const coreCode=readFileSync(resolve(ROOT,'runtime/core.js'),'utf8');
  const result=validateSchool(lesson);
  if (result.taskCount<3)throw new Error('Se necesitan al menos tres tareas para esta demostración');
  const payload=JSON.stringify(lesson).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  const inserted=`<script>\n${coreCode}\n${solverCode}\n${notebookCode}\nconst __clfSchoolData=${payload};\nwindow.clfSchoolDemo=CLFSchoolNotebook.mount(document.getElementById('clf-school-mount'),__clfSchoolData);\n</script>`;
  if(!hostSource.includes('<div id="clf-school-mount"></div>'))throw new Error('Host sin marcador de montaje explícito');
  if(!/<\/body>/i.test(hostSource))throw new Error('Host sin cierre de body');
  return hostSource.replace(/<\/body>/i,inserted+'\n</body>');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const inFile=resolve(process.argv[2]||resolve(ROOT,'examples/line-balancing.school.json'));
  const host=resolve(process.argv[3]||resolve(ROOT,'examples/school-notebook-host.html'));
  const dest=resolve(process.argv[4]||resolve(ROOT,'dist/school-line-balancing.html'));
  try{const html=buildSchoolNotebook(JSON.parse(readFileSync(inFile,'utf8')),readFileSync(host,'utf8'));mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);console.log('Cuaderno escolar offline:',dest);}catch(e){console.error('No se generó el HTML:',e.message);process.exitCode=1;}
}
