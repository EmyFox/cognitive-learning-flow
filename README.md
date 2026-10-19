# Cognitive Learning Flow

Skill independiente y reutilizable para agentes de IA que convierten procedimientos de solución en laboratorios HTML interactivos. **No pertenece a Checkfox ni requiere un frontend, backend o nube específicos.**

> **Estado:** v0.8 experimental. Incluye un primer generador HTML offline y un reproductor de escenas, más el contrato JSON y validador matemático. Los renderizadores especializados por dominio y la evaluación pedagógica con usuarios siguen en desarrollo.

## v0.8 · Libreta escolar como tema predeterminado

Los nuevos recursos CLF adoptan **papel cuadriculado crema, margen rojo, perforaciones, notas manuscritas, resaltadores cálidos y calculadora física**, con animaciones vinculadas a operaciones reales. La presentación es configurable e independiente del contenido académico.

- `CLFKit.create(lesson)` aplica `school-notebook` dentro de Shadow DOM; **no modifica los estilos de la página anfitriona**.
- `CLFKit.create(lesson,{theme:'neutral'})` conserva el estilo neutro anterior.
- `controller.setTheme('neutral')` o `controller.setTheme('school-notebook')` cambia el tema de los componentes montados **sin reiniciar el timeline**.
- `node scripts/build-html.mjs examples/pert-cpm.lesson.json dist/pert-cpm.html` usa la libreta por defecto.
- `npm run build:neutral` genera el reproductor clásico sin cambiar el tema preferido.
- El recurso independiente de balanceo de línea `CLFSchoolNotebook` mantiene su estética original.

El diseño está especificado en [`references/DESIGN_SYSTEM.md`](references/DESIGN_SYSTEM.md), con tokens de referencia en [`assets/themes/school-notebook.tokens.json`](assets/themes/school-notebook.tokens.json). La skill ofrece la libreta como **estilo por defecto para nuevos materiales**, pero respeta la identidad del usuario o proyecto, sin imponer una disposición fija.

## ¿Para qué sirve?

La skill instruye al agente para elaborar tres experiencias complementarias:

| Modalidad | Experiencia |
| --- | --- |
| Demostración | Procedimiento animado, anotaciones, calculadora y diagramas sincronizados. |
| Práctica guiada | El alumno predice y calcula antes de ver la respuesta, con pistas progresivas. |
| Evaluación | Caso nuevo, respuestas bloqueadas hasta enviar y explicación posterior. |

Aplicaciones: PERT/CPM, EOQ, análisis de inventario, estadística, matemáticas, física, pronósticos y otros procedimientos paso a paso.

## Estructura

```text
cognitive-learning-flow/
├── SKILL.md                       # Punto de entrada para agentes
├── references/
│   ├── PEDAGOGY.md
│   ├── ARCHITECTURE.md
│   └── QUALITY_GATES.md
├── assets/
│   └── lesson.schema.json
├── examples/
│   └── pert-cpm.lesson.json
├── runtime/
│   ├── core.js
│   ├── kit.js           # Recursos en Shadow DOM para páginas existentes
│   ├── player.js        # Reproductor de página completa (opcional)
│   └── styles.css
├── scripts/
│   ├── validate-lesson.mjs
│   └── build-html.mjs
├── tests/
│   ├── validate.test.mjs
│   └── player.test.mjs
├── .github/workflows/ci.yml
├── package.json
└── README.md
```

## Instalación en cualquier proyecto

**Opción A. Local**: Copia esta carpeta como `.agents/skills/cognitive-learning-flow/` dentro del proyecto consumidor. OpenCode y otros agentes compatibles detectan `SKILL.md` desde esa ubicación.

**Opción B. Git submodule** (cuando este repositorio esté publicado):

```sh
git submodule add https://github.com/EmyFox/cognitive-learning-flow.git .agents/skills/cognitive-learning-flow
```

Para actualizar: `git submodule update --remote .agents/skills/cognitive-learning-flow` (revisar cambios antes de integrar).

**Opción C. Global OpenCode**: Instalar la carpeta en `~/.config/opencode/skills/cognitive-learning-flow/`. La ubicación está documentada oficialmente por OpenCode: https://opencode.ai/docs/skills.

