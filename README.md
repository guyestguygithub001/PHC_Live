# PHC Live — Digital Healthcare for Primary Health Centres

> Making healthcare records digital, connected, and reliable. Even without electricity or internet.

---

## What is this?

PHC Live is a software system built for Primary Healthcare Centres (PHCs) and General Hospitals in Nigeria.

Right now, most PHCs in rural and suburban areas run on paper folders, handwritten cards, and verbal referrals. When a patient moves to a General Hospital, the referral is a piece of paper — and their history usually gets lost along the way.

PHC Live changes that. It gives healthcare workers a simple, practical app that:

- Works without internet — because many PHCs have no reliable network
- Works during power outages — runs on phones and tablets, no desktop required
- Replaces paper folders — records are found in seconds, not minutes
- Tracks referrals — when a patient is transferred, their record goes with them
- Saves physical space — no more rooms full of paper files dating back twenty years
- Protects patient data — only authorised staff can access records

---

## Who is this for?

| Person | Their job | How PHC Live helps |
|---|---|---|
| CHEW (Community Health Extension Worker) | Goes into communities, registers patients, gives basic care | Quick registration on their phone, no more paper forms |
| Nurse / Midwife | Takes vitals, assists deliveries, runs ANC | Digital encounter forms, antenatal tracking, delivery records |
| CHO (Community Health Officer) | Supervises clinical care, handles complex cases | Full patient history at a glance |
| OIC (Officer in Charge) | Runs the facility, manages staff, sends reports | Dashboard showing facility activity, automated reports |
| Lab Technician | Runs tests | Results link directly to patient records |
| Records Officer | Currently manages paper folders and hand cards | Search any patient in seconds |
| Pharmacist | Manages medicine stock | Drug inventory tracking, low-stock alerts |
| General Hospital Staff | Receives referrals | Gets the patient's full digital history on arrival |

---

## Why it matters

When we spoke to staff at PHCs, here is what came up repeatedly:

- Patients carry a paper hand card home. If they lose it, finding their history means searching through stacks of folders by date.
- Some PHCs have entire rooms dedicated to storing paper files, including folders for patients who have been dead for years.
- 60-70% of rural births happen at PHCs but that birth data rarely reaches the state or national health system.
- When a critical patient is referred to a General Hospital, the transfer is a handwritten note. There is no way to know if the patient arrived, what happened, or what the outcome was.

---

## How it works

```
Patient arrives at PHC
        ↓
Records Officer searches by name, phone, or ID
        ↓
  Found? Open their record
  Not found? Register new patient (takes about 2 minutes)
        ↓
Triage: nurse records vitals
        ↓
Consultation: doctor reviews history, diagnoses, prescribes
        ↓
  Lab needed? Technician records results, auto-linked to patient
        ↓
  Medication needed? Pharmacy dispenses, stock auto-updated
        ↓
  Critical case? Digital referral created, General Hospital notified
        ↓
All data saved locally, syncs to server when internet is available
```

---

## Project documentation

All reference documents are in the `/docs` folder.

| Document | Contents |
|---|---|
| [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) | Project goals, constraints, field interview findings |
| [PROJECT_STATE.md](docs/PROJECT_STATE.md) | Current progress and what is being worked on |
| [MODULE_SPECIFICATIONS.md](docs/MODULE_SPECIFICATIONS.md) | Detailed specs for each clinical module |
| [ARCHITECTURE_DECISIONS.md](docs/ARCHITECTURE_DECISIONS.md) | Why certain technical decisions were made |
| [GOLDEN_RECORD.md](docs/GOLDEN_RECORD.md) | How the patient identity and deduplication system works |
| [CONTAINERIZATION.md](docs/CONTAINERIZATION.md) | Docker setup, LAN deployment, and conversion engineering notes |
| [SUPPORT_PLAYBOOK.md](docs/SUPPORT_PLAYBOOK.md) | Full log of every major change and decision |

---

## Healthcare scope

```
┌────────────────────────────────────────────────┐
│           TERTIARY HEALTHCARE                  │
│  (Teaching Hospitals, Specialist Centres)      │
│           Not in scope yet                     │
├────────────────────────────────────────────────┤
│          SECONDARY HEALTHCARE                  │
│      (General Hospitals)                       │
│      In scope — receives referrals             │
├────────────────────────────────────────────────┤
│          PRIMARY HEALTHCARE                    │
│  (PHCs — Rural and Suburban Clinics)           │
│  In scope — core focus of this system          │
│  Outpatient and inpatient care                 │
│  Antenatal care and deliveries                 │
│  Lab testing                                   │
│  Drug dispensing                               │
│  Referrals to General Hospitals                │
└────────────────────────────────────────────────┘
```

---

## Current status

The core clinical modules are built and running: Front Desk, Triage, OPD Consultation, Laboratory, Pharmacy, Referral, Antenatal Care and Delivery, Inpatient Ward, and Billing. The Golden Record system (patient identity, deduplication, audit trail, and record merging) was added in September 2026.

Still in progress:
- DHIS2 auto-aggregation (background reporting worker)
- Epidemic Radar / syndromic surveillance alerts
- WatermelonDB sync adapter for offline-to-cloud sync
- Role-based access control (login system)
- API base URL configuration via environment variable (currently hardcoded to localhost)
- Pilot facility selection and field testing in Plateau State

---

## Running locally

### Backend (Go API server)

```bash
cd clinic-server
cp .env.example .env
# Edit .env and fill in your DATABASE_URL
go run .
# Starts on http://localhost:3001
```

If `DATABASE_URL` is empty or the database is unreachable, the server automatically switches to offline in-memory mode. Data stored in that mode resets when the server restarts.

### Frontend (React web app)

```bash
cd clinic-app
npm install
npm run dev
# Starts on http://localhost:5173
```

You need a Neon PostgreSQL database for online mode. Create a free project at neon.tech and paste the connection string into `clinic-server/.env`.

### One-command startup (Windows)

Double-click `start-local.bat` in the project root. It opens two terminal windows, one for the backend and one for the frontend.

### Docker (full stack)

```bash
cp .env.example .env
# Fill in DB_PASSWORD in .env
docker compose up -d
```

See [CONTAINERIZATION.md](docs/CONTAINERIZATION.md) for the full Docker guide.

---

## Identifier format

Patient IDs follow the format `PHC-PLA-XXXX` where `PLA` stands for Plateau State and `XXXX` is a zero-padded sequential number.

ANC (Antenatal Care) IDs follow the format `ANC-PLA-XXXX`.

For a different state, update the prefix in `clinic-server/handlers.go`.

---

## Contributing

The project is being built iteratively with input from PHC staff and health system stakeholders. If you have field experience, clinical knowledge, or technical skills to contribute, please open an issue or contact the team through the repository.

---

*Built for the healthcare workers who serve Nigeria's rural communities.*
