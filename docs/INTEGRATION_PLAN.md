# INTEGRATION_PLAN.md — Golang API & Sync Engine

> This document defines the exact integration architecture between the React (WatermelonDB) frontend and the PostgreSQL database, powered by a high-performance Golang backend.

---

## 1. Why Golang for the Edge Server?
The local server (Raspberry Pi/Mini PC) in the PHC must run on minimal resources (battery/UPS powered) while handling constant background syncs from 10-20 tablets simultaneously. 
* **Zero Dependencies:** Go compiles to a single static binary. We don't need to install Node.js, Python, or manage NPM packages on the edge device. 
* **Ultra-Low RAM:** A Go server can run on <50MB of RAM, leaving the rest of the Pi's memory for the PostgreSQL database.
* **High Concurrency:** Go's `goroutines` easily handle hundreds of concurrent WebSocket or REST connections without blocking, ensuring the sync queue never stalls.

---

## 2. Integration Pipeline (The Sync Flow)

The integration between the Frontend (WatermelonDB) and the Backend (Neon PostgreSQL) flows through the Golang API using the standard WatermelonDB Sync Protocol.

### Phase 1: The Pull (Tablet -> Go API -> Postgres)
When a tablet connects to the clinic Wi-Fi, it must fetch new data (e.g., a patient registered at the front desk).
1. **Request:** Tablet sends a `GET /sync?last_pulled_at=1690000000` to the Golang API.
2. **Query:** Golang API queries the Local PostgreSQL: `SELECT * FROM encounters WHERE updated_at > 1690000000`.
3. **Response:** Golang returns a JSON payload of all new records. WatermelonDB merges them into the local SQLite DB.

### Phase 2: The Push (Tablet -> Go API -> Postgres)
When a Nurse enters Vitals offline, the data queues up locally.
1. **Request:** Tablet detects Wi-Fi and sends a `POST /sync` with a JSON payload of `{ changes: { encounters: { created: [...], updated: [...] } } }`.
2. **Transaction:** The Golang API opens an **ACID Transaction** in PostgreSQL.
3. **Execution:** Golang translates the JSON into batch `INSERT` and `UPDATE` statements. If *any* statement fails (e.g., a schema validation error), the entire transaction rolls back, and Golang returns an HTTP 500. 
4. **Resolution:** If successful, Golang commits the transaction and returns HTTP 200. WatermelonDB clears its local queue.

---

## 3. The Cloud Aggregator (Go Background Worker)

The Local Pi server must periodically push its aggregated data up to the **Neon Cloud PostgreSQL**.
* **The Ping:** A lightweight Go background worker (`cron` or infinite loop ticker) pings `1.1.1.1` every 60 seconds to check for internet connectivity.
* **The Batch Push:** When internet is detected (e.g., via 4G dongle), the Go worker pulls all records updated since the last successful cloud sync and pushes them to the central Neon database via an encrypted TLS 1.3 connection.
* **DHIS2 Interoperability:** A separate Go module aggregates the raw data (e.g., counts total Malaria cases) and pushes the aggregate JSON to the National DHIS2 API endpoint.

---

## 4. API Security & Validation

* **Strict Structs:** Golang is strongly typed. The API will use Go `structs` to unmarshal the incoming JSON. If a tablet sends an invalid data type (e.g., a string instead of an integer for `blood_pressure_systolic`), Go's `json.Unmarshal` will instantly reject the payload before it even touches PostgreSQL.
* **Authentication:** Tablets authenticate with the Golang API using short-lived JWTs (JSON Web Tokens). The Go API verifies the JWT signature locally without needing to query a database.

---
*Last Updated: 2026-08-11 | Chunk 4*
