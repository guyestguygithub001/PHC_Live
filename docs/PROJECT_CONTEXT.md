# Project Context: Realities of PHC_Live on the Ground

This document travels with the code. It is our single source of truth for project goals, actual field findings, technical decisions, and the messy realities of the clinics we are designing for. It is an honest record, not a sanitized corporate pitch.

---

## 1. How this Project Started

On August 10, 2026, we spoke with a nurse named Tosin at a Primary Healthcare Centre. She was friendly, fast, and proud of her work. But when we asked what happens to patient records, she laughed a little. "We have paper folders," she said. "Some of them are for people who died years ago. We don’t throw them away. So we just keep adding more."

That conversation triggered this project. The paper cards and folders are piling up, and the patient data inside is essentially trapped in rooms full of dust. 

Our goal is to build a digital healthcare management system for Primary Healthcare Centres (PHCs) and Secondary Healthcare facilities (General Hospitals) in Nigeria. We want to make registration fast, help clinics track referrals, and let data flow upward from the community level without creating extra paperwork for already busy staff.

---

## 2. Loopholes and Gaps in the Current System

Our conversation with Tosin and our field notes highlight three massive failures in the existing workflow.

### The Paper Hand Card Loophole
Right now, patients are given a physical paper card to take home. When they return, the Records Officer has to ask for the card, read the handwritten date, and manually search through shelves of folders. If the patient loses their card (which happens constantly), staff have to search by date of last visit or register them all over again. This leads to duplicate records, mismatched history, and endless wait times at the front gate.

### The Siloed Birth Data
About 60% to 70% of births in rural and suburban areas happen at PHCs. But right now, that data stays in paper registers at the clinic. A child is born in a PHC in a place like Wase. The birth is written down in a book. The mother goes home. That birth is never counted anywhere else. If the mother later moves to Jos and the child falls sick, the secondary hospital has no record that the child exists. It is as if they were never born.

### The One-Way Referral Ticket
When a patient is in critical condition (like obstructed labor or a surgical emergency) and needs to go to a General Hospital, the nurse writes a paper note. That paper note goes with the patient. The PHC has no way to track if the patient ever arrived, and the General Hospital never sends feedback about the treatment. If the patient dies on the way, the PHC might never find out. The referral is a one-way ticket with no return stub.

---

## 3. Who We Are Designing For

Instead of thinking about abstract "users," we are building for the actual people Tosin described:

*   **The CHEW (Community Health Extension Worker):** They spend their days doing outreach, registering families, and giving basic care. They carry low-spec Android phones and need to register a patient in under two minutes while standing in a hot compound.
*   **The Records Officer:** They spend hours searching through paper folders. They need a simple desktop or tablet interface where they can type a name or phone number and find a record instantly.
*   **The Lab Technician:** They run diagnostic tests. They need to enter results (like Malaria RDT positive or negative) quickly, knowing the system will automatically link the result to the doctor's screen over the local Wi-Fi.
*   **The Pharmacist:** They manage drug stock and the Drug Revolving Fund. They need a simple screen to log when medicine is dispensed so inventory counts are accurate.
*   **The Doctor or CHO (Community Health Officer):** The clinical supervisor. They need to see the patient's entire timeline (vitals, past visits, lab tests) in one scrollable view that feels like opening a physical folder.

---

## 4. Technical Principles Shaped by the Environment

We decided on three core principles. They are not tech-company buzzwords; they are reactions to what actually exists in a rural clinic:

1.  **Offline-First:** Rural and suburban PHCs experience frequent blackouts, sometimes for days. There is often no internet network. The core clinical workflow must run 100% offline on a local edge server (like a Raspberry Pi running in the clinic). Data syncs to the cloud only when a connection becomes available.
2.  **Mobile and Tablet First:** Most clinics do not have space or reliable power for desktop computer setups. Handheld Android tablets and phones are the default.
3.  **Minimal Data Entry:** Clinicians are busy. The interface must use dropdowns, quick checkboxes, and automatic calculations (like BMI) instead of typing out sentences.

We also believe in **progressive digitization**. We will not force nurses to throw away paper folders on day one. The system will run in parallel with paper logs during onboarding so staff can build trust in the digital records.

---

## 5. Notes, TODOs, and Open Questions

A few things remain unresolved as we build the initial modules:

*   **DHIS2 Version:** We still need to confirm which version of DHIS2 the local government areas (LGAs) are running. The background synchronization script might need adjustments depending on their API setup.
*   **Biometrics and NDPR:** We have designed a biometric option (fingerprint/facial templates) to prevent duplicate patient records. However, we need to check the data protection implications under Nigerian Data Protection Regulation (NDPR) before we write any code for it.
*   **WDC (Ward Development Committee):** It is still unclear how the WDC actually interacts with the clinic data. We plan to build a simple read-only dashboard showing basic clinic volumes, but we need to talk to a committee head to see what they actually want to monitor.
*   **Local Server Hardware:** We are targeting Raspberry Pi 4/5 edge servers for local deployments, but need to test how well they handle database writes when 5+ staff tablets are active simultaneously.

*Last Updated: August 13, 2026*
