import React, { useState, useEffect } from 'react';
import { Baby, Activity, Calendar, HeartPulse, FileText, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Patient {
  id: string;
  name: string;
  age: number;
  gestationalAge: string; // e.g., '24 weeks'
  status: 'waiting' | 'in-progress' | 'completed';
}

interface AntenatalCareProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

// Translations dictionary
const translations = {
  EN: {
    title: 'Antenatal Care & Delivery',
    ancQueue: 'ANC Queue',
    ancVisit: 'ANC Visit',
    deliveryRegister: 'Delivery Register',
    immunization: 'Immunization',
    postnatal: 'Postnatal Care',
    waiting: 'Waiting',
    inProgress: 'In Progress',
    completed: 'Completed',
    selectPatient: 'Select a patient from the queue to view details',
    recordVisit: 'Record Visit',
    vitals: 'Vitals',
    weight: 'Weight (kg)',
    bloodPressure: 'Blood Pressure (mmHg)',
    foetalTracking: 'Foetal Tracking',
    fhr: 'Foetal Heart Rate (bpm)',
    presentation: 'Presentation / Position',
    scanNotes: 'Scan Notes',
    submitDelivery: 'Submit Delivery Record',
    liveBirth: 'Live Birth',
    yes: 'Yes',
    no: 'No',
    stillbirthType: 'Stillbirth Type',
    macerated: 'Macerated',
    fresh: 'Fresh',
    apgarScore: 'APGAR Score (0-10)',
    birthWeight: 'Birth Weight (kg)',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    successAnc: 'ANC Visit recorded successfully',
    successDelivery: 'Delivery recorded with ID:',
    gestationalAge: 'Gestational Age',
    vaccine: 'Vaccine Type',
    dose: 'Dose Number',
    batch: 'Batch Number',
    nextAppt: 'Next Appointment Date',
    recordImmunization: 'Record Immunization',
    successImmunization: 'Immunization recorded successfully',
    motherAssessment: 'Mother Assessment',
    newbornAssessment: 'Newborn Assessment',
    complications: 'Complications (if any)',
    recordPostnatal: 'Record Postnatal Care',
    successPostnatal: 'Postnatal care recorded successfully',
  },
  HA: {
    title: 'Awo & Haihuwa (ANC & Delivery)',
    ancQueue: 'Jerin Masu Jiran Awo',
    ancVisit: 'Awo (ANC Visit)',
    deliveryRegister: 'Rijistar Haihuwa',
    immunization: 'Allurar Riga-kafi',
    postnatal: 'Duba Mai Jego',
    waiting: 'Suna Jiran',
    inProgress: 'Ana Dubawa',
    completed: 'An Kammala',
    selectPatient: 'Zabi mara lafiya daga jerin domin ganin bayanai',
    recordVisit: 'Yi Rikodin Awo',
    vitals: 'Auna Jiki',
    weight: 'Nauyi (kg)',
    bloodPressure: 'Hawan Jini (mmHg)',
    foetalTracking: 'Ganin Jariri',
    fhr: 'Bugun Zuciyar Jariri (bpm)',
    presentation: 'Yadda Jariri Yake',
    scanNotes: 'Karin Bayani',
    submitDelivery: 'Tura Bayanin Haihuwa',
    liveBirth: 'Rayayye (Live Birth)',
    yes: 'Eh',
    no: 'A\'a',
    stillbirthType: 'Nau\'in Mutuwar Ciki',
    macerated: 'Macerated',
    fresh: 'Fresh',
    apgarScore: 'Makin APGAR (0-10)',
    birthWeight: 'Nauyin Jariri (kg)',
    gender: 'Jinsi',
    male: 'Namiji',
    female: 'Mace',
    successAnc: 'An yi rikodin Awo cikin nasara',
    successDelivery: 'An yi rikodin Haihuwa mai Lamba:',
    gestationalAge: 'Adadin Makonnin Ciki',
    vaccine: 'Irin Allurar',
    dose: 'Adadin Allura (Dose)',
    batch: 'Lambar Kundi (Batch)',
    nextAppt: 'Rana Ta Gaba',
    recordImmunization: 'Yi Rikodin Allura',
    successImmunization: 'An yi rikodin Allura cikin nasara',
    motherAssessment: 'Yadda Uwa Take',
    newbornAssessment: 'Yadda Jariri Yake',
    complications: 'Matsaloli (Idan Akwai)',
    recordPostnatal: 'Yi Rikodin Mai Jego',
    successPostnatal: 'An yi rikodin Mai Jego cikin nasara',
  },
  YO: {
    title: 'Itọju Aboyun & Ibimọ',
    ancQueue: 'Laini ANC',
    ancVisit: 'Ibẹwo ANC',
    deliveryRegister: 'Iwe Ibimọ',
    immunization: 'Ajesara',
    postnatal: 'Itọju Lẹhin Ibimọ',
    waiting: 'Nduro',
    inProgress: 'Nlo lọwọ',
    completed: 'Ti pari',
    selectPatient: 'Yan alaisan lati inu laini lati wo awọn alaye',
    recordVisit: 'Ṣe igbasilẹ ibẹwo',
    vitals: 'Awọn ami ara',
    weight: 'Iwọn (kg)',
    bloodPressure: 'Iwọn Ẹjẹ (mmHg)',
    foetalTracking: 'Titọpa Ọmọ inu oyun',
    fhr: 'Oṣuwọn Ọkan Ọmọ (bpm)',
    presentation: 'Ipo Ọmọ',
    scanNotes: 'Awọn akọsilẹ ọlọjẹ',
    submitDelivery: 'Fi igbasilẹ ibimọ silẹ',
    liveBirth: 'Ọmọ alaaye',
    yes: 'Bẹẹni',
    no: 'Rara',
    stillbirthType: 'Iru Ibimọ Oku',
    macerated: 'Macerated',
    fresh: 'Titun',
    apgarScore: 'APGAR (0-10)',
    birthWeight: 'Iwọn ibimọ (kg)',
    gender: 'Akọ-abo',
    male: 'Ọkunrin',
    female: 'Obinrin',
    successAnc: 'Ibẹwo ANC gbasilẹ ni aṣeyọri',
    successDelivery: 'Ibimọ gbasilẹ pẹlu ID:',
    gestationalAge: 'Ọjọ ori Oyun',
    vaccine: 'Iru Ajesara',
    dose: 'Nọmba Dozi',
    batch: 'Nọmba Baaji',
    nextAppt: 'Ọjọ Ipade ti nbọ',
    recordImmunization: 'Ṣe igbasilẹ Ajesara',
    successImmunization: 'Ajesara gbasilẹ ni aṣeyọri',
    motherAssessment: 'Igbelewọn Iya',
    newbornAssessment: 'Igbelewọn Ọmọ Tuntun',
    complications: 'Awọn ilolu (ti o ba wa)',
    recordPostnatal: 'Ṣe igbasilẹ Itọju Lẹhin Ibimọ',
    successPostnatal: 'Itọju Lẹhin Ibimọ gbasilẹ ni aṣeyọri',
  },
  IG: {
    title: 'Nlekọta Afọ Ime na Ọmụmụ',
    ancQueue: 'Ahịrị ANC',
    ancVisit: 'Nleta ANC',
    deliveryRegister: 'Akwụkwọ Ọmụmụ',
    immunization: 'Ọgwụ Mgbochi',
    postnatal: 'Nlekọta Mgbe Ọmụmụ gasịrị',
    waiting: 'Na-eche',
    inProgress: 'Na-aga n\'ihu',
    completed: 'Emechara',
    selectPatient: 'Họrọ onye ọrịa n\'ahịrị iji hụ nkọwa',
    recordVisit: 'Dekọọ Nleta',
    vitals: 'Ihe Ndị Dị Mkpa',
    weight: 'Arọ (kg)',
    bloodPressure: 'Ọbara Mgbali (mmHg)',
    foetalTracking: 'Nsochi Nwa ebu n\'afọ',
    fhr: 'Ọnụego Obi Nwa ebu n\'afọ (bpm)',
    presentation: 'Ngosi / Ọnọdụ',
    scanNotes: 'Ihe edeturu nyocha',
    submitDelivery: 'Tọhapụ Ndekọ Ọmụmụ',
    liveBirth: 'Ọmụmụ Dị Ndụ',
    yes: 'Ee',
    no: 'Mba',
    stillbirthType: 'Ụdị Ọmụmụ Nwụrụ Anwụ',
    macerated: 'Macerated',
    fresh: 'Ọhụrụ',
    apgarScore: 'Akara APGAR (0-10)',
    birthWeight: 'Arọ Ọmụmụ (kg)',
    gender: 'Okike',
    male: 'Nwoke',
    female: 'Nwanyị',
    successAnc: 'Ndekọ nleta ANC gara nke ọma',
    successDelivery: 'Edere ọmụmụ na ID:',
    gestationalAge: 'Afọ Ime',
    vaccine: 'Ụdị Ọgwụ Mgbochi',
    dose: 'Ọnụọgụ Dose',
    batch: 'Nọmba Batch',
    nextAppt: 'Ụbọchị Nhọpụta Ọzọ',
    recordImmunization: 'Dekọọ Ọgwụ Mgbochi',
    successImmunization: 'Ndekọ Ọgwụ mgbochi gara nke ọma',
    motherAssessment: 'Nyocha Nne',
    newbornAssessment: 'Nyocha Nwa Ọhụrụ',
    complications: 'Nsogbu (ma ọ bụrụ na ọ dị)',
    recordPostnatal: 'Dekọọ Nlekọta Mgbe Ọmụmụ gasịrị',
    successPostnatal: 'Ndekọ nlekọta mgbe ọmụmụ gasịrị gara nke ọma',
  },
  PI: {
    title: 'Antenatal Care & Delivery',
    ancQueue: 'ANC Line',
    ancVisit: 'ANC Visit',
    deliveryRegister: 'Delivery Register',
    immunization: 'Immunization',
    postnatal: 'Postnatal Care',
    waiting: 'Waiting',
    inProgress: 'E dey go',
    completed: 'E don finish',
    selectPatient: 'Select patient from line to see details',
    recordVisit: 'Record Visit',
    vitals: 'Body Check',
    weight: 'Weight (kg)',
    bloodPressure: 'Blood Pressure (mmHg)',
    foetalTracking: 'Pikin Tracking',
    fhr: 'Pikin Heart Rate (bpm)',
    presentation: 'Position',
    scanNotes: 'Scan Notes',
    submitDelivery: 'Submit Delivery Record',
    liveBirth: 'Pikin wey dey alive',
    yes: 'Yes',
    no: 'No',
    stillbirthType: 'Stillbirth Type',
    macerated: 'Macerated',
    fresh: 'Fresh',
    apgarScore: 'APGAR Score (0-10)',
    birthWeight: 'Birth Weight (kg)',
    gender: 'Boy abi Girl',
    male: 'Boy',
    female: 'Girl',
    successAnc: 'ANC Visit record well',
    successDelivery: 'Delivery record well with ID:',
    gestationalAge: 'Pregnancy Age',
    vaccine: 'Vaccine Type',
    dose: 'Dose Number',
    batch: 'Batch Number',
    nextAppt: 'Next Appointment Date',
    recordImmunization: 'Record Immunization',
    successImmunization: 'Immunization record well',
    motherAssessment: 'Mother Assessment',
    newbornAssessment: 'Newborn Assessment',
    complications: 'Wahala (if any)',
    recordPostnatal: 'Record Postnatal Care',
    successPostnatal: 'Postnatal care record well',
  }
};

// Mock data to be replaced with API fetch later
const mockQueue: Patient[] = [
  { id: '1', name: 'Amina Yusuf', age: 26, gestationalAge: '32 weeks', status: 'waiting' },
  { id: '2', name: 'Fatima Ali', age: 30, gestationalAge: '38 weeks', status: 'in-progress' },
  { id: '3', name: 'Zainab Umar', age: 22, gestationalAge: '14 weeks', status: 'waiting' },
  { id: '4', name: 'Hauwa Musa', age: 28, gestationalAge: '40 weeks', status: 'waiting' },
];

export default function AntenatalCare({ language, theme }: AntenatalCareProps) {
  const t = translations[language];
  
  const [queue, setQueue] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'anc' | 'delivery' | 'immunization' | 'postnatal'>('anc');
  
  // Clean component state for forms
  const [ancForm, setAncForm] = useState({ weight: '', bpSys: '', bpDia: '', fhr: '', presentation: '', notes: '' });
  const [deliveryForm, setDeliveryForm] = useState({ liveBirth: 'Yes', stillbirthType: '', apgar: '', birthWeight: '', gender: 'Male' });
  const [immunizationForm, setImmunizationForm] = useState({ vaccine: '', dose: '', batch: '', nextAppt: '' });
  const [postnatalForm, setPostnatalForm] = useState({ motherAssessment: '', newbornAssessment: '', complications: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data - easily swappable for real data fetching later
  useEffect(() => {
    setQueue(mockQueue);
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('anc'); // Reset to default tab
    // Reset forms when switching patient
    setAncForm({ weight: '', bpSys: '', bpDia: '', fhr: '', presentation: '', notes: '' });
    setDeliveryForm({ liveBirth: 'Yes', stillbirthType: '', apgar: '', birthWeight: '', gender: 'Male' });
    setImmunizationForm({ vaccine: '', dose: '', batch: '', nextAppt: '' });
    setPostnatalForm({ motherAssessment: '', newbornAssessment: '', complications: '' });
    setToastMessage(null);
  };

  const handleAncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual save to DB/API
    console.log('Submitting ANC Visit:', ancForm, 'for Patient:', selectedPatient?.id);
    
    setToastMessage(t.successAnc);
    setTimeout(() => setToastMessage(null), 3000);
    setAncForm({ weight: '', bpSys: '', bpDia: '', fhr: '', presentation: '', notes: '' });
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordId = uuidv4();
    
    // TODO: Replace with actual save to DB/API
    console.log('Submitting Delivery:', deliveryForm, 'Record ID:', recordId, 'for Patient:', selectedPatient?.id);
    
    setToastMessage(`${t.successDelivery} ${recordId.split('-')[0]}`);
    setTimeout(() => setToastMessage(null), 4000);
    setDeliveryForm({ liveBirth: 'Yes', stillbirthType: '', apgar: '', birthWeight: '', gender: 'Male' });
  };

  const handleImmunizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Immunization:', immunizationForm);
    setToastMessage(t.successImmunization);
    setTimeout(() => setToastMessage(null), 3000);
    setImmunizationForm({ vaccine: '', dose: '', batch: '', nextAppt: '' });
  };

  const handlePostnatalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Postnatal:', postnatalForm);
    setToastMessage(t.successPostnatal);
    setTimeout(() => setToastMessage(null), 3000);
    setPostnatalForm({ motherAssessment: '', newbornAssessment: '', complications: '' });
  };

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'waiting': return 'text-orange-500 bg-orange-500/10';
      case 'in-progress': return 'text-indigo-500 bg-indigo-500/10';
      case 'completed': return 'text-[var(--primary)] bg-[var(--primary)]/5';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ color: 'var(--text-primary)' }}>
      {/* Header Area */}
      <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)' }}>
        <Baby className="w-6 h-6 text-[var(--primary)]" />
        <h1 className="text-lg font-semibold">{t.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Panel: ANC Queue */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r overflow-y-auto" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--queue-bg)' }}>
          <div className="p-4 border-b sticky top-0 z-10" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--queue-bg)' }}>
            <h2 className="font-semibold">{t.ancQueue}</h2>
          </div>
          <div className="p-2 space-y-2">
            {queue.map(patient => (
              <button
                key={patient.id}
                onClick={() => handlePatientSelect(patient)}
                className="w-full text-left p-3 rounded-lg border transition-all duration-200"
                style={{ 
                  backgroundColor: selectedPatient?.id === patient.id ? 'var(--queue-item-hover)' : 'var(--queue-item-bg)',
                  borderColor: selectedPatient?.id === patient.id ? 'var(--border-default)' : 'transparent',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{patient.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                    {t[patient.status === 'in-progress' ? 'inProgress' : patient.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{patient.age} yrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Baby className="w-3 h-3" />
                    <span>{patient.gestationalAge}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Main Content View */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
          {selectedPatient ? (
            <>
              {/* Patient Info Header & Tabs */}
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      ID: {selectedPatient.id} • {selectedPatient.age} yrs • {t.gestationalAge}: {selectedPatient.gestationalAge}
                    </p>
                  </div>
                </div>

                {/* Module Tabs (ANC, Delivery, Immunization, Postnatal) */}
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <button
                    onClick={() => setActiveTab('anc')}
                    className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'anc' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent hover:border-gray-300'}`}
                    style={{ color: activeTab === 'anc' ? undefined : 'var(--text-secondary)' }}
                  >
                    {t.ancVisit}
                  </button>
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'delivery' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent hover:border-gray-300'}`}
                    style={{ color: activeTab === 'delivery' ? undefined : 'var(--text-secondary)' }}
                  >
                    {t.deliveryRegister}
                  </button>
                  <button
                    onClick={() => setActiveTab('immunization')}
                    className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'immunization' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent hover:border-gray-300'}`}
                    style={{ color: activeTab === 'immunization' ? undefined : 'var(--text-secondary)' }}
                  >
                    {t.immunization}
                  </button>
                  <button
                    onClick={() => setActiveTab('postnatal')}
                    className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'postnatal' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent hover:border-gray-300'}`}
                    style={{ color: activeTab === 'postnatal' ? undefined : 'var(--text-secondary)' }}
                  >
                    {t.postnatal}
                  </button>
                </div>
              </div>

              {/* Tab Form Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {toastMessage && (
                  <div className="mb-6 p-4 bg-[var(--primary)]/5 text-[var(--primary)] rounded-lg flex items-center gap-2 border border-[var(--primary)]/20">
                    <CheckCircle className="w-5 h-5" />
                    {toastMessage}
                  </div>
                )}

                {/* ANC Visit Tab */}
                {activeTab === 'anc' && (
                  <form onSubmit={handleAncSubmit} className="space-y-6 max-w-2xl">
                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--primary)]" />
                        {t.vitals}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t.weight}</label>
                          <input 
                            type="number" step="0.1" required
                            value={ancForm.weight} onChange={e => setAncForm({...ancForm, weight: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t.bloodPressure}</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" placeholder="Sys" required
                              value={ancForm.bpSys} onChange={e => setAncForm({...ancForm, bpSys: e.target.value})}
                              className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                            />
                            <span style={{ color: 'var(--text-secondary)' }}>/</span>
                            <input 
                              type="number" placeholder="Dia" required
                              value={ancForm.bpDia} onChange={e => setAncForm({...ancForm, bpDia: e.target.value})}
                              className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-[var(--primary)]" />
                        {t.foetalTracking}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t.fhr}</label>
                          <input 
                            type="number"
                            value={ancForm.fhr} onChange={e => setAncForm({...ancForm, fhr: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t.presentation}</label>
                          <input 
                            type="text" placeholder="e.g. Cephalic"
                            value={ancForm.presentation} onChange={e => setAncForm({...ancForm, presentation: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{t.scanNotes}</label>
                        <textarea 
                          rows={3}
                          value={ancForm.notes} onChange={e => setAncForm({...ancForm, notes: e.target.value})}
                          className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none resize-none"
                          style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-md transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <FileText className="w-5 h-5" />
                      {t.recordVisit}
                    </button>
                  </form>
                )}

                {/* Delivery Register Tab */}
                {activeTab === 'delivery' && (
                  <form onSubmit={handleDeliverySubmit} className="space-y-6 max-w-2xl">
                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.liveBirth}</label>
                          <select 
                            value={deliveryForm.liveBirth} 
                            onChange={e => setDeliveryForm({...deliveryForm, liveBirth: e.target.value, stillbirthType: e.target.value === 'Yes' ? '' : deliveryForm.stillbirthType})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          >
                            <option value="Yes">{t.yes}</option>
                            <option value="No">{t.no}</option>
                          </select>
                        </div>

                        {deliveryForm.liveBirth === 'No' && (
                          <div>
                            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.stillbirthType}</label>
                            <select 
                              required
                              value={deliveryForm.stillbirthType} onChange={e => setDeliveryForm({...deliveryForm, stillbirthType: e.target.value})}
                              className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                            >
                              <option value="">-- Select --</option>
                              <option value="Macerated">{t.macerated}</option>
                              <option value="Fresh">{t.fresh}</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.apgarScore}</label>
                          <input 
                            type="number" min="0" max="10" required
                            value={deliveryForm.apgar} onChange={e => setDeliveryForm({...deliveryForm, apgar: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.birthWeight}</label>
                          <input 
                            type="number" step="0.1" required
                            value={deliveryForm.birthWeight} onChange={e => setDeliveryForm({...deliveryForm, birthWeight: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.gender}</label>
                          <select 
                            value={deliveryForm.gender} onChange={e => setDeliveryForm({...deliveryForm, gender: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          >
                            <option value="Male">{t.male}</option>
                            <option value="Female">{t.female}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-md transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <Baby className="w-5 h-5" />
                      {t.submitDelivery}
                    </button>
                  </form>
                )}

                {/* Immunization Tab */}
                {activeTab === 'immunization' && (
                  <form onSubmit={handleImmunizationSubmit} className="space-y-6 max-w-2xl">
                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.vaccine}</label>
                          <select 
                            required
                            value={immunizationForm.vaccine} onChange={e => setImmunizationForm({...immunizationForm, vaccine: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          >
                            <option value="">-- Select --</option>
                            <option value="OPV">OPV (Polio)</option>
                            <option value="BCG">BCG (TB)</option>
                            <option value="Hepatitis B">Hepatitis B</option>
                            <option value="Pentavalent">Pentavalent</option>
                            <option value="Yellow Fever">Yellow Fever</option>
                            <option value="Measles">Measles</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.dose}</label>
                          <input 
                            type="number" required placeholder="e.g. 1"
                            value={immunizationForm.dose} onChange={e => setImmunizationForm({...immunizationForm, dose: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.batch}</label>
                          <input 
                            type="text" required
                            value={immunizationForm.batch} onChange={e => setImmunizationForm({...immunizationForm, batch: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.nextAppt}</label>
                          <input 
                            type="date"
                            value={immunizationForm.nextAppt} onChange={e => setImmunizationForm({...immunizationForm, nextAppt: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-md transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <Activity className="w-5 h-5" />
                      {t.recordImmunization}
                    </button>
                  </form>
                )}

                {/* Postnatal Tab */}
                {activeTab === 'postnatal' && (
                  <form onSubmit={handlePostnatalSubmit} className="space-y-6 max-w-2xl">
                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.motherAssessment}</label>
                          <textarea 
                            required rows={2}
                            value={postnatalForm.motherAssessment} onChange={e => setPostnatalForm({...postnatalForm, motherAssessment: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none resize-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.newbornAssessment}</label>
                          <textarea 
                            required rows={2}
                            value={postnatalForm.newbornAssessment} onChange={e => setPostnatalForm({...postnatalForm, newbornAssessment: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none resize-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{t.complications}</label>
                          <textarea 
                            rows={2} placeholder="Leave blank if none"
                            value={postnatalForm.complications} onChange={e => setPostnatalForm({...postnatalForm, complications: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-md border focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none resize-none"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-md transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <Baby className="w-5 h-5" />
                      {t.recordPostnatal}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <Baby className="w-16 h-16 opacity-40 text-[var(--primary)] mb-4" />
              <p className="text-lg">{t.selectPatient}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
