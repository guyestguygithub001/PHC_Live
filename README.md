# 🏥 PHC_Live — Digital Healthcare for Primary Health Centres

> **Making healthcare records digital, connected, and reliable — even without electricity or internet.**

---

## What Is This?

PHC_Live is a software system designed for **Primary Healthcare Centres (PHCs)** and **General Hospitals** in Nigeria. 

Right now, most PHCs in rural and suburban areas use **paper folders**, **hand cards**, and **written notes** to manage patient records. When a patient needs to be referred to a General Hospital, the referral is a **piece of paper** — and the patient's history often gets **lost along the way**.

PHC_Live changes that. It gives healthcare workers a **simple, easy-to-use app** that:

- ✅ **Works without internet** — because many PHCs have no network
- ✅ **Works during blackouts** — runs on phones and tablets, no desktop computer needed
- ✅ **Replaces paper folders** — patient records are stored digitally and can be found instantly
- ✅ **Tracks referrals** — when a patient is sent to a General Hospital, their records go with them digitally
- ✅ **Saves physical space** — no more rooms full of paper folders (including files of deceased patients)
- ✅ **Protects patient data** — only authorized staff can see records

---

## Who Is This For?

This system is built for the people who actually work in and use PHCs:

| Person | What They Do | How PHC_Live Helps Them |
|---|---|---|
| **CHEW** (Community Health Extension Worker) | Goes into the community; registers patients; provides basic care | Quick patient registration on their phone; no more paper forms |
| **Nurse / Midwife** | Provides clinical care; takes vitals; assists deliveries | Digital encounter forms; antenatal tracking; delivery records |
| **CHO** (Community Health Officer) | Supervises clinical care; handles complex cases | Full patient history at a glance; clinical decision support |
| **OIC** (Officer in Charge) | Runs the facility; manages staff; sends reports | Dashboard showing facility activity; automated reports |
| **Lab Technician** | Runs medical tests | Records test results that link directly to patient records |
| **Records Officer** | Currently manages paper folders and hand cards | Digital search — find any patient in seconds, not minutes |
| **Pharmacist / Drug Keeper** | Manages medicine stock | Drug inventory tracking; alerts when stock is low |
| **General Hospital Staff** | Receives referrals from PHCs | Gets patient history digitally when a referral arrives |
| **Patient** | Comes to the PHC for care | No more losing hand cards; their records are safe and portable |

---

## Why Does This Matter?

### The Problem (What We Found)

When we visited PHCs and talked to the staff, here's what we discovered:

1. **Patients carry a HAND CARD** — if they lose it, nobody can find their records quickly
2. **Records are PAPER FOLDERS** — staff has to search through piles of folders to find one patient
3. **Dead patients' files are kept FOREVER** — they take up physical space with no benefit
4. **Referrals are WRITTEN NOTES** — when a critical patient is sent to a General Hospital, there's no way to track if they arrived or what happened
5. **Birth data STAYS at the PHC** — even though 60-70% of rural births happen at PHCs, that data never reaches the national health system
6. **PHCs and General Hospitals are DISCONNECTED** — no data flows between them at all

### The Solution (What PHC_Live Does)

1. **Digital Patient ID** — every patient gets a unique ID. No more lost hand cards.
2. **Instant Record Search** — type a name or scan an ID, find the record in 2 seconds.
3. **Smart Storage** — digital records take zero physical space. Archives are automatic.
4. **Tracked Referrals** — when you refer a patient, the General Hospital gets the record AND you get notified when they arrive.
5. **Data Flows Upward** — birth data, disease data, and treatment data can be reported to LGA, state, and national level.
6. **Works Offline** — the app stores everything on the device first, then syncs when internet comes back.

---

## How Does It Work? (Simple Version)

```
Patient arrives at PHC
        ↓
Staff searches for patient (by name, phone number, or ID)
        ↓
  Found? → Open their record
  Not found? → Register new patient (takes 2 minutes)
        ↓
Record the visit: symptoms, vitals, tests, diagnosis, treatment
        ↓
  Need a test? → Lab tech records results → auto-linked to patient
        ↓
  Need medicine? → Pharmacy dispenses → stock auto-updated
        ↓
  Critical case? → Create digital referral → General Hospital notified
        ↓
All data saved on device → syncs to server when internet is available
```

---

## Project Documentation

All project documents are in the `/docs` folder:

| Document | What It Contains |
|---|---|
| [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) | Everything about the project — goals, constraints, stakeholders |
| [PROJECT_STATE.md](docs/PROJECT_STATE.md) | Where we are right now — current progress |
| [SUPPORT_PLAYBOOK.md](docs/SUPPORT_PLAYBOOK.md) | Complete history of every step we've taken |
| [ARCHITECTURE_DECISIONS.md](docs/ARCHITECTURE_DECISIONS.md) | Every technical decision and why we made it |

*More documents will be added as the project progresses.*

---

## Healthcare Levels Covered

```
┌─────────────────────────────────────────────────┐
│              TERTIARY HEALTHCARE                 │
│     (Teaching Hospitals, Specialist Centers)      │
│              ❌ NOT IN SCOPE (yet)               │
├─────────────────────────────────────────────────┤
│            SECONDARY HEALTHCARE                  │
│         (General Hospitals)                       │
│           ✅ IN SCOPE — Receives referrals       │
├─────────────────────────────────────────────────┤
│            PRIMARY HEALTHCARE                    │
│    (PHCs — Rural & Suburban Clinics)              │
│     ✅ IN SCOPE — Core focus of this system      │
│     • Inpatient & Outpatient care                │
│     • Antenatal care & deliveries                │
│     • Lab testing                                │
│     • Drug dispensing                            │
│     • Referrals to General Hospitals             │
└─────────────────────────────────────────────────┘
```

---

## Current Status

📍 **Phase:** Implementation & UI Normalization  
📍 **Stage:** De-AI UI Overhaul  
📍 **Recent Update:** Successfully normalized all 10 modules (Front Desk, Triage, Consultation, Lab, Pharmacy, Referral, ANC, Inpatient, Billing, Portal) to use a professional healthcare design system. Removed AI design signatures (excessive glassmorphism, inappropriate shadows, emerald dominance) in favor of standard clinical blue palettes, clean solid borders, and structured hierarchy.
📍 **Next:** DHIS2 Auto-Aggregation & Epidemic Radar

---

## Contributing

This project is being developed iteratively. If you have field data, PHC experience, or technical expertise to contribute, please reach out via the repository.

---

*Built with ❤️ for the healthcare workers who serve Nigeria's rural communities.*
