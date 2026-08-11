# SUPPORT_PLAYBOOK.md — Complete History of Every Step

> **Purpose:** This is the append-only history log. Every step we take, every decision we make, every piece of data we receive is logged here chronologically. If we ever forget what we did or why, this document has the answer.
>
> **Rule:** NEVER rewrite or delete content in this file. Only APPEND new entries below the last entry.

---

## Session 1: Project Inception (2026-08-11)

### Background

The team went to pitch the PHC app on 2026-08-10. During the pitch, they were sent to actual PHCs to conduct field surveys. The surveys revealed critical loopholes in the original design approach. The decision was made to sit down and re-engineer a fresh systems design architecture from the ground up.

**Key realization:** The system must serve everyone from CHEWs (Community Health Extension Workers) at the community level to staff at General Hospitals (secondary care), because PHCs refer critical cases upward — and currently there is ZERO digital connection between these tiers.

---

### Entry 001 — Field Survey Intelligence Gathering
**Date:** 2026-08-10 (evening)  
**Action:** Conducted WhatsApp interview with a nurse (contact: "Tosin Compound")  
**Method:** Chat-based Q&A about PHC operations  

**Raw Findings:**

1. **Q: How does the record unit look? What variables do you cover?**  
   A: Name, Age, Gender, Address, Occupation, Signs and symptoms, Test results, Vitals

2. **Q: How do you identify a patient that already has a record? Any means of ID?**  
   A: "They will a hand card that they take home. So when they come around again, you check the date and then look around for their folder."

3. **Q: What do you do with the data of someone that died?**  
   A: "No [they don't burn the file]. Their files are still kept intact."  
   Follow-up: Files of deceased patients occupy physical space indefinitely.

4. **Q: People hardly die in PHC?**  
   A: "Sometimes. People hardly die in PHC."  
   Follow-up: "Maybe they die outside and staff won't know about that."

5. **Q: If it is critical you refer?**  
   A: "Yes." — With a written note (paper-based referral).

6. **Q: How about pregnant mothers?**  
   A: "They do antenatal care, scan also to check the position of the foetus. They take deliveries too." — All with written notes.

7. **Q: The data of the person who gave birth remains in the PHC?**  
   A: "Yes."  
   Follow-up: "It never leaves there to a General Hospital." — "No. I doubt since there's no referral."

8. **Q: 60-70% of births in rural/suburban areas happen at a PHC?**  
   A: "Yes."

9. **Q: How was your experience at the PHC? Swiftness of care?**  
   A: "They are very fast, that attend to one quickly without wasting time. And they are so nice. It's very rare to see a nurse in PHC with bad attitude."

10. **Q: Is there inpatient and outpatient?**  
    A: Yes — just like a normal hospital.

11. **Q: Do you refer to Labs?**  
    A: "They have labs. They don't give medication without test."

**Analysis of Loopholes Discovered:**
- 🔴 Patient identification relies on a physical hand card — easily lost
- 🔴 Patient lookup is manual — search by date in physical folders
- 🔴 Dead patient files kept forever with no archive/digital system — wasted space
- 🔴 Referrals are paper notes — no tracking, no feedback, no digital chain
- 🔴 Birth data is siloed at PHC — never reaches General Hospital or national databases
- 🔴 No data flow between PHC and General Hospital at all
- 🟠 PHCs are in areas with frequent blackouts and no network

---

### Entry 002 — Project Kick-off Decision
**Date:** 2026-08-11  
**Action:** Decided to re-engineer the PHC system from scratch  
**Rationale:** Original design did not account for real-world PHC operations discovered during field survey  

**Decisions Made:**
1. Use GitHub repo: https://github.com/guyestguygithub001/PHC_Live.git
2. Start with empty repo (clean slate)
3. Scope: Primary Healthcare + Secondary Healthcare (PHC → General Hospital)
4. Offline-first is mandatory (rural areas, blackouts, no network)
5. Mobile-first design (Android phones most common)
6. All documentation is append-only (one blueprint, never rewrite)
7. Work in chunks of 5-7 steps with validation checkpoints

---

### Entry 003 — Chunk 1 Execution Started
**Date:** 2026-08-11  
**Action:** Beginning Chunk 1 — Foundation & Meta-Process Setup  
**Steps:**
- 1.1 ✅ Git repo cloned (empty)
- 1.2 🟡 Creating PROJECT_CONTEXT.md
- 1.3 🟡 Creating PROJECT_STATE.md
- 1.4 🟡 Creating SUPPORT_PLAYBOOK.md (this file)
- 1.5 ⬜ Creating README.md
- 1.6 ⬜ Creating ARCHITECTURE_DECISIONS.md
- 1.7 ⬜ CHECKPOINT — User review

