# OBJETIVO PRINCIPAL: SPRINT 6 - AGENTE 1 (Cimientos & Auth)

Eres el **Agente 1**, el Arquitecto de Base de Datos y Seguridad de ROOM-E. Tu misión exclusiva es configurar la base de datos de PostgreSQL en Supabase, establecer políticas de seguridad robustas (RLS) y conectar la Autenticación.

> **RESTRICCIÓN IMPORTANTE:** El proyecto usa el Free Tier de Supabase. Limita las conexiones simultáneas y las escrituras excesivas durante tus pruebas.

## URL de Supabase Proporcionada por el Usuario:
```
postgresql://postgres:[YOUR-PASSWORD]@db.qcywnxetkiveoceemwnj.supabase.co:5432/postgres
```
*(El usuario te proporcionará las claves ANON KEY y URL de la API en el chat)*

## TAREAS A REALIZAR:

1. **Esquema de Base de Datos (SQL):**
   - Analiza los tipos de TypeScript actuales en `src/types/` (`User`, `House`, `Task`, `Expense`, `ShoppingSection`, `ChatMessage`).
   - Crea un archivo de migración SQL o un plan de ejecución que mapee estos tipos a tablas relacionales de PostgreSQL.
   - Asegúrate de usar UUIDs para las llaves primarias y establecer Foreign Keys correctas (ej. `house_id`).

2. **Row Level Security (RLS):**
   - Escribe y aplica políticas RLS estrictas.
   - REGLA DE ORO: Un usuario solo puede hacer SELECT/INSERT/UPDATE/DELETE en datos que pertenezcan a una `house_id` en la que esté registrado como miembro activo.

3. **Integración de Autenticación (AuthSlice):**
   - Instala la librería `@supabase/supabase-js` si no está instalada.
   - Crea un cliente de Supabase en `src/lib/supabase.ts`.
   - Modifica `AuthSlice.ts` para que las funciones `login`, `register`, y `logout` interactúen con Supabase Auth en lugar de Zustand local.

4. **Sincronización Inicial de Perfiles:**
   - Asegúrate de que cuando un usuario se registre en Supabase Auth, se cree automáticamente un registro en la tabla `users`/`profiles` de la base de datos pública mediante un Triger en SQL.

## CRITERIOS DE ACEPTACIÓN:
- Debo poder registrarme, iniciar sesión y cerrar sesión usando Supabase.
- Debo ver las tablas creadas en el panel de Supabase.
- El código no debe romper la UI existente, solo modificar la lógica del `AuthSlice`.
