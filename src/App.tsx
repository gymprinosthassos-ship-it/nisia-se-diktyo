import { useState, useEffect } from 'react';
import { TimelineView } from './components/TimelineView';
import { InteractiveMap } from './components/InteractiveMap';
import { TeamPortal } from './components/TeamPortal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { mockSchools, mockTeams, mockEntries } from './data/mockData';
import type { HistoricalEntry, School, Team } from './types/database.types';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { BookOpen, Users, ShieldCheck, Compass, Anchor, Map as MapIcon, Cloud } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'timeline' | 'map' | 'teams' | 'teachers'>('timeline');
  const [entries, setEntries] = useState<HistoricalEntry[]>(mockEntries);
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Φόρτωση ζωντανών δεδομένων από Supabase
  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured()) {
        console.log('Using local fallback data (Supabase not configured)');
        return;
      }

      try {
        // 1. Φόρτωση Σχολείων
        const { data: schoolsData } = await supabase.from('schools').select('*');
        if (schoolsData && schoolsData.length > 0) {
          setSchools(schoolsData as School[]);
        }

        // 2. Φόρτωση Ομάδων
        const { data: teamsData } = await supabase.from('teams').select('*');
        if (teamsData && teamsData.length > 0) {
          setTeams(teamsData as Team[]);
        }

        // 3. Φόρτωση Καταχωρίσεων με Sources
        const { data: entriesData, error } = await supabase
          .from('entries')
          .select(`
            *,
            sources (*)
          `)
          .order('year_numeric', { ascending: true });

        if (!error && entriesData && entriesData.length > 0) {
          // Σύνδεση σχολείων και ομάδων
          const enrichedEntries = entriesData.map(e => ({
            ...e,
            school: (schoolsData || mockSchools).find(s => s.id === e.school_id),
            team: (teamsData || mockTeams).find(t => t.id === e.team_id)
          })) as HistoricalEntry[];

          setEntries(enrichedEntries);
          setIsLiveConnected(true);
        }
      } catch (err) {
        console.warn('Error fetching Supabase data, keeping mock data:', err);
      }
    }

    loadData();
  }, []);

  // Προσθήκη νέας καταχώρισης από μαθητική ομάδα (Ζωντανή εγγραφή στο Supabase)
  const handleNewEntry = async (partialEntry: Partial<HistoricalEntry>) => {
    const school = schools.find(s => s.id === partialEntry.school_id);
    const team = teams.find(t => t.id === partialEntry.team_id);

    const tempId = `entry-${Date.now()}`;
    const fullEntry: HistoricalEntry = {
      id: tempId,
      school_id: partialEntry.school_id || schools[0].id,
      team_id: partialEntry.team_id || teams[0].id,
      title: partialEntry.title || '',
      date_display: partialEntry.date_display || '',
      year_numeric: partialEntry.year_numeric || 1830,
      period_tag: partialEntry.period_tag || 'Οθωμανική Διοίκηση & Μεχμέτ Αλή',
      location_tag: partialEntry.location_tag || 'thasos',
      historical_context: partialEntry.historical_context || '',
      research_question: partialEntry.research_question || '',
      interpretation: partialEntry.interpretation || '',
      partner_comment: null,
      status: partialEntry.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      school,
      team,
      sources: partialEntry.sources || []
    };

    // Ενημέρωση τοπικού state
    setEntries(prev => [fullEntry, ...prev]);

    // Αν είναι συνδεδεμένο το Supabase, αποθηκεύουμε στη βάση
    if (isSupabaseConfigured()) {
      try {
        const { data: insertedEntry, error: entryErr } = await supabase
          .from('entries')
          .insert({
            school_id: fullEntry.school_id,
            team_id: fullEntry.team_id,
            title: fullEntry.title,
            date_display: fullEntry.date_display,
            year_numeric: fullEntry.year_numeric,
            period_tag: fullEntry.period_tag,
            location_tag: fullEntry.location_tag,
            historical_context: fullEntry.historical_context,
            research_question: fullEntry.research_question,
            interpretation: fullEntry.interpretation,
            status: fullEntry.status
          })
          .select()
          .single();

        if (!entryErr && insertedEntry && partialEntry.sources && partialEntry.sources.length > 0) {
          const sourcesToInsert = partialEntry.sources.map(s => ({
            entry_id: insertedEntry.id,
            title: s.title,
            source_type: s.source_type,
            origin_holder: s.origin_holder,
            source_url: s.source_url,
            licence_type: s.licence_type,
            critique_notes: s.critique_notes
          }));

          await supabase.from('sources').insert(sourcesToInsert);
        }
      } catch (e) {
        console.error('Failed to sync entry to Supabase:', e);
      }
    }
  };

  // Έγκριση καταχώρισης από εκπαιδευτικό
  const handleApproveEntry = async (id: string) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'approved', approved_at: new Date().toISOString() } : e))
    );

    if (isSupabaseConfigured()) {
      await supabase
        .from('entries')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', id);
    }
  };

  // Επιστροφή για διορθώσεις
  const handleReturnEntry = async (id: string, feedback: string) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'returned', teacher_feedback: feedback } : e))
    );

    if (isSupabaseConfigured()) {
      await supabase
        .from('entries')
        .update({ status: 'returned', teacher_feedback: feedback })
        .eq('id', id);
    }
  };

  // Προσθήκη σχολίου άλλου σχολείου
  const handleAddPartnerComment = async (id: string, comment: string) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, partner_comment: comment } : e))
    );

    if (isSupabaseConfigured()) {
      await supabase
        .from('entries')
        .update({ partner_comment: comment })
        .eq('id', id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-18 py-2 flex items-center justify-between">
          {/* Logo & Τίτλος */}
          <div 
            onClick={() => setCurrentTab('timeline')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/logo.jpg" 
              alt="Ομάδα Ιστορίας: Θάσος - Κρήτη" 
              className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-md object-cover group-hover:scale-105 transition"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                  ΝΗΣΙΑ ΣΕ ΔΙΚΤΥΟ
                </span>
                <span className="hidden md:inline px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                  19ος αι.
                </span>
                {isLiveConnected && (
                  <span className="hidden lg:flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span>Cloud Live</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-300 block font-medium">
                Θάσος & Κρήτη στην Οθωμανική Μεσόγειο του Μεχμέτ Αλή
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('timeline')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'timeline'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Χρονολόγιο</span>
            </button>

            <button
              onClick={() => setCurrentTab('map')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'map'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Χάρτης Δικτύου</span>
            </button>

            <button
              onClick={() => setCurrentTab('teams')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'teams'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Υποβολή Ομάδων</span>
            </button>

            <button
              onClick={() => setCurrentTab('teachers')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'teachers'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Εκπαιδευτικοί</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="no-print bg-gradient-to-b from-slate-900 to-slate-800 text-white border-b border-slate-700 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/80 shadow-2xl object-cover shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white flex items-center gap-1">
                  <Anchor className="w-3 h-3" />
                  Γυμνάσιο Πρίνου Θάσου
                </span>
                <span className="text-slate-400 text-xs">✕</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-600 text-white flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  4ο Γενικό Λύκειο Χανίων
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Διασχολικό Εργαστήριο Ιστορίας (2026 – 2027)
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Συνεργατική ιστορική έρευνα 8 μαθητικών υποομάδων: Αρχειακή έρευνα για την κοινωνία, τη διοίκηση, το εμπόριο και την αρχιτεκτονική, σε διασύνδεση με ψηφιακή επιμέλεια, οπτικοακουστικά τεκμήρια και διαδραστική χαρτογράφηση.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 text-xs shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 px-3">
              <span className="text-amber-400 font-bold block mb-0.5">Α΄ ΠΤΕΡΥΓΑ</span>
              <span className="text-slate-300">Αρχειακή Έρευνα (4 Υποομάδες)</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 px-3">
              <span className="text-blue-400 font-bold block mb-0.5">Β΄ ΠΤΕΡΥΓΑ</span>
              <span className="text-slate-300">Ψηφιακή Δημιουργία (4 Υποομάδες)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {currentTab === 'timeline' && <TimelineView entries={entries.filter(e => e.status === 'approved')} />}
        {currentTab === 'map' && <InteractiveMap entries={entries.filter(e => e.status === 'approved')} />}
        {currentTab === 'teams' && (
          <TeamPortal 
            schools={schools} 
            teams={teams} 
            onSubmitEntry={handleNewEntry} 
          />
        )}
        {currentTab === 'teachers' && (
          <TeacherDashboard
            entries={entries}
            onApproveEntry={handleApproveEntry}
            onReturnEntry={handleReturnEntry}
            onAddPartnerComment={handleAddPartnerComment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026–2027 • Γυμνάσιο Πρίνου Θάσου & 4ο Γενικό Λύκειο Χανίων</p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Ομάδα Ιστορίας: Νησιά σε Δίκτυο</span>
            <span>•</span>
            <span>100% Δωρεάν & Ασφαλής Πλατφόρμα</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