---

*APPEND NEW ENTRIES BELOW THIS LINE*

---

### Entry 004 — Chunk 1 Completion & Global Research Phase
**Date:** 2026-08-11  
**Action:** Completed all Chunk 1 Meta-Process Foundation documents. Conducted a 7-country global PHC research survey.  
**Details:**  
- Research spanned Kenya, Ethiopia, Sierra Leone, Malawi, DRC, Haiti, and India.
- Extracted 12 Universal Truths and 15 Architecture Requirements (AR-01 to AR-15).
- Key findings confirmed: offline-first is mandatory globally, paper dual-entry causes burnout, simple UI is critical, open-source (DHIS2/OpenMRS) is standard.
- Created `docs/research/GLOBAL_PHC_RESEARCH.md`.

---

### Entry 005 — Chunk 2 Execution Started
**Date:** 2026-08-11  
**Action:** Executed Chunk 2 — Domain Analysis (Stakeholder Mapping & Workflow Discovery)  
**Steps Completed:**
- 2.1 ✅ Created `STAKEHOLDER_MAP.md` (Mapping out CHEWs, Nurses, CHOs, Lab Techs, Pharmacists, OIC, GH Doctors).
- 2.2 ✅ Created `CLINICAL_WORKFLOWS.md` (Mapping AS-IS paper reality vs. TO-BE digital offline-first reality for Registration, Vitals, ANC, Referrals).
- 2.3 ✅ Created `DATA_DICTIONARY.md` (Defining exact data payloads based on nurse interview and global standards).
- 2.4 ✅ Created `END_USER_EXPERIENCE.md` (Defining UX strategy for patients via Smart Hand Cards/SMS, health workers via zero-typing UI, and Psychological Safety via skeuomorphism/undo-nets).
- 2.5 🟢 CHECKPOINT — User review of Domain Analysis.

---

### Entry 006 — Chunk 3 Execution Started
**Date:** 2026-08-11  
**Action:** Executed Chunk 3 — Systems Architecture & Technical Design  
**Steps Completed:**
- 3.1 ✅ Created `TECH_STACK.md` (Defining React/Vite PWA, PouchDB/CouchDB database, and Raspberry Pi edge server hardware).
- 3.2 ✅ Created `SYNC_ARCHITECTURE.md` (Defining the 3-tier sync topology, MVCC conflict resolution, and Data Mule sneakernet fallback).
- 3.3 ✅ Created `SECURITY_AND_COMPLIANCE.md` (Defining TLS 1.3, Local DB encryption via PIN, RBAC, and immutable audit trails).
- 3.4 ✅ Created `DATABASE_ARCHITECTURE.md` (Defining the append-only ledger, CouchDB MVCC, smart sharding, and Zod schema validation).
- 3.5 🟢 CHECKPOINT — User review of Systems Architecture.

---

### Entry 007 — Architectural Pivot to PostgreSQL (Neon)
**Date:** 2026-08-11  
**Action:** User requested switching to PostgreSQL because of the Neon Free Tier.  
**Details:**  
- Switched Cloud Database from CouchDB to **Neon Serverless PostgreSQL**.
- Switched Client Database from PouchDB to **WatermelonDB** (which handles offline-first sync specifically for SQL backends in React).
- Updated `TECH_STACK.md`, `SYNC_ARCHITECTURE.md`, and `DATABASE_ARCHITECTURE.md` to reflect this new robust SQL pipeline while maintaining the 100% offline-first requirement.

---

### Entry 008 — Enterprise Database Standards & Caching Strategy
**Date:** 2026-08-11  
**Action:** User provided strong feedback regarding database design (anti 47-column spreadsheets) and caching strategies (stampedes, TTL).  
**Details:**  
- Updated `DATABASE_ARCHITECTURE.md` to include Enterprise Standards: ACID compliance, strict normalization, B-Tree indexing, migrations via ORM, and query optimization (no `SELECT *`).
- Created `CACHING_STRATEGY.md` to explicitly define Time-To-Live (TTL) as a business decision (e.g., caching addresses forever, but never caching inventory counts). Designed a Mutex Lock / Probabilistic Early Expiration system to prevent Cache Stampedes.
- Acknowledged the "Ceiling Principle" — building the perfect foundation for the first 1,000 clinics.

---

