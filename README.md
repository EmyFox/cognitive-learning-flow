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
