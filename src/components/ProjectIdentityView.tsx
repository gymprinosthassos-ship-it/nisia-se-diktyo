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
  X
} from 'lucide-react';
import type { Team } from '../types/database.types';
import { islandParticipantsData, type IslandParticipants } from '../data/participantsData';

interface ProjectIdentityViewProps {
  teams: Team[];
  onNavigateToTab: (tab: 'timeline' | 'map' | 'teams' | 'teachers') => void;
}

export const ProjectIdentityView: React.FC<ProjectIdentityViewProps> = ({ onNavigateToTab }) => {
  // Φόρτωση συμμετεχόντων (με υποστήριξη τοπικής προσαρμογής στο localStorage)
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

  // Συγχρονισμός τοπικών αλλαγών
  useEffect(() => {
    try {
      localStorage.setItem('nisia_participants_data_v4', JSON.stringify(participants));
    } catch {
      // ignore
    }
  }, [participants]);

  const handleOpenEdit = (schoolId: 'school-prinos' | 'school-chania') => {
    setEditSchoolId(schoolId);
    setTempParticipants(JSON.parse(JSON.stringify(participants)));
    setIsEditingNames(true);
  };

  const handleSaveEdit = () => {
    setParticipants(tempParticipants);
    setIsEditingNames(false);
    setSaveNotification('Τα ονόματα αποθηκεύτηκαν επιτυχώς!');
    setTimeout(() => setSaveNotification(''), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Επαναφορά στα αρχικά πρότυπα ονομάτων;')) {
      setParticipants(islandParticipantsData);
      localStorage.removeItem('nisia_participants_data_v4');
      setIsEditingNames(false);
    }
  };

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
                  Στέλλα Λεπίδα, Αναστάσιος Καλλίνικος, Φίλιππος Παπαγεωργίου, Χαλίλ Αλ Χανάκτε
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
          {participants.map((island) => {
            const isThasos = island.schoolId === 'school-prinos';
            const wingAGroups = island.teams.filter(t => t.wing === 'Α');
            const wingBGroups = island.teams.filter(t => t.wing === 'Β');
            const chaniaGroups = island.teams.filter(t => t.wing === 'Χ');

            return (
              <div 
                key={island.schoolId}
                className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Header Νησιού & Σχολείου */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isThasos ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {isThasos ? <Anchor className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className={`${isThasos ? 'text-amber-400' : 'text-blue-400'} text-xs font-bold uppercase tracking-wider block`}>
                          {isThasos ? 'ΟΛΕΣ ΟΙ ΟΜΑΔΕΣ ΘΑΣΟΥ (8 ΥΠΟΟΜΑΔΕΣ)' : 'ΣΥΝΕΡΓΑΖΟΜΕΝΗ ΜΟΝΑΔΑ ΚΡΗΤΗΣ'}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white">
                          {island.schoolName}
                        </h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Νησί: <strong>{island.island}</strong> ({island.region})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(island.schoolId as 'school-prinos' | 'school-chania')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Επεξεργασία ονομάτων"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. ΥΠΕΥΘΥΝΟΙ ΚΑΘΗΓΗΤΕΣ */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span>ΣΥΝΤΟΝΙΣΤΕΣ ΕΚΠΑΙΔΕΥΤΙΚΟΙ {isThasos ? 'ΘΑΣΟΥ' : 'ΧΑΝΙΩΝ'}</span>
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

                  {/* 2. ΜΑΘΗΤΙΚΕΣ ΟΜΑΔΕΣ (ΓΙΑ ΤΗ ΘΑΣΟ: ΚΑΙ ΠΤΕΡΥΓΑ Α ΚΑΙ ΠΤΕΡΥΓΑ Β) */}
                  {isThasos ? (
                    <div className="space-y-6">
                      {/* ΠΤΕΡΥΓΑ Α */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 px-1 border-b border-slate-800/80 pb-1.5">
                          <ScrollText className="w-4 h-4 text-amber-400" />
                          <span>Α΄ ΠΤΕΡΥΓΑ — ΑΡΧΕΙΑΚΗ ΕΡΕΥΝΑ (ΘΑΣΟΣ)</span>
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
                                  Θάσος
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                                {group.name}
                              </h4>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Μαθητές & Μαθήτριες Ομάδας:
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

                      {/* ΠΤΕΡΥΓΑ Β */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 px-1 border-b border-slate-800/80 pb-1.5">
                          <MonitorPlay className="w-4 h-4 text-blue-400" />
                          <span>Β΄ ΠΤΕΡΥΓΑ — ΨΗΦΙΑΚΗ ΔΗΜΙΟΥΡΓΙΑ (ΘΑΣΟΣ)</span>
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
                                  Θάσος
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                                {group.name}
                              </h4>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Μαθητές & Μαθήτριες Ομάδας:
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
                    </div>
                  ) : (
                    /* ΓΙΑ ΤΑ ΧΑΝΙΑ: ΟΙ 4 ΕΡΕΥΝΗΤΙΚΕΣ ΟΜΑΔΕΣ ΚΡΗΤΗΣ */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300 px-1 border-b border-slate-800/80 pb-1.5">
                        <Compass className="w-4 h-4 text-blue-400" />
                        <span>ΕΡΕΥΝΗΤΙΚΕΣ ΟΜΑΔΕΣ ΧΑΝΙΩΝ (4 ΘΕΜΑΤΙΚΕΣ)</span>
                      </div>

                      <div className="space-y-3">
                        {chaniaGroups.map((group) => (
                          <div 
                            key={group.code}
                            className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-slate-700 transition"
                          >
                            <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-800/70">
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-xs">
                                Ομάδα {group.code}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Κρήτη
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
                              {group.name}
                            </h4>

                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Μαθητές & Μαθήτριες Ομάδας:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {group.students.map((student, sIdx) => (
                                  <span 
                                    key={sIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 italic"
                                  >
                                    <UserCheck className="w-3 h-3 text-slate-600" />
                                    <span>{student}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Κάρτας Νησιού */}
                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{isThasos ? '8 Υποομάδες Μαθητών Θάσου' : '4 Ερευνητικές Ομάδες Χανίων'}</span>
                  <button
                    onClick={() => handleOpenEdit(island.schoolId as 'school-prinos' | 'school-chania')}
                    className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                  >
                    <span>Συμπλήρωση / Αλλαγή Ονομάτων</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Επεξεργασία Ονομάτων: {currentEditIsland.schoolName} ({currentEditIsland.island})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Πληκτρολογήστε τα ονόματα των εκπαιδευτικών και των μαθητών ανά ομάδα
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingNames(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Επεξεργασία Καθηγητών */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>Υπεύθυνοι Καθηγητές / Συντονιστές</span>
              </h4>

              {currentEditIsland.teachers.map((teacher, tIdx) => (
                <div key={tIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Ονοματεπώνυμο Εκπαιδευτικού {tIdx + 1}:
                    </label>
                    <input
                      type="text"
                      value={teacher.name}
                      onChange={(e) => {
                        const updated = [...tempParticipants];
                        const target = updated.find(p => p.schoolId === editSchoolId);
                        if (target) {
                          target.teachers[tIdx].name = e.target.value;
                          setTempParticipants(updated);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Ρόλος / Ειδικότητα:
                    </label>
                    <input
                      type="text"
                      value={teacher.role}
                      onChange={(e) => {
                        const updated = [...tempParticipants];
                        const target = updated.find(p => p.schoolId === editSchoolId);
                        if (target) {
                          target.teachers[tIdx].role = e.target.value;
                          setTempParticipants(updated);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Επεξεργασία Μαθητών ανά Ομάδα */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Μαθητές ανά Υποομάδα</span>
              </h4>

              {currentEditIsland.teams.map((team, tmIdx) => (
                <div key={team.code} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Ομάδα {team.code}: {team.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Χωρίστε τα ονόματα με κόμμα)
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={team.students.join(', ')}
                    onChange={(e) => {
                      const updated = [...tempParticipants];
                      const target = updated.find(p => p.schoolId === editSchoolId);
                      if (target) {
                        const studentNames = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        target.teams[tmIdx].students = studentNames;
                        setTempParticipants(updated);
                      }
                    }}
                    placeholder="π.χ. (1) Ιλόι Χυσμπατράμι, (2) Ρέα Μαγδαληνού, Ειρήνη Βαρέτο..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-red-600 hover:text-red-800 underline font-medium"
              >
                Επαναφορά προτύπων
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
                  Αποθήκευση Ονομάτων
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
    </div>
  );
};
