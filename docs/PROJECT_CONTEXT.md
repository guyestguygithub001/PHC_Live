# PROJECT_CONTEXT.md — PHC_Live Structured Context Document

This document travels with every task session. It is the single source of truth for project goals, constraints, stakeholders, technical decisions, and field intelligence.

---

## 1. Project Identity

- **Project Name:** PHC_Live
- **Repository:** https://github.com/guyestguygithub001/PHC_Live.git
- **Date Initiated:** 2026-08-11
- **Purpose:** A digital healthcare management system for Primary Healthcare Centres (PHCs) and Secondary Healthcare facilities (General Hospitals) in Nigeria, designed to digitize patient records, streamline clinical workflows, enable referral tracking between facility tiers, and ensure data flows upward from community to state/national level.
- **Trigger:** Field visit to PHCs (2026-08-10) revealed critical loopholes in existing paper-based workflows. Decision to re-engineer from scratch using real-world survey insights.
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

These are NON-NEGOTIABLE realities that the system MUST accommodate:

| Constraint | Reality | Design Implication |
|---|---|---|
| **Electricity** | Frequent blackouts in rural/suburban areas | App MUST work on battery-powered devices; minimal power consumption |
| **Network** | Often no internet connectivity | MUST be offline-first; sync when connectivity returns |
| **Devices** | Likely Android phones, possibly shared tablets | Mobile-first design; lightweight, low-storage footprint |
| **Digital Literacy** | Varies widely (CHEWs trained, some staff less tech-savvy) | Simple, intuitive UI; minimal text input; guided workflows |
| **Physical Infrastructure** | Paper folders, hand cards, written notes | System must replace paper gradually, not demand instant digital-only |
| **Facility Size** | Ranges from small clinics to large PHCs with multiple departments | Scalable module system |

---

## 4. Stakeholder Registry

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

1. **Patient Identification:** Patients receive a HAND CARD that they take home. When they return, staff checks the date on the card and searches for their physical folder.
2. **Patient Record Variables:** Name, Age, Gender, Address, Occupation, Signs and Symptoms, Test Results, Vitals.
3. **Deceased Patient Records:** Files are NEVER destroyed — kept intact forever. They occupy physical space.
4. **Critical Case Referral:** If a case is critical, they refer to a General Hospital WITH A WRITTEN NOTE (paper referral). No digital tracking.
5. **Antenatal Care:** PHCs perform antenatal care, scans to check foetus position, and take deliveries. All documented with written notes.
6. **Birth Data Siloed:** Data of a person who gave birth REMAINS at the PHC. It NEVER flows to a General Hospital. Confirmed: "No, I doubt since there's no referral."
7. **Birth Statistics:** 60-70% of births in rural/suburban areas happen at PHCs.
8. **Lab Services:** PHCs have laboratories. They do NOT give medication without testing first.
9. **Inpatient + Outpatient:** PHCs handle BOTH, just like a normal hospital.
10. **Staff Attitude:** Positive — "Very fast, attend to one quickly without wasting time. Very nice. Rare to see a nurse in PHC with bad attitude."

### Critical Loopholes Identified:

| Loophole | Impact | Priority |
|---|---|---|
| Paper-based hand card for patient ID | Patients lose cards; duplicate records; no way to search | 🔴 CRITICAL |
| Physical folders (never destroyed) | Storage crisis; inaccessible data; no analytics possible | 🔴 CRITICAL |
| Paper referral notes | No tracking; lost referrals; no feedback loop from General Hospital | 🔴 CRITICAL |
| Birth data siloed at PHC | National maternal health statistics incomplete; no continuity of care | 🟠 HIGH |
| No data flow PHC → General Hospital | Broken continuum of care; repeated tests; patient history lost | 🔴 CRITICAL |
| No digital records | No analytics, no reporting, no HMIS compliance, no accountability | 🔴 CRITICAL |

---

## 6. Technical Principles (Decided)

1. **Offline-First:** The system MUST function 100% without internet. Data syncs when connectivity returns.
2. **Mobile-First:** Designed for Android phones and tablets. Responsive for desktop where available.
3. **Minimal Data Entry:** Use dropdowns, checklists, and pre-populated fields to minimize typing.
4. **Progressive Digitization:** Support a transition period where paper and digital coexist.
5. **Append-Only Documentation:** Project documents are never rewritten — only appended to.
6. **Role-Based Access Control:** Every user sees only what they need.
7. **Data Flows Upward:** Patient data should be able to flow from PHC → General Hospital → LGA → State → National, with appropriate privacy controls.

---

## 7. Data Awaiting

- [ ] Additional field survey data (user is expecting more data)
- [ ] Specific PHC names/locations for pilot
- [ ] HMIS form templates currently in use
- [ ] Drug Revolving Fund workflow details
- [ ] General Hospital referral acceptance process

---

*Last Updated: 2026-08-11 | Chunk 1, Step 1.2*
*This document is append-only. New information is added below this line.*
