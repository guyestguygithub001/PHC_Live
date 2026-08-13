import React, { useState, useEffect } from 'react';
import { Search, UserPlus, QrCode, ArrowRight, Activity, Wifi } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FrontDeskProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

export default function FrontDesk({ language, theme }: FrontDeskProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    },
    YO: {
      title: "Ibi Gbigba Alejo & Akosile",
      searchPlaceholder: "Wa pelu Oruko, Nomba, tabi ID...",
      newPatient: "Alaisan Tuntun",
      scanCard: "Sikan Kadi",
      registerTitle: "Forukosile Alaisan Tuntun",
      firstName: "Oruko Akoko",
      lastName: "Oruko Baba",
      gender: "Abo/Ako",
      age: "Ojo ori",
      tribe: "Eya",
      religion: "Esin",
      occupation: "Ise",
      address: "Adiresi (Abule / Ilu / LGA)",
      phone: "Nomba Ero Ibanisoro",
      nextOfKin: "Ebi ti o sunmo julo (Oruko)",
      nextOfKinPhone: "Ebi ti o sunmo julo (Nomba)",
      registerBtn: "Forukosile & Fi ranse si Triage",
      cancel: "Fagilee",
      offlineMode: "Ko si Intaneeti (LAN Nsise)",
      queue: "Akojopo Awon Ti Nduro",
      selectGender: "Yan Abo/Ako",
      male: "Okunrin",
      female: "Obinrin",
      selectReligion: "Yan Esin",
      islam: "Imale",
      christianity: "Igbagbo",
      traditional: "Ibile",
      other: "Miran"
    },
    IG: {
      title: "Ebe Nnabata & Ndekọ",
      searchPlaceholder: "Chọọ aha, ekwentị, ma ọ bụ ID...",
      newPatient: "Onye Ọrịa Ọhụrụ",
      scanCard: "Nyochaa Kaadị",
      registerTitle: "Debanye Onye Ọrịa Ọhụrụ",
      firstName: "Aha Mbụ",
      lastName: "Aha Nna",
      gender: "Mmekọahụ",
      age: "Afọ",
      tribe: "Agbụrụ",
      religion: "Okwukwe",
      occupation: "Ọrụ",
      address: "Adreesị (Obodo / LGA)",
      phone: "Nọmba Ekwentị",
      nextOfKin: "Onye Ikekwu (Aha)",
      nextOfKinPhone: "Onye Ikekwu (Ekwentị)",
      registerBtn: "Debanye & Ziga na Triage",
      cancel: "Kagbuo",
      offlineMode: "Enweghị Ịntanetị (LAN na-arụ ọrụ)",
      queue: "Ndị Na-eche",
      selectGender: "Họrọ Mmekọahụ",
      male: "Nwoke",
      female: "Nwanyị",
      selectReligion: "Họrọ Okwukwe",
      islam: "Alakụba",
      christianity: "Iso Ụzọ Kraịst",
      traditional: "Ọdịnala",
      other: "Ọzọ"
    },
    PI: {
      title: "Front Desk & Records",
      searchPlaceholder: "Search for Name, Phone, or ID...",
      newPatient: "New Patient",
      scanCard: "Scan Card",
      registerTitle: "Register New Patient",
      firstName: "First Name",
      lastName: "Last Name",
      gender: "Gender",
      age: "Age",
      tribe: "Tribe",
      religion: "Religion",
      occupation: "Work",
      address: "Address (Village / Town / LGA)",
      phone: "Phone Number",
      nextOfKin: "Next of Kin (Name)",
      nextOfKinPhone: "Next of Kin (Phone)",
      registerBtn: "Register & Send go Triage",
      cancel: "Cancel",
      offlineMode: "No Internet (LAN dey work)",
      queue: "Waiting List",
      selectGender: "Choose Gender",
      male: "Man",
      female: "Woman",
      selectReligion: "Choose Religion",
      islam: "Muslim",
      christianity: "Christian",
      traditional: "Traditional",
      other: "Other"
    }
  };

  /** Resets every form field after successful registration */
  const resetForm = () => {
    setFirstName(''); setLastName(''); setGender(''); setAge('');
    setTribe(''); setReligion(''); setOccupation(''); setAddress('');
    setPhone(''); setNextOfKin(''); setNextOfKinPhone('');
  };

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3001/api/v1/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      first_name: firstName,
      last_name: lastName,
      gender,
      date_of_birth: age ? new Date(new Date().setFullYear(new Date().getFullYear() - parseInt(age))).toISOString().split('T')[0] : null,
      tribe,
      religion,
      occupation,
      address,
      phone,
      next_of_kin_name: nextOfKin,
      next_of_kin_phone: nextOfKinPhone
    };

    try {
      const res = await fetch('http://localhost:3001/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const newPatient = await res.json();
        alert(`Patient Registered!\nPHC-ID: ${newPatient.phc_id}\nRouted to Triage Queue.`);
        setIsRegistering(false);
        resetForm();
        fetchPatients();
      } else {
        alert("Registration failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Could not register patient.");
    }
  };

  /** Shared CSS classes that respond to the theme via CSS custom properties */
  const inputClass = "w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition";
  const selectClass = inputClass + " appearance-none";
  const labelClass = "block text-[var(--text-secondary)] text-sm mb-1";

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Page Header (No Box) */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t[language].title}</h2>
          <div className="flex items-center space-x-2 text-[var(--primary)] mt-1.5">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">{t[language].offlineMode}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] px-4 py-2.5 rounded-lg transition font-medium">
            <QrCode className="w-5 h-5" />
            <span>{t[language].scanCard}</span>
          </button>
          <button 
            onClick={() => setIsRegistering(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-lg transition shadow-sm font-medium"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t[language].newPatient}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isRegistering ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-5 overflow-y-auto max-h-[calc(100vh-200px)]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">{t[language].registerTitle}</h3>
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Row 1: First Name, Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].firstName}</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t[language].lastName}</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Row 2: Gender, Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].gender}</label>
                <select required value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
                  <option value="" disabled>{t[language].selectGender}</option>
                  <option value="Male">{t[language].male}</option>
                  <option value="Female">{t[language].female}</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t[language].age}</label>
                <input type="number" required min="0" max="150" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} placeholder="e.g. 34" />
              </div>
            </div>

            {/* Row 3: Tribe, Religion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].tribe}</label>
                <input type="text" required value={tribe} onChange={(e) => setTribe(e.target.value)} className={inputClass} placeholder="e.g. Hausa, Yoruba, Igbo" />
              </div>
              <div>
                <label className={labelClass}>{t[language].religion}</label>
                <select required value={religion} onChange={(e) => setReligion(e.target.value)} className={selectClass}>
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
                <label className={labelClass}>{t[language].occupation}</label>
                <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className={inputClass} placeholder="e.g. Farmer, Trader" />
              </div>
              <div>
                <label className={labelClass}>{t[language].phone}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+234 800 000 0000" />
              </div>
            </div>

            {/* Row 5: Address (Full Width) */}
            <div>
              <label className={labelClass}>{t[language].address}</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="e.g. Ungwan Rimi, Kaduna North LGA" />
            </div>

            {/* Row 6: Next of Kin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].nextOfKin}</label>
                <input type="text" value={nextOfKin} onChange={(e) => setNextOfKin(e.target.value)} className={inputClass} placeholder="e.g. Halima Abubakar" />
              </div>
              <div>
                <label className={labelClass}>{t[language].nextOfKinPhone}</label>
                <input type="tel" value={nextOfKinPhone} onChange={(e) => setNextOfKinPhone(e.target.value)} className={inputClass} placeholder="+234 800 000 0000" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)}
                className="w-1/3 bg-[var(--input-bg)] text-[var(--text-primary)] py-2.5 rounded-md hover:opacity-80 transition border border-[var(--border-default)]"
              >
                {t[language].cancel}
              </button>
              <button 
                type="submit"
                className="w-2/3 bg-[var(--primary)] text-white font-medium py-2.5 rounded-md flex justify-center items-center space-x-2 hover:shadow-sm transition"
              >
                <span>{t[language].registerBtn}</span>
                <Activity className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-[var(--card-bg)] rounded-xl border border-[var(--border-default)] flex flex-col overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          {/* Unified Search Header */}
          <div className="p-4 border-b border-[var(--border-default)] bg-[var(--header-bg)]">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder={t[language].searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition"
              />
            </div>
          </div>
          
          {/* Waiting List Body */}
          <div className="flex-1 p-0 overflow-y-auto bg-[var(--queue-bg)]">
            <div className="px-5 py-3 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--card-bg)]">
              <h3 className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wider">{t[language].queue} ({patients.length})</h3>
            </div>
            
            <div className="p-2 space-y-1">
              {isLoading ? (
                <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Loading...</div>
              ) : patients.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]">No patients found.</div>
              ) : (
                patients.map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-[var(--queue-item-bg)] p-3 rounded-lg hover:bg-[var(--queue-item-hover)] transition cursor-pointer group">
                    <div>
                      <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--primary)] transition">{p.first_name} {p.last_name}</p>
                      <p className="text-[var(--text-muted)] text-xs mt-0.5">{p.phc_id} {p.phone ? `• ${p.phone}` : ''}</p>
                    </div>
                    <button className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition p-1">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
