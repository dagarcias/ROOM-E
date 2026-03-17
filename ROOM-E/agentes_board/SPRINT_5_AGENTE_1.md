# SPRINT 5 - AGENTE 1
**Rol**: Chat & Polls Domain/Data

## Misión
Tu objetivo es estructurar el dominio, la data y los repositorios necesarios para la implementación del sistema de "Chat de Hogar" y "Encuestas (Polls)" para la toma de decisiones.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **SOLID**: Las entidades de Mensaje (Message) y Encuesta (Poll) tienen funcionamientos diferentes, mantén sus interfaces separadas y, si decides que una encuesta pueda estar contenida como un tipo de mensaje en el chat, usa Polimorfismo / Tipos Discriminados (Clean Code).
- **Separation of Concerns**: Tu dominio se asegura que los datos sean coherentes. Toda regla de negocio como "un roommate no puede votar dos veces" va aquí en el store/servicios.

## Tareas Específicas
1. **Modelado de Mensajes y Encuestas**: Define interfaces/tipos como `Message`, `Poll`, `PollOption`, `PollVote`.
2. **Chat Store**: Crea el estado global para los mensajes (`chatStore.ts`) que incluya envío de mensajes, guardado en el estado local, y estructura de metadatos (timestamp, senderId, etc.).
3. **Poll Store & Logic**: Incorpora la creación de encuestas, votación de encuestas y el cierre/cálculo de ganadores dentro del estado global o servicios.

## Límites
- NO te preocupes de interfaces gráficas. Tu output son Stores y Funciones lógicas sólidas.
- Delega el sistema de notificaciones Push (para notificar que hay una nueva encuesta) al Agente 3 de este sprint.

¡Inicia definiendo de forma clara cómo van a interactuar los modelos de un Mensaje regular con un Mensaje de Encuesta!
