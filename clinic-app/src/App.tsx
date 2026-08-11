import React, { useState } from 'react';
import { Languages, CalendarClock, UserPlus, Stethoscope, CloudOff, FileText } from 'lucide-react';
import FrontDesk from './components/FrontDesk';
import Triage from './components/Triage';
import Consultation from './components/Consultation';

type AppScreen = 'PORTAL' | 'FRONT_DESK' | 'TRIAGE' | 'CONSULTATION';
type Language = 'EN' | 'HA';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('FRONT_DESK');
  const [language, setLanguage] = useState<Language>('EN');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    EN: {
      switch: "Switch to Hausa",
      title: "Patient Booking Portal",
      subtitle: "Book your appointment before visiting the PHC",
      phoneLabel: "Phone Number",
      sendCode: "Send Security Code",
      enterOtp: "Enter Security Code",
      verify: "Verify & Login",
      portalTab: "Patient Portal",
      frontDeskTab: "Front Desk",
      triageTab: "Triage",
      consultationTab: "OPD Consultation",
      syncPending: "3 Pending Syncs"
    },
    HA: {
      switch: "Canza zuwa Turanci",
      title: "Tashar Adana Booking",
      subtitle: "Yi booking kafin zuwa Asibiti (PHC)",
      phoneLabel: "Lambar Waya",
      sendCode: "Aika Lambar Sirri",
      enterOtp: "Sanya Lambar Sirri",
      verify: "Tabbatar & Shiga",
      portalTab: "Tashar Mara Lafiya",
      frontDeskTab: "Karbar Marasa Lafiya",
      triageTab: "Gwajin Farko",
      consultationTab: "Duba Marasa Lafiya (OPD)",
      syncPending: "Ana Jiran Tura (3)"
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'HA' : 'EN');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const renderPortal = () => (
    <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CalendarClock className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t[language].title}</h2>
        <p className="text-emerald-100/70">{t[language].subtitle}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in slide-in-from-right-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t[language].phoneLabel}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="+234 800 000 0000"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !phone}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center h-12"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              t[language].sendCode
            )}
          </button>
        </form>
      ) : (
        <form className="space-y-6 animate-in slide-in-from-right-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t[language].enterOtp}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t[language].verify}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-teal-600/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Top Navigation Bar */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm">
        
        {/* Module Tabs */}
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto p-1">
          <button 
            onClick={() => setCurrentScreen('PORTAL')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'PORTAL' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>{t[language].portalTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('FRONT_DESK')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'FRONT_DESK' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t[language].frontDeskTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('TRIAGE')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'TRIAGE' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t[language].triageTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('CONSULTATION')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'CONSULTATION' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t[language].consultationTab}</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0 px-2">
          {/* Sync Status */}
          <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
            <CloudOff className="w-4 h-4" />
            <span>{t[language].syncPending}</span>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all border border-white/5"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm font-medium">{t[language].switch}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        {currentScreen === 'PORTAL' && renderPortal()}
        {currentScreen === 'FRONT_DESK' && <FrontDesk language={language} />}
        {currentScreen === 'TRIAGE' && <Triage language={language} />}
        {currentScreen === 'CONSULTATION' && <Consultation language={language} />}
      </div>
    </div>
  );
}

export default App;
