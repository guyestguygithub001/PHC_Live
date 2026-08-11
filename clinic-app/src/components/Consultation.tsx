import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, FileText, FlaskConical, Pill, Activity, 
  ArrowRight, Search, History, User, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import Fuse from 'fuse.js';
import { primaryCareICD11 } from '../utils/icd11Data';
import type { ICD11Code } from '../utils/icd11Data';

interface ConsultationProps {
  language: 'EN' | 'HA';
}

export default function Consultation({ language }: ConsultationProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // ICD-11 Engine State
  const [diagnosisQuery, setDiagnosisQuery] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<ICD11Code | null>(null);

  // Fuse.js setup for fuzzy search
  const fuse = useMemo(() => new Fuse(primaryCareICD11, {
    keys: ['title', 'code', 'synonyms'],
    threshold: 0.3, // highly typo tolerant
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
      vitalsTaken: "Vitals taken at Triage",
      diagnosis: "ICD-11 Diagnosis",
      searchDiagnosis: "Search illness or code (e.g. Typhoid)...",
      actionLab: "Order Lab Test",
      actionDrug: "Prescribe Drug",
      actionAdmit: "Admit to Ward",
      complete: "Complete & Discharge"
    },
    HA: {
      title: "Duba Marasa Lafiya (OPD)",
      queue: "Jerin Masu Jiran Ganin Likita",
      selectPatient: "Zabi Mara Lafiya",
      history: "Tarihin Jiyya",
      newEncounter: "Jiyyar Yau",
      vitalsTaken: "Gwajin Farko",
      diagnosis: "Gano Cutar (ICD-11)",
      searchDiagnosis: "Nemo Cuta (Misanli: Zazzabi)...",
      actionLab: "Rubuta Gwajin Lab",
      actionDrug: "Rubuta Magani",
      actionAdmit: "Kwantar a Asibiti",
      complete: "Kammala Jiyya"
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-8 h-8 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">{t[language].title}</h2>
        </div>
        <div className="flex items-center space-x-2 text-white/70 bg-black/20 px-4 py-2 rounded-xl">
          <User className="w-5 h-5 text-emerald-400" />
          <span>CHO: Dr. Ibrahim</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
        
        {/* The Clinical Queue */}
        <div className="w-full md:w-1/4 bg-black/20 rounded-3xl border border-white/10 p-4 overflow-y-auto">
          <h3 className="text-white/70 font-semibold mb-4 pl-2">{t[language].queue}</h3>
          <div className="space-y-2">
            
            {/* Urgent Patient */}
            <div 
              onClick={() => setSelectedPatient('Patient 1')}
              className={`p-4 rounded-xl cursor-pointer transition ${
                selectedPatient === 'Patient 1' 
                  ? 'bg-red-500/20 border-red-500/50 border shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'bg-red-500/10 border-red-500/20 border hover:bg-red-500/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold">Fatima Abubakar</p>
                  <p className="text-red-300 text-xs font-bold mt-1">URGENT • BP 180/110</p>
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Normal Patient */}
            <div 
              onClick={() => setSelectedPatient('Patient 2')}
              className={`p-4 rounded-xl cursor-pointer transition ${
                selectedPatient === 'Patient 2' 
                  ? 'bg-emerald-500/20 border-emerald-500/50 border' 
                  : 'bg-white/5 border-transparent border hover:bg-white/10'
              }`}
            >
              <p className="text-white font-semibold">Musa Ibrahim</p>
              <p className="text-white/50 text-sm">Normal • Temp 37.2°C</p>
            </div>

          </div>
        </div>

        {/* The Consultation View */}
        {selectedPatient ? (
          <div className="w-full md:w-3/4 flex flex-col gap-6 overflow-y-auto">
            
            {/* Patient Header */}
            <div className="bg-white/10 border border-white/20 p-6 rounded-3xl backdrop-blur-xl shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Fatima Abubakar</h3>
                  <p className="text-white/60">ID: PHC-KAN-0824 • 42 Years • Female</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-2 text-center">
                    <p className="text-red-200 text-xs">Blood Pressure</p>
                    <p className="text-red-400 font-bold text-lg">180/110</p>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-white/50 text-xs">Temperature</p>
                    <p className="text-white font-bold text-lg">37.1°C</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
              
              {/* Historical Timeline (Skeuomorphic Folder) */}
              <div className="w-full md:w-1/3 bg-[#fdfbf7] border border-[#e5e0d8] rounded-3xl p-6 overflow-y-auto shadow-inner relative text-slate-800">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                
                <h3 className="font-bold text-slate-600 mb-6 flex items-center space-x-2 border-b border-slate-200 pb-4">
                  <History className="w-5 h-5" />
                  <span>{t[language].history}</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  
                  {/* Timeline Item 1 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700 text-sm">Dispensary</div>
                        <time className="text-xs font-medium text-emerald-600">May 12</time>
                      </div>
                      <div className="text-sm text-slate-600">Artemether/Lumefantrine 20/120mg given.</div>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
              <div className="w-full md:w-2/3 bg-black/20 border border-white/10 rounded-3xl p-6 flex flex-col space-y-6 overflow-y-auto">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span>{t[language].newEncounter}</span>
                </h3>

                {/* ICD-11 Engine */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <label className="block text-white/70 text-sm mb-3 font-semibold">{t[language].diagnosis}</label>
                  
                  {selectedDiagnosis ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold text-lg">{selectedDiagnosis.title}</p>
                        <p className="text-emerald-400 text-sm">ICD-11: {selectedDiagnosis.code}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedDiagnosis(null)}
                        className="bg-black/30 hover:bg-black/50 p-2 rounded-lg text-white transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="text" 
                        placeholder={t[language].searchDiagnosis}
                        value={diagnosisQuery}
                        onChange={(e) => setDiagnosisQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                      
                      {/* Search Results Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                          {searchResults.map((result) => (
                            <div 
                              key={result.id}
                              onClick={() => {
                                setSelectedDiagnosis(result);
                                setDiagnosisQuery('');
                              }}
                              className="p-4 border-b border-white/5 hover:bg-white/10 cursor-pointer transition flex justify-between items-center group"
                            >
                              <div>
                                <p className="text-white font-semibold">{result.title}</p>
                                <p className="text-white/50 text-sm text-emerald-400/70">Code: {result.code}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-emerald-400 transition" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="flex-1">
                  <textarea 
                    placeholder="Clinical notes (optional)..."
                    className="w-full h-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                  ></textarea>
                </div>

                {/* Action Center */}
                <div className="grid grid-cols-3 gap-4 shrink-0">
                  <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-semibold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition">
                    <FlaskConical className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionLab}</span>
                  </button>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-semibold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition">
                    <Pill className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionDrug}</span>
                  </button>
                  <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 font-semibold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition">
                    <Activity className="w-6 h-6" />
                    <span className="text-sm">{t[language].actionAdmit}</span>
                  </button>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex justify-center items-center space-x-2 transition shadow-lg shadow-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t[language].complete}</span>
                </button>

              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-3/4 bg-black/10 border border-white/5 rounded-3xl flex items-center justify-center text-white/30">
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
