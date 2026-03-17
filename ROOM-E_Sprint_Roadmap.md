# ROOM-E: Sprint Roadmap

This document outlines the agile development roadmap for the ROOM-E mobile application (v1 MVP), based on the Product Requirements Document (PRD), Design Document, and Technical Design Document.

## Overview & Architecture

* **Stack**: iOS-first React Native (Expo Router), TypeScript, Zustand/Redux Toolkit, TanStack Query.
* **Backend**: Firebase (Auth, Firestore, Cloud Functions, Cloud Messaging).
* **Goal**: Deliver a highly resilient, low-latency shared living command center with Rappi-style fast-action cards, offline capabilities, AI-assisted input, and real-time synchronization.

---

## 🏗️ Sprint 0: Foundation & Design System Setup

*Goal: Establish the technical scaffolding, database schemas, and visual foundations.*
* [x] Initialize React Native project using Expo Router and TypeScript.
* [x] Set up state management (`Zustand` or `Redux Toolkit`) and data fetching (`TanStack Query`).
* [ ] Configure Firebase project (Auth, Firestore, Functions, Cloud Messaging).
* [x] Define and implement the Design System Tokens (indigo/coral/teal colors, typography, spacing).
* [x] Build core foundational UI components: Layouts, Tab Navigation, Standard Cards (`Summary Cards`, `Task Cards`), Chips, and Floating Action Buttons (FAB).
* [ ] Setup initial CI/CD pipeline and code quality tooling (ESLint, Prettier).

## 👤 Sprint 1: Identity & House Setup (Local Auth MVP)

*Goal: Allow users to onboard smoothly, create a household, and invite roommates.*
* [x] Integrate custom branding (App Icon & Splash) from user assets.
* [x] Build Auth App Stack and AppName update in app.json.
* [x] Build the "Login" mock screen to select User profiles.
* [x] Sync Identity via Zustand to condition the main tabs visibility.

## ✅ Sprint 2: Core Task Management (Local MVP)

*Goal: Allow roommates to create, assign, and complete chores with minimal friction using local React state.*
* [x] Implement robust Zustand data model for `tasks` and `task_occurrences`.
* [x] Build the "Add Task" Modal/Sheet (Field captures: Title, Assignee, Date, Category).
* [x] Build the main Tasks Feed screen (Filtering: All, Mine).
* [x] Implement "Mark as Completed" interactions with optimistic UI updates.
* [x] Develop the backend Scheduler (Cloud Function) for recurring chores.
* [x] Integrate Today's Tasks snapshot into the Home Dashboard.

## 💸 Sprint 3: Expenses & Balance Engine (Local MVP)

*Goal: Introduce transparent financial tracking and shared expense logic without complex accounting.*
* [x] Update data schema for `expenses` and calculate subset balances.
* [x] Build the "Add Expense" Modal/Sheet (Field captures: Amount, Payer, Participants, Category).
* [x] Build the Expenses Ledger screen showcasing history.
* [x] Implement the Balance Engine algorithm to show "Who Owes Who".
* [x] Connect the Balance Dashboard to the Home Screen.
* [ ] Build the Expenses Screen (Feed of expenses, Simplified settlement summary cards).
* [ ] Tie Balance Summaries onto the Home Dashboard.

## 🛒 Sprint 4: Shopping List & Converting Needs

*Goal: Deliver a collaborative grocery/supply list that converts smoothly into shared expenses.*
* [x] Develop the Shopping List data model (`shopping_items`).
* [x] Build the Shopping Tab UX (Quick inline add, toggle mark-as-bought with undo capability).
* [x] Implement "Convert to Expense" workflow (Translating bought items dynamically into the Add Expense flow).
* [x] Optimize real-time Firestore listeners for shopping list updates across multiple mobile clients.

## 💬 Sprint 5: Chat, Polls & Notifications

*Goal: Provide a reliable coordination layer and bring users back into the app organically.*
* [ ] Implement House Chat feed and input composer.
* [ ] Build the "New Poll" feature (Question composer, Options, Results display).
* [ ] Implement real-time vote gathering and rendering on active polls in the Chat.
* [x] Set up Firebase Cloud Messaging (FCM) & Apple Push Notification service (APNs).
* [x] Develop Push Notification fan-out functions for Mentions, Assignments, New Polls, and Recurring Reminders.
* [x] Configure Deep Linking from notifications into specific screens (e.g., jump directly to a new Expense).

## 🤖 Sprint 6: AI Quick Actions & Final Polish

*Goal: Implement the required Serverless AI assistance, refine the UX, and prepare for distribution.*
* [ ] Setup secure backend LLM integration via Cloud Functions (do not expose keys on the client).
* [ ] Build the Natural Language Parser for drafting structured Task and Expense intents.
* [ ] Build the Confirmation UI Modals (Always require user approval before the AI persists an action).
* [ ] Conduct performance pass (Virtualize long lists, confirm cold-start speeds, ensure skeleton loading functions as expected).
* [ ] Conduct offline-resilience pass (Ensure caching and write-queues function under poor connectivity).
* [ ] Final round of QA, security audits, and App Store submission prep.

---
*Roadmap generated following PRD v1.0, Design Specifications, and architecture guardrails.*
