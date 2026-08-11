# DATA_DICTIONARY.md — Core Data Models & Variables

> This document defines the exact variables collected at each stage of the patient journey, based on the nurse interview findings ("Name, Age, Gender, Address, Occupation, Signs and symptoms, Test results, Vitals") and global DHIS2 standards.

---

## 1. Patient Demographics (Registration)
Data captured when a new patient is registered or verified.

| Variable | Type | Description | Required |
|---|---|---|---|
| `patient_id` | UUID | Unique system identifier | Yes |
| `national_id` | String | NIN or other government ID (if available) | No |
| `first_name` | String | Patient's first name | Yes |
| `last_name` | String | Patient's surname | Yes |
| `date_of_birth` | Date | Exact DOB (or estimated year) | Yes |
| `gender` | Enum | Male, Female | Yes |
| `phone_number` | String | Primary contact number | No |
| `address` | String | Physical residential address/village | Yes |
| `occupation` | String | Patient's profession (as noted by nurse) | Yes |
| `next_of_kin` | String | Emergency contact name | No |
| `biometric_hash`| String | Fingerprint/Face hash for ID (Future) | No |

---

## 2. Encounter & Triage (Vitals)
Data captured by the Nurse during triage for every visit.

| Variable | Type | Description | Required |
|---|---|---|---|
| `encounter_id` | UUID | Unique visit identifier | Yes |
| `patient_id` | UUID | Foreign key to Patient | Yes |
| `timestamp` | DateTime | When the vitals were taken | Yes |
| `blood_pressure` | String | Systolic/Diastolic (e.g., "120/80") | Yes |
| `temperature` | Float | Body temp in Celsius | Yes |
| `weight` | Float | Weight in kg | Yes |
| `height` | Float | Height in cm | No |
| `pulse_rate` | Integer | Heart beats per minute | Yes |
| `respiratory_rate`| Integer | Breaths per minute | No |
| `chief_complaint` | Text | Patient's stated reason for visit | Yes |

---

## 3. Clinical Consultation & Diagnosis
Data captured by the CHO / Medical Officer.

| Variable | Type | Description | Required |
|---|---|---|---|
| `consultation_id` | UUID | Links to Encounter | Yes |
| `signs_and_symptoms`| Text | Clinical observations | Yes |
| `clinical_notes` | Text | Detailed doctor's notes | No |
| `diagnosis_code` | String | ICD-10 or custom code (e.g., "Malaria") | Yes |
| `diagnosis_type` | Enum | Presumptive vs. Confirmed | Yes |
| `outcome` | Enum | Treated, Admitted, Referred, Deceased | Yes |

---

## 4. Laboratory Diagnostics
PHCs rely on tests before medication.

| Variable | Type | Description | Required |
|---|---|---|---|
| `lab_request_id` | UUID | Unique test request | Yes |
| `test_type` | Enum | Malaria RDT, Widal, Urinalysis, HIV, etc. | Yes |
| `result_value` | String | Positive/Negative or numeric value | Yes |
| `result_notes` | Text | Additional lab comments | No |
| `tested_by` | UUID | ID of the Lab Tech | Yes |
| `timestamp` | DateTime | When the test was completed | Yes |

---

## 5. Antenatal Care (ANC) & Maternity
Maternal tracking data.

| Variable | Type | Description | Required |
|---|---|---|---|
| `anc_id` | UUID | Links to maternal episode | Yes |
| `parity` | Integer | Number of previous births | Yes |
| `gestational_age` | Integer | Weeks of pregnancy | Yes |
| `fundal_height` | Float | Measurement in cm | No |
| `fetal_heart_rate`| Integer | BPM of fetus | No |
| `ultrasound_notes`| Text | Scan results (foetus position) | No |
| `delivery_outcome`| Enum | Live birth, Stillbirth | No |
| `birth_weight` | Float | Baby weight in kg | No |

---

## 6. Referrals (PHC to General Hospital)
Data payload for the upward referral chain.

| Variable | Type | Description | Required |
|---|---|---|---|
| `referral_id` | UUID | Unique referral tracking number | Yes |
| `referring_facility`| UUID | PHC ID | Yes |
| `receiving_facility`| UUID | General Hospital ID | Yes |
| `referral_reason` | Text | Why the patient is being sent | Yes |
| `urgency` | Enum | Routine, Urgent, Emergency | Yes |
| `clinical_summary`| Text | Encapsulated history of the current case | Yes |
| `counter_referral_notes`| Text | Feedback from GH back to PHC (Loop closure) | No |

---
*Last Updated: 2026-08-11 | Chunk 2*
