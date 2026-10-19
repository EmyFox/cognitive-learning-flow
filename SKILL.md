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

## Regla de integración y recursos (v0.3)

- **Por defecto, produce recursos independientes** y entrega un manifiesto; no impongas distribución, barra de navegación, branding o estructura de una página completa.
- Si el usuario trae un HTML o flujo existente, **inspecciónalo antes de editar**; conserva la disposición, CSS, JavaScript, rutas, interacciones y accesibilidad del anfitrión. No migres ni reescribas la web como condición para mostrar el aprendizaje.
- Adapta las piezas mediante `CLFKit.create(lesson).mount(tipo, contenedor)`, `connectWorkflow()` y `onChange()`. Nunca modifiques el DOM fuera de los contenedores autorizados.
- Ofrece dos salidas: recursos colocables por el desarrollador (`build-resources`) o HTML existente instrumentado sin reorganización (`integrate-html`). El reproductor de página entera sigue siendo **opcional**.
- La selección de recursos depende del concepto: una calculadora innecesaria no debe imponerse.
- Consulta `references/EMBEDDING.md` antes de integrar con código preexistente.

## Visualizaciones por dominio v0.5 (obligatorio cuando aporte comprensión)

Antes de crear recursos, elige una **gramática visual acorde al dato**: `bar` para comparaciones discretas, `line` para evolución temporal, `process` para transformaciones y `diagram` para dependencias de una red PERT.

1. Declara `lesson.visualizations[]`: `id`, `kind`, `title`, `unit` opcional y `points[]` con `id`, `label` y `value` o `detail`.
2. Crea acciones `type: "visualize"` con `visualizationId`, `reveal` y `focus` para revelar **solo** los puntos ya justificados; `reveal` se interpreta como número de puntos iniciales visibles.
3. Vincula **cada cambio visual** a una acción semántica (`why`, `callout`, `focus`) y una comprobación matemática. No incluyas datos futuros como observaciones históricas.
4. Usa `controller.mount('visualization', '#mi-contenedor')` si hay sitio existente. No sustituyas su CSS ni layout.
5. Si necesitas un gráfico especializado, utiliza `CLFKit.registerVisualization(kind, renderer)` con un contrato documentado en `references/VISUAL_GRAMMAR.md`.
6. Valida tanto la verdad matemática como el *orden del revelado* y las versiones `snapshot` tras pausa/seek. Revisa el ejemplo `examples/forecast-moving-average.lesson.json`.

**Regla cognitiva:** los elementos visuales no preceden a las decisiones de solución; las ilustran. Una animación describe operaciones externas verificables, no pensamientos privados.

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

Acciones normalizadas: `write`, `calculator`, `diagram`, `highlight`, `question`, `reveal`, `visualize`.

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

## Generador HTML reutilizable v0.2 (modo legado); kit v0.5 para integrar

Para obtener un archivo autónomo a partir de un JSON de lección validado:

```sh
node scripts/build-html.mjs examples/pert-cpm.lesson.json dist/pert-cpm.html
```

El motor base está en `runtime/core.js` (timeline/aritmética/instantáneas), `runtime/player.js` (modos y componentes DOM) y `runtime/styles.css` (tokens ajustables). El CLI inserta todo inline para uso sin Internet. Los diagramas SVG actuales cubren redes de actividades PERT; para EOQ, SPC y otros temas crea vistas de dominio en vez de fingir un diagrama PERT. La generación requiere datos matemáticos verificados; el renderer no reemplaza el solver.

## Exportar componentes sin imponer layout

```sh
npm run build:resources
# Distintos contenedores en un HTML preexistente:
npm run build:integrated
```

El motor desacoplado vive en `runtime/kit.js`. Publica `CLFKit.create(lesson)` y recursos montables (`notebook`, `calculator`, `diagram`, `controls`, `steps`, `transcript`, `guided`, `assessment`, `status`) con Shadow DOM. Puede recibir eventos de flujos existentes con `connectWorkflow()`. Requiere cargar `runtime/core.js` antes.

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

