# SPRINT 6 - AGENTE 3
**Rol**: Storage (Avatares), Push Tokens en DB & Edge Functions

## Misión
Tu trabajo es el último 20% que hace que la app se sienta completamente viva: guardar fotos de perfil reales, registrar los `pushToken` de cada dispositivo en Supabase para poder enviar notificaciones reales, y preparar una Edge Function serverless para disparar notificaciones push (ej: cuando se crea una encuesta).

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **Single Responsibility**: El `notificationsService.ts` ya existe y está bien aislado. Solo agrégale la lógica de persistencia del token. No lo mezcles con lógica de negocio.
- **Graceful Failure**: Si el upload de un avatar falla, la app no debe crashear ni dejar de funcionar. Un `try/catch` con fallback al avatar de letras iniciales es suficiente.
- **Security**: El bucket de Storage debe ser **privado** con acceso solo a miembros del hogar. Nunca uses buckets públicos para datos de usuario.

---

## Tarea 1: Supabase Storage para Avatares

### Configuración del Bucket (Supabase Dashboard → Storage)
1. Crear bucket: `avatars`
2. **Tipo**: Privado (no público)
3. Política RLS del bucket:
```sql
-- Un usuario puede subir/leer su propio avatar
create policy "Users can manage their own avatar"
  on storage.objects for all
  using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );
```

### `src/services/storageService.ts`
```typescript
import { supabase } from '../lib/supabase';

export const StorageService = {
  /**
   * Sube la foto de perfil de un usuario y retorna la URL pública firmada.
   * El path es: avatars/{userId}/{timestamp}.jpg
   */
  uploadAvatar: async (userId: string, localUri: string): Promise<string | null> => {
    try {
      const ext      = localUri.split('.').pop() ?? 'jpg';
      const path     = `${userId}/${Date.now()}.${ext}`;
      const response = await fetch(localUri);
      const blob     = await response.blob();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      console.warn('[StorageService] Avatar upload failed:', e);
      return null;
    }
  },

  /**
   * Actualiza la columna avatar_url en profiles tras un upload exitoso.
   */
  updateProfileAvatar: async (userId: string, avatarUrl: string) => {
    await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', userId);
  },
};
```

---

## Tarea 2: Registrar Push Tokens en Supabase

### Actualizar `src/services/notificationsService.ts`
Donde actualmente hay el comentario:
```typescript
// TODO (Firebase): Save this token to Firestore under the current user's profile
```

Reemplazar por llamada real:
```typescript
import { supabase } from '../lib/supabase';

// Dentro de registerForPushNotificationsAsync(), después de obtener el token:
if (token) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (userId) {
    await supabase
      .from('profiles')
      .upsert({ id: userId, push_token: token });
  }
}
```

---

## Tarea 3: Edge Function para Notificaciones Push

Las Edge Functions de Supabase son funciones **Deno/TypeScript** que corren en el servidor. Se usan para enviar notificaciones a TODOS los miembros de una casa cuando ocurre un evento.

### Crear en Supabase Dashboard → Edge Functions → New Function
**Nombre sugerido**: `notify-house`

```typescript
// supabase/functions/notify-house/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { houseId, senderId, title, body, deepLink } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Service role para bypass RLS
  );

  // 1. Obtener todos los push tokens del hogar (excepto el sender)
  const { data: members } = await supabase
    .from('house_members')
    .select('profiles(push_token)')
    .eq('house_id', houseId)
    .eq('status', 'approved')
    .neq('user_id', senderId);

  const tokens = members
    ?.flatMap((m: any) => m.profiles?.push_token)
    .filter(Boolean) ?? [];

  if (tokens.length === 0) return new Response('No tokens', { status: 200 });

  // 2. Llamar al API de Expo Push
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.map(token => ({
      to: token, title, body, data: { deepLink },
    }))),
  });

  return new Response('Sent', { status: 200 });
});
```

### Cuándo se invoca (desde el App o desde DB Triggers)
```typescript
// Al crear un mensaje nuevo en ChatService:
await supabase.functions.invoke('notify-house', {
  body: {
    houseId,
    senderId: user.id,
    title: `💬 ${senderName}`,
    body: content.substring(0, 60),
    deepLink: 'roome://chat',
  },
});
```

---

## Límites
- NO implementes lógica de DB (tablas, RLS) — eso le toca al Agente 1.
- NO implementes Realtime de datos — eso le toca al Agente 2.
- Céntrate en Storage, push tokens y la Edge Function de notificaciones.

¡Inicia configurando el bucket de Storage y el servicio de avatares — es lo más independiente y ya podemos mostrarlo en el perfil!
