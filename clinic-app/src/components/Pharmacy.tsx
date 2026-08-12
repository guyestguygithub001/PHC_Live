import React, { useState } from 'react';
import {
  Pill, Package, AlertTriangle, CheckCircle2,
  User, ShieldAlert, ArrowRight, ClipboardList,
  BarChart3, XCircle
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// Pharmacy.tsx — Drug Revolving Fund Module
//
// Handles prescription dispensing, inventory tracking, and
// clinical safety checks (e.g. malaria RDT requirement).
// Designed for offline-first PHC environments.
// ============================================================

interface PharmacyProps {
  language: 'EN' | 'HA';
  theme: 'light' | 'dark';
}

/** Shape of a single drug in the PHC inventory */
interface InventoryItem {
  id: string;
  name: string;
  nameHa: string;
  units: number;
}

/** Shape of a patient prescription awaiting dispensing */
interface PrescriptionItem {
  id: string;
  patientName: string;
  drug: string;        // must match an InventoryItem.name
  dosage: string;
  quantity: number;
  doctor: string;
  condition: string;   // e.g. 'Malaria', 'Infection', etc.
  hasLabResult: boolean; // simulates whether a lab result exists
}

export default function Pharmacy({ language, theme }: PharmacyProps) {
  // ------------------------------------------------------------------
  // Translations
  // ------------------------------------------------------------------
  const t = {
    EN: {
      title: 'Pharmacy & Inventory',
      subtitle: 'Drug Revolving Fund',
      queue: 'Prescription Queue',
      selectPatient: 'Select a patient from the queue to dispense',
      dispensingPanel: 'Dispensing Panel',
      prescriptionDetails: 'Prescription Details',
      drug: 'Drug',
      dosage: 'Dosage',
      quantity: 'Quantity',
      currentStock: 'Current Stock',
      dispense: 'Dispense',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
      stock: 'Stock',
      inventoryDashboard: 'Inventory Dashboard',
      units: 'units',
      prescribedBy: 'Prescribed by',
      patient: 'Patient',
      condition: 'Condition',
      noLabWarning:
        'WARNING: No Malaria RDT result found. Dispensing blocked per PHC protocol.',
      dispensed: 'Dispensed successfully!',
      receiptId: 'Receipt ID',
      stockAfter: 'Stock After',
      belowThreshold: 'Below minimum (20)',
    },
    HA: {
      title: 'Kantin Magani',
      subtitle: 'Asusun Magani Mai Juyawa',
      queue: 'Jerin Takardar Magani',
      selectPatient: 'Zaɓi mara lafiya don bayar da magani',
      dispensingPanel: 'Bangaren Bayar da Magani',
      prescriptionDetails: 'Bayanan Takardar Magani',
      drug: 'Magani',
      dosage: 'Yawan Sha',
      quantity: 'Adadi',
      currentStock: 'Adadin Kaya Yanzu',
      dispense: 'Bayar da Magani',
      outOfStock: 'Babu Kaya',
      lowStock: 'Kaya Na Ƙarewa',
      stock: 'Adadin Kaya',
      inventoryDashboard: 'Ma\'ajiyar Kaya',
      units: 'na\'ura',
      prescribedBy: 'Likitan da ya rubuta',
      patient: 'Mara Lafiya',
      condition: 'Cuta',
      noLabWarning:
        'GARGAƊI: Ba a sami sakamakon gwajin Malaria (RDT) ba. An hana bayar da magani bisa ka\'idar PHC.',
      dispensed: 'An bayar da magani cikin nasara!',
      receiptId: 'Lambar Rasiti',
      stockAfter: 'Sauran Kaya',
      belowThreshold: 'Ƙasa da mafi ƙarancin (20)',
    },
  };

  // ------------------------------------------------------------------
  // Inventory State — initial stock levels per PHC spec
  // ------------------------------------------------------------------
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'drug-1', name: 'Artemether/Lumefantrine', nameHa: 'Artemether/Lumefantrine', units: 45 },
    { id: 'drug-2', name: 'Amoxicillin 500mg', nameHa: 'Amoxicillin 500mg', units: 120 },
    { id: 'drug-3', name: 'Paracetamol 500mg', nameHa: 'Paracetamol 500mg', units: 200 },
    { id: 'drug-4', name: 'ORS Sachets', nameHa: 'Gishirin Ruwan Sha (ORS)', units: 80 },
    { id: 'drug-5', name: 'Metformin 500mg', nameHa: 'Metformin 500mg', units: 30 },
  ]);

  // ------------------------------------------------------------------
  // Prescription Queue — simulated patients waiting for drugs
  // ------------------------------------------------------------------
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-1',
      patientName: 'Aisha Mohammed',
      drug: 'Artemether/Lumefantrine',
      dosage: '4 tabs BD x 3 days',
      quantity: 24,
      doctor: 'Dr. Ibrahim',
      condition: 'Malaria',
      hasLabResult: true,
    },
    {
      id: 'rx-2',
      patientName: 'Usman Bello',
      drug: 'Amoxicillin 500mg',
      dosage: '1 tab TDS x 5 days',
      quantity: 15,
      doctor: 'Dr. Ibrahim',
      condition: 'Infection',
      hasLabResult: true,
    },
    {
      id: 'rx-3',
      patientName: 'Fatima Yusuf',
      drug: 'Artemether/Lumefantrine',
      dosage: '4 tabs BD x 3 days',
      quantity: 24,
      doctor: 'CHO Musa',
      condition: 'Malaria',
      hasLabResult: false, // No lab result — should block dispensing
    },
    {
      id: 'rx-4',
      patientName: 'Ibrahim Danjuma',
      drug: 'Metformin 500mg',
      dosage: '1 tab BD',
      quantity: 60,
      doctor: 'Dr. Ibrahim',
      condition: 'Diabetes',
      hasLabResult: true,
    },
    {
      id: 'rx-5',
      patientName: 'Hauwa Garba',
      drug: 'Paracetamol 500mg',
      dosage: '2 tabs TDS PRN',
      quantity: 18,
      doctor: 'CHO Musa',
      condition: 'Fever',
      hasLabResult: true,
    },
  ]);

  // Currently selected prescription from the queue
  const [selectedRx, setSelectedRx] = useState<string | null>(null);

  // ------------------------------------------------------------------
  // Derived values
  // ------------------------------------------------------------------
  const activeRx = prescriptions.find((rx) => rx.id === selectedRx) || null;
  const activeStock = activeRx
    ? inventory.find((inv) => inv.name === activeRx.drug)
    : null;

  /** Is the prescription for malaria but missing a lab result? */
  const isMalariaBlocked =
    activeRx?.condition === 'Malaria' && !activeRx?.hasLabResult;

  /** Is stock insufficient for this prescription? */
  const isOutOfStock =
    activeStock !== undefined && activeStock !== null && activeStock.units < activeRx!?.quantity;

  /** LOW_STOCK_THRESHOLD — show red warning below this */
  const LOW_STOCK_THRESHOLD = 20;

  // ------------------------------------------------------------------
  // Dispense handler — deducts stock and generates a UUID receipt
  // ------------------------------------------------------------------
  const handleDispense = () => {
    if (!activeRx || !activeStock) return;
    if (isMalariaBlocked) return;
    if (activeStock.units <= 0 || activeStock.units < activeRx.quantity) return;

    const receiptId = uuidv4();

    // Deduct from inventory
    setInventory((prev) =>
      prev.map((item) =>
        item.name === activeRx.drug
          ? { ...item, units: item.units - activeRx.quantity }
          : item
      )
    );

    // Remove from prescription queue
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== activeRx.id));

    // Show dispensing receipt alert
    const remainingStock = activeStock.units - activeRx.quantity;
    alert(
      `${t[language].dispensed}\n\n` +
      `${t[language].receiptId}: ${receiptId}\n` +
      `${t[language].patient}: ${activeRx.patientName}\n` +
      `${t[language].drug}: ${activeRx.drug}\n` +
      `${t[language].quantity}: ${activeRx.quantity}\n` +
      `${t[language].stockAfter}: ${remainingStock} ${t[language].units}`
    );

    // Clear selection
    setSelectedRx(null);
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="w-full h-full flex flex-col space-y-6">

      {/* ===== Header ===== */}
      <div
        className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center space-x-3">
          <Pill className="w-8 h-8 text-[var(--primary)]" />
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {t[language].title}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {t[language].subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] bg-[var(--input-bg)] px-4 py-2 rounded-md border border-[var(--border-default)]">
          <User className="w-5 h-5 text-[var(--primary)]" />
          <span>{language === 'EN' ? 'Pharmacist: Pharm. Halima' : 'Mai Magani: Pharm. Halima'}</span>
        </div>
      </div>

      {/* ===== Main Content — Queue + Dispensing Panel ===== */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

        {/* ----- Left: Prescription Queue ----- */}
        <div
          className="w-full lg:w-1/3 bg-[var(--queue-bg)] rounded-lg border border-[var(--border-default)] p-4 overflow-y-auto"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center space-x-2 mb-4 pl-2">
            <ClipboardList className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-[var(--text-secondary)] font-semibold">
              {t[language].queue}
            </h3>
            {/* Badge showing total pending */}
            <span className="ml-auto bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-2 py-0.5 rounded-full">
              {prescriptions.length}
            </span>
          </div>

          {prescriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
              <CheckCircle2 className="w-10 h-10 mb-2 text-[var(--primary)]" />
              <p className="text-sm">
                {language === 'EN' ? 'All prescriptions dispensed' : 'An bayar da duk magungunan'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {prescriptions.map((rx) => {
                const isSelected = selectedRx === rx.id;
                const drugStock = inventory.find((inv) => inv.name === rx.drug);
                const isLow = drugStock && drugStock.units < LOW_STOCK_THRESHOLD;
                const isEmpty = drugStock && drugStock.units <= 0;

                return (
                  <button
                    key={rx.id}
                    onClick={() => setSelectedRx(rx.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'bg-[var(--primary)]/8 border-[var(--primary)]/40'
                        : 'bg-[var(--queue-item-bg)] border-[var(--border-default)] hover:bg-[var(--queue-item-hover)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Patient name */}
                        <p className="font-semibold text-[var(--text-primary)] truncate">
                          {rx.patientName}
                        </p>
                        {/* Drug name */}
                        <p className="text-sm text-[var(--primary)] font-medium mt-0.5">
                          {rx.drug}
                        </p>
                        {/* Dosage + Doctor */}
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {rx.dosage} · {rx.doctor}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        {/* Malaria no-lab warning icon */}
                        {rx.condition === 'Malaria' && !rx.hasLabResult && (
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                        )}
                        {/* Stock warning badges */}
                        {isEmpty ? (
                          <span className="text-[10px] font-bold bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded">
                            {t[language].outOfStock}
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] font-bold bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded">
                            {t[language].lowStock}
                          </span>
                        ) : null}
                        <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ----- Right: Dispensing Panel + Inventory ----- */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">

          {/* Dispensing Panel */}
          <div
            className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-default)] p-4 flex-1"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            {!activeRx ? (
              /* No patient selected — placeholder */
              <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                <Pill className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm">{t[language].selectPatient}</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Panel header */}
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="w-6 h-6 text-[var(--primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {t[language].dispensingPanel}
                  </h3>
                </div>

                {/* ---- Malaria Lab Warning Banner ---- */}
                {isMalariaBlocked && (
                  <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                    <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-500 font-semibold leading-relaxed">
                      {t[language].noLabWarning}
                    </p>
                  </div>
                )}

                {/* Prescription Detail Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Patient */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].patient}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {activeRx.patientName}
                    </p>
                  </div>
                  {/* Condition */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].condition}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {activeRx.condition}
                    </p>
                  </div>
                  {/* Drug */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].drug}
                    </p>
                    <p className="font-semibold text-[var(--primary)]">
                      {activeRx.drug}
                    </p>
                  </div>
                  {/* Dosage */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].dosage}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {activeRx.dosage}
                    </p>
                  </div>
                  {/* Quantity */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].quantity}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {activeRx.quantity} {t[language].units}
                    </p>
                  </div>
                  {/* Prescribing Doctor */}
                  <div className="bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].prescribedBy}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {activeRx.doctor}
                    </p>
                  </div>
                </div>

                {/* Stock level indicator */}
                <div className="flex items-center justify-between bg-[var(--input-bg)] rounded-md p-4 border border-[var(--border-default)] mb-6">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t[language].currentStock}
                    </p>
                    <p className={`text-lg font-semibold ${
                      activeStock && activeStock.units <= 0
                        ? 'text-red-500'
                        : activeStock && activeStock.units < LOW_STOCK_THRESHOLD
                        ? 'text-orange-500'
                        : 'text-[var(--primary)]'
                    }`}>
                      {activeStock ? activeStock.units : 0} {t[language].units}
                    </p>
                  </div>
                  {activeStock && activeStock.units <= 0 && (
                    <div className="flex items-center space-x-2 bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">{t[language].outOfStock}</span>
                    </div>
                  )}
                  {activeStock && activeStock.units > 0 && activeStock.units < activeRx.quantity && (
                    <div className="flex items-center space-x-2 bg-orange-500/20 text-orange-500 px-3 py-1.5 rounded-lg">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm font-bold">
                        {language === 'EN' ? 'Insufficient stock' : 'Kaya bai isa ba'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dispense Button */}
                <div className="mt-auto">
                  <button
                    onClick={handleDispense}
                    disabled={
                      isMalariaBlocked ||
                      !activeStock ||
                      activeStock.units <= 0 ||
                      activeStock.units < activeRx.quantity
                    }
                    className={`w-full py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-3 ${
                      isMalariaBlocked || !activeStock || activeStock.units <= 0 || activeStock.units < activeRx.quantity
                        ? 'bg-red-500/20 text-red-500 cursor-not-allowed'
                        : 'bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]'
                    }`}
                  >
                    {isMalariaBlocked ? (
                      <>
                        <ShieldAlert className="w-6 h-6" />
                        <span>{language === 'EN' ? 'Blocked — Lab Required' : 'An hana — Ana buƙatar Gwaji'}</span>
                      </>
                    ) : !activeStock || activeStock.units <= 0 ? (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span>{t[language].outOfStock}</span>
                      </>
                    ) : activeStock.units < activeRx.quantity ? (
                      <>
                        <AlertTriangle className="w-6 h-6" />
                        <span>{language === 'EN' ? 'Insufficient Stock' : 'Kaya Bai Isa Ba'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>{t[language].dispense}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===== Inventory Dashboard ===== */}
          <div
            className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-default)] p-5"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-[var(--text-primary)] font-semibold">
                {t[language].inventoryDashboard}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {inventory.map((item) => {
                const isLow = item.units < LOW_STOCK_THRESHOLD;
                const isEmpty = item.units <= 0;

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-lg p-4 border transition-all ${
                      isEmpty
                        ? 'bg-red-500/10 border-red-500/30'
                        : isLow
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-[var(--input-bg)] border-[var(--border-default)]'
                    }`}
                  >
                    {/* Red warning badge for items below threshold */}
                    {isLow && (
                      <span className="absolute -top-2 -right-2 flex items-center space-x-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{t[language].lowStock}</span>
                      </span>
                    )}

                    {/* Drug name */}
                    <p className="text-xs text-[var(--text-muted)] font-medium truncate mb-2">
                      {language === 'HA' ? item.nameHa : item.name}
                    </p>

                    {/* Unit count */}
                    <p className={`text-lg font-semibold ${
                      isEmpty
                        ? 'text-red-500'
                        : isLow
                        ? 'text-orange-500'
                        : 'text-[var(--primary)]'
                    }`}>
                      {item.units}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].units}
                    </p>

                    {/* Stock level bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-[var(--border-default)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isEmpty
                            ? 'bg-red-500'
                            : isLow
                            ? 'bg-orange-500'
                            : 'bg-[var(--primary)]'
                        }`}
                        style={{
                          width: `${Math.min((item.units / 200) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
