# SPRINT 4 - AGENTE 2
**Rol**: UI/UX para Shopping Tab

## Misión
Tu objetivo es construir interfaces de usuario fluidas, intuitivas y 100% *mobile-first* para la sección de "Lista de Compras" (Shopping Tab).

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **KISS & DRY**: Componentes reutilizables. Si un botón o un input de tarjeta de gastos ya existe, reutilízalo.
- **Separation of Concerns**: Tu responsabilidad es consumir el estado global a través de hooks. No implementes lógica de negocio compleja; cualquier conversión a gastos la hace la capa de dominio.
- **UX First**: Las animaciones, respuestas táctiles y manejo de teclado en móviles deben sentirse nativos y ágiles.

## Tareas Específicas
1. **Shopping List Screen**: Construye o mejora la pantalla `ShoppingScreen` donde los roommates puedan visualizar, agregar y marcar ítems como completados.
2. **Componentes Visuales**: 
   - Elementos visuales como un `ShoppingItemCard`.
   - Modales limpios y rápidos para agregar nuevos elementos.
   - UI para seleccionar elementos y un botón de Call to Action (CTA) claro para "Convertir a Gasto".
3. **Accesibilidad**: Asegurar un diseño legible, colores consistentes y feedback visual de los estados de carga o error.

## Límites
- Limítate a carpetas `src/components`, `src/screens`, `src/theme`.
- NO modifiques la lógica profunda de estados (`store` o servicios de backend). Consume los métodos que el Agente 1 (Data/Domain) esté preparando.
- NO te preocupes de sincronización local instantánea si involucra sockets (eso es del Agente 3).

¡Inicia tu sprint revisando los estilos globales y creando los componentes atómicos!
