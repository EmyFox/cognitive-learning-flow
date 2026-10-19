# Integración en HTML o flujos ya existentes

## Principio de composición

El motor NO decide el layout ni reescribe una pantalla existente. Una lección produce **recursos que el proyecto consumidor coloca donde quiera**. `CLFKit.create(lesson)` controla estado y tiempo; `controller.mount(resource,element)` es opcional, independiente y reversible.

Recursos: `notebook`, `calculator`, `diagram`, `controls`, `steps`, `transcript`, `guided`, `assessment`, `status`.

### Desde JS existente (sin modificar tus componentes)

```html
<section id="mis-apuntes"></section>
<aside id="calculadora"></aside>
<script src="clf-core.js"></script>
<script src="clf-kit.js"></script>
<script src="clf-lesson.js"></script>
<script>
const controller = CLFKit.create(CLF_RESOURCE_LESSON);
const removeNotes = controller.mount('notebook', '#mis-apuntes');
controller.mount('calculator', '#calculadora');
// Cualquier parte de tu flujo controla el progreso:
controller.seekSceneId('03-pert');
// Al desmontar pantalla:
// removeNotes(); controller.destroy();
</script>
```

Todos los recursos renderizan dentro de **Shadow DOM**. No hay hoja CSS global ni alteraciones de `body`, `head` o la navegación existente. Solo se añade contenido a contenedores elegidos. Su aspecto puede adaptarse con propiedades CSS heredables como `--clf-accent`, `--clf-ink`, `--clf-surface` y `--clf-paper` definidas en el contenedor anfitrión.

### Sin escribir JavaScript en tu página existente

Marca contenedores **ya existentes** con `data-clf`:

```html
<div class="mi-grid">
  <div data-clf="notebook"></div>
  <aside data-clf="calculator"></aside>
</div>
```

Luego ejecuta:

```sh
node scripts/integrate-html.mjs mi-pagina.html ejemplos/mi-leccion.lesson.json nueva-pagina.html
```

La CLI conserva el HTML original y agrega **solo scripts antes de `</body>`**. No sobreescribe el original ni un destino existente sin `--force`. Genera un único HTML offline. El evento `clf:ready` expone `event.detail.controller` a quien lo escuche.

### Conectar a un flujo o wizard existente

```js
const detach = controller.connectWorkflow({
  target: document,
  eventName: 'mi-wizard:step',
  resolve(detail) { return detail.lessonSceneId; }
});
// Evento del flujo anfitrión:
document.dispatchEvent(new CustomEvent('mi-wizard:step', {
  detail: {lessonSceneId:'03-pert'}
}));
// Al salir de la página:
detach(); controller.destroy();
```

El adaptador solo sincroniza escenas si el controlador está en modo demostración. No revela soluciones de modo guiado o evaluación. También existe `onChange(state => ...)` para conectar indicadores de progreso, accesibilidad o analíticas del anfitrión **si el usuario autoriza las métricas**.

### Usar solo algunos recursos

```sh
node scripts/build-resources.mjs examples/pert-cpm.lesson.json dist/my-kit
```

El paquete incluye assets JS/JSON y un `manifest.json` con los recursos disponibles. **No instala ninguno automáticamente.** El archivo `example-host.html` es opcional y existe solo para comprobar la integración.

## Limitaciones y seguridad

- La lección JSON y el HTML exportado **incluyen respuestas**; examen de alto impacto requiere servidor.
- La CLI asume HTML válido y un solo caso por integración automatizada. Para múltiples lecciones o componentes de framework, usar la API `CLFKit.create()` directamente y montar cada instancia.
- Un Content Security Policy estricto puede bloquear scripts inline; con CSP restrictiva, usar assets externos autorizados en lugar de `integrate-html.mjs`.
- No introducir HTML dinámico con `innerHTML` desde contenido educativo. Todo texto de escenas entra mediante `textContent`.
- Cada contenedor es elegido explícitamente. Destruir controlador cancela temporizadores, eventos de workflow y montajes.
- El CSS dentro de Shadow DOM es aislado, aunque las propiedades custom CSS heredables se pueden usar para adaptar colores y tipografía.

## Componentes visuales independientes (v0.5)

Si tu sitio ya tiene su propia jerarquía visual, agrega únicamente:

```html
<section id="mi-grafica"></section>
<script>
const clf = CLFKit.create(lesson);
clf.mount('visualization', '#mi-grafica');
// La app anfitriona puede saltar a una acción después de su propio evento.
clf.seekAction('05-verificar', 1, 'end');
</script>
```

El componente usa Shadow DOM, mantiene el mismo cursor que los demás y muestra una transcripción accesible de los puntos revelados. No carga hojas de estilo globales. El texto y los datos entran por `textContent`/SVG text, no `innerHTML`. Véase `VISUAL_GRAMMAR.md`.
