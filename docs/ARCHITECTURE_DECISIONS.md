# ARCHITECTURE_DECISIONS.md — Architecture Decision Records (ADR)

> **Purpose:** Every significant technical or design decision is recorded here with its context and rationale. This is an append-only log — entries are never modified or deleted, only new ones are added.

---

## ADR-001: Start with an Empty Repository
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** The original PHC app design had loopholes discovered during field surveys at actual PHCs. The team considered whether to refactor the existing codebase or start fresh.  
**Decision:** Start with a completely empty repository and re-engineer the system from scratch.  
**Rationale:** The loopholes were fundamental (wrong assumptions about workflows, missing referral chain, no offline consideration). A patch-and-fix approach would carry forward architectural debt. A clean start allows designing for the real-world constraints discovered in the field.  
**Consequences:** All previous code is abandoned. New architecture is designed around actual PHC operations.

---

## ADR-002: Scope Includes Primary and Secondary Healthcare
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** PHCs refer critical cases to General Hospitals (secondary care). Currently this referral is done with a paper note and there is NO data flow between PHC and General Hospital.  
**Decision:** The system scope covers both Primary Healthcare Centres (PHCs) and Secondary Healthcare facilities (General Hospitals). Tertiary care is out of scope for now.  
**Rationale:** The referral chain between PHC and General Hospital is a critical loophole. Without including both tiers, the system cannot solve the broken referral tracking problem. 60-70% of rural births happen at PHCs and that data never reaches hospitals or national databases.  
**Consequences:** System must support multi-facility deployment with data sharing between facility tiers. Authentication and RBAC must span across facility types.

---

## ADR-003: Offline-First Architecture is Mandatory
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** PHCs are located in rural and suburban areas where electricity blackouts are frequent and internet connectivity is unreliable or absent.  
**Decision:** The application MUST function 100% offline. All data entry, retrieval, and clinical workflows must work without internet. Data synchronization happens when connectivity is restored.  
**Rationale:** Any system that requires constant internet will fail in the target environment. Field survey confirmed that PHCs are "mostly in villages and blacked out sometimes out of light and Network."  
**Consequences:** Requires local database on device (e.g., IndexedDB, SQLite, PouchDB). Need conflict resolution strategy for sync. PWA or native app architecture required. Cannot rely on server-side rendering or API calls for core functionality.

---

## ADR-004: Mobile-First Design
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** PHC staff primarily use Android phones. Some facilities may have tablets. Desktop computers are rare and unreliable due to power outages.  
**Decision:** Design mobile-first. The primary interface is for Android phones/tablets. Desktop interface is secondary.  
**Rationale:** The most reliable computing device in a PHC during a blackout is a charged smartphone. Building mobile-first ensures the system is usable in the most constrained environment.  
**Consequences:** UI must be thumb-friendly. Forms must be optimized for small screens. Data entry should minimize typing (use dropdowns, checkboxes, voice input where possible).

---

## ADR-005: Append-Only Documentation Strategy
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** The team needs a single, growing blueprint that captures the full history of the project. Past decisions and their context must be preserved.  
**Decision:** All project documentation follows an append-only strategy. Documents are never rewritten or restructured — new information is appended to the end.  
**Rationale:** User requirement: "make sure not rewrite the whole thing at some point. only append current information to previous information so that there is 1 blueprint."  
**Consequences:** Documents may grow long over time. Table of contents and section headers become critical for navigation. Version control (git) provides additional history.

---

## ADR-006: Chunked Work with Validation Checkpoints
**Date:** 2026-08-11  
**Status:** ✅ ACCEPTED  
**Context:** Complex systems design requires structured progress tracking and stakeholder buy-in at each stage.  
**Decision:** All work is broken into discrete chunks of 5-7 steps. After each chunk, work pauses for user review before proceeding.  
**Rationale:** Prevents runaway design that doesn't align with stakeholder needs. Each checkpoint is an opportunity to course-correct using new field data (which the user is expecting). Follows Agile principles of iterative delivery and feedback.  
**Consequences:** Slower overall pace but higher quality and alignment. Each chunk produces a reviewable deliverable.

---

*APPEND NEW ADR ENTRIES BELOW THIS LINE*