> Algunos repositorios ignoran `.agents/`; ajusta su `.gitignore` de manera acotada si deseas versionar esta skill como submódulo. No cambies indiscriminadamente otras exclusiones.

## Ejemplo de solicitud al agente

```text
Carga la skill cognitive-learning-flow.
Crea un laboratorio HTML offline para explicar el método EOQ de Ingeniería Industrial.
Antes de animar verifica los resultados matemáticamente. Incluye demostración,
práctica guiada y evaluación, escritura en el cuaderno y calculadora sincronizada.
Aplica la identidad visual del proyecto actual, sin introducir el branding de la skill.
```

## Validación

Se requiere Node.js 20 o superior, sin dependencias npm externas.

```sh
npm test
npm run validate:example
```

El validador revisa el contrato de lección, las expresiones y pulsaciones de la calculadora y el caso PERT/CPM (red acíclica, resultados, rutas críticas y estimación probabilística). **No es un sustituto de las pruebas del renderer HTML ni de una revisión pedagógica.**

## Ruta propuesta

- **v0.2:** motor de escenas HTML/SVG, calculadora real y timeline reversible (implementación inicial).
- **v0.3:** profundizar andamiaje y feedback adaptativo, asegurar la evaluación de alto impacto en servidor y automatizar pruebas de navegador.
- **v0.4:** plantillas para EOQ, control estadístico, pronósticos y PERT con múltiples rutas críticas.
- **v1.0:** ampliar renderizadores y adaptadores para React u otros sistemas, con QA accesible y estudios de uso.

## Independencia y licencia

El repositorio no incluye referencias a infraestructura privada ni claves. **No se adjunta licencia de distribución**: el propietario puede decidir después si lo mantiene privado o adopta una licencia open source.

## v0.2 · Motor HTML autónomo disponible

La v0.2 incorpora un motor real, **sin React, Firebase ni CDN**, compatible con el mismo contrato JSON de v0.1:

```sh
npm run build:example
# Genera dist/pert-cpm.html; abre el archivo en tu navegador

# O utiliza otra lección que cumpla el contrato JSON:
node scripts/build-html.mjs ruta/mi-leccion.lesson.json salida/mi-leccion.html
```

El reproductor integra:

- **Demo**: escritura progresiva, diagrama SVG PERT cuando hay actividades, calculadora sincronizada, reproducir/pausar, siguiente/anterior, velocidad y búsqueda de etapa.
- **Guiado**: predicción antes del resultado, respuestas con tolerancia, pista y explicación, calculadora manual.
- **Evaluación**: preguntas sin feedback visible hasta entregar, corrección y puntuación posterior. Un único HTML **no es un examen antifraude**.
- **Offline**: todos los recursos se incrustan en un único `.html` sin dependencias ni peticiones de red.
- **Control de estado**: `runtime/core.js` compila eventos y reconstruye notas, calculadora y diagrama desde un cursor independiente de temporizadores.

### Arquitectura de carpetas v0.2

```text
runtime/
  core.js       motor puro: cálculo seguro, timeline y snapshot
  player.js     componentes DOM y modalidades de estudio
  styles.css    variables CSS personalizables
scripts/
  build-html.mjs     exportador HTML autónomo
  validate-lesson.mjs  validador de datos y solución
```

Puedes personalizar apariencia con las variables CSS `--accent`, `--bg`, `--panel`, `--text` sin cambiar los modelos matemáticos. La representación SVG de precedencias es específica de los casos con `problem.activities`; el reproductor muestra una alternativa textual para lecciones sin red. **No es un generador universal de diagramas matemáticos arbitrarios**: harán falta renderizadores por dominio.

### Verificación v0.2

Se ejecutó `npm test` (18 pruebas), `npm run build:example`, y pruebas de flujo reales en Chromium en tamaños escritorio, 390 px y 375 px: pausa sin escritura adicional, salto de escena, respuestas guiadas, evaluación sin revelado previo ni errores JavaScript, y sin overflow horizontal. El CI ejecuta pruebas unitarias; el test de Chromium fue local y aún no se automatizó en GitHub Actions.

## v0.3 · Recursos embebibles en cualquier HTML existente

**Ya no es necesario que CLF organice toda la pantalla.** Puedes dejar intacto tu diseño, tus componentes, navegación y scripts y seleccionar solo los recursos educativos que necesita cada bloque.

