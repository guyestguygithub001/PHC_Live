# DATABASE_ARCHITECTURE.md — Designing a Database That Never Fails

> In a traditional hospital, if the central server goes down, the hospital stops working. In rural PHCs, the "central server" is almost always unreachable. Therefore, our database architecture must be fundamentally different from a standard web app. We are building a **Distributed, Offline-First, Append-Only Database**.

---

## 1. The Core Philosophy: "Append-Only" (Event Sourcing)

The biggest cause of database failure in offline environments is **data mutation conflicts** (two people trying to overwrite the exact same row of data while offline).

### 1.1 The Flawed Approach (CRUD)
In a standard system (like a standard SQL database), you have a `Patient` table with a `weight` column.
* Nurse A (offline) updates patient weight to 65kg.
* Nurse B (offline) updates patient weight to 66kg.
* When they both sync, the database throws an error, crashes the sync, or silently overwrites Nurse A's data forever. **This is unacceptable in healthcare.**

### 1.2 Our Approach (The Append-Only Ledger)
We do not update/mutate records. We only **append new events**.
* Instead of having a single `patient` document that gets constantly rewritten, we have an immutable ledger of events.
* **Event 1:** `PatientCreated` (Name: John, Age: 30)
* **Event 2:** `VitalsTaken` (Weight: 65kg, Taken By: Nurse A, Timestamp: 10:00am)
* **Event 3:** `VitalsTaken` (Weight: 66kg, Taken By: Nurse B, Timestamp: 10:05am)
* **Why this never fails:** Because we are just adding new pieces of paper to a digital folder, rather than erasing and rewriting the same piece of paper, **conflicts are mathematically impossible.** The system simply reads the events in chronological order to determine the patient's current state.

---

## 2. NoSQL vs. SQL in the Wilderness

We are using **CouchDB (Server)** and **PouchDB (Client Edge Device)**. These are NoSQL Document databases.

### 2.1 Why SQL Fails Here
Relational databases (like PostgreSQL or MySQL) require strict schemas, foreign keys, and constant network connections to a central server to ensure ACID compliance. If the network drops during a complex multi-table SQL transaction, the database locks up or the transaction fails entirely.

### 2.2 Why CouchDB Succeeds
CouchDB was literally invented for offline replication. 
* Every patient record or encounter is saved as an independent JSON Document.
* It uses **Multi-Version Concurrency Control (MVCC)**. Every document has a revision hash (like a Git commit). 
* If the network drops, the tablet saves the JSON document locally. When the network returns, the tablet throws the document over the wall to the local server. The server seamlessly merges the revision trees. It is built to survive extreme latency.

---

## 3. Data Partitioning (Keeping the Tablets Fast)

A PHC might accumulate 500,000 records over 10 years. A cheap $100 Android tablet will crash if it tries to hold a 10-gigabyte database in its browser memory.

### 3.1 The Solution: Smart Sharding
We do not sync the entire hospital's history to every tablet.
1. **The Central State Cloud:** Holds 100% of all data for the whole state.
2. **The Local PHC Server (Raspberry Pi):** Holds 100% of the data *only for that specific clinic*.
3. **The Nurse's Tablet:** Holds only **Active Patients** (patients who checked into the clinic in the last 48 hours) and **Cached Demographics** (just names and IDs for fast searching).
4. **On-Demand Fetch:** If a patient from 5 years ago walks in, the Records Officer searches their name. The tablet queries the Local Server, pulls down that specific patient's historical file into the tablet's local memory, and opens it.

This ensures the tablet's database remains tiny, lightning-fast, and crash-proof.

---

## 4. Guaranteeing Data Integrity

Because we are using a NoSQL database (which technically allows you to save any random JSON data), we risk the database becoming a swamp of corrupt data if a tablet has a software bug.

### 4.1 Application-Layer Schema Validation
We will not rely on the database to reject bad data. The **React/Vite Frontend** and the **Zustand State Manager** will use strict validation libraries (like Zod).
* Before the tablet ever attempts to save a record to the local PouchDB, it runs a schema check.
* If a Nurse accidentally enters a blood pressure of `999/80`, the UI blocks the save entirely. 
* Only perfectly structured, validated JSON documents are allowed to be written to the local database, ensuring the sync engine never chokes on malformed data.

---
*Last Updated: 2026-08-11 | Chunk 3*
