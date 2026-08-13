import React, { useState } from 'react';
import { CreditCard, Search, FileText, CheckCircle, Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface BillingProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

export default function Billing({ language, theme }: BillingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  // Billing Form State
  const [serviceType, setServiceType] = useState('Consultation');
  const [fee, setFee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [insuranceClaim, setInsuranceClaim] = useState('');

  const t = {
    EN: {
      title: "Billing & Financial",
      searchPlaceholder: "Search patient for billing...",
      selectPatient: "Select a patient to process payment",
      serviceType: "Service Type",
      fee: "Fee Charged (₦)",
      paymentMethod: "Payment Method",
      insuranceRef: "Insurance Claim Reference",
      processPayment: "Process Payment",
      paymentSuccess: "Payment Processed Successfully",
      receipt: "Generate Receipt"
    },
    HA: {
      title: "Kudin Asibiti",
      searchPlaceholder: "Nemo marar lafiya...",
      selectPatient: "Zaɓi marar lafiya don biya",
      serviceType: "Irin Aiki",
      fee: "Kudi (₦)",
      paymentMethod: "Hanyar Biya",
      insuranceRef: "Lambar Inshora",
      processPayment: "Karbi Kudi",
      paymentSuccess: "An Karbi Kudi Lafiya",
      receipt: "Bada Rasiti"
    },
    YO: {
      title: "Owo ati Isuna",
      searchPlaceholder: "Wa alaisan fun sisanwo...",
      selectPatient: "Yan alaisan lati sanwo",
      serviceType: "Iru Iṣẹ",
      fee: "Oye (₦)",
      paymentMethod: "Ọna Sisan",
      insuranceRef: "Nọmba Iṣeduro",
      processPayment: "Sanwo",
      paymentSuccess: "Sisanwo Ti Ṣaṣeyọri",
      receipt: "Fa iwe-ẹri jade"
    },
    IG: {
      title: "Ịkwụ Ụgwọ na Ego",
      searchPlaceholder: "Chọọ onye ọrịa maka ịkwụ ụgwọ...",
      selectPatient: "Họrọ onye ọrịa iji kwụọ ụgwọ",
      serviceType: "Ụdị Ọrụ",
      fee: "Ụgwọ (₦)",
      paymentMethod: "Ụzọ Ịkwụ Ụgwọ",
      insuranceRef: "Nọmba Inshọransị",
      processPayment: "Kwụọ Ụgwọ",
      paymentSuccess: "A Kwụọla Ụgwọ Nke Ọma",
      receipt: "WePụta Akwụkwọ Ịkwụ Ụgwọ"
    },
    PI: {
      title: "Billing & Money Matter",
      searchPlaceholder: "Find patient to pay...",
      selectPatient: "Select patient wey wan pay",
      serviceType: "Service Type",
      fee: "Money (₦)",
      paymentMethod: "How you won pay",
      insuranceRef: "Insurance Number",
      processPayment: "Pay Money",
      paymentSuccess: "Payment Don Enter",
      receipt: "Give Receipt"
    }
  };

  const mockPatients = [
    { id: 'PHC-KAN-0045', name: 'Amina Yusuf', pendingAmount: 1500 },
    { id: 'PHC-KAN-0046', name: 'Ibrahim Musa', pendingAmount: 500 }
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t[language].paymentSuccess}!\nReceipt ID: ${uuidv4().split('-')[0].toUpperCase()}`);
    setSelectedPatient(null);
    setFee('');
    setInsuranceClaim('');
  };

  const inputClass = "w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition";
  const labelClass = "block text-[var(--text-secondary)] text-sm mb-1";

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t[language].title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Queue */}
        <div className="lg:col-span-1 bg-[var(--queue-bg)] rounded-lg border border-[var(--border-default)] p-4 overflow-y-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder={t[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition text-sm"
            />
          </div>
          
          <div className="space-y-3">
            {mockPatients.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPatient(p)}
                className={`p-3 rounded-md cursor-pointer transition border ${
                  selectedPatient?.id === p.id 
                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40' 
                    : 'bg-[var(--queue-item-bg)] border-[var(--border-default)] hover:bg-[var(--queue-item-hover)]'
                }`}
              >
                <p className="font-medium text-[var(--text-primary)]">{p.name}</p>
                <div className="flex justify-between mt-1 text-sm text-[var(--text-muted)]">
                  <span>{p.id}</span>
                  <span className="text-red-400">₦{p.pendingAmount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Billing Form */}
        <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-lg border border-[var(--border-default)] p-5 flex flex-col justify-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          {selectedPatient ? (
            <div className="max-w-md w-full mx-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5 text-center">
                {selectedPatient.name} <span className="text-[var(--text-muted)] font-normal ml-2">({selectedPatient.id})</span>
              </h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className={labelClass}>{t[language].serviceType}</label>
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputClass + " appearance-none"}>
                    <option>Consultation</option>
                    <option>Laboratory Test</option>
                    <option>Pharmacy / Drugs</option>
                    <option>Delivery / ANC</option>
                    <option>Immunization</option>
                  </select>
                </div>
                
                <div>
                  <label className={labelClass}>{t[language].fee}</label>
                  <input type="number" required value={fee || selectedPatient.pendingAmount} onChange={(e) => setFee(e.target.value)} className={inputClass} placeholder="e.g. 1500" />
                </div>

                <div>
                  <label className={labelClass}>{t[language].paymentMethod}</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass + " appearance-none"}>
                    <option>Cash</option>
                    <option>POS / Transfer</option>
                    <option>NHIA (Insurance)</option>
                    <option>Free / Exemption</option>
                  </select>
                </div>

                {paymentMethod === 'NHIA (Insurance)' && (
                  <div>
                    <label className={labelClass}>{t[language].insuranceRef}</label>
                    <input type="text" required value={insuranceClaim} onChange={(e) => setInsuranceClaim(e.target.value)} className={inputClass} placeholder="NHIA Enrollee ID" />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full mt-5 bg-[var(--primary)] text-white font-medium py-2.5 rounded-md flex justify-center items-center space-x-2 hover:bg-[var(--primary-hover)] transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{t[language].processPayment}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center text-[var(--text-muted)]">
              <Shield className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-base">{t[language].selectPatient}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
