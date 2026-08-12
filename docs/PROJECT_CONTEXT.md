# PROJECT_CONTEXT.md — PHC_Live Structured Context Document

This document travels with every task session. It's the single source of truth for project goals, constraints, stakeholders, technical decisions, and field intelligence. Try to keep it reasonably up to date as things evolve.

---

## 1. Project Identity

- **Project Name:** PHC_Live
- **Repository:** https://github.com/guyestguygithub001/PHC_Live.git
- **Date Initiated:** 2026-08-11
- **Purpose:** A digital healthcare management system for Primary Healthcare Centres (PHCs) and Secondary Healthcare facilities (General Hospitals) in Nigeria, designed to digitize patient records, improve clinical workflows, enable referral tracking between facility tiers, and ensure data flows upward from community to state/national level.
- **Trigger:** Field visit to PHCs (2026-08-10) revealed significant gaps in existing paper-based workflows. Decision to re-engineer from scratch using real-world survey insights.
- **Methodology:** Agile (iterative sprints with validation checkpoints)

---

## 2. Scope Definition

### In Scope (Primary + Secondary Healthcare)
- **Primary Healthcare Centres (PHCs):** Rural and suburban facilities. Range from small clinics to large facilities comparable to general hospitals. Handle inpatients, outpatients, antenatal care, deliveries, lab testing, and basic treatments.
- **Secondary Healthcare (General Hospitals):** Receive referrals from PHCs for critical cases. Currently no data connection to PHCs.

### Out of Scope (for now)
- Tertiary Healthcare (teaching hospitals, specialist centers)
- National-level NPHCDA administrative systems

---

## 3. Environmental Constraints

These are realities of the deployment environment that the system needs to work within. They aren't preferences, they're hard requirements shaped by what actually exists on the ground.

The biggest headache is electricity. Rural and suburban PHCs experience frequent blackouts, sometimes for hours at a time. This means the app needs to run on battery-powered devices and keep power consumption reasonable. Related to this is network connectivity -- there is often no internet at all, so the system has to be offline-first and sync whenever a connection becomes available. These two constraints together basically rule out anything cloud-dependent for the core clinical workflow.

On the device side, we're looking at Android phones and possibly shared tablets. Nothing fancy. The app needs to be lightweight and not eat up storage. Digital literacy also varies a lot across staff -- some CHEWs are comfortable with phones, others less so. The UI needs to be simple and guided, with dropdowns and checklists rather than freeform text wherever possible.

| Constraint | Reality | Design Implication |
|---|---|---|
| **Physical Infrastructure** | Paper folders, hand cards, written notes | System should replace paper gradually, not demand an overnight switch |
| **Facility Size** | Ranges from small clinics to large PHCs with multiple departments | Modular system so facilities can enable only what they need |

---

## 4. Stakeholder Registry

We've directly spoken with one nurse so far (see the field interview section below). The rest of the stakeholders listed here are based on what we know about PHC structure from available documentation and the broader context -- we haven't formally interviewed all of them yet. That's something to do once we have a pilot facility confirmed.

| Role | Description | Interaction with System |
|---|---|---|
| **CHEW** (Community Health Extension Worker) | Frontline health worker; conducts outreach, registers patients, provides basic care | Primary daily user |
| **CHO** (Community Health Officer) | Clinical supervisor; oversees CHEWs, handles complex cases | Power user with clinical authority |
| **OIC** (Officer in Charge) | Facility head; administration, staff management, reporting | Admin dashboard, reports |
| **Nurse / Midwife** | Clinical care, antenatal, deliveries, vitals recording | Clinical encounter module |
| **Lab Technician** | Runs tests; PHCs have labs and don't medicate without testing | Lab results module |
| **Pharmacist / Drug Store Keeper** | Drug inventory, Drug Revolving Fund (DRF) management | Inventory module |
| **Records Officer** | Currently manages paper folders; tracks patient hand cards | Patient records module |
| **WDC** (Ward Development Committee) | Community governance; resource mobilization, supervision | Read-only dashboards |
| **LGA Health Coordinator** | Local government oversight; aggregated reporting | Reporting module |
| **Patient / Community Member** | Receives care; carries hand card for identification | Patient portal (future) |
| **General Hospital Staff** | Receives referrals from PHCs | Referral receiving module |

