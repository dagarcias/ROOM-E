# SPRINT 6 - AGENTE 1
**Rol**: Supabase Auth + Database Schema + Core Services

## Misión
Eres el guardián del contrato de datos. Tu trabajo es instalar el SDK de Supabase, configurar el Cliente, diseñar e implementar el esquema SQL completo en la base de datos, y reemplazar el sistema de autenticación mock actual por el Auth real de Supabase.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **Single Source of Truth**: El cliente de Supabase debe ser un singleton exportado desde `src/lib/supabase.ts`. NADIE más lo instancia directamente.
- **Separation of Concerns**: Tu dominio termina en los servicios (`src/services/`). Las pantallas nunca llaman a Supabase directamente.
- **Type Safety First**: Usa la CLI de Supabase (`supabase gen types typescript`) para generar los tipos de la DB automáticamente y evitar errores de runtime.

---

## Stack de trabajo
- `@supabase/supabase-js` - SDK oficial
- `@react-native-async-storage/async-storage` - Para persistir la sesión JWT
- `expo-secure-store` - Para el token refresh (alternativa más segura a AsyncStorage)

## Archivo de configuración necesario (solicítaselo al usuario)
Necesitas crear un archivo `.env` en la raíz del proyecto con:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Tareas Específicas

### 1. Instalación del SDK
```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store
```

### 2. Cliente Singleton — `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl  = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 3. Esquema SQL — Pegar en el SQL Editor de Supabase

```sql
-- 1. HOUSES
create table public.houses (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  invite_code  text unique not null default upper(substring(gen_random_uuid()::text, 1, 6)),
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now()
);

-- 2. HOUSE MEMBERS
create table public.house_members (
  id         uuid default gen_random_uuid() primary key,
  house_id   uuid references public.houses(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  role       text default 'member' check (role in ('admin', 'member')),
  status     text default 'pending' check (status in ('pending', 'approved')),
  joined_at  timestamptz default now(),
  unique(house_id, user_id)
);

-- 3. PROFILES (Extiende auth.users con nombre y avatar)
create table public.profiles (
  id         uuid references auth.users(id) primary key,
  name       text,
  avatar_url text,
  push_token text,
  updated_at timestamptz default now()
);

-- 4. TASKS
create table public.tasks (
  id          uuid default gen_random_uuid() primary key,
  house_id    uuid references public.houses(id) on delete cascade,
  title       text not null,
  assignee_id uuid references auth.users(id),
  category    text,
  due_date    timestamptz,
  status      text default 'pending' check (status in ('pending', 'completed')),
  created_at  timestamptz default now()
);

-- 5. EXPENSES
create table public.expenses (
  id         uuid default gen_random_uuid() primary key,
  house_id   uuid references public.houses(id) on delete cascade,
  title      text not null,
  amount     numeric(10,2) not null,
  payer_id   uuid references auth.users(id),
  date       timestamptz default now(),
  created_at timestamptz default now()
);

create table public.expense_splits (
  expense_id uuid references public.expenses(id) on delete cascade,
  user_id    uuid references auth.users(id),
  primary key (expense_id, user_id)
);

-- 6. SHOPPING SECTIONS & ITEMS
create table public.shopping_sections (
  id         uuid default gen_random_uuid() primary key,
  house_id   uuid references public.houses(id) on delete cascade,
  name       text not null,
  emoji      text default '🛒',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.shopping_items (
  id               uuid default gen_random_uuid() primary key,
  section_id       uuid references public.shopping_sections(id) on delete cascade,
  name             text not null,
  estimated_price  numeric(10,2),
  is_purchased     boolean default false,
  purchased_by     uuid references auth.users(id),
  added_by         uuid references auth.users(id),
  created_at       timestamptz default now()
);

-- 7. MESSAGES & POLLS
create table public.messages (
  id         uuid default gen_random_uuid() primary key,
  house_id   uuid references public.houses(id) on delete cascade,
  sender_id  uuid references auth.users(id),
  type       text default 'text' check (type in ('text', 'poll')),
  content    text,           -- For text messages
  question   text,           -- For polls
  options    jsonb,          -- [{ "id": "...", "text": "..." }]
  created_at timestamptz default now()
);

create table public.poll_votes (
  message_id uuid references public.messages(id) on delete cascade,
  user_id    uuid references auth.users(id),
  option_id  text not null,
  primary key (message_id, user_id)  -- Enforces 1 vote per user at DB level
);
```

### 4. Row Level Security (RLS) — Pegar después del esquema
```sql
-- Habilitar RLS en todas las tablas
alter table public.houses           enable row level security;
alter table public.house_members    enable row level security;
alter table public.profiles         enable row level security;
alter table public.tasks            enable row level security;
alter table public.expenses         enable row level security;
alter table public.expense_splits   enable row level security;
alter table public.shopping_sections enable row level security;
alter table public.shopping_items   enable row level security;
alter table public.messages         enable row level security;
alter table public.poll_votes       enable row level security;

-- Función helper: ¿es el usuario miembro aprobado de esa casa?
create or replace function public.is_house_member(p_house_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.house_members
    where house_id = p_house_id
      and user_id  = auth.uid()
      and status   = 'approved'
  );
$$;

-- Política general: solo miembros aprobados del mismo hogar pueden ver/editar
create policy "Members can view their house data" on public.tasks
  for all using ( public.is_house_member(house_id) );

create policy "Members can view messages" on public.messages
  for all using ( public.is_house_member(house_id) );

create policy "Members can view shopping" on public.shopping_sections
  for all using ( public.is_house_member(house_id) );

-- (Replica para el resto de tablas siguiendo el mismo patrón)
```

### 5. Reemplazar `authSlice.ts`
- Reemplaza `login()` por `supabase.auth.signInWithPassword({ email, password })`
- Reemplaza `logout()` por `supabase.auth.signOut()`
- Suscríbete a `supabase.auth.onAuthStateChange()` para mantener el estado sincronizado

## Límites
- NO toques pantallas ni componentes.
- NO implementes Realtime (eso le toca al Agente 2).
- Deja los servicios preparados con funciones async que retornen datos tipados.

¡Inicia configurando el cliente y validando que el Auth funciona con un usuario de prueba!
