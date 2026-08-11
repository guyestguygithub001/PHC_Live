# AUTH_ARCHITECTURE.md — Zero-Panic, Offline-First Auth

> Traditional authentication systems (Auth0, Clerk, Firebase Auth, or standard Session Cookies) are ticking time bombs in rural environments. If a Nurse's token expires during a 2-week internet blackout, they are locked out of the tablet, and the clinic halts. 
> 
> This document outlines a cryptographic, decentralized Auth system that **never fails**, requires zero internet to operate daily, and guarantees panic-free production deployments.

---

## 1. The Core Problem with Standard Auth
Most systems rely on a central server to say, *"Yes, password is correct, here is your session token."*
If the PHC has no internet, the tablet cannot reach the central server. The system breaks. 

We cannot use standard cloud-based authentication. We must use **Decentralized Cryptographic Verification**.

---

## 2. Authentication: The "Device-Bound Keypair" Strategy

To achieve bank-grade security *without* requiring an internet connection, we rely on Asymmetric Cryptography (Public/Private Keys) handled via the browser's native **WebCrypto API**.

### Phase 1: Provisioning (Online - Happens Once)
1. The OIC (Officer in Charge) logs into a new Tablet using an internet connection (just once).
2. The tablet pulls down the roster for that specific clinic.
3. For every staff member, the tablet uses the WebCrypto API to generate a unique **Private Key** (stored securely in the browser's non-extractable IndexedDB enclave) and a **Public Key** (which is pushed to the local Golang server).
4. The Private Key is encrypted using a **4-digit PIN** chosen by the staff member.

### Phase 2: Daily Operations (100% Offline)
In a fast-paced clinic, nurses share tablets. They do not have time to type complex passwords.
1. The tablet displays a "Shift Screen" showing the names of staff working today.
2. Nurse A taps her name and types her 4-digit PIN.
3. **The Magic:** The PIN decrypts her local Private Key. The tablet signs a cryptographic challenge payload and sends it to the local Golang Edge Server (Raspberry Pi) over local Wi-Fi.
4. The Golang server verifies the signature using Nurse A's Public Key. 
5. **Result:** Nurse A is securely logged in. Zero internet was used. No centralized server was contacted. The UX takes exactly 2 seconds.

---

## 3. Authorization: Multi-Layer RBAC (Role-Based Access Control)

It is not enough to just check roles in the UI. If a malicious actor bypasses the frontend, the backend must stop them. Authorization is enforced at three distinct layers:

### Layer 1: The JWT Claims (The Passport)
When the Golang server verifies the cryptographic login, it issues a **JSON Web Token (JWT)**.
This JWT contains the user's role (e.g., `role: "LAB_TECH"`). The Golang server signs this JWT. Because the Golang server is physically in the building, it can issue and refresh JWTs indefinitely without the internet.

### Layer 2: The Golang Middleware (The Bouncer)
Every API route in the Golang backend has strict middleware.
* If a request hits `POST /api/prescriptions` (Dispense Drug) but the JWT says `role: "RECORDS_OFFICER"`, the Golang API instantly drops the request with a `403 Forbidden`. The API does not even bother checking the database.

### Layer 3: PostgreSQL Row-Level Security (The Vault)
This is the ultimate failsafe to prevent panic.
We will utilize PostgreSQL's native **Row-Level Security (RLS)**.
* Even if there is a catastrophic bug in the Golang API middleware that accidentally lets a query through, the database itself enforces the rules.
* We configure a policy: `CREATE POLICY lab_results_insert ON lab_results FOR INSERT TO lab_techs;`
* If a non-lab-tech user's query hits the database, PostgreSQL physically rejects the `INSERT` at the disk level.

---

## 4. Why This Eliminates Developer Panic

1. **No External Dependencies:** We are not relying on a third-party API (like Auth0) going down or changing their pricing structure.
2. **Mathematically Proven:** We are relying on standard RSA/ECDSA cryptography (the same math that secures Bitcoin and HTTPS) instead of complex password-hashing algorithms that require network calls.
3. **Failsafe Authorization:** Because roles are enforced at the UI, the API, *and* the Database level, a vulnerability in one layer is caught by the next.
4. **Zero Lockouts:** As long as the local Golang server has power, staff can authenticate and work. The system is immune to network blackouts.

---
*Last Updated: 2026-08-11 | Chunk 4*
