# IMPLEMENTATION_ROADMAP.md — The Sprint Plan

> **Purpose:** This document translates the entire architectural blueprint (Chunks 1-5) into a concrete, executable Sprint Plan for the development team. 
> 
> **Rule of Engagement:** We build from the absolute foundation upwards. UI is useless without the database; the database is useless without the sync engine.

---

## Sprint 0: Infrastructure Setup (Days 1-2)
**Goal:** Establish the foundational repositories, environments, and basic connectivity.
- [ ] Scaffold the **React PWA (Vite)** frontend repository.
- [ ] Scaffold the **Golang Edge API** backend repository.
- [ ] Provision the **Neon PostgreSQL** serverless cloud database and obtain connection strings.
- [ ] Set up the local SQLite (WatermelonDB) instance on the React client.
- [ ] **Verification:** A dummy "ping" goes from the React Client -> Golang API -> Neon Postgres successfully.

---

## Sprint 1: The Offline-First Engine (Days 3-7)
**Goal:** Build the Sync Pipeline and Authentication system so the tablet can function without the internet.
- [ ] **Data Models:** Define the core SQL schema (`patients`, `encounters`, `vitals`, `inventory`) using an ORM (e.g., GORM for Go, or raw SQL migrations).
- [ ] **Auth Layer:** Implement the WebCrypto Asymmetric Keypair generation.
- [ ] **The "Shift Screen":** Build the 4-digit PIN login UI.
- [ ] **The Sync Endpoints:** Build the `GET /sync` (Pull) and `POST /sync` (Push) routes in the Golang API.
- [ ] **Verification:** Turn off Wi-Fi on the tablet, register a dummy patient, turn on Wi-Fi, and verify it syncs to Postgres.

---

## Sprint 2: Core Clinical Modules (Days 8-14)
**Goal:** Build the primary Outpatient (OPD) pipeline from the front door to the pharmacy.
- [ ] **Records Unit:** Build the Fuzzy Search Bar and QR/Barcode scanner integration.
- [ ] **Triage Module:** Build the oversized Numpad for Vitals entry and the red-flag alert logic.
- [ ] **Consultation Module:** Build the Skeuomorphic Timeline and the Zero-Typing ICD-10 Dropdown.
- [ ] **Pharmacy (DRF):** Implement the strict ACID transaction endpoint for dispensing drugs and decrementing inventory.
- [ ] **Verification:** Successfully register a patient, take vitals, diagnose Malaria, and dispense ACT without typing a single word.

---

## Sprint 3: Advanced Routing (IPD & ANC) (Days 15-21)
**Goal:** Expand the clinic's capabilities to handle admissions and maternal health.
- [ ] **IPD Ward Module:** Build the Bed Management dashboard and the Medication Administration Record (MAR) checklist.
- [ ] **Admission Routing:** Implement the `[ADMIT TO WARD]` logic from the CHO's desk to shift a patient from OPD to IPD status.
- [ ] **ANC Module:** Build the 9-month pregnancy timeline and delivery outcome tracker.

---

## Sprint 4: Interoperability & Polish (Days 22-28)
**Goal:** Connect the PHC to the outside world (General Hospitals and the Government).
- [ ] **Referral Module:** Build the secure JSON payload packager and the General Hospital receiving dashboard.
- [ ] **DHIS2 Aggregator:** Write the Golang background worker that tallies monthly stats (e.g., total Malaria cases, total Live Births) and pushes to the government APIs.
- [ ] **UI/UX Polish:** Apply the final Glassmorphism styles, fine-tune the CSS variables for Dark Mode, and implement the "Undo" Toasts and micro-animations.

---

## Post-Sprint: The Field Pilot
**Goal:** Deploy to the first physical clinic.
- [ ] Flash the Golang binary onto the physical Raspberry Pi.
- [ ] Install the PWA on 5 ruggedized Android tablets.
- [ ] Execute a 4-week parallel run (digital + paper) with the Ward Development Committee's blessing.

---
*Last Updated: 2026-08-11 | Chunk 6*
