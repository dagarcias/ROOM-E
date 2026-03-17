# SPRINT 6 - AGENTE 2
**Rol**: Realtime Sync & Data Services (Shopping, Tasks, Expenses, Chat)

## Misión
Tu trabajo es **reemplazar el estado local de Zustand** con datos reales de Supabase para las 4 features principales. Implementarás las funciones CRUD en los servicios y activarás los canales de **Realtime** para que el chat y la lista de compras funcionen en vivo entre dispositivos.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **NUNCA modifiques el Store de Zustand directamente desde un servicio**. El Store sigue siendo el **único estado de verdad local**. Los servicios solo leen/escriben en la DB. La sincronización la hace el hook de Realtime.
- **Suscripciones siempre con cleanup**: Toda suscripción de Realtime debe tener su correspondiente `channel.unsubscribe()` en el return del `useEffect`.
- **Optimistic UI se mantiene**: No rompas el patrón del `useShoppingRealtime`. Ahora el `syncQueue` será reemplazado por llamadas reales, pero la lógica de "aplica local, luego sincroniza" se conserva.

---

## Arquitectura de Servicios a Crear

### `src/services/houseService.ts`
```typescript
import { supabase } from '../lib/supabase';

export const HouseService = {
  create: async (name: string, userId: string) => { ... },
  joinByCode: async (code: string) => { ... },
  getMembers: async (houseId: string) => { ... },
  approveMember: async (houseId: string, userId: string) => { ... },
};
```

### `src/services/taskService.ts`
```typescript
export const TaskService = {
  fetchAll: async (houseId: string): Promise<Task[]> => { ... },
  add:     async (task: Omit<Task, 'id'>): Promise<Task> => { ... },
  toggle:  async (taskId: string, currentStatus: string): Promise<void> => { ... },
  delete:  async (taskId: string): Promise<void> => { ... },
};
```

### `src/services/expenseService.ts`
```typescript
export const ExpenseService = {
  fetchAll:  async (houseId: string): Promise<Expense[]> => { ... },
  add:       async (expense: Omit<Expense, 'id'>, participantIds: string[]): Promise<void> => { ... },
  getBalances: async (houseId: string): Promise<Balance[]> => { ... },
};
```

### `src/services/shoppingService.ts` — ACTUALIZAR con Supabase
```typescript
// Reemplazar los TODOs del Agente 1 del Sprint 4:
export const ShoppingService = {
  fetchSections: async (houseId: string): Promise<ShoppingSection[]> => {
    const { data } = await supabase
      .from('shopping_sections')
      .select('*, shopping_items(*)')
      .eq('house_id', houseId);
    return data ?? [];
  },
  addSection:    async (...) => { ... },
  addItem:       async (...) => { ... },
  toggleItem:    async (itemId: string, isPurchased: boolean, userId: string) => {
    await supabase.from('shopping_items')
      .update({ is_purchased: isPurchased, purchased_by: isPurchased ? userId : null })
      .eq('id', itemId);
  },
};
```

### `src/services/chatService.ts` — ACTUALIZAR con Supabase
```typescript
export const ChatService = {
  fetchMessages: async (houseId: string): Promise<ChatMessage[]> => { ... },
  sendMessage:   async (houseId: string, senderId: string, content: string) => { ... },
  createPoll:    async (...) => { ... },
  vote:          async (messageId: string, optionId: string, userId: string) => {
    // upsert garantiza 1 voto por usuario (la PK de poll_votes lo refuerza también en DB)
    await supabase.from('poll_votes').upsert({ message_id: messageId, user_id: userId, option_id: optionId });
  },
};
```

---

## Tareas de Realtime

### Chat en Tiempo Real — `src/hooks/useChatRealtime.ts`
```typescript
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

export const useChatRealtime = (houseId: string) => {
  const addMessage = useAppStore(state => state.addMessageLocally); // Nueva acción

  useEffect(() => {
    // 1. Cargar mensajes históricos
    ChatService.fetchMessages(houseId).then(msgs => useAppStore.setState({ messages: msgs }));

    // 2. Suscripción Realtime
    const channel = supabase
      .channel(`chat:${houseId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `house_id=eq.${houseId}` },
        payload => addMessage(payload.new as ChatMessage)
      )
      .subscribe();

    // 3. Cleanup al desmontar
    return () => { supabase.removeChannel(channel); };
  }, [houseId]);
};
```

### Shopping Realtime — `src/hooks/useShoppingRealtime.ts`
Mismo patrón que el chat: reemplazar la `syncQueue` simulada con llamadas reales + suscripción a cambios en `shopping_items` filtren por `section_id` de la casa actual.

---

## Límites
- NO modifiques el Auth (Agente 1).
- NO toques el Storage ni las notificaciones (Agente 3).
- No cambies la forma de los tipos TypeScript — solo conecta la capa de persistencia.

¡Inicia por `chatService.ts` + `useChatRealtime.ts` porque el Chat es el feature más visible!
