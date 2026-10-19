/* CLF Ink Choreography v0.9: portable, pure semantic equation projection.
 * Use with verified external solvers, not as a general domain solver.
 */
(function(root){
 'use strict';
 const PHASES=Object.freeze({Identificar:'Extraer los datos antes de elegir la operación',Modelar:'Seleccionar y justificar el modelo',Sustituir:'Reemplazar símbolos con datos conocidos',Calcular:'Introducir la operación en la calculadora',Comprobar:'Verificar el resultado con el modelo',Interpretar:'Conectar el resultado con una decisión',Asignar:'Colocar tareas respetando precedencias'});
 function verify(spec,calculate){
  if(!spec||typeof spec!=='object'||typeof calculate!=='function')throw new TypeError('Especificación matemática inválida');
  for(const k of ['symbol','concept','substitution','expression','unit','insight'])if(typeof spec[k]!=='string'||!spec[k].trim())throw new TypeError('Falta '+k);
  if(typeof spec.computed!=='number'||!Number.isFinite(spec.computed))throw new TypeError('Resultado no finito');
  if(!['identity','ceil'].includes(spec.operation||'identity'))throw new TypeError('Operación de redondeo no permitida');
  const value=calculate(spec.expression);
  const expected=(spec.operation==='ceil'?Math.ceil(value-1e-10):value);
  if(Math.abs(expected-spec.computed)>1e-6*Math.max(1,Math.abs(spec.computed)))throw new Error('La fórmula contradice la solución verificada: '+spec.symbol);
  return expected;
 }
 function project(spec,phase){
  const count=Math.max(0,Math.min(3,Math.trunc(phase)||0));
  if(!spec)return Object.freeze({count:0,parts:[]});
  const parts=[
   {label:'Modelo',text:spec.symbol+' = '+spec.concept},
   {label:'Sustituir',text:spec.symbol+' = '+spec.substitution},
   {label:'Resultado',text:spec.symbol+' = '+String(Math.round(spec.computed*1e5)/1e5)+' '+spec.unit}
  ].map((entry,index)=>Object.freeze({...entry,visible:index<count,active:index===count-1&&index<count}));
  return Object.freeze({count,parts,insight:count===3?spec.insight:''});
 }
 function underline(progress){return 100*(1-Math.max(0,Math.min(1,Number(progress)||0)));}
 function phaseDescription(phase){return PHASES[phase]||'Observa qué cambia y por qué';}
 root.CLFInk=Object.freeze({version:'0.9.0',verify,project,underline,phaseDescription});
})(globalThis);