### Entry 009 — Chunk 4 Execution Started
**Date:** 2026-08-11  
**Action:** Executed Chunk 4 — Module Design & Feature Specifications  
**Steps Completed:**
- 4.1 ✅ Created `MODULE_SPECIFICATIONS.md` (Defined concrete features for 7 modules: Patient Registration, Triage, Consultation, Labs, Pharmacy, Referrals, and ANC. Highlights include Fuzzy Matching, Red-Flag Vitals alerts, Zero-typing ICD-10 dropdowns, and strict Pharmacy inventory deductions).
- 4.2 ✅ Created `INTEGRATION_PLAN.md` (Pivoted Backend API from Node.js to Golang per user request. Outlined how Go manages the WatermelonDB push/pull sync queue and DHIS2 aggregation while keeping RAM <50MB on the local edge server).
- 4.3 ✅ Created `AUTH_ARCHITECTURE.md` (Defined a zero-panic, offline-first Cryptographic Auth system using WebCrypto keys and a 4-digit PIN for shared devices. Built 3-layer authorization: JWT Claims -> Golang Middleware -> PostgreSQL Row-Level Security).
- 4.4 🟢 CHECKPOINT — User review of Module Specifications, Integration Plan, & Auth Architecture.

---

### Entry 010 — Chunk 5 Execution Started
**Date:** 2026-08-11  
**Action:** Executed Chunk 5 — UI/UX Design & Interface Experience  
**Steps Completed:**
- 5.1 ✅ Created `DESIGN_SYSTEM.md` (Defined a premium aesthetic using Vanilla CSS, Glassmorphism, Google Fonts like Inter/JetBrains Mono, and a clinical color palette to bridge the gap between "scared of tech" and "modern UI").
- 5.2 ✅ Created `MOTION_AND_INTERACTION.md` (Defined psychological safety mechanisms: Optimistic UI for zero latency, "Undo" Toasts instead of deletion popups, and Skeuomorphic Draft Auto-saves).
- 5.3 ✅ Created `WORKFLOW_SIMULATION.md` (Measured exact tap counts and time required for Triage, Consultation, and Pharmacy. Proved that core tasks can be completed in under 10 seconds with zero standard typing).
- 5.4 ✅ Created `SURVEY_PROPOSAL_DRAFT.md` (Drafted an Executive Proposal for the Programs Manager to secure funding/buy-in based on field survey loopholes and our proposed technical intervention).
- 5.5 ✅ Refined `MODULE_SPECIFICATIONS.md` and `CLINICAL_WORKFLOWS.md` based on user feedback. Added explicit Inpatient Department (IPD) / Ward tracking versus Outpatient (OPD). Added QR/Barcode scanning and intelligent queue routing to make the Records Unit highly functional.
- 5.6 🟢 CHECKPOINT — User review of UI/UX Design, Workflow Simulations, Proposal Draft, & Refined Workflows.

---

### Entry 011 — Chunk 6 Execution & System Design Completion
**Date:** 2026-08-11  
**Action:** Executed Chunk 6 — Implementation Roadmap & Sprint Planning  
**Steps Completed:**
- 6.1 ✅ Created `IMPLEMENTATION_ROADMAP.md` (Translated the entire architectural blueprint into a 4-Sprint execution plan mapping out Infrastructure, Offline-First Engine, Core Modules, and Advanced Routing).
- 6.2 🟢 FINAL CHECKPOINT — System Design Phase officially concluded. Ready for Development.

---

## Session 2: API Maturity & UI Execution (2026-08-11)

### Entry 012 — Backend Hardening & API Maturity
**Date:** 2026-08-11
**Action:** Re-engineered the Golang Edge Server for Enterprise API standards (Sprint 4).
**Key Decisions:**
- **API Versioning:** Moved all endpoints to `/api/v1/` to ensure future backward compatibility.
- **UUID Enforcement:** Eradicated sequential integer IDs from all models (`User`, `Patient`, `Encounter`, `Vital`, `Inventory`) in favor of globally unique `UUID`s to mathematically prevent ID enumeration scraping attacks.
- **Data Minimization (DTOs):** Engineered strict Data Transfer Objects in `sync/handler.go` to explicitly strip PII (like phone numbers and PIN hashes) before JSON payloads leave the server during offline syncs.

---

