# ROOM-E AI Context & Log

Este documento sirve como un registro persistente entre sesiones de chat para que el asistente de IA mantenga el contexto de las decisiones, arquitectura y progreso actual del proyecto ROOM-E.

## Estado Actual (Última actualización: Completados Sprints 1, 2 y 3 - Local MVP)

- **Objetivo actual:** El MVP local (sin backend en la nube) está finalizado y funcional. Prepararse para refactorizar hacia Firebase en próximos Sprints.
- **Sprint 1 (Auth MVP):** Completado. Sistema de login básico creado en `LoginScreen.tsx` que permite elegir un perfil simulado. Logos de la app (`icon.png` y `splash.png`) integrados exitosamente.
- **Sprint 2 (Tasks MVP):** Completado. Se incluyó la visualización de tareas en el Home Dashboard, funcionalidad de "Completar Tarea", un modal de creación con selectores de fecha rápidos (Hoy, Mañana) y un simulador de **Backend Scheduler** (Al completar una tarea recurrente 'Weekly', el estado de Zustand clona automáticamente la tarea para la próxima semana).
- **Sprint 3 (Expenses MVP):** Completado. Se creó un Ledger de gastos (`ExpensesScreen.tsx`), un modal para añadir gastos divididos, y un **Motor de Balances** (Balance Engine) que suma y resta matemáticamente las deudas de cada usuario para mostrar quién le debe a quién. Esta información también se refleja en la tarjeta principal del Home.

## Notas de Arquitectura (Zustand)
- Todo el estado fluye a través de `src/store/useAppStore.ts`.
- Contiene arrays simulados para `Usuarios`, `Tareas` y `Gastos`.
- Incluye getters dinámicos como `getBalances()` para cálculos matemáticos en tiempo real. 
- Próximo gran paso técnico será migrar la persistencia de Zustand a **Firebase Firestore**.
