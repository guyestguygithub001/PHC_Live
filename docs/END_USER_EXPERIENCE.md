# END_USER_EXPERIENCE.md — UX & Data Strategy

> This document defines the experience of the two primary end-users of the system: the **Patient** (care receiver) and the **Health Worker** (care provider). It outlines how data is collected, protected, and presented to ensure adoption and trust.

---

## 1. The Patient Experience (Care Receiver)

Currently, the patient experience is burdened by the physical "Hand Card". If lost, their medical history is lost. They are passive participants in a paper-heavy system. The TO-BE system empowers them while respecting the technological constraints of rural areas.

### 1.1 Digital Identity & The "Smart Hand Card"
* **The Problem:** Patients lose paper cards.
* **The Solution:** Patients receive a durable, plastic "Smart Hand Card" containing a unique QR code. 
* **Experience:** When a patient arrives, they simply hand over the card. The Records Officer scans it with a tablet camera, instantly pulling up the patient's entire history.
* **Fallback:** If the card is lost, the patient can be found via Phone Number, Name + Date of Birth, or (optionally) a fingerprint scan.

### 1.2 Communication via SMS / USSD
* **The Problem:** Patients in rural areas often don't have smartphones or internet access, so a "Patient Portal App" is useless.
* **The Solution:** The system uses standard SMS and USSD for patient communication.
* **Experience:**
  * **ANC Reminders:** Pregnant mothers receive automated SMS reminders 3 days before their next Antenatal Care visit.
  * **Lab Results:** Patients can receive a basic SMS ("Your lab results are ready, please visit the PHC").
  * **Referral Tracking:** When referred to a General Hospital, the patient receives an SMS with their Referral ID to present at the GH.

### 1.3 Data Privacy & Trust
* **The Problem:** Stigma around certain conditions (e.g., HIV, STIs) makes patients wary of digital systems.
* **The Solution:** Role-Based Access Control (RBAC).
* **Experience:** The patient knows that the Records Officer at the front desk can only see their Name and Age, NOT their clinical diagnosis. Only the Nurse and CHO can see their clinical history. 

---

## 2. The Health Worker Experience (Care Provider)

For CHEWs, Nurses, and CHOs, the system must not feel like an administrative burden. Dual-entry (writing on paper, then typing into a tablet) is the #1 cause of burnout globally. The system must completely replace the paper folder for the user experience to be positive.

### 2.1 Cognitive Load Reduction (Zero-Typing Philosophy)
* **The Problem:** Typing on a tablet keyboard is slow and prone to typos, especially in busy clinics.
* **The Solution:** The UI must be driven by taps, not types.
* **Experience:** 
  * Vitals (BP, Temp) use large, thumb-friendly number pads, not the standard QWERTY keyboard.
  * Symptoms and Diagnoses are selected from smart, searchable dropdown lists (e.g., typing "Mal" instantly brings up "Malaria").
  * Checkboxes and toggles are used for Yes/No questions (e.g., "Patient is pregnant?").

### 2.2 Visual Design for the Environment
* **The Problem:** PHCs often have poor lighting, and older health workers may have poor eyesight.
* **The Solution:** High-Contrast, Large-Target UI.
* **Experience:**
  * **Tap Targets:** Buttons must be large (minimum 44x44 pixels) to accommodate rapid tapping.
  * **Contrast:** High contrast between text and background. 
  * **Dark Mode:** Support for dark mode to reduce eye strain in low-light environments and save battery life on devices.

### 2.3 Offline Confidence
* **The Problem:** Users panic if they think data is lost when the internet drops.
* **The Solution:** The "Always Saved" indicator.
* **Experience:** 
  * The UI never shows a "spinning wheel of death" waiting for the internet.
  * Data is instantly saved to the Local Server. 
  * A clear, non-intrusive icon (e.g., a green cloud with a checkmark) shows "Saved Locally". 
  * A separate icon shows "Synced to State Cloud" (which may happen hours later, but the user doesn't need to wait for it).

---

## 3. Data Flow & Aggregation (The "Invisible" User)

The final end-users are the **State and National Policymakers**.
* **Experience:** The OIC (Officer in Charge) no longer spends the last 3 days of the month manually tallying tally-sheets. The system automatically aggregates the daily encounters into the standardized DHIS2 monthly report format, allowing policymakers to see real-time disease outbreaks (e.g., Cholera) without waiting 30 days for paper reports to travel up the chain.

---
*Last Updated: 2026-08-11 | Chunk 2*
