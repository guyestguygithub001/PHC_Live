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

## 2. SQL in the Wilderness (PostgreSQL + WatermelonDB)

The user requested **PostgreSQL (Neon)** for the central cloud due to its generous free tier and serverless scaling. However, standard SQL fails in offline environments because it requires constant network connections to maintain ACID compliance.

### 2.1 Why Standard SQL Fails Here
If a standard React app talks directly to a PostgreSQL database via an API, a network drop during a transaction will cause the app to hang, crash, or lose the patient's data.

### 2.2 The Solution: WatermelonDB Sync Protocol
To use PostgreSQL without losing offline capabilities, we decouple the UI from the network:
* **The Client (Tablet):** Uses **WatermelonDB** (an offline-first React database built on local SQLite). The app *never* talks to the cloud database directly. It only talks to the local SQLite database, meaning it is always 100% fast and available.
* **The Background Sync:** When the tablet detects Wi-Fi, WatermelonDB's built-in sync engine packages all local changes into a JSON payload and pushes it to a Node.js API on the local server.
* **The Aggregation:** The local API translates the JSON payload into standard SQL `INSERT` commands and executes them against the **Local PostgreSQL Database**.
* **The Cloud Sync:** The Local Postgres periodically replicates to the **Neon PostgreSQL Cloud**.

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

Because we are using PostgreSQL, we gain the massive advantage of strict relational schemas.

### 4.1 Database-Layer Schema Validation
Unlike NoSQL where any random JSON can be saved, PostgreSQL enforces strict data types, foreign keys, and constraints.
* If a tablet attempts to sync a record with a missing `patient_id` or an invalid date format, PostgreSQL will reject the transaction at the API boundary.

### 4.2 Application-Layer Validation
To prevent the user from ever facing a "Sync Failed" error due to bad data, the **React/Vite Frontend** uses strict validation libraries (like Zod) *before* writing to the local WatermelonDB.
* If a Nurse accidentally enters a blood pressure of `999/80`, the UI blocks the save locally.
* This ensures only perfectly structured data is allowed to enter the offline queue, ensuring the eventual sync to Neon PostgreSQL never chokes.

## 5. Enterprise Database Standards

A database with "1 table and 47 columns" is not a database; it is a spreadsheet with delusions. It leads to 10-second load times and system failure. Our Neon PostgreSQL instance will strictly adhere to enterprise design patterns:

### 5.1 ACID Compliance
PostgreSQL is inherently ACID compliant (Atomicity, Consistency, Isolation, Durability). 
* **Application:** When the Pharmacy dispenses a drug (Drug Revolving Fund), the transaction that creates the `prescription_dispensed` record MUST succeed at the exact same time as the transaction that decrements the `inventory_count`. If one fails, the entire transaction rolls back. No orphaned data.

### 5.2 Strict Normalization & Indexing
We will not use massive, wide tables. 
* **Normalization:** Data is split into relational tables (e.g., `patients`, `encounters`, `observations`, `prescriptions`, `lab_results`).
* **Proper Indexes:** We will create explicit B-Tree indices on highly queried foreign keys (e.g., `patient_id`, `facility_id`, `created_at`). 

### 5.3 Migrations & Backups
* **Migrations:** We will use an ORM (like Prisma or Drizzle) to generate strict, version-controlled SQL migration files. Changes to the database schema are never done manually; they are applied linearly via CI/CD.
* **Backups:** Neon provides automatic Point-in-Time Recovery (PITR), allowing us to roll the entire database back to a specific second if catastrophic corruption occurs. We will also perform nightly logical backups (`pg_dump`) to secure offline storage.

### 5.4 Query Optimization
* No `SELECT *` queries. The frontend will only request the exact columns it needs.
* Heavy use of Pagination (Cursor-based) so the system never attempts to load 10,000 records into memory at once.

---
*Last Updated: 2026-08-11 | Chunk 3*