### Entry 013 — Front-Desk & Triage Workflows (Sprint 5)
**Date:** 2026-08-11
**Action:** Built the core React UI for Front-Desk and Triage modules.
**Key Decisions:**
- **Offline LAN Architecture:** Recognized the "Offline Queue" blind spot. Resolved by designing the tablets to communicate via a local Wi-Fi router to the in-clinic Edge Server (Raspberry Pi), allowing queues to function without internet.
- **Fast-Switch PIN Auth:** Implemented a 4-digit PIN lock screen in the Triage module to allow shared tablet usage without typing emails/passwords, ensuring vitals are cryptographically tied to specific nurses.
- **Urgency Flagging:** Hardcoded alerts for high BP (>= 180/110) to visually tag patients as URGENT.
- **Fat-Finger Validation:** Added min/max bounds (e.g., Temperature 30-45°C) to prevent dirty clinical data.

---

### Entry 014 — OPD Consultation & ICD-11 Engine (Sprint 6 Initiation)
**Date:** 2026-08-11
**Action:** Initiating the Consultation dashboard for doctors.
**Key Decisions:**
- **ICD-11 Auto-Suggest:** Decided against loading all 17,000+ codes into memory to prevent crashing Android tablets. Implementing a curated "Primary Care Subset" JSON list powered by `fuse.js` for fast offline fuzzy-searching.

---

### Entry 015 — Sprint 6 Completion: OPD Consultation & ICD-11 Engine
**Date:** 2026-08-11
**Action:** Built the complete OPD Consultation dashboard.
**Files Created:**
- `clinic-app/src/components/Consultation.tsx` — Full consultation UI with clinical queue, historical timeline, ICD-11 engine, and action center.
- `clinic-app/src/utils/icd11Data.ts` — Curated Primary Care Subset of ICD-11 codes (Malaria, Typhoid, Cholera, Lassa Fever, etc.).
**Key Details:**
- Installed `fuse.js` for offline fuzzy search. Threshold set to 0.3 for high typo tolerance.
- Historical Timeline uses a skeuomorphic cream-paper design to psychologically ease the transition from physical folders.
- Queue automatically ranks URGENT patients (from Triage) at the top with red visual indicators.
- Action Center provides buttons for Lab Orders, Drug Prescriptions, and Ward Admissions.

---

### Entry 016 — Registration Form Expansion
**Date:** 2026-08-11
**Action:** User requested additional registration fields based on real PHC intake forms.
**Fields Added:** Gender (dropdown), Age, Tribe/Ethnicity, Religion (dropdown), Occupation, Address (Village/Town/LGA), Next of Kin Name, Next of Kin Phone.
**Design Decision:** Used dropdowns for Gender (Male/Female) and Religion (Islam/Christianity/Traditional/Other) to minimize typing on small tablet screens. Tribe kept as free-text because Nigeria has 250+ ethnic groups.

---

### Entry 017 — Light/Dark Theme System
**Date:** 2026-08-11
**Action:** User reported the pure black UI was too dark. Implemented a full dual-theme system.
**Technical Approach:**
- Created CSS custom properties in `index.css` scoped to `[data-theme="light"]` and `[data-theme="dark"]`.
- Light mode: Clean white (`#f5f7fa` page, `#ffffff` cards).
- Dark mode: Soft ash gray (`#3a3f4a` page) — explicitly NOT pure black, for comfortable long-duration viewing.
- Toggle button (Sun/Moon icon) placed in the navigation bar.
- All 4 component files (`App.tsx`, `FrontDesk.tsx`, `Triage.tsx`, `Consultation.tsx`) refactored to use `var(--variable)` instead of hardcoded Tailwind colors.
- Background gradient blobs only render in dark mode.
- The emerald accent color is shared across both themes for brand consistency.

---

### Entry 018 — Sprints 7, 8 & 9 (Laboratory, Pharmacy, and Referral Modules)
**Date:** 2026-08-11
**Action:** Built and integrated the remaining clinical workflow modules.
**Files Created:**
- `clinic-app/src/components/Laboratory.tsx`
- `clinic-app/src/components/Pharmacy.tsx`
- `clinic-app/src/components/Referral.tsx`
**Key Features Implemented:**
- **Laboratory:** Request queue, dynamic result entry forms (Malaria RDT, Widal, Full Blood Count). Implemented visual mandatory testing badges for Malaria.
- **Pharmacy (Drug Revolving Fund):** Prescription queue, active drug stock dashboard, strict dispensing deduction (mocked offline). Built strict Lab Result Safety checks (blocks dispensing Malaria drugs without a positive lab result).
- **Referrals:** Outgoing referral generation to General Hospitals (Kaduna, Zaria, Barau Dikko). Tracks patient status (Pending Sync, Sent, Received). Included Counter-Referral feedback loops from secondary facilities.
- **Cross-cutting:** Added Hausa translations, dark/light theme support, and `uuidv4()` receipt generation for all modules. Wired into `App.tsx` main navigation.
