# Sistema de diseño por defecto: School Notebook · CLF v0.8

## Decisión de producto

El cuaderno escolar utilizado en el demostrador de balanceo de línea es el **lenguaje visual predeterminado** para experiencias educativas nuevas de CLF. No es obligatorio cuando el usuario pide otra apariencia o una aplicación anfitriona exige su propio sistema de diseño.

**Tema no es disposición:** el motor no decide el grid de la página ni obliga a distribuir calculadora, diagrama y papel de una forma fija. Cada recurso montable en `CLFKit` vive en su propio Shadow DOM.

## Gramática visual

| Propósito didáctico | Tratamiento por defecto | Regla |
| --- | --- | --- |
| Área de resolución | papel crema con cuadrícula de 24px | ocupa solo el recurso; no se aplica a `body` del anfitrión |
| Orientación espacial | margen rosa-rojo y perforaciones | decoración sutil, sin ocultar texto |
| Concepto/título | serif con tinta azul oscuro | jerarquía semántica real |
| Fórmula o procedimiento | tinta azul con espaciado legible | texto seleccionable, accesible y exportable |
| Dato involucrado | resaltador amarillo | aparece en el instante del evento semántico |
| Comprobación | verde con icono o descripción | no comunicar significado solo con color |
| Error de procedimiento | rojo con explicación causal | nunca atribuir pensamientos al estudiante |
| Operación matemática | calculadora de teclas físicas | el resultado se calcula desde un parser seguro |
| Diagrama | SVG sobre papel claro | anima solo el nodo/flujo actualmente relevante |

La única fuente matemática del contenido permanece fuera del DOM. Los dibujos y efectos visuales son proyecciones del timeline.

## API y precedencias

- Recursos nuevos: `const controller = CLFKit.create(lesson)` → tema `school-notebook`.
- Recurso con apariencia neutral: `CLFKit.create(lesson,{theme:'neutral'})`.
- Conmutación de presentación: `controller.setTheme('neutral')`. No altera cálculos, cursor, respuestas ni modalidad.
- Reproductor de página completa: `buildHtml(lesson)` o CLI sin `--theme` usa `school-notebook`; `buildHtml(lesson,{theme:'neutral'})` conserva el antiguo aspecto.
- Balanceo de línea: `CLFSchoolNotebook.mount(...)` es un recurso especializado y conserva su propio diseño.
- Para aplicaciones con CSS estricto, integrarse mediante contenedores existentes y Shadow DOM. Nunca sobreescribir la hoja global del proyecto.

**Orden de precedencia de diseño:** solicitud explícita del usuario > restricciones explícitas del anfitrión > tema escolar predeterminado > fallback neutral. Si se exige fidelidad pixel-perfect al proyecto anfitrión, eliminar decoración escolar, no reescribir su diseño.

## Animaciones con propósito

1. Primero pregunta e identifica datos; subraya solo el valor activo.
2. Explica la estrategia y muestra la fórmula **sin reemplazar el modelo matemático**.
3. Sustituye un término a la vez. Sincroniza tinta, foco del diagrama y pulsaciones reales.
4. Tras evaluar una expresión, presenta resultado con unidades y una comprobación.
5. Verifica que `seek`, pausa, cambio de modo y `prefers-reduced-motion` son consistentes.
6. En modo evaluación no dibujes pistas o soluciones ocultas; HTML offline no es inviolable.

## Pruebas de calidad

Comprobar 375/390 px y escritorio, contraste en papel claro, foco de teclado, blancos del papel que no oculten datos, zoom 200%, ausencia de scroll horizontal global y consistencia de temas. Nunca afirmar que el contenido es óptimo/calibrado sin evidencia.

Tokens: `assets/themes/school-notebook.tokens.json`. Stylesheets de implementación: `runtime/kit.js` (Shadow DOM) y `runtime/school-standalone.css` (reproductor autónomo).
