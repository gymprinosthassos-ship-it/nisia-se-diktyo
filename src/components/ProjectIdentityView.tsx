import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  GraduationCap, 
  Compass, 
  Anchor, 
  ScrollText, 
  MonitorPlay, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  ArrowDown,
  Layers,
  GitMerge,
  Globe,
  BookOpen,
  Ship,
  Landmark,
  Lightbulb,
  UserCheck,
  CheckCircle2,
  Edit3,
  X,
  Plus,
  Trash2,
  UserPlus,
  FolderPlus,
  ShieldCheck,
  Lock,
  Headphones,
  Play
} from 'lucide-react';
import { DigitalNarratorModal } from './DigitalNarratorModal';
import type { Team } from '../types/database.types';
import { islandParticipantsData, type IslandParticipants } from '../data/participantsData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface ProjectIdentityViewProps {
  teams: Team[];
  onNavigateToTab: (tab: 'timeline' | 'map' | 'teams' | 'teachers') => void;
}

export const ProjectIdentityView: React.FC<ProjectIdentityViewProps> = ({ onNavigateToTab }) => {
  // Αρχική κατάσταση με ανάγνωση από localStorage ως γρήγορη προσωρινή μνήμη
  const [participants, setParticipants] = useState<IslandParticipants[]>(() => {
    try {
      const saved = localStorage.getItem('nisia_participants_data_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return islandParticipantsData;
  });

  const [isEditingNames, setIsEditingNames] = useState<boolean>(false);
  const [editSchoolId, setEditSchoolId] = useState<'school-prinos' | 'school-chania'>('school-prinos');
  const [tempParticipants, setTempParticipants] = useState<IslandParticipants[]>(participants);
  const [saveNotification, setSaveNotification] = useState<string>('');
  const [securityPin, setSecurityPin] = useState<string>('');
  const [isNarratorOpen, setIsNarratorOpen] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  

  // Αυτόματη ανάκτηση συμμετεχόντων από τη ζωντανή βάση δεδομένων Supabase
  useEffect(() => {
    async function fetchLiveParticipants() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('project_participants')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted: IslandParticipants[] = data.map((row: any) => ({
            schoolId: row.school_id,
            island: row.island,
            schoolName: row.school_name,
            region: row.region,
            teachers: row.teachers || [],
            teams: row.teams || []
          }));
          const sorted = formatted.sort((a, b) => (a.schoolId === 'school-prinos' ? -1 : (b.schoolId === 'school-prinos' ? 1 : 0)));
          setParticipants(sorted);
          try {
            localStorage.setItem('nisia_participants_data_v4', JSON.stringify(formatted));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error fetching participants from Supabase:', err);
      }
    }

    fetchLiveParticipants();
  }, []);

  const handleOpenEdit = (schoolId: 'school-prinos' | 'school-chania') => {
    setEditSchoolId(schoolId);
    setTempParticipants(JSON.parse(JSON.stringify(participants)));
    setSecurityPin('');
    setPinError('');
    setIsEditingNames(true);
  };

  const handleSaveEdit = async () => {
    if (securityPin.trim() !== '64010') {
      setPinError('Λάθος κωδικός ασφαλείας! Απαιτείται ο έγκυρος κωδικός (PIN: 64010) για την αλλαγή οποιουδήποτε πεδίου.');
      return;
    }
    setPinError('');
    setParticipants(tempParticipants);
    setIsEditingNames(false);

    // Αποθήκευση τοπικά
    try {
      localStorage.setItem('nisia_participants_data_v4', JSON.stringify(tempParticipants));
    } catch {
      // ignore
    }

    // Ζωντανή αποθήκευση στη βάση Supabase (για όλους τους χρήστες)
    if (isSupabaseConfigured()) {
      try {
        const payload = tempParticipants.map(item => ({
          id: item.schoolId,
          school_id: item.schoolId,
          island: item.island,
          school_name: item.schoolName,
          region: item.region,
          teachers: item.teachers,
          teams: item.teams,
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('project_participants')
          .upsert(payload);

        if (error) {
          console.error('Error saving participants to Supabase:', error);
          setSaveNotification('Αποθηκεύτηκε τοπικά (σφάλμα δικτύου)');
        } else {
          setSaveNotification('Οι αλλαγές αποθηκεύτηκαν ζωντανά στη βάση δεδομένων!');
        }
      } catch (err) {
        console.error('Supabase save error:', err);
        setSaveNotification('Αποθηκεύτηκε τοπικά');
      }
    } else {
      setSaveNotification('Οι αλλαγές αποθηκεύτηκαν!');
    }

    
    setTimeout(() => setSaveNotification(''), 4000);
  };

  const handleResetDefaults = async () => {
    const pin = window.prompt('Εισάγετε τον Κωδικό Ασφαλείας (PIN) για επαναφορά στις αρχικές ρυθμίσεις:');
    if (pin !== '64010') {
      alert('Λάθος κωδικός ασφαλείας! Η επαναφορά ακυρώθηκε.');
      return;
    }
    if (window.confirm('Είστε σίγουροι ότι θέλετε επαναφορά στις αρχικές ρυθμίσεις;')) {
      setParticipants(islandParticipantsData);
      localStorage.removeItem('nisia_participants_data_v4');
      setIsEditingNames(false);

      if (isSupabaseConfigured()) {
        try {
          const payload = islandParticipantsData.map(item => ({
            id: item.schoolId,
            school_id: item.schoolId,
            island: item.island,
            school_name: item.schoolName,
            region: item.region,
            teachers: item.teachers,
            teams: item.teams,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('project_participants').upsert(payload);
          setSaveNotification('Έγινε επαναφορά στις αρχικές ρυθμίσεις στη βάση!');
          setTimeout(() => setSaveNotification(''), 4000);
        } catch (err) {
          console.error('Reset error:', err);
        }
      }
    }
  };

    // --- Χειριστές Διαχείρισης Εκπαιδευτικών ---
  const handleAddTeacher = () => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target) {
        target.teachers.push({
          name: '',
          role: 'Συντονιστής Εκπαιδευτικός'
        });
      }
      return copy;
    });
  };

  const handleRemoveTeacher = (tIdx: number) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teachers.length > 1) {
        target.teachers.splice(tIdx, 1);
      }
      return copy;
    });
  };

  const handleTeacherChange = (tIdx: number, field: 'name' | 'role', value: string) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teachers[tIdx]) {
        target.teachers[tIdx][field] = value;
      }
      return copy;
    });
  };

  // --- Χειριστές Διαχείρισης Ομάδων ---
  const handleAddTeam = () => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target) {
        const isThasos = editSchoolId === 'school-prinos';
        const nextNum = target.teams.length + 1;
        const wingCode = isThasos ? (nextNum <= 4 ? 'Α' : 'Β') : 'Γ';
        const wingTitle = isThasos 
          ? (nextNum <= 4 ? 'ΠΤΕΡΥΓΑ Α — ΑΡΧΕΙΑΚΗ ΕΡΕΥΝΑ' : 'ΠΤΕΡΥΓΑ Β — ΨΗΦΙΑΚΗ ΔΗΜΙΟΥΡΓΙΑ')
          : 'ΠΤΕΡΥΓΑ Γ — ΧΑΝΙΑ';
        target.teams.push({
          wing: wingCode as any,
          wingTitle,
          code: `${wingCode}${nextNum}`,
          name: `Νέα Μαθητική Ομάδα ${wingCode}${nextNum}`,
          students: ["(1) Νέος Μαθητής", "(2) Νέος Μαθητής"]
        });
      }
      return copy;
    });
  };

  const handleRemoveTeam = (tmIdx: number) => {
    if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ομάδα;')) return;
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams.length > 1) {
        target.teams.splice(tmIdx, 1);
      }
      return copy;
    });
  };

  const handleTeamMetaChange = (tmIdx: number, field: 'code' | 'name', value: string) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams[tmIdx]) {
        target.teams[tmIdx][field] = value;
      }
      return copy;
    });
  };

  // --- Χειριστές Διαχείρισης Μαθητών μέσα σε Ομάδα ---
  const handleAddStudent = (tmIdx: number) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams[tmIdx]) {
        target.teams[tmIdx].students.push('');
      }
      return copy;
    });
  };

  const handleRemoveStudent = (tmIdx: number, sIdx: number) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams[tmIdx] && target.teams[tmIdx].students.length > 1) {
        target.teams[tmIdx].students.splice(sIdx, 1);
      }
      return copy;
    });
  };

  const handleStudentChange = (tmIdx: number, sIdx: number, value: string) => {
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams[tmIdx]) {
        target.teams[tmIdx].students[sIdx] = value;
      }
      return copy;
    });
  };

  const [bulkModeMap, setBulkModeMap] = useState<Record<string, boolean>>({});
  const toggleBulkMode = (code: string) => {
    setBulkModeMap(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const handleBulkStudentsChange = (tmIdx: number, text: string) => {
    const list = text.split(',').map(s => s.trim()).filter(Boolean);
    setTempParticipants(prev => {
      const copy: IslandParticipants[] = JSON.parse(JSON.stringify(prev));
      const target = copy.find(p => p.schoolId === editSchoolId);
      if (target && target.teams[tmIdx]) {
        target.teams[tmIdx].students = list;
      }
      return copy;
    });
  };

  // Διασφαλίζουμε ότι η Θάσος είναι πάντα στα αριστερά (1η) και τα Χανιά στα δεξιά (2α)
  const orderedParticipants = [...participants].sort((a, b) => (a.schoolId === 'school-prinos' ? -1 : (b.schoolId === 'school-prinos' ? 1 : 0)));

  const currentEditIsland = tempParticipants.find(p => p.schoolId === editSchoolId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Toast Notification */}
      {saveNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Κεντρική Επικεφαλίδα Ταυτότητας */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/80 text-amber-950 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>ΤΑΥΤΟΤΗΤΑ & ΣΚΟΠΟΣ ΕΡΓΑΣΤΗΡΙΟΥ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
          Διασχολικό Εργαστήριο Ψηφιακής Τοπικής Ιστορίας
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-serif italic">
          «ΝΗΣΙΑ ΣΕ ΔΙΚΤΥΟ: Θάσος & Κρήτη στην Οθωμανική Μεσόγειο του Μεχμέτ Αλή (19ος Αιώνας)»
        </p>
      </div>

      {/* Banner Ψηφιακού Ξεναγού */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-white">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
            <Headphones className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Νεα Διαδραστικη Εμπειρια</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Ψηφιακός Ξεναγός: Το Ταξίδι των Ιστορικών Δεσμών
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Ακολουθήστε τη φωνή της ιστορίας σε 4 κομβικούς σταθμούς μεταξύ Θάσου και Χανίων με φωνητική αφήγηση και αρχειακά τεκμήρια.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNarratorOpen(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2.5 hover:scale-105 transform shrink-0"
        >
          <Play className="w-4 h-4 ml-0.5" />
          <span>Έναρξη Ψηφιακού Ξεναγού</span>
        </button>
      </div>

      {/* Συνεργαζόμενα Σχολεία - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Σχολείο 1: Γυμνάσιο Πρίνου */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-lg transition">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Anchor className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>ΒΟΡΕΙΟ ΑΙΓΑΙΟ • ΘΑΣΟΣ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Γυμνάσιο Πρίνου Θάσου
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Πρίνος, Θάσος (Περιφέρεια Ανατολικής Μακεδονίας & Θράκης)
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-start gap-2 text-xs">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Συντονισμός Εκπαιδευτικών:</strong>
                <p className="text-slate-600 mt-0.5">
                  Στυλιανή Λεπίδα, Αναστάσιος Καλλίνικος, Φίλιππος Παπαγεωργίου, Χαλίλ Αλ Χανάκτε
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <ScrollText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Συμμετοχή στο Έργο:</strong>
                <p className="text-slate-600 mt-0.5">
                  <strong>Α΄ Πτέρυγα (Αρχειακή Έρευνα) & Β΄ Πτέρυγα (Ψηφιακή Δημιουργία):</strong> 8 Μαθητικές υποομάδες έρευνας πηγών, ιστοσελίδας, αρχείων και παραγωγής.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Σχολείο 2: 3ο ΓΕΛ Χανίων */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-lg transition">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>ΝΟΤΙΑ ΜΕΣΟΓΕΙΟΣ • ΚΡΗΤΗ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                3ο Γενικό Λύκειο Χανίων
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Χανιά, Κρήτη (Περιφέρεια Κρήτης)
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-start gap-2 text-xs">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Συντονισμός Εκπαιδευτικών:</strong>
                <p className="text-slate-600 mt-0.5">
                  Υπεύθυνοι καθηγητές & συντονιστές του 3ου ΓΕΛ Χανίων
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <MonitorPlay className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Συμμετοχή στο Έργο:</strong>
                <p className="text-slate-600 mt-0.5">
                  <strong>Συνεργαζόμενη Σχολική Μονάδα Κρήτης:</strong> Παράλληλη τοπική έρευνα στις 4 καθορισμένες θεματικές για την περίοδο της Αιγυπτιοκρατίας στην Κρήτη (1830–1840).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΤΑ ΤΡΙΑ ΣΤΑΔΙΑ ΤΗΣ ΕΡΕΥΝΗΤΙΚΗΣ ΔΙΑΔΙΚΑΣΙΑΣ */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-amber-200/90 shadow-md space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>ΜΕΘΟΔΟΛΟΓΙΑ & ΣΧΕΔΙΑΣΜΟΣ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Τα Τρία Στάδια της Ερευνητικής Διαδικασίας
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-serif">
            Πώς συνεργάζονται τα δύο σχολεία: από την τοπική έρευνα πηγών έως την κοινή ψηφιακή σύνθεση
          </p>
        </div>

        {/* Διάγραμμα 3 Σταδίων */}
        <div className="space-y-6">
          {/* 1ο ΣΤΑΔΙΟ */}
          <div className="relative bg-gradient-to-br from-amber-50/60 to-white border-2 border-amber-300/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-amber-200">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  1
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                    1ο ΣΤΑΔΙΟ | ΠΑΡΑΛΛΗΛΗ ΤΟΠΙΚΗ ΕΡΕΥΝΑ
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                    Έρευνα ανά Σχολική Μονάδα
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-200 w-fit">
                <span>Γυμνάσιο Πρίνου Θάσου • Θάσος</span>
                <span>⟷</span>
                <span>3ο ΓΕΛ Χανίων • Κρήτη</span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-700 italic font-serif">
              Κάθε σχολείο μελετά την ιστορία του τόπου του με βάση τις τέσσερις ήδη καθορισμένες θεματικές, συλλέγοντας, καταχωρώντας και τεκμηριώνοντας ιστορικές πηγές.
            </p>

            {/* Οι 4 Καθορισμένες Θεματικές */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
              <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    1. Κοινωνία και καθημερινή ζωή στη Θάσο/Κρήτη
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Αναζητούμε πληροφορίες για την κοινωνία, τις συνήθειες και τη ζωή των κατοίκων τον 19ο αιώνα.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    2. Ο Μεχμέτ Αλής και η Θάσος/Κρήτη
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Μελετούμε τη σχέση του Μεχμέτ Αλή με το νησί, την εξουσία και τη διοίκηση.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    3. Εμπόριο, λιμάνια και μεσογειακά δίκτυα
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Εξερευνούμε τις θαλάσσιες διαδρομές και τις εμπορικές συνδέσεις της Θάσου και της Κρήτης.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    4. Αρχιτεκτονική και υλικός πολιτισμός
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Μελετούμε κτίρια, αντικείμενα και άλλα υλικά ίχνη του παρελθόντος.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Βέλος Μετάβασης 1 -> 2 */}
          <div className="flex justify-center -my-2">
            <div className="w-8 h-8 rounded-full bg-amber-200/80 border border-amber-400 text-amber-900 flex items-center justify-center shadow-sm">
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 2ο ΣΤΑΔΙΟ */}
          <div className="relative bg-gradient-to-br from-blue-50/60 to-white border-2 border-blue-300/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
              <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
                2
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                  2ο ΣΤΑΔΙΟ | ΚΟΙΝΗ ΣΥΝΘΕΣΗ ΚΑΙ ΣΥΓΚΡΙΣΗ
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  Συνάντηση των Ευρημάτων των Δύο Σχολείων
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                <GitMerge className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                Οι μαθητές αντιπαραβάλλουν τα αποτελέσματα ανά θεματική, εντοπίζουν ομοιότητες, διαφορές και ιστορικές συνδέσεις και διαμορφώνουν κοινά συμπεράσματα.
              </p>
            </div>
          </div>

          {/* Βέλος Μετάβασης 2 -> 3 */}
          <div className="flex justify-center -my-2">
            <div className="w-8 h-8 rounded-full bg-blue-200/80 border border-blue-400 text-blue-900 flex items-center justify-center shadow-sm">
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 3ο ΣΤΑΔΙΟ */}
          <div className="relative bg-gradient-to-br from-emerald-50/60 to-white border-2 border-emerald-300/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-emerald-200">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow">
                3
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                  3ο ΣΤΑΔΙΟ | ΚΟΙΝΗ ΨΗΦΙΑΚΗ ΠΑΡΟΥΣΙΑΣΗ
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  «Νησιά σε Δίκτυο» — Κοινός Διαδραστικός Ιστότοπος
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                Η συγκριτική ιστορική αφήγηση παρουσιάζεται μέσα από κείμενα, τεκμήρια, οπτικοακουστικό υλικό και διαδραστικό χάρτη.
              </p>
            </div>
          </div>
        </div>

        {/* Σημείωση — Η Λογική της Συγκριτικής Προσέγγισης */}
        <div className="bg-amber-100/60 border-l-4 border-amber-600 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>ΣΗΜΕΙΩΣΗ — Η ΛΟΓΙΚΗ ΤΗΣ ΣΥΓΚΡΙΤΙΚΗΣ ΠΡΟΣΕΓΓΙΣΗΣ</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-serif text-justify">
            «Η σύγκριση δεν πρέπει να περιοριστεί σε μια απλή καταγραφή ομοιοτήτων και διαφορών. Θα πρέπει να επιχειρήσει να εξηγήσει γιατί η αιγυπτιακή διοίκηση είχε διαφορετικά χαρακτηριστικά και συνέπειες στα δύο νησιά, λαμβάνοντας υπόψη τις διαφορετικές ιστορικές συνθήκες.»
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΧΩΡΟΣ ΑΝΑΓΡΑΦΗΣ ΟΝΟΜΑΤΩΝ ΚΑΘΗΓΗΤΩΝ & ΜΑΘΗΤΩΝ ΑΝΑ ΝΗΣΙ */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>ΣΥΜΜΕΤΕΧΟΝΤΕΣ ΑΝΑ ΝΗΣΙ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Καθηγητές & Μαθητικές Ομάδες Εργασίας
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ονόματα των υπεύθυνων εκπαιδευτικών και των μαθητών ανά νησί (Θάσος: Πτέρυγες Α & Β • Κρήτη: Ερευνητικές Ομάδες Χανίων)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenEdit('school-prinos')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition shadow-sm"
              title="Επεξεργασία ονομάτων Θάσου"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Επεξεργασία Θάσου</span>
            </button>
            <button
              onClick={() => handleOpenEdit('school-chania')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition shadow-sm"
              title="Επεξεργασία ονομάτων Κρήτης"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-700" />
              <span>Επεξεργασία Κρήτης</span>
            </button>
          </div>
        </div>

        {/* 2 ΣΤΗΛΕΣ ΑΝΑ ΝΗΣΙ (ΘΑΣΟΣ & ΚΡΗΤΗ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {orderedParticipants.map((island) => {
            const isThasos = island.schoolId === 'school-prinos';
            const wingAGroups = island.teams.filter(t => t.wing === 'Α');
            const wingBGroups = island.teams.filter(t => t.wing === 'Β');
            const extraGroups = island.teams.filter(t => t.wing !== 'Α' && t.wing !== 'Β');

            return (
              <div 
                key={island.schoolId}
                className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Header Σχολείου & Νησιού */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isThasos ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {isThasos ? <Anchor className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className={`${isThasos ? 'text-amber-400' : 'text-blue-400'} text-xs font-bold uppercase tracking-wider block`}>
                          {island.schoolName} ({island.teams.length} Ομάδες)
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white">
                          {island.schoolName}
                        </h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Έδρα: <strong>{island.island}</strong> ({island.region})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(island.schoolId as 'school-prinos' | 'school-chania')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Επεξεργασία Ονομάτων"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Εκπαιδευτικοί Συντονιστές */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span>Εκπαιδευτικοί Συντονιστές {isThasos ? 'Θάσου' : 'Χανίων'} ({island.teachers.length})</span>
                    </div>

                    <div className="space-y-2">
                      {island.teachers.map((teacher, tIdx) => (
                        <div 
                          key={tIdx} 
                          className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">
                              {tIdx + 1}
                            </span>
                            <strong className="text-slate-100 font-serif text-sm">
                              {teacher.name}
                            </strong>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {teacher.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Μαθητικές Ομάδες σε Πτέρυγες (Και για Θάσο και για Χανιά) */}
                  <div className="space-y-6">
                    {/* ΠΤΕΡΥΓΑ Α */}
                    {wingAGroups.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 px-1 border-b border-slate-800/80 pb-1.5">
                          <ScrollText className="w-4 h-4 text-amber-400" />
                          <span>Πτέρυγα Α — Αρχειακή Έρευνα ({wingAGroups.length} Ομάδες)</span>
                        </div>

                        <div className="space-y-3">
                          {wingAGroups.map((group) => (
                            <div 
                              key={group.code}
                              className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-800/70">
                                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                                  Ομάδα {group.code}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {isThasos ? 'Θάσος' : 'Χανιά'}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                                {group.name}
                              </h4>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Σύνθεση & Υπεύθυνοι Ομάδας:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {group.students.map((student, sIdx) => {
                                    const isLeader1 = student.startsWith('(1)');
                                    const isLeader2 = student.startsWith('(2)');
                                    const cleanName = student.replace(/^\([12]\)\s*/, '');

                                    return (
                                      <span 
                                        key={sIdx}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                          isLeader1 
                                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 font-semibold shadow-sm'
                                            : isLeader2
                                            ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 font-semibold shadow-sm'
                                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        {isLeader1 ? (
                                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            1
                                          </span>
                                        ) : isLeader2 ? (
                                          <span className="w-4 h-4 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            2
                                          </span>
                                        ) : (
                                          <UserCheck className="w-3 h-3 text-slate-500" />
                                        )}
                                        <span>{cleanName}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ΠΤΕΡΥΓΑ Β */}
                    {wingBGroups.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 px-1 border-b border-slate-800/80 pb-1.5">
                          <MonitorPlay className="w-4 h-4 text-blue-400" />
                          <span>Πτέρυγα Β — Ψηφιακή Δημιουργία & Πεδίο ({wingBGroups.length} Ομάδες)</span>
                        </div>

                        <div className="space-y-3">
                          {wingBGroups.map((group) => (
                            <div 
                              key={group.code}
                              className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-blue-500/40 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-800/70">
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-xs">
                                  Ομάδα {group.code}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {isThasos ? 'Θάσος' : 'Χανιά'}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                                {group.name}
                              </h4>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Σύνθεση & Υπεύθυνοι Ομάδας:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {group.students.map((student, sIdx) => {
                                    const isLeader1 = student.startsWith('(1)');
                                    const isLeader2 = student.startsWith('(2)');
                                    const cleanName = student.replace(/^\([12]\)\s*/, '');

                                    return (
                                      <span 
                                        key={sIdx}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                          isLeader1 
                                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 font-semibold shadow-sm'
                                            : isLeader2
                                            ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 font-semibold shadow-sm'
                                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        {isLeader1 ? (
                                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            1
                                          </span>
                                        ) : isLeader2 ? (
                                          <span className="w-4 h-4 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            2
                                          </span>
                                        ) : (
                                          <UserCheck className="w-3 h-3 text-slate-500" />
                                        )}
                                        <span>{cleanName}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ΛΟΙΠΕΣ ΟΜΑΔΕΣ */}
                    {extraGroups.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 px-1 border-b border-slate-800/80 pb-1.5">
                          <Compass className="w-4 h-4 text-emerald-400" />
                          <span>Ερευνητικές Ομάδες ({extraGroups.length} Ομάδες)</span>
                        </div>

                        <div className="space-y-3">
                          {extraGroups.map((group) => (
                            <div 
                              key={group.code}
                              className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-emerald-500/40 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-800/70">
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
                                  Ομάδα {group.code}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {isThasos ? 'Θάσος' : 'Χανιά'}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                                {group.name}
                              </h4>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Σύνθεση & Υπεύθυνοι Ομάδας:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {group.students.map((student, sIdx) => {
                                    const isLeader1 = student.startsWith('(1)');
                                    const isLeader2 = student.startsWith('(2)');
                                    const cleanName = student.replace(/^\([12]\)\s*/, '');

                                    return (
                                      <span 
                                        key={sIdx}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                          isLeader1 
                                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 font-semibold shadow-sm'
                                            : isLeader2
                                            ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 font-semibold shadow-sm'
                                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        {isLeader1 ? (
                                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            1
                                          </span>
                                        ) : isLeader2 ? (
                                          <span className="w-4 h-4 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px] shadow">
                                            2
                                          </span>
                                        ) : (
                                          <UserCheck className="w-3 h-3 text-slate-500" />
                                        )}
                                        <span>{cleanName}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Κάρτας Σχολείου */}
                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{island.teams.length} Μαθητικές Ομάδες σε Πτέρυγες</span>
                  <button
                    onClick={() => handleOpenEdit(island.schoolId as 'school-prinos' | 'school-chania')}
                    className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                  >
                    <span>Επεξεργασία / Προσθήκη</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL ΕΠΕΞΕΡΓΑΣΙΑΣ ΟΝΟΜΑΤΩΝ ΚΑΘΗΓΗΤΩΝ & ΜΑΘΗΤΩΝ */}
      {/* ============================================================== */}
      {isEditingNames && currentEditIsland && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Διαχείριση Συμμετεχόντων: {currentEditIsland.schoolName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Προσθέστε ή αφαιρέστε πλαίσια για εκπαιδευτικούς, ομάδες και μαθητές.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingNames(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 1. ΕΚΠΑΙΔΕΥΤΙΚΟΙ ΣΥΝΤΟΝΙΣΤΕΣ */}
            <div className="space-y-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-700" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Εκπαιδευτικοί Συντονιστές ({currentEditIsland.teachers.length})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddTeacher}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Προσθήκη Εκπαιδευτικού</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentEditIsland.teachers.map((teacher, tIdx) => (
                  <div 
                    key={tIdx} 
                    className="p-3.5 bg-white rounded-xl border border-amber-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-2.5"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                      {tIdx + 1}
                    </span>

                    <div className="flex-1 w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Ονοματεπώνυμο Εκπαιδευτικού
                      </label>
                      <input
                        type="text"
                        value={teacher.name}
                        placeholder="π.χ. Μαρία Παπαδοπούλου"
                        onChange={(e) => handleTeacherChange(tIdx, 'name', e.target.value)}
                        className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="w-full sm:w-64">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Ρόλος / Ειδικότητα
                      </label>
                      <input
                        type="text"
                        value={teacher.role}
                        placeholder="π.χ. Συντονιστής Εκπαιδευτικός"
                        onChange={(e) => handleTeacherChange(tIdx, 'role', e.target.value)}
                        className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTeacher(tIdx)}
                      disabled={currentEditIsland.teachers.length <= 1}
                      title="Αφαίρεση Εκπαιδευτικού"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded-lg transition self-end sm:self-center mt-2 sm:mt-4 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ΜΑΘΗΤΙΚΕΣ ΟΜΑΔΕΣ & ΜΑΘΗΤΕΣ */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-700" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Μαθητικές Ομάδες ({currentEditIsland.teams.length})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Προσθήκη Νέας Ομάδας</span>
                </button>
              </div>

              <div className="space-y-4">
                {currentEditIsland.teams.map((team, tmIdx) => {
                  const isBulk = Boolean(bulkModeMap[team.code || tmIdx]);

                  return (
                    <div 
                      key={team.code || tmIdx} 
                      className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                    >
                      {/* Team Header Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={team.code}
                            title="Κωδικός Ομάδας"
                            onChange={(e) => handleTeamMetaChange(tmIdx, 'code', e.target.value)}
                            className="w-16 text-center text-xs font-bold px-2 py-1.5 rounded-lg bg-blue-100 text-blue-900 border border-blue-200 focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={team.name}
                            placeholder="Όνομα / Θέμα Ομάδας"
                            onChange={(e) => handleTeamMetaChange(tmIdx, 'name', e.target.value)}
                            className="flex-1 sm:w-80 text-xs font-bold p-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => toggleBulkMode(team.code || String(tmIdx))}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium"
                          >
                            {isBulk ? 'Προβολή ανά μαθητή' : 'Μαζική επεξεργασία (κείμενο)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTeam(tmIdx)}
                            disabled={currentEditIsland.teams.length <= 1}
                            title="Διαγραφή Ομάδας"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Students inside Team */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            <span>Μαθητές Ομάδας ({team.students.length})</span>
                          </label>
                          {!isBulk && (
                            <button
                              type="button"
                              onClick={() => handleAddStudent(tmIdx)}
                              className="inline-flex items-center gap-1 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-2.5 py-1 rounded-lg transition"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Προσθήκη Μαθητή</span>
                            </button>
                          )}
                        </div>

                        {isBulk ? (
                          <textarea
                            rows={3}
                            value={team.students.join(', ')}
                            onChange={(e) => handleBulkStudentsChange(tmIdx, e.target.value)}
                            placeholder="π.χ. (1) Ιλόι Χυσμπατράμι, (2) Ρέα Μαγδαληνού, Ειρήνη Βαρέτο..."
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-sans bg-white"
                          />
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {team.students.map((student, sIdx) => (
                              <div 
                                key={sIdx}
                                className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-blue-300 transition"
                              >
                                <span className="text-[10px] font-bold text-slate-400 w-4 text-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={student}
                                  placeholder="Όνομα μαθητή"
                                  onChange={(e) => handleStudentChange(tmIdx, sIdx, e.target.value)}
                                  className="flex-1 text-xs px-1.5 py-1 rounded border-0 focus:ring-1 focus:ring-blue-500 font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStudent(tmIdx, sIdx)}
                                  disabled={team.students.length <= 1}
                                  title="Αφαίρεση Μαθητή"
                                  className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 rounded transition shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

                        {/* 3. ΚΩΔΙΚΟΣ ΑΣΦΑΛΕΙΑΣ ΓΙΑ ΑΠΟΘΗΚΕΥΣΗ */}
            <div className={`p-4 rounded-2xl border-2 transition ${pinError ? 'bg-rose-50 border-rose-300' : 'bg-slate-100 border-slate-300'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${pinError ? 'bg-rose-100 text-rose-700' : 'bg-amber-500 text-slate-950 font-bold'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Κωδικός Ασφαλείας Έργου (PIN)</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Απαιτείται ο 5-ψήφιος κωδικός για την αποθήκευση οποιασδήποτε αλλαγής σε εκπαιδευτικούς, ομάδες ή μαθητές.
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-56">
                  <input
                    type="password"
                    value={securityPin}
                    onChange={(e) => {
                      setSecurityPin(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    placeholder="Εισάγετε PIN..."
                    className="w-full text-center text-sm font-mono tracking-widest font-bold px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              {pinError && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-red-600 hover:text-red-800 underline font-medium"
              >
                Επαναφορά στα αρχικά
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNames(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Ακύρωση
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition"
                >
                  Αποθήκευση Αλλαγών
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access to Portals */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Είστε μέλος μαθητικής ομάδας ή εκπαιδευτικός;
            </h4>
            <p className="text-xs text-slate-600">
              Συνδεθείτε στην «Υποβολή Ομάδων» με τον κωδικό της ομάδας σας για να καταχωρίσετε νέα τεκμήρια.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('teams')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0"
        >
          Σύνδεση στην Υποβολή
        </button>
      </div>

      {/* Ψηφιακός Ξεναγός Modal */}
      <DigitalNarratorModal
        isOpen={isNarratorOpen}
        onClose={() => setIsNarratorOpen(false)}
        onNavigateToTab={onNavigateToTab}
      />

      {/* Floating Button Ψηφιακού Ξεναγού */}
      <button
        onClick={() => setIsNarratorOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-amber-400 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition hover:scale-105 transform"
        title="Άνοιγμα Ψηφιακού Ξεναγού"
      >
        <Headphones className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">Ψηφιακός Ξεναγός</span>
      </button>
    </div>
  );
};
