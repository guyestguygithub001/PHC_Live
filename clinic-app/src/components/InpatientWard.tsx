import React, { useState, useEffect } from 'react';
import { BedDouble, Pill, FileText, CheckCircle, Clock, LogOut, User, Activity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InpatientWardProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

interface Medication {
  id: string;
  name: string;
  time: string;
  status: 'pending' | 'administered';
  administeredAt?: string;
}

interface Bed {
  id: string;
  number: number;
  status: 'available' | 'occupied';
  patientName?: string;
  diagnosis?: string;
  mar?: Medication[];
}

const translations = {
  EN: {
    ward: 'Inpatient Ward',
    bedManagement: 'Bed Management',
    available: 'Available',
    occupied: 'Occupied',
    bed: 'Bed',
    patient: 'Patient',
    diagnosis: 'Diagnosis',
    marTab: 'MAR (Medication)',
    dischargeTab: 'Discharge',
    marTitle: 'Medication Administration Record',
    time: 'Time',
    status: 'Status',
    markDone: 'Mark as Done',
    administered: 'Administered',
    dischargeNote: 'Discharge Note',
    outcome: 'Outcome',
    dischargedHealthy: 'Discharged Healthy',
    referred: 'Referred',
    deceased: 'Deceased',
    generateDischarge: 'Generate Discharge',
    selectBed: 'Select an occupied bed to view details',
    noMedication: 'No active medication',
    dischargeSuccess: 'Patient discharged successfully.',
    selectOutcome: 'Select Outcome',
    writeNote: 'Write discharge note here...'
  },
  HA: {
    ward: 'Kwanciya a Asibiti',
    bedManagement: 'Gudanar da Gadaje',
    available: 'Akwai Wuri',
    occupied: 'Akwai Mutum',
    bed: 'Gado',
    patient: 'Majinyaci',
    diagnosis: 'Cutar',
    marTab: 'Magunguna',
    dischargeTab: 'Sallama',
    marTitle: 'Rubutun Bada Magani',
    time: 'Lokaci',
    status: 'Yanayi',
    markDone: 'Nuna an Bayar',
    administered: 'An Bayar',
    dischargeNote: 'Bayanin Sallama',
    outcome: 'Sakamako',
    dischargedHealthy: 'Sallama da Lafiya',
    referred: 'An Tura Wani Asibiti',
    deceased: 'Ya Rasu',
    generateDischarge: 'Bada Sallama',
    selectBed: 'Zabi gadon da ake ciki don ganin bayani',
    noMedication: 'Babu magani a yanzu',
    dischargeSuccess: 'An sallami majinyaci cikin nasara.',
    selectOutcome: 'Zabi Sakamako',
    writeNote: 'Rubuta bayanin sallama a nan...'
  },
  YO: {
    ward: 'Wọọdu Awọn Alaisan',
    bedManagement: 'Itọju Ibusun',
    available: 'O wa',
    occupied: 'Ti gba',
    bed: 'Ibusun',
    patient: 'Alaisan',
    diagnosis: 'Aisan',
    marTab: 'MAR (Oogun)',
    dischargeTab: 'Idasilẹ',
    marTitle: 'Iwe Itọju Oogun',
    time: 'Aago',
    status: 'Ipo',
    markDone: 'Samisi Bi O Ti Ṣe',
    administered: 'Ti fi fun',
    dischargeNote: 'Iwe Idasilẹ',
    outcome: 'Abajade',
    dischargedHealthy: 'Idasilẹ Pẹlu Ilera',
    referred: 'Tọkasi',
    deceased: 'O ti ku',
    generateDischarge: 'Ṣe Idasilẹ',
    selectBed: 'Yan ibusun ti o ti gba lati wo awọn alaye',
    noMedication: 'Ko si oogun ti nṣiṣẹ',
    dischargeSuccess: 'Alaisan ti yọ kuro ni aṣeyọri.',
    selectOutcome: 'Yan Abajade',
    writeNote: 'Kọ iwe idasilẹ nibi...'
  },
  IG: {
    ward: 'Wọọdụ Ndị Ọrịa',
    bedManagement: 'Nlekọta Àkwà',
    available: 'Ọ Dị',
    occupied: 'Ejiri Ya',
    bed: 'Àkwà',
    patient: 'Onye Ọrịa',
    diagnosis: 'Nchọpụta',
    marTab: 'MAR (Ọgwụ)',
    dischargeTab: 'Ịhapụ',
    marTitle: 'Ndekọ Nchịkwa Ọgwụ',
    time: 'Oge',
    status: 'Ọnọdụ',
    markDone: 'Kaa ka Ọ gwụla',
    administered: 'Enyerela',
    dischargeNote: 'Ihe Ndekọ Ịhapụ',
    outcome: 'Nsonaazụ',
    dischargedHealthy: 'A hapụrụ ya na ahụike',
    referred: 'E zigara',
    deceased: 'Ọ nwụrụ',
    generateDischarge: 'Mepụta Ịhapụ',
    selectBed: 'Họrọ àkwà ejiri hụ nkọwa',
    noMedication: 'Enweghị ọgwụ na-arụ ọrụ',
    dischargeSuccess: 'Ahapụla onye ọrịa nke ọma.',
    selectOutcome: 'Họrọ Nsonaazụ',
    writeNote: 'Dee ihe ndekọ ịhapụ ebe a...'
  },
  PI: {
    ward: 'Ward for Sick pipo',
    bedManagement: 'Bed Management',
    available: 'E dey',
    occupied: 'Person dey',
    bed: 'Bed',
    patient: 'Patient',
    diagnosis: 'Sickness',
    marTab: 'MAR (Medicine)',
    dischargeTab: 'Discharge',
    marTitle: 'Medicine Record',
    time: 'Time',
    status: 'Status',
    markDone: 'Mark say e don done',
    administered: 'Don give',
    dischargeNote: 'Discharge Note',
    outcome: 'Result',
    dischargedHealthy: 'Discharge well well',
    referred: 'Refer',
    deceased: 'Don die',
    generateDischarge: 'Generate Discharge',
    selectBed: 'Select bed wey get person to see wetin dey happen',
    noMedication: 'No medicine',
    dischargeSuccess: 'Patient don discharge well.',
    selectOutcome: 'Select Result',
    writeNote: 'Write discharge note for here...'
  }
};

const initialBeds: Bed[] = [
  {
    id: uuidv4(),
    number: 1,
    status: 'occupied',
    patientName: 'Fatima Musa',
    diagnosis: 'Severe Malaria',
    mar: [
      { id: uuidv4(), name: 'Artemether 80mg IV', time: '08:00 AM', status: 'pending' },
      { id: uuidv4(), name: 'Paracetamol 1000mg', time: '12:00 PM', status: 'pending' }
    ]
  },
  { id: uuidv4(), number: 2, status: 'available' },
  {
    id: uuidv4(),
    number: 3,
    status: 'occupied',
    patientName: 'Ibrahim Ali',
    diagnosis: 'Pneumonia',
    mar: [
      { id: uuidv4(), name: 'Ceftriaxone 1g IV', time: '09:00 AM', status: 'administered', administeredAt: '09:05 AM' },
      { id: uuidv4(), name: 'Oxygen Therapy', time: 'Continuous', status: 'pending' }
    ]
  },
  { id: uuidv4(), number: 4, status: 'available' },
  { id: uuidv4(), number: 5, status: 'available' },
  { id: uuidv4(), number: 6, status: 'available' }
];

export default function InpatientWard({ language, theme }: InpatientWardProps) {
  const t = translations[language];
  
  // State for beds management
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mar' | 'discharge'>('mar');
  
  // Discharge form state
  const [dischargeNote, setDischargeNote] = useState('');
  const [dischargeOutcome, setDischargeOutcome] = useState('');

  const selectedBed = beds.find(b => b.id === selectedBedId);

  // In a real app, this useEffect would fetch data from an API
  useEffect(() => {
    // fetchBeds().then(data => setBeds(data));
  }, []);

  const handleAdministerMedication = (bedId: string, medId: string) => {
    setBeds(prevBeds => prevBeds.map(bed => {
      if (bed.id !== bedId) return bed;
      return {
        ...bed,
        mar: bed.mar?.map(med => {
          if (med.id !== medId) return med;
          return {
            ...med,
            status: 'administered',
            administeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        })
      };
    }));
  };

  const handleDischarge = () => {
    if (!selectedBed || !dischargeOutcome) return;

    // In a real app, this would be an API call to save the discharge record
    const dischargeRecordId = uuidv4();
    console.log(`Discharge Record Generated: ${dischargeRecordId}`, {
      patient: selectedBed.patientName,
      note: dischargeNote,
      outcome: dischargeOutcome,
      timestamp: new Date().toISOString()
    });

    // Free up the bed
    setBeds(prevBeds => prevBeds.map(bed => {
      if (bed.id !== selectedBed.id) return bed;
      return {
        id: bed.id,
        number: bed.number,
        status: 'available'
      };
    }));

    // Reset state
    setSelectedBedId(null);
    setDischargeNote('');
    setDischargeOutcome('');
    alert(t.dischargeSuccess);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4 md:gap-6 p-4 overflow-y-auto md:overflow-hidden">
      {/* Left Panel: Bed Management Dashboard */}
      <div 
        className="w-full md:w-1/3 flex flex-col rounded-lg overflow-hidden flex-shrink-0"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        <div 
          className="p-4 border-b flex items-center gap-3"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <BedDouble className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t.ward}
          </h2>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-3" style={{ backgroundColor: 'var(--queue-bg)' }}>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t.bedManagement}
          </h3>
          
          {beds.map((bed) => (
            <button
              key={bed.id}
              onClick={() => {
                if (bed.status === 'occupied') {
                  setSelectedBedId(bed.id);
                  setActiveTab('mar');
                } else {
                  setSelectedBedId(null);
                }
              }}
              className="w-full text-left rounded-lg p-4 transition-all border disabled:opacity-90 disabled:cursor-default flex flex-col gap-2"
              style={{ 
                backgroundColor: selectedBedId === bed.id ? 'var(--queue-item-hover)' : 'var(--queue-item-bg)',
                borderColor: selectedBedId === bed.id ? 'var(--text-primary)' : 'transparent'
              }}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  {t.bed} {bed.number}
                </span>
                <span 
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    bed.status === 'available' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}
                >
                  {bed.status === 'available' ? t.available : t.occupied}
                </span>
              </div>
              
              {bed.status === 'occupied' && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <User className="w-4 h-4" />
                    <span>{bed.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Activity className="w-4 h-4" />
                    <span className="truncate">{bed.diagnosis}</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Main View */}
      <div 
        className="w-full md:w-2/3 flex flex-col rounded-lg overflow-hidden"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        {!selectedBed || selectedBed.status === 'available' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-5 text-center h-full">
            <BedDouble className="w-16 h-16 mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t.selectBed}
            </h3>
          </div>
        ) : (
          <>
            {/* Header with Patient Info */}
            <div 
              className="p-4 border-b"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {selectedBed.patientName}
                  </h2>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1 font-medium">
                      <BedDouble className="w-4 h-4" /> {t.bed} {selectedBed.number}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" /> {selectedBed.diagnosis}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <button
                  onClick={() => setActiveTab('mar')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'mar' 
                      ? 'border-indigo-500 text-indigo-500' 
                      : 'border-transparent hover:text-indigo-400'
                  }`}
                  style={{ color: activeTab === 'mar' ? undefined : 'var(--text-secondary)' }}
                >
                  <Pill className="w-4 h-4" />
                  {t.marTab}
                </button>
                <button
                  onClick={() => setActiveTab('discharge')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'discharge' 
                      ? 'border-red-500 text-red-500' 
                      : 'border-transparent hover:text-red-400'
                  }`}
                  style={{ color: activeTab === 'discharge' ? undefined : 'var(--text-secondary)' }}
                >
                  <LogOut className="w-4 h-4" />
                  {t.dischargeTab}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'mar' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t.marTitle}
                    </h3>
                  </div>

                  {!selectedBed.mar || selectedBed.mar.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>{t.noMedication}</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedBed.mar.map((med) => (
                        <div 
                          key={med.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                          style={{ 
                            backgroundColor: 'var(--input-bg)',
                            borderColor: 'var(--border-default)'
                          }}
                        >
                          <div>
                            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                              {med.name}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                <Clock className="w-4 h-4" /> {med.time}
                              </span>
                              {med.administeredAt && (
                                <span className="flex items-center gap-1 text-[var(--primary)] font-medium">
                                  <CheckCircle className="w-4 h-4" /> 
                                  {t.administered} at {med.administeredAt}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {med.status === 'pending' ? (
                            <button
                              onClick={() => handleAdministerMedication(selectedBed.id, med.id)}
                              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t.markDone}
                            </button>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                              {t.administered}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'discharge' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t.dischargeNote}
                    </label>
                    <textarea
                      value={dischargeNote}
                      onChange={(e) => setDischargeNote(e.target.value)}
                      placeholder={t.writeNote}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow min-h-[120px] resize-y"
                      style={{ 
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t.outcome}
                    </label>
                    <select
                      value={dischargeOutcome}
                      onChange={(e) => setDischargeOutcome(e.target.value)}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow appearance-none"
                      style={{ 
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="" disabled>{t.selectOutcome}</option>
                      <option value="healthy">{t.dischargedHealthy}</option>
                      <option value="referred">{t.referred}</option>
                      <option value="deceased">{t.deceased}</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <button
                      onClick={handleDischarge}
                      disabled={!dischargeOutcome}
                      className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      {t.generateDischarge}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
