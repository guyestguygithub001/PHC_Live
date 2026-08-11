# SYNC_ARCHITECTURE.md — The Offline-First Data Engine

> This document outlines how PHC_Live handles data synchronization in an environment where network connectivity is intermittent, slow, or non-existent for days at a time.

---

## 1. The Multi-Tiered Sync Topology

Data flows through three distinct tiers, ensuring the clinic never stops functioning.

### Tier 1: The Edge Device (Tablet / Smartphone / PC)
* Every device runs the app from its browser cache (Service Workers).
* Data is written to **PouchDB** (IndexedDB) locally on the device.
* **Result:** The UI updates instantly (0ms latency). The Nurse feels like they are using a hyper-fast app, completely unaware of network status.

### Tier 2: The Local Facility Server (Raspberry Pi on UPS)
* The device silently attempts to sync its PouchDB instance to the **Local CouchDB Server** over the clinic's local Wi-Fi router.
* If Wi-Fi is down, the device holds the data.
* As soon as Wi-Fi connects, it performs a continuous, two-way replication. 
* **Result:** The CHO in consultation instantly sees the Vitals just taken by the Nurse in Triage, without any data leaving the physical building.

### Tier 3: The Central Cloud (State/National Server)
* The Local CouchDB Server constantly pings for internet access (via a cellular 4G dongle or Starlink).
* When a connection is found (e.g., cell service returns at 2 AM), the Local Server initiates a robust bulk replication up to the **Central Cloud CouchDB**.
* **Result:** Data is backed up, referrals are dispatched to the General Hospital, and DHIS2 aggregates are populated.

---

## 2. Conflict Resolution (MVCC)

What happens if Nurse A and Doctor B edit the same patient's record at the exact same time while the local Wi-Fi is down?

### 2.1 Multi-Version Concurrency Control
CouchDB/PouchDB does not lock rows. Instead, every document has a `_rev` (revision) token.
1. Nurse A updates patient `weight` to 65kg. Record becomes revision `2-A`.
2. Doctor B updates patient `blood_pressure` to 120/80. Record becomes revision `2-B`.
3. When the network restores, both devices push to the Local Server.

### 2.2 Deterministic Resolution
* The database recognizes a conflict.
* It deterministically chooses a "winning" revision based on a hash algorithm so all nodes agree on the same winner.
* However, the "losing" revision is **not deleted**. It is saved as a historical leaf in the document's revision tree.

### 2.3 Application-Level Merging
* Our React app will detect conflicted documents.
* Because healthcare data is critical, we use **Document-per-Event** modeling (an append-only ledger) rather than mutating a single massive Patient document. 
* *Example:* Instead of updating `patient.vitals`, we insert a new `Encounter` document linked to the `patient_id`. 
* **Outcome:** By using an append-only, event-driven data model, true conflicts are mathematically minimized to almost zero.

---

## 3. "Data Mules" (The Sneakernet Fallback)

In extreme rural cases (e.g., deep in the DRC or during a total cellular tower failure in Nigeria), the Local Server might not see internet for a month.

* **The Process:** A supervisor visits the PHC carrying a smartphone with the PHC_Live app.
* **The Action:** The smartphone connects to the PHC's local Wi-Fi and syncs the entire month's encrypted database locally to the phone (acting as a "Data Mule").
* **The Delivery:** The supervisor drives back to the city. Once their phone hits 4G, the app silently syncs the PHC's data up to the Central Cloud. 
* **Outcome:** The system survives total internet blackouts via human transportation.

---
*Last Updated: 2026-08-11 | Chunk 3*
