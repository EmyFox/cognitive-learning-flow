# Coreografía de tinta y ecuaciones · v0.9

## Principio: primero la verdad, después el movimiento

Un resultado no se introduce directamente en la interfaz sin validarlo con el motor matemático del dominio. Para operaciones que el parser seguro admite:

```js
const eq = {
  symbol: 'CT',
  concept: 'Tiempo disponible ÷ demanda',
  substitution: '28 800 ÷ 480',
  expression: '28800/480',
  computed: 60,
  unit: 's / unidad',
  insight: 'Cada estación debe completar su trabajo dentro de 60 segundos.',
  operation: 'identity'
};
CLFInk.verify(eq, CLFCore.calculate);
CLFInk.project(eq, 1); // solo modelo
CLFInk.project(eq, 2); // modelo + sustitución
CLFInk.project(eq, 3); // resultado y conclusión
```

La operación opcional `ceil` admite el mínimo entero teórico de estaciones. No improvisar fórmulas de otros dominios: crear un validador específico y documentar hipótesis.

## Guion cinematográfico sin efectos gratuitos

1. **Identificar:** datos y demanda. Nada de solución final.
2. **Modelar:** solo fórmula simbólica verificada.
3. **Sustituir:** rellenar la fórmula con números del problema. Subrayado de tinta progresa con la escena.
4. **Calcular:** la calculadora reproduce las teclas para la misma expresión.
5. **Comprobar:** resultado validado, unidad y criterio de factibilidad.
6. **Asignar:** la tarea se ilumina en el grafo; únicamente tras el evento de asignación aparece en la estación.
7. **Interpretar:** conectar indicador con una decisión real de producción.

**Sincronización:** todas las vistas derivan de la misma posición `timeline.events`, no temporizadores independientes. `seek`, pausa y avance deben producir resultados idénticos. No utilizar la animación para tapar operaciones matemáticas.

## Adaptación a un HTML existente

El módulo `CLFInk` no crea DOM ni impone CSS. El anfitrión decide sus propios componentes y consume `project(eq, phase)`, que devuelve `parts[].visible`, `parts[].active` y `insight`. Para la libreta con interfaz, montar `CLFSchoolNotebook` en el contenedor elegido. Ningún archivo CSS global se agrega.

## Accesibilidad y límites

- Mantener representación textual sin exigir que el usuario siga el movimiento.
- Respetar `prefers-reduced-motion`.
- Foco, botones y barra temporal navegables por teclado.
- Nunca incluir respuestas a evaluación antes de enviar.
- Subrayado SVG es un indicador semántico, no una captura del trazo de una mano.
- Afirmar mejora en aprendizaje solo tras estudios con personas, no por pruebas unitarias.
