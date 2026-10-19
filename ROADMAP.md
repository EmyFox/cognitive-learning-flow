# Cognitive Learning Flow · Roadmap técnico y pedagógico

## Meta principal

Convertir procedimientos cuantitativos verificados en lecciones HTML reproducibles, interactivas y portables, manteniendo separadas la verdad matemática, la instrucción pedagógica y la presentación visual.

## v0.1 · Fundamento (completada)

- [x] Skill reutilizable de proyecto o global.
- [x] Contrato estructurado de lecciones (JSON Schema).
- [x] Referencias pedagógicas, arquitectura y criterios de aceptación.
- [x] Caso PERT/CPM y validador independiente.
- [x] Pruebas para rutas críticas, ciclos, fórmulas y errores.
- [ ] Evaluación externa de calidad instruccional de un especialista.

## v0.2 · Reproductor semántico (implementación inicial)

- [x] Timeline de escenas basado en estados y eventos deterministas.
- [x] Escritura progresiva/reconstrucción instantánea de un cuaderno.
- [x] Calculadora aritmética real sincronizada y manipulable.
- [x] Renderer SVG de grafos de precedencias PERT (gráficos de otros dominios: pendiente).
- [x] Reproducir, pausar, anterior, siguiente, velocidad, seek y reiniciar.
- [x] Exportar HTML autocontenido que abra sin Internet.
- [x] Prueba de humo local en Chromium, 375/390px y escritorio.
- [ ] Automatizar pruebas de navegador en CI y auditar accesibilidad de forma sistemática.

## v0.3 · Aprendizaje guiado y evaluación

- [x] Checkpoints numéricos con tolerancia y feedback inicial (profundizar diagnósticos).
- [ ] Pistas graduadas y desvanecimiento de ayudas.
- [x] Aislar estados de demostración/guía/evaluación en el reproductor.
- [ ] Nuevos datos para ejercicios de transferencia.
- [ ] Pruebas contra respuestas reveladas antes de envío.

## v0.4 · Generalización

- [ ] EOQ y variaciones de inventarios.
- [ ] Pronósticos con errores MAD/MAPE.
- [ ] Cartas de control X̄-R.
- [ ] Programación lineal y restricciones.
- [ ] PERT con rutas críticas múltiples y sensibilidad.
- [ ] Diseño adaptable a identidades visuales de terceros.

## v1.0 · Calidad demostrable

- [ ] 3+ procedimientos de dominios diferentes con ejecución verificada.
- [ ] Cero errores matemáticos conocidos en fixtures.
- [ ] Cumplimiento accesible de controles y lectura sin animación.
- [ ] Exportación autónoma HTML + adaptador embebible opcional.
- [ ] Ensayos con usuarios y revisión de errores frecuentes.

## Principios de producto

- La **exactitud** no se negocia por fluidez de animación.
- La herramienta muestra razonamiento externo, no «cómo piensa realmente» una persona.
- La práctica guiada solicita respuestas antes de mostrarlas.
- Un HTML de cliente no reemplaza un sistema de evaluación seguro.
- Ningún framework, marca ni negocio es una dependencia obligatoria.
