import React, { useState } from 'react';
import type { School, Team, HistoricalEntry, TeamSession } from '../types/database.types';
import { compressHistoricalImage } from '../utils/imageCompressor';
import { Lock, LogIn, Send, Save, Image as ImageIcon, Video, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';

interface TeamPortalProps {
  schools: School[];
  teams: Team[];
  onSubmitEntry: (newEntry: Partial<HistoricalEntry>) => void;
}

export const TeamPortal: React.FC<TeamPortalProps> = ({ schools, teams, onSubmitEntry }) => {
  // Session State
  const [session, setSession] = useState<TeamSession | null>(null);
  
  // Login State
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [selectedTeamName, setSelectedTeamName] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('1830');
  const [dateDisplay, setDateDisplay] = useState('');
  const [periodTag, setPeriodTag] = useState('Οθωμανική Διοίκηση & Μεχμέτ Αλή');
  const [locationTag, setLocationTag] = useState('thasos');
  const [historicalContext, setHistoricalContext] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [interpretation, setInterpretation] = useState('');
  
  // Source Fields
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceType, setSourceType] = useState<'document' | 'photograph' | 'oral_history' | 'video_link'>('photograph');
  const [originHolder, setOriginHolder] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [licenceType, setLicenceType] = useState('Creative Commons BY-NC');
  const [critiqueNotes, setCritiqueNotes] = useState('');
  
  // Compression & Upload State
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressionStatus, setCompressionStatus] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Διαθέσιμες ομάδες για το επιλεγμένο σχολείο
  const availableTeams = teams.filter(t => t.school_id === selectedSchoolId);

  // Διαχείριση Εισόδου
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!selectedTeamName || !passcode) {
      setLoginError('Παρακαλώ επιλέξτε ομάδα και πληκτρολογήστε τον κωδικό.');
      return;
    }

    // Demo check: δεχόμαστε τον κωδικό 123456 ή οποιοδήποτε 6ψήφιο για δοκιμή
    if (passcode.trim() === '123456' || passcode.length >= 4) {
      const school = schools.find(s => s.id === selectedSchoolId);
      const team = teams.find(t => t.school_id === selectedSchoolId && t.name === selectedTeamName);
      setSession({
        team_id: team?.id || 'demo-team-id',
        team_name: selectedTeamName,
        school_id: selectedSchoolId,
        school_name: school?.name || ''
      });
    } else {
      setLoginError('Λανθασμένος κωδικός πρόσβασης ομάδας. Δοκιμάστε: 123456');
    }
  };

  // Διαχείριση Συμπίεσης Εικόνας
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompressionStatus(`Συμπίεση εικόνας... (Αρχικό μέγεθος: ${(file.size / 1024).toFixed(0)} KB)`);
      
      const compressed = await compressHistoricalImage(file);
      setCompressedFile(compressed);
      setCompressionStatus(`Έτοιμο! Νέο βελτιστοποιημένο μέγεθος: ${(compressed.size / 1024).toFixed(0)} KB (WebP)`);
    }
  };

  // Διαχείριση Υποβολής
  const handleSubmit = (status: 'draft' | 'submitted') => {
    if (!title || !historicalContext || !researchQuestion) {
      alert('Παρακαλώ συμπληρώστε τουλάχιστον Τίτλο, Ερευνητικό Ερώτημα και Ιστορικό Πλαίσιο.');
      return;
    }

    const newEntry: Partial<HistoricalEntry> = {
      school_id: session?.school_id,
      team_id: session?.team_id,
      title,
      year_numeric: parseInt(year) || 1943,
      date_display: dateDisplay || year,
      period_tag: periodTag,
      location_tag: locationTag,
      historical_context: historicalContext,
      research_question: researchQuestion,
      interpretation,
      status,
      sources: [
        {
          id: `s-${Date.now()}`,
          entry_id: '',
          title: sourceTitle || 'Κύρια Πηγή Τεκμηρίου',
          source_type: sourceType,
          origin_holder: originHolder || 'Σχολικό Αρχείο',
          source_url: sourceType === 'video_link' ? videoUrl : (compressedFile ? URL.createObjectURL(compressedFile) : null),
          licence_type: licenceType,
          critique_notes: critiqueNotes || 'Έλεγχος αξιοπιστίας από την ομάδα.',
          created_at: new Date().toISOString()
        }
      ]
    };

    onSubmitEntry(newEntry);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);

    // Καθαρισμός φόρμας
    setTitle('');
    setHistoricalContext('');
    setResearchQuestion('');
    setInterpretation('');
    setCritiqueNotes('');
    setVideoUrl('');
    setCompressedFile(null);
    setCompressionStatus('');
  };

  // ΑΝ ΔΕΝ ΕΧΕΙ ΣΥΝΔΕΘΕΙ ΟΜΑΔΑ: Οθόνη Εισόδου
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-900 mb-1">
          Είσοδος Μαθητικής Ομάδας
        </h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          Χωρίς προσωπικά δεδομένα ή emails. Εισάγετε τον κωδικό της ομάδας σας.
        </p>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Σχολική Μονάδα:
            </label>
            <select
              value={selectedSchoolId}
              onChange={e => {
                setSelectedSchoolId(e.target.value);
                setSelectedTeamName('');
              }}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
            >
              {schools.map(s => {
                const displayName = s.name
                  .replace(/4[οo]\s*Γενικό\s*Λύκειο/gi, '3ο Γενικό Λύκειο')
                  .replace(/4[οo]\s*ΓΕΛ/gi, '3ο ΓΕΛ')
                  .replace(/4[οo]\s*Λύκειο/gi, '3ο Λύκειο');
                return (
                  <option key={s.id} value={s.id}>{displayName} ({s.city})</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ερευνητική Ομάδα:
            </label>
            <select
              value={selectedTeamName}
              onChange={e => setSelectedTeamName(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Επιλέξτε την ομάδα σας --</option>
              {availableTeams.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Κωδικός Πρόσβασης Ομάδας (Passcode):
            </label>
            <input
              type="password"
              placeholder="π.χ. 123456"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              * Για τη δοκιμή, χρησιμοποιήστε τον κωδικό: <code>123456</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Σύνδεση στο Εργαστήριο</span>
          </button>
        </form>
      </div>
    );
  }

  // ΑΝ ΕΧΕΙ ΣΥΝΔΕΘΕΙ ΟΜΑΔΑ: Φόρμα Καταχώρισης
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Session Header */}
      <div className="bg-blue-900 text-white p-4 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <div>
          <span className="text-xs text-blue-200 uppercase font-semibold">Συνδεδεμένη Ομάδα</span>
          <h2 className="text-lg font-bold">{session.team_name} — {session.school_name}</h2>
        </div>
        <button
          onClick={() => setSession(null)}
          className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Αποσύνδεση</span>
        </button>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span><strong>Επιτυχία!</strong> Η καταχώριση αποθηκεύτηκε και βρίσκεται στο ταμπλό ελέγχου των καθηγητών.</span>
        </div>
      )}

      {/* Φόρμα Υποβολής Ιστορικής Καταχώρισης */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-900">
            Νέο Δελτίο Ιστορικής Καταγραφής
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Συμπληρώστε με ακρίβεια τα πεδία της ιστορικής μεθόδου.
          </p>
        </div>

        {/* 1. Βασικά Στοιχεία */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Τίτλος Τεκμηρίου / Γεγονότος *
            </label>
            <input
              type="text"
              placeholder="π.χ. Η απεργία των μαθητών για τα συσσίτια"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ιστορική Περίοδος
            </label>
            <select
              value={periodTag}
              onChange={e => setPeriodTag(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Οθωμανική Διοίκηση & Μεχμέτ Αλή">Οθωμανική Διοίκηση & Μεχμέτ Αλή (1813–1840)</option>
              <option value="Εμπόριο & Μεσογειακά Δίκτυα">Εμπόριο & Μεσογειακά Δίκτυα (1840–1870)</option>
              <option value="Κοινωνία & Καθημερινή Ζωή">Κοινωνία & Καθημερινή Ζωή στη Θάσο (19ος αι.)</option>
              <option value="Αρχιτεκτονική & Υλικός Πολιτισμός">Αρχιτεκτονική & Υλικός Πολιτισμός</option>
              <option value="Ύστερη Περίοδος & Απελευθέρωση">Ύστερη Περίοδος & Απελευθέρωση (1870–1913)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ιστορικός Τόπος στον Χάρτη:
            </label>
            <select
              value={locationTag}
              onChange={e => setLocationTag(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="thasos">Θάσος (Πρίνος / Λιμένας)</option>
              <option value="chania">Χανιά (Παλιό Λιμάνι & Φάρος)</option>
              <option value="kavala">Καβάλα (Ιμαρέτ)</option>
              <option value="alexandria">Αλεξάνδρεια (Αίγυπτος)</option>
              <option value="constantinople">Κωνσταντινούπολη</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Έτος (Αριθμός για χρονολόγιο) *
            </label>
            <input
              type="number"
              placeholder="π.χ. 1943"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ημερομηνία / Διάστημα Εμφάνισης
            </label>
            <input
              type="text"
              placeholder="π.χ. Νοέμβριος 1943 ή Χειμώνας 1943-44"
              value={dateDisplay}
              onChange={e => setDateDisplay(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 2. Επιστημονική Τεκμηρίωση */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ερευνητικό Ερώτημα της Ομάδας *
            </label>
            <input
              type="text"
              placeholder="Τι προσπαθεί να διερευνήσει η ομάδα σας με αυτή την πηγή;"
              value={researchQuestion}
              onChange={e => setResearchQuestion(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ιστορικό Πλαίσιο & Περιγραφή Γεγονότος *
            </label>
            <textarea
              rows={3}
              placeholder="Περιγράψτε το ιστορικό πλαίσιο και τα γεγονότα που συνδέονται με την πηγή..."
              value={historicalContext}
              onChange={e => setHistoricalContext(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ιστορική Ερμηνεία & Συμπεράσματα Ομάδας
            </label>
            <textarea
              rows={2}
              placeholder="Τι συμπεράσματα εξάγει η ομάδα σας; Πώς απαντάται το ερευνητικό ερώτημα;"
              value={interpretation}
              onChange={e => setInterpretation(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3. Τεκμήριο, Βίντεο ή Εικόνα */}
        <div className="space-y-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
          <h4 className="text-sm font-bold text-slate-900">
            Σύνδεση Πηγής / Τεκμηρίου
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Τίτλος Τεκμηρίου:
              </label>
              <input
                type="text"
                placeholder="π.χ. Πρωτότυπη φωτογραφία συσσιτίου"
                value={sourceTitle}
                onChange={e => setSourceTitle(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Άδεια Χρήσης:
              </label>
              <select
                value={licenceType}
                onChange={e => setLicenceType(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Creative Commons BY-NC">Creative Commons (BY-NC)</option>
                <option value="Άδεια Κατόχου">Με άδεια κατόχου</option>
                <option value="Δημόσιο Κτήμα">Δημόσιο Κτήμα (Public Domain)</option>
                <option value="Εκπαιδευτική Χρήση">Εκπαιδευτική Χρήση</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Είδος Τεκμηρίου:
              </label>
              <select
                value={sourceType}
                onChange={e => setSourceType(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="photograph">Φωτογραφία / Εικόνα</option>
                <option value="document">Έγγραφο / Επιστολή</option>
                <option value="oral_history">Προφορική Μαρτυρία</option>
                <option value="video_link">Βίντεο (video.sch.gr / YouTube)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Φορέας Προέλευσης / Κάτοχος:
              </label>
              <input
                type="text"
                placeholder="π.χ. Γενικά Αρχεία Κράτους, Οικογενειακό αρχείο"
                value={originHolder}
                onChange={e => setOriginHolder(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Αν είναι Video Link */}
          {sourceType === 'video_link' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-blue-600" />
                <span>Σύνδεσμος Βίντεο (video.sch.gr ή YouTube Unlisted):</span>
              </label>
              <input
                type="text"
                placeholder="π.χ. https://video.sch.gr/asset/detail/XYZ ή https://youtu.be/..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                * Το βίντεο δεν επιβαρύνει τον αποθηκευτικό χώρο της πλατφόρμας (0 MB storage).
              </span>
            </div>
          ) : (
            /* Αν είναι Εικόνα: Client-side compression */
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Μεταφόρτωση Εικόνας (Αυτόματη Συμπίεση &lt; 300 KB):</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {compressionStatus && (
                <span className="text-xs text-emerald-700 font-medium mt-1.5 block">
                  ✓ {compressionStatus}
                </span>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Κριτική Αξιολόγηση Πηγής:
            </label>
            <textarea
              rows={2}
              placeholder="Ποιος δημιούργησε την πηγή; Πόσο αξιόπιστη είναι; Υπάρχουν περιορισμοί ή σκοπιμότητες;"
              value={critiqueNotes}
              onChange={e => setCritiqueNotes(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Κουμπιά Υποβολής */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>Αποθήκευση ως Πρόχειρο</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('submitted')}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span>Υποβολή για Έγκριση</span>
          </button>
        </div>
      </div>
    </div>
  );
};
