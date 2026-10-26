import React from 'react';
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
  Lightbulb
} from 'lucide-react';
import type { Team } from '../types/database.types';

interface ProjectIdentityViewProps {
  teams: Team[];
  onNavigateToTab: (tab: 'timeline' | 'map' | 'teams' | 'teachers') => void;
}

export const ProjectIdentityView: React.FC<ProjectIdentityViewProps> = ({ teams, onNavigateToTab }) => {
  // Οργάνωση υποομάδων
  const prinosTeams = teams.filter(t => t.school_id === 'school-prinos');
  const chaniaTeams = teams.filter(t => t.school_id === 'school-chania');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
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
                  Υπεύθυνοι καθηγητές & ιστορικοί ερευνητές του Γυμνασίου Πρίνου
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <ScrollText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Ρόλος στο Έργο:</strong>
                <p className="text-slate-600 mt-0.5">
                  <strong>Α΄ Πτέρυγα — Αρχειακή Έρευνα:</strong> Μελέτη τοπικών πηγών, αρχείων βακουφίου, ναυτιλίας, ελαιοπαραγωγής και προφορικών μαρτυριών.
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
                  Υπεύθυνοι καθηγητές & υπεύθυνοι ψηφιακής επιμέλειας του 3ου ΓΕΛ Χανίων
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <MonitorPlay className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Ρόλος στο Έργο:</strong>
                <p className="text-slate-600 mt-0.5">
                  <strong>Β΄ Πτέρυγα — Ψηφιακή Δημιουργία:</strong> Ανάπτυξη ψηφιακής πλατφόρμας, διαδραστικού χάρτη, οπτικοακουστικών τεκμηρίων και σύνταξη αφηγήσεων.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΤΑ ΤΡΙΑ ΣΤΑΔΙΑ ΤΗΣ ΕΡΕΥΝΗΤΙΚΗΣ ΔΙΑΔΙΚΑΣΙΑΣ (ΝΕΑ ΕΝΟΤΗΤΑ) */}
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

      {/* Αναλυτική Κατηγοριοποίηση Ομάδων (Μαθητές & Εκπαιδευτικοί) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Οργανωτική Δομή & Ερευνητικές Ομάδες
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Κατανομή ρόλων, θεματικών πτερύγων και μαθητικών ομάδων εργασίας
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('timeline')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition shadow-sm w-fit"
          >
            <span>Προβολή Τεκμηρίων στο Χρονολόγιο</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Α΄ Πτέρυγα — Γυμνάσιο Πρίνου */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ScrollText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                    Α΄ ΠΤΕΡΥΓΑ • ΓΥΜΝΑΣΙΟ ΠΡΙΝΟΥ ΘΑΣΟΥ
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Αρχειακή Έρευνα & Τεκμηρίωση
                  </h3>
                </div>
              </div>
            </div>

            {/* Υποομάδες Α1 - Α4 */}
            <div className="space-y-3">
              {prinosTeams.map((team) => (
                <div 
                  key={team.id}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/50 transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs">
                      Ομάδα {team.name.split(':')[0]}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Θάσος
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition">
                    {team.name.includes(':') ? team.name.split(':')[1].trim() : team.name}
                  </h4>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Μαθητική ομάδα έρευνας & αρχείων</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Β΄ Πτέρυγα — 3ο ΓΕΛ Χανίων */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block">
                    Β΄ ΠΤΕΡΥΓΑ • 3ο ΓΕΛ ΧΑΝΙΩΝ
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Ψηφιακή Δημιουργία & Επιμέλεια
                  </h3>
                </div>
              </div>
            </div>

            {/* Υποομάδες Β1 - Β4 */}
            <div className="space-y-3">
              {chaniaTeams.map((team) => (
                <div 
                  key={team.id}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 hover:border-blue-500/50 transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-xs">
                      Ομάδα {team.name.split(':')[0]}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Χανιά
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition">
                    {team.name.includes(':') ? team.name.split(':')[1].trim() : team.name}
                  </h4>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Μαθητική ομάδα ψηφιακής παραγωγής</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
