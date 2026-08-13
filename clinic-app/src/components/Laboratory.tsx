import React, { useState, useEffect } from 'react';
import {
  FlaskConical, User, ClipboardList, 
  AlertTriangle, Send, FileText, Microscope, ExternalLink, MapPin, Phone, Printer, History, Pill
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// Laboratory Module — PHC Lab Technician Workspace
//
// Features:
// 1. Lab Request Queue (left panel) — patients awaiting tests
// 2. Result Entry Form (right panel) — dynamic per test type
// 3. Mandatory Testing Badge on Malaria tests
// 4. Full EN/HA translation support
// ============================================================

interface LaboratoryProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

// Supported test types and their possible result options
type TestType = 'Malaria RDT' | 'Widal Test' | 'Full Blood Count';

interface LabRequest {
  id: string;
  patientName: string;
  patientId: string;
  testType: TestType;
  orderedBy: string;
  orderedAt: string;
  priority: 'normal' | 'urgent';
}

// Full Blood Count numeric fields
interface FBCValues {
  wbc: string;
  rbc: string;
  hemoglobin: string;
  platelets: string;
}

// ---- Bilingual translations ----
const t = {
  EN: {
    title: 'Laboratory',
    queue: 'Lab Request Queue',
    selectPatient: 'Select a request from the queue to enter results',
    resultEntry: 'Test Result Entry',
    testResult: 'Test Result',
    submit: 'Submit Result',
    notes: 'Additional notes (optional)...',
    orderedBy: 'Ordered by',
    mandatoryBadge: 'Required before Pharmacy',
    positive: 'Positive',
    negative: 'Negative',
    invalid: 'Invalid',
    malaria: 'Malaria RDT',
    widal: 'Widal Test',
    fbc: 'Full Blood Count',
    wbc: 'WBC (×10⁹/L)',
    rbc: 'RBC (×10¹²/L)',
    hemoglobin: 'Hemoglobin (g/dL)',
    platelets: 'Platelets (×10⁹/L)',
    selectResult: 'Select a result...',
    successAlert: 'Result submitted successfully!',
    resultId: 'Result ID',
    technician: 'Lab Tech',
    // External Referral additions
    enterResults: 'Enter Results',
    externalReferral: 'External Referral',
    searchLab: 'Search lab name or address',
    viewTests: 'View tests this lab offers',
    generateSlip: 'Generate Slip',
    direction: 'Direction',
    call: 'Call',
    slipGenerated: 'Referral Slip Generated for External Lab!'
  },
  HA: {
    title: 'Dakin Gwaji',
    queue: 'Jerin Masu Jiran Gwaji',
    selectPatient: 'Zabi gwaji daga jerin don shigar da sakamako',
    resultEntry: 'Shigar da Sakamakon Gwaji',
    testResult: 'Sakamakon Gwaji',
    submit: 'Tura Sakamako',
    notes: 'Bayani na ƙari (na zaɓi)...',
    orderedBy: 'Wanda ya umarci',
    mandatoryBadge: 'Ana buƙata kafin Kantin Magani',
    positive: 'Akwai',
    negative: 'Babu',
    invalid: 'Ba shi da inganci',
    malaria: 'Zazzabin Cizon Sauro (RDT)',
    widal: 'Gwajin Widal',
    fbc: 'Ƙididdiga Cikakkiyar Jini',
    wbc: 'WBC (×10⁹/L)',
    rbc: 'RBC (×10¹²/L)',
    hemoglobin: 'Hemoglobin (g/dL)',
    platelets: 'Platelets (×10⁹/L)',
    selectResult: 'Zaɓi sakamako...',
    successAlert: 'An tura sakamako cikin nasara!',
    resultId: 'Lambar Sakamako',
    technician: 'Ɗan Gwaji',
    // External Referral additions
    enterResults: 'Shigar da Sakamako',
    externalReferral: 'Tura zuwa Wani Dakin Gwaji',
    searchLab: 'Nemo suna ko adireshin dakin gwaji',
    viewTests: 'Duba gwaje-gwajen da suke yi',
    generateSlip: 'Fitar da Takarda',
    direction: 'Hanya',
    call: 'Kira',
    slipGenerated: 'An fitar da takardar tura zuwa wani wuri!'
  },
  YO: {
    title: 'Yàrá Àyẹ̀wò',
    queue: 'Tò Lẹ́sẹẹsẹ fún Àyẹ̀wò',
    selectPatient: 'Yan aláìsàn láti inú àtòjọ láti fi èsì sínú',
    resultEntry: 'Ìwọlé Èsì Àyẹ̀wò',
    testResult: 'Èsì Àyẹ̀wò',
    submit: 'Firanṣẹ Èsì',
    notes: 'Àkọsílẹ̀ àfikún (tí ó bá wù ó)...',
    orderedBy: 'Ẹni tí ó pàṣẹ',
    mandatoryBadge: 'Kò gbọdọ̀ ṣàì ṣe kí a tó lọ sí ilé egbògi',
    positive: 'Ó wà',
    negative: 'Kò sí',
    invalid: 'Kò wúlò',
    malaria: 'Àyẹ̀wò Iba (RDT)',
    widal: 'Àyẹ̀wò Widal',
    fbc: 'Kíkà Ẹ̀jẹ̀ kíkún',
    wbc: 'WBC (×10⁹/L)',
    rbc: 'RBC (×10¹²/L)',
    hemoglobin: 'Hemoglobin (g/dL)',
    platelets: 'Platelets (×10⁹/L)',
    selectResult: 'Yan èsì...',
    successAlert: 'A ti fi èsì ránṣẹ́ láṣeyọrí!',
    resultId: 'Nọ́mbà Èsì',
    technician: 'Onímọ̀ Àyẹ̀wò',
    enterResults: 'Tẹ Èsì',
    externalReferral: 'Ríran Lọ Sí Ìta',
    searchLab: 'Wá orúkọ tàbí àdírẹ́sì yàrá àyẹ̀wò',
    viewTests: 'Wo àwọn àyẹ̀wò tí yàrá yìí ń ṣe',
    generateSlip: 'Ṣèdá Ìwé',
    direction: 'Ìtọ́sọ́nà',
    call: 'Pè',
    slipGenerated: 'A ti ṣèdá ìwé láti rán aláìsàn lọ sí ìta!'
  },
  IG: {
    title: 'Ụlọ Nyocha',
    queue: 'Ahịrị Nyocha',
    selectPatient: 'Họrọ onye ọrịa n\'ahịrị iji tinye nsonaazụ',
    resultEntry: 'Ntinye Nsonaazụ',
    testResult: 'Nsonaazụ Nyocha',
    submit: 'Nyefee Nsonaazụ',
    notes: 'Ihe ndetu mgbakwunye (nhọrọ)...',
    orderedBy: 'Onye nyere iwu',
    mandatoryBadge: 'A chọrọ tupu ụlọ ọgwụ',
    positive: 'Ọ dị',
    negative: 'Ọ dighi',
    invalid: 'A nabataghị',
    malaria: 'Nyocha Ịba (RDT)',
    widal: 'Nyocha Widal',
    fbc: 'Nchịkọta Ọbara',
    wbc: 'WBC (×10⁹/L)',
    rbc: 'RBC (×10¹²/L)',
    hemoglobin: 'Hemoglobin (g/dL)',
    platelets: 'Platelets (×10⁹/L)',
    selectResult: 'Họrọ nsonaazụ...',
    successAlert: 'Enyefeela nsonaazụ nke ọma!',
    resultId: 'ID Nsonaazụ',
    technician: 'Onye Nyocha',
    enterResults: 'Tinye Nsonaazụ',
    externalReferral: 'Ntụgharị Mpụga',
    searchLab: 'Chọọ aha ụlọ nyocha ma ọ bụ adreesị',
    viewTests: 'Lelee nyocha ụlọ nyocha a na-enye',
    generateSlip: 'Mepụta Akwụkwọ',
    direction: 'Ntụziaka',
    call: 'Kpọọ',
    slipGenerated: 'Emepụtara Akwụkwọ Ntụgharị maka Ụlọ Nyocha Mpụga!'
  },
  PI: {
    title: 'Lab',
    queue: 'Lab Queue',
    selectPatient: 'Select request from the queue to put result',
    resultEntry: 'Test Result Entry',
    testResult: 'Test Result',
    submit: 'Submit Result',
    notes: 'Extra notes (if you want)...',
    orderedBy: 'Who order am',
    mandatoryBadge: 'Must do before Pharmacy',
    positive: 'Positive',
    negative: 'Negative',
    invalid: 'Invalid',
    malaria: 'Malaria RDT',
    widal: 'Widal Test',
    fbc: 'Full Blood Count',
    wbc: 'WBC (×10⁹/L)',
    rbc: 'RBC (×10¹²/L)',
    hemoglobin: 'Hemoglobin (g/dL)',
    platelets: 'Platelets (×10⁹/L)',
    selectResult: 'Choose result...',
    successAlert: 'Result enter well well!',
    resultId: 'Result ID',
    technician: 'Lab Tech',
    enterResults: 'Put Results',
    externalReferral: 'Send go outside Lab',
    searchLab: 'Find lab name or address',
    viewTests: 'Check tests wey dis lab dey do',
    generateSlip: 'Print Paper',
    direction: 'Direction',
    call: 'Call',
    slipGenerated: 'Paper ready to send patient outside Lab!'
  }
};

// ---- Remove mockRequests to avoid confusion ----

// ---- Mock external labs ----
const mockExternalLabs = [
  {
    id: 'LAB-01',
    name: 'Treasuredhealth Diagnostics & Medical Laboratory Services Ltd',
    address: '5, Awoyemi street off NNPC Depot Rd, Coker bus-stop, Daleko/Ile-iwe Ejigbo, Oshodi-Isolo, Lagos, Nigeria',
    phone: '+234 800 000 0001'
  },
  {
    id: 'LAB-02',
    name: 'Lagos State Central Laboratory',
    address: 'No 10 Oshunpboye Street Ogba Cocoa Off Akilo Road, Agege, Lagos, Nigeria',
    phone: '+234 800 000 0002'
  }
];

export default function Laboratory({ language }: LaboratoryProps) {
  // Currently selected lab request
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Result form state
  const [qualitativeResult, setQualitativeResult] = useState('');
  const [fbcValues, setFbcValues] = useState<FBCValues>({
    wbc: '',
    rbc: '',
    hemoglobin: '',
    platelets: '',
  });
  const [notes, setNotes] = useState('');

  // External referral state
  const [activeTab, setActiveTab] = useState<'result' | 'external'>('result');
  const [labSearch, setLabSearch] = useState('');

  const [queue, setQueue] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/queues/lab');
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (patientId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/patients/${patientId}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const lang = t[language];
  const selectedRequest = queue.find((r) => r.id === selectedId) || null;

  useEffect(() => {
    if (selectedRequest) {
      fetchHistory(selectedRequest.patient_id || selectedRequest.PatientID);
    } else {
      setHistory([]);
    }
  }, [selectedRequest]);

  // ---- Reset form when switching patients ----
  const handleSelectRequest = (id: string) => {
    setSelectedId(id);
    setQualitativeResult('');
    setFbcValues({ wbc: '', rbc: '', hemoglobin: '', platelets: '' });
    setNotes('');
    setActiveTab('result'); // reset to default tab
  };

  // ---- Submit result with UUID ----
  const handleSubmit = async () => {
    if (!selectedRequest) return;

    const resultPayload = {
      result:
        selectedRequest.test_type === 'Full Blood Count'
          ? fbcValues
          : qualitativeResult,
      notes,
    };

    try {
      const res = await fetch(`http://localhost:3001/api/v1/labs/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultPayload)
      });

      if (res.ok) {
        alert(`${lang.successAlert}\n${selectedRequest.patient?.first_name || 'Patient'} — ${selectedRequest.test_type}`);
        // Reset after submission
        setSelectedId(null);
        setQualitativeResult('');
        setFbcValues({ wbc: '', rbc: '', hemoglobin: '', platelets: '' });
        setNotes('');
        fetchQueue();
      } else {
        alert("Failed to submit result");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit result");
    }
  };

  const handleGenerateSlip = (labName: string) => {
    if (!selectedRequest) return;
    const slipUUID = uuidv4();
    alert(`${lang.slipGenerated}\nLab: ${labName}\nSlip ID: ${slipUUID}\n${selectedRequest.patientName} — ${selectedRequest.testType}`);
    setSelectedId(null);
  };

  // ---- Determine if the submit button should be disabled ----
  const isSubmitDisabled = (): boolean => {
    if (!selectedRequest) return true;
    if (selectedRequest.test_type === 'Full Blood Count') {
      return !fbcValues.wbc || !fbcValues.rbc || !fbcValues.hemoglobin || !fbcValues.platelets;
    }
    return !qualitativeResult;
  };

  // ---- Render the correct result input based on test type ----
  const renderResultInput = (testType: TestType) => {
    switch (testType) {
      // Malaria RDT — simple dropdown with 3 options
      case 'Malaria RDT': {
        const options = [
          { value: 'Positive', label: lang.positive },
          { value: 'Negative', label: lang.negative },
          { value: 'Invalid', label: lang.invalid },
        ];
        return (
          <div>
            <label className="block text-[var(--text-secondary)] text-sm font-semibold mb-2">
              {lang.testResult}
            </label>
            <select
              value={qualitativeResult}
              onChange={(e) => setQualitativeResult(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition appearance-none cursor-pointer"
            >
              <option value="">{lang.selectResult}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Widal Test — dropdown with titre-based results
      case 'Widal Test': {
        const options = [
          { value: 'Positive (1:80)', label: `${lang.positive} (1:80)` },
          { value: 'Positive (1:160)', label: `${lang.positive} (1:160)` },
          { value: 'Positive (1:320)', label: `${lang.positive} (1:320)` },
          { value: 'Negative', label: lang.negative },
        ];
        return (
          <div>
            <label className="block text-[var(--text-secondary)] text-sm font-semibold mb-2">
              {lang.testResult}
            </label>
            <select
              value={qualitativeResult}
              onChange={(e) => setQualitativeResult(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition appearance-none cursor-pointer"
            >
              <option value="">{lang.selectResult}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Full Blood Count — numeric inputs for 4 parameters
      case 'Full Blood Count':
        return (
          <div className="space-y-3">
            <label className="block text-[var(--text-secondary)] text-sm font-semibold">
              {lang.testResult}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* WBC */}
              <div>
                <label className="text-[var(--text-muted)] text-xs mb-1 block">{lang.wbc}</label>
                <input
                  type="number"
                  step="0.1"
                  value={fbcValues.wbc}
                  onChange={(e) => setFbcValues({ ...fbcValues, wbc: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. 7.5"
                />
              </div>
              {/* RBC */}
              <div>
                <label className="text-[var(--text-muted)] text-xs mb-1 block">{lang.rbc}</label>
                <input
                  type="number"
                  step="0.01"
                  value={fbcValues.rbc}
                  onChange={(e) => setFbcValues({ ...fbcValues, rbc: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. 4.8"
                />
              </div>
              {/* Hemoglobin */}
              <div>
                <label className="text-[var(--text-muted)] text-xs mb-1 block">{lang.hemoglobin}</label>
                <input
                  type="number"
                  step="0.1"
                  value={fbcValues.hemoglobin}
                  onChange={(e) => setFbcValues({ ...fbcValues, hemoglobin: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. 13.5"
                />
              </div>
              {/* Platelets */}
              <div>
                <label className="text-[var(--text-muted)] text-xs mb-1 block">{lang.platelets}</label>
                <input
                  type="number"
                  step="1"
                  value={fbcValues.platelets}
                  onChange={(e) => setFbcValues({ ...fbcValues, platelets: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. 250"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ---- Translate test type name for display ----
  const getTestLabel = (testType: TestType): string => {
    if (language !== 'EN') {
      switch (testType) {
        case 'Malaria RDT':
          return lang.malaria;
        case 'Widal Test':
          return lang.widal;
        case 'Full Blood Count':
          return lang.fbc;
      }
    }
    return testType;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* ===== Header Bar ===== */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center space-x-3">
          <FlaskConical className="w-8 h-8 text-indigo-500" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{lang.title}</h2>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] bg-[var(--input-bg)] px-4 py-2 rounded-md border border-[var(--border-default)]">
          <User className="w-5 h-5 text-indigo-500" />
          <span>{lang.technician}: Yakubu Sani</span>
        </div>
      </div>

      {/* ===== Main Content: Queue + Result Entry ===== */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">

        {/* ---- Left Panel: Lab Request Queue ---- */}
        <div
          className="w-full md:w-1/3 bg-[var(--queue-bg)] rounded-lg border border-[var(--border-default)] p-4 overflow-y-auto"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h3 className="text-[var(--text-secondary)] font-semibold mb-4 pl-2 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5" />
            <span>{lang.queue}</span>
          </h3>

          <div className="space-y-2">
            {queue.map((req) => {
              const isSelected = selectedId === req.id;
              const isMalaria = req.test_type === 'Malaria RDT';
              const isUrgent = req.priority === 'urgent';
              const patientName = req.patient ? `${req.patient.first_name} ${req.patient.last_name}` : 'Unknown Patient';

              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectRequest(req.id)}
                  className={`p-4 rounded-md cursor-pointer transition border ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50'
                      : isUrgent
                      ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                      : 'bg-[var(--queue-item-bg)] border-transparent hover:bg-[var(--queue-item-hover)]'
                  }`}
                >
                  {/* Patient name + urgent pulse dot */}
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[var(--text-primary)] font-bold">{patientName}</p>
                    {isUrgent && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
                    )}
                  </div>

                  {/* Test type + mandatory malaria badge */}
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-[var(--text-secondary)] text-sm">{getTestLabel(req.test_type as TestType)}</p>
                    {isMalaria && (
                      <span className="inline-flex items-center space-x-1 bg-orange-500/15 border border-orange-500/30 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{lang.mandatoryBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Ordered by + time */}
                  <p className="text-[var(--text-muted)] text-xs">
                    {lang.orderedBy}: {req.ordered_by} • {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              );
            })}
            {queue.length === 0 && (
              <p className="text-[var(--text-muted)] text-sm text-center py-4">No lab requests</p>
            )}
          </div>
        </div>

        {/* ---- Right Panel: Result Entry or Empty State ---- */}
        {selectedRequest ? (
          <div
            className="w-full md:w-2/3 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-4 flex flex-col space-y-6 overflow-y-auto"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            {/* Patient header for selected request */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {selectedRequest.patient ? `${selectedRequest.patient.first_name} ${selectedRequest.patient.last_name}` : 'Unknown Patient'}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  ID: {selectedRequest.patient?.phc_id} • {getTestLabel(selectedRequest.test_type as TestType)}
                </p>
              </div>
              {/* Mandatory testing badge (header-level, malaria only) */}
              {selectedRequest.test_type === 'Malaria RDT' && (
                <div className="flex items-center space-x-1 bg-orange-500/15 border border-orange-500/30 text-orange-500 text-xs font-bold px-3 py-1.5 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang.mandatoryBadge}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
              {/* Historical Timeline */}
              <div className="w-full md:w-1/3 bg-[var(--timeline-bg)] border border-[var(--timeline-border)] rounded-lg p-4 overflow-y-auto shadow-inner relative text-slate-800 shrink-0">
                <h3 className="font-bold text-slate-600 mb-6 flex items-center space-x-2 border-b border-slate-200 pb-4">
                  <History className="w-5 h-5" />
                  <span>{language === 'HA' ? 'Tarihin Jiyya' : language === 'PI' ? 'Patient History' : 'Patient History'}</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {history.length === 0 ? (
                    <div className="text-sm text-slate-500 text-center py-4">No previous history found.</div>
                  ) : (
                    history.map((item, idx) => {
                      let Icon = FileText;
                      if (item.type === 'lab') Icon = FlaskConical;
                      if (item.type === 'dispensary') Icon = Pill;

                      return (
                        <div key={idx} className="relative flex items-center justify-between group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 z-10">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="w-[calc(100%-4rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-slate-700 text-sm">{item.title}</div>
                              <time className="text-xs font-medium text-[var(--primary)]">{new Date(item.date).toLocaleDateString()}</time>
                            </div>
                            <div className="text-sm text-slate-600">{item.description}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col h-full overflow-y-auto pr-2">
                {/* Sub-Tabs for Result Entry vs External Referral */}
                <div className="flex space-x-2 border-b border-[var(--border-default)] pb-4 mb-2">
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                      activeTab === 'result' ? 'bg-indigo-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--queue-item-hover)]'
                    }`}
                  >
                    <Microscope className="w-4 h-4" />
                    <span>{lang.enterResults}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('external')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                      activeTab === 'external' ? 'bg-orange-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--queue-item-hover)]'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{lang.externalReferral}</span>
                  </button>
                </div>

            {activeTab === 'result' ? (
              <>
                {/* Dynamic result input based on test type */}
                <div className="bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg p-5">
                  {renderResultInput(selectedRequest.test_type as TestType)}
                </div>

                {/* Notes field */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                    <label className="text-[var(--text-secondary)] text-sm font-semibold">
                      {language === 'HA' ? 'Bayani' : language === 'YO' ? 'Àkọsílẹ̀' : language === 'IG' ? 'Ihe ndetu' : 'Notes'}
                    </label>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang.notes}
                    className="w-full h-full min-h-[100px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled()}
                  className={`w-full font-bold py-2.5 rounded-md flex justify-center items-center space-x-2 transition shrink-0 ${
                    isSubmitDisabled()
                      ? 'bg-indigo-500/30 text-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>{lang.submit}</span>
                </button>
              </>
            ) : (
              /* External Referral UI */
              <div className="flex flex-col h-full space-y-4 overflow-y-auto">
                <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-1 flex items-center">
                  <div className="pl-3 text-[var(--text-muted)]">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={lang.searchLab}
                    value={labSearch}
                    onChange={(e) => setLabSearch(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-[var(--text-primary)] focus:outline-none text-sm"
                  />
                  <div className="pr-3 text-[var(--text-muted)]">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  {mockExternalLabs.filter(lab => lab.name.toLowerCase().includes(labSearch.toLowerCase())).map(lab => (
                    <div key={lab.id} className="bg-[var(--card-bg-secondary)] border border-[var(--border-default)] rounded-lg p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[var(--text-primary)] font-medium text-sm leading-tight pr-4">{lab.name}</h4>
                        <MapPin className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-1" />
                      </div>
                      
                      {/* Highlighted name area (like the purple highlight in screenshot) */}
                      <div className="bg-indigo-500/10 text-indigo-500 text-xs font-semibold px-3 py-1.5 rounded-md mb-3 inline-block">
                        {lab.name}
                      </div>

                      <p className="text-[var(--text-secondary)] text-sm mb-4 leading-snug">
                        {lab.address}
                      </p>

                      <button className="flex items-center space-x-1 text-[var(--text-primary)] font-semibold text-sm mb-4 hover:text-indigo-500 transition">
                        <span>{lang.viewTests}</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        <button 
                          onClick={() => handleGenerateSlip(lab.name)}
                          className="w-full bg-[#0a0a2a] hover:bg-[#1a1a3a] text-white font-semibold py-2.5 rounded-md flex justify-center items-center space-x-2 transition"
                        >
                          <Printer className="w-5 h-5" />
                          <span>{lang.generateSlip}</span>
                        </button>
                        
                        <div className="flex space-x-3">
                          <button className="w-1/2 bg-[#0a0a2a] hover:bg-[#1a1a3a] text-white font-semibold py-2.5 rounded-md flex justify-center items-center space-x-2 transition">
                            <Send className="w-4 h-4" />
                            <span>{lang.direction}</span>
                          </button>
                          <button className="w-1/2 border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--queue-item-hover)] font-semibold py-2.5 rounded-md flex justify-center items-center space-x-2 transition">
                            <Phone className="w-4 h-4" />
                            <span>{lang.call}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
            </div>
          </div>
        ) : (
          /* Empty state — no request selected */
          <div className="w-full md:w-2/3 bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
            <div className="text-center">
              <FlaskConical className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{lang.selectPatient}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
