import React, { useState } from 'react';
import type { Language } from '../data/translations';
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
  language?: Language;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ 
  isOpen, 
  onClose,
  language = 'el' 
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'general'>('students');

  if (!isOpen) return null;

  const isEn = language === 'en';

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
                  {isEn ? 'USER GUIDE & HELP HUB' : 'ΕΓΧΕΙΡΙΔΙΟ ΧΡΗΣΗΣ & ΒΟΗΘΕΙΑ'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {isEn ? '19th Century' : '19ος Αιώνας'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                {isEn ? 'Platform Guide: "Islands in Network"' : 'Οδηγός Πλατφόρμας «Νησιά σε Δίκτυο»'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs font-semibold hidden sm:flex items-center gap-1.5"
              title={isEn ? 'Print Guide' : 'Εκτύπωση Οδηγού'}
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print' : 'Εκτύπωση'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
              aria-label={isEn ? 'Close' : 'Κλείσιμο'}
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
            <span>{isEn ? '👩‍🎓 Student Research Wings' : '👩‍🎓 Οδηγός για Μαθητές'}</span>
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
            <span>{isEn ? '👨‍🏫 Educator Hub & Oversight' : '👨‍🏫 Οδηγός για Καθηγητές'}</span>
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
            <span>{isEn ? '🧭 Navigation & Timeline' : '🧭 Πλοήγηση & Χρονολόγιο'}</span>
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
                  {isEn ? (
                    <>Welcome to the Inter-School Digital Lab! Here student research teams document archival records, oral testimonies, and historical findings connecting <strong>Thassos</strong> and <strong>Crete</strong>.</>
                  ) : (
                    <>Καλώς ήρθατε στο Διασχολικό Εργαστήριο! Εδώ θα καταχωρίζετε τα ιστορικά αρχεία, τις μαρτυρίες και τα ευρήματα της ομάδας σας, συνδέοντας τη <strong>Θάσο</strong> και την <strong>Κρήτη</strong>.</>
                  )}
                </p>
              </div>

              {/* Βήμα 1 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEn ? 'Connecting to Your Research Wing' : 'Σύνδεση στην Ομάδα σας'}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3">
                  {isEn ? (
                    <>Go to the <strong>"Student Teams"</strong> tab:</>
                  ) : (
                    <>Πηγαίνετε στην καρτέλα <strong>«Υποβολή Ομάδων»</strong>:</>
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {isEn ? (
                    <>
                      <li>Select your school (<em>Junior High School of Prinos, Thassos</em> or <em>3rd Senior High School of Chania, Crete</em>).</li>
                      <li>Select your team wing (e.g., <em>Wing A1: Administration & Waqf Heritage</em>).</li>
                      <li>Type the team passphrase provided by your teacher.</li>
                    </>
                  ) : (
                    <>
                      <li>Επιλέξτε το σχολείο σας (<em>Γυμνάσιο Πρίνου Θάσου</em> ή <em>3ο ΓΕΛ Χανίων</em>).</li>
                      <li>Επιλέξτε το όνομα της ομάδας σας (π.χ. <em>Ομάδα Α1: Διοίκηση & Βακούφια</em>).</li>
                      <li>Πληκτρολογήστε τον κωδικό πρόσβασης που σας έδωσε ο καθηγητής σας.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Βήμα 2 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEn ? 'Documenting the Historical Record' : 'Συμπλήρωση της Ιστορικής Καταχώρισης'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">
                      {isEn ? 'Title & Year:' : 'Τίτλος & Χρονολογία:'}
                    </strong>
                    {isEn ? 'Concise title and specific historical year (e.g., 1835).' : 'Σύντομος τίτλος και το έτος του γεγονότος (π.χ. 1835).'}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">
                      {isEn ? 'Period & Island:' : 'Περίοδος & Νησί:'}
                    </strong>
                    {isEn ? 'Select administration period and island focus (Thassos or Crete).' : 'Επιλέξτε Οθωμανική Διοίκηση & αντίστοιχο νησί (Θάσος ή Κρήτη).'}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">
                      {isEn ? 'Research Question:' : 'Ερευνητικό Ερώτημα:'}
                    </strong>
                    {isEn ? 'The central historical inquiry answered by your archival finding.' : 'Το κεντρικό ερώτημα που απαντά η πηγή σας.'}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <strong className="block text-slate-900 mb-1">
                      {isEn ? 'Context & Synthesis:' : 'Ιστορικό Πλαίσιο & Ερμηνεία:'}
                    </strong>
                    {isEn ? 'Describe the events and synthesize the student team’s conclusions.' : 'Περιγράψτε τα γεγονότα και το συμπέρασμα της ομάδας.'}
                  </div>
                </div>
              </div>

              {/* Βήμα 3 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEn ? 'Adding Primary Sources & Evidence' : 'Προσθήκη Τεκμηρίων & Πηγών'}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-3">
                  {isEn ? 'Every historical record must be supported by authentic primary sources:' : 'Κάθε ιστορική καταχώριση πρέπει να βασίζεται σε πηγές:'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-semibold">
                    {isEn ? '📄 Archival Manuscript' : '📄 Αρχειακό Έγγραφο'}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-semibold">
                    {isEn ? '🎙️ Oral History Testimony' : '🎙️ Προφορική Μαρτυρία'}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-semibold">
                    {isEn ? '🎥 Video Embed (YouTube link)' : '🎥 Βίντεο (YouTube link)'}
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg font-semibold">
                    {isEn ? '📷 Photo / Manuscript Scan' : '📷 Φωτογραφία / Χειρόγραφο'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {isEn 
                    ? '* Always specify the repository or municipal archive where the item is preserved (e.g., General State Archives of Chania, Historical Archive of Thassos, etc.).'
                    : '* Μην ξεχνάτε να αναφέρετε τον φορέα ή το αρχείο από όπου αντλήσατε το τεκμήριο (π.χ. ΓΑΚ Χανίων, Αρχείο Θάσου κ.λπ.).'}
                </p>
              </div>

              {/* Βήμα 4 */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEn ? 'Saving Draft or Submitting' : 'Υποβολή ή Αποθήκευση Προσχεδίου'}
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 text-xs block mb-1">
                      {isEn ? '💾 Save as Draft:' : '💾 Αποθήκευση ως Πρόχειρο (Draft):'}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isEn 
                        ? 'Saves your draft locally so you can continue later without notifying educators.'
                        : 'Αποθηκεύει την εργασία σας για να συνεχίσετε αργότερα χωρίς να τη δει ο καθηγητής.'}
                    </span>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <strong className="text-blue-900 text-xs block mb-1">
                      {isEn ? '🚀 Final Submission:' : '🚀 Οριστική Υποβολή:'}
                    </strong>
                    <span className="text-xs text-blue-800">
                      {isEn 
                        ? 'Dispatches your entry to the teacher moderation dashboard for scientific review and publication.'
                        : 'Στέλνει την εργασία στο ταμπλό των καθηγητών για έλεγχο και δημοσίευση.'}
                    </span>
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
                  {isEn ? (
                    <>In the <strong>"Educators Hub"</strong> tab, supervising teachers hold full pedagogical and scholarly moderation over student submissions before they are published publicly.</>
                  ) : (
                    <>Στην καρτέλα <strong>«Εκπαιδευτικοί»</strong> έχετε τον πλήρη παιδαγωγικό και επιστημονικό έλεγχο των μαθητικών αναρτήσεων πριν αυτές εμφανιστούν δημόσια.</>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">
                      {isEn ? '1. Verification & Publishing' : '1. Έγκριση & Δημοσίευση (Publish)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn 
                      ? 'Review the historical fidelity and citations. Clicking "Approve" immediately makes the milestone live on the interactive Timeline and Map.'
                      : 'Ελέγχετε την επιστημονική ορθότητα της καταχώρισης. Πατώντας «Έγκριση», το τεκμήριο εμφανίζεται άμεσα στο Κοινό Χρονολόγιο και στον Χάρτη.'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-1.5">
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">
                      {isEn ? '2. Formative Feedback & Revisions' : '2. Επιστροφή για Διορθώσεις (Feedback)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn 
                      ? 'If evidence is incomplete or needs refinement, type a constructive pedagogical note and click "Return to Team".'
                      : 'Αν λείπει κάποιο στοιχείο ή απαιτείται διόρθωση πηγών, πληκτρολογείτε ένα σύντομο παιδαγωγικό σχόλιο και πατάτε «Επιστροφή στην Ομάδα».'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1.5">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-slate-900 font-bold">
                      {isEn ? '3. Inter-School Commentary & Counterpoint' : '3. Προσθήκη Αντίλογου / Συνεισφοράς άλλου σχολείου'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn 
                      ? 'Allows teachers from the partner island (e.g. Chania for Thassos entries) to append a comparative historical reflection or counterpoint, strengthening inter-school dialogue!'
                      : 'Επιτρέπει στους καθηγητές του έτερου σχολείου (π.χ. Χανίων για καταχώριση της Θάσου) να προσθέσουν μια παράγραφο συσχετισμού ή αντίλογου, ενισχύοντας τη διασχολική συνεργασία!'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-1.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-900 font-bold">
                      {isEn ? '4. Archival Export (JSON) & Report Printing' : '4. Εξαγωγή Αρχείου (JSON) & Εκτύπωση'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn 
                      ? 'From the top of the dashboard, download open JSON backups of all research records or print a comprehensive unified project report.'
                      : 'Από το επάνω μέρος του ταμπλό μπορείτε να κατεβάσετε πλήρες αντίγραφο ασφαλείας (JSON backup) ή να εκτυπώσετε το υλικό σε μορφή ενιαίας έκθεσης.'}
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
                    <span>{isEn ? 'Digital Timeline' : 'Ψηφιακό Χρονολόγιο'}</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    {isEn ? (
                      <>
                        <li><strong>Island Filters:</strong> Click <em>"All Regions"</em>, <em>"Thassos"</em>, or <em>"Crete"</em> for instant geographical isolation.</li>
                        <li><strong>Search:</strong> Type historical figures, places, or commodities (e.g., "oil", "ship", "waqf").</li>
                        <li><strong>View Modes:</strong> Toggle between chronological stream cards (Timeline) or high-accessibility List.</li>
                        <li><strong>Full Evidence Modal:</strong> Click any card to inspect full archival citations, oral audio, and video embeds.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Φίλτρα Νησιού:</strong> Πατήστε <em>«Όλες οι περιοχές»</em>, <em>«Θάσος»</em> ή <em>«Κρήτη»</em> για άμεση απομόνωση.</li>
                        <li><strong>Αναζήτηση:</strong> Πληκτρολογήστε πρόσωπα, μέρη ή όρους (π.χ. «λάδι», «πλοίο»).</li>
                        <li><strong>Προβολή:</strong> Εναλλαγή ανάμεσα σε κάρτες ροής (Timeline) ή προσβάσιμη Λίστα.</li>
                        <li><strong>Πλήρες Τεκμήριο:</strong> Κάντε κλικ σε οποιαδήποτε κάρτα για να ανοίξει το παράθυρο με τις πηγές και το βίντεο.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <MapIcon className="w-5 h-5 text-blue-600" />
                    <span>{isEn ? 'Interactive Heritage Map' : 'Διαδραστικός Χάρτης'}</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
                    {isEn ? (
                      <>
                        <li>Explore 19th-century maritime trade routes across the Mediterranean and North Aegean.</li>
                        <li>Click on cartographic wax seal markers (Thassos, Chania, Alexandria, Istanbul) to view localized historical evidence.</li>
                      </>
                    ) : (
                      <>
                        <li>Εξερευνήστε τους θαλάσσιους δρόμους της Οθωμανικής Μεσογείου του 19ου αιώνα.</li>
                        <li>Πατήστε πάνω στους δείκτες (Θάσος, Χανιά, Αίγυπτος, Κωνσταντινούπολη) για να δείτε τα γεωγραφικά τεκμήρια.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
                <span>
                  {isEn 
                    ? '© 2026–2027 • Junior High School of Prinos & 3rd Senior High School of Chania' 
                    : '© 2026–2027 • Γυμνάσιο Πρίνου Θάσου & 3ο Γενικό Λύκειο Χανίων'}
                </span>
                <span className="font-semibold text-slate-800">
                  {isEn ? '100% Open & Secure Platform' : '100% Ανοικτή Πλατφόρμα'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {isEn ? 'Inter-School History Lab (2026–2027)' : 'Διασχολικό Εργαστήριο Ιστορίας (2026–2027)'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition ml-auto"
          >
            {isEn ? 'Got it, Close' : 'Κατάλαβα, κλείσιμο'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
