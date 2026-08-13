import React, { useState } from 'react';
import {
  Send, ArrowUpRight, ArrowDownLeft, ClipboardList,
  AlertTriangle, Clock, CheckCircle2, RotateCcw,
  Search, User, Building2, FileText, Mic, Play, Pause, Volume2, Radio
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// ─── Props ─────────────────────────────────────────────────────
interface ReferralProps {
  language: 'EN' | 'HA' | 'YO' | 'IG' | 'PI';
  theme: 'light' | 'dark';
}

// ─── Data Types ────────────────────────────────────────────────
type ReferralStatus = 'Pending Sync' | 'Sent' | 'Received' | 'Counter-Referred';
type UrgencyLevel = 'Routine' | 'Urgent' | 'Emergency';

interface ReferralRecord {
  id: string;
  patient: string;
  destination: string;
  reason: string;
  urgency: UrgencyLevel;
  clinicalSummary: string;
  status: ReferralStatus;
  date: string;
}

interface CounterReferralRecord {
  id: string;
  patient: string;
  fromHospital: string;
  diagnosis: string;
  dischargeNotes: string;
  date: string;
}

// ─── Active View Tabs ──────────────────────────────────────────
type ActiveView = 'form' | 'outgoing' | 'counter' | 'telehealth';

// ─── Component ─────────────────────────────────────────────────
export default function Referral({ language, theme }: ReferralProps) {
  const [activeView, setActiveView] = useState<ActiveView>('form');

  // Referral form state
  const [selectedPatient, setSelectedPatient] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel | ''>('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  // Telehealth / Specialist Consult state
  const [telePatient, setTelePatient] = useState('');
  const [teleSpecialty, setTeleSpecialty] = useState('');
  const [teleQuery, setTeleQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasAudioAttachment, setHasAudioAttachment] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [teleConsults, setTeleConsults] = useState<Array<{
    id: string;
    patient: string;
    specialty: string;
    query: string;
    audio: boolean;
    status: 'Pending Sync' | 'Uploaded' | 'Reviewed';
    response?: string;
    date: string;
  }>>([
    {
      id: 'TEL-0982-1',
      patient: 'Musa Garba',
      specialty: 'Dermatology',
      query: 'Patient presented with a severe maculopapular rash spreading on the lower back, unresponsive to standard antihistamines.',
      audio: true,
      status: 'Reviewed',
      response: 'Voice response from Dr. Bello (Chief Dermatologist, JUTH): "Ina kwana, I reviewed the skin lesion notes. This looks like a drug-induced eruption rather than eczema. Stop all current meds, start hydrocortisone cream twice daily and monitor vitals. Keep us updated."',
      date: 'Yesterday'
    }
  ]);

  // ─── Translations ──────────────────────────────────────────
  const t = {
    EN: {
      title: "Referral Module",
      subtitle: "PHC → General Hospital",
      tabForm: "New Referral",
      tabOutgoing: "Outgoing Referrals",
      tabCounter: "Counter-Referrals",
      // Form labels
      selectPatient: "Select Patient",
      patientPlaceholder: "Choose a patient...",
      destination: "Destination Hospital",
      destinationPlaceholder: "Search hospital...",
      recommended: "Recommended for this reason",
      reason: "Reason for Referral",
      reasonPlaceholder: "Select reason...",
      clinicalSummary: "Clinical Summary",
      clinicalPlaceholder: "Patient presented with...",
      urgency: "Urgency Level",
      urgencyPlaceholder: "Select urgency...",
      generateBtn: "Generate Referral",
      // Urgency levels
      routine: "Routine",
      urgent: "Urgent",
      emergency: "Emergency",
      // Reasons
      obstructedLabour: "Obstructed Labour",
      severeMalaria: "Severe Malaria (Cerebral)",
      surgicalEmergency: "Surgical Emergency",
      hypertensiveCrisis: "Hypertensive Crisis",
      other: "Other",
      // Outgoing table
      patient: "Patient",
      destinationCol: "Destination",
      reasonCol: "Reason",
      status: "Status",
      date: "Date",
      noReferrals: "No outgoing referrals yet.",
      // Status labels
      pendingSync: "Pending Sync",
      sent: "Sent",
      received: "Received",
      counterReferred: "Counter-Referred",
      // Counter-referral
      counterTitle: "Incoming Feedback from General Hospitals",
      fromHospital: "From Hospital",
      diagnosis: "Diagnosis",
      dischargeNotes: "Discharge Notes",
      noCounterReferrals: "No counter-referral feedback yet.",
      // Validation
      fillAllFields: "Please fill in all required fields.",
      cho: "CHO: Dr. Ibrahim",
    },
    HA: {
      title: "Tura Mara Lafiya",
      subtitle: "PHC → Babban Asibiti",
      tabForm: "Sabuwar Tura",
      tabOutgoing: "Jerin Tura Da Aka Yi",
      tabCounter: "Amsar Babban Asibiti",
      // Form labels
      selectPatient: "Zaɓi Mara Lafiya",
      patientPlaceholder: "Zaɓi mara lafiya...",
      destination: "Babban Asibiti",
      destinationPlaceholder: "Nemo asibiti...",
      recommended: "An ba da shawarar ga wannan dalili",
      reason: "Dalilin Tura",
      reasonPlaceholder: "Zaɓi dalili...",
      clinicalSummary: "Bayanin Lafiya",
      clinicalPlaceholder: "Mara lafiya ya/ta zo da...",
      urgency: "Matakin Gaggawa",
      urgencyPlaceholder: "Zaɓi mataki...",
      generateBtn: "Ƙirƙiri Takardar Tura",
      // Urgency levels
      routine: "Na Yau Da Kullum",
      urgent: "Mai Gaggawa",
      emergency: "Gaggawa",
      // Reasons
      obstructedLabour: "Wahalar Haihuwa",
      severeMalaria: "Zazzabin Cizon Sauro Mai Tsanani",
      surgicalEmergency: "Tiyata Na Gaggawa",
      hypertensiveCrisis: "Hawan Jini Mai Tsanani",
      other: "Wani Dalili",
      // Outgoing table
      patient: "Mara Lafiya",
      destinationCol: "Babban Asibiti",
      reasonCol: "Dalilin Tura",
      status: "Matsayi",
      date: "Kwanan Wata",
      noReferrals: "Babu turawa da aka yi tukuna.",
      // Status labels
      pendingSync: "Ana Jira",
      sent: "An Aika",
      received: "An Karɓa",
      counterReferred: "An Mayar",
      // Counter-referral
      counterTitle: "Amsar Sallama daga Babban Asibiti",
      fromHospital: "Daga Asibiti",
      diagnosis: "Cutar Da Aka Gano",
      dischargeNotes: "Bayanan Sallama",
      noCounterReferrals: "Babu amsar sallama tukuna.",
      // Validation
      fillAllFields: "Da fatan za a cika dukkan filayen da ake bukata.",
      cho: "CHO: Dr. Ibrahim",
    },
    YO: {
      title: "Eto Ifiranṣẹ",
      subtitle: "PHC → Ile-iwosan Gbogbogbo",
      tabForm: "Ifiranṣẹ Tuntun",
      tabOutgoing: "Awọn Ifiranṣẹ Ti A Firanṣẹ",
      tabCounter: "Idahun Lati Ile-iwosan",
      selectPatient: "Yan Alaisan",
      patientPlaceholder: "Yan alaisan kan...",
      destination: "Ile-iwosan Ti A Nlo",
      destinationPlaceholder: "Wa ile-iwosan...",
      recommended: "A gba ni niyanju fun idi eyi",
      reason: "Idi Fun Ifiranṣẹ",
      reasonPlaceholder: "Yan idi...",
      clinicalSummary: "Akokari Ile-iwosan",
      clinicalPlaceholder: "Alaisan wa pẹlu...",
      urgency: "Ipele Kanju",
      urgencyPlaceholder: "Yan ipele kanju...",
      generateBtn: "Ṣẹda Ifiranṣẹ",
      routine: "Deede",
      urgent: "Ni Kanjukanju",
      emergency: "Pajawiri",
      obstructedLabour: "Iṣoro Ibimọ",
      severeMalaria: "Iba Malaria Ti O Lagbara",
      surgicalEmergency: "Iṣẹ-abẹ Pajawiri",
      hypertensiveCrisis: "Ẹjẹ Riru Ti O Lagbara",
      other: "Omiiran",
      patient: "Alaisan",
      destinationCol: "Ibi Ti A Nlo",
      reasonCol: "Idi",
      status: "Ipo",
      date: "Ọjọ",
      noReferrals: "Ko si ifiranṣẹ ti a firanṣẹ sibẹ.",
      pendingSync: "Nduro Lati Sopọ",
      sent: "Ti Firanṣẹ",
      received: "Ti Gba",
      counterReferred: "Ti Da Pada",
      counterTitle: "Esi Lati Ile-iwosan Gbogbogbo",
      fromHospital: "Lati Ile-iwosan",
      diagnosis: "Aisan Ti A Ṣawari",
      dischargeNotes: "Akiyesi Itusilẹ",
      noCounterReferrals: "Ko si esi idahun kankan sibẹ.",
      fillAllFields: "Jọwọ fọwọsi gbogbo awọn alafo ti a beere.",
      cho: "CHO: Dr. Ibrahim",
    },
    IG: {
      title: "Ngalaba Ntinye",
      subtitle: "PHC → Ụlọ Ọgwụ Ọha",
      tabForm: "Ntinye Ọhụrụ",
      tabOutgoing: "Ntinye Ndị E Zipụrụ",
      tabCounter: "Nzaghachi Ntinye",
      selectPatient: "Họrọ Onye Ọrịa",
      patientPlaceholder: "Họrọ onye ọrịa...",
      destination: "Ụlọ Ọgwụ A Na-aga",
      destinationPlaceholder: "Chọọ ụlọ ọgwụ...",
      recommended: "Akwadoro maka ihe kpatara ya",
      reason: "Ihe Mere E Ji Efe",
      reasonPlaceholder: "Họrọ ihe kpatara ya...",
      clinicalSummary: "Nchịkọta Ahụike",
      clinicalPlaceholder: "Onye ọrịa bịara na...",
      urgency: "Ọkwa Ngwa Ngwa",
      urgencyPlaceholder: "Họrọ ọkwa ngwa ngwa...",
      generateBtn: "Mepụta Ntinye",
      routine: "Nke Oge Niile",
      urgent: "Ngwa Ngwa",
      emergency: "Mberede",
      obstructedLabour: "Ihe Isi Ike Ịmụ Nwa",
      severeMalaria: "Ịba Dị Ike",
      surgicalEmergency: "Mberede Ịwa Ahụ",
      hypertensiveCrisis: "Ọbara Mgbali Elu Dị Ike",
      other: "Ọzọ",
      patient: "Onye Ọrịa",
      destinationCol: "Ebe A Na-aga",
      reasonCol: "Ihe Kpatara",
      status: "Ọnọdụ",
      date: "Ụbọchị",
      noReferrals: "Enweghị ntinye e zipụrụ ugbu a.",
      pendingSync: "Na-echere Njikọ",
      sent: "E Zipụla",
      received: "Anatawo",
      counterReferred: "E Weghachitela",
      counterTitle: "Nzaghachi Site Na Ụlọ Ọgwụ Ọha",
      fromHospital: "Site Na Ụlọ Ọgwụ",
      diagnosis: "Ọrịa A Chọpụtara",
      dischargeNotes: "Ihe Edeturu Maka Ịpụ",
      noCounterReferrals: "Enweghị nzaghachi ntinye ọ bụla ugbu a.",
      fillAllFields: "Biko dejupụta ebe niile achọrọ.",
      cho: "CHO: Dr. Ibrahim",
    },
    PI: {
      title: "Referral Module",
      subtitle: "PHC → General Hospital",
      tabForm: "New Referral",
      tabOutgoing: "Referral Wey We Don Send",
      tabCounter: "Reply From Hospital",
      selectPatient: "Select Patient",
      patientPlaceholder: "Choose patient...",
      destination: "Where Dem Go",
      destinationPlaceholder: "Search hospital...",
      recommended: "Better for this matter",
      reason: "Why We Dey Refer",
      reasonPlaceholder: "Select why...",
      clinicalSummary: "Wetin Do Di Patient",
      clinicalPlaceholder: "Patient come with...",
      urgency: "How Urgent E Be",
      urgencyPlaceholder: "Select how urgent...",
      generateBtn: "Make Referral",
      routine: "Normal",
      urgent: "Urgent",
      emergency: "Emergency",
      obstructedLabour: "Hard Labour",
      severeMalaria: "Strong Malaria",
      surgicalEmergency: "Emergency Surgery",
      hypertensiveCrisis: "High BP",
      other: "Other Matter",
      patient: "Patient",
      destinationCol: "Where Dem Go",
      reasonCol: "Why",
      status: "Status",
      date: "Date",
      noReferrals: "No referral don go outside yet.",
      pendingSync: "E Never Send",
      sent: "We Don Send Am",
      received: "Dem Don Collect",
      counterReferred: "Dem Don Reply",
      counterTitle: "Reply From General Hospital",
      fromHospital: "From Hospital",
      diagnosis: "Wetin Dem See",
      dischargeNotes: "Discharge Book",
      noCounterReferrals: "No reply don come yet.",
      fillAllFields: "Abeg fill all di spaces wey dem ask for.",
      cho: "CHO: Dr. Ibrahim",
    },
  };

  // ─── Mock Data ─────────────────────────────────────────────

  /** Mock patients available for referral */
  const mockPatients = [
    { id: 'PHC-KAN-0821', name: 'Fatima Abubakar' },
    { id: 'PHC-KAN-0822', name: 'Musa Garba' },
    { id: 'PHC-KAN-0823', name: 'Halima Yusuf' },
    { id: 'PHC-KAN-0824', name: 'Ibrahim Danladi' },
  ];

  /** Destination hospitals with Smart Clinic / EMR capabilities */
  const hospitals = [
    // Kaduna
    { name: 'Barau Dikko Teaching Hospital', state: 'Kaduna', specialties: ['Surgical Emergency', 'Obstructed Labour', 'Hypertensive Crisis'], capabilities: ['EMR Active'] },
    { name: 'Ahmadu Bello University Teaching Hospital', state: 'Kaduna', specialties: ['Surgical Emergency', 'Severe Malaria (Cerebral)', 'Hypertensive Crisis'], capabilities: ['Smart Clinic'] },
    { name: 'General Hospital Kaduna', state: 'Kaduna', specialties: ['Obstructed Labour', 'Severe Malaria (Cerebral)'], capabilities: ['EMR Active'] },
    { name: 'General Hospital Zaria', state: 'Kaduna', specialties: ['Obstructed Labour'], capabilities: ['EMR Active'] },
    { name: '44 Nigerian Army Reference Hospital', state: 'Kaduna', specialties: ['Surgical Emergency', 'Trauma'], capabilities: ['API Gateway'] },
    { name: 'St. Gerard\'s Catholic Hospital Kaduna', state: 'Kaduna', specialties: ['Obstructed Labour'], capabilities: ['EMR Active'] },
    // Plateau
    { name: 'Jos University Teaching Hospital (JUTH)', state: 'Plateau', specialties: ['Surgical Emergency', 'Severe Malaria (Cerebral)', 'Hypertensive Crisis'], capabilities: ['Smart Clinic'] },
    { name: 'Plateau State Specialist Hospital', state: 'Plateau', specialties: ['Obstructed Labour', 'Surgical Emergency'], capabilities: ['EMR Active'] },
    { name: 'Bingham University Teaching Hospital', state: 'Plateau', specialties: ['Obstructed Labour', 'Hypertensive Crisis'], capabilities: ['EMR Active'] },
    // Federal / Others
    { name: 'National Hospital Abuja', state: 'FCT', specialties: ['Surgical Emergency', 'Severe Malaria (Cerebral)', 'Hypertensive Crisis', 'Obstructed Labour'], capabilities: ['API Gateway'] },
    { name: 'Federal Medical Centre Katsina', state: 'Katsina', specialties: ['Severe Malaria (Cerebral)', 'Obstructed Labour'], capabilities: ['EMR Active'] }
  ];

  /** Reasons for referral — maps to both EN and HA labels */
  const reasons = [
    { value: 'Obstructed Labour', en: 'Obstructed Labour', ha: 'Wahalar Haihuwa' },
    { value: 'Severe Malaria (Cerebral)', en: 'Severe Malaria (Cerebral)', ha: 'Zazzabin Cizon Sauro Mai Tsanani' },
    { value: 'Surgical Emergency', en: 'Surgical Emergency', ha: 'Tiyata Na Gaggawa' },
    { value: 'Hypertensive Crisis', en: 'Hypertensive Crisis', ha: 'Hawan Jini Mai Tsanani' },
    { value: 'Other', en: 'Other', ha: 'Wani Dalili' },
  ];

  /** Urgency levels with translation keys */
  const urgencyLevels: { value: UrgencyLevel; en: string; ha: string }[] = [
    { value: 'Routine', en: 'Routine', ha: 'Na Yau Da Kullum' },
    { value: 'Urgent', en: 'Urgent', ha: 'Mai Gaggawa' },
    { value: 'Emergency', en: 'Emergency', ha: 'Gaggawa' },
  ];

  /** Pre-seeded outgoing referrals for demo purposes */
  const [outgoingReferrals, setOutgoingReferrals] = useState<ReferralRecord[]>([
    {
      id: 'REF-2026-0001',
      patient: 'Fatima Abubakar',
      destination: 'General Hospital Kaduna',
      reason: 'Obstructed Labour',
      urgency: 'Emergency',
      clinicalSummary: 'Patient presented with prolonged labour >24hrs, cervix dilated 6cm, no progression.',
      status: 'Sent',
      date: '2026-08-10',
    },
    {
      id: 'REF-2026-0002',
      patient: 'Musa Garba',
      destination: 'Barau Dikko Teaching Hospital',
      reason: 'Severe Malaria (Cerebral)',
      urgency: 'Emergency',
      clinicalSummary: 'Patient presented with high-grade fever, convulsions, and altered consciousness. RDT positive.',
      status: 'Pending Sync',
      date: '2026-08-11',
    },
    {
      id: 'REF-2026-0003',
      patient: 'Halima Yusuf',
      destination: 'General Hospital Zaria',
      reason: 'Hypertensive Crisis',
      urgency: 'Urgent',
      clinicalSummary: 'BP 210/130 mmHg, headache, blurred vision. Sublingual nifedipine administered at PHC.',
      status: 'Received',
      date: '2026-08-09',
    },
  ]);

  /** Incoming counter-referral feedback from general hospitals */
  const counterReferrals: CounterReferralRecord[] = [
    {
      id: 'CR-2026-0001',
      patient: 'Aisha Mohammed',
      fromHospital: 'General Hospital Kaduna',
      diagnosis: 'Ectopic Pregnancy — Managed Surgically',
      dischargeNotes: 'Patient had successful salpingectomy. Stable post-op day 5. Continue oral antibiotics (Amoxicillin 500mg TDS x 7 days). Follow-up at PHC in 2 weeks. Advise on contraceptive options.',
      date: '2026-08-08',
    },
    {
      id: 'CR-2026-0002',
      patient: 'Bala Suleiman',
      fromHospital: 'Barau Dikko Teaching Hospital',
      diagnosis: 'Cerebral Malaria — Resolved',
      dischargeNotes: 'Patient received IV Artesunate x 3 days, then ACT oral. Parasitaemia cleared. Discharged stable. Recheck PCV at PHC in 1 week. Educate on LLIN use.',
      date: '2026-08-07',
    },
  ];

  // ─── Handlers ──────────────────────────────────────────────

  /** Validates form and generates a new referral with offline UUID */
  const handleGenerateReferral = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation — all fields required
    if (!selectedPatient || !destination || !reason || !urgency || !clinicalSummary.trim()) {
      alert(t[language].fillAllFields);
      return;
    }

    // Generate offline-safe UUID for the referral
    const referralUUID = uuidv4();
    const humanId = `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Find the patient name from the selected ID
    const patientName = mockPatients.find(p => p.id === selectedPatient)?.name || selectedPatient;

    // Create the new referral record
    const newReferral: ReferralRecord = {
      id: humanId,
      patient: patientName,
      destination,
      reason,
      urgency: urgency as UrgencyLevel,
      clinicalSummary,
      status: 'Pending Sync', // Offline-first: always starts as pending
      date: new Date().toISOString().split('T')[0],
    };

    // Add to the outgoing list
    setOutgoingReferrals(prev => [newReferral, ...prev]);

    // Show confirmation alert with the referral ID
    alert(
      `✅ Referral Generated!\n\n` +
      `Referral ID: ${humanId}\n` +
      `UUID: ${referralUUID}\n` +
      `Patient: ${patientName}\n` +
      `Destination: ${destination}\n` +
      `Urgency: ${urgency}\n\n` +
      `Status: Pending Sync — will be sent when connectivity is available.`
    );

    // Reset the form
    setSelectedPatient('');
    setDestination('');
    setReason('');
    setClinicalSummary('');
    setUrgency('');

    // Switch to outgoing view so the CHO can see the new entry
    setActiveView('outgoing');
  };

  // ─── Shared Styles ────────────────────────────────────────
  const inputClass = "w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition";
  const selectClass = inputClass + " appearance-none";
  const labelClass = "block text-[var(--text-secondary)] text-sm mb-1 font-medium";

  // ─── Status Badge Renderer ────────────────────────────────
  /** Returns a themed badge for referral status */
  const renderStatusBadge = (status: ReferralStatus) => {
    const statusConfig: Record<ReferralStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      'Pending Sync': {
        bg: 'bg-yellow-500/15',
        text: 'text-yellow-600',
        icon: <Clock className="w-3.5 h-3.5" />,
        label: t[language].pendingSync,
      },
      'Sent': {
        bg: 'bg-blue-500/15',
        text: 'text-blue-500',
        icon: <Send className="w-3.5 h-3.5" />,
        label: t[language].sent,
      },
      'Received': {
        bg: 'bg-[var(--primary)]/8',
        text: 'text-[var(--primary)]',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: t[language].received,
      },
      'Counter-Referred': {
        bg: 'bg-purple-500/15',
        text: 'text-purple-500',
        icon: <RotateCcw className="w-3.5 h-3.5" />,
        label: t[language].counterReferred,
      },
    };

    const cfg = statusConfig[status];
    return (
      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}
        <span>{cfg.label}</span>
      </span>
    );
  };

  // ─── Urgency Badge Renderer ───────────────────────────────
  /** Colour-coded urgency indicators */
  const renderUrgencyBadge = (level: UrgencyLevel) => {
    const config: Record<UrgencyLevel, { bg: string; text: string }> = {
      Routine: { bg: 'bg-[var(--primary)]/8', text: 'text-[var(--primary)]' },
      Urgent: { bg: 'bg-orange-500/15', text: 'text-orange-500' },
      Emergency: { bg: 'bg-red-500/15', text: 'text-red-500' },
    };
    const cfg = config[level];
    const label = urgencyLevels.find(u => u.value === level)?.[language === 'HA' ? 'ha' : 'en'] || level;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {level === 'Emergency' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {label}
      </span>
    );
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-default)]"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center space-x-3">
          <ArrowUpRight className="w-8 h-8 text-indigo-500" />
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t[language].title}</h2>
            <p className="text-sm text-[var(--text-muted)]">{t[language].subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] bg-[var(--input-bg)] px-4 py-2 rounded-md border border-[var(--border-default)]">
          <User className="w-5 h-5 text-[var(--primary)]" />
          <span>{t[language].cho}</span>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {/* New Referral Tab */}
        <button
          onClick={() => setActiveView('form')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-semibold text-sm transition border ${
            activeView === 'form'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--card-bg-hover)]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{t[language].tabForm}</span>
        </button>
        {/* Outgoing Referrals Tab */}
        <button
          onClick={() => setActiveView('outgoing')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-semibold text-sm transition border ${
            activeView === 'outgoing'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--card-bg-hover)]'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{t[language].tabOutgoing}</span>
          {/* Badge showing count */}
          <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full">
            {outgoingReferrals.length}
          </span>
        </button>
        {/* Counter-Referral Tab */}
        <button
          onClick={() => setActiveView('counter')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-semibold text-sm transition border ${
            activeView === 'counter'
              ? 'bg-purple-500 text-white border-purple-500 shadow-sm'
              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--card-bg-hover)]'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>{t[language].tabCounter}</span>
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
            {counterReferrals.length}
          </span>
        </button>
        {/* Telehealth Tab */}
        <button
          onClick={() => setActiveView('telehealth')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-semibold text-sm transition border ${
            activeView === 'telehealth'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--card-bg-hover)]'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Specialist Consults</span>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
            {teleConsults.length}
          </span>
        </button>
      </div>

      {/* ── View Content ────────────────────────────────────── */}

      {/* ════════════════════════════════════════════════════════
          VIEW 1: New Referral Form
         ════════════════════════════════════════════════════════ */}
      {activeView === 'form' && (
        <div
          className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-5 overflow-y-auto max-h-[calc(100vh-280px)]"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <form onSubmit={handleGenerateReferral} className="space-y-5">

            {/* Row 1: Patient Selector & Destination Hospital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].selectPatient}</label>
                <select
                  required
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>{t[language].patientPlaceholder}</option>
                  {mockPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.id}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className={labelClass}>{t[language].destination}</label>
                <div 
                  className="relative"
                  onClick={() => setIsDestinationOpen(true)}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required={!destination}
                    value={destinationSearch || destination}
                    onChange={(e) => {
                      setDestinationSearch(e.target.value);
                      setIsDestinationOpen(true);
                      if (destination) setDestination('');
                    }}
                    onFocus={() => setIsDestinationOpen(true)}
                    placeholder={t[language].destinationPlaceholder}
                    className="w-full pl-9 pr-8 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
                  />
                  {destination && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setDestination(''); setDestinationSearch(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--danger)]"
                    >
                      &times;
                    </button>
                  )}
                </div>
                
                {isDestinationOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-md max-h-60 overflow-auto" style={{ boxShadow: 'var(--shadow-elevated)' }}>
                    {/* Dark background click-away overlay hack for simplicity in this demo */}
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsDestinationOpen(false)}></div>
                    
                    {hospitals
                      .filter(h => h.name.toLowerCase().includes(destinationSearch.toLowerCase()) || h.state.toLowerCase().includes(destinationSearch.toLowerCase()))
                      .sort((a, b) => {
                        // Sort recommended hospitals to the top if a reason is selected
                        if (reason) {
                          const aRec = a.specialties.includes(reason);
                          const bRec = b.specialties.includes(reason);
                          if (aRec && !bRec) return -1;
                          if (!aRec && bRec) return 1;
                        }
                        return 0;
                      })
                      .map((h, i) => {
                        const isRecommended = reason && h.specialties.includes(reason);
                        return (
                          <div 
                            key={i}
                            onClick={() => {
                              setDestination(`${h.name} (${h.state})`);
                              setDestinationSearch(`${h.name} (${h.state})`);
                              setIsDestinationOpen(false);
                            }}
                            className="p-3 hover:bg-[var(--card-bg-hover)] cursor-pointer border-b border-[var(--border-default)] last:border-0 transition"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-[var(--text-primary)]">{h.name}</div>
                                <div className="text-xs text-[var(--text-muted)] mt-0.5">{h.state} State • {h.capabilities.join(', ')}</div>
                              </div>
                              {isRecommended && (
                                <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-green-500/20 whitespace-nowrap ml-2">
                                  {t[language].recommended || "Recommended"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                    })}
                    {hospitals.filter(h => h.name.toLowerCase().includes(destinationSearch.toLowerCase()) || h.state.toLowerCase().includes(destinationSearch.toLowerCase())).length === 0 && (
                      <div className="p-3 text-[var(--text-muted)] text-sm text-center">No hospitals found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Reason for Referral & Urgency Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t[language].reason}</label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>{t[language].reasonPlaceholder}</option>
                  {reasons.map(r => (
                    <option key={r.value} value={r.value}>
                      {language === 'HA' ? r.ha : r.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t[language].urgency}</label>
                <select
                  required
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className={selectClass}
                >
                  <option value="" disabled>{t[language].urgencyPlaceholder}</option>
                  {urgencyLevels.map(u => (
                    <option key={u.value} value={u.value}>
                      {language === 'HA' ? u.ha : u.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Clinical Summary (full width) */}
            <div>
              <label className={labelClass}>{t[language].clinicalSummary}</label>
              <textarea
                required
                rows={4}
                value={clinicalSummary}
                onChange={(e) => setClinicalSummary(e.target.value)}
                placeholder={t[language].clinicalPlaceholder}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Urgency Visual Indicator — shows colour when selected */}
            {urgency && (
              <div className={`flex items-center space-x-3 p-3 rounded-md border ${
                urgency === 'Emergency'
                  ? 'bg-red-500/10 border-red-500/30'
                  : urgency === 'Urgent'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-[var(--primary)]/5 border-[var(--primary)]/20'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  urgency === 'Emergency' ? 'text-red-500' : urgency === 'Urgent' ? 'text-orange-500' : 'text-[var(--primary)]'
                }`} />
                <span className={`text-sm font-semibold ${
                  urgency === 'Emergency' ? 'text-red-500' : urgency === 'Urgent' ? 'text-orange-500' : 'text-[var(--primary)]'
                }`}>
                  {t[language].urgency}: {urgencyLevels.find(u => u.value === urgency)?.[language === 'HA' ? 'ha' : 'en']}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-2.5 rounded-md flex justify-center items-center space-x-2 hover:shadow-sm transition text-lg"
              >
                <Send className="w-5 h-5" />
                <span>{t[language].generateBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          VIEW 2: Outgoing Referrals List
         ════════════════════════════════════════════════════════ */}
      {activeView === 'outgoing' && (
        <div
          className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {outgoingReferrals.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>{t[language].noReferrals}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].patient}
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].destinationCol}
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].reasonCol}
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].urgency}
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].status}
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t[language].date}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingReferrals.map((ref) => (
                    <tr
                      key={ref.id}
                      className="border-b border-[var(--border-default)] hover:bg-[var(--queue-item-hover)] transition"
                    >
                      {/* Patient */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[var(--text-primary)] font-semibold text-sm">{ref.patient}</p>
                          <p className="text-[var(--text-muted)] text-xs">{ref.id}</p>
                        </div>
                      </td>
                      {/* Destination */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-[var(--text-secondary)] text-sm">{ref.destination}</span>
                        </div>
                      </td>
                      {/* Reason */}
                      <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                        {language === 'HA'
                          ? reasons.find(r => r.value === ref.reason)?.ha || ref.reason
                          : ref.reason
                        }
                      </td>
                      {/* Urgency */}
                      <td className="px-6 py-4">
                        {renderUrgencyBadge(ref.urgency)}
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        {renderStatusBadge(ref.status)}
                      </td>
                      {/* Date */}
                      <td className="px-6 py-4 text-[var(--text-muted)] text-sm">
                        {ref.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          VIEW 3: Counter-Referral Feedback
         ════════════════════════════════════════════════════════ */}
      {activeView === 'counter' && (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center space-x-2">
            <ArrowDownLeft className="w-5 h-5 text-purple-500" />
            <span>{t[language].counterTitle}</span>
          </h3>

          {counterReferrals.length === 0 ? (
            <div
              className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-12 text-center text-[var(--text-muted)]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>{t[language].noCounterReferrals}</p>
            </div>
          ) : (
            counterReferrals.map((cr) => (
              <div
                key={cr.id}
                className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-4"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                {/* Counter-referral header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-[var(--text-primary)] font-semibold">{cr.patient}</p>
                      <p className="text-[var(--text-muted)] text-xs">{cr.id}</p>
                    </div>
                  </div>
                  {/* Counter-referred status badge */}
                  {renderStatusBadge('Counter-Referred')}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">{t[language].fromHospital}</p>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span className="text-[var(--text-primary)] text-sm font-medium">{cr.fromHospital}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">{t[language].diagnosis}</p>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{cr.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">{t[language].date}</p>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{cr.date}</p>
                  </div>
                </div>

                {/* Discharge notes */}
                <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4">
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2">{t[language].dischargeNotes}</p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{cr.dischargeNotes}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          VIEW 4: Specialist Consults (Telehealth)
         ════════════════════════════════════════════════════════ */}
      {activeView === 'telehealth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* New Consult Request Form */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-xl p-5 space-y-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div>
              <h3 className="text-md font-bold text-[var(--text-primary)]">New Specialist Consultation</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Package clinical summaries and media attachments to forward to tertiary institutions asynchronously.</p>
            </div>
            
            <div className="space-y-4">
              {/* Select Patient */}
              <div>
                <label className={labelClass}>Patient</label>
                <select
                  value={telePatient}
                  onChange={(e) => setTelePatient(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Choose a patient...</option>
                  {mockPatients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              {/* Select Specialty */}
              <div>
                <label className={labelClass}>Target Specialty Department</label>
                <select
                  value={teleSpecialty}
                  onChange={(e) => setTeleSpecialty(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select specialty...</option>
                  <option value="Dermatology">Dermatology (JUTH Reference)</option>
                  <option value="Pediatrics">Pediatrics (ABUTH Reference)</option>
                  <option value="Cardiology">Cardiology (National Hospital)</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology (Maternity)</option>
                </select>
              </div>

              {/* Case Query Notes */}
              <div>
                <label className={labelClass}>Clinical Query Notes</label>
                <textarea
                  rows={4}
                  value={teleQuery}
                  onChange={(e) => setTeleQuery(e.target.value)}
                  placeholder="Describe symptoms, vital history, and what diagnostic input you need from the specialist..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition resize-none"
                />
              </div>

              {/* Audio/Video Attachment Sandbox */}
              <div className="border border-[var(--border-default)] rounded-lg p-4 bg-[var(--queue-bg)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Voice Memo / Heart Sound Attachment</span>
                  {hasAudioAttachment && (
                    <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Ready</span>
                  )}
                </div>

                {!isRecording && !hasAudioAttachment && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecording(true);
                      setRecordingSeconds(0);
                      const timer = setInterval(() => {
                        setRecordingSeconds(s => {
                          if (s >= 10) {
                            clearInterval(timer);
                            setIsRecording(false);
                            setHasAudioAttachment(true);
                            return 0;
                          }
                          return s + 1;
                        });
                      }, 1000);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] py-2.5 rounded-lg border border-[var(--primary)]/25 transition text-xs font-medium cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-[var(--primary)]" />
                    Record Audio Attachment (Simulate)
                  </button>
                )}

                {isRecording && (
                  <div className="bg-[var(--card-bg)] border border-[var(--border-default)] p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                      <span className="text-xs font-bold text-red-500">Recording... 0:0{recordingSeconds}</span>
                    </div>
                    {/* Simulated Waveform animation */}
                    <div className="flex items-center gap-1">
                      {[15, 30, 20, 45, 10, 35, 15, 25, 40].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-red-500 rounded-full animate-pulse" 
                          style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {hasAudioAttachment && (
                  <div className="bg-[var(--card-bg)] border border-[var(--border-default)] p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="p-1.5 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] rounded-full transition"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-medium text-[var(--text-primary)]">clinical_attachment_01.wav</div>
                        <div className="text-[10px] text-[var(--text-muted)]">Size: 180 KB • Duration: 0:10</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setHasAudioAttachment(false); setIsPlayingAudio(false); }}
                      className="text-[var(--text-muted)] hover:text-red-500 text-xs font-bold px-2 py-1 hover:bg-red-500/10 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!telePatient || !teleSpecialty || !teleQuery) {
                    alert('Please complete the consultation details.');
                    return;
                  }
                  const newConsult = {
                    id: `TEL-${Math.floor(1000 + Math.random() * 9000)}-${teleConsults.length + 1}`,
                    patient: telePatient,
                    specialty: teleSpecialty,
                    query: teleQuery,
                    audio: hasAudioAttachment,
                    status: 'Pending Sync' as const,
                    date: 'Just Now'
                  };
                  setTeleConsults([newConsult, ...teleConsults]);
                  setTelePatient('');
                  setTeleSpecialty('');
                  setTeleQuery('');
                  setHasAudioAttachment(false);
                  setIsPlayingAudio(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition text-xs flex justify-center items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Queue Consult Request
              </button>
            </div>
          </div>

          {/* Outbox & Consultations History Queue */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Telehealth consult history</h3>
            {teleConsults.map((consult) => {
              const isReviewed = consult.status === 'Reviewed';
              const isPending = consult.status === 'Pending Sync';
              return (
                <div 
                  key={consult.id}
                  className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-xl p-4 space-y-3"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-sm">{consult.patient}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{consult.id} • {consult.specialty} Department</div>
                    </div>
                    <span 
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        isReviewed 
                          ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                          : isPending
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}
                    >
                      {consult.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">"{consult.query}"</p>

                  {isReviewed && consult.response && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Specialist Diagnosis & Directions</span>
                        <button 
                          onClick={() => {
                            if (activePlaybackId === consult.id) {
                              setActivePlaybackId(null);
                            } else {
                              setActivePlaybackId(consult.id);
                            }
                          }}
                          className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                        >
                          {activePlaybackId === consult.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          {activePlaybackId === consult.id ? 'Stop Playing' : 'Listen Response'}
                        </button>
                      </div>
                      
                      {activePlaybackId === consult.id && (
                        <div className="flex items-center gap-1.5 p-1 rounded bg-[var(--card-bg)] border border-emerald-500/30">
                          <Volume2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                          <div className="h-1 flex-1 bg-emerald-100 rounded overflow-hidden">
                            <div className="h-full bg-emerald-500 w-1/2 animate-[pulse_1.5s_infinite]" />
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">{consult.response}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
