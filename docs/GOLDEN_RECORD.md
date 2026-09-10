# Golden Record System

This document explains what the Golden Record system is, why it exists, and how every piece of it works in PHC Live.

## What problem does it solve?

Before this system was built, a patient could end up registered more than once without anyone noticing. A clerk comes in for the morning shift and cannot find a patient's record quickly, so she creates a new one. Now there are two files for the same person and their clinical history is split across both. This is not a small problem in primary healthcare settings where patient turnover is high and staff rotate frequently.

The Golden Record principle is simple: one person has exactly one definitive, permanent identity in the database. Everything else in the system, visits, lab results, prescriptions, ANC records, links back to that single identity. If duplicates exist, they can be merged and retired, but they are never deleted.

---

## How the database is structured

Three changes were made to the database as part of this system.

### Changes to the `patients` table

Five new columns were added:

| Column | Type | What it stores |
|---|---|---|
| `record_completeness` | SMALLINT (0-100) | How complete the patient's file is, as a percentage |
| `is_duplicate` | BOOLEAN | Whether this record has been marked as a duplicate of another |
| `duplicate_of` | UUID | Points to the golden record if this one is a duplicate |
| `last_updated_at` | TIMESTAMPTZ | When the record was last changed |
| `last_updated_by` | VARCHAR | Which module or staff role made the last change |

### The `patient_audit_log` table (new)

Every time a field on a patient record changes, one row is written here. This table never gets rows deleted from it.

```
id             — unique ID of this log entry
patient_id     — which patient this change belongs to
changed_by     — who or what made the change (e.g. "FRONT_DESK", "Dr. Emmanuel")
changed_at     — timestamp of the change
field_name     — which field changed (e.g. "phone", "address")
old_value      — what it said before
new_value      — what it says now
change_source  — which module made the change (e.g. "CONSULTATION", "RECORDS_UNIT")
```

Two indexes are on this table: one on `patient_id` (for fetching a patient's history quickly) and one on `changed_at DESC` (for time-ordered queries).

### The `patient_identity_links` table (new)

When two records are merged, the merge is recorded here permanently.

```
golden_patient_id    — the record that survived
duplicate_patient_id — the record that was retired
merged_at            — when the merge happened
merged_by            — who performed the merge
notes                — optional explanation (e.g. "same person, different spelling of name")
```

---

## How record completeness is calculated

The completeness score runs from 0 to 100. It is computed every time a patient record is created or updated.

| Field group | Points |
|---|---|
| First name AND last name (both must be filled) | 10 |
| Phone number | 15 |
| Date of birth | 15 |
| Gender | 10 |
| Address | 10 |
| Tribe OR religion (at least one) | 5 |
| Occupation | 5 |
| Next of kin name | 15 |
| Next of kin phone | 15 |
| **Total** | **100** |

The score is colour-coded in the waiting list:
- **Green (80-100%)** — file is essentially complete
- **Amber (50-79%)** — file has the basics but is missing some fields
- **Red (0-49%)** — file is incomplete and needs attention

---

## Duplicate detection flow

When a clerk tries to register a new patient, the backend runs a two-stage check before creating the record:

1. **Phone number match** — if any active, non-duplicate record shares the same phone number, it is returned as a candidate. This catches the most common scenario.

2. **Name + date of birth match** — if the phone check found nothing, the system checks for records with the same first name, last name, and date of birth (case-insensitive). This catches people who registered without a phone number.

If any candidates are found, the backend returns HTTP 409 (Conflict) with the list of candidates. The frontend shows a modal. The clerk can either:
- Dismiss the modal and open the existing record instead
- Click "Yes, this is a new person" — this sends `force_create: true` and the record is created despite the match

The `force_create` flag is logged in the audit trail so the event can be reviewed later if needed.

---

## Record merging

The merge endpoint (`POST /api/v1/patients/merge`) handles cases where duplicates already exist in the database.

What it does, in order:

1. Verifies the chosen golden record is not itself already a duplicate.
2. Opens a database transaction.
3. Re-assigns all rows in `encounters`, `lab_requests`, and `prescriptions` from the duplicate patient ID to the golden patient ID.
4. Marks the duplicate record as `is_duplicate = true` and sets `duplicate_of` to point at the golden ID.
5. Writes a record to `patient_identity_links`.
6. Commits the transaction.
7. Writes audit log entries for both patients.

The duplicate record is never deleted. It stays in the database so that old `PHC-PLA-XXXX` IDs continue to resolve correctly if they are referenced anywhere (printed cards, handwritten notes from before the merge, etc.).

---

## API endpoints added

| Method | Path | What it does |
|---|---|---|
| GET | `/api/v1/patients/:id/audit-log` | Fetch the full change history for a patient |
| POST | `/api/v1/patients/merge` | Merge a duplicate record into a golden record |
| GET | `/api/v1/patients/duplicates` | List all pairs of records that share a phone number |

The existing `POST /api/v1/patients` endpoint now accepts two additional fields:
- `force_create` (boolean) — bypasses the duplicate check
- `created_by` (string) — records who registered the patient

The existing `PUT /api/v1/patients/:id` now accepts `updated_by` and writes one audit log entry per changed field.

---

## Running the migration manually

If you need to apply the schema changes to a fresh database, run:

```bash
cd clinic-server
go run migrate.go
```

The migration script is idempotent — it uses `IF NOT EXISTS` for tables and indexes, so running it more than once is safe.
