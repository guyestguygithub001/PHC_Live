# STAKEHOLDER_MAP.md — User Personas & Access Control

> This document defines every human actor interacting with the PHC_Live system. It maps their roles, technological constraints, and system permissions. It is informed by both the Nigerian context and our global PHC research.

---

## 1. Community & Frontline Level

### 1.1 Community Health Extension Worker (CHEW)
* **Role:** Frontline public health outreach, household registration, basic triage, health education.
* **Tech Literacy:** Low to Moderate.
* **Primary Device:** Low-spec Android smartphone (provided or personal).
* **System Interaction:**
  * Uses the mobile app (offline-first).
  * Registers new patients / families.
  * Captures basic vitals and symptoms.
  * Initiates community-level referrals to the PHC.
* **Permissions:** Create patients, Read/Update basic triage data, Create referrals.

### 1.2 The Patient
* **Role:** The recipient of care.
* **Current State:** Carries a physical paper "Hand Card" which frequently gets lost.
* **To-Be State:** Issued a digital Patient ID (QR code/NFC card) and biometrics, removing the burden of carrying paper records.
* **System Interaction:** None directly at this phase. Their data is managed by healthcare workers.

---

## 2. Primary Healthcare Centre (PHC) Level

### 2.1 Records Officer (Health Information Management)
* **Role:** Manages patient registration, pulls folders, handles identity verification at the facility entrance.
* **Current State:** Hunts through physical paper folders that are never destroyed.
* **Tech Literacy:** Moderate.
* **Primary Device:** Desktop computer or tablet at the reception desk.
* **System Interaction:**
  * Scans patient IDs (QR) or searches by name/phone/biometrics.
  * Creates facility visit encounters.
  * Routes patients to specific queues (Triage, ANC, Lab).
* **Permissions:** Create/Read patient demographic data, Create encounters.

### 2.2 Nurse / Midwife
* **Role:** Conducts triage, maternal/antenatal care (ANC), deliveries, and administers treatments.
* **Tech Literacy:** Moderate.
* **Primary Device:** Tablet or Desktop at the nursing station.
* **System Interaction:**
  * Views patient queue.
  * Records detailed vitals, symptoms, and clinical notes.
  * Logs ANC visits, ultrasound summaries, and delivery outcomes.
  * Requests lab tests.
* **Permissions:** Read patient history, Write clinical notes, Write ANC/Delivery data, Create Lab requests.

### 2.3 Community Health Officer (CHO) / Medical Officer
* **Role:** Clinical decision maker, handles complex cases, prescribes medication, authorizes referrals.
* **Tech Literacy:** Moderate to High.
* **Primary Device:** Desktop or Tablet.
* **System Interaction:**
  * Reviews clinical notes and lab results.
  * Enters diagnosis.
  * Prescribes medication (links to pharmacy).
  * Creates formal referral to the General Hospital.
* **Permissions:** Full clinical Read/Write, Create prescriptions, Create outward referrals.

### 2.4 Laboratory Technician
* **Role:** Conducts diagnostic tests. (Crucial rule: PHCs do not dispense medication without lab tests).
* **Tech Literacy:** Moderate.
* **Primary Device:** Desktop computer in the lab.
* **System Interaction:**
  * Views lab request queue.
  * Enters test results directly into the patient's digital record.
* **Permissions:** Read lab requests, Write lab results. Cannot view full clinical notes (privacy).

### 2.5 Pharmacist / Dispensary Officer
* **Role:** Dispenses prescribed medication, manages Drug Revolving Fund (DRF) inventory.
* **Tech Literacy:** Moderate.
* **Primary Device:** Desktop computer.
* **System Interaction:**
  * Views prescription queue.
  * Marks drugs as dispensed.
  * Updates drug inventory levels.
* **Permissions:** Read prescriptions, Write dispensing logs, Manage pharmacy inventory.

### 2.6 Officer in Charge (OIC)
* **Role:** Facility administrator, oversees operations, handles HMIS reporting to the government.
* **Tech Literacy:** High.
* **Primary Device:** Desktop computer.
* **System Interaction:**
  * Views facility-level dashboards (patient volume, drug stockouts).
  * Generates automated aggregate reports for DHIS2.
* **Permissions:** Facility-wide Read (anonymized where appropriate), Aggregate reporting.

---

## 3. Secondary Healthcare Level (General Hospital)

### 3.1 Referral Receiving Officer / GH Doctor
* **Role:** Receives critical cases referred from PHCs.
* **Current State:** Receives patients with handwritten paper notes, leading to lost history.
* **Tech Literacy:** High.
* **Primary Device:** Desktop computer.
* **System Interaction:**
  * Scans patient's PHC-generated Referral ID/QR code.
  * Views the entire clinical history leading up to the referral (vitals, labs, diagnosis).
  * Enters "Counter-Referral" or discharge summary back into the system to close the loop with the PHC.
* **Permissions:** Read specific referred patient records, Write counter-referral notes.

---

## 4. Administrative & Supervisory Level

### 4.1 Local Government Area (LGA) Health Coordinator / WDC
* **Role:** Monitors health outcomes across multiple PHCs in a district.
* **Tech Literacy:** Moderate to High.
* **System Interaction:** Web-based dashboard.
* **Permissions:** Aggregate Read-only access across LGA facilities. No individual patient data access.

---
*Last Updated: 2026-08-11 | Chunk 2*
