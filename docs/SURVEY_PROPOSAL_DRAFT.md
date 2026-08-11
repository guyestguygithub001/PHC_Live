# SURVEY_PROPOSAL_DRAFT.md — Programs Manager Proposal

> **Purpose:** This document is designed for the Programs Manager. It translates the technical architecture and field intelligence of `PHC_Live` into a structured, persuasive project proposal suitable for securing funding, NGO grants, or government (Ministry of Health / NPHCDA) buy-in.

---

# PROPOSAL: Digitization of Primary & Secondary Healthcare Workflows (PHC_Live)

## 1. Executive Summary
Primary Healthcare Centres (PHCs) are the bedrock of the healthcare system in rural and suburban communities. However, despite their critical role, operations remain heavily reliant on fragile, paper-based systems. A recent field survey revealed catastrophic inefficiencies: patient records are stored in physical folders that are never destroyed, referrals to General Hospitals are made via un-trackable paper notes, and critical maternal health data is siloed.

This proposal outlines the deployment of **PHC_Live**—an offline-first, decentralized digital health management system specifically engineered for low-resource environments. By digitizing the continuum of care from the community PHC to the Secondary General Hospital, we aim to eliminate data loss, reduce patient wait times, and provide real-time epidemiological data to national aggregates (DHIS2).

## 2. Problem Statement (Field Survey Findings)
Our initial field assessment (conducted via direct interviews with PHC clinical staff) uncovered several systemic loopholes:
* **The Hand Card Crisis:** Patients are identified by a physical "Hand Card" they take home. If lost, their medical history is severed.
* **The Storage Black Hole:** Physical folders are never destroyed. They occupy massive physical space, and the data inside them is entirely inaccessible for public health analytics.
* **Siloed Maternal Data:** 60-70% of rural births occur at PHCs, yet this critical delivery data remains locked in paper logbooks and rarely flows upward.
* **The Broken Referral Loop:** Critical cases are referred to General Hospitals via a written note. There is zero digital tracking, meaning patients are frequently lost to follow-up, and the referring PHC never receives counter-referral feedback from the General Hospital.

## 3. The Proposed Intervention: PHC_Live
We propose the implementation of a purpose-built digital ecosystem designed around the strict constraints of rural infrastructure (frequent blackouts, zero internet connectivity, and low digital literacy).

### Key Architectural Pillars:
1. **100% Offline-First Operations:** The system relies on local Edge Servers (low-power Raspberry Pis on battery backups). The clinic operates at full speed even during total internet blackouts.
2. **Decentralized Cryptographic Security:** Staff authenticate using a secure 4-digit PIN that works entirely offline, eliminating the risk of being locked out due to network failures.
3. **Frictionless UI/UX:** The interface is built with extreme fluidity. It replaces tiny digital keyboards with oversized number pads for vitals, and manual typing with smart dropdowns for diagnoses (ICD-10), reducing encounter logging to under 15 seconds.
4. **Strict Inventory Management:** The Drug Revolving Fund (DRF) is digitized with strict ACID-compliant database transactions to prevent inventory shrinkage and stock-outs.

## 4. Project Objectives & Expected Impact
* **Continuum of Care:** Establish a secure, digital data pipeline between PHCs and Secondary General Hospitals, ensuring patient history travels with them.
* **Automated Reporting:** Eliminate the manual tallying of monthly reports. The system will automatically aggregate clinical data and push it to the national DHIS2 servers when an internet connection is detected.
* **Space & Time Efficiency:** Completely eliminate the need for physical folder storage and reduce patient wait times by 40% through rapid digital triage and consultation queues.

## 5. Implementation Roadmap (Pilot Phase)
We propose a 3-phase rollout for the initial pilot deployment:
* **Phase 1 (Setup & Training):** Deployment of the local hardware (1 Edge Server, 3-5 Tablets, 1 Solar UPS) to the pilot PHC. Conducting change-management and UX training for CHEWs, Nurses, and CHOs.
* **Phase 2 (Parallel Run):** A 4-week period where digital records are kept alongside paper records to build staff confidence and identify edge-case workflows.
* **Phase 3 (Full Cutover & GH Integration):** Complete transition to digital records at the PHC, accompanied by the deployment of the Receiving Dashboard at the affiliated General Hospital to track live referrals.

## 6. Resource Requirements
To execute the pilot phase, the following resources are required per facility:
* **Hardware:** 1x Local Edge Server (Raspberry Pi/Mini PC), 3x-5x Android Tablets, 1x Local Wi-Fi Router, 1x Solar/Battery Backup Unit.
* **Software Infrastructure:** Cloud hosting for the central PostgreSQL aggregation database (Neon).
* **Human Resources:** 1x Field Deployment Engineer, 1x Clinical Trainer.

## 7. Conclusion
The current paper-based system is not just an administrative burden; it is a clinical risk that fragments patient care. **PHC_Live** is not an off-the-shelf software forced into a rural setting—it is a system engineered precisely from the ground up for the realities of the field. Funding this pilot will establish a scalable blueprint for digitized, data-driven healthcare across the region.

---
*Prepared by: Technical Engineering Team*  
*Date: 2026-08-11*
