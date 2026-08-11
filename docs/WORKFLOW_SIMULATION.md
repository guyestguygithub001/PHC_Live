# WORKFLOW_SIMULATION.md — Measuring UX Fluidity

> To prove that the UI is not just aesthetically pleasing but operationally simple, we measure our workflows in "Taps" and "Seconds". If a workflow takes a nurse longer to complete on a tablet than it does to write in a paper logbook, the software has failed.

---

## Scenario A: The Triage Nurse (Vitals Capture)
**Objective:** Record Blood Pressure, Temp, and Weight for a waiting patient.
**Traditional EHR Time:** ~45 seconds (Searching, loading, typing on small keyboards).
**PHC_Live Target Time:** < 10 seconds.

### The Tap-by-Tap Journey
1. **[0.0s] The Lock Screen:** Nurse Tosin picks up the shared tablet. She sees 4 large avatars of the staff on shift.
2. **[1.0s] Login:** She taps her face and enters `1-2-3-4` on an oversized number pad. (2 Taps)
3. **[2.5s] The Queue:** The screen instantly slides to the "Triage Queue". The list of registered patients is already there (cached locally).
4. **[3.5s] Patient Selection:** She taps the first patient, "Oluwaseun". The row expands smoothly (`150ms` animation). (1 Tap)
5. **[5.0s] Vitals Entry (No Keyboards):** Instead of a tiny Android keyboard popping up, a massive, custom-built numpad dominates the bottom half of the screen. 
   - She taps `120` [Next] `80` (for BP).
   - She taps `37` (for Temp). 
6. **[8.0s] Submit:** She taps the large, green `[SAVE]` button. (1 Tap)
7. **[8.2s] The Fluid Exit:** The patient row flashes green, scales down slightly, and slides off the screen. The next patient in the queue automatically slides up. 
8. **[8.5s] Background Sync:** Behind the scenes, the Golang API instantly pushes this data to the Doctor's tablet in Room 2.

**Total Cost:** 4 Taps. Zero standard typing. ~8.5 Seconds.

---

## Scenario B: The CHO Consultation
**Objective:** Diagnose Malaria and prescribe Coartem.
**Traditional EHR Time:** ~2 minutes (Typing long notes, searching ICD-10 codes).
**PHC_Live Target Time:** < 20 seconds.

### The Tap-by-Tap Journey
1. **[0.0s] The Desk:** The CHO sees "Oluwaseun" pop into their "To See" list.
2. **[1.0s] Context Gathering:** The CHO taps the patient. The screen splits:
   - *Left Side:* The new vitals taken 30 seconds ago.
   - *Right Side:* A scrollable, skeuomorphic "Timeline" showing previous visits.
3. **[5.0s] Diagnosis (Zero-Typing):** The CHO taps the "Diagnosis" box. Instead of an empty text field, a grid of the Top 10 PHC diseases appears (Malaria, Typhoid, URI, etc.). The CHO taps "Malaria (Uncomplicated)". (1 Tap)
4. **[7.0s] Action Center:** The CHO taps the "Prescribe Drug" button. Because the diagnosis is Malaria, the system immediately suggests "Artemether/Lumefantrine (ACT)". 
5. **[8.0s] Selection:** The CHO taps the suggestion. (1 Tap)
6. **[10.0s] Submit:** The CHO hits `[COMPLETE ENCOUNTER]`. 
7. **[10.3s] The Fluid Exit:** A toast notification drops down: *"Encounter saved. Sent to Pharmacy."*

**Total Cost:** 4 Taps. Zero typing required. ~10 Seconds.

---

## Scenario C: The Pharmacy (Drug Revolving Fund)
**Objective:** Dispense the ACT and deduct inventory.

1. **[0.0s] The Queue:** Pharmacist sees Oluwaseun appear in the Dispensing Queue.
2. **[1.0s] Verification:** Taps the patient. The screen shows the prescribed ACT and the current physical inventory count in bold (e.g., **Stock: 45**).
3. **[3.0s] Dispense:** Pharmacist taps a large `[DISPENSE 1 UNIT]` button.
4. **[3.2s] ACID Transaction:** The UI instantly shows a green checkmark (Optimistic UI). In the background, the Golang API decrements the PostgreSQL inventory to 44.

**Total Cost:** 2 Taps. ~3 Seconds.

---
*Last Updated: 2026-08-11 | Chunk 5*
