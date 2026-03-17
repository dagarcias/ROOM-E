# SPRINT 5 - AGENTE 2
**Rol**: Chat, Polls & Mobile UX

## Misión
Tu objetivo es construir la interfaz interactiva e inmersiva requerida para el Chat grupal del hogar y la pre visualización y rendereo de las encuestas in-chat. ¡La UX debe sentirse de alta calidad, similar a las apps de mensajería líderes!

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **Responsive & Performant UI**: La lista de mensajes (FlatList) debe estar altamente optimizada para no dropear frames (`windowSize`, `maxToRenderPerBatch`, `initialNumToRender`). Evita re-renders innecesarios.
- **KISS**: Mantén los componentes atómicos. Componente burbuja de mensaje (`MessageBubble`), componente de encuesta (`PollCard`).
- **Separation of Concerns**: Recibe la data inyectable desde hooks. Céntrate en animaciones fluidas, scroll to bottom al recibir, y teclado responsivo.

## Tareas Específicas
1. **Chat Screen**: Layout principal del chat de los roommates (`ChatScreen.tsx`).
2. **Input Area optimizado**: Área de input de texto con el teclado y espacio seguro (KeyboardAvoidingView) para evitar superposiciones con el botón de enviar.
3. **Poll Component**: Interfaz bonita e intuitiva para que los usuarios puedan pulsar y votar opciones dentro del chat fluidamente, mostrando un gráfico/barra de progreso de respuestas una vez votado.

## Límites
- NO inviertas tu tiempo modelando cómo se guardan las encuestas (Agente 1) o integrando Notificaciones Push (Agente 3).
- Céntrate solo en la fluidez de interacción y un diseño pixel perfect alineado al tema general de ROOM-E.

¡Inicia tu sprint construyendo las vistas del chat y domina la optimización de los componentes de listas!
