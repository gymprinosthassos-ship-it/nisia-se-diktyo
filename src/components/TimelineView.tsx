import React, { useState, useMemo } from 'react';
import type { HistoricalEntry } from '../types/database.types';
import { SmartVideoEmbed } from './SmartVideoEmbed';
import { Building, Users, BookOpen, Filter, Search, List, AlignCenter, X, MessageSquare, Award } from 'lucide-react';

interface TimelineViewProps {
  entries: HistoricalEntry[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ entries }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [activeModalEntry, setActiveModalEntry] = useState<HistoricalEntry | null>(null);

  // Εξαγωγή μοναδικών περιόδων και σχολείων για τα dropdown φίλτρα
  const periods = useMemo(() => {
    const set = new Set(entries.map(e => e.period_tag));
    return Array.from(set);
  }, [entries]);

  const schools = useMemo(() => {
    const map = new Map<string, string>();
    entries.forEach(e => {
      if (e.school) map.set(e.school.id, e.school.name);
    });
    return Array.from(map.entries());
  }, [entries]);

  // Φιλτράρισμα και ταξινόμηση
  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const matchesPeriod = selectedPeriod === 'all' || entry.period_tag === selectedPeriod;
        const matchesSchool = selectedSchool === 'all' || entry.school_id === selectedSchool;
        const matchesSearch = 
          searchQuery === '' ||
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.historical_context.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.research_question.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPeriod && matchesSchool && matchesSearch;
      })
      .sort((a, b) => a.year_numeric - b.year_numeric);
  }, [entries, selectedPeriod, selectedSchool, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Επικεφαλίδα & Εισαγωγή */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Κοινό Ψηφιακό Χρονολόγιο (19ος Αιώνας)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Νησιά σε Δίκτυο: Θάσος & Κρήτη
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Συνεργατική ιστορική έρευνα, αρχειακά τεκμήρια και προφορικές μαρτυρίες από τις μαθητικές ομάδες του <strong>Γυμνασίου Πρίνου Θάσου</strong> και του <strong>3ου ΓΕΛ Χανίων</strong>.
        </p>
      </div>

      {/* Πίνακας Φίλτρων & Αναζήτησης */}
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Αναζήτηση */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Αναζήτηση σε γεγονότα, πρόσωπα..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Φίλτρα Περιόδου & Σχολείου */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Φίλτρα:</span>
            </div>

            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Όλες οι περίοδοι</option>
              {periods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Όλα τα σχολεία</option>
              {schools.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            {/* Εναλλαγή Προβολής (Timeline vs List) */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden ml-auto">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                title="Προβολή Χρονολογίου"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                title="Προβολή Λίστας (Προσβάσιμη)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Ενεργά αποτελέσματα */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Βρέθηκαν <strong>{filteredEntries.length}</strong> εγκεκριμένες ιστορικές καταχωρίσεις</span>
          {(selectedPeriod !== 'all' || selectedSchool !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedPeriod('all');
                setSelectedSchool('all');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      </div>

      {/* Προβολή: ΧΡΟΝΟΛΟΓΙΟ (Timeline Mode) */}
      {viewMode === 'timeline' && (
        <div className="relative border-l-2 border-blue-200 ml-4 md:ml-32 space-y-12">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="relative pl-6 md:pl-10 group">
              {/* Χρονολογική Ένδειξη στα αριστερά */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white shadow"></div>
              <div className="hidden md:block absolute -left-32 top-1 text-right w-24">
                <span className="text-base font-bold text-blue-900 block">{entry.year_numeric}</span>
                <span className="text-xs text-slate-500 font-medium">{entry.date_display}</span>
              </div>

              {/* Κάρτα Γεγονότος */}
              <div 
                onClick={() => setActiveModalEntry(entry)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="md:hidden text-xs font-bold text-blue-800 mb-1">
                  {entry.date_display} ({entry.year_numeric})
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {entry.period_tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{entry.school?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{entry.team?.name}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {entry.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {entry.historical_context}
                </p>

                {/* Ερευνητικό Ερώτημα Highlight */}
                <div className="mt-3 p-2.5 bg-amber-50/70 border-l-2 border-amber-400 rounded-r-lg text-xs text-amber-900">
                  <span className="font-semibold">Ερευνητικό Ερώτημα: </span>
                  {entry.research_question}
                </div>

                {/* Πηγές / Video Banner Preview */}
                {entry.sources && entry.sources.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Τεκμήρια ({entry.sources.length}):</span>
                    {entry.sources.map(s => (
                      <span key={s.id} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600">
                        {s.source_type === 'video_link' ? '🎥 Βίντεο' : s.source_type === 'oral_history' ? '🎙️ Μαρτυρία' : '📄 Έγγραφο'}
                      </span>
                    ))}
                  </div>
                )}

                {/* Σχόλιο Συνεργαζόμενου Σχολείου Badge */}
                {entry.partner_comment && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Περιλαμβάνει συνεισφορά άλλου σχολείου</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Προβολή: ΛΙΣΤΑ (Accessible List View) */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id}
              onClick={() => setActiveModalEntry(entry)}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-blue-900">{entry.year_numeric}</span>
                  <span>•</span>
                  <span>{entry.date_display}</span>
                  <span>•</span>
                  <span className="text-blue-700 font-medium">{entry.school?.name}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 hover:text-blue-600">
                  {entry.title}
                </h3>
              </div>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 self-start sm:self-auto shrink-0">
                Προβολή
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ΑΝΑΛΥΤΙΚΗΣ ΠΡΟΒΟΛΗΣ ΤΕΚΜΗΡΙΟΥ & ΠΗΓΩΝ */}
      {activeModalEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            {/* Κουμπί κλεισίματος */}
            <button
              onClick={() => setActiveModalEntry(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tags & Μεταδεδομένα */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {activeModalEntry.period_tag}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {activeModalEntry.date_display} ({activeModalEntry.year_numeric})
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-4">
              {activeModalEntry.title}
            </h2>

            {/* Πληροφορίες Ομάδας */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span><strong>Σχολείο:</strong> {activeModalEntry.school?.name} ({activeModalEntry.school?.city})</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span><strong>Ερευνητική Ομάδα:</strong> {activeModalEntry.team?.name}</span>
              </div>
            </div>

            {/* Ερευνητικό Ερώτημα */}
            <div className="mb-6 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Ερευνητικό Ερώτημα
              </h4>
              <p className="text-sm font-medium text-amber-950">
                {activeModalEntry.research_question}
              </p>
            </div>

            {/* Ιστορικό Πλαίσιο */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Ιστορικό Πλαίσιο & Γεγονότα
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeModalEntry.historical_context}
              </p>
            </div>

            {/* Πηγές & Τεκμήρια (Video Embeds / Εικόνες) */}
            {activeModalEntry.sources && activeModalEntry.sources.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Πρωτογενείς Πηγές & Οπτικοακουστικά Τεκμήρια</span>
                </h4>
                <div className="space-y-4">
                  {activeModalEntry.sources.map(source => (
                    <div key={source.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-sm text-slate-900">{source.title}</span>
                        <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                          {source.source_type}
                        </span>
                      </div>

                      {/* Video Embed αν υπάρχει */}
                      {source.source_url && (
                        <SmartVideoEmbed url={source.source_url} title={source.title} />
                      )}

                      {/* Κριτική Πηγής */}
                      <div className="mt-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Κριτική Αξιολόγηση Πηγής: </span>
                        {source.critique_notes}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                        <span><strong>Κάτοχος/Φορέας:</strong> {source.origin_holder}</span>
                        <span><strong>Άδεια Χρήσης:</strong> {source.licence_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ιστορική Ερμηνεία */}
            <div className="mb-6 p-4 bg-blue-50/70 rounded-xl border border-blue-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                Ιστορική Ερμηνεία & Συμπεράσματα Ομάδας
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed">
                {activeModalEntry.interpretation}
              </p>
            </div>

            {/* Συνεισφορά Συνεργαζόμενου Σχολείου */}
            {activeModalEntry.partner_comment && (
              <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-600">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Συνεισφορά & Αντίλογος Συνεργαζόμενου Σχολείου</span>
                </h4>
                <p className="text-sm text-indigo-950 italic">
                  «{activeModalEntry.partner_comment}»
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
