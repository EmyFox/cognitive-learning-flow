# Cognitive Learning Flow

Skill independiente y reutilizable para agentes de IA que convierten procedimientos de solución en laboratorios HTML interactivos. **No pertenece a Checkfox ni requiere un frontend, backend o nube específicos.**

> **Estado:** v0.1 experimental. Esta versión proporciona la metodología, el contrato de datos, el ejemplo PERT/CPM y el validador. El generador/renderer HTML universal está previsto para una versión futura.

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
├── scripts/
│   └── validate-lesson.mjs
├── tests/
│   └── validate.test.mjs
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

- **v0.2:** motor de escenas HTML/SVG, calculadora real y timeline reversible.
- **v0.3:** modos guiado y evaluación con aislamiento de estados, pruebas de navegador.
- **v0.4:** plantillas para EOQ, control estadístico, pronósticos y PERT con múltiples rutas críticas.
- **v1.0:** exportación standalone HTML y adaptadores para React u otros sistemas, con QA accesible.

## Independencia y licencia

El repositorio no incluye referencias a infraestructura privada ni claves. **No se adjunta licencia de distribución**: el propietario puede decidir después si lo mantiene privado o adopta una licencia open source.
