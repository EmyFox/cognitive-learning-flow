# Gramática de representaciones visuales · CLF v0.5

## Del razonamiento a la gráfica

Los datos no se animan para adornar, sino para explicar una transformación. `visualizations` describe los elementos posibles; una acción `visualize` **controla qué puede verse en un instante**. El timeline es la fuente de verdad.

### Contrato

```json
{
  "visualizations": [
    {
      "id": "ventas",
      "kind": "bar",
      "title": "Historial de demanda",
      "unit": "unidades",
      "points": [{"id": "ene", "label": "Ene", "value": 96}]
    }
  ],
  "scenes": [{
    "actions": [
      {"type": "visualize", "visualizationId": "ventas", "reveal": 1,
       "focus": ["ene"], "why": "Identificar demanda observada"}
    ]
  }]
}
```

- `bar`: magnitudes discretas; eje cero explícito, números negativos soportados.
- `line`: tendencia ordenada de valores; la secuencia se convierte en línea y puntos.
- `process`: pasos discretos; cada punto usa `label` y `detail` opcional, y no requiere `value`.
- `reveal`: número de elementos iniciales visibles en el orden del archivo.
- `focus`: IDs **ya revelados**, nunca datos futuros; `validate-lesson.mjs` lo comprueba.
- `visualize` es una acción como cualquier otra; al reproducir, pausar o hacer seek, cambia sincronizada con calculadora, razonamiento y papel.

## Renderizador personalizado

```js
const unsubscribe = CLFKit.registerVisualization('heatmap', ({spec, points, current, host, dom}) => {
  const element = dom.createElement('div', 'Mi representación');
  host.append(element);
  // points: solo los datos revelados; current.focus: ids focalizados.
});
```

El registro de extensiones **deliberadamente ejecuta código suministrado por el desarrollador del proyecto**; solo registrar renderizadores confiables. La app anfitriona controla carga, estilos de fondo y distribución. La función de registro devuelve una función para desregistrar. Los tipos integrados no pueden sobrescribirse.

## Reglas de diseño

1. La respuesta no se revela antes de la operación que la justifica.
2. Cada cambio visible posee un `why` sobre la decisión cognitiva y `focus` sobre los datos pertinentes.
3. Contrastes, unidades y transcripción nunca quedan ocultos detrás de una animación.
4. Ninguna gráfica de puntos es un sustituto de un solver independiente.
5. Animaciones cortas, bajo control de usuario y deshabilitadas con `prefers-reduced-motion`.
6. Para ejemplos de forecasting, separar observaciones históricas de pronósticos futuros.

## Limitaciones

El parser aritmético solo admite operaciones elementales; otros dominios requieren validadores matemáticos propios. Un diagrama SVG genérico no debe usarse para afirmar validez estadística o causalidad. Los datos en cliente no sirven para exámenes protegidos contra inspección.
