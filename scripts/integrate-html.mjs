#!/usr/bin/env node
/** Opt-in mounting in existing HTML. Keeps original layout and global styles intact. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateLesson} from './validate-lesson.mjs';
import {safeData,types} from './build-resources.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function integrate(html,lesson){
 validateLesson(lesson);
 if(!/<\/body\s*>/i.test(html))throw new Error('HTML anfitrión sin etiqueta </body>');
 if(html.includes('data-clf-integrated="true"'))throw new Error('El archivo ya tiene integración CLF');
 const mounts=[...html.matchAll(/\bdata-clf\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
 if(!mounts.length)throw new Error('Marca un contenedor existente con data-clf="notebook" (u otro recurso)');
 for(const m of mounts)if(!types.includes(m))throw new Error('Tipo de recurso desconocido: '+m);
 const scripts=['runtime/core.js','runtime/kit.js'].map(path=>readFileSync(resolve(ROOT,path),'utf8').replace(/<\/script/gi,'<\\/script'));
 // Browser will interpret lesson only as inert serialized data; no template HTML constructed from it.
 const code=`<script data-clf-integrated="true">\n${scripts[0]}\n${scripts[1]}\n(function(){const lesson=${safeData(lesson)};const controller=globalThis.CLFKit.create(lesson);for(const host of document.querySelectorAll('[data-clf]')){const type=host.getAttribute('data-clf');if(${JSON.stringify(types)}.includes(type))controller.mount(type,host);}document.dispatchEvent(new CustomEvent('clf:ready',{detail:{controller}}));})();\n<\/script>`;
 return html.replace(/<\/body\s*>/i,code+'\n</body>');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const [host='examples/existing-page.html',input='examples/pert-cpm.lesson.json',out='dist/embedded.html']=process.argv.slice(2);
 const result=integrate(readFileSync(resolve(host),'utf8'),JSON.parse(readFileSync(resolve(input),'utf8')));
 if(resolve(host)===resolve(out))throw new Error('No se modifica el archivo fuente. Usa un destino distinto.');
 if(existsSync(resolve(out))&&!process.argv.includes('--force'))throw new Error('El archivo destino ya existe: usa --force si deseas reemplazarlo.');
 mkdirSync(dirname(resolve(out)),{recursive:true});writeFileSync(resolve(out),result);console.log('HTML integrado:',resolve(out));
 }catch(error){console.error('ERROR:',error.message);process.exitCode=1;}
}
