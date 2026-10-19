# Cognitive Learning Flow · Simulación y sensibilidad (v0.6)

## Concepto central

La experiencia deja de ser una película: la persona modifica un parámetro, un **modelo numérico puro** recalcula los resultados y los recursos visuales muestran el nuevo estado. La simulación se vincula a una escena mediante una acción `scenario`; el mismo cursor gobierna cuaderno, calculadora, explicaciones y fotogramas.

No se debe confundir un modelo determinista, una corrida aleatoria finita y un resultado analítico de largo plazo.

## Contrato de escenarios

En `lesson.simulations[]`:

```json
{
  "id": "stock",
  "title": "Inventario · tamaño económico de pedido",
  "kind": "inventory-eoq",
  "parameters": {
    "annualDemand": 12000,
    "orderCost": 160,
    "holdingCost": 8,
    "orderQuantity": 600,
    "workingDays": 300
  },
  "controls": [
    {"key":"orderQuantity","label":"Lote Q","min":200,"max":1200,"step":25}
  ],
  "sensitivity": {"parameter":"orderQuantity","min":200,"max":1200}
}
```

Para activar sincronización: 

```json
{"type":"scenario","scenarioId":"stock","frames":24,"why":"Observa cómo cambia el nivel de inventario."}
```

Cada evento `simulationFrame` lleva `frame`, `frames` y `scenarioId`. Se recupera exactamente con `CLFCore.snapshot(...)`; pausar, retroceder o saltar no requieren recalcular pasos narrativos ni ejecutar eventos pasados. 

## Tres modelos integrados

### 1. EOQ / inventario

- Parámetros: demanda anual `D>0`, costo fijo por orden `S>0`, costo de mantenimiento `H>0` por unidad-año, lote `Q>0`, días laborables `0<days≤366`.
- Costo relevante anual: `C(Q)=D·S/Q + Q·H/2`.
- Lote óptimo: `Q* = sqrt(2·D·S/H)`.
- Periodo de reposición: `Q/(D/days)` días; muestra dientes de sierra con **reposición instantánea**.
- No modela descuentos por cantidad, faltantes, tiempos de entrega aleatorios ni stock de seguridad. No incluir costo de adquisición constante en la minimización.

### 2. Cola M/M/1

- `λ`: tasa media de llegadas; `μ`: tasa de servicio. **Las dos en la misma unidad**, por ejemplo operaciones/hora. Un servidor, disciplina FCFS, interllegadas y servicio exponenciales independientes.
- Si `μ>λ`: `ρ=λ/μ`, `Wq=λ/[μ(μ−λ)]`, `Lq=λ²/[μ(μ−λ)]`.
- Si `μ≤λ`: el promedio estacionario **no existe de forma finita**. Presentar `null`/"No estable", nunca un número falso.
- El gráfico es una **simulación de eventos discretos de muestra finita**, con `seed` y número de clientes; muestra por separado `observedQueueWait` y `expectedQueueWait`. No debe venderse como convergencia garantizada.
- Generación aleatoria determinista de `Uniforme(0,1)` con semilla y transformada exponencial inversa. No se utiliza para seguridad o criptografía.

### 3. Línea de producción

- `stationCycles`: tiempos fijos por estación en minutos; `arrivalInterval`: intervalo fijo de piezas entrantes.
- Cada trabajo comienza en una estación cuando acabó su etapa anterior y la estación quedó libre: `start(i,k)=max(end(i,k−1), end(i−1,k))`.
- Capacidad de cuello de botella: `60 / max(stationCycles)` unidades/hora.
- Capacidad alimentada teórica: `60 / max(max(stationCycles), arrivalInterval)`.
- Rendimiento de la muestra: `60·units / makespan`. Incluye transitorios de entrada y vaciado, y por tanto no debe confundirse con capacidad sostenida.
- Sin fallas, turnos, traslados, buffers finitos ni bloqueos; `stationCycles` es un vector controlado por el autor de la lección.

## API de host

```js
// Cargar clf-core.js, clf-simulations.js, clf-kit.js, clf-lesson.js en ese orden.
const app=CLFKit.create(CLF_RESOURCE_LESSON);
app.mount('simulation','#mi-simulador');
app.mount('sensitivity','#mi-curva');
app.mount('controls','#mis-controles'); // opcional

app.selectScenario('queue');
app.setScenarioParameter('serviceRate',7);
const now=app.getScenario(); // { id,kind,parameters,result,progress }
app.resetScenario();
app.seekSceneId('04-cola'); // la pista de escena cambia el escenario
app.onChange(state=>{
  // el anfitrión puede dibujar indicadores propios sin que CLF modifique su layout
  console.log(state.simulation?.id, state.simulation?.result?.metrics);
});
```

`setScenarioParameter` acepta **solo** controles declarados con intervalos finitos. Rechaza parámetros no autorizados o fuera de rango sin alterar el estado anterior. Los cambios de parámetro se aplican al confirmar el control; no se recrea el slider mientras está siendo arrastrado.

### Integración en HTML existente

Añade `<div data-clf="simulation"></div>` y `<div data-clf="sensitivity"></div>` donde prefieras. Ejecuta:

```bash
npm run build:operations
```

El script genera `dist/operations-integrated.html`, preserva el HTML anfitrión e incluye scripts sin CDN. Para recursos separados usa `npm run build:operations:resources`.

## Guiado y evaluación

- Los modelos y los resultados se ocultan en **guiado no resuelto** y en **evaluación**; en este último, `getScenario()` también devuelve `null`.
- En la práctica, `checkpoint.hints[]` permite aumentar ayudas por niveles; `checkpoint.misconceptions[]` diagnostica respuestas numéricas equivocadas conocidas (ej.: incluir solo una mitad del costo EOQ). Debe justificarse cada error, no inventar “diagnósticos” psicológicos.
- Todo JSON/HTML del cliente contiene el solucionario y **no sustituye un examen seguro**.

## Requisitos al extender modelos

1. Implementar una función pura en `runtime/simulations.js` con parámetros validados y salidas tipadas (métricas, muestra y explicación de supuestos).
2. Añadir validación en `scripts/validate-lesson.mjs` y contrato JSON Schema.
3. Diseñar gráfico en Shadow DOM sin afectar el CSS del anfitrión; incluir transcripción / descripción accesible.
4. Escribir casos unitarios para aproximaciones, condiciones inestables y extremos.
5. Agregar una lección completa con checkpoint y explicación sin filtrar respuestas.
6. Documentar qué representa la simulación y qué **no** puede inferirse de ella.
