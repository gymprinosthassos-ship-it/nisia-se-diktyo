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
  Award,
  ArrowRight
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
          «Νησιά σε Δίκτυο: Θάσος & Κρήτη στην Οθωμανική Μεσόγειο του Μεχμέτ Αλή (19ος Αιώνας)»
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

      {/* Πλαίσιο: Σκοπός & Περιγραφή Έργου */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-3xl p-7 sm:p-9 border border-amber-200/90 shadow-sm relative overflow-hidden">
        <div className="max-w-4xl space-y-4 text-slate-800 leading-relaxed text-sm sm:text-base font-serif">
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-amber-800">
            <Award className="w-4 h-4" />
            <span>ΤΟ ΙΣΤΟΡΙΚΟ ΠΛΑΙΣΙΟ ΚΑΙ ΟΙ ΣΤΟΧΟΙ ΤΗΣ ΣΥΝΕΡΓΑΣΙΑΣ</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Δύο Νησιά, Μία Κοινή Εποχή: Η Μεσόγειος του 19ου Αιώνα
          </h3>

          <p className="text-justify">
            Το <strong>Διασχολικό Εργαστήριο Ψηφιακής Τοπικής Ιστορίας</strong> φέρνει σε δημιουργική σύμπραξη μαθητές και καθηγητές από το <strong>Γυμνάσιο Πρίνου Θάσου</strong> και το <strong>3ο Γενικό Λύκειο Χανίων</strong> κατά τη σχολική χρονιά <strong>2026–2027</strong>.
          </p>

          <p className="text-justify">
            Κεντρικός άξονας της έρευνας είναι η περίοδος του 19ου αιώνα, κατά την οποία η Θάσος και η Κρήτη βρέθηκαν υπό την ιδιαίτερη σφαίρα επιρροής του Μεχμέτ Αλή της Αιγύπτου: η Θάσος ως προνομιούχο βακούφι (1813) και η Κρήτη κατά την περίοδο της Αιγυπτιοκρατίας (1830–1840). Μέσα από τη μελέτη αρχείων, φιρμανιών, εμπορικών καταστίχων, ναυτικών δρόμων και αρχιτεκτονικών καταλοίπων (όπως ο Φάρος των Χανίων και τα κτίσματα της Θάσου), οι μαθητές διαπιστώνουν ότι τα νησιά δεν ήταν απομονωμένα, αλλά αποτελούσαν ζωτικούς κόμβους ενός ενιαίου μεσογειακού δικτύου.
          </p>

          <p className="text-justify">
            Μέσω της καινοτόμου ψηφιακής πλατφόρμας, τα τεκμήρια τεκμηριώνονται επιστημονικά, διασταυρώνονται κριτικά και δημοσιεύονται σε ένα κοινό, διαδραστικό χρονολόγιο και γεωγραφικό χάρτη, ενισχύοντας την ιστορική σκέψη και τη διασχολική αλληλεγγύη.
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
