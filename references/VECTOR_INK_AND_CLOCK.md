# CLF v0.11 · Reloj compartido y tinta vectorial

## Principio de diseño

**El cálculo decide qué dibujar; la animación solo visualiza el cálculo.** El cursor de eventos es la fuente de verdad. Nunca se puede llegar visualmente a una respuesta si no se ha ejecutado el evento matemático correspondiente.

## Qué recursos están mejorados

- `runtime/motion-clock.js`: reloj determinista `requestAnimationFrame` con pausa, velocidad, `seek`, cancelación y respeto de movimiento reducido.
- `runtime/kit.js`: cuando CLFMotion está presente, `CLFKit` comparte ese reloj para `notebook`, `formula`, `calculator`, `diagram`, `visualization`, `reasoning` y demás recursos montados. Sin CLFMotion conserva compatibilidad con la ruta de temporizador anterior.
- `runtime/vector-ink.js`: alfabeto vectorial de trazos SVG **originales**, dibujados mediante `stroke-dashoffset`; planificación de glifos inmutable `plan(text, progress)`. No convierte fuentes de terceros en vectores ni descarga tipografías.
- `runtime/school-notebook.js`: utiliza la misma tinta para las sustituciones verificadas del balanceo de línea, en la pantalla con estilo escolar.
- `runtime/core.js`: instantáneas reutilizables cada 64 eventos; cada lectura devuelve su estado desacoplado, así que navegar atrás o mutar una representación no contamina el historial.

## Integración en HTML existente

Después de `clf-core.js` y `clf-simulations.js`, cargar:

```html
<script src="clf-motion.js"></script>
<script src="clf-vector-ink.js"></script>
<script src="clf-kit.js"></script>
<script src="clf-lesson.js"></script>
```

El orden importa. El script `build-resources.mjs` genera esas dependencias automáticamente y `integrate-html.mjs` las embebe en el HTML de salida sin alterar su layout.

```js
const app = CLFKit.create(CLF_RESOURCE_LESSON);
app.mount('notebook', '#apuntes');
app.mount('formula', '#formulas');
app.mount('calculator', '#calculadora');
app.play();
// Cuando quieras reproducir la sustitución de forma exacta:
app.seekAction('03-pert', 1, 'start');
// Pausar cancela los siguientes cuadros y conserva el cursor.
app.pause();
```

El recurso `formula` conserva el texto aritmético original accesible y genera además un SVG de trazos. La posición del cursor determina el progreso de los glifos. **Una animación de tinta no sustituye la validación matemática** ni garantiza caligrafía humana auténtica. Glifos no contemplados se dibujan como `?` y mantienen el texto accesible completo.

## Por qué no añadimos librerías como dependencia obligatoria

`requestAnimationFrame`, SVG y Web Animations API son suficientes para la sincronización actual y funcionan offline con 0 dependencias de tiempo de ejecución.

Opciones futuras, solo cuando una lección lo necesite:

- **Motion**: transiciones geométricas y transformaciones complejas; empaquetar versión local antes de exportar offline.
- **KaTeX**: composición tipográfica rigurosa de álgebra avanzada; es un compositor matemático, no un motor de sincronización.
- **perfect-freehand**: convertir trazos reales de lápiz o puntero en contornos; no es necesario para animar una fórmula SVG predefinida.

Requerimientos antes de introducirlas: licencia comprobada, tamaño final, fuente local, cobertura de teclado, CSP, rendimiento móvil, y modo sin movimiento.

## Límites conocidos

1. El alfabeto de trazos es un sistema de caracteres simple; no representa integrales, matrices, fracciones apiladas ni tipografía matemática completa.
2. La proyección SVG sigue el cursor semántico, no la captura de una mano real.
3. `player.js` (reproductor completo heredado) todavía usa su reloj anterior. Esta iteración optimiza el kit modular y la libreta escolar; el reproductor completo debe migrarse en una versión posterior.
4. La captura HTML sin backend no oculta las respuestas del código fuente.
5. Falta una auditoría WCAG completa y pruebas de aprendizaje con estudiantes.