## API v0.5 para páginas preexistentes

```js
const app = CLFKit.create(lesson);
app.mount('visualization', document.querySelector('#grafico'));
app.mount('notebook', document.querySelector('#apuntes'));
app.onCue(cue => sincronizarMisElementos(cue));
```

No introducir componentes que el usuario no pida. Para gráficos multi-dominio usar `build:resources` o `build:forecast:integrated`; el antiguo `build:html` mantiene un player específico y **no** incorpora el recurso `visualization`. Consulta `references/VISUAL_GRAMMAR.md`.


## v0.6 · Simuladores didácticos autónomos

Cuando el procedimiento se beneficia de un modelo que **reacciona a decisiones de entrada**, generar un `lesson.simulations[]` y escenas con acciones `scenario`. Usar `runtime/simulations.js` como modelo matemático puro y `runtime/kit.js` para su visualización opt-in. No inventar una simulación física si el dominio solo necesita una explicación textual.

- Elegir modelo según el contenido: `inventory-eoq`, `queue-mm1`, `production-line`; jamás sustituir datos faltantes por una fórmula de otro problema.
- **Sincronizar causalmente**: predicción de una decisión → cambio en el parámetro → recálculo determinista → actualización de gráfico/indicadores → explicación de la consecuencia. Cada `scenario` puede tener `frames` asociados al timeline reproducible.
- Separar **resultado analítico**, **muestra simulada** e **incertidumbre**. Para M/M/1 rechazar espera estacionaria si `λ≥μ` y mostrar por qué.
- Mostrar sensibilidad al menos de una variable, sin ocultar supuestos ni extrapolar fuera de la zona de validez.
- Durante evaluación o un checkpoint guiado no resuelto, no revelar la simulación resuelta.
- En `checkpoint.hints[]`, diseñar pistas crecientes, no una respuesta disfrazada de pista. En `checkpoint.misconceptions[]`, asociar errores aritméticos previsibles con explicaciones de **la operación**, sin atribuir un estado mental al estudiante.
- Mantener toda salida en componentes independientes de Shadow DOM. El HTML anfitrión decide cómo acomodarlos.

Consultar [references/SIMULATION_ENGINE.md](references/SIMULATION_ENGINE.md) antes de generar modelos operativos. Ejemplo: [examples/operations-lab.lesson.json](examples/operations-lab.lesson.json).

Comandos de la versión:

```bash
npm run validate:operations
npm run build:operations
npm run build:operations:resources
```

**No considerar la experiencia «completa» sin** pruebas numéricas para sus parámetros, regresión con las lecciones previas y al menos una revisión visual móvil + escritorio.

## v0.7 · Crear recursos visuales con estética de libreta escolar

Usa [references/SCHOOL_NOTEBOOK.md](references/SCHOOL_NOTEBOOK.md) cuando el usuario solicite cuadernos de clase, procedimientos manuscritos, experiencias escolares o demostraciones físicas de Ingeniería Industrial. **No imponer esa piel cuando no se haya pedido.** La skill debe generar el recurso visual y permitir que la aplicación anfitriona lo distribuya libremente.

Prioridades de calidad: (1) resultados verificados fuera del DOM, (2) coreografía dependiente del cálculo, (3) marcas visuales funcionales, (4) pausas/retrocesos deterministas, (5) ejercicios para que el estudiante razone, (6) accesibilidad y aspecto adaptable. El dibujo jamás debe hacer creer que un límite matemático inferior prueba optimalidad si solo se utilizó una heurística.

Comandos:

```sh
npm run validate:school
npm run build:school
```

El caso está en `examples/line-balancing.school.json`. La API reutilizable de montaje está en `runtime/school-notebook.js`; el motor puro en `runtime/line-balancing.js`. Para un HTML preexistente, **buscar un contenedor de destino y montarlo**, no sustituir el documento completo ni añadir estilos globales. Para nuevas materias, implementa un solver de dominio verificado y construye etapas a partir de sus resultados; no reutilices una gráfica de estaciones para representar un concepto que no tenga esas estaciones.
