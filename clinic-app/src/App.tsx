import { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Activity, Globe } from 'lucide-react';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HA'>('EN'); // English or Hausa

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to Golang Backend (where API keys are safely stored)
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(language === 'EN' ? 'Verification Successful! Welcome to PHC Live.' : 'Tabbatarwa tayi nasara! Barka da zuwa PHC Live.');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLanguage(lang => lang === 'EN' ? 'HA' : 'EN')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Globe size={16} className="text-emerald-400" />
            {language === 'EN' ? 'Switch to Hausa' : 'Koma Turanci'}
          </button>
        </div>

        {/* Main Card */}
        <div className="glass-panel rounded-3xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
              {language === 'EN' ? 'Welcome to PHC Live' : 'Barka da zuwa PHC Live'}
            </h1>
            <p className="text-slate-400 text-sm">
              {language === 'EN' ? 'Securely book your appointment' : 'Yi rajistar ganin likita cikin aminci'}
            </p>
          </div>

          {step === 'PHONE' ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  {language === 'EN' ? 'Phone Number' : 'Lambar Waya'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder={language === 'EN' ? "e.g. 08012345678" : "misali: 08012345678"}
                  />
                </div>
              </div>

              <button
                disabled={loading || !phoneNumber}
                type="submit"
                className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
              >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{language === 'EN' ? 'Send Code' : 'Aika Lambar Sirri'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  {language === 'EN' ? 'Enter Security Code' : 'Saka Lambar Sirri'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-center tracking-[1em] text-2xl font-bold bg-black/20 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="------"
                  />
                </div>
              </div>

              <button
                disabled={loading || otp.length < 6}
                type="submit"
                className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
              >
                 {loading ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{language === 'EN' ? 'Verify & Continue' : 'Tabbatar da Ci Gaba'}</span>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('PHONE')}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors"
              >
                {language === 'EN' ? 'Change Phone Number' : 'Canza Lambar Waya'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by Neon DB</span>
            <span>Zero-Bill Rate Limited</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
