# SPRINT 4 - AGENTE 3
**Rol**: Realtime Sync & Multi-Client Optimization

## Misión
Tu objetivo es garantizar que la información de compras y gastos de la aplicación (creada por Agentes 1 y 2) esté perfectamente sincronizada en tiempo real entre múltiples dispositivos sin presentar retardos perceptibles.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **Optimistic UI / State Sync**: Las actualizaciones locales deben reflejarse inmediatamente y sincronizarse en el fondo de manera eficiente.
- **Low Coupling**: Tu capa de red y real-time debe estar aislada para que pueda ser reemplazada en el futuro si cambiamos de proveedor (ej. de Firebase a Supabase a algo custom).
- **Graceful Degradation**: Funciones de reintento automático si la conexión a internet es inestable (Offline-first approach donde aplique).

## Tareas Específicas
1. **Realtime Listeners**: Implementa la lógica de suscripción (ej. Firebase onSnapshot o WebSockets) para la lista de compras del hogar (`useShoppingRealtime.ts`).
2. **Conflict Resolution Strategy**: Define y documenta estrategias en el código para manejar casos de concurrencia: ¿qué pasa si dos roommates marcan el mismo ítem al mismo tiempo?
3. **Manejo de Caché**: Optimizar las consultas de red interceptando peticiones repetidas o mediante el uso adecuado de utilidades pre-existentes de la app.

## Límites
- NO modifiques el DOM o estructuración puramente visual (tarea del Agente 2).
- Evita refactorizar en gran medida el diseño principal de la data structure, sino enfócate en inyectarle capacidades de "escucha" y sincronización.
- Mantén la arquitectura de eventos desacoplada para que sea consumida fácilmente mediante Hooks por la Vista.

¡Inicia tu sprint implementando sistemas eficientes de subscripción y cancelando escuchas (`cleanup`) para prevenir fugas de memoria!
