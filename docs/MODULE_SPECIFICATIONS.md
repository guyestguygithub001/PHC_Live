# MODULE_SPECIFICATIONS.md — Core Feature Definitions

> This document translates the clinical workflows (`CLINICAL_WORKFLOWS.md`) and architectural constraints into concrete feature specifications for each module of the PHC_Live application.

---

## 1. Patient Registration & Records Module

**Primary User:** Records Officer / CHEW  
**Goal:** Digitize the "Hand Card" lookup process and eliminate infinite physical folder storage.

### Features
* **Smart Lookup:** Search by Name, Phone Number, or National Identification Number (NIN). 
* **Fuzzy Matching:** Because spelling names varies, the search algorithm must tolerate typos (e.g., matching "Muhamad" to "Mohammed").
* **Offline Demographics Cache:** As per our database architecture, demographic data is cached locally to make search 100% instant even during a blackout.
* **Smart ID Generation:** If a patient has no ID, the system generates a human-readable ID (e.g., `PHC-KAN-0012`) that can be written on their physical hand card.
* **Archival System:** Deceased or inactive patients can be digitally marked as archived, removing them from the active sync queue but keeping them securely in the Neon cloud database to save space on tablets.

---

## 2. Triage Module (Vitals)

**Primary User:** Nurse / Midwife  
**Goal:** Quickly capture vitals and push the patient to the active consultation queue.

### Features
* **The "Waiting Room" Queue:** A real-time list of patients who have been registered today but have not yet seen a nurse.
* **Rapid Entry UI:** Number pads for entering Blood Pressure (e.g., 120/80), Temperature, Weight, and Height. 
* **Auto-Calculation:** BMI is calculated automatically from weight and height.
* **Alert Thresholds:** If BP is entered as `180/110`, the UI immediately highlights the field in RED (Hypertensive Crisis) and tags the patient as "URGENT" for the Doctor/CHO.

---

## 3. Consultation Module (The Doctor's Desk)

**Primary User:** CHO (Community Health Officer) / Doctor  
**Goal:** Review history, diagnose, and order labs/drugs without dual-entry.

### Features
* **The "To See" Queue:** Patients who have passed Triage. Ranked by Urgency (based on Triage vitals).
* **Historical Timeline (Skeuomorphic Folder):** A vertically scrolling timeline showing all past encounters, lab results, and drugs given to this patient. Mimics opening a physical file.
* **Zero-Typing ICD-10 Diagnosis:** Instead of typing "Malaria", the CHO selects from a pre-populated dropdown of the top 50 most common PHC ailments. 
* **Action Center:** Buttons to explicitly "Order Lab Test", "Prescribe Drug", or "Initiate Referral". 
* **Draft Auto-Save:** If the CHO is typing a note and the tablet battery dies, the note is saved locally in WatermelonDB as a draft and restores instantly on another tablet upon login.

---

## 4. Laboratory Module

**Primary User:** Lab Technician  
**Goal:** Receive orders from Consultation, run tests, and return results digitally.

### Features
* **Lab Request Queue:** Shows all patients currently waiting for a test.
* **Result Entry Form:** Specific input fields based on the test ordered (e.g., Malaria RDT dropdown: [Positive, Negative, Invalid]).
* **Mandatory Testing Enforcement:** As discovered in the field survey ("They don't give medication without test"), the system can optionally block pharmacy dispensing for Malaria if the Lab result is not present or is negative.
* **Instant Notification:** As soon as the result is submitted, it pushes via local Wi-Fi to the CHO's consultation screen instantly.

---

## 5. Pharmacy & Inventory Module (Drug Revolving Fund)

**Primary User:** Pharmacist / Drug Store Keeper  
**Goal:** Track dispensing and manage the Drug Revolving Fund strictly via ACID transactions.

### Features
* **Prescription Queue:** Shows patients waiting for drugs.
* **Dispensing Check:** Pharmacist clicks "Dispense". This triggers a strict PostgreSQL ACID transaction.
* **Inventory Deduction:** 
  * If Amoxicillin inventory is 10, and Pharmacist dispenses 2, inventory becomes 8.
  * *Zero Tolerance Cache:* Inventory levels are NEVER allowed to be stale. The query hits the local server directly.
* **Low Stock Alerts:** Dashboard warnings when critical drugs fall below a defined threshold.

---

## 6. Referral Module (PHC to General Hospital)

**Primary User:** CHO (Initiator) & General Hospital Doctor (Receiver)  
**Goal:** Replace paper referral notes and close the feedback loop.

### Features
* **Referral Generation:** The CHO selects "Refer Patient", chooses the destination General Hospital, and selects the reason (e.g., "Obstructed Labour").
* **Digital Hand-off:** The entire patient timeline (vitals, labs, notes) is packaged into a secure JSON payload. 
* **Cloud Sync:** When the PHC server hits the internet, the payload is pushed to Neon PostgreSQL.
* **GH Dashboard:** The receiving General Hospital sees incoming referrals on their dashboard, complete with the full clinical history.
* **Counter-Referral (Feedback):** Once treated at the GH, the GH doctor clicks "Discharge back to PHC". The outcome flows back down to the PHC's local server, completing the care loop.

---

## 7. Antenatal Care (ANC) & Delivery Module

**Primary User:** Midwife  
**Goal:** Track maternal health over 9 months and capture birth data that is currently siloed.

### Features
* **Pregnancy Timeline:** A dedicated UI tracking the standard 4-to-8 ANC visits.
* **Scan/Foetus Tracking:** Fields for foetal heart rate, presentation, and scan results.
* **Delivery Register:** Captures birth outcomes (Live Birth, Stillbirth, APGAR score, Birth Weight).
* **Automated DHIS2 Aggregation:** Because birth data is highly critical for national statistics, this module automatically maps birth outcomes to DHIS2 data elements for seamless monthly reporting.

---
*Last Updated: 2026-08-11 | Chunk 4*
