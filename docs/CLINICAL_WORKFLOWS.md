# CLINICAL_WORKFLOWS.md — System Processes & Patient Journeys

> This document maps out the core workflows for the PHC_Live system. It contrasts the AS-IS (paper-based) reality with the TO-BE (digital, offline-first) architecture.

---

## Workflow 1: Patient Registration & Triage

### AS-IS (Paper Reality)
1. Patient arrives at PHC.
2. Patient hands over physical "Hand Card" or claims it is lost.
3. Records Officer searches through physical cabinets for the patient's paper folder.
4. If lost, a duplicate folder is created.
5. Patient takes folder to Nurse.
6. Nurse takes vitals (BP, Temp, Weight) and writes them in the folder and a central register book.

### TO-BE (Digital System)
1. Patient arrives.
2. Records Officer scans patient's digital ID (QR Code card) or searches by biometrics/phone number.
3. System pulls up longitudinal health record instantly.
4. Officer clicks "Start New Encounter" and assigns patient to Triage Queue.
5. Nurse selects patient from digital queue on tablet.
6. Nurse enters vitals into the digital form. Data syncs locally to the facility server (offline-first).

---

## Workflow 2: Clinical Consultation & Diagnostics

### AS-IS (Paper Reality)
1. Patient sees CHO/Doctor.
2. CHO writes symptoms and suspected diagnosis in the folder.
3. CHO orders a lab test (PHCs do not medicate without testing).
4. Patient walks to Lab with folder.
5. Lab Tech runs test, writes results in folder, and logs in Lab Register.
6. Patient returns to CHO with folder.
7. CHO writes prescription in folder.
8. Patient goes to Pharmacy. Pharmacist dispenses and logs in DRF register.

### TO-BE (Digital System)
1. CHO selects patient from Consultation Queue.
2. CHO reviews vitals and historical data on screen.
3. CHO enters symptoms and selects lab tests from a digital dropdown. System sends electronic request to Lab Queue.
4. Patient walks to Lab. Lab Tech selects patient from Lab Queue.
5. Lab Tech enters results digitally. System alerts CHO that results are ready.
6. CHO reviews results digitally, selects diagnosis (ICD-10/custom codes), and generates e-prescription.
7. Pharmacist sees e-prescription in Pharmacy Queue, dispenses drugs, and system automatically deducts from digital inventory.

---

## Workflow 3: Antenatal Care (ANC) & Delivery

### AS-IS (Paper Reality)
1. Pregnant woman registers for ANC.
2. Data is written in a dedicated ANC logbook.
3. Subsequent visits (ultrasounds, vitals) are added to the book.
4. Delivery outcomes are recorded.
5. This maternal data remains siloed at the PHC and never reaches the General Hospital or National database.

### TO-BE (Digital System)
1. Pregnant woman is enrolled in the ANC Module.
2. System calculates Expected Date of Delivery (EDD) and schedules follow-up visits.
3. Every visit logs vitals, fetal heart rate, and ultrasound notes.
4. Delivery module captures birth outcome, weight, and complications.
5. Birth data automatically aggregates into the DHIS2 monthly report, eliminating the maternal data silo.

---

## Workflow 4: The Referral Loop (PHC to General Hospital)

### AS-IS (Paper Reality)
1. Critical case identified at PHC.
2. CHO writes a paper referral note.
3. Patient travels to General Hospital (GH).
4. GH staff read the note (if patient didn't lose it), treat the patient, and keep their own paper records.
5. PHC never knows the outcome. The loop is broken.

### TO-BE (Digital System)
1. CHO clicks "Initiate Referral" in the system.
2. System packages the patient's entire encounter history (vitals, labs, notes) into a digital referral package.
3. A QR code is generated (and can be printed/SMS'd).
4. Patient arrives at GH. GH staff scan the QR code to securely access the referral package via the cloud (when internet is available).
5. GH completes treatment and enters a "Counter-Referral Summary".
6. The summary syncs back to the PHC system, closing the loop.

---

## Workflow 5: Offline-First Synchronization

Because rural PHCs lack reliable internet, the system operates on a Local-Sync-Remote pattern:

1. **Local Operations:** All PHC staff (Nurses, CHOs, Lab, Pharmacy) connect their tablets/desktops to a **Local Facility Server (e.g., a Raspberry Pi or local PC)** via a local Wi-Fi router (no internet required).
2. **Data Entry:** Workflows 1-4 happen instantly over the local network.
3. **Synchronization:** When the facility gets internet (via cellular dongle, Starlink, or when a supervisor brings a synced device), the Local Server securely syncs its encrypted data up to the **Central Cloud Server**.
4. **Referrals:** Referrals to the General Hospital are pushed to the Cloud during these sync windows.

---
*Last Updated: 2026-08-11 | Chunk 2*
