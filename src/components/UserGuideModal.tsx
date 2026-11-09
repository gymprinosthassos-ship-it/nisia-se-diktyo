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
  Lightbulb,
  Lock,
  Layers,
  Sparkles,
  Move,
  ChevronDown
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'narrator' | 'navigation'>('students');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ΕΠΙΣΗΜΟ ΕΓΧΕΙΡΙΔΙΟ ΧΡΗΣΗΣ
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-serif">Έκδοση 2026-2027</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-white mt-0.5">
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

        {/* Navigation Tabs (4 Θεματικές Ενότητες) */}
        <div className="bg-slate-100 p-2 sm:px-6 flex border-b border-slate-200 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👩‍🎓 Μαθητές & Υποβολές</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'teachers'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>👨‍🏫 Καθηγητές & PIN 64010</span>
          </button>

          <button
            onClick={() => setActiveTab('narrator')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'narrator'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🎙️ Αφηγητής & 3 Αναπτυσσόμενα Μέρη</span>
          </button>

          <button
            onClick={() => setActiveTab('navigation')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'navigation'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>🧭 Χρονολόγιο & Χάρτης</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* ========================================================= */}
          {/* TAB 1: ΜΑΘΗΤΕΣ & ΥΠΟΒΟΛΕΣ */}
          {/* ========================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-950 space-y-1">
                  <p className="font-bold">Καλώς ήρθατε στο Διασχολικό Εργαστήριο Τοπικής Ιστορίας!</p>
                  <p>
                    Εδώ καταχωρίζετε τα ιστορικά αρχεία, τις προφορικές μαρτυρίες και τα ευρήματα της ομάδας σας, συνδέοντας τη <strong>Θάσο</strong> και την <strong>Κρήτη</strong> του 19ου αιώνα.
                  </p>
                </div>
              </div>

              {/* Ενημέρωση Ασφαλείας PIN */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                <div className="text-xs sm:text-sm text-amber-950">
                  <strong>Κωδικός Ασφαλείας Υποβολής:</strong> Για την ανάρτηση οποιουδήποτε υλικού απαιτείται ο επίσημος κωδικός ασφαλείας: <span className="font-mono font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-950">64010</span>.
                </div>
              </div>

              {/* Βήματα Υποβολής */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:border-blue-300 transition space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                    <h3 className="text-sm font-bold text-slate-900">Σύνδεση στην Ομάδα σας</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Στην καρτέλα <strong>«Υποβολή Ομάδων»</strong>, επιλέγετε το σχολείο σας (Γυμνάσιο Πρίνου ή 3ο ΓΕΛ Χανίων), την ομάδα σας και τον κωδικό ομάδας.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:border-blue-300 transition space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                    <h3 className="text-sm font-bold text-slate-900">Συμπλήρωση Τεκμηρίου</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Εισάγετε Τίτλο, Έτος (19ος αι.), Νησί, Ερευνητικό Ερώτημα, Ιστορικό Πλαίσιο και τη σημασία για το δίκτυο των νησιών.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:border-blue-300 transition space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                    <h3 className="text-sm font-bold text-slate-900">Πηγές & Πολυμέσα</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Επισυνάπτετε αρχειακά έγγραφα (PDF/εικόνες), προφορικές μαρτυρίες, φωτογραφίες χειρογράφων ή βίντεο YouTube, αναφέροντας πάντα την πηγή (ΓΑΚ, τοπικά αρχεία).
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:border-blue-300 transition space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                    <h3 className="text-sm font-bold text-slate-900">Πρόχειρο ή Οριστική Υποβολή</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Μπορείτε να αποθηκεύσετε ως <strong>Πρόχειρο</strong> για να συνεχίσετε αργότερα, ή να πατήσετε <strong>Οριστική Υποβολή</strong> (με PIN 64010) για έγκριση από τους καθηγητές.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ΚΑΘΗΓΗΤΕΣ & ΔΙΑΧΕΙΡΙΣΗ (PIN 64010) */}
          {/* ========================================================= */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 space-y-1">
                  <p className="font-bold">Παιδαγωγικός & Επιστημονικός Έλεγχος Πλατφόρμας</p>
                  <p>
                    Οι υπεύθυνοι εκπαιδευτικοί έχουν τον πλήρη συντονισμό των μαθητικών αναρτήσεων και της διαχείρισης των συμμετεχόντων ανά σχολείο.
                  </p>
                </div>
              </div>

              {/* Διαχείριση Ονομάτων & Ομάδων με PIN */}
              <div className="border-2 border-amber-300/80 rounded-2xl p-5 bg-gradient-to-r from-amber-50/50 to-white space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm sm:text-base font-bold">
                    Κωδικός Ασφαλείας & Επεξεργασία Συμμετεχόντων (PIN: 64010)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Για να διασφαλιστεί η ακεραιότητα των δεδομένων, για οποιαδήποτε αλλαγή πεδίου, προσθήκη ή αφαίρεση ονόματος εκπαιδευτικού, μαθητή ή ομάδας απαιτείται ο κωδικός:
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Ενιαίος Κωδικός Ασφαλείας:</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                    64010
                  </span>
                </div>
              </div>

              {/* 2 Στήλες Σχολείων & Πτέρυγες Α / Β */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Διάταξη Σχολείων & Οργάνωση σε Πτέρυγες</span>
                </h3>
                <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                  <li><strong>Θάσος (Αριστερή Στήλη):</strong> Γυμνάσιο Πρίνου Θάσου οργανωμένο σε <em>Πτέρυγα Α΄</em> και <em>Πτέρυγα Β΄</em>.</li>
                  <li><strong>Χανιά (Δεξιά Στήλη):</strong> 3ο Γενικό Λύκειο Χανίων με 4 υπεύθυνους εκπαιδευτικούς και ομάδες σε <em>Πτέρυγα Α΄</em> & <em>Πτέρυγα Β΄</em>.</li>
                  <li><strong>Δυνατότητα Προσθήκης/Αφαίρεσης:</strong> Από το κουμπί <em>«Επεξεργασία»</em> μπορείτε να προσθέσετε ή να διαγράψετε οποιοδήποτε πλαίσιο μαθητή, εκπαιδευτικού ή ομάδας, με άμεση αποθήκευση στη βάση δεδομένων.</li>
                </ul>
              </div>

              {/* Ενέργειες Καθηγητών */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Έγκριση & Δημοσίευση
                  </strong>
                  <p className="text-slate-600 text-xs">
                    Εμφανίζει άμεσα το τεκμήριο στο δημόσιο Χρονολόγιο και στον Χάρτη.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-amber-700 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" /> Επιστροφή για Διόρθωση
                  </strong>
                  <p className="text-slate-600 text-xs">
                    Στέλνει παιδαγωγικό σχόλιο πίσω στην ομάδα για βελτίωση της εργασίας.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-indigo-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Σχόλιο Έτερου Σχολείου
                  </strong>
                  <p className="text-slate-600 text-xs">
                    Συνεισφορά των εκπαιδευτικών του άλλου νησιού για σύγκριση πηγών.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Εξαγωγή Backup & Εκτύπωση
                  </strong>
                  <p className="text-slate-600 text-xs">
                    Λήψη αντιγράφου ασφαλείας σε JSON ή εκτύπωση της συνολικής έκθεσης.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ΑΦΗΓΗΤΗΣ & 3 ΑΝΑΠΤΥΣΣΟΜΕΝΑ ΜΕΡΗ */}
          {/* ========================================================= */}
          {activeTab === 'narrator' && (
            <div className="space-y-6">
              
              {/* Ψηφιακός Αφηγητής 19ου Αιώνα */}
              <div className="border border-amber-200 rounded-2xl p-5 bg-gradient-to-br from-amber-50/70 to-white space-y-3">
                <div className="flex items-center gap-2.5 text-amber-900 font-bold">
                  <Move className="w-5 h-5 text-amber-700" />
                  <h3 className="text-base font-bold">
                    Ψηφιακός Αφηγητής — Ταξιδευτής του 19ου Αιώνα (Draggable)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Στη γωνία της οθόνης σας βρίσκεται το στρογγυλό ανάγλυφο μετάλλιο με το πρόσωπο του <strong>Ταξιδευτή του 19ου αιώνα</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>
                    <strong>Μετακίνηση παντού στην οθόνη:</strong> Μπορείτε να κάνετε «κλικ και σύρσιμο» (drag & drop) με το ποντίκι ή την αφή και να το μεταφέρετε οπουδήποτε στην οθόνη ώστε να μην εμποδίζει την ανάγνωση.
                  </li>
                  <li>
                    <strong>Καθολική παρουσία:</strong> Παραμένει διαθέσιμο σε όποια καρτέλα κι αν πλοηγηθείτε (Αρχική, Χρονολόγιο, Χάρτης, Ομάδες κ.λπ.).
                  </li>
                  <li>
                    <strong>Φυσική Φωνή Ντοκιμαντέρ (Neural Voice):</strong> Με ένα απλό κλικ ακούτε την αυθεντική, μπάσα φωνή χρονικογράφου του 19ου αι. με ελαφρά κρητική χροιά, σε 4 συναρπαστικούς σταθμούς:
                    <ol className="list-decimal pl-5 mt-1 space-y-1 text-slate-700">
                      <li><em>Σταθμός 1 (Θάσος 1813):</em> Το Βακούφι & το Ιμαρέτ Καβάλας.</li>
                      <li><em>Σταθμός 2 (Αιγαίο Πέλαγος):</em> Οι θαλάσσιοι δρόμοι λαδιού & ξυλείας.</li>
                      <li><em>Σταθμός 3 (Χανιά 1830–1840):</em> Η Αιγυπτιοκρατία & ο Αιγυπτιακός Φάρος.</li>
                      <li><em>Σταθμός 4 (Κοινό Έργο):</em> Η γέφυρα μαθητικής συνεργασίας των δύο σχολείων.</li>
                    </ol>
                  </li>
                </ul>
              </div>

              {/* 3 Αναπτυσσόμενα Μέρη Αρχικής Σελίδας */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold">
                    Η Αρχική Σελίδα σε 3 Αναπτυσσόμενα Μέρη (Accordion)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Για να μην απαιτείται ατελείωτο scroll down, η αρχική σελίδα είναι οργανωμένη σε 3 συμπαγή μέρη με βελάκια ανάπτυξης προς τα κάτω:
                </p>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-950 block">Μέρος 01: Ταυτότητα Έργου & Συνεργαζόμενα Σχολεία</strong>
                      <span className="text-slate-500 text-xs">Γυμνάσιο Πρίνου Θάσου & 3ο ΓΕΛ Χανίων (Ιστορικό πλαίσιο 19ου αι.).</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0">
                      Ανάπτυξη <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-950 block">Μέρος 02: Τα Τρία Στάδια της Ερευνητικής Διαδικασίας</strong>
                      <span className="text-slate-500 text-xs">1ο: Τοπική Έρευνα • 2ο: Συνάντηση Ευρημάτων • 3ο: Ψηφιακός Κόμβος.</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0">
                      Ανάπτυξη <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-950 block">Μέρος 03: Εκπαιδευτικοί & Μαθητικές Ομάδες Εργασίας</strong>
                      <span className="text-slate-500 text-xs">Θάσος αριστερά, Χανιά δεξιά, Πτέρυγες Α/Β και επεξεργασία με PIN 64010.</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0">
                      Ανάπτυξη <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: ΧΡΟΝΟΛΟΓΙΟ & ΧΑΡΤΗΣ */}
          {/* ========================================================= */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <span>Ψηφιακό Χρονολόγιο</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    <li><strong>Φίλτρα Νησιού:</strong> Επιλέξτε <em>«Όλες οι περιοχές»</em>, <em>«Θάσος»</em> ή <em>«Κρήτη»</em> για άμεση εστίαση.</li>
                    <li><strong>Αναζήτηση:</strong> Πληκτρολογήστε λέξεις-κλειδιά, πρόσωπα ή έννοιες (π.χ. «Βακούφι», «Φάρος», «ελαιόλαδο»).</li>
                    <li><strong>Προβολή:</strong> Εναλλαγή ανάμεσα σε αναλυτικό Timeline και συμπαγή Λίστα.</li>
                    <li><strong>Λεπτομέρειες Τεκμηρίου:</strong> Κλικ σε οποιαδήποτε κάρτα για προβολή πλήρους ιστορικού κειμένου, πηγών και βίντεο.</li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapIcon className="w-5 h-5 text-blue-600" />
                    <span>Διαδραστικός Χάρτης</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    <li>Εξερευνήστε τους θαλάσσιους δρόμους και τις ρότες εμπορίου του 19ου αιώνα μεταξύ Βορείου Αιγαίου, Κυκλάδων, Κρήτης και Αλεξάνδρειας.</li>
                    <li>Πατήστε πάνω στους γεωγραφικούς δείκτες (Θάσος, Χανιά, Καβάλα, Αίγυπτος) για να δείτε τα συσχετισμένα τεκμήρια.</li>
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
            Διασχολικό Εργαστήριο Τοπικής Ιστορίας (2026–2027) • PIN: 64010
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition ml-auto shadow-sm"
          >
            Κατάλαβα, κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
