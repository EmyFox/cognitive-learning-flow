# Quality Gates · definición de entrega

## Cálculos

- [ ] Datos, supuestos, unidades, tolerancias y reglas de redondeo explícitos.
- [ ] Cada resultado coincide entre cuaderno, calculadora, gráfico y evaluación.
- [ ] Solver separado de efectos visuales y verificable de manera independiente.
- [ ] Se prueban casos frontera y condiciones inválidas.
- [ ] PERT/CPM: detección de ciclos, dependencias y rutas múltiples; pases adelante y atrás comprobados.
- [ ] Las probabilidades son aproximaciones identificadas como tales.

## Pedagogía

- [ ] Se sabe por qué se usa cada operación, no solamente cómo teclearla.
- [ ] El estudiante ve una estrategia de solución observable y reproducible.
- [ ] Pistas del modo guiado no revelan accidentalmente las respuestas.
- [ ] El modo evaluación no recibe resultados de la demostración anterior.
- [ ] Ejercicio de transferencia nuevo tras la demostración.

## Visualización semántica (v0.5)

- [ ] Los valores futuros permanecen ocultos hasta el evento que los justifica.
- [ ] Cada punto visualizado tiene fuente, unidades y foco verificable.
- [ ] El seek restaura cantidad revelada y foco, sin filtrar respuestas en guía/evaluación.
- [ ] Se muestran textos equivalentes para interpretar los datos sin SVG.
- [ ] El proyecto anfitrión conserva su CSS/layout y puede registrar visualizadores especializados.

## Animación

- [ ] Reproducir, pausar, velocidad, previo, siguiente, reiniciar y seek verdaderamente funcionales.
- [ ] Cuaderno y calculadora sincronizados sin desfase de operaciones.
- [ ] El estado se reconstruye al saltar de escena; no se duplica texto.
- [ ] No hay pasos animados puramente ornamentales que dificulten entender.

## Calidad técnica

- [ ] Accesibilidad por teclado, foco, contraste suficiente y transcripción.
- [ ] Se respeta reduced-motion.
- [ ] Se prueban 375px/390px y escritorio.
- [ ] Dependencias y requisitos offline declarados honestamente.
- [ ] No usar `eval`, `new Function`, credenciales o integraciones implícitas.
- [ ] HTML disponible sin Internet cuando el usuario lo solicite.
- [ ] Pruebas automatizadas y de navegador listadas con exactitud.

**Bloqueo:** no llamar «completo» a un laboratorio cuyas cuentas sean incorrectas o que filtre una respuesta en evaluación.
