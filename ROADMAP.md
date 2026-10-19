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

## v0.3 · Kit embebible independiente (implementación inicial)

- [x] Recursos individuales montables por nombre en cualquier contenedor.
- [x] Shadow DOM, sin estilos globales y sin imponer layout.
- [x] CLI para extraer recursos y manifest con ejemplo aislado.
- [x] Integración opt-in en HTML existente por atributos `data-clf` sin reorganizar.
- [x] Sincronización con eventos de flujos preexistentes y desconexión al desmontar.
- [x] Pruebas automatizadas para aislamiento de modo, seguridad básica y exportación.
- [ ] Adaptadores específicos para React/Vue/Web Components con SSR.
- [ ] Mejorar ergonomía del calendario de eventos y motor SVG específico para EOQ/SPC.
- [ ] Auditoría WCAG y pruebas con estudiantes; minimizar reconstrucción DOM por glifo.

## v0.5 · Gramática visual genérica (implementada)

- [x] Añadir componente `visualization` montable de forma aislada en HTML existente.
- [x] Tres diagramas declarativos: barras, línea temporal y flujo de proceso.
- [x] Revelado progresivo sincronizado con el mismo timeline del cuaderno.
- [x] Foco de datos verificable; impedir referencias a datos todavía ocultos.
- [x] Renderizadores personalizados registrables sin modificar `kit.js`.
- [x] Segundo caso independiente: promedio móvil de demanda, con validación matemática.
- [x] Pruebas de snapshot, regresión, estados, exportación y responsive.
- [ ] Medición de rendimiento con lecciones grandes y virtualización de puntos.
- [ ] Graficación avanzada de sensibilidad, simulación estocástica, Monte Carlo.
- [ ] Diseño instruccional contrastado con estudiantes y auditoría WCAG formal.
- [ ] Renderizadores 3D/tiempo real como plugins opcionales, siempre con versión textual.


## v0.6 · Laboratorios de decisiones (implementado)

- [x] Motor numérico sin DOM de inventario EOQ, cola M/M/1 y estaciones de producción.
- [x] Simulación de colas estocástica con semilla reproducible; distinción muestra vs teoría.
- [x] Timeline de escenarios y fotogramas reconstruibles por cursor.
- [x] Componentes Shadow DOM `simulation` y `sensitivity`; 15 recursos opcionales.
- [x] Sliders de parámetros validados, restauración y selección de escenarios.
- [x] Pistas progresivas y diagnóstico básico de errores de cálculo.
- [x] Caso de integración autónoma con los tres modelos.
- [x] Pruebas de modelos, escenarios inválidos y aislamiento del modo examen.

## Próximos pasos hacia v0.7

- [ ] Pruebas de navegador sistemáticas en GitHub Actions y accesibilidad WCAG formal.
- [ ] Animaciones con pausa interpolada fina y menor reconstrucción de DOM.
- [ ] Simuladores EOQ con descuentos, colas M/M/c o programación de trabajos reales como extensiones **opt-in**.
- [ ] Analítica de errores consentida y medición de transferencia en estudiantes.
- [ ] Crear políticas por entorno para CSP estricta, SSR y sitios sin JS inline.

## v0.7 · Cuaderno animado de Ingeniería Industrial

- [x] Recurso de libreta con papel cuadriculado, margen, hojas, tinta y resaltados vinculados a las etapas.
- [x] Heurística determinista de balanceo de línea con validación de precedencias y límite inferior teórico.
- [x] Cuaderno, calculadora, red y estaciones sincronizados por eventos reconstruibles.
- [x] Modo práctica y laboratorio de sensibilidad por demanda, con derivación automática.
- [x] Embebido no invasivo en Shadow DOM y exportación HTML offline.
- [x] Pruebas de regresión + validación matemática + Chromium escritorio/móvil.
- [ ] Diseño de actividades prácticas con expertos en didáctica y accesibilidad WCAG exhaustiva.
- [ ] Selector temático de estilos visuales (libreta, laboratorio, pizarrón) sin duplicar cálculos.