---

## 5. Field Intelligence — Nurse Interview (2026-08-10)

### Source: WhatsApp interview with nurse ("Tosin Compound")

**Key Findings:**

1. **Patient Identification:** Patients receive a hand card that they take home. When they return, staff checks the date on the card and searches for their physical folder.
2. **Patient Record Variables:** Name, Age, Gender, Address, Occupation, Signs and Symptoms, Test Results, Vitals.
3. **Deceased Patient Records:** Files are never destroyed -- kept intact forever. They occupy physical space.
4. **Critical Case Referral:** If a case is critical, they refer to a General Hospital with a written note (paper referral). No digital tracking.
5. **Antenatal Care:** PHCs perform antenatal care, scans to check foetus position, and take deliveries. All documented with written notes.
6. **Birth Data Siloed:** Data of a person who gave birth remains at the PHC. It never flows to a General Hospital. Confirmed: "No, I doubt since there's no referral."
7. **Birth Statistics:** 60-70% of births in rural/suburban areas happen at PHCs.
8. **Lab Services:** PHCs have laboratories. They do not give medication without testing first.
9. **Inpatient + Outpatient:** PHCs handle both, just like a normal hospital.
10. **Staff Attitude:** Positive -- "Very fast, attend to one quickly without wasting time. Very nice. Rare to see a nurse in PHC with bad attitude."

### Loopholes Identified

The interview surfaced a few deeply embedded workflow problems. The paper hand card system is probably the most immediate issue -- patients lose cards, staff create duplicate records, and there's no way to search for a patient quickly. Tied to this is the physical folder problem: files are never destroyed, which means storage is becoming a real issue and the data inside is completely inaccessible for any kind of analytics or reporting.

The paper referral process is also a serious gap. There's no tracking once a referral note leaves the PHC, no feedback if the patient was seen or treated, and no connection back to the referring facility. Similarly, birth data stays entirely at the PHC level and never reaches the General Hospital or any national reporting system, which means maternal health statistics at the national level are incomplete. The underlying issue tying most of these together is simply the absence of digital records -- no analytics, no HMIS compliance, no accountability trail.

---

## 6. Technical Principles (Decided)

The three principles we keep coming back to are: offline-first, mobile-first, and minimal data entry. The system has to function 100% without internet -- data syncs when connectivity returns, but nothing about the core clinical workflow should depend on a live connection. It's designed for Android phones and tablets as the primary device, with responsive layouts for desktop where it's available. And wherever possible, we want to reduce typing: dropdowns, checklists, and pre-populated fields should be the default.

Beyond those three, a few other things have been decided. The system should support a transition period where paper and digital coexist -- you can't expect overnight adoption and the design needs to reflect that. Role-based access control is non-negotiable; every user sees only what they need for their role. And data should be able to flow upward: PHC to General Hospital to LGA to State to National, with appropriate privacy controls at each step.

One principle that applies to project documentation specifically: these docs are append-only. New information gets added at the bottom rather than rewriting what's already there.

---

## 7. Data Awaiting

- [ ] Additional field survey data (user is expecting more data)
- [ ] Specific PHC names/locations for pilot
- [ ] HMIS form templates currently in use
- [ ] Drug Revolving Fund workflow details
- [ ] General Hospital referral acceptance process

---

## Notes / Open Questions

A few things I want to flag before the next sprint review:

- We haven't confirmed which version of DHIS2 the target LGAs are running. The integration approach might differ depending on that.
- The biometric option in the Patient Master Index (fingerprint/facial templates) -- need to check what the data protection implications are under NDPR before we commit to building it. It's in the spec but nobody's signed off on it legally.
- "Progressive digitization" is easy to say but I'm not sure what it looks like in practice at a facility where the Records Officer is used to physical folders. Do we provide a parallel paper log during onboarding? Need to think through the transition UX more carefully.
- Still unclear how the WDC actually interacts with the system day-to-day. The "read-only dashboard" description is probably accurate but we should verify what they'd actually want to see.

---

*Last Updated: 2026-08-11 | Chunk 1, Step 1.2*
*This document is append-only. New information is added below this line.*
