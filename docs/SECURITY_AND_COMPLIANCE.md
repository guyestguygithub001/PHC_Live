# SECURITY_AND_COMPLIANCE.md — Data Protection & Privacy

> Healthcare data is highly sensitive. Because PHC_Live operates in a decentralized manner (data living on local devices and edge servers), the security architecture must assume physical devices could be stolen or compromised.

---

## 1. Encryption Strategy

### 1.1 Encryption in Transit
* All synchronization between the Tablet and the Local Server over Wi-Fi is secured via **TLS 1.3 (HTTPS)**.
* All synchronization between the Local Server and the Central Cloud is secured via TLS 1.3.

### 1.2 Encryption at Rest
* **The Problem:** If a tablet is stolen from the clinic, the local PouchDB database contains patient records.
* **The Solution:** The local PouchDB instance is encrypted using AES-256 (via crypto plugins). The encryption key is derived from the user's login PIN. If the app is closed or times out, the database is locked. Without the PIN, the raw IndexedDB files are unreadable gibberish.
* **Server Level:** The Local Server's hard drive (Raspberry Pi SD card/SSD) utilizes Full Disk Encryption (LUKS).

---

## 2. Authentication & Access Control

### 2.1 The "Shared Device" Problem
* In many PHCs, nurses share a single tablet. Traditional username/password login is too slow for emergency triage.
* **The Solution:** Staff have a unique, 4-digit PIN or biometrics (fingerprint) tied to their local profile. 
* They tap their name on the "Shift screen" and enter their PIN to quickly switch sessions without a full cloud login.

### 2.2 Role-Based Access Control (RBAC)
Data visibility is strictly filtered by role (defined in `STAKEHOLDER_MAP.md`):
1. **Front Desk (Records):** Can see Name, Age, Address. Cannot view clinical notes, diagnosis, or lab results.
2. **Lab Tech:** Can see lab request queues and input results. Cannot view doctor's consultation notes.
3. **Doctor / CHO:** Can view full clinical history.
4. **LGA Supervisor:** Can view aggregate statistics (e.g., total Malaria cases) but zero personally identifiable information (PII).

---

## 3. Audit & Accountability

* **Immutable Audit Trail:** Every single write, edit, or "Undo" action creates a signed event log containing the Timestamp, User ID, and Action.
* Because the data architecture is an "Append-Only Ledger" (Document-per-Event), a user cannot maliciously "delete" a record without leaving a permanent cryptographic trace of the deletion event.

---
*Last Updated: 2026-08-11 | Chunk 3*