```sh
# Generar assets + manifest; distribuye los recursos a tu gusto
npm run build:resources

# Integrar en un HTML existente con los contenedores data-clf elegidos
npm run build:integrated

# El reproductor completo sigue disponible por compatibilidad
npm run build:example
```

La API `CLFKit.create(lesson)` expone `mount(tipo, host)`, `setMode`, `seekSceneId`, `connectWorkflow`, `onChange`, `play`, `pause`, `destroy`, además de acciones guiadas y evaluación. Cada recurso usa Shadow DOM, sin CSS global. La integración automática preserva el archivo fuente y requiere un destino separado; `--force` permite reemplazar solamente la salida generada.

Consulta [referencias de integración](references/EMBEDDING.md) y [el ejemplo de web anfitriona](examples/existing-page.html). Aún no se ha hecho una auditoría formal WCAG ni un estudio de eficacia didáctica.

## v0.5 · Visualizaciones sincronizadas sin imponer diseño

**Ya no es solo PERT/CPM.** Se incorpora un reproductor modular basado en datos para:

- `bar`: barras y eje numérico, incluyendo valores negativos;
- `line`: serie temporal animada, puntos focalizados y rótulos;
- `process`: secuencia de etapas de transformación;
- renderizadores externos registrados con `CLFKit.registerVisualization('mi-grafico', fn)`.

Las visualizaciones no se muestran completas por defecto: **cada acción `visualize` decide cuánto revelar** y qué puntos resaltar con el mismo cursor del cuaderno, la calculadora y el razonamiento. `seek`, `pause` y el cambio de modo reconstruyen el estado. Evaluación no revela visualizaciones trabajadas.

### Ejecutar ambos casos

```sh
npm test
npm run validate:example
npm run validate:forecast
npm run build:forecast:resources
npm run build:forecast:integrated
```

Después abre `dist/forecast-integrated.html`: es una página anfitriona de ejemplo con CSS propio y recursos CLF embebidos. También se puede usar solo `visualization` sin calculadora ni cuaderno, o montar otros recursos en otro orden.

### API de ejemplo

```js
const app = CLFKit.create(CLF_RESOURCE_LESSON);
app.mount('visualization', '#mi-grafica');
app.mount('reasoning', '#razonamiento');
app.mount('notebook', '#papel');
app.onCue(cue => console.log(cue.kind, cue.visualization));
```

Consulta [Gramática visual](references/VISUAL_GRAMMAR.md) y [Embebido](references/EMBEDDING.md).

**Garantías y límites:** el validador prueba matemáticamente el promedio móvil simple del segundo ejemplo y el caso PERT del primero, pero no prueba cualquier fórmula introducida arbitrariamente por un autor. Los gráficos integrados solo cubren `bar`, `line` y `process`; exportaciones HTML de un único archivo no constituyen exámenes seguros contra inspección del código. Quedan pendientes accesibilidad formal y pruebas con estudiantes.


## v0.6 · Simulaciones que responden a las decisiones

Además de los recursos de escenas de v0.5, ahora existen `simulation` y `sensitivity`. Ambos son **opcionales** y pueden ubicarse libremente en cualquier HTML sin modificar los estilos globales.

- **Inventarios EOQ:** costos anuales, tamaño económico de pedido y consumos/reabastecimientos visualizados.
- **Colas M/M/1:** llegadas y servicio simulados con semilla; diferencia entre espera observada en muestra finita y espera teórica bajo estabilidad.
- **Producción:** Gantt de piezas/estaciones, cálculo de cuello de botella, capacidad teórica y rendimiento de una muestra.
- **Sensibilidad:** curvas recalculadas con los parámetros del escenario, sin conectar puntos de colas inestables como si fueran válidos.
- **Práctica:** pistas progresivas y retroalimentación específica para errores de fórmula frecuentes.

```bash
npm test
npm run validate:operations
npm run build:operations
npm run build:operations:resources
# Abrir dist/operations-integrated.html sin conexión.
```

### Integrar recursos nuevos sin adoptar nuestro diseño

```html
<div data-clf="simulation"></div>
<div data-clf="sensitivity"></div>
```

