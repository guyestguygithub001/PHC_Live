import React, { useState } from 'react';
import { Activity, Stethoscope, AlertTriangle, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TriageProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

export default function Triage({ language, theme }: TriageProps) {
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
    },
    YO: {
      title: "Ayẹwo akọkọ & Awọn ami igbesi aye",
      queue: "Nduro fun Ayẹwo",
      unlock: "Tẹ PIN lati ṣii Terminal",
      pinPlaceholder: "PIN onọmba mẹrin",
      unlockBtn: "Ṣii & Gba Iṣẹ",
      patient: "Alaisan",
      bp: "Iwọn Ẹjẹ (mmHg)",
      temp: "Iwọn otutu (°C)",
      weight: "Iwuwo (kg)",
      spo2: "SpO2 (%)",
      submit: "Fipamọ & Firanṣẹ si Dọkita",
      criticalAlert: "PATAKI: Iwọn Ẹjẹ Giga",
      urgentTag: "AMOJUTO",
      validationErr: "Iwọn otutu ti ko tọ"
    },
    IG: {
      title: "Nnwale & Ihe mgbaàmà ndụ",
      queue: "Na-eche Nnwale",
      unlock: "Tinye PIN iji kpọghee Terminal",
      pinPlaceholder: "PIN Nọmba anọ",
      unlockBtn: "Kpọghee & Bido Ọrụ",
      patient: "Onye Ọrịa",
      bp: "Ọbara Mgbali (mmHg)",
      temp: "Okpomọkụ (°C)",
      weight: "Ibu (kg)",
      spo2: "SpO2 (%)",
      submit: "Chekwaa & Ziga na Dọkịta",
      criticalAlert: "DỊ MKPA: Ọbara Mgbali Elu",
      urgentTag: "MBEREDE",
      validationErr: "Okpomọkụ adịghị mma"
    },
    PI: {
      title: "Checkup & Vitals",
      queue: "Waiting for Checkup",
      unlock: "Put PIN to Open Terminal",
      pinPlaceholder: "4-Digit PIN",
      unlockBtn: "Open & Start Work",
      patient: "Patient",
      bp: "Blood Pressure (mmHg)",
      temp: "Temp (°C)",
      weight: "Weight (kg)",
      spo2: "SpO2 (%)",
      submit: "Save & Send to Doctor",
      criticalAlert: "DANGER: Blood Pressure High",
      urgentTag: "URGENT",
      validationErr: "Wrong Temperature"
    }
  };

  const isCriticalBP = parseInt(bpSystolic) >= 180 || parseInt(bpDiastolic) >= 110;
  const isInvalidTemp = parseFloat(temp) > 45 || parseFloat(temp) < 30;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) setIsPinLocked(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalidTemp) { alert(t[language].validationErr); return; }
    const vitalId = uuidv4();
    alert(`Vitals Saved Offline! (Vital UUID: ${vitalId})\nPatient routed to Consultation Queue.`);
    setSelectedPatient(null);
    setBpSystolic(''); setBpDiastolic(''); setTemp(''); setWeight(''); setSpo2('');
  };

  /** Shared input class using CSS variables */
  const inputClass = (isError: boolean = false) => 
    `w-full bg-[var(--input-bg)] border rounded-md px-3 py-2.5 text-[var(--text-primary)] text-xl text-center focus:outline-none transition ${
      isError ? 'border-red-500' : 'border-[var(--input-border)] focus:border-[var(--primary)]'
    }`;

  // --- PIN Lock Screen ---
  if (isPinLocked) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] p-5 rounded-lg w-full max-w-md text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <ShieldAlert className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{t[language].unlock}</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">Every vital sign recorded will be cryptographically tied to your User UUID.</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input 
              type="password" maxLength={4} value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t[language].pinPlaceholder}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-center text-[var(--text-primary)] text-base tracking-[0.5em] focus:outline-none focus:border-[var(--primary)] transition"
            />
            <button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-2.5 rounded-md transition shadow-sm">
              {t[language].unlockBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-8 h-8 text-[var(--primary)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t[language].title}</h2>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] bg-[var(--input-bg)] px-4 py-2 rounded-lg border border-[var(--border-default)]">
          <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
          <span>Nurse: USR-0092</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-0">
        {/* Queue List */}
        <div className="w-full md:w-1/3 bg-[var(--queue-bg)] rounded-lg border border-[var(--border-default)] p-4 overflow-y-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-[var(--text-secondary)] font-semibold mb-4 pl-2">{t[language].queue}</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} onClick={() => setSelectedPatient(`Patient ${i}`)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedPatient === `Patient ${i}` 
                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 border' 
                    : 'bg-[var(--queue-item-bg)] border-transparent border hover:bg-[var(--queue-item-hover)]'
                }`}
              >
                <p className="text-[var(--text-primary)] font-semibold">Fatima Abubakar</p>
                <p className="text-[var(--text-muted)] text-sm">Arrived 10 mins ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Form */}
        {selectedPatient ? (
          <div className={`w-full md:w-2/3 bg-[var(--card-bg)] border p-4 rounded-lg transition-all duration-500 overflow-y-auto ${
            isCriticalBP ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-[var(--border-default)]'
          }`} style={{ boxShadow: isCriticalBP ? undefined : 'var(--shadow-card)' }}>
            
            {isCriticalBP && (
              <div className="mb-6 bg-red-500/15 border border-red-500/40 text-red-500 p-4 rounded-lg flex items-center space-x-3 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-bold">{t[language].criticalAlert} — {t[language].urgentTag}</span>
              </div>
            )}

            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center space-x-2">
              <span>{t[language].patient}:</span>
              <span className="text-[var(--primary)]">Fatima Abubakar</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[var(--text-secondary)] text-sm mb-1">{t[language].bp}</label>
                  <div className="flex items-center space-x-2">
                    <input type="number" required placeholder="120" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} className={inputClass(isCriticalBP)} />
                    <span className="text-[var(--text-muted)] text-2xl">/</span>
                    <input type="number" required placeholder="80" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} className={inputClass(isCriticalBP)} />
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[var(--text-secondary)] text-sm mb-1">
                    {t[language].temp} {temp && isInvalidTemp && <span className="text-red-500 text-xs ml-2">({t[language].validationErr})</span>}
                  </label>
                  <input type="number" step="0.1" required value={temp} onChange={(e) => setTemp(e.target.value)} className={inputClass(isInvalidTemp && !!temp)} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[var(--text-secondary)] text-sm mb-1">{t[language].weight}</label>
                  <input type="number" step="0.1" required value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass()} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[var(--text-secondary)] text-sm mb-1">{t[language].spo2}</label>
                  <input type="number" required value={spo2} onChange={(e) => setSpo2(e.target.value)} className={inputClass()} />
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full font-bold py-2.5 rounded-md flex justify-center items-center space-x-2 transition shadow-sm mt-6 ${
                  isCriticalBP 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{t[language].submit}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full md:w-2/3 bg-[var(--queue-bg)] border border-[var(--border-default)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
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
