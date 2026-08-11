import React, { useState } from 'react';
import { Search, UserPlus, QrCode, ArrowRight, Activity, Wifi } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FrontDeskProps {
  language: 'EN' | 'HA';
}

export default function FrontDesk({ language }: FrontDeskProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const t = {
    EN: {
      title: "Front Desk & Records",
      searchPlaceholder: "Search by Name, Phone, or ID...",
      newPatient: "New Patient",
      scanCard: "Scan Card",
      registerTitle: "Register New Patient",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      registerBtn: "Register & Send to Triage",
      cancel: "Cancel",
      offlineMode: "Offline Mode (LAN Active)",
      queue: "Waiting List"
    },
    HA: {
      title: "Karbar Marasa Lafiya",
      searchPlaceholder: "Nemo da Suna ko Lamba...",
      newPatient: "Sabuwar Rijista",
      scanCard: "Duba Katin",
      registerTitle: "Yi Sabuwar Rijista",
      firstName: "Sunan Farko",
      lastName: "Sunan Mahaifi",
      phone: "Lambar Waya",
      registerBtn: "Yi Rijista & Tura Triage",
      cancel: "Soke",
      offlineMode: "Babu Intanet (LAN Na Aiki)",
      queue: "Sufar Masu Jiran"
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = uuidv4(); // Offline-safe UUID
    const humanId = `PHC-KAN-${Math.floor(Math.random() * 10000)}`;
    alert(`Patient Registered!\nUUID: ${newId}\nCard ID: ${humanId}\nRouted to Triage Queue.`);
    setIsRegistering(false);
    setFirstName('');
    setLastName('');
    setPhone('');
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white">{t[language].title}</h2>
          <div className="flex items-center space-x-2 text-emerald-400 mt-1">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">{t[language].offlineMode}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-indigo-500/30 hover:bg-indigo-500/50 text-white px-4 py-2 rounded-xl transition">
            <QrCode className="w-5 h-5" />
            <span>{t[language].scanCard}</span>
          </button>
          <button 
            onClick={() => setIsRegistering(true)}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/30"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t[language].newPatient}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isRegistering ? (
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-white mb-6">{t[language].registerTitle}</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].firstName}</label>
                <input 
                  type="text" required
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].lastName}</label>
                <input 
                  type="text" required
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">{t[language].phone}</label>
              <input 
                type="tel"
                value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)}
                className="w-1/3 bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition"
              >
                {t[language].cancel}
              </button>
              <button 
                type="submit"
                className="w-2/3 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/30 transition"
              >
                <span>{t[language].registerBtn}</span>
                <Activity className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" />
            <input 
              type="text" 
              placeholder={t[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white text-lg focus:outline-none focus:border-emerald-500 transition backdrop-blur-md shadow-inner"
            />
          </div>
          
          <div className="flex-1 bg-black/20 rounded-3xl border border-white/10 p-6">
            <h3 className="text-white/70 font-semibold mb-4">{t[language].queue} (3)</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer">
                  <div>
                    <p className="text-white font-semibold">Fatima Abubakar</p>
                    <p className="text-white/50 text-sm">PHC-KAN-082{i} • +234 803 000 000{i}</p>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
