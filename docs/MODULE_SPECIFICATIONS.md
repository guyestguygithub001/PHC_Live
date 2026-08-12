# MODULE_SPECIFICATIONS.md — Core Feature Definitions

> This document translates the clinical workflows (`CLINICAL_WORKFLOWS.md`) and architectural constraints into concrete feature specs for each module of the PHC_Live application.

---

## 1. Patient Registration & Records Module

**Primary User:** Records Officer / CHEW  
**Goal:** Digitize the "Hand Card" lookup process, eliminate infinite physical folder storage, and make the front desk actually fast.

### Features

The core of this module is a fuzzy search -- patients can be looked up by name, phone number, or NIN, and the algorithm is tolerant of typos (matching "Muhamad" to "Mohammed" for example). This needs to work 100% offline via local cache.

For facilities that want a faster option, cheap pre-printed QR codes or barcodes can be stuck onto the patient's physical hand card. The Records Officer holds the card up to the tablet camera and the file pulls up instantly. No typing at all. If the patient is new, the system generates a readable ID like `PHC-KAN-0012` that staff can write on the card.

Once the record is found, the Records Officer routes the patient -- "Send to Triage", "Send to ANC", "Send to Ward" -- which manages queue flow before the patient even sees a nurse. Deceased or inactive patient records get archived digitally, removing them from the local tablet to save storage but keeping them safe in the cloud database.

There's also an advanced duplicate detection piece using phone number hashing and optional biometric data (fingerprint/facial templates) to prevent the same patient having multiple records across the network. The biometric part is still pending legal review (see open questions in PROJECT_CONTEXT.md).

---

## 2. Triage Module (Vitals)

**Primary User:** Nurse / Midwife  
**Goal:** Quickly capture vitals and push the patient to the active consultation queue.

### Features
* **The "Waiting Room" Queue:** A real-time list of patients who have been registered today but haven't yet seen a nurse.
* **Rapid Entry UI:** Number pads for entering Blood Pressure (e.g., 120/80), Temperature, Weight, and Height.
* **Auto-Calculation:** BMI is calculated automatically from weight and height.
* **Alert Thresholds:** If BP is entered as `180/110`, the UI immediately highlights the field in red (Hypertensive Crisis) and tags the patient as "URGENT" for the Doctor/CHO.

---

## 3. OPD Consultation Module (Outpatient Department)

**Primary User:** CHO (Community Health Officer) / Doctor  
**Goal:** Review history, diagnose, and order labs/drugs without dual-entry, or admit patient to Ward.

### Features
* **The "To See" Queue (OPD):** Patients who have passed Triage, ranked by urgency based on triage vitals.
* **Historical Timeline (Skeuomorphic Folder):** A vertically scrolling timeline showing all past encounters, lab results, and drugs given to this patient. Mimics opening a physical file.
* **ICD-11 Auto-Suggest Engine:** Instead of typing out diagnoses manually, the CHO starts typing a symptom (e.g., "Typhoid") and an offline fuzzy search suggests the ICD-11 code (e.g., `1A07 - Typhoid fever`). This keeps the data standardized without requiring the clinician to memorize codes.
* **Action Center:** Buttons to explicitly "Order Lab Test", "Prescribe Drug", "Admit to Ward (IPD)", or "Initiate Referral".
* **Draft Auto-Save:** If the CHO is mid-note when the tablet battery dies, the note is saved locally in WatermelonDB as a draft and restores on login from any tablet.
* **Disease Programs (Vertical Integration):** Built-in clinical pathways for priority programs (Malaria, HIV, TB, Hypertension, Diabetes). Prompts condition-specific protocols and routes programmatic data to reporting layers.

---

## 4. Laboratory Module

The lab module sits between the consultation and pharmacy. When a CHO orders a test, it shows up immediately in the Lab Request Queue on the lab technician's device -- a list of patients currently waiting for a test, along with what was ordered.

Result entry uses specific input fields based on the test type. For a Malaria RDT for example, it's a simple dropdown: Positive, Negative, or Invalid. No freeform text where it can be avoided. Once the result is submitted, it pushes over local Wi-Fi back to the CHO's screen instantly.

One thing we built in based on the field interview: the system can optionally block pharmacy dispensing for Malaria if the lab result is missing or negative. This reflects how PHCs already work -- they don't give medication without testing first -- so the system just enforces what good practice already looks like.

---

## 5. Pharmacy & Inventory Module (Drug Revolving Fund)

**Primary User:** Pharmacist / Drug Store Keeper  
**Goal:** Track dispensing and manage the Drug Revolving Fund strictly via ACID transactions.

### Features
* **Prescription Queue:** Shows patients waiting for drugs.
* **Dispensing Check:** Pharmacist clicks "Dispense". This triggers a PostgreSQL ACID transaction.
* **Inventory Deduction:** If Amoxicillin inventory is 10 and the pharmacist dispenses 2, inventory becomes 8. Inventory levels query the local server directly -- no stale cache allowed here.
* **Low Stock Alerts:** Dashboard warnings when critical drugs fall below a defined threshold.

---

## 6. Referral Module (PHC to General Hospital)

**Primary User:** CHO (Initiator) & General Hospital Doctor (Receiver)  
**Goal:** Replace paper referral notes and close the feedback loop.

### Features
* **Referral Generation:** The CHO selects "Refer Patient", chooses the destination General Hospital, and selects the reason (e.g., "Obstructed Labour").
* **Digital Hand-off:** The entire patient timeline (vitals, labs, notes) is packaged into a secure JSON payload.
* **Cloud Sync:** When the PHC server gets internet, the payload is pushed to Neon PostgreSQL.
* **GH Dashboard:** The receiving General Hospital sees incoming referrals on their dashboard, complete with full clinical history.
* **Counter-Referral (Feedback):** Once treated at the GH, the GH doctor clicks "Discharge back to PHC". The outcome flows back to the PHC's local server, completing the care loop.

