# CACHING_STRATEGY.md — Enterprise Caching & TTL

> Caching is not just a performance feature to speed up reads and writes; it is a **business decision** about how wrong your data is allowed to be and for how long. 

---

## 1. Time-To-Live (TTL) Business Logic

We must deliberately decide the staleness tolerance for every piece of data in the system.

### 1.1 Cache Forever (Indefinite TTL)
Some data practically never changes. If it is 5 minutes behind, no one cares.
* **Company/Facility Address:** Cached forever locally.
* **User Permissions/Roles:** Cached until explicitly revoked by an Admin.
* **Historical Patient Records:** A consultation from 2024 does not change in 2026. Once fetched, it is cached permanently on the device to save bandwidth.

### 1.2 Zero Tolerance (No Caching)
Some data cannot be stale because stale data costs money or lives.
* **Inventory Counts (Drug Revolving Fund):** If the pharmacy app shows 10 units of Amoxicillin, but they were sold 2 seconds ago, the clinic loses money or a patient dies waiting for drugs. Inventory lookups bypass the cache and hit the database directly.
* **Active Triage Vitals:** If a patient is bleeding in Triage, the Doctor in Consultation needs the exact vitals *right now*. 

---

## 2. Preventing Cache Stampedes (The Thundering Herd)

### 2.1 The Problem
What happens when a cache fails or expires? If a heavily accessed cache key (e.g., the daily state-wide dashboard stats) expires, and 10,000 users hit the exact same expired key at the exact same second, all 10,000 requests miss the cache and simultaneously query the PostgreSQL database. **The database crashes.** 

### 2.2 The Solution
Our backend API will implement **Probabilistic Early Expiration (XFetch)** or **Mutex Locks**.
1. **Mutex Lock:** When the cache key expires, the first user request that notices it will acquire a lock. That single request goes to the database to recalculate the data. The other 9,999 requests are forced to wait 50ms, at which point the cache is repopulated, and they all read from the cache.
2. **Result:** The PostgreSQL database only receives **one** query instead of 10,000. 

---

## 3. The Ceiling Principle

Our chosen stack (WatermelonDB + Local Raspberry Pi + Neon PostgreSQL) is the right foundation for our first 1,000 clinics. It is robust, offline-first, and highly normalized.

However, we must **know our ceiling**. 
Enterprise (e.g., National level scaling to 10,000+ clinics and 200 million citizens) is not our next customer; it is our tenth evolution. If and when we reach that scale, we will evolve the central cloud to use advanced sharding, read-replicas, and dedicated Redis clusters. 

For today, we build the perfect, bulletproof architecture for the first 1,000 clinics.

---
*Last Updated: 2026-08-11 | Chunk 3*
