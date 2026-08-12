import React, { useState, useEffect } from 'react';
import { Languages, CalendarClock, UserPlus, Stethoscope, CloudOff, FileText, Sun, Moon, FlaskConical, Pill, Send, Baby, BedDouble, CreditCard, Menu, X } from 'lucide-react';
import FrontDesk from './components/FrontDesk';
import Triage from './components/Triage';
import Consultation from './components/Consultation';
import Laboratory from './components/Laboratory';
import Pharmacy from './components/Pharmacy';
import Referral from './components/Referral';
import AntenatalCare from './components/AntenatalCare';
import InpatientWard from './components/InpatientWard';
import Billing from './components/Billing';

type AppScreen = 'PORTAL' | 'FRONT_DESK' | 'TRIAGE' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'REFERRAL' | 'ANC' | 'IPD' | 'BILLING';
type Language = 'EN' | 'HA';
type Theme = 'light' | 'dark';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('FRONT_DESK');
  const [language, setLanguage] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('light');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppScreen;
      const validScreens = ['PORTAL', 'FRONT_DESK', 'TRIAGE', 'CONSULTATION', 'LABORATORY', 'PHARMACY', 'REFERRAL', 'ANC', 'IPD', 'BILLING'];
      if (hash && validScreens.includes(hash)) {
        setCurrentScreen(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = currentScreen;
    } else {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      ancTab: "Antenatal Care",
      ipdTab: "Inpatient Ward",
      billingTab: "Billing",
      syncPending: "3 Pending"
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
      ancTab: "Awo (ANC)",
      ipdTab: "Kwanciya a Asibiti",
      billingTab: "Kudin Asibiti",
      syncPending: "Ana Jiran (3)"
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

  const modules = [
    { id: 'PORTAL', icon: CalendarClock, label: t[language].portalTab },
    { id: 'FRONT_DESK', icon: UserPlus, label: t[language].frontDeskTab },
    { id: 'TRIAGE', icon: Stethoscope, label: t[language].triageTab },
    { id: 'CONSULTATION', icon: FileText, label: t[language].consultationTab },
    { id: 'LABORATORY', icon: FlaskConical, label: t[language].labTab },
    { id: 'PHARMACY', icon: Pill, label: t[language].pharmacyTab },
    { id: 'REFERRAL', icon: Send, label: t[language].referralTab },
    { id: 'ANC', icon: Baby, label: t[language].ancTab },
    { id: 'IPD', icon: BedDouble, label: t[language].ipdTab },
    { id: 'BILLING', icon: CreditCard, label: t[language].billingTab }
  ];

  const renderPortal = () => (
    <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border-default)] w-full max-w-md mx-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="text-center mb-6">
        <CalendarClock className="w-10 h-10 text-[var(--primary)] mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">{t[language].title}</h2>
        <p className="text-sm text-[var(--text-secondary)]">{t[language].subtitle}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-1.5">
              {t[language].phoneLabel}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="+234 800 000 0000"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !phone}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center h-10"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t[language].sendCode
            )}
          </button>
        </form>
      ) : (
        <form className="space-y-4">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-1.5">
              {t[language].enterOtp}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] text-center tracking-widest text-lg focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
          >
            {t[language].verify}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--page-bg)] flex flex-col items-center px-4 py-3 font-sans transition-colors duration-200">

      {/* Navigation Drawer */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setIsNavOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div 
            className="relative h-full w-72 bg-[var(--sidebar-bg)] border-r border-[var(--border-default)] flex flex-col"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-[var(--border-default)] flex justify-between items-center">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Modules</span>
              <button 
                onClick={() => setIsNavOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-1">
              {modules.map(module => {
                const isActive = currentScreen === module.id;
                return (
                  <button 
                    key={module.id}
                    onClick={() => {
                      window.location.hash = module.id;
                      setIsNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isActive 
                        ? 'bg-[var(--primary)]/8 text-[var(--primary)] font-medium border-l-2 border-[var(--primary)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)] hover:text-[var(--text-primary)] border-l-2 border-transparent'
                    }`}
                  >
                    <module.icon className="w-4 h-4 shrink-0" />
                    <span>{module.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 bg-[var(--header-bg)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 z-30 relative" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNavOpen(true)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-md transition-colors"
            title="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-[var(--text-primary)]">PHC_Live</h1>
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
            {modules.find(m => m.id === currentScreen)?.label}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[var(--danger)] bg-[var(--danger-light)] px-2.5 py-1 rounded-md text-xs font-medium">
            <CloudOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t[language].syncPending}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-md transition-colors"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)] px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'EN' ? 'HA' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        {currentScreen === 'PORTAL' && renderPortal()}
        {currentScreen === 'FRONT_DESK' && <FrontDesk language={language} theme={theme} />}
        {currentScreen === 'TRIAGE' && <Triage language={language} theme={theme} />}
        {currentScreen === 'CONSULTATION' && <Consultation language={language} theme={theme} />}
        {currentScreen === 'LABORATORY' && <Laboratory language={language} theme={theme} />}
        {currentScreen === 'PHARMACY' && <Pharmacy language={language} theme={theme} />}
        {currentScreen === 'REFERRAL' && <Referral language={language} theme={theme} />}
        {currentScreen === 'ANC' && <AntenatalCare language={language} theme={theme} />}
        {currentScreen === 'IPD' && <InpatientWard language={language} theme={theme} />}
        {currentScreen === 'BILLING' && <Billing language={language} theme={theme} />}
      </div>
    </div>
  );
}

export default App;
