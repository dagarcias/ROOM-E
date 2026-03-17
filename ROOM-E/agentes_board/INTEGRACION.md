# INTEGRACIÓN Y CODE REVIEW
**Rol**: Principal Engineer & Tech Lead (Mi Rol Central)

## Misión de Integración
Este archivo documenta mis directrices y checklist para cuando tenga que orquestar, integrar o revisar el trabajo de los sub-agentes asíncronos en los Sprints 4 y 5. Yo seré el puente para garantizar que ROOM-E mantenga cohesión técnica, calidad App Store y un diseño elegante.

## Eventos Disparadores para mi Intervención
1. **Fin de ciclo de un Agente**: Cuando el Agente respectivo indique que terminó su tarea asignada.
2. **Conflictos Arquitectónicos**: Cuando un agente reporte dudas o choques de scope entre capas lógicas y visuales.
3. **Integración Cruzada**: Cuando un sprint se complete (por ejemplo, combinar el Data Store de Agente 1 con el UI de Agente 2 y el Realtime de Agente 3).

## 📋 Checklist de Code Review (The "Principal" Audit)
Al auditar los archivos modificados, aplicaré activamente las siguientes reglas:
- [ ] **SOLID & Clean Code**: ¿Están los métodos y funciones demasiado acoplados? ¿Hay clases infladas ("God objects")?
- [ ] **Mobile-First Sanity**: ¿El código respeta *SafeAreaProviders*, *KeyboardAvoidingViews* y convenciones móviles claras? 
- [ ] **Manejo de Estados Globales**: ¿El *Zustand store* está manejado correctamente? ¿Hay riesgos de *prop drilling* o re-renderizados colosales?
- [ ] **Consistencia de Tipos (TypeScript)**: ¿Están todas las interfaces firmemente establecidas y exportadas (`models/`, `types/`)?
- [ ] **No "Ghost Features"**: Asegurarme de que el agente no incluyó código sobrante provisorio que no corresponde al PRD actual.
- [ ] **Aesthetics y Diseño**: Para el componente del Agente 2, ¿sigue el look premium de nuestra aplicación (colores armónicos, animaciones, tipografías limpias)?

## Reglas de Intervención en el Código ("Hand-on")
- Solo escribiré código para **refactorizar** inconsistencias críticas, crear el pegamento (Adaptadores, Providers englobantes) que los agentes hayan dejado por separado.
- Si un componente crítico está mal abstraído, lo re-abstraeré para garantizar el cumplimiento **DRY**(Don't Repeat Yourself).
- En caso de emergencias por dependencias cíclicas (`import` loops), yo desenredaré el árbol.

---
**Nota al Usuario General**: Usa el archivo `tareas.md` en el root del proyecto para indicar qué Agente debe trabajar y dile que consulte en la carpeta `agentes_board` este esquema de trabajo. Luego, al terminar, puedes solicitar mis labores de integración basándote en esta guía.
