# TAREAS CENTRAL - TABLERO PRINCIPAL (ROOM-E)

Índice central para que los sub-agentes especializados sepan dónde buscar sus instrucciones.

## 🧭 INSTRUCCIONES PARA EL USUARIO Y LOS AGENTES
Cuando llames a un Agente especializado para trabajar, asígnale uno de los roles a continuación y dile que lea el archivo correspondiente dentro de `agentes_board/`.

---
## ✅ SPRINT 4 (COMPLETADO): Shopping List & Gastos

- [x] **AGENTE 1** → `agentes_board/SPRINT_4_AGENTE_1.md` (Data/Domain Shopping)
- [x] **AGENTE 2** → `agentes_board/SPRINT_4_AGENTE_2.md` (UI/UX Shopping Tab)
- [x] **AGENTE 3** → `agentes_board/SPRINT_4_AGENTE_3.md` (Realtime Sync & Offline)

---
## ✅ SPRINT 5 (COMPLETADO): Chat, Encuestas y Notificaciones

- [x] **AGENTE 1** → `agentes_board/SPRINT_5_AGENTE_1.md` (Chat & Polls Domain)
- [x] **AGENTE 2** → `agentes_board/SPRINT_5_AGENTE_2.md` (Chat, Polls UI/UX)
- [x] **AGENTE 3** → `agentes_board/SPRINT_5_AGENTE_3.md` (Notificaciones & Deep Linking)

---
## 🚀 SPRINT 6 (ACTIVO): Supabase Backend Integration
> **Foco:** Conectar la app a un backend real — Auth, Base de Datos, Realtime y Notificaciones Push en producción.

- [ ] **AGENTE 1 (Auth + Database Schema + RLS)**
  - Archivo a leer: `agentes_board/SPRINT_6_AGENTE_1.md`
  - Responsable de: SDK de Supabase, cliente singleton, esquema SQL completo con RLS, reemplazar authSlice mock.

- [ ] **AGENTE 2 (Realtime & Data Services)**
  - Archivo a leer: `agentes_board/SPRINT_6_AGENTE_2.md`
  - Responsable de: Servicios CRUD (tasks, expenses, shopping, chat), canales Realtime para chat y shopping.

- [ ] **AGENTE 3 (Storage, Push Tokens & Edge Functions)**
  - Archivo a leer: `agentes_board/SPRINT_6_AGENTE_3.md`
  - Responsable de: Bucket de avatares, guardar pushToken en DB, Edge Function serverless para notificaciones push masivas.

---
## 🔧 INTEGRACIÓN & CODE REVIEW (Agente Líder - Antigravity)
- [ ] **Agente Líder**
  - Archivo guía: `agentes_board/INTEGRACION.md`
  - Responsabilidad: Code Review, glue-code, auditoría arquitectónica post-sprint.


## 🧭 INSTRUCCIONES PARA EL USUARIO Y LOS AGENTES
Cuando llames a un Agente especializado para trabajar, asígnale uno de los roles a continuación y dile que lea el archivo correspondiente dentro de la carpeta `agentes_board/` ubicada en este proyecto.

---
## 🚀 SPRINT 4: Shopping List & Gastos
> **Foco:** Convertir de forma intuitiva ítems de la lista de compras del hogar a un gasto compartido.

- [ ] **AGENTE 1 (Data/Domain Layer)**
  - Archivo a leer: `agentes_board/SPRINT_4_AGENTE_1.md`
  - Responsable de: State Management, Tipos, y Domain Logic de Shopping.

- [ ] **AGENTE 2 (UI/UX)**
  - Archivo a leer: `agentes_board/SPRINT_4_AGENTE_2.md`
  - Responsable de: Screens, Components, Animaciones 100% Mobile para Shopping.

- [x] **AGENTE 3 (Realtime Sync & Net)**
  - Archivo a leer: `agentes_board/SPRINT_4_AGENTE_3.md`
  - Responsable de: Optimistic UI, Sincronización en tiempo real y resolución de conflictos.

---
## 💬 SPRINT 5: Chat y Encuestas (Polls)
> **Foco:** Comunicación en tiempo real y democratización de la toma de decisiones dentro de la casa.

- [ ] **AGENTE 1 (Domain/Data Layer)**
  - Archivo a leer: `agentes_board/SPRINT_5_AGENTE_1.md`
  - Responsable de: Modelar mensajes, encuestas y lógica relacional estricta de votación.

- [ ] **AGENTE 2 (Mobile UX & Poll Cards)**
  - Archivo a leer: `agentes_board/SPRINT_5_AGENTE_2.md`
  - Responsable de: Interfaz fluida de chat (`FlatList` robusta), interacción con encuestas in-chat.

- [x] **AGENTE 3 (Push Notif. & Deep Linking)**
  - Archivo a leer: `agentes_board/SPRINT_5_AGENTE_3.md`
  - Responsable de: Notificaciones pasivas/activas, ruteo por deep-links al chat específico.

---
## 🔧 INTEGRACIÓN & CODE REVIEW (El Líder: Principial Engineer)
- [ ] **Agente Líder (Antigravity)**
  - Archivo guía de filosofía: `agentes_board/INTEGRACION.md`
  - Responsabilidad: Realizar el Code Review estricto y la unión unificada (glue code) tras los desarrollos de cada agente, asegurando pureza arquitectónica, diseño mobile-first impecable y ausencia de errores de integración.
