import React, { useState, useEffect } from 'react';
import { Languages, CalendarClock, UserPlus, Stethoscope, CloudOff, FileText, Sun, Moon, FlaskConical, Pill, Send, Baby, BedDouble, CreditCard, Menu, X, Zap, Battery, MessageSquareCode, Radio } from 'lucide-react';
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
type Language = 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
type Theme = 'light' | 'dark' | 'solar-save';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('FRONT_DESK');
  const [language, setLanguage] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('light');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Solar Power & SMS Gateway states
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [smsLogs, setSmsLogs] = useState<Array<{ type: 'in' | 'out' | 'system'; msg: string; time: string }>>([
    { type: 'system', msg: 'Local GSM Gateway active. Serial interface: COM3 (9600 baud)', time: '11:00 AM' },
    { type: 'out', msg: 'Sent immunization reminder to +234 803 124 5592: "Dada Musa, immunisation checkup schedule tomorrow 8am."', time: '11:05 AM' },
    { type: 'in', msg: 'Received from +234 803 124 5592: "InshaAllah I will bring him."', time: '11:12 AM' },
    { type: 'out', msg: 'Sent ANC follow-up request to +234 809 332 1109: "Antenatal checkup check for Halima Yusuf tomorrow morning."', time: '12:15 PM' }
  ]);
  const [customSms, setCustomSms] = useState('');

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
    },
    YO: {
      switch: "Yi Ede Pada",
      title: "Oju-ọna Gbigba Alaisan",
      subtitle: "Ṣe iwe rẹ ṣaaju ki o to wa si ile-iwosan (PHC)",
      phoneLabel: "Nọmba Foonu",
      sendCode: "Fi Koodu Aabo Ranṣẹ",
      enterOtp: "Tẹ Koodu Aabo",
      verify: "Daju ati Wọle",
      portalTab: "Oju-ọna Alaisan",
      frontDeskTab: "Iduro Iwaju",
      triageTab: "Ayẹwo Alaisan",
      consultationTab: "Ijumọsọrọ OPD",
      labTab: "Yàrá Ayẹwo",
      pharmacyTab: "Ile Elegbogi",
      referralTab: "Itọkasi",
      ancTab: "Itọju Aboyun",
      ipdTab: "Wọọdu Alaisan",
      billingTab: "Isanwo",
      syncPending: "3 Nduro"
    },
    IG: {
      switch: "Gbanwe Asụsụ",
      title: "Ebe Ndebanye Onye Ọrịa",
      subtitle: "Mee bọọkịn gị tupu ị bịa n'ụlọ ọgwụ (PHC)",
      phoneLabel: "Nọmba Ekwentị",
      sendCode: "Zipụ Koodu Nchekwa",
      enterOtp: "Tinye Koodu Nchekwa",
      verify: "Nyochaa ma Banye",
      portalTab: "Ebe Onye Ọrịa",
      frontDeskTab: "Ihu Ọfịs",
      triageTab: "Nnyocha Onye Ọrịa",
      consultationTab: "Ndụmọdụ OPD",
      labTab: "Ụlọ Nyocha",
      pharmacyTab: "Ụlọ Ọgwụ",
      referralTab: "Ntinyeaka",
      ancTab: "Nlekọta Ndị Dị Ime",
      ipdTab: "Wọọdụ Ndị Ọrịa",
      billingTab: "Ịkwụ Ụgwọ",
      syncPending: "3 Na-echere"
    },
    PI: {
      switch: "Change Language",
      title: "Patient Booking Portal",
      subtitle: "Book appointment before you come PHC",
      phoneLabel: "Phone Number",
      sendCode: "Send Security Code",
      enterOtp: "Enter Security Code",
      verify: "Verify & Enter",
      portalTab: "Patient Portal",
      frontDeskTab: "Front Desk",
      triageTab: "Triage",
      consultationTab: "OPD Consultation",
      labTab: "Lab",
      pharmacyTab: "Pharmacy",
      referralTab: "Referral",
      ancTab: "Antenatal Care",
      ipdTab: "Ward",
      billingTab: "Billing",
      syncPending: "3 Pending"
    }
  };

  const toggleTheme = () => setTheme(prev => {
    if (prev === 'solar-save') return 'light';
    return prev === 'light' ? 'dark' : 'light';
  });

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
      <header className="w-full bg-[var(--header-bg)] border-b border-[var(--border-default)] px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30" style={{ boxShadow: 'var(--shadow-sm)' }}>
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


          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-md transition-colors"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="flex items-center relative group">
            <Languages className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] absolute left-2 pointer-events-none transition-colors" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-7 pr-6 py-1.5 bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)] rounded-md transition-colors text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="EN">EN</option>
              <option value="HA">HA</option>
              <option value="YO">YO</option>
              <option value="IG">IG</option>
              <option value="PI">PI</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <svg className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 py-6 flex-1 flex flex-col">
        {theme === 'solar-save' && (
          <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-blue-400 text-xs font-semibold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Deep Solar Save Mode Active. Screen dimming forced, animations paused, background data sync deferred to peak sun hours.</span>
            </div>
            <button 
              onClick={() => setTheme('light')} 
              className="underline hover:text-blue-300 font-bold ml-2 transition"
            >
              Deactivate
            </button>
          </div>
        )}

        {currentScreen === 'PORTAL' && renderPortal()}
        {currentScreen === 'FRONT_DESK' && <FrontDesk language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'TRIAGE' && <Triage language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'CONSULTATION' && <Consultation language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'LABORATORY' && <Laboratory language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'PHARMACY' && <Pharmacy language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'REFERRAL' && <Referral language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'ANC' && <AntenatalCare language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'IPD' && <InpatientWard language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
        {currentScreen === 'BILLING' && <Billing language={language} theme={theme === 'solar-save' ? 'dark' : theme} />}
      </main>

      {/* Local Solar Grid Modal */}
      {isBatteryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-xl w-full max-w-md p-6 overflow-hidden"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Solar Grid & Power Monitor</h3>
              </div>
              <button 
                onClick={() => setIsBatteryModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-default)]">
                  <div className="text-[var(--text-muted)] text-xs font-medium">Battery Status</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1">82% <span className="text-xs text-emerald-500">(Charging)</span></div>
                </div>
                <div className="bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-default)]">
                  <div className="text-[var(--text-muted)] text-xs font-medium">Solar Array Output</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mt-1">1.4 kW</div>
                </div>
                <div className="bg-[var(--input-bg)] p-3 rounded-lg border border-[var(--border-default)] col-span-2">
                  <div className="text-[var(--text-muted)] text-xs font-medium">Grid Source</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] mt-1">Off-Grid (Solar & Inverter Active)</div>
                </div>
              </div>

              {/* Power Graph Illustration */}
              <div className="border border-[var(--border-default)] bg-[var(--queue-bg)] rounded-lg p-3">
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                  <span>Power Generation (24h)</span>
                  <span className="text-amber-500">Peak Sun hours</span>
                </div>
                <div className="h-16 flex items-end gap-1.5 px-2">
                  {[20, 25, 30, 45, 60, 85, 95, 80, 50, 30, 15, 10].map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        idx >= 5 && idx <= 7 ? 'bg-amber-500' : 'bg-[var(--primary)]'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1.5 px-1">
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                </div>
              </div>

              {/* Deep Battery Saver Toggle */}
              <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                    Deep Battery Saver
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Enforces pure black theme, drops dimming alerts & queues sync.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={theme === 'solar-save'}
                    onChange={(e) => {
                      setTheme(e.target.checked ? 'solar-save' : 'light');
                    }}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button 
                onClick={() => setIsBatteryModalOpen(false)}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-2.5 rounded-lg transition"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS & WhatsApp Dispatcher Drawer */}
      {isSmsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          {/* Overlay Click-away */}
          <div className="absolute inset-0 z-[-1]" onClick={() => setIsSmsOpen(false)} />
          
          <div 
            className="w-full max-w-md bg-[var(--card-bg)] border-l border-[var(--border-default)] flex flex-col h-full overflow-hidden"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--header-bg)]">
              <div className="flex items-center gap-2">
                <MessageSquareCode className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">GSM Dispatcher & Triage Sandbox</h3>
                  <p className="text-[10px] text-emerald-500 font-medium">Automatic Patient Reminders & Booking Logs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSmsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SMS log list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--queue-bg)]">
              {smsLogs.map((log, idx) => {
                if (log.type === 'system') {
                  return (
                    <div key={idx} className="text-center text-[10px] text-[var(--text-muted)] bg-[var(--input-bg)] py-1.5 px-3 rounded-full border border-[var(--border-default)] max-w-[90%] mx-auto font-mono">
                      {log.msg}
                    </div>
                  );
                }
                const isOut = log.type === 'out';
                return (
                  <div key={idx} className={`flex flex-col max-w-[85%] ${isOut ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className="text-[9px] text-[var(--text-muted)] mb-1 px-1">{isOut ? 'Outbox' : 'Patient Inbox'} • {log.time}</div>
                    <div 
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isOut 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-[var(--card-bg)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-bl-none'
                      }`}
                    >
                      {log.msg}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input sandbox block */}
            <div className="p-3 border-t border-[var(--border-default)] bg-[var(--card-bg)]">
              <div className="text-[10px] font-bold text-[var(--text-secondary)] mb-2">Simulate Patient SMS Message</div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customSms.trim()) return;
                  const newLogs = [...smsLogs, { type: 'in' as const, msg: customSms, time: 'Now' }];
                  
                  // Simple mock auto-reply triage bot logic
                  let reply = "Thank you. Your message has been received at Wase PHC.";
                  const query = customSms.toLowerCase();
                  if (query.includes('malaria') || query.includes('fever') || query.includes('zazzabi')) {
                    reply = "ALERT: Please visit the PHC for a Malaria Rapid Diagnostic Test (RDT) immediately. Do not take medication without testing.";
                  } else if (query.includes('1') || query.includes('vaccine') || query.includes('penta')) {
                    reply = "CONFIRMED: Your baby's Penta-3 vaccine appointment has been locked in for tomorrow morning.";
                  } else if (query.includes('triage') || query.includes('appointment')) {
                    reply = "BOOKING LOGGED: You are placed at position #3 in the virtual outpatient queue.";
                  }

                  setSmsLogs(newLogs);
                  setCustomSms('');

                  setTimeout(() => {
                    setSmsLogs(prev => [...prev, { type: 'out' as const, msg: reply, time: 'Now' }]);
                  }, 1200);
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={customSms}
                  onChange={(e) => setCustomSms(e.target.value)}
                  placeholder="Try: 'malaria test' or 'penta vaccine'..."
                  className="flex-1 px-3 py-2 text-xs bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md transition text-xs font-semibold shrink-0"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
