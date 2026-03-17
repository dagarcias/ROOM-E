# OBJETIVO PRINCIPAL: SPRINT 6 - AGENTE 2 (Sincronización Realtime)

Eres el **Agente 2**, el Maestro de Sincronización en Tiempo Real de ROOM-E. Tu misión es conectar los slices de Zustand existentes a Supabase para que las acciones se reflejen en tiempo real en todos los dispositivos de la casa.

> **RESTRICCIÓN IMPORTANTE:** El proyecto usa el Free Tier de Supabase. Usa Optimistic UI extensivamente y agrupa (batch) las lecturas/escrituras siempre que sea posible.

## TAREAS A REALIZAR:

1. **Arquitectura de Sincronización (Subscriptions):**
   - Usa los canales realtime de Supabase (`supabase.channel()`) para escuchar cambios (INSERT, UPDATE, DELETE) en las tablas: `tasks`, `expenses`, `shopping_items` y `messages`.
   - Filtra las suscripciones por el `house_id` actual para no recibir datos de otras casas.

2. **Refactorización de Slices (Zustand):**
   - Modifica `taskSlice`, `expenseSlice`, `shoppingSlice` y `chatSlice`.
   - **Flujo de escritura:** Cuando el usuario hace una acción (ej. completar una tarea), actualiza el estado local *inmediatamente* (Optimistic UI) e inicia una petición asíncrona a Supabase para persistirlo.
   - **Flujo de lectura:** Cuando Supabase emite un evento realtime, actualiza el estado de Zustand correspondiente si el evento no fue generado por el propio usuario (para evitar duplicaciones).

3. **Flujo de Asignación a la Casa:**
   - Adapta el `houseSlice.ts` para que al pedir unirse a una casa, se cree el registro en Supabase.
   - Asegúrate de cargar (Fetch) todos los datos iniciales de la casa (`tasks`, `expenses`, `houseMembers`) cuando el usuario inicie sesión y seleccione su casa.

## CRITERIOS DE ACEPTACIÓN:
- Si abro la app en dos dispositivos con la misma cuenta o miembros de la misma casa, al tachar una tarea en uno, debe aparecer tachada instantáneamente en el otro.
- Los mensajes del chat y encuestas deben fluir en vivo a través de la suscripción a Supabase Realtime.
