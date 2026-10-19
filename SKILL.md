---
name: cognitive-learning-flow
description: Diseña experiencias HTML interactivas que enseñan procedimientos cuantitativos mediante razonamiento observable, cálculos verificables, escritura progresiva, diagramas y práctica guiada. Úsala al crear laboratorios didácticos de ingeniería, matemáticas, estadística, ciencias y preparación de exámenes.
compatibility: Agentes compatibles con Agent Skills; HTML5, CSS y JavaScript. No requiere Checkfox ni servicios externos.
metadata:
  version: "0.3.0"
  opencode/slash: "true"
---

# Cognitive Learning Flow (CLF)

Tu trabajo es convertir un procedimiento académico en una **experiencia de aprendizaje reproducible, verificable e interactiva**. La experiencia ha de mostrar una *estrategia explícita de resolución*, no simular acceso a los pensamientos privados de quien aprende.

## Integración no invasiva y generación de recursos (v0.3)

- Prioriza **recursos desacoplados** sobre crear una página entera. No impongas layout, navegación o branding.
- Si llega un HTML o flujo existente, inspecciónalo primero; conserva la estructura, CSS, JavaScript, rutas y accesibilidad.
- Genera únicamente las piezas necesarias y deja la colocación en manos del desarrollador.
- Usa `CLFKit.create(lesson).mount(tipo, selector)` con Shadow DOM y `connectWorkflow()` para flujos preexistentes.
- Exporta assets con `scripts/build-resources.mjs` o integra HTML sin reorganizar con `scripts/integrate-html.mjs`.
- Conserva el reproductor standalone como opción, no requisito.
- Lee `references/EMBEDDING.md` antes de integrar.

## Resultado esperado

Entregar un laboratorio HTML que permita al estudiante:
1. Comprender **qué** se busca y **qué** se conoce.
2. Reconocer **por qué** se elige una estrategia, fórmula o algoritmo.
3. Observar **cómo** se sustituyen los datos, se calculan y se anotan.
4. Verificar unidades, supuestos, signos y consistencia.
5. Resolver un caso análogo con apoyos decrecientes.
6. Responder preguntas de transferencia sin pistas prematuras.

No todas las lecciones necesitan calculadora, papel o red. **Selecciona la representación que explique mejor el concepto**, sin imponer efectos visuales irrelevantes.

## Flujo obligatorio: pensar antes de animar

1. **Especificar** audiencia, tema, prerrequisitos, objetivo medible, datos, supuestos, unidades y formato de entrega.
2. **Resolver fuera de la interfaz.** Escribir el modelo matemático correcto; implementar una solución de referencia computable cuando proceda. No confiar en un resultado numérico escrito a mano en el guion.
3. **Validar** la solución de manera independiente: casos borde, caminos alternos, sensibilidad, redondeos y convenciones propias del tema.
4. **Planear escenas** con la secuencia identificar → representar → decidir → operar → comprobar → interpretar → transferir. Cada microescena tiene propósito, justificación y uno o pocos cambios visuales.
5. **Construir acciones sincronizadas** desde una misma fuente de verdad: cuaderno, calculadora, diagrama, narración, checkpoints. La animación no debe inventar resultados.
6. **Implementar tres modalidades independientes**: demostración, práctica guiada y evaluación. Evitar que cambie el modo y se filtren respuestas visuales.
7. **Probar** cálculo, UX, accesibilidad, responsive y estados de reproducción. No declarar pruebas que no se ejecutaron.
8. **Entregar** artefacto(s) funcionando, instrucciones de uso, resultados verificados y límites conocidos.

## Modos indispensables

### Demostración

- Visualización progresiva y controlada por el usuario.
- Reproducir / pausar / anterior / siguiente / velocidad / reiniciar / saltar a escena.
- Cuaderno que anota ecuaciones y razonamientos progresivamente; transcripción textual disponible sin animaciones.
- Calculadora animada **funcional**, con expresiones y teclas verificadas; no una pantallita que muestre números inventados.
- Resaltar en diagramas únicamente los elementos relevantes de la escena.

### Práctica guiada

- Pedir respuesta, estimación o siguiente decisión **antes** de revelar.
- Validar números con tolerancia explícita y unidades reconocibles.
- Ofrecer pistas escalonadas, explicar errores frecuentes, luego liberar solución.
- Retirar progresivamente la guía (fading). No convertir cada tecla en una pregunta trivial.

### Evaluación