El anfitrión decide posición, navegación y tema visual. Véase [SIMULATION_ENGINE](references/SIMULATION_ENGINE.md). Una aplicación React/Vue puede montar/desmontar cada recurso mediante `CLFKit.create(lesson).mount(...)` como antes.

**Límite:** las gráficas son representaciones de modelos matemáticos sintéticos, no mediciones de planta reales, y la cola puede variar entre muestras (la semilla es reproducible). Para afirmar validez operativa real se requieren datos y validación externa.

## v0.7 · Libreta escolar animada (opcional y embebible)

La v0.7 incluye **un nuevo recurso con estética de cuaderno de clase**, sin imponer esa apariencia a los otros recursos del proyecto. El componente tiene su propia hoja cuadriculada, encuadernación, tinta azul, notas adhesivas, red de precedencias, estaciones y calculadora sincronizada.

```bash
npm run validate:school
npm run build:school
# Abre dist/school-line-balancing.html sin Internet.
```

**Tres modos:** la clase se escribe y calcula paso a paso; práctica con validación numérica y pistas; laboratorio para cambiar el pedido de 400/480/600 piezas y reconstruir automáticamente las estaciones. El contenido numérico proviene del motor `CLFLineBalancing.solve()`, no de animaciones codificadas con respuestas fijas. El método de asignación es una **heurística de primer elegible** que respeta precedencias, pero no garantiza óptimo global.

**Inserción sin layout impuesto:** `CLFSchoolNotebook.mount(host, lesson)` monta la libreta en un único nodo del HTML anfitrión, usando Shadow DOM. No reescribe CSS ajeno ni obliga a elegir modo pantalla completa. El proyecto mantiene su navegación y decide la posición; la piel escolar es optativa.

Consulta [la guía de cuaderno](references/SCHOOL_NOTEBOOK.md) y el [HTML anfitrión de ejemplo](examples/school-notebook-host.html). La versión mantiene todos los scripts, validadores y ejemplos de v0.6.


## v0.9 · Fórmulas y tinta sincronizadas con razonamiento

Ahora la libreta integra `runtime/ink-choreography.js`, un módulo **puro y sin dependencias** que valida cada ecuación contra un evaluador seguro y proyecta tres etapas: **modelo, sustitución, resultado**. El control de línea temporal controla tanto la fórmula como la tinta, notas, calculadora, tareas destacadas y asignación de estaciones. La nueva barra de progreso es navegable, admite pausa y avance/retroceso determinista.

```bash
npm test
npm run build:school
# Archivo offline: dist/school-line-balancing.html
```

**No imponer interfaz:** `CLFSchoolNotebook.mount(host, lesson)` sigue siendo opcional y usa Shadow DOM. Para integraciones parciales, `CLFInk.project(equation, phase)` puede alimentar cualquier HTML existente sin adoptar el layout de la libreta. Ver [coreografía de tinta](references/INK_CHOREOGRAPHY.md).

**Límite:** El trazo es un subrayado SVG animado por eventos matemáticos, no una simulación física exacta del movimiento de una mano. El método de balanceo usa una heurística, no optimización exacta.


## v0.10 · Animación fluida sin dependencias extra

La libreta ahora utiliza **un único reloj `requestAnimationFrame`**, en lugar de un temporizador independiente por carácter. El cuaderno conserva sus nodos de texto; las fórmulas cambian solo de fase y el estado se recupera desde checkpoints cada 64 eventos. Los acentos breves utilizan Web Animations API. Todo se puede pausar, retroceder y reproducir, y sigue sin necesitar Internet.

```bash
npm test
npm run build:school
# Abre dist/school-line-balancing.html
```

- **Móviles:** probar 375 y 390 px; controles al menos 44 px.
- **Accesibilidad:** respetar `prefers-reduced-motion` y dejar el contenido matemático legible sin animación.
- **Integración:** Shadow DOM, no inyecta estilos globales ni cambia layout anfitrión.
- **Librerías:** no obligatorias en tiempo de ejecución; elegir adaptadores opcionales según el caso. Véase [MOTION_ENGINE](references/MOTION_ENGINE.md).

La versión anterior queda compatible para los otros tipos de recursos; el nuevo reloj se aplica a la libreta de balanceo y está preparado para integrarse progresivamente al kit general. No implica que todos los renderizadores previos ya estén migrados.
