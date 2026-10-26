import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Map as MapIcon, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare, 
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'general'>('students');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="parchment-modal-bg rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                  ΕΓΧΕΙΡΙΔΙΟ ΧΡΗΣΗΣ & ΒΟΗΘΕΙΑ
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">19ος Αιώνας</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                Οδηγός Πλατφόρμας «Νησιά σε Δίκτυο»
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs font-semibold hidden sm:flex items-center gap-1.5"
              title="Εκτύπωση Οδηγού"
            >
              <Printer className="w-4 h-4" />
              <span>Εκτύπωση</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
              aria-label="Κλείσιμο"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="no-print bg-slate-100 p-2 sm:px-6 flex border-b border-slate-200 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👩‍🎓 Οδηγός για Μαθητές</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'teachers'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>👨‍🏫 Οδηγός για Καθηγητές</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>🧭 Πλοήγηση & Χρονολόγιο</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* TAB 1: ΜΑΘΗΤΕΣ */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-blue-900 text-xs sm:text-sm">
                  Καλώς ήρθατε στο Διασχολικό Εργαστήριο! Εδώ θα καταχωρίζετε τα ιστορικά αρχεία, τις μαρτυρίες και τα ευρήματα της ομάδας σας, συνδέοντας τη <strong>Θάσο</strong> και την <strong>Κρήτη</strong>.
                </p>
              </div>

              {/* Βήμα 1 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                  <h3 className="text-base font-bold text-slate-900">Σύνδεση στην Ομάδα σας</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3">
                  Πηγαίνετε στην καρτέλα <strong>«Υποβολή Ομάδων»</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>Επιλέξτε το σχολείο σας (<em>Γυμνάσιο Πρίνου Θάσου</em> ή <em>3ο ΓΕΛ Χανίων</em>).</li>
                  <li>Επιλέξτε το όνομα της ομάδας σας (π.χ. <em>Ομάδα Α1: Διοίκηση & Βακούφια</em>).</li>
                  <li>Πληκτρολογήστε τον κωδικό πρόσβασης που σας έδωσε ο καθηγητής σας.</li>
                </ul>
              </div>

              {/* Βήμα 2 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                  <h3 className="text-base font-bold text-slate-900">Συμπλήρωση της Ιστορικής Καταχώρισης</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">Τίτλος & Χρονολογία:</strong>
                    Σύντομος τίτλος και το έτος του γεγονότος (π.χ. 1835).
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">Περίοδος & Νησί:</strong>
                    Επιλέξτε Οθωμανική Διοίκηση & αντίστοιχο νησί (Θάσος ή Κρήτη).
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">Ερευνητικό Ερώτημα:</strong>
                    Το κεντρικό ερώτημα που απαντά η πηγή σας.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">Ιστορικό Πλαίσιο & Ερμηνεία:</strong>
                    Περιγράψτε τα γεγονότα και το συμπέρασμα της ομάδας.
                  </div>
                </div>
              </div>

              {/* Βήμα 3 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                  <h3 className="text-base font-bold text-slate-900">Προσθήκη Τεκμηρίων & Πηγών</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3">
                  Κάθε ιστορική καταχώριση πρέπει να βασίζεται σε πηγές:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-semibold">📄 Αρχειακό Έγγραφο</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-semibold">🎙️ Προφορική Μαρτυρία</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-semibold">🎥 Βίντεο (YouTube link)</span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg font-semibold">📷 Φωτογραφία / Χειρόγραφο</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  * Μην ξεχνάτε να αναφέρετε τον φορέα ή το αρχείο από όπου αντλήσατε το τεκμήριο (π.χ. ΓΑΚ Χανίων, Αρχείο Θάσου κ.λπ.).
                </p>
              </div>

              {/* Βήμα 4 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                  <h3 className="text-base font-bold text-slate-900">Υποβολή ή Αποθήκευση Προσχεδίου</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 text-xs block mb-1">💾 Αποθήκευση ως Πρόχειρο (Draft):</strong>
                    <span className="text-xs text-slate-600">Αποθηκεύει την εργασία σας για να συνεχίσετε αργότερα χωρίς να τη δει ο καθηγητής.</span>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <strong className="text-blue-900 text-xs block mb-1">🚀 Οριστική Υποβολή:</strong>
                    <span className="text-xs text-blue-800">Στέλνει την εργασία στο ταμπλό των καθηγητών για έλεγχο και δημοσίευση.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ΚΑΘΗΓΗΤΕΣ */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-amber-950 text-xs sm:text-sm">
                  Στην καρτέλα <strong>«Εκπαιδευτικοί»</strong> έχετε τον πλήρη παιδαγωγικό και επιστημονικό έλεγχο των μαθητικών αναρτήσεων πριν αυτές εμφανιστούν δημόσια.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">1. Έγκριση & Δημοσίευση (Publish)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Ελέγχετε την επιστημονική ορθότητα της καταχώρισης. Πατώντας <strong>«Έγκριση»</strong>, το τεκμήριο εμφανίζεται άμεσα στο Κοινό Χρονολόγιο και στον Χάρτη.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-1.5">
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">2. Επιστροφή για Διορθώσεις (Feedback)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Αν λείπει κάποιο στοιχείο ή απαιτείται διόρθωση πηγών, πληκτρολογείτε ένα σύντομο παιδαγωγικό σχόλιο και πατάτε <strong>«Επιστροφή στην Ομάδα»</strong>.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1.5">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">3. Προσθήκη Αντίλογου / Συνεισφοράς άλλου σχολείου</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Επιτρέπει στους καθηγητές του έτερου σχολείου (π.χ. Χανίων για καταχώριση της Θάσου) να προσθέσουν μια παράγραφο συσχετισμού ή αντίλογου, ενισχύοντας τη διασχολική συνεργασία!
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-1.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-900 font-bold">4. Εξαγωγή Αρχείου (JSON) & Εκτύπωση</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Από το επάνω μέρος του ταμπλό μπορείτε να κατεβάσετε πλήρες αντίγραφο ασφαλείας (JSON backup) ή να εκτυπώσετε το υλικό σε μορφή ενιαίας έκθεσης.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ΠΛΟΗΓΗΣΗ & ΧΡΟΝΟΛΟΓΙΟ */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <span>Ψηφιακό Χρονολόγιο</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    <li><strong>Φίλτρα Νησιού:</strong> Πατήστε <em>«Όλες οι περιοχές»</em>, <em>«Θάσος»</em> ή <em>«Κρήτη»</em> για άμεση απομόνωση.</li>
                    <li><strong>Αναζήτηση:</strong> Πληκτρολογήστε πρόσωπα, μέρη ή όρους (π.χ. «λάδι», «πλοίο»).</li>
                    <li><strong>Προβολή:</strong> Εναλλαγή ανάμεσα σε κάρτες ροής (Timeline) ή προσβάσιμη Λίστα.</li>
                    <li><strong>Πλήρες Τεκμήριο:</strong> Κάντε κλικ σε οποιαδήποτε κάρτα για να ανοίξει το παράθυρο με τις πηγές και το βίντεο.</li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <MapIcon className="w-5 h-5 text-blue-600" />
                    <span>Διαδραστικός Χάρτης</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    <li>Εξερευνήστε τους θαλάσσιους δρόμους της Οθωμανικής Μεσογείου του 19ου αιώνα.</li>
                    <li>Πατήστε πάνω στους δείκτες (Θάσος, Χανιά, Αίγυπτος, Κωνσταντινούπολη) για να δείτε τα γεωγραφικά τεκμήρια.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
                <span>© 2026–2027 • Γυμνάσιο Πρίνου Θάσου & 3ο Γενικό Λύκειο Χανίων</span>
                <span className="font-semibold text-slate-800">100% Ανοικτή Πλατφόρμα</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Διασχολικό Εργαστήριο Ιστορίας (2026–2027)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition ml-auto"
          >
            Κατάλαβα, κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
