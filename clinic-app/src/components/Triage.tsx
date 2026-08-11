import React, { useState } from 'react';
import { Activity, Stethoscope, AlertTriangle, ArrowRight, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TriageProps {
  language: 'EN' | 'HA';
}

export default function Triage({ language }: TriageProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isPinLocked, setIsPinLocked] = useState(true);
  const [pin, setPin] = useState('');

  // Vitals State
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [spo2, setSpo2] = useState('');

  const t = {
    EN: {
      title: "Triage & Vitals",
      queue: "Waiting for Triage",
      unlock: "Enter PIN to Unlock Terminal",
      pinPlaceholder: "4-Digit PIN",
      unlockBtn: "Unlock & Claim Shift",
      patient: "Patient",
      bp: "Blood Pressure (mmHg)",
      temp: "Temp (°C)",
      weight: "Weight (kg)",
      spo2: "SpO2 (%)",
      submit: "Save & Route to Doctor",
      criticalAlert: "CRITICAL: High Blood Pressure",
      urgentTag: "URGENT",
      validationErr: "Invalid Temperature"
    },
    HA: {
      title: "Gwajin Farko (Triage)",
      queue: "Sufar Masu Jiran Gwaji",
      unlock: "Sanya PIN Don Fara Aiki",
      pinPlaceholder: "PIN Guda 4",
      unlockBtn: "Bude & Fara Aiki",
      patient: "Mara Lafiya",
      bp: "Hawan Jini (mmHg)",
      temp: "Zafin Jiki (°C)",
      weight: "Nauyi (kg)",
      spo2: "SpO2 (%)",
      submit: "Ajiye & Tura Wurin Likita",
      criticalAlert: "HATSARI: Hawan Jini Ya Hau",
      urgentTag: "GAGGAWA",
      validationErr: "Zafin Jiki Bai Inganta Ba"
    }
  };

  const isCriticalBP = parseInt(bpSystolic) >= 180 || parseInt(bpDiastolic) >= 110;
  
  // Data Validation
  const isInvalidTemp = parseFloat(temp) > 45 || parseFloat(temp) < 30;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      setIsPinLocked(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalidTemp) {
      alert(t[language].validationErr);
      return;
    }
    const vitalId = uuidv4();
    alert(`Vitals Saved Offline! (Vital UUID: ${vitalId})\nPatient routed to Consultation Queue.`);
    setSelectedPatient(null);
    setBpSystolic('');
    setBpDiastolic('');
    setTemp('');
    setWeight('');
    setSpo2('');
  };

  if (isPinLocked) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-xl w-full max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t[language].unlock}</h2>
          <p className="text-white/60 mb-6 text-sm">Every vital sign recorded will be cryptographically tied to your User UUID.</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t[language].pinPlaceholder}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-center text-white text-2xl tracking-[0.5em] focus:outline-none focus:border-emerald-500 transition"
            />
            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-500/30"
            >
              {t[language].unlockBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-8 h-8 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">{t[language].title}</h2>
        </div>
        <div className="flex items-center space-x-2 text-white/70 bg-black/20 px-4 py-2 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Nurse: USR-0092</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
        {/* Queue List */}
        <div className="w-full md:w-1/3 bg-black/20 rounded-3xl border border-white/10 p-4 overflow-y-auto">
          <h3 className="text-white/70 font-semibold mb-4 pl-2">{t[language].queue}</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPatient(`Patient ${i}`)}
                className={`p-4 rounded-xl cursor-pointer transition ${
                  selectedPatient === `Patient ${i}` 
                    ? 'bg-emerald-500/20 border-emerald-500/50 border' 
                    : 'bg-white/5 border-transparent border hover:bg-white/10'
                }`}
              >
                <p className="text-white font-semibold">Fatima Abubakar</p>
                <p className="text-white/50 text-sm">Arrived 10 mins ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Form */}
        {selectedPatient ? (
          <div className={`w-full md:w-2/3 bg-white/10 border p-6 rounded-3xl backdrop-blur-xl transition-all duration-500 overflow-y-auto ${
            isCriticalBP ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/20'
          }`}>
            
            {isCriticalBP && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center space-x-3 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span className="font-bold">{t[language].criticalAlert} — {t[language].urgentTag}</span>
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span>{t[language].patient}:</span>
              <span className="text-emerald-400">Fatima Abubakar</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 text-sm mb-1">{t[language].bp}</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" required placeholder="120"
                      value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)}
                      className={`w-full bg-black/20 border rounded-xl px-4 py-4 text-white text-xl text-center focus:outline-none transition ${isCriticalBP ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'}`}
                    />
                    <span className="text-white/50 text-2xl">/</span>
                    <input 
                      type="number" required placeholder="80"
                      value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)}
                      className={`w-full bg-black/20 border rounded-xl px-4 py-4 text-white text-xl text-center focus:outline-none transition ${isCriticalBP ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'}`}
                    />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 text-sm mb-1">{t[language].temp} {temp && isInvalidTemp && <span className="text-red-400 text-xs ml-2">({t[language].validationErr})</span>}</label>
                  <input 
                    type="number" step="0.1" required
                    value={temp} onChange={(e) => setTemp(e.target.value)}
                    className={`w-full bg-black/20 border rounded-xl px-4 py-4 text-white text-xl focus:outline-none transition ${isInvalidTemp ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'}`}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 text-sm mb-1">{t[language].weight}</label>
                  <input 
                    type="number" step="0.1" required
                    value={weight} onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white text-xl focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 text-sm mb-1">{t[language].spo2}</label>
                  <input 
                    type="number" required
                    value={spo2} onChange={(e) => setSpo2(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white text-xl focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full font-bold py-4 rounded-xl flex justify-center items-center space-x-2 transition shadow-lg mt-6 ${
                  isCriticalBP 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{t[language].submit}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full md:w-2/3 bg-black/10 border border-white/5 rounded-3xl flex items-center justify-center text-white/30">
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a patient from the queue to record vitals</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
