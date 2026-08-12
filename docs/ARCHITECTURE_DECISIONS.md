# Architecture Decisions

Running log of technical decisions made during development. The point of this file is to capture the "why" not just the "what" -- because six months from now nobody remembers why we picked X over Y.

Not every decision is in here. Just the ones that were non-obvious or where we genuinely debated options.

---

## ADR-001: Starting from scratch instead of refactoring

**Date:** 2026-08-11

We had a previous version of this app. After the field visit on August 10th, it became clear that the original assumptions were wrong at a fundamental level. The original design assumed patients came in, were seen, and left. It did not account for referrals, inpatient stays, the lab-before-medication requirement, or the offline constraint.

The options were: (a) patch the existing codebase or (b) start clean. We went with option (b). Patching would have meant carrying forward wrong assumptions in the data model, which tends to become expensive to fix later. Clean start was faster in the end.

---

## ADR-002: Why the scope covers both PHCs and General Hospitals

**Date:** 2026-08-11

Originally this was just a PHC system. But once you understand how referrals work -- a nurse writes a paper note, hands it to the patient, and that is the entire information transfer -- it becomes obvious you cannot solve the problem at one end only.

If a patient arrives at a General Hospital with a paper note that says "hypertension, referred from PHC Karaye", the GH doctor has nothing useful to work with. The referral module only makes sense if there is something on the receiving end to receive it.

So the GH gets a lightweight read-only dashboard for incoming referrals and the ability to send discharge summaries back. That closes the loop. Everything beyond that (GH's own EMR, billing, etc.) is out of scope.

---

## ADR-003: Offline first - this was not negotiable

**Date:** 2026-08-11

The field survey was clear: PHCs lose power regularly, and rural areas have patchy mobile data. A system that needs internet to function is not a system for this environment, it is just software that will sit unused.

The architecture is: local SQLite (via WatermelonDB) on the device, a local Go server on a Raspberry Pi (or similar edge device) at the facility, and Neon PostgreSQL in the cloud. Everything works without the cloud connection. The cloud sync runs in the background whenever a connection is available.

The conflict resolution piece of the sync is still being worked out. Right now the backend does basic REST. The WatermelonDB sync adapter needs to be properly wired up -- that is the next major engineering task after the module UIs are stable.

---

## ADR-004: React + Vite + TypeScript for the frontend

**Date:** 2026-08-11

Considered Vue.js as well. One person on the team had more Vue experience. We went with React because the kind of state management needed for patient queues and multi-step forms fits better with React's component model, and because there is more ecosystem support for the offline libraries we needed (WatermelonDB has a React-first API).

Vite over Create React App because CRA is effectively dead at this point. Build times with CRA on even a small project are slow.

TypeScript was a given. With a project this size and this many modules, catching type errors at compile time rather than at runtime saves a lot of debugging.

---

## ADR-005: Go + Gin for the backend

**Date:** 2026-08-11

The backend server (clinic-server) is written in Go using Gin. The main argument for Go was deployment simplicity on constrained hardware. You compile a single binary, copy it to the Raspberry Pi, run it. No runtime to manage, no node_modules, no version conflicts with the OS.

We also looked at Node.js with Fastify, which would have let the whole team work in one language. The operational argument for Go on edge hardware won. Memory usage on a Pi 4 is also noticeably lower.

---

## ADR-006: Neon PostgreSQL for cloud storage

**Date:** 2026-08-11

Needed a cloud Postgres with: a workable free tier for development, reasonable latency from Nigeria, and no always-on cost for idle databases (clinics that are not syncing should not be costing money).

Neon's serverless model and scale-to-zero fit those requirements. We looked at Supabase (has extra features we do not need yet) and Railway (no scale-to-zero at the time of evaluation).

One practical issue: the initial connection pooling setup was wrong and we were hitting Neon's connection limits during testing. Fixed in the current version of main.go.

---

## ADR-007: Fuse.js for ICD-11 offline search

**Date:** 2026-08-11

The Consultation module needs to let a CHO type "typhoid" and get the correct ICD-11 code back, without needing internet. We are not bundling the full ICD-11 dataset (it is too large for a mobile device). We have a curated subset covering the most common conditions at PHC level in Nigeria.

Fuse.js handles the fuzzy matching client-side. Fast enough for the subset size we are working with.

The subset itself needs clinical review before we go into a real pilot. The current list is a reasonable starting point but should not be treated as definitive without a clinician signing off on it.

---

## ADR-008: Hausa as the first local language

**Date:** 2026-08-11

The pilot target area is northern Nigeria, where Hausa is the dominant language. The app has an EN/HA toggle on every screen.

Nigerian Pidgin was originally in scope for the Patient Portal. We pulled back on this for now because Pidgin does not have a standardized written form and varies enough by region that a poorly written Pidgin translation could feel worse than just using English. Revisit this when we have a native Pidgin speaker available for review.

---

## ADR-009: UI design direction change

**Date:** 2026-08-12

The initial UI used heavy glassmorphism, gradient text, colored shadows, and emerald green as the dominant accent color. This was the wrong call for clinical software for a few reasons:

1. Healthcare software convention is blue-primary (think most hospital software, DHIS2, OpenMRS). Green as primary reads as "success" not "primary action" in this context.
2. Glassmorphism looks dated fast and performs poorly on low-end Android devices.
3. Over-designed UIs create visual noise. A nurse entering vitals for the 50th patient of the day does not want visual entertainment.

The UI was normalized to a professional blue-primary palette, solid card backgrounds, reduced border radii, and tighter padding. The design now reads closer to functional clinical software than a Dribbble concept.

---

*New entries go below this line*
