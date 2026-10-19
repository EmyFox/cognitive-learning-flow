# CLF Motion Engine v0.10 — fluidez antes que efectos

## El problema resuelto

El renderizador de la libreta v0.9 usaba `setTimeout` por carácter, volvía a crear todas las líneas en cada paso y reconstruía el estado desde el evento cero. En contenidos largos eso provocaba trabajo innecesario, ritmo variable y pérdida de suavidad durante el playback.

## Arquitectura implementada

1. `runtime/motion-clock.js`: un único reloj `requestAnimationFrame` por instancia. Usa tiempo real con velocidad 0.5×/1×/1.5×/2×, limitación de saltos tras suspender una pestaña, pausa y seek sin fugas de callbacks. La progresión visual no puede avanzar más allá del cursor semántico.
2. `compileStages` guarda **instantáneas cada 64 eventos**; `snapshot` reproduce como máximo 63 eventos. El estado sigue determinado solamente por eventos de la lección, no por timers ni CSS.
3. `updateInkLines` mantiene los mismos nodos y cambia solo el nodo de texto que avanzó. Mantiene el cursor de escritura y no recrea el cuaderno entero a cada glifo.
4. `renderEquation` crea los tres pasos una vez por ecuación y cambia estados solo cuando cambia la fase del cálculo.
5. El foco del grafo se actualiza únicamente cuando cambia el conjunto de tareas resaltadas.
6. Se usa la **Web Animations API (WAAPI)** nativa para enfatizar un evento `key`, `equation` o `station` con transforms/opacity sin cambiar el resultado del solver. Al pausar, seek, cambiar de modo o destruir la instancia, se cancelan los efectos efímeros.
7. `visibilitychange` pausa al ocultar la pestaña para evitar que el estudiante se pierda información. `prefers-reduced-motion` mantiene la secuencia semántica con una presentación casi instantánea.

## Qué librerías añadir, cuándo y por qué

**No añadir dependencias obligatorias al core offline** por estética. Primero medir tareas de renderizado y verificación matemática.

| Necesidad real | Tecnología | Política |
| --- | --- | --- |
| Transiciones habituales, botones, cuaderno y highlights | **WAAPI + CSS transforms** | Implementación predeterminada, sin descargas |
| Coreografía compleja de SVG, secuencias visuales o springs | **Motion (`motion/mini` o hybrid)** | Adoptar como **adaptador opcional**; mantener fallback nativo, revisar empaquetado offline |
| Ecuaciones LaTeX de contenido científico | **KaTeX** | Añadir solo a módulos que requieren composición tipográfica matemática; empaquetado local, nunca CDN obligatorio |
| Trazos de pluma por puntos/presión | **perfect-freehand** | Optativo para trazos SVG genuinos; no mejora per se la escritura de texto |
| Animaciones complejas de morphing, ScrollTrigger y timelines avanzados | **GSAP** | Analizar licencias y caso de uso, no imponer al generador de recursos |
| Tests de navegador automatizados | **Playwright** | Añadir como dependencia de desarrollo en una iteración de QA, no en el HTML del estudiante |

La fluidez no se demuestra con un número de cuadros inventado: medir con Performance API/DevTools, observar en hardware modesto y testear desktop/móvil y modo de movimiento reducido.

## Reglas innegociables

- No iniciar animaciones independientes por cada recurso visual; conectar todo al mismo estado y al mismo cursor.
- Nunca animar un número hacia un resultado antes de que el evento semántico `result` autorice revelarlo.
- Toda animación de énfasis debe poder cancelarse y nunca convertirse en fuente de verdad matemática.
- Evitar `innerHTML` con contenidos de estudiantes; escribir mediante `textContent` o `createTextNode`.
- El diseño escolar es el predeterminado para proyectos nuevos; Shadow DOM impide estilos globales en HTML existente.
- No sacrificar legibilidad, teclado, lectura estática o `prefers-reduced-motion` por efectos.

## Uso

```bash
npm test
npm run build:school
```

Para el recurso de balanceo, `CLFSchoolNotebook.mount(host, lesson)` incluye el reloj automáticamente dentro de un HTML autónomo. Los usuarios pueden reproducir, pausar, saltar de paso, hacer scrubbing, ajustar la velocidad y cambiar al laboratorio de demanda sin dependencia externa.