- Enunciado completo sin instrucciones que revelen respuesta.
- Preguntas contextualizadas, distractores plausibles y retroalimentación **después** del envío.
- Mostrar puntuación y explicación; nunca presentar reactivos fabricados como material oficial ni como calibrados psicométricamente.
- **Aviso:** un solo HTML contiene las respuestas en su código fuente; para evaluación certificadora o antifraude se requiere un backend seguro.

## Contrato de la lección

Usar `assets/lesson.schema.json` o su descripción en `references/ARCHITECTURE.md` para generar `*.lesson.json` con:
- `problem`: planteamiento, unidades, variables y datos fuente.
- `groundTruth`: solución verificada e hipótesis.
- `scenes[]`: `id`, `phase`, `goal`, `rationale`, `actions[]`, `checkpoint` si aplica.
- `assessment.items[]`: opciones, respuesta y explicación por distractor.
- `sourceNotes[]`: procedencia, licencias y alcance de fórmulas.

Acciones normalizadas: `write`, `calculator`, `diagram`, `highlight`, `question`, `reveal`.

Los datos y resultados tienen que concordar en todos los modos y medios. La representación matemática, no el diseño, manda.

## Reglas de implementación HTML

- Si se pide un único HTML offline, no usar CDN, APIs externas ni bibliotecas remotas.
- Animación determinista: poder reconstruir cualquier escena en `seek/previous`; limpiar timers al pausar o cambiar de modo.
- Mostrar teclas animadas y calcular realmente el resultado; NO `eval`, `Function` ni interpretar código arbitrario recibido de usuarios.
- Gráficos SVG con texto legible, tamaño adaptable, leyendas y versión textual; no revelar camino crítico antes de tiempo en evaluación.
- Respetar `prefers-reduced-motion`, foco visible, accesibilidad con teclado, `aria-live` moderado, zoom y controles táctiles de al menos 44px.
- Diseñar para pantallas de 375px, 390px y escritorio. Preferir scroll en un área de diagrama cuando sea necesario, nunca cortar contenido.
- Seguir el sistema visual del **proyecto consumidor**, si existe. Esta skill no tiene paleta ni branding propios obligatorios.

## Reglas específicas de rigor

- Fórmula: definición, convención, sustitución, operación, unidad, conclusión y comprobación, en ese orden cuando aplique.
- Para PERT/CPM: validar DAG, precedencias, pase temprano/tardío, holguras, múltiples rutas críticas posibles y supuestos de probabilidad.
- No inventar psicometría, datos oficiales de EGEL ni nombres protegidos.
- Si las fórmulas o supuestos son discutidos, hacerlos explícitos; no afirmar certeza de una aproximación.

## Archivos de consulta

Leer según la tarea:
- `references/PEDAGOGY.md`: principios didácticos y diseño de decisiones.
- `references/ARCHITECTURE.md`: modelo de estados y sincronización.
- `references/QUALITY_GATES.md`: aceptación y pruebas.
- `examples/pert-cpm.lesson.json`: caso PERT/CPM verificable.

## Generador HTML reutilizable v0.2

Para obtener un archivo autónomo a partir de un JSON de lección validado:

```sh
node scripts/build-html.mjs examples/pert-cpm.lesson.json dist/pert-cpm.html
```

El motor base está en `runtime/core.js` (timeline/aritmética/instantáneas), `runtime/player.js` (modos y componentes DOM) y `runtime/styles.css` (tokens ajustables). El CLI inserta todo inline para uso sin Internet. Los diagramas SVG actuales cubren redes de actividades PERT; para EOQ, SPC y otros temas crea vistas de dominio en vez de fingir un diagrama PERT. La generación requiere datos matemáticos verificados; el renderer no reemplaza el solver.

## Exportar recursos por separado

```sh
npm run build:resources
npm run build:integrated
```

El runtime de recursos `runtime/kit.js` reutiliza `runtime/core.js`. Permite `mount`, `seekSceneId`, `connectWorkflow`, `onChange`, `setMode` y `destroy`. Ningún recurso decide la posición de los demás.

## Comandos para comprobar un caso

Desde la raíz de esta skill:

```sh
npm test
node scripts/validate-lesson.mjs examples/pert-cpm.lesson.json
```

## Prohibiciones

- No copiar la apariencia de una aplicación concreta salvo petición.
- No producir escenas que contradigan la solución matemática.
- No ejecutar escrituras a sistemas externos ni integrarse con producción solo por crear una lección.
- No declarar el laboratorio terminado sin reconocer funciones pendientes o pruebas no realizadas.

**Definición de éxito:** después de observar la solución, el estudiante puede justificar decisiones, detectar errores y resolver un problema nuevo con menos ayuda.
