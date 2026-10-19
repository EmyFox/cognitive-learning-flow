#!/usr/bin/env node
/** Generate a portable, self-contained lesson HTML. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateLesson} from './validate-lesson.mjs';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'..');
export function buildHtml(lesson) {
  validateLesson(lesson);
  const css=readFileSync(resolve(root,'runtime/styles.css'),'utf8');
  const core=readFileSync(resolve(root,'runtime/core.js'),'utf8');
  const player=readFileSync(resolve(root,'runtime/player.js'),'utf8');
  const data=JSON.stringify(lesson).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  // No third-party scripts. Dynamic lesson text is never interpolated into markup.
  return '<!doctype html><html lang="es"><head><meta charset="UTF-8">'
    +'<meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<meta name="description" content="Laboratorio educativo interactivo e independiente">'
    +'<title>Cognitive Learning Flow · Laboratorio interactivo</title><style>'+css+'</style></head><body>'
    +'<main class="shell"><header class="top"><div><div class="eyebrow">Cognitive Learning Flow · v0.2</div>'
    +'<h1 id="title">Laboratorio interactivo</h1><small>Razonamiento visible · Cálculo verificable · Sin conexión</small></div>'
    +'<nav class="modebar" aria-label="Modalidad"><button type="button" id="tab-demo" aria-pressed="true">Demostración</button>'
    +'<button type="button" id="tab-guided" aria-pressed="false">Práctica guiada</button><button type="button" id="tab-exam" aria-pressed="false">Evaluación</button></nav></header>'
    +'<section class="summary"><h2>El problema</h2><p id="statement"></p>'
    +'<details id="data-panel"><summary>Mostrar datos de entrada</summary><ul id="activities"></ul></details></section>'
    +'<div id="view-demo"><section class="panel" aria-label="Control de lección"><div class="panel-head"><span class="stage" id="step"></span><span id="pct" class="tag">0%</span></div>'
    +'<h2 id="goal"></h2><p class="muted" id="reason"></p><div class="controls">'
    +'<button type="button" class="primary" id="play">▶ Reproducir</button><button type="button" id="prev">Anterior</button><button type="button" id="next">Siguiente</button>'
    +'<button type="button" id="restart">Reiniciar</button><label>Velocidad <select id="speed" aria-label="Velocidad">'
    +'<option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>'
    +'<label>Ir a etapa <select id="scene-choice" aria-label="Seleccionar etapa"></select></label></div>'
    +'<progress id="progress" value="0" max="1" aria-label="Avance de demostración"></progress><p id="step-question" class="muted"></p>'
    +'<details class="transcript" id="transcript"><summary>Transcripción completa de esta etapa</summary><pre id="transcript-body"></pre></details>'
    +'</section></div>'
    +'<div id="view-guided" hidden><section class="panel"><span class="stage" id="guide-step"></span><h2 id="guide-goal"></h2>'
    +'<p id="guide-question"></p><div id="guide-input-wrap" class="answer-row"><input type="text" id="guide-answer" inputmode="decimal" autocomplete="off" placeholder="Tu respuesta" aria-label="Respuesta del ejercicio">'
    +'<button id="guide-check" type="button" class="primary">Comprobar</button></div>'
    +'<p id="guide-feedback" class="feedback" role="status" aria-live="polite"></p><p id="guide-reason" class="muted"></p>'
    +'<div class="controls"><button type="button" id="guide-hint">Pista</button><button type="button" id="guide-unlock">Ver explicación</button>'
    +'<button type="button" id="guide-prev">Anterior</button><button type="button" id="guide-next" class="primary">Siguiente paso</button></div></section></div>'
    +'<div id="view-exam" hidden><section class="panel"><h2>Evaluación de práctica</h2><div id="quiz" class="quiz"></div>'
    +'<div class="controls"><button id="quiz-submit" class="primary" type="button">Entregar respuestas</button><button id="quiz-restart" type="button">Intentar otra vez</button></div>'
    +'<p id="quiz-result" role="status" aria-live="polite"></p><small>No es una prueba psicométrica oficial ni un examen seguro contra inspección del código.</small></section></div>'
    +'<div class="workspace" id="work-area"><div class="stack"><section id="network-panel" class="panel">'
    +'<div class="panel-head"><h2>Diagrama de relaciones</h2><span class="tag">SVG</span></div><div class="network-wrap" id="network"></div>'
    +'<p class="legend"><span>● Actividades con duración esperada</span><strong>● Elementos activos</strong></p></section>'
    +'<section class="panel"><h2>Cuaderno de resolución</h2><div class="notebook" id="notebook" aria-label="Cuaderno con operaciones progresivas"></div></section></div>'
    +'<div class="stack"><section class="panel" id="calculator-panel"><h2>Calculadora</h2><div class="calculator">'
    +'<div class="calc-display" id="calc-display" role="status" aria-label="Resultado de calculadora">0</div><div class="keys" id="keypad"></div></div>'
    +'<p class="muted">En demostración, las teclas se animan con el procedimiento. En práctica, puedes operar manualmente.</p>'
    +'</section></div></div><footer>CLF es una herramienta educativa independiente. <span id="source-note"></span></footer></main>'
    +'<script>'+core+'<\/script><script>globalThis.CLF_LESSON='+data+';<\/script><script>'+player+'<\/script></body></html>';
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{
    const input=process.argv[2]||'examples/pert-cpm.lesson.json';
    const output=process.argv[3]||'dist/pert-cpm.html';
    const lesson=JSON.parse(readFileSync(resolve(input),'utf8'));
    mkdirSync(dirname(resolve(output)),{recursive:true});
    writeFileSync(resolve(output),buildHtml(lesson),'utf8');
    console.log('HTML offline generado:',resolve(output));
  }catch(error){console.error('ERROR al exportar:',error.message);process.exitCode=1;}
}
