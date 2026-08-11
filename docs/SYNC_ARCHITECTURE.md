# SYNC_ARCHITECTURE.md — The Offline-First Data Engine

> This document outlines how PHC_Live handles data synchronization in an environment where network connectivity is intermittent, slow, or non-existent for days at a time.

---

## 1. The Multi-Tiered Sync Topology

Data flows through three distinct tiers, ensuring the clinic never stops functioning.

### Tier 1: The Edge Device (Tablet / Smartphone / PC)
* Every device runs the app from its browser cache (Service Workers).
* Data is written to **WatermelonDB** (SQLite/IndexedDB) locally on the device.
* **Result:** The UI updates instantly (0ms latency). The Nurse feels like they are using a hyper-fast app, completely unaware of network status.

### Tier 2: The Local Facility Server (Raspberry Pi on UPS)
* The device silently attempts to push its WatermelonDB action queue to the **Local PostgreSQL Server** (via a high-performance Golang API) over the clinic's local Wi-Fi router.
* If Wi-Fi is down, WatermelonDB holds the changes in a local sync queue.
* As soon as Wi-Fi connects, it performs a pull/push sync based on `updated_at` timestamps.
* **Result:** The CHO in consultation instantly sees the Vitals just taken by the Nurse in Triage, without any data leaving the physical building.

### Tier 3: The Central Cloud (Neon PostgreSQL)
* The Local Postgres Server constantly pings for internet access (via a cellular 4G dongle or Starlink).
* When a connection is found, the Local Server pushes the aggregated clinic data up to the **Neon Serverless PostgreSQL Database**.
* **Result:** Data is backed up, referrals are dispatched to the General Hospital, and DHIS2 aggregates are populated.

---

## 2. Conflict Resolution (MVCC)

What happens if Nurse A and Doctor B edit the same patient's record at the exact same time while the local Wi-Fi is down?

### 2.1 Timestamp-Based Conflict Resolution
Unlike standard SQL apps that just overwrite rows, WatermelonDB uses a strict sync protocol.
1. Nurse A updates patient `weight` to 65kg while offline.
2. Doctor B updates patient `blood_pressure` to 120/80 while offline.
3. When both reconnect, WatermelonDB compares the local changes against the server's `last_pulled_at` timestamp.
4. Because we are using an **append-only event ledger** (creating new records instead of mutating existing ones), both the weight event and blood pressure event are simply inserted into PostgreSQL chronologically. No data is lost.

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
