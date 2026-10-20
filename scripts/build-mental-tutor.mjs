#!/usr/bin/env node
/** Build an offline standalone mental workflow tutor; optionally embed into an existing host HTML. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
const BASE=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const engine=readFileSync(resolve(BASE,'runtime/mental-steps.js'),'utf8');
const tutor=readFileSync(resolve(BASE,'runtime/mental-tutor.js'),'utf8');
function serialize(obj){return JSON.stringify(obj).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
export function build(lesson,host){
 const ctx={Intl};runInNewContext(engine,ctx);ctx.CLFMental.compile(lesson);
 const page=host||`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CLF · Aprende a resolver paso a paso</title><style>body{margin:0;background:#eee5d6;font:16px system-ui;color:#21375c}main{max-width:1320px;margin:32px auto;padding:0 14px}footer{text-align:center;margin:22px;padding:12px;color:#617088;font-size:12px}</style></head><body><main><div data-clf-mental-tutor></div></main><footer>Ingeniería Industrial · Cognitive Learning Flow · Laboratorio educativo independiente</footer></body></html>`;
 if(!page.includes('data-clf-mental-tutor'))throw Error('El HTML anfitrión necesita un contenedor data-clf-mental-tutor');
 if(!/<\/body\s*>/i.test(page))throw Error('El HTML anfitrión debe incluir </body>');
 if(page.includes('data-clf-mental-injected'))throw Error('Este HTML ya contiene el tutor');
 const scripts=`<script data-clf-mental-injected="true">\n${engine}\n${tutor}\nconst CLF_MENTAL_LESSON=${serialize(lesson)};\nconst CLF_MENTAL_APP=CLFMentalTutor.create(CLF_MENTAL_LESSON);\nfor(const host of document.querySelectorAll('[data-clf-mental-tutor]')) CLF_MENTAL_APP.mount(host);\n</script>`;
 return page.replace(/<\/body\s*>/i,scripts+'\n</body>');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const inp=resolve(process.argv[2]||'examples/eoq-mental-tutor.json');const out=resolve(process.argv[3]||'dist/eoq-mental-tutor.html');const hostArg=process.argv.slice(4).find(arg=>arg!=='--force');const lesson=JSON.parse(readFileSync(inp,'utf8'));const host=hostArg?readFileSync(resolve(hostArg),'utf8'):undefined;
 if(existsSync(out)&&!process.argv.includes('--force'))throw Error('Destino existente; añade --force para reemplazarlo');
 const html=build(lesson,host);mkdirSync(dirname(out),{recursive:true});writeFileSync(out,html);console.log('Tutor HTML generado:',out);}
 catch(e){console.error('Error:',e.message);process.exitCode=1;}
}
