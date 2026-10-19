# Cognitive Learning Flow

Skill independiente y reutilizable para agentes de IA que convierten procedimientos de solución en laboratorios HTML interactivos. **No pertenece a Checkfox ni requiere un frontend, backend o nube específicos.**

> **Estado:** v0.3 experimental. Incluye un primer generador HTML offline y un reproductor de escenas, más el contrato JSON y validador matemático. Los renderizadores especializados por dominio y la evaluación pedagógica con usuarios siguen en desarrollo.

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
│   ├── player.js
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

## v0.3 · Kit de recursos para HTML y flujos existentes

CLF **ya no impone una página completa**. Genera recursos seleccionables que puedes colocar libremente en HTML o conectar a flujos existentes.

```bash
npm run build:resources   # JS + lección + manifest + ejemplo
npm run build:integrated  # insertar solo donde marques data-clf
npm run build:example     # página autónoma anterior
```

API: `CLFKit.create(lesson)` con `mount(tipo,host)`, `seekSceneId(id)`, `connectWorkflow({...})`, `onChange(fn)`, `play()`, `pause()`, `destroy()` y modos de demostración, práctica y evaluación.

Los nueve recursos son `notebook`, `calculator`, `diagram`, `controls`, `steps`, `transcript`, `guided`, `assessment` y `status`.

Cada recurso utiliza **Shadow DOM** para encapsular CSS; no modifica estilos, rutas ni navegación del anfitrión. La CLI no modifica el HTML original ni un destino existente sin `--force`. Para múltiples lecciones, usa instancias API distintas.

Consulta [Integración y flujos](references/EMBEDDING.md) y [HTML anfitrión](examples/existing-page.html). Límites: sin auditoría WCAG formal, renderizadores específicos de otros dominios ni estudios pedagógicos.
