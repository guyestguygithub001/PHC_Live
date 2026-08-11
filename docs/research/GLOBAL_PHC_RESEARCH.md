# 🌍 Global PHC Research — Cross-Country Analysis

> **Research Date:** 2026-08-11  
> **Countries Surveyed:** Kenya, Ethiopia, Sierra Leone, Malawi, DRC, Haiti, India  
> **Data Focus:** 2024–2026 (most recent available)  
> **Purpose:** Extract universal patterns, failures, and proven solutions to inform PHC_Live architecture

---

## Executive Summary

We surveyed 7 countries across 4 continents representing the full spectrum of PHC challenges. The findings are remarkably consistent: the same problems appear everywhere, and the same solutions keep working.

---

## Cross-Country Comparison Matrix

### Infrastructure Scale

| Country | Primary Facilities | CHW Workforce | Population | Rural Electrification |
|---|---|---|---|---|
| Kenya | ~5,600 (L2/L3) | 107,000 CHPs | 56M | Low in ASAL counties |
| Ethiopia | ~21,300 (HP+HC) | ~40,000 HEWs | 126M | <40% rural |
| Sierra Leone | ~1,350 PHUs | ~15,000 CHWs | 8.6M | Very low rural |
| Malawi | ~1,100 facilities | HSAs (1:1,500 pop) | 20.8M | Severe blackouts (10-18hr/day) |
| DRC | ~18,500 (CS+PS) | RECOs (voluntary) | 102M | <1-5% rural |
| Haiti | ~1,000 (40% closed) | ASCPs | 11.7M | Grid collapsed nationally |
| India | ~208,000 (SC+PHC+CHC) | 1.05M ASHAs | 1.44B | Varies by state |
| Nigeria | ~30,000 PHCs | CHEWs/CHOs | 223M | Frequent blackouts |

### Record-Keeping Reality

| Country | Patient ID Method | Records System | Digital EMR Penetration |
|---|---|---|---|
| Kenya | Facility card / IDs emerging | Paper + KenyaEMR (2,300 sites) | ~15% of facilities |
| Ethiopia | Paper Family Folders | eCHIS tablets (25,000 HEWs) + DHIS2 | ~35% of health posts |
| Sierra Leone | Paper registers | 100% paper at PHU level | 0% at primary level |
| Malawi | Health Passport (patient-held) | Paper + Baobab/OpenMRS (100 sites) | ~9% of facilities |
| DRC | Paper patient charts | 100% paper at facility level | 0% at primary level |
| Haiti | Paper registers | iSantePlus/OpenMRS (100+ sites) | ~10% of facilities |
| India | ABHA ID (948M created) | Paper + state apps | <5% true EMR use |
| Nigeria | Hand card + paper folder | 100% paper | 0% at PHC level |

### Referral System Status

| Country | Referral Method | Digital Tracking | Counter-Referral Rate |
|---|---|---|---|
| Kenya | Paper slip, PCN Hub model | M-Mama (maternal transport) | Low |
| Ethiopia | Paper referral slip | DINKNESH app (pilot) | <15-20% |
| Sierra Leone | Paper slip + NEMS ambulance | Phone dispatch (117 hotline) | Low |
| Malawi | Paper slip, patient carries | None electronic | Very low |
| DRC | Paper fiche de reference | None | <10% |
| Haiti | Paper slip | None (ambulances hijacked) | Near zero |
| India | Paper + eSanjeevani tele-referral | QR scan at hospitals (partial) | Nascent |
| Nigeria | Written note | None | Zero |

### Maternal Health Indicators

| Country | MMR (per 100k) | Facility Birth Rate | ANC 4+ Coverage |
|---|---|---|---|
| Kenya | 355 | 89% | 66% |
| Ethiopia | 141 | 62% | 54% |
| Sierra Leone | 184-354 | 80-84% | 78-85% |
| Malawi | 224 | 97% | Moderate |
| DRC | 427-547 | 85% (varies) | 45-50% |
| Haiti | 328-480 | <38% | 40-45% |
| India | 88 | 89% | High |
| Nigeria | ~512 | ~39% | ~57% |

