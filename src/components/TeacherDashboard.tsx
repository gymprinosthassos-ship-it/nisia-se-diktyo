import React, { useState } from 'react';
import type { HistoricalEntry } from '../types/database.types';
import { Check, RotateCcw, Download, Printer, ShieldCheck, MessageSquare } from 'lucide-react';

interface TeacherDashboardProps {
  entries: HistoricalEntry[];
  onApproveEntry: (id: string) => void;
  onReturnEntry: (id: string, feedback: string) => void;
  onAddPartnerComment: (id: string, comment: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  entries,
  onApproveEntry,
  onReturnEntry,
  onAddPartnerComment
}) => {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});
  const [partnerCommentText, setPartnerCommentText] = useState<{ [key: string]: string }>({});
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Φιλτράρισμα
  const pendingEntries = entries.filter(e => e.status === 'submitted');
  const approvedEntries = entries.filter(e => e.status === 'approved');

  const displayedEntries = 
    selectedTab === 'pending' ? pendingEntries :
    selectedTab === 'approved' ? approvedEntries : entries;

  // Εξαγωγή σε JSON (Τοπικό Αρχείο Σχολείου)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `istorikoi_desmoi_archive_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Εκτύπωση / Αποθήκευση σε PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Header Ταμπλό */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Περιβάλλον Εκπαιδευτικών & Συντονιστών</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Ταμπλό Ελέγχου & Δημοσίευσης (Moderation)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Έλεγχος ιστορικής ακρίβειας, τήρησης πνευματικών δικαιωμάτων και έγκριση καταχωρίσεων για προβολή στο κοινό χρονολόγιο.
          </p>
        </div>

        {/* Κουμπιά Εξαγωγής / Εκτύπωσης */}
        <div className="no-print flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            title="Λήψη όλων των δεδομένων σε αρχείο JSON"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Εξαγωγή JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            title="Εκτύπωση ή Αποθήκευση σε PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Εκτύπωση / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Φίλτρων */}
      <div className="no-print flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            selectedTab === 'pending'
              ? 'bg-amber-500 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Προς Έγκριση</span>
          <span className="px-1.5 py-0.5 bg-amber-600 text-white rounded-full text-[10px]">
            {pendingEntries.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            selectedTab === 'approved'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Εγκεκριμένα (Δημόσια)</span>
          <span className="px-1.5 py-0.5 bg-emerald-700 text-white rounded-full text-[10px]">
            {approvedEntries.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedTab === 'all'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Όλες οι Καταχωρίσεις ({entries.length})</span>
        </button>
      </div>

      {/* Λίστα Καταχωρίσεων */}
      {displayedEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-sm font-medium">Δεν υπάρχουν καταχωρίσεις σε αυτή την κατηγορία.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedEntries.map(entry => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              {/* Header Καταχώρισης */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    entry.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    entry.status === 'submitted' ? 'bg-amber-100 text-amber-800' :
                    entry.status === 'returned' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {entry.status === 'approved' ? '✓ Εγκεκριμένο' :
                     entry.status === 'submitted' ? '⏳ Προς Έλεγχο' :
                     entry.status === 'returned' ? '↩ Επεστράφη' : 'Πρόχειρο'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {entry.school?.name} • {entry.team?.name}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Έτος: <strong>{entry.year_numeric}</strong> ({entry.date_display})
                </span>
              </div>

              {/* Τίτλος & Περιεχόμενο */}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{entry.title}</h3>
                <p className="text-xs font-semibold text-blue-700 mt-1">
                  Ερευνητικό Ερώτημα: {entry.research_question}
                </p>
                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">
                  {entry.historical_context}
                </p>
              </div>

              {/* Πηγές / Τεκμήρια */}
              {entry.sources && entry.sources.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Πηγές Τεκμηρίωσης:</span>
                  {entry.sources.map(s => (
                    <div key={s.id} className="text-slate-600">
                      • <strong>{s.title}</strong> ({s.source_type}) — Κάτοχος: {s.origin_holder} | Άδεια: {s.licence_type}
                    </div>
                  ))}
                </div>
              )}

              {/* Υπάρχον Σχόλιο Συνεργαζόμενου Σχολείου */}
              {entry.partner_comment && (
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-xl text-xs text-indigo-900">
                  <span className="font-bold block mb-0.5">Συνεισφορά Συνεργαζόμενου Σχολείου:</span>
                  «{entry.partner_comment}»
                </div>
              )}

              {/* Παρατηρήσεις Εκπαιδευτικού αν υπάρχουν */}
              {entry.teacher_feedback && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Προηγούμενες Παρατηρήσεις Εκπαιδευτικού:</span>
                  {entry.teacher_feedback}
                </div>
              )}

              {/* Φόρμες Ενεργειών & Moderation Buttons */}
              <div className="no-print pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Κουμπί Προσθήκης Σχολίου Συνεργαζόμενου Σχολείου */}
                  <button
                    onClick={() => setActiveCommentId(activeCommentId === entry.id ? null : entry.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>+ Σχόλιο Άλλου Σχολείου</span>
                  </button>

                  {/* Κουμπί Επιστροφής για Διορθώσεις */}
                  <button
                    onClick={() => setActiveFeedbackId(activeFeedbackId === entry.id ? null : entry.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Επιστροφή για Διορθώσεις</span>
                  </button>
                </div>

                {/* Κουμπί Έγκρισης (Approve) */}
                {entry.status !== 'approved' && (
                  <button
                    onClick={() => onApproveEntry(entry.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition ml-auto"
                  >
                    <Check className="w-4 h-4" />
                    <span>Έγκριση & Δημοσίευση</span>
                  </button>
                )}
              </div>

              {/* Πεδίο Εισαγωγής Σχολίου Άλλου Σχολείου */}
              {activeCommentId === entry.id && (
                <div className="no-print mt-3 p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                  <label className="block text-xs font-bold text-indigo-900">
                    Προσθήκη Συμπληρωματικής Τεκμηρίωσης / Αντίλογου από το άλλο σχολείο:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="π.χ. Στο δικό μας σχολείο/πόλη καταγράφηκε παρόμοιο περιστατικό..."
                    value={partnerCommentText[entry.id] || ''}
                    onChange={e => setPartnerCommentText({ ...partnerCommentText, [entry.id]: e.target.value })}
                    className="w-full text-xs p-2 border border-indigo-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (partnerCommentText[entry.id]) {
                        onAddPartnerComment(entry.id, partnerCommentText[entry.id]);
                        setActiveCommentId(null);
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-xs shadow hover:bg-indigo-700"
                  >
                    Αποθήκευση Σχολίου
                  </button>
                </div>
              )}

              {/* Πεδίο Εισαγωγής Feedback Διόρθωσης */}
              {activeFeedbackId === entry.id && (
                <div className="no-print mt-3 p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
                  <label className="block text-xs font-bold text-red-900">
                    Οδηγίες & Παρατηρήσεις Διόρθωσης προς τη Μαθητική Ομάδα:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="π.χ. Παρακαλώ ελέγξτε ξανά την ακριβή ημερομηνία της πηγής και προσθέστε τον δημιουργό του τεκμηρίου."
                    value={feedbackText[entry.id] || ''}
                    onChange={e => setFeedbackText({ ...feedbackText, [entry.id]: e.target.value })}
                    className="w-full text-xs p-2 border border-red-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={() => {
                      if (feedbackText[entry.id]) {
                        onReturnEntry(entry.id, feedbackText[entry.id]);
                        setActiveFeedbackId(null);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs shadow hover:bg-red-700"
                  >
                    Αποστολή Παρατηρήσεων
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
