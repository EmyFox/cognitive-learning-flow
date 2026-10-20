# CLF — protocolo de resolución mental observable (v0.12)

La meta **no** es revelar más pasos por segundo; es permitir que una persona sin experiencia **aprenda una secuencia reutilizable** y pueda repetirla sin copiar un resultado.

## Guion mínimo obligatorio para problemas cuantitativos

1. **Leer la pregunta**: escribir la incógnita y su unidad antes de buscar una fórmula.
2. **Subrayar datos**: vincular cada dato con la frase exacta del enunciado (`source`); distinguir valores, unidades y magnitud física.
3. **Clasificar**: explicar por qué un número es D, S, H, etc. Los distractores explícitos también necesitan razones para descartarse.
4. **Auditar unidades**: distinguir por ejemplo piezas/año, pesos/pedido, pesos/(pieza·año); no mezclar escalas temporales sin conversión.
5. **Decidir estrategia**: describir la regla de selección de fórmula y sus supuestos; mostrar por qué otra expresión sería errónea.
6. **Escribir el modelo**: presentar forma simbólica primero; las cifras todavía no reemplazan a las letras.
7. **Sustituir UNO A UNO**: mostrar símbolo → fuente textual → cifra y unidad. No alterar operadores accidentalmente.
8. **Operar por microacciones**: una operación matemática significativa por checkpoint; conservar los valores intermedios con etiqueta propia.
9. **Interpretar**: convertir magnitud a acción real; diferenciar cantidades continuas de decisiones enteras.
10. **Verificar independientemente**: repetir un cálculo por un camino diferente, comprobar identidades, unidades y orden de magnitud.
11. **Transferir**: dar un segundo conjunto de datos; preguntar antes de mostrar la solución. El resultado nuevo debe ser derivado, no copiado.

Si el estudiante falla, no decir simplemente «incorrecto»; señalar la **clase del error**: confundir datos, omitir unidad, operación equivocada, paréntesis/orden, redondear prematuramente, interpretar magnitud como frecuencia, resultado sin comprobación.

## Contrato de microetapas

- `data[]`: `id`, `label`, `value`, `unit`, `source`, `relevant`, `meaning`.
- `calculations[]`: `id`, `expr` (AST aritmético seguro), `expected` auditado, `unit`, `display`.
- `steps[]`: `id`, `phase`, `headline`, `prompt`, `preview` **sin respuesta**, `explanation` **posterior**, `reason`, `mentalRule`, `dataRefs`, `calculationRefs`, `check`.
- `check` numérico: `expectedRef` calculada desde el AST, `tolerance` con unidad explícita, `wrongFeedback`, dos pistas progresivas.
- `check` conceptual: mínimo dos opciones, una correcta y *retroalimentación específica por distractor*.
- `problemSentences[]` permiten destacar la fuente original del dato sin cambiar el HTML anfitrión.
- El motor no usa `eval`, `Function` ni scripts arbitrarios. Sus únicas operaciones autorizadas: add, subtract, multiply, divide, sqrt.
- No fingir que el renderer diagnostica automáticamente todos los errores: para respuestas numéricas ofrece una orientación general; las opciones pueden dar un diagnóstico **escrito por el autor**.

## Política de divulgación y práctica

- Modo **estudio**: el alumno puede pedir «muéstrame cómo» en cualquier microetapa, pero la explicación completa no aparece antes de solicitarla.
- Modo **práctica**: el alumno intenta responder primero; puede pedir dos pistas o equivocarse dos veces antes de solicitar la solución. Los pasos revelados se contabilizan como *vistos con ayuda*, no como *dominados*.
- Al cambiar de modo se reinician respuestas; no se conserva el estado de revelación de la demostración.
- No incluir los resultados exactos en `preview`. Las pistas no deben entregar directamente la respuesta que se está evaluando.
- Nunca usar esta técnica como prueba de aprendizaje demostrada sin un estudio de usuarios.
- Un HTML sin backend **no es una evaluación antifraude**: el JSON y el script contienen las soluciones aunque no se presenten anticipadamente en la UI.

## Mejores prácticas de ritmo

- Para principiantes: un solo cambio de significado u operación por etapa; evitar mostrar simultáneamente una red, una fórmula nueva, una tabla nueva y tres notas.
- «¿Qué dato y por qué?» siempre antecede a «¿qué número?». Un dato sin fuente no debe entrar en la calculadora.
- Si una fórmula exige una cadena larga, dividirla en estados intermedios con unidades y pruebas individuales.
- No exigir memorizar el resultado del ejemplo; exigir repetir el procedimiento con datos nuevos.
- Reducir gradualmente el andamiaje; las ayudas sirven para aprender, no para automatizar la elección del estudiante.

## Ejemplo EOQ validado

El fixture `examples/eoq-mental-tutor.json` separa veinte checkpoints: decidir qué se busca, encontrar D/S/H, descartar precio de venta, unidades, elegir modelo, sustituir, operar numerador en dos pasos, dividir, raíz, redondeo, frecuencia, costos y verificación, interpretación y transferencia.

La referencia calculada para D=12 000, S=300, H=24 es `sqrt(300000)` ≈ 547.723 piezas por pedido, con C_pedir = C_mantener ≈ 6572.67 MXN/año en el modelo clásico. Ejemplo independiente D=18 000, S=200, H=25, Q≈536.66.

**Supuestos explícitos:** demanda estable, sin descuentos por volumen, sin faltantes, reabastecimiento instantáneo y costos constantes. No generalizar el mismo equilibrio a extensiones de EOQ sin revalidarlo.

## Inserción en HTML ya existente

1. Conserva el HTML original.
2. Añade únicamente `<div data-clf-mental-tutor></div>` dentro de un contenedor elegido.
3. Genera un **nuevo** HTML de salida:

```sh
node scripts/build-mental-tutor.mjs examples/eoq-mental-tutor.json dist/eoq.html ruta/mi-sitio.html
```

El CSS reside dentro de Shadow DOM. También puede montarse programáticamente:

```js
const tutor = CLFMentalTutor.create(lesson);
const unmount = tutor.mount(document.querySelector('#contenedor'));
tutor.onChange(state => console.log(state.index, state.mastered));
// Al salir: unmount(); tutor.destroy();
```

El exportador autónomo incrusta JS+JSON sin red y **no reemplaza el archivo HTML de entrada**. Para un proyecto React/Vue, el adaptador debe instalar el componente solo dentro del nodo asignado y desmontarlo al destruir la vista.

## Puertas de calidad

- Cero discrepancias entre AST, `expected`, unidades y textos mostrados.
- Dos casos o escenarios diferentes como mínimo.
- Al menos un distractor útil pero irrelevante.
- Ninguna respuesta en el preview de preguntas numéricas.
- Cada paso justifica de dónde sale el número y por qué la operación corresponde.
- Cada error conceptual ofrece explicación propia; cada error numérico recibe orientación segura, sin fingir detección individual.
- Capturas/QA de móvil, teclado, retroceso, reinicio, revelado, cambio de modo y salida offline.
