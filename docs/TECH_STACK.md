# TECH_STACK.md — Hardware & Software Architecture

> This document defines the technical foundation of PHC_Live. The stack is chosen specifically to solve the constraints of zero-connectivity, low-power environments while delivering a premium, fluid user experience.

---

## 1. The Application Tier (Frontend)

To achieve both offline capabilities and cross-device compatibility (Android phones for CHEWs, Desktop for Lab Techs), we will build a **Progressive Web App (PWA)**.

* **Framework:** React + Vite
  * *Rationale:* Extremely lightweight, fast build times, and allows for creating a highly interactive, optimistic UI that doesn't feel like a clunky enterprise app.
* **Styling:** Vanilla CSS + Custom Design Tokens (CSS Variables)
  * *Rationale:* We require complete control over the glassmorphism effects, micro-animations, and fluid transitions described in our UX strategy. We avoid heavy UI frameworks to keep the payload small for initial downloads over 2G/3G networks.
* **State Management:** Zustand
  * *Rationale:* Lightweight, unopinionated, and fast for managing local UI state (like the "Drafts" and "Undo" states).

---

## 2. The Offline-First Database Tier

The core of the system relies on the database being able to live on the device itself, while eventually syncing to a standard relational database (PostgreSQL).

* **Client Database (In-Browser/On-Device):** WatermelonDB (backed by SQLite/IndexedDB)
  * *Rationale:* WatermelonDB is specifically built for React apps to handle tens of thousands of records offline without slowing down the UI. It inherently understands how to queue actions while offline and sync them to a SQL backend when online.
* **Local Facility Server Database:** Local PostgreSQL
  * *Rationale:* A lightweight PostgreSQL instance running on the local edge server to act as the intermediary aggregation point for the clinic's tablets.

---

## 3. The Hardware Tier (The Local Edge)

Because rural PHCs experience frequent blackouts and have no internet, we cannot rely solely on a cloud server. 

### 3.1 The "PHC in a Box" (Local Server)
Every PHC will be equipped with a low-cost, low-power local edge server.
* **Compute:** Raspberry Pi 5 (8GB RAM) or an equivalent Mini PC (e.g., Intel N100).
  * *Rationale:* Consumes less than 15 watts of power.
* **Power:** 20,000mAh Power Bank / Mini UPS.
  * *Rationale:* Can run the local server for 12+ hours during a grid blackout.
* **Network:** Standard Wi-Fi Router (running on the same UPS).
  * *Rationale:* Creates a Local Area Network (LAN) inside the clinic. The tablets and desktops connect to this Wi-Fi. No internet is required for the clinic to function.

### 3.2 End-User Devices
* **CHEWs / Outbound:** Standard Android Smartphones.
* **Nurses / Triage:** Android Tablets (e.g., Samsung Galaxy Tab A series) with rugged cases.
* **Records / Lab / Pharmacy:** Reused desktop computers or cheap laptops connecting to the local Wi-Fi.

---

## 4. The Cloud Tier (Aggregation & Backup)

* **Central Database:** PostgreSQL hosted on **Neon (Serverless Postgres)**.
  * *Rationale:* Neon provides a generous free tier, serverless scaling (scales to zero when not used to save money), and instant branching (great for testing features without breaking the production hospital data).
* **Sync Engine:** A Node.js middleware service that facilitates the WatermelonDB Sync Protocol between the local tablets, the local Pi server, and the central Neon PostgreSQL database.
* **Interoperability Engine:** Pushes aggregate statistics to the government's DHIS2 servers automatically.

---
*Last Updated: 2026-08-11 | Chunk 3*
