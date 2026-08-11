# MODULE_SPECIFICATIONS.md — Core Feature Definitions

> This document translates the clinical workflows (`CLINICAL_WORKFLOWS.md`) and architectural constraints into concrete feature specifications for each module of the PHC_Live application.

---

## 1. Patient Registration & Records Module

**Primary User:** Records Officer / CHEW  
**Goal:** Digitize the "Hand Card" lookup process, eliminate infinite physical folder storage, and make the front desk hyper-efficient.

### Features
* **Lightning Lookup (Fuzzy Search):** Search by Name, Phone Number, or National Identification Number (NIN). The search algorithm tolerates typos (e.g., matching "Muhamad" to "Mohammed") and works 100% offline via local cache.
* **QR Code / Barcode Scanning:** To make the unit highly functional, the facility can stick cheap, pre-printed QR codes/barcodes on the patient's physical hand card. The Records Officer simply holds the card up to the tablet's camera to instantly pull up the patient file. Zero typing required.
* **Smart ID Generation:** If a patient is new, the system generates a sequential human-readable ID (e.g., `PHC-KAN-0012`) to write on their card.
* **Queue Routing:** Once the record is found, the Records Officer taps "Send to Triage", "Send to ANC", or "Send to Ward". This actively manages traffic flow before the patient even sees a nurse.
* **Archival System:** Deceased or inactive patients are digitally marked as archived, removing them from local tablets to save space but keeping them securely in the Neon cloud database.

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

## 3. OPD Consultation Module (Outpatient Department)

**Primary User:** CHO (Community Health Officer) / Doctor  
**Goal:** Review history, diagnose, and order labs/drugs without dual-entry, or admit patient to Ward.

### Features
* **The "To See" Queue (OPD):** Patients who have passed Triage. Ranked by Urgency (based on Triage vitals).
* **Historical Timeline (Skeuomorphic Folder):** A vertically scrolling timeline showing all past encounters, lab results, and drugs given to this patient. Mimics opening a physical file.
* **ICD-11 Auto-Suggest Engine:** Instead of typing out diagnoses manually, the CHO starts typing a symptom (e.g., "Typhoid"), and a lightning-fast offline fuzzy search instantly suggests the exact ICD-11 code (e.g., `1A07 - Typhoid fever`). This guarantees perfect, standardized data.
* **Action Center:** Buttons to explicitly "Order Lab Test", "Prescribe Drug", "Admit to Ward (IPD)", or "Initiate Referral". 
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
* **Real-time Analytics:** Visual dashboards (charts/graphs) showing the most common diseases seen this month, total patients handled, and drug consumption rates.
* **Automated DHIS2 Aggregation:** Because birth data is highly critical for national statistics, this module automatically maps birth outcomes to DHIS2 data elements for seamless monthly reporting.

---

## 8. The Epidemic Radar (Syndromic Surveillance)

**Primary User:** OIC (Officer in Charge) / State Epidemiologist  
**Goal:** Detect outbreaks in real-time before they spread.

### Features
* **Zero-Setup Surveillance:** Because the CHO is forced to use the ICD-11 Auto-Suggest engine in the Consultation module, the data is perfectly structured automatically.
* **Red Alert Triggers:** If a CHO selects a "Notifiable Disease" (e.g., Cholera, Lassa Fever, Measles), the local Edge Server instantly triggers a high-priority alarm on the OIC's dashboard, completely offline.
* **Automated Escalation:** The exact second the clinic gets internet connectivity, these flagged epidemic cases are pushed upstream to the State DHIS2 or Health Ministry dashboards for rapid, targeted intervention.

---

## 9. Inpatient Department (IPD) / Ward Module

**Primary User:** Ward Nurse / CHO  
**Goal:** Manage admitted patients, track ongoing treatments (e.g., IV drips), and monitor daily vitals.

### Features
* **Bed Management:** A visual dashboard showing available and occupied beds in the ward.
* **The Admission Chart:** A running log tied to the specific admission event (unlike the OPD timeline, which is visit-to-visit). 
* **Medication Administration Record (MAR):** A checklist for nurses to sign off when routine medications are administered (e.g., "Artemether 80mg IV - 08:00 AM [Done]").
* **Discharge Summary:** When a patient is healthy enough to leave, the CHO generates a discharge note, closing the IPD event and converting the patient back to standard outpatient status.

---

## 9. Patient Booking Portal (Cloud-to-Edge)

**Primary User:** The Patient (Remote)  
**Goal:** Allow patients to book appointments from home using a zero-friction, multi-lingual web app, which syncs to the offline clinic.

### Features
* **Cloud-to-Edge Sync:** The portal lives on the public internet, writing to Neon PostgreSQL. The local clinic (Raspberry Pi) pulls these appointments down whenever it detects an internet connection.
* **Zero Form Anxiety (OTP):** No emails or passwords. Patients authenticate purely via Phone Number and a 4-digit SMS/WhatsApp OTP.
* **Native Localization:** A 1-tap toggle seamlessly switches the UI between English, Nigerian Pidgin ("Wetin dey do you?"), and Hausa ("Me ke damun ka/ki?").
* **Iconography & Micro-Interactions:** Uses massive, oversized Tailwind CSS Glassmorphism cards with universal emojis (🤰 Awo, 🦟 Zazzabi) so patients can book by tapping pictures instead of reading text. Auto-advances on OTP entry to ensure a sub-30-second workflow.

---
*Last Updated: 2026-08-11 | Chunk 6*