---

## 7. Antenatal Care (ANC) & Delivery Module

**Primary User:** Midwife  
**Goal:** Track maternal health over 9 months and capture birth data that is currently siloed at the PHC.

### Features
* **Pregnancy Timeline:** A dedicated UI tracking the standard 4-to-8 ANC visits.
* **Scan/Foetus Tracking:** Fields for foetal heart rate, presentation, and scan results.
* **Delivery Register:** Captures birth outcomes (Live Birth, Stillbirth, APGAR score, Birth Weight).
* **Real-time Analytics:** Visual dashboards (charts/graphs) showing the most common diseases seen this month, total patients handled, and drug consumption rates.
* **Automated DHIS2 Aggregation:** Birth outcomes are automatically mapped to DHIS2 data elements for monthly reporting, since this is one of the data points that actually matters at the national level.
* **Immunization & Postnatal Care (PNC):** Tracking of the infant vaccination schedule with automated reminders. Postnatal maternal checkups are tied to the neonatal visit timeline so mother and child wellness are tracked together.

---

## 8. The Epidemic Radar (Syndromic Surveillance)

This module is largely a product of the ICD-11 enforcement in the Consultation module -- because CHOs are using structured codes anyway, the surveillance layer doesn't require any extra work from clinicians.

When a CHO selects a notifiable disease (Cholera, Lassa Fever, Measles, etc.), the edge server immediately triggers a high-priority alarm on the OIC's dashboard, completely offline. The moment the clinic gets internet connectivity, those flagged cases are pushed upstream to the State DHIS2 or Health Ministry dashboards.

> **TODO:** State-level API integration endpoints for epidemic escalation are still being confirmed with the health ministry. The upstream push is designed and ready on our side, but we're waiting on the receiving endpoint details before we can test the full flow. Follow up with the health ministry liaison.

---

## 9. Inpatient Department (IPD) / Ward Module

**Primary User:** Ward Nurse / CHO  
**Goal:** Manage admitted patients, track ongoing treatments (e.g., IV drips), and monitor daily vitals.

### Features
* **Bed Management:** A visual dashboard showing available and occupied beds in the ward.
* **The Admission Chart:** A running log tied to the specific admission event (unlike the OPD timeline, which is visit-to-visit).
* **Medication Administration Record (MAR):** A checklist for nurses to sign off when routine medications are administered (e.g., "Artemether 80mg IV - 08:00 AM [Done]").
* **Discharge Summary:** When a patient is ready to leave, the CHO generates a discharge note, closing the IPD event and converting the patient back to standard outpatient status.

---

## 10. Patient Booking Portal (Cloud-to-Edge)

The booking portal is the one part of the system that lives on the public internet rather than the edge server. Patients access it remotely and appointments sync down to the local clinic whenever the Raspberry Pi detects a connection.

Authentication is entirely phone-based -- no email, no passwords. A 4-digit SMS or WhatsApp OTP is all a patient needs. The UI supports English, Nigerian Pidgin ("Wetin dey do you?"), and Hausa ("Me ke damun ka/ki?") with a one-tap toggle.

For accessibility, the design uses large icon-forward cards with universal emojis (🤰 Awo, 🦟 Zazzabi) so patients can book by tapping pictures rather than reading text. The OTP screen auto-advances on entry, keeping the whole flow under 30 seconds from open to confirmed booking.

*Note on design: the card UI here uses our current clean design system -- straightforward, high-contrast cards, not a glassmorphism approach. We moved away from that earlier in the project.*

---

## 11. Billing & Financial Module

**Primary User:** Cashier / Revenue Officer  
**Goal:** Digitize the collection of facility fees, manage exemptions, and generate transparent financial reports to reduce leakage.

### Features
* **Integrated Point-of-Sale:** Automatically pulls pending invoices from Triage, OPD, Lab, and Pharmacy into a single patient bill.
* **Flexible Payment Methods:** Supports Cash, POS, and digital transfers, while maintaining an audit trail for every transaction.
* **Exemptions & Subsidies:** Native support for the Basic Health Care Provision Fund (BHCPF) and state health insurance schemes, allowing zero-fee billing with appropriate justification codes.
* **End-of-Day Reconciliation:** One-click generation of shift reports detailing revenue collected versus services rendered, for the facility manager.

---

## 12. DHIS2 Integration Layer

**Primary User:** M&E Officer / Local Government Area (LGA) Supervisor  
**Goal:** Automate the monthly HMIS/DHIS2 reporting process, eliminating manual tally sheets.

### Features
* **Automated Tally Sheets:** The system aggregates data in the background -- tallying every Malaria RDT positive, every Penta-3 vaccine given -- into standard DHIS2 indicator formats.
* **One-Click Export & Sync:** At the end of the month, the M&E officer reviews the generated summary and clicks "Push to DHIS2".
* **Offline Resilience:** If internet is unavailable at month-end, the payload is cached and will automatically upload when connectivity is restored.
* **Data Quality Checks:** Built-in validation rules prevent submission of mathematically impossible data.

*Note: the exact data element mapping for this layer still needs to be worked through with the facility's M&E officer. We have the DHIS2 indicator structure on our side, but which local data elements map to which national indicators will vary by facility and needs hands-on confirmation. Don't finalize this until we have that conversation.*

---

*Last Updated: 2026-08-11 | Chunk 6*
