import React, { useState } from 'react';
import { Search, UserPlus, QrCode, ArrowRight, Activity, Wifi } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FrontDeskProps {
  language: 'EN' | 'HA';
}

export default function FrontDesk({ language }: FrontDeskProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Form State — matches the Data Dictionary from field survey
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [tribe, setTribe] = useState('');
  const [religion, setReligion] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [nextOfKin, setNextOfKin] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');

  const t = {
    EN: {
      title: "Front Desk & Records",
      searchPlaceholder: "Search by Name, Phone, or ID...",
      newPatient: "New Patient",
      scanCard: "Scan Card",
      registerTitle: "Register New Patient",
      firstName: "First Name",
      lastName: "Last Name",
      gender: "Gender",
      age: "Age",
      tribe: "Tribe / Ethnicity",
      religion: "Religion",
      occupation: "Occupation",
      address: "Address (Village / Town / LGA)",
      phone: "Phone Number",
      nextOfKin: "Next of Kin (Name)",
      nextOfKinPhone: "Next of Kin (Phone)",
      registerBtn: "Register & Send to Triage",
      cancel: "Cancel",
      offlineMode: "Offline Mode (LAN Active)",
      queue: "Waiting List",
      selectGender: "Select Gender",
      male: "Male",
      female: "Female",
      selectReligion: "Select Religion",
      islam: "Islam",
      christianity: "Christianity",
      traditional: "Traditional",
      other: "Other"
    },
    HA: {
      title: "Karbar Marasa Lafiya",
      searchPlaceholder: "Nemo da Suna ko Lamba...",
      newPatient: "Sabuwar Rijista",
      scanCard: "Duba Katin",
      registerTitle: "Yi Sabuwar Rijista",
      firstName: "Sunan Farko",
      lastName: "Sunan Mahaifi",
      gender: "Jinsi",
      age: "Shekaru",
      tribe: "Kabila",
      religion: "Addini",
      occupation: "Sana'a / Aiki",
      address: "Adireshin Gida (Ƙauye / Gari / LGA)",
      phone: "Lambar Waya",
      nextOfKin: "Dangi Mafi Kusa (Suna)",
      nextOfKinPhone: "Lambar Waya (Dangi)",
      registerBtn: "Yi Rijista & Tura Triage",
      cancel: "Soke",
      offlineMode: "Babu Intanet (LAN Na Aiki)",
      queue: "Sufar Masu Jiran",
      selectGender: "Zaɓi Jinsi",
      male: "Namiji",
      female: "Mace",
      selectReligion: "Zaɓi Addini",
      islam: "Musulunci",
      christianity: "Kirista",
      traditional: "Gargajiya",
      other: "Wani"
    }
  };

  /** Resets every form field after successful registration */
  const resetForm = () => {
    setFirstName(''); setLastName(''); setGender(''); setAge('');
    setTribe(''); setReligion(''); setOccupation(''); setAddress('');
    setPhone(''); setNextOfKin(''); setNextOfKinPhone('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = uuidv4(); // Offline-safe UUID — no internet needed
    const humanId = `PHC-KAN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    alert(`Patient Registered!\nUUID: ${newId}\nCard ID: ${humanId}\nRouted to Triage Queue.`);
    setIsRegistering(false);
    resetForm();
  };

  /** Shared CSS for input fields to avoid repetition */
  const inputClass = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition";
  const selectClass = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition appearance-none";

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
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <h3 className="text-xl font-bold text-white mb-6">{t[language].registerTitle}</h3>
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Row 1: First Name, Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].firstName}</label>
                <input 
                  type="text" required
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].lastName}</label>
                <input 
                  type="text" required
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Gender, Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].gender}</label>
                <select 
                  required
                  value={gender} onChange={(e) => setGender(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>{t[language].selectGender}</option>
                  <option value="Male">{t[language].male}</option>
                  <option value="Female">{t[language].female}</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].age}</label>
                <input 
                  type="number" required min="0" max="150"
                  value={age} onChange={(e) => setAge(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 34"
                />
              </div>
            </div>

            {/* Row 3: Tribe, Religion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].tribe}</label>
                <input 
                  type="text" required
                  value={tribe} onChange={(e) => setTribe(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Hausa, Yoruba, Igbo"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].religion}</label>
                <select 
                  required
                  value={religion} onChange={(e) => setReligion(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>{t[language].selectReligion}</option>
                  <option value="Islam">{t[language].islam}</option>
                  <option value="Christianity">{t[language].christianity}</option>
                  <option value="Traditional">{t[language].traditional}</option>
                  <option value="Other">{t[language].other}</option>
                </select>
              </div>
            </div>

            {/* Row 4: Occupation, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].occupation}</label>
                <input 
                  type="text"
                  value={occupation} onChange={(e) => setOccupation(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Farmer, Trader, Student"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].phone}</label>
                <input 
                  type="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            {/* Row 5: Address (Full Width) */}
            <div>
              <label className="block text-white/70 text-sm mb-1">{t[language].address}</label>
              <input 
                type="text" required
                value={address} onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                placeholder="e.g. Ungwan Rimi, Kaduna North LGA"
              />
            </div>

            {/* Row 6: Next of Kin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].nextOfKin}</label>
                <input 
                  type="text"
                  value={nextOfKin} onChange={(e) => setNextOfKin(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Halima Abubakar"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">{t[language].nextOfKinPhone}</label>
                <input 
                  type="tel"
                  value={nextOfKinPhone} onChange={(e) => setNextOfKinPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            {/* Action Buttons */}
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