---

## Universal Failures (Every Country Has These)

1. **Paper-Based Patient Identity = Lost Patients** - patients lose cards, duplicates created
2. **Referrals Are Black Holes** - counter-referral feedback loops broken everywhere (<20%)
3. **Dual Documentation Burden Kills Productivity** - 30-40% time on duplicated paperwork
4. **Electricity Is Not Guaranteed** - DRC <1%, Malawi 18hr blackouts, Haiti grid collapsed
5. **Internet Connectivity Is Unreliable** - even in Kenya/India, rural facilities lose connectivity
6. **Vertical App Silos Cause Chaos** - India's fragmented apps, Sierra Leone's failed SMS pilots
7. **Data Stays Siloed at Facility Level** - birth data, referrals, records never flow upward

---

## Universal Successes (Proven Solutions)

1. **Offline-First Architecture Works** - Ethiopia eCHIS, Haiti iSantePlus, Malawi iCHIS
2. **Community Health Workers Are the Backbone** - India 1.05M ASHAs, Kenya 107K CHPs
3. **Simple, Guided Interfaces Win** - Malawi Baobab touchscreen (<3min entries)
4. **SMS/USSD Works When Smartphones Don't** - Malawi cStock (>85% compliance)
5. **Solar Power + Digital = Sustainability** - Haiti Mirebalais, Sierra Leone hospitals
6. **Open-Source Prevents Vendor Lock-in** - DHIS2 + OpenMRS global standard
7. **Emergency Transport Innovation Saves Lives** - Kenya M-Mama, Sierra Leone NEMS

---

## Architecture Requirements for PHC_Live

| # | Requirement | Evidence |
|---|---|---|
| AR-01 | 100% offline-first | All 7 countries; DRC has zero rural internet |
| AR-02 | Local-first data storage with async sync | Ethiopia, Haiti, Malawi |
| AR-03 | Conflict resolution for multi-device sync | Ethiopia (weeks offline), DRC (USB data mules) |
| AR-04 | Unique digital patient ID replacing paper | Every country has paper ID failures |
| AR-05 | Single unified app (no vertical silos) | India's app fragmentation failure |
| AR-06 | Digital referral with bi-directional tracking | Counter-referral failure in all 7 countries |
| AR-07 | Minimal data entry (dropdowns, guided workflows) | Malawi Baobab success |
| AR-08 | Role-based access control spanning facility types | Kenya PCN model |
| AR-09 | Works on low-spec Android devices | Kenya/India device failures |
| AR-10 | Solar-friendly power profile | DRC <1% electrification |
| AR-11 | SMS/USSD fallback for critical alerts | Malawi cStock; DRC mHero |
| AR-12 | Automatic upward data aggregation to DHIS2 | Every country uses DHIS2 |
| AR-13 | Built on open-source stack | DHIS2 + OpenMRS dominance |
| AR-14 | Multi-language support | Ethiopia (5+), DRC (200+), India (22) |
| AR-15 | Progressive digitization (coexist with paper) | Dual-burden in Ethiopia, India, Kenya |

---

## The 12 Universal Truths

1. Power will fail. Design for zero electricity.
2. Internet will disappear. Design for weeks offline.
3. Paper IDs will be lost. Replace with digital + biometric.
4. Referrals will be ignored. Build automated tracking.
5. Health workers will resist dual entry. Eliminate paper or auto-generate from digital.
6. Devices will be low-spec. Optimize for 1GB RAM Android.
7. Data must flow upward. Auto-aggregate for DHIS2/HMIS.
8. One app beats many apps. Unified platform.
9. Community health workers are the last mile. Design for them first.
10. Open-source wins. Build DHIS2/OpenMRS compatible.
11. Simple interfaces beat complex ones. Guided workflows.
12. Solar is the only reliable power. Minimize energy consumption.

---

*Last Updated: 2026-08-11 | Chunk 1 Research Phase*
*Individual country reports available in docs/research/*
