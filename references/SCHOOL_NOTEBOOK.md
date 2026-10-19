# Estética de libreta escolar + coreografía cognitiva · CLF v0.7

Esta referencia explica el **tema predeterminado para recursos educativos nuevos** desde v0.8. Cuando el proyecto anfitrión indique una identidad diferente, usarla sin reescribir estilos de la página existente. El tema escolar funciona por defecto dentro de Shadow DOM, no sobre la web completa.

## El recurso

- `runtime/line-balancing.js`: motor matemático puro y determinista. Calcula ciclo, mínimo teórico, cargas, holguras, estaciones, eficiencia y asignación con una heurística explícita.
- `runtime/school-notebook.js`: componente aislado con Shadow DOM, montaje/desmontaje, papel cuadriculado, perforaciones, línea marginal, anotaciones, red SVG, tarjetas y calculadora vinculados al mismo cursor de eventos.
- `scripts/build-school-demo.mjs`: genera un HTML único offline con el modelo, los estilos y el widget. **No reescribe el HTML anfitrión:** requiere un marcador explícito `id="clf-school-mount"`.
- `examples/line-balancing.school.json`: los datos, referencias matemáticas y precedencias del ejemplo. `scripts/validate-school.mjs` verifica los resultados antes de construir el HTML.

## Coreografía visual semántica

Una etapa debe seguir el orden causal: **pregunta del problema → motivo de la operación → anotación → pulsaciones → resultado calculado → resaltado → decisión**. No se debe mostrar un gráfico acabado antes de que las operaciones permitan deducirlo. Pausa, cambio de etapa y reinicio reconstruyen el estado desde los eventos, no de un temporizador previo.

Para cada actividad específica:
1. Preparar datos y unidades.
2. Derivar el cálculo con un solver independiente de la interfaz.
3. Escribir solo la parte de la operación que pertenece a la etapa.
4. Usar el mismo valor en pantalla, calculadora y visualización; nunca copiar números alternativos en JSX/HTML.
5. Diferenciar límite inferior teórico de solución factible por heurística. No llamar 'óptimo' a un empaquetamiento no demostrado.
6. Comprobar transferencia cambiando datos (aquí: demanda de 400, 480 o 600 piezas).
7. Practicar con respuestas ocultas y pistas que expliquen operaciones, no indiquen el número final.

## Modelo matemático del ejemplo

- Turno productivo = 28 800 segundos (8 horas sin descansos dentro del tiempo declarado).
- Pedido = 480 piezas/turno; CT = 28 800 / 480 = 60 s/pieza.
- Suma de 7 tareas = 190 s/pieza, mínimo teórico = techo(190/60) = 4 estaciones.
- Heurística de selección estable, con precedencias: S1 [A,B]=55 s; S2 [C,D]=55 s; S3 [E]=40 s; S4 [F,G]=40 s.
- Eficiencia = 190/(4×60) = 79,17%; ocio total por ciclo = 50 s.
- A 600 unidades, CT = 48 s y la heurística arroja 5 estaciones. **No significa que el mínimo global necesariamente sea 5**.

## Integración en un HTML existente

Para un contenido existente que incluya un marcador de montaje:

```html
<div id="clf-school-mount"></div>
<script src="/lib/clf-core.js"></script>
<script src="/lib/clf-line-balancing.js"></script>
<script src="/lib/clf-ink-choreography.js"></script>
<script src="/lib/clf-motion.js"></script>
<script src="/lib/clf-vector-ink.js"></script>
<script src="/lib/clf-school-notebook.js"></script>
<script>
  const notebook = CLFSchoolNotebook.mount(
    document.getElementById('clf-school-mount'),
    lessonFromMyApp
  );
  notebook.play();
  // Más adelante: notebook.pause(); notebook.seekScene(3);
  // Si desmontas la pantalla: notebook.destroy();
</script>
```

El HTML autónomo generado incorpora todos los scripts necesarios y la lección inline. El usuario escoge el lugar del recurso; CSS encapsulado. La versión 0.7 es un **recurso adicional** y no reemplaza el recurso `notebook` existente de `CLFKit`.

## Accesibilidad y compatibilidad

- Respeta `prefers-reduced-motion`; los efectos decorativos se desactivan y la tipografía se escribe más rápido en reproducción.
- Contraste, controles táctiles >=44px, alternativas textuales, navegación con teclado, `aria-label` de red y acciones.
- La red admite scroll horizontal interno en móviles para evitar cortar diagramas o ensanchar la página.
- No cargar CDNs, imágenes remotas, fuentes remotas ni datos en redes externas.
- Un HTML autónomo revela el solucionario en su código: no usarlo para exámenes supervisados de alto impacto.
- Probar siempre el caso original, variantes de demanda, casos inválidos, reproducir/pausar, antes/después, práctica y teléfono de 375/390 px.

## Actualización v0.11

El SVG de escritura vectorial se incluye con `runtime/vector-ink.js` y se monta sin modificar el HTML anfitrión. Las ecuaciones muestran texto accesible y trazos según los eventos `equation` del controlador; el reloj compartido proviene de `runtime/motion-clock.js`. El exportador empaqueta todos los módulos offline en el orden necesario.
