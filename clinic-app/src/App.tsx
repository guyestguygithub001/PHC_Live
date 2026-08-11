import React, { useState } from 'react';
import { Languages, CalendarClock, UserPlus, Stethoscope, CloudOff, FileText, Sun, Moon, FlaskConical, Pill, Send } from 'lucide-react';
import FrontDesk from './components/FrontDesk';
import Triage from './components/Triage';
import Consultation from './components/Consultation';
import Laboratory from './components/Laboratory';
import Pharmacy from './components/Pharmacy';
import Referral from './components/Referral';

type AppScreen = 'PORTAL' | 'FRONT_DESK' | 'TRIAGE' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'REFERRAL';
type Language = 'EN' | 'HA';
type Theme = 'light' | 'dark';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('FRONT_DESK');
  const [language, setLanguage] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('light');
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
      labTab: "Laboratory",
      pharmacyTab: "Pharmacy",
      referralTab: "Referral",
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
      labTab: "Dakin Gwaji",
      pharmacyTab: "Kantin Magani",
      referralTab: "Tura Mara Lafiya",
      syncPending: "Ana Jiran Tura (3)"
    }
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'EN' ? 'HA' : 'EN');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  /** Active tab styling based on current theme */
  const tabActive = 'bg-emerald-500 text-white shadow-lg';
  const tabInactive = theme === 'light'
    ? 'text-slate-500 hover:bg-slate-100'
    : 'text-white/60 hover:bg-white/10';

  const renderPortal = () => (
    <div className="bg-[var(--card-bg)] p-8 rounded-3xl backdrop-blur-xl border border-[var(--border-default)] w-full max-w-md mx-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="text-center mb-8">
        <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CalendarClock className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t[language].title}</h2>
        <p className="text-[var(--text-secondary)]">{t[language].subtitle}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
              {t[language].phoneLabel}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
        <form className="space-y-6">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
              {t[language].enterOtp}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
    <div data-theme={theme} className="min-h-screen bg-[var(--page-bg)] flex flex-col items-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Gradients — only visible in dark mode */}
      {theme === 'dark' && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-teal-600/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-2 backdrop-blur-sm" style={{ boxShadow: 'var(--shadow-card)' }}>
        
        {/* Module Tabs */}
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto p-1">
          <button 
            onClick={() => setCurrentScreen('PORTAL')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'PORTAL' ? tabActive : tabInactive
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>{t[language].portalTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('FRONT_DESK')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'FRONT_DESK' ? tabActive : tabInactive
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t[language].frontDeskTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('TRIAGE')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'TRIAGE' ? tabActive : tabInactive
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t[language].triageTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('CONSULTATION')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'CONSULTATION' ? tabActive : tabInactive
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t[language].consultationTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('LABORATORY')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'LABORATORY' ? tabActive : tabInactive
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t[language].labTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('PHARMACY')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'PHARMACY' ? tabActive : tabInactive
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>{t[language].pharmacyTab}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('REFERRAL')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              currentScreen === 'REFERRAL' ? tabActive : tabInactive
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t[language].referralTab}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0 px-2">
          {/* Sync Status */}
          <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
            <CloudOff className="w-4 h-4" />
            <span>{t[language].syncPending}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-emerald-500 transition"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-[var(--input-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-primary)] px-4 py-2 rounded-xl transition-all border border-[var(--border-default)]"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm font-medium">{t[language].switch}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        {currentScreen === 'PORTAL' && renderPortal()}
        {currentScreen === 'FRONT_DESK' && <FrontDesk language={language} theme={theme} />}
        {currentScreen === 'TRIAGE' && <Triage language={language} theme={theme} />}
        {currentScreen === 'CONSULTATION' && <Consultation language={language} theme={theme} />}
        {currentScreen === 'LABORATORY' && <Laboratory language={language} theme={theme} />}
        {currentScreen === 'PHARMACY' && <Pharmacy language={language} theme={theme} />}
        {currentScreen === 'REFERRAL' && <Referral language={language} theme={theme} />}
      </div>
    </div>
  );
}

export default App;
