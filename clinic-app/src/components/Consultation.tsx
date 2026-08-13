import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, FileText, FlaskConical, Pill, Activity, 
  Search, History, User, CheckCircle2, ChevronRight, X, Mic, Volume2
} from 'lucide-react';
import Fuse from 'fuse.js';
import { primaryCareICD11 } from '../utils/icd11Data';
import type { ICD11Code } from '../utils/icd11Data';

interface ConsultationProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

export default function Consultation({ language, theme }: ConsultationProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // ICD-11 Engine State
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<ICD11Code | null>(null);
  const [diagnosisQuery, setDiagnosisQuery] = useState('');

  // Disease Programs State
  const [diseasePrograms, setDiseasePrograms] = useState({
    malaria: false,
    hiv: false,
    tb: false,
    hypertension: false,
    diabetes: false
  });

  // Clinical Notes & Voice Dictation States
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [dictationLang, setDictationLang] = useState<'EN' | 'PI' | 'HA'>('EN');

  // Fuse.js setup — highly typo-tolerant offline fuzzy search
  const fuse = useMemo(() => new Fuse(primaryCareICD11, {
    keys: ['title', 'code', 'synonyms'],
    threshold: 0.3,
  }), []);

  const searchResults = useMemo(() => {
    if (!diagnosisQuery) return [];
    return fuse.search(diagnosisQuery).slice(0, 5).map(result => result.item);
  }, [diagnosisQuery, fuse]);

  const t = {
    EN: {
      title: "OPD Consultation",
      queue: "To See (OPD Queue)",
      selectPatient: "Select a patient from the queue",
      history: "Historical Timeline",
      newEncounter: "Current Encounter",
      diagnosis: "ICD-11 Diagnosis",
      searchDiagnosis: "Search illness or code (e.g. Typhoid)...",
      actionLab: "Order Lab Test",
      actionDrug: "Prescribe Drug",
      actionAdmit: "Admit to Ward",
      complete: "Complete & Discharge",
      programs: "Disease Programs (DHIS2 Sync)",
      malaria: "Malaria",
      hiv: "HIV/AIDS",
      tb: "Tuberculosis",
      hypertension: "Hypertension",
      diabetes: "Diabetes"
    },
    HA: {
      title: "Duba Marasa Lafiya (OPD)",
      queue: "Jerin Masu Jiran Ganin Likita",
      selectPatient: "Zabi Mara Lafiya",
      history: "Tarihin Jiyya",
      newEncounter: "Jiyyar Yau",
      diagnosis: "Gano Cutar (ICD-11)",
      searchDiagnosis: "Nemo Cuta (Misanli: Zazzabi)...",
      actionLab: "Rubuta Gwajin Lab",
      actionDrug: "Rubuta Magani",
      actionAdmit: "Kwantar a Asibiti",
      complete: "Kammala Jiyya",
      programs: "Cutar Tsari (DHIS2 Sync)",
      malaria: "Zazzabin Cizon Sauro (Malaria)",
      hiv: "Kan-jamau (HIV/AIDS)",
      tb: "Tari (TB)",
      hypertension: "Hawan Jini (Hypertension)",
      diabetes: "Ciwon Sukari (Diabetes)"
    },
    YO: {
      title: "Ifọrọwanilẹnuwo OPD",
      queue: "Awon ti o n duro",
      selectPatient: "Yan alaisan kan ninu eka",
      history: "Itan Alaisan",
      newEncounter: "Ibẹwo Tuntun",
      diagnosis: "Ayẹwo Arun (ICD-11)",
      searchDiagnosis: "Wa arun (B.A. Iba)...",
      actionLab: "Kọ Idanwo Lab",
      actionDrug: "Kọ Oogun",
      actionAdmit: "Gba Alaisan Wọle",
      complete: "Pari & Dasilẹ",
      programs: "Eto Arun (DHIS2 Sync)",
      malaria: "Iba (Malaria)",
      hiv: "Arun Kogboogun (HIV/AIDS)",
      tb: "Ikọ (TB)",
      hypertension: "Ẹjẹ Riru (Hypertension)",
      diabetes: "Atọgbẹ (Diabetes)"
    },
    IG: {
      title: "Nlele OPD",
      queue: "Ndi Na-echere",
      selectPatient: "Họrọ onye ọrịa n'ahịrị",
      history: "Akụkọ Ọrịa",
      newEncounter: "Nlele Ugbu A",
      diagnosis: "Nchọpụta Ọrịa (ICD-11)",
      searchDiagnosis: "Chọọ ọrịa (Dịka ịba)...",
      actionLab: "Nyocha Ụlọ Ọgwụ",
      actionDrug: "Depụta Ọgwụ",
      actionAdmit: "Nara n'Ụlọ Ọgwụ",
      complete: "Mechaa & Hapụ",
      programs: "Usoro Ọrịa (DHIS2 Sync)",
      malaria: "Ịba (Malaria)",
      hiv: "HIV/AIDS",
      tb: "Ụkwara Nta (TB)",
      hypertension: "Ọbara Mgbali Elu (Hypertension)",
      diabetes: "Ọrịa Shuga (Diabetes)"
    },
    PI: {
      title: "OPD Consultation",
      queue: "People wey dey wait",
      selectPatient: "Choose patient from line",
      history: "Patient History",
      newEncounter: "Now Now Visit",
      diagnosis: "Check Wetin Do Patient",
      searchDiagnosis: "Find sickness (e.g. Typhoid)...",
      actionLab: "Send go Lab",
      actionDrug: "Write Medicine",
      actionAdmit: "Admit Patient",
      complete: "Finish & Discharge",
      programs: "Disease Programs (DHIS2 Sync)",
      malaria: "Malaria",
      hiv: "HIV/AIDS",
      tb: "Tuberculosis",
      hypertension: "Hypertension",
      diabetes: "Diabetes"
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-8 h-8 text-[var(--primary)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t[language].title}</h2>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] bg-[var(--input-bg)] px-4 py-2 rounded-lg border border-[var(--border-default)]">
          <User className="w-5 h-5 text-[var(--primary)]" />
          <span>CHO: Dr. Ibrahim</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
        
        {/* The Clinical Queue */}
        <div className="w-full md:w-1/4 bg-[var(--queue-bg)] rounded-lg border border-[var(--border-default)] p-4 overflow-y-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-[var(--text-secondary)] font-semibold mb-4 pl-2">{t[language].queue}</h3>
          <div className="space-y-2">
            {/* Urgent Patient — always red regardless of theme */}
            <div 
              onClick={() => setSelectedPatient('Patient 1')}
              className={`p-4 rounded-lg cursor-pointer transition ${
                selectedPatient === 'Patient 1' 
                  ? 'bg-red-500/20 border-red-500/50 border shadow-sm' 
                  : 'bg-red-500/10 border-red-500/20 border hover:bg-red-500/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--text-primary)] font-bold">Fatima Abubakar</p>
                  <p className="text-red-500 text-xs font-bold mt-1">URGENT • BP 180/110</p>
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Normal Patient */}
            <div 
              onClick={() => setSelectedPatient('Patient 2')}
              className={`p-4 rounded-lg cursor-pointer transition ${
                selectedPatient === 'Patient 2' 
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 border' 
                  : 'bg-[var(--queue-item-bg)] border-transparent border hover:bg-[var(--queue-item-hover)]'
              }`}
            >
              <p className="text-[var(--text-primary)] font-semibold">Musa Ibrahim</p>
              <p className="text-[var(--text-muted)] text-sm">Normal • Temp 37.2°C</p>
            </div>
          </div>
        </div>

        {/* The Consultation View */}
        {selectedPatient ? (
          <div className="w-full md:w-3/4 flex flex-col gap-6 overflow-y-auto">
            
            {/* Patient Header */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-default)] p-4 rounded-lg shrink-0" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Fatima Abubakar</h3>
                  <p className="text-[var(--text-secondary)]">ID: PHC-KAN-0824 • 42 Years • Female</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-2 text-center">
                    <p className="text-red-400 text-xs">Blood Pressure</p>
                    <p className="text-red-500 font-bold text-lg">180/110</p>
                  </div>
                  <div className="bg-[var(--input-bg)] border border-[var(--border-default)] rounded-lg px-4 py-2 text-center">
                    <p className="text-[var(--text-muted)] text-xs">Temperature</p>
                    <p className="text-[var(--text-primary)] font-bold text-lg">37.1°C</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
              
              {/* Historical Timeline (Skeuomorphic Folder) — always cream paper */}
              <div className="w-full md:w-1/3 bg-[var(--timeline-bg)] border border-[var(--timeline-border)] rounded-lg p-4 overflow-y-auto shadow-inner relative text-slate-800">
                <h3 className="font-bold text-slate-600 mb-6 flex items-center space-x-2 border-b border-slate-200 pb-4">
                  <History className="w-5 h-5" />
                  <span>{t[language].history}</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {/* Timeline Item 1 */}
                  <div className="relative flex items-center justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 z-10">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700 text-sm">Dispensary</div>
                        <time className="text-xs font-medium text-[var(--primary)]">May 12</time>
                      </div>
                      <div className="text-sm text-slate-600">Artemether/Lumefantrine 20/120mg given.</div>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative flex items-center justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 z-10">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700 text-sm">Lab Result</div>
                        <time className="text-xs font-medium text-slate-400">May 12</time>
                      </div>
                      <div className="text-sm text-slate-600">Malaria RDT: Positive</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Encounter & Action Center */}
              <div className="w-full md:w-2/3 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-4 flex flex-col space-y-6 overflow-y-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[var(--primary)]" />
                  <span>{t[language].newEncounter}</span>
                </h3>

                {/* ICD-11 Engine */}
                <div className="bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg p-4">
                  <label className="block text-[var(--text-secondary)] text-sm mb-3 font-semibold">{t[language].diagnosis}</label>
                  
                  {selectedDiagnosis ? (
                    <div className="bg-[var(--primary)]/8 border border-[var(--primary)]/40 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-[var(--text-primary)] font-medium text-sm">{selectedDiagnosis.title}</p>
                        <p className="text-[var(--primary)] text-sm">ICD-11: {selectedDiagnosis.code}</p>
                      </div>
                      <button onClick={() => setSelectedDiagnosis(null)} className="bg-[var(--input-bg)] hover:opacity-70 p-2 rounded-lg text-[var(--text-primary)] transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input 
                        type="text" 
                        placeholder={t[language].searchDiagnosis}
                        value={diagnosisQuery}
                        onChange={(e) => setDiagnosisQuery(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md pl-12 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
                      />
                      
                      {/* Search Results Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--card-bg-secondary)] border border-[var(--border-default)] rounded-lg z-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                          {searchResults.map((result) => (
                            <div 
                              key={result.id}
                              onClick={() => { setSelectedDiagnosis(result); setDiagnosisQuery(''); }}
                              className="p-4 border-b border-[var(--border-default)] hover:bg-[var(--queue-item-hover)] cursor-pointer transition flex justify-between items-center group"
                            >
                              <div>
                                <p className="text-[var(--text-primary)] font-semibold">{result.title}</p>
                                <p className="text-[var(--primary)] text-sm">Code: {result.code}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Disease Programs */}
                <div className="bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg p-4">
                  <label className="block text-[var(--text-secondary)] text-sm mb-3 font-semibold">{t[language].programs}</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(diseasePrograms).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setDiseasePrograms(prev => ({ ...prev, [key]: !prev[key as keyof typeof diseasePrograms] }))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                          value 
                            ? 'bg-purple-500 text-white border-purple-500 shadow-sm' 
                            : 'bg-[var(--input-bg)] text-[var(--text-secondary)] border-[var(--input-border)] hover:border-purple-500/50'
                        }`}
                      >
                        {t[language][key as keyof typeof t['EN']]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes & Speech Dictation */}
                <div className="flex-1 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[var(--text-secondary)] text-sm font-semibold">Clinical Notes</label>
                    
                    <div className="flex items-center gap-2">
                      {isDictating && (
                        <select
                          value={dictationLang}
                          onChange={(e) => setDictationLang(e.target.value as any)}
                          className="bg-[var(--input-bg)] border border-[var(--border-default)] rounded px-2 py-0.5 text-[10px] font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        >
                          <option value="EN">English Voice</option>
                          <option value="PI">Pidgin Voice</option>
                          <option value="HA">Hausa Voice</option>
                        </select>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (isDictating) {
                            // Insert mock dictation text
                            let dictated = "";
                            if (dictationLang === 'EN') {
                              dictated = "Patient presents with persistent fever and dry cough for three days. Lab result confirms malaria positive. Prescribed Artemether and referred to pharmacy.";
                            } else if (dictationLang === 'PI') {
                              dictated = "Patient come with strong malaria and cough for three days. Body dey hot, malaria test positive. We give am Artemether and tell am make he go collect medicine.";
                            } else {
                              dictated = "Mara lafiya ya zo da zazzabi da tari na kwanaki uku. Jiki yana zafi, gwajin malaria ya nuna yana da cutar. An rubuta Artemether an kuma tura shi kantin magani.";
                            }
                            setClinicalNotes(prev => prev ? `${prev}\n${dictated}` : dictated);
                            setIsDictating(false);
                          } else {
                            setIsDictating(true);
                          }
                        }}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold border transition duration-200 cursor-pointer ${
                          isDictating
                            ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse'
                            : 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 hover:bg-[var(--primary)]/20'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        {isDictating ? 'Insert Speaking Transcript' : 'Voice Dictate (Offline)'}
                      </button>
                    </div>
                  </div>

                  {isDictating ? (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-md p-4 flex flex-col items-center justify-center space-y-3 min-h-[120px]">
                      <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                        <Volume2 className="w-4 h-4 animate-bounce" />
                        <span>Speaking... (Offline Model Listening)</span>
                      </div>
                      
                      {/* Waveform animation */}
                      <div className="flex items-end gap-1.5 h-8">
                        {[20, 45, 60, 30, 75, 40, 90, 50, 60, 25, 45].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-red-500 rounded-full animate-pulse" 
                            style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                          />
                        ))}
                      </div>
                      
                      <p className="text-[10px] text-[var(--text-muted)] text-center font-mono max-w-xs">
                        {dictationLang === 'EN' && '"Patient presents with persistent fever..."'}
                        {dictationLang === 'PI' && '"Patient come with strong malaria..."'}
                        {dictationLang === 'HA' && '"Mara lafiya ya zo da zazzabi..."'}
                      </p>
                    </div>
                  ) : (
                    <textarea 
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Type clinical notes or tap 'Voice Dictate' to speak in Pidgin, Hausa or English..."
                      className="w-full min-h-[120px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition resize-none"
                    />
                  )}
                </div>

                {/* Action Center */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                  <button className="bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-500 font-medium py-2.5 rounded-md flex flex-col items-center justify-center space-y-2 transition">
                    <FlaskConical className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionLab}</span>
                  </button>
                  <button className="bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/25 text-purple-500 font-medium py-2.5 rounded-md flex flex-col items-center justify-center space-y-2 transition">
                    <Pill className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionDrug}</span>
                  </button>
                  <button className="bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/25 text-orange-500 font-medium py-2.5 rounded-md flex flex-col items-center justify-center space-y-2 transition">
                    <Activity className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionAdmit}</span>
                  </button>
                </div>

                <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-2.5 rounded-md flex justify-center items-center space-x-2 transition shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t[language].complete}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-3/4 bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
            <div className="text-center">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t[language].selectPatient}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
