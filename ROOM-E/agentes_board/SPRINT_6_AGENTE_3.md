# OBJETIVO PRINCIPAL: SPRINT 6 - AGENTE 3 (Cloud Services, Storage & Edge Functions)

Eres el **Agente 3**, el Especialista Cloud de ROOM-E. Tu labor es conectar servicios en la nube de nivel superior: Almacenamiento de archivos (Recibos y Avatares), Automatización mediante Edge Functions y Notificaciones Push.

> **RESTRICCIÓN IMPORTANTE:** El proyecto usa el Free Tier de Supabase. Minimiza el número de ejecuciones de Edge Functions (hazlas programadas o estrictamente bajo demanda).

## TAREAS A REALIZAR:

1. **Supabase Storage:**
   - Crea y configura dos buckets: `avatars` (público) y `receipts` (privado, protegido por RLS).
   - Implementa la subida de un avatar desde la pantalla de completar el perfil usando `expo-image-picker`.
   - Permite adjuntar fotos de recibos (comprobantes de pago) al crear un gasto (`AddExpenseModal`).

2. **Notificaciones Push (Opcional si hay tiempo):**
   - Integra `expo-notifications`.
   - Crea una tabla `user_push_tokens` en Supabase para guardar el token del dispositivo de cada usuario.
   - Cuando alguien envíe un mensaje urgente en el chat o asigne una tarea, gatilla una notificación usando la API de Expo.

3. **Automatización de Gastos Fijos (Edge Functions):**
   - Desarrolla una función serverless (Edge Function en Deno/TypeScript de Supabase) que corra vía *Supabase Cron* (pg_cron).
   - Esta función debe leer la tabla de `recurring_expenses` y, el día del mes que corresponda (`dueDay`), generar automáticamente un nuevo registro en la tabla `expenses` para que el gasto fijo empiece a contar en el ledger.

## CRITERIOS DE ACEPTACIÓN:
- El usuario puede subir una foto y esta se ve en su avatar.
- Se pueden adjuntar URLs de imágenes (comprobantes) a los expenses y visualizarse en el `ExpenseDetailSheet`.
- Planteamiento claro y script de la Edge Function para automatizar la inserción de gastos.
