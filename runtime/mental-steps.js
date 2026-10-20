/* CLF v0.12: small, independently testable engine for transparent calculation tutoring.
   Deliberately uses explicit expression trees rather than eval or executable code. */
(function (root) {
  'use strict';
  const isObject = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const requireTrue = (ok, message) => { if (!ok) throw new Error(message); };
  const validKey = x => typeof x === 'string' && /^[A-Za-z][A-Za-z0-9_]*$/.test(x);
  function expression(ast, env, depth = 0) {
    requireTrue(depth < 24, 'Expresión demasiado profunda');
    if (finite(ast)) return ast;
    requireTrue(isObject(ast), 'Expresión inválida');
    if (Object.hasOwn(ast, 'ref')) {
      requireTrue(validKey(ast.ref) && Object.hasOwn(env, ast.ref) && finite(env[ast.ref]), 'Referencia ausente: ' + ast.ref);
      return env[ast.ref];
    }
    const arr = ast.args;
    requireTrue(Array.isArray(arr) && arr.length && arr.length < 15, 'Argumentos inválidos');
    const vals = arr.map(a => expression(a, env, depth + 1));
    let result;
    switch (ast.op) {
      case 'add': requireTrue(vals.length >= 2, 'Suma requiere 2+ términos'); result = vals.reduce((a,b) => a+b); break;
      case 'subtract': requireTrue(vals.length === 2, 'Resta requiere 2 términos'); result = vals[0]-vals[1]; break;
      case 'multiply': requireTrue(vals.length >= 2, 'Producto requiere 2+ términos'); result = vals.reduce((a,b) => a*b); break;
      case 'divide': requireTrue(vals.length === 2 && vals[1] !== 0, 'División inválida'); result = vals[0]/vals[1]; break;
      case 'sqrt': requireTrue(vals.length === 1 && vals[0] >= 0, 'Raíz cuadrada inválida'); result = Math.sqrt(vals[0]); break;
      default: throw new Error('Operación no permitida: '+ast.op);
    }
    requireTrue(finite(result), 'Resultado no finito');
    return result;
  }
  function compile(lesson) {
    requireTrue(isObject(lesson) && Array.isArray(lesson.data) && Array.isArray(lesson.calculations) && Array.isArray(lesson.steps), 'Lección de tutor incompleta');
    requireTrue(lesson.data.length >= 2 && lesson.steps.length >= 3, 'Se necesitan datos y microetapas');
    const env = Object.create(null), dataIds = new Set(), calculationIds = new Set(), allIds = new Set();
    for(const item of lesson.data) {
      requireTrue(isObject(item) && validKey(item.id) && !allIds.has(item.id) && finite(item.value) && item.unit && item.source, 'Dato inválido o duplicado');
      dataIds.add(item.id);allIds.add(item.id);env[item.id] = item.value;
    }
    const results = {};
    for (const calc of lesson.calculations) {
      requireTrue(isObject(calc) && validKey(calc.id) && !allIds.has(calc.id), 'Cálculo inválido o duplicado');
      const result = expression(calc.expr, env);
      requireTrue(finite(calc.expected) && Math.abs(result-calc.expected) <= 1e-7*Math.max(1,Math.abs(result)), 'El cálculo '+calc.id+' no coincide con su solución: '+result);
      requireTrue(typeof calc.unit==='string' && calc.unit.trim(), 'Falta unidad: '+calc.id);
      calculationIds.add(calc.id);allIds.add(calc.id);env[calc.id] = result;results[calc.id] = result;
    }
    const stepIds = new Set();
    const allowed = new Set(['read','identify','discard','units','decide','model','substitute','operate','verify','interpret','transfer']);
    for(const step of lesson.steps) {
      requireTrue(isObject(step) && validKey(step.id) && !stepIds.has(step.id) && allowed.has(step.phase), 'Microetapa inválida');
      stepIds.add(step.id);
      for(const ref of step.dataRefs||[])requireTrue(dataIds.has(ref), 'Referencia de dato no reconocida: '+ref);
      for(const ref of step.calculationRefs||[])requireTrue(calculationIds.has(ref), 'Referencia de cálculo no reconocida: '+ref);
      requireTrue(typeof step.reason==='string' && step.reason.length >= 20 && typeof step.mentalRule==='string' && step.mentalRule.length >= 8, 'La explicación debe justificar y enseñar la regla: '+step.id);
      requireTrue(typeof step.headline==='string' && typeof step.prompt==='string' && typeof step.explanation==='string', 'Falta microexplicación');
      const q=step.check;
      requireTrue(isObject(q) && typeof q.prompt==='string' && Array.isArray(q.hints) && q.hints.length >= 2, 'Cada microetapa requiere preguntas y pistas escalonadas');
      if (q.type==='choice') {
        requireTrue(Array.isArray(q.options) && q.options.length >= 2, 'Opciones insuficientes');
        const ids=q.options.map(o=>o.id);requireTrue(new Set(ids).size===ids.length && ids.includes(q.correctId), 'Respuesta de opción inválida');
        for(const o of q.options) requireTrue(typeof o.text==='string' && typeof o.feedback==='string' && o.feedback.length >= 12,'Cada distractor debe explicarse');
      } else if(q.type==='number') {
        requireTrue(calculationIds.has(q.expectedRef) && finite(q.tolerance) && q.tolerance >= 0, 'Respuesta numérica sin referencia computada');
      } else throw new Error('Tipo de pregunta desconocido: '+q.type);
    }
    return {env: {...env}, results, data: lesson.data, calculations: lesson.calculations, steps: lesson.steps};
  }
  function check(compiled, index, answer) {
    const step=compiled.steps[index];requireTrue(step && step.check,'Etapa fuera de rango');
    const q=step.check;
    if(q.type==='choice') {
      const choice=q.options.find(o=>o.id===String(answer));
      return {correct:!!choice && choice.id===q.correctId,feedback:choice?.feedback||'Elige una opción.'};
    }
    const txt=String(answer).trim().replace(',', '.');
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(txt)) return {correct:false,feedback:'Introduce solo un número. Usa punto o coma decimal; las unidades ya están indicadas.'};
    const actual=Number(txt),expected=compiled.env[q.expectedRef];
    const correct=Number.isFinite(actual) && Math.abs(actual-expected)<=q.tolerance;
    return {correct,feedback:correct?'Coincide. Ahora explica qué representa ese valor.':(q.wrongFeedback||'Comprueba qué datos entran, en qué orden operas y qué unidad debe salir.')};
  }
  function format(n,digits=3){return new Intl.NumberFormat('es-MX',{maximumFractionDigits:digits}).format(n);}
  root.CLFMental = Object.freeze({expression,compile,check,format,version:'0.12.0'});
})(globalThis);
