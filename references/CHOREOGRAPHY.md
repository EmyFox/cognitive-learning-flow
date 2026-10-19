# Coreografía de razonamiento · CLF v0.4

## Objetivo

Convertir el método de resolución en un montaje multisuperficie donde **cada efecto responde a un evento validado**. No simular pensamiento privado.

## Gramática causal

1. **Orientar**: establecer objetivo y datos conocidos con una transición breve.
2. **Focalizar**: iluminar variables necesarias, desatenuar irrelevantes (nunca ocultarlas).
3. **Justificar**: verbalizar por qué una fórmula/algoritmo aplica y mostrar qué habría de fallar si se elige otra regla.
4. **Sustituir**: destacar valores del problema y su posición en la expresión.
5. **Calcular**: animar las teclas de la calculadora y la expresión (parser seguro, fuente única).
6. **Anotar**: escribir resultado y unidades en el cuaderno, con cursor controlable.
7. **Propagar**: resaltar nodos/arcos que cambian en el diagrama; nunca insinuar que toda la red cambia.
8. **Comprobar**: contrastar resultado con unidades, desigualdades, orden de magnitud o cálculo independiente.
9. **Interpretar**: vincular el resultado a una decisión operativa.

Estas fases son una gramática, no un guion rígido. Omitir cualquier recurso que no aporte.

## Contrato de acción (retrocompatible)

```json
{
  "type": "calculator",
  "expression": "(5+4*7+9)/6",
  "expected": 7,
  "focus": ["E"],
  "why": "PERT pondera más la estimación probable.",
  "callout": "Sustituimos a, m y b antes de operar.",
  "animation": {"kind": "calculate"}
}
```

`core.compile` genera eventos `cue` antes de los caracteres y teclas; `core.choreography` reconstruye la intención desde el **mismo** cursor del cuaderno y la calculadora. `onChange(state).cue` permite que una web anfitriona anime componentes propios en vez de usar los de CLF.

## Accesibilidad y causalidad

- Movimiento reducido: estados finales visibles, sin efectos constantes.
- La animación **nunca es la única manera de entender** el paso; explicación textual y transcripción siempre disponibles.
- Un examen no recibe `cue` ni notas solucionadas antes de enviar.
- Las animaciones deben explicar datos, operaciones y consecuencias; evitar partículas, destellos repetitivos o cuentas inventadas.
- Usar `focus` semántico para iluminar variables en múltiples superficies sin acceder al DOM privado de cada recurso.

## Límites actuales

La v0.4 no es aún un graficador arbitrario ni genera por sí misma un solver para cada dominio. La fuente de verdad debe validarse para cada tipo de problema.

## API de eventos semánticos

```js
const unsubscribe=controller.onCue((cue,state)=>{
  // cue.kind, cue.targets y cue.reason son datos, no comandos ejecutables.
  const activeNodes=cue.targets; // animación en tu propia librería
});
controller.seekAction('03-pert',1,'start');
// Invoca unsubscribe() al desmontar.
```

El `onCue` dispara solamente cuando cambia la acción semántica, no en cada carácter. El `onChange` sigue funcionando en cada evento del timeline. Los componentes optimizan el render para evitar recrear diagramas o preguntas innecesariamente.
