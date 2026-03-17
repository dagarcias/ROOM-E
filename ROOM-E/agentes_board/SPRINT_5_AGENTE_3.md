# SPRINT 5 - AGENTE 3
**Rol**: Notifications, FCM/APNs & Deep Linking

## Misión
Tu objetivo es conectar a los usuarios externamente al proveer alertas proactivas. Implementarás Notificaciones Push (Firebase Cloud Messaging u otro) y enlaces profundos (Deep Linking) para que el app abra orgánicamente en la pantalla correcta.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **Resilience**: El sistema de permisos de notificaciones debe fallar con gracia y no molestar al usuario si decide no otorgar permisos de inmediato.
- **High Cohesion**: Todo el manejo central de notificaciones debe residir en su propio servicio o *provider* unificado para facilitar el mantenimiento.
- **Mobile-First Experience**: Cuando se pulse sobre algo "Roommate te invita a votar" debe abrir directamente esa encuesta (deep linking).

## Tareas Específicas
1. **Configuración Push**: Preparar el servicio necesario (`notificationsService.ts`) para registrar el `deviceToken` del usuario de forma de relacionarlo con su perfil (y guardarlo en la DB del usuario).
2. **Handlers Locales / Background**: Implementar cómo la aplicación reacciona cuando una notificación se recibe en *Foreground* y en *Background/Quit-state*.
3. **Deep Linking Router**: Extender la navegación o configuración (como con *Expo Router* o *React Navigation*) para aceptar esquemas custom (p.ej., `roome://chat`) y enrutarlos a la pantalla de la sección relevante.

## Límites
- NO construyas pantallas visuales (tarea Agente 2). Podrías, excepcionalmente, ajustar el App/Main router para soportar DeepLinks.
- Enfócate puramente en infra, hooks y servicios que faciliten estos flujos para la capa de presentación.

¡Inicia trabajando en los permisos y esquemas lógicos para el registro eficiente de dispositivos!
