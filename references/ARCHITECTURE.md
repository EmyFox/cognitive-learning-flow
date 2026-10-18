# Arquitectura independiente de plataforma

## Flujo de datos

```
problem.data
    ↓
domain solver (función pura)
    ↓
groundTruth verificada
    ↓
scene builder (objetivo / por qué / acciones)
    ↓
mode controller (demo | guided | assessment)
    ↓
proyecciones: papel · calculadora · diagrama · voz · transcripción
```

**Una sola verdad matemática:** los paneles muestran distintas vistas de la misma operación. Una animación no redefine resultados.

## Máquina de estados

`idle → playing ⇄ paused → completed` para demostración; `awaiting-answer` en ejercicios. Se debe permitir `restart`, `seek` y cambio de modalidad. Las animaciones se recomponen al avanzar a otra escena.

### Reglas del timeline

- Cada acción tiene identificador, duración y progreso interno.
- Pausar conserva índice de acción + carácter/tecla en curso; no se crean temporizadores duplicados al reanudar.
- `seek`/`previous` reconstruyen el estado final de todas las escenas previas de forma determinista (no dependen de volver a disparar efectos).
- Cambiar modo elimina timers y estado anterior.
- Velocidades 0.5×, 1×, 1.5× y 2×; alternativa instantánea de movimiento reducido.
- Los textos se presentan en una transcripción accesible para evitar tener que esperar a que aparezca letra por letra.

### Calculadora

- Acepta expresiones matemáticas controladas por un parser, no código arbitrario.
- Separar el número real del formato visual para evitar errores de redondeo.
- Pulsación simulada corresponde exactamente a la operación documentada.
- Ofrecer uso manual real en los modos que lo requieran.

### Seguridad del modo evaluación

- No mostrar respuestas ni ruta crítica en diagramas ni atributos accesibles antes del envío.
- No mantener el estado visible heredado de demostración.
- Un HTML autónomo **no oculta de verdad las respuestas en el código fuente**; no usarlo como examen inviolable.

## Requisitos de portabilidad

- No asumir React, Firebase, una marca ni APIs específicas.
- Estilos desacoplados para adaptación visual por el proyecto consumidor.
- Para exportación offline standalone, incluir JS/CSS inline y ninguna dependencia de terceros.
- El esquema JSON es de **autoría**; cualquier renderer ha de declarar explícitamente la versión compatible.

## Contrato JSON mínimo

`problem`: `statement`, `units`, opcionalmente `activities` para PERT/CPM.

`groundTruth`: resultados de referencia. `scenes[]`: `id`, `phase`, `goal`, `rationale` y `actions[]` (`write`, `calculator`, `highlight`, `diagram`, `question`, `reveal`).

`assessment.items[]`: preguntas con opciones y feedback por opción, y `correctOptionId`.

Ver `assets/lesson.schema.json`. El validador implementa las invariantes principales para el caso PERT, no todo JSON Schema 2020-12.
