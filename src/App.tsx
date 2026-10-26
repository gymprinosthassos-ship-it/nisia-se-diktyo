import { useState, useEffect } from 'react';
import { TimelineView } from './components/TimelineView';
import { InteractiveMap } from './components/InteractiveMap';
import { TeamPortal } from './components/TeamPortal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { UserGuideModal } from './components/UserGuideModal';
import { mockSchools, mockTeams, mockEntries } from './data/mockData';
import type { HistoricalEntry, School, Team } from './types/database.types';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Compass, 
  Anchor, 
  Map as MapIcon, 
  Cloud,
  Menu,
  X,
  ChevronUp,
  ScrollText,
  MonitorPlay,
  HelpCircle
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'timeline' | 'map' | 'teams' | 'teachers'>('timeline');
  const [entries, setEntries] = useState<HistoricalEntry[]>(mockEntries);
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Παρακολούθηση scroll για το Scroll-to-Top κουμπί
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Βοηθητική συνάρτηση διόρθωσης ονομασίας (3ο αντί για 4ο Λύκειο Χανίων)
  const sanitizeSchoolText = (text: string) =>
    text
      .replace(/4[οo]\s*Γενικό\s*Λύκειο/gi, '3ο Γενικό Λύκειο')
      .replace(/4[οo]\s*ΓΕΛ/gi, '3ο ΓΕΛ')
      .replace(/4[οo]\s*Λύκειο/gi, '3ο Λύκειο');

  // Φόρτωση ζωντανών δεδομένων από Supabase
  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured()) {
        console.log('Using local fallback data (Supabase not configured)');
        return;
      }

      try {
        // 1. Φόρτωση Σχολείων
        const { data: rawSchoolsData } = await supabase.from('schools').select('*');
        let normalizedSchools: School[] = mockSchools;
        if (rawSchoolsData && rawSchoolsData.length > 0) {
          normalizedSchools = (rawSchoolsData as School[]).map(s => ({
            ...s,
            name: sanitizeSchoolText(s.name)
          }));
          setSchools(normalizedSchools);
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
            school: (normalizedSchools || mockSchools).find(s => s.id === e.school_id),
            team: (teamsData || mockTeams).find(t => t.id === e.team_id),
            partner_comment: e.partner_comment ? sanitizeSchoolText(e.partner_comment) : null
          })) as HistoricalEntry[];

          // Συγχώνευση με τα mock entries ώστε να υπάρχουν πάντα τεκμήρια και για τα δύο σχολεία (Θάσος & Χανιά)
          const existingTitles = new Set(enrichedEntries.map(e => e.title.trim().toLowerCase()));
          const extraMocks = mockEntries.filter(m => !existingTitles.has(m.title.trim().toLowerCase()));
          setEntries([...enrichedEntries, ...extraMocks]);
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

  const navItems = [
    { id: 'timeline' as const, label: 'Χρονολόγιο', icon: BookOpen, desc: 'Διαδραστικό ιστορικό χρονολόγιο' },
    { id: 'map' as const, label: 'Χάρτης Δικτύου', icon: MapIcon, desc: 'Ναυτικοί & εμπορικοί δρόμοι' },
    { id: 'teams' as const, label: 'Υποβολή Ομάδων', icon: Users, desc: 'Καταχώριση αρχειακών τεκμηρίων' },
    { id: 'teachers' as const, label: 'Εκπαιδευτικοί', icon: ShieldCheck, desc: 'Επιμέλεια & αξιολόγηση' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f6fa] flex flex-col selection:bg-amber-500 selection:text-slate-900">
      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Τίτλος */}
          <div 
            onClick={() => {
              setCurrentTab('timeline');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img 
                src="/logo.jpg" 
                alt="Ομάδα Ιστορίας: Θάσος - Κρήτη" 
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-amber-400 shadow-md object-cover group-hover:scale-105 group-hover:border-amber-300 transition duration-300"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-bold text-white tracking-tight leading-tight group-hover:text-amber-300 transition">
                  ΝΗΣΙΑ ΣΕ ΔΙΚΤΥΟ
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  19ος αι.
                </span>
                {isLiveConnected && (
                  <span className="hidden xl:flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span>Cloud Live</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 block font-normal text-slate-400 line-clamp-1">
                Θάσος & Κρήτη στην Οθωμανική Μεσόγειο του Μεχμέτ Αλή
              </span>
            </div>
          </div>

          {/* School Badges in Top Navbar (Proposal 2) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-md text-xs">
            <span className="text-blue-300 font-semibold flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-blue-400" />
              Γυμνάσιο Πρίνου Θάσου
            </span>
            <span className="text-amber-400 text-xs font-bold px-0.5">⟷</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              3ο Γενικό Λύκειο Χανίων
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-amber-300 rounded-full"></span>
                  )}
                </button>
              );
            })}

            {/* Help & Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="ml-1 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1.5 shadow-sm"
              title="Εγχειρίδιο Χρήσης & Βοήθεια"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Βοήθεια</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Μενού πλοήγησης"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div>
                    <div>{item.label}</div>
                    <div className={`text-[11px] font-normal ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Mobile Help Button */}
            <button
              onClick={() => {
                setIsGuideOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition"
            >
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div>Εγχειρίδιο Χρήσης & Βοήθεια</div>
                <div className="text-[11px] font-normal text-amber-200/80">Οδηγίες για μαθητές & καθηγητές</div>
              </div>
            </button>

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Γυμνάσιο Πρίνου Θάσου ⟷ 3ο ΓΕΛ Χανίων</span>
              <span className="text-amber-400 font-bold">2026-2027</span>
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner with Historical Aesthetic & Artwork Background */}
      <section className="no-print relative bg-slate-950 text-white pt-8 pb-14 px-4 overflow-hidden border-b border-slate-800">
        {/* Background Artwork Layer (clearly visible, saturated historical illustration) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 filter saturate-125 contrast-110 pointer-events-none scale-105"
          style={{ backgroundImage: `url('/logo.jpg')` }}
        />
        {/* Soft Localized Dark Overlays to ensure text is crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Title with Circular Seal Medallion */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0 group">
                <img 
                  src="/logo.jpg" 
                  alt="Σφραγίδα Διασχολικού Εργαστηρίου" 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400 shadow-2xl object-cover ring-4 ring-amber-500/30 group-hover:scale-105 group-hover:border-amber-300 transition duration-300"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-serif font-bold text-white tracking-tight leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Διασχολικό Εργαστήριο Ιστορίας <span className="text-amber-400 whitespace-nowrap">(2026 – 2027)</span>
                </h1>
              </div>
            </div>

            {/* Wings / Πτέρυγες (Interactive Cards) */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <div className="group bg-slate-950/80 backdrop-blur-md hover:bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/80 rounded-xl p-3 shadow-xl transition-all duration-200 cursor-default">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition">
                    <ScrollText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
                      Α΄ ΠΤΕΡΥΓΑ
                    </span>
                    <span className="text-white text-xs font-semibold">
                      Αρχειακή Έρευνα <span className="text-slate-300 font-normal">(4 Υποομάδες)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-950/80 backdrop-blur-md hover:bg-slate-900/90 border border-slate-700/80 hover:border-blue-400/80 rounded-xl p-3 shadow-xl transition-all duration-200 cursor-default">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition">
                    <MonitorPlay className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block">
                      Β΄ ΠΤΕΡΥΓΑ
                    </span>
                    <span className="text-white text-xs font-semibold">
                      Ψηφιακή Δημιουργία <span className="text-slate-300 font-normal">(4 Υποομάδες)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave Divider Transition to Light Content */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg 
            className="relative block w-full h-6 sm:h-9" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.31,192,108.79,235.8,99.78,278.43,76.54,321.39,56.44Z" 
              fill="#f0f6fa"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content Area */}
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

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="no-print fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Επιστροφή στην κορυφή"
          aria-label="Επιστροφή στην κορυφή"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Rich Multi-Column Footer */}
      <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
            {/* Identity Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="Logo" 
                  className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                />
                <div>
                  <span className="font-serif font-bold text-white text-base block tracking-tight">
                    ΝΗΣΙΑ ΣΕ ΔΙΚΤΥΟ
                  </span>
                  <span className="text-[11px] text-amber-400">
                    Θάσος & Κρήτη στην Οθωμανική Μεσόγειο (19ος αι.)
                  </span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
                Εκπαιδευτικό πρόγραμμα ιστορικής έρευνας, μελέτης αρχειακών τεκμηρίων και ψηφιακής διασύνδεσης μαθητών από το Βόρειο και Νότιο Αιγαίο.
              </p>
            </div>

            {/* Quick Navigation Column */}
            <div className="md:col-span-3 space-y-2.5">
              <span className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                ΠΛΟΗΓΗΣΗ
              </span>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentTab(item.id);
                        scrollToTop();
                      }}
                      className="hover:text-amber-400 transition flex items-center gap-2"
                    >
                      <span className="text-amber-400">•</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      setIsGuideOpen(true);
                      scrollToTop();
                    }}
                    className="hover:text-amber-400 transition flex items-center gap-2 text-amber-300 font-medium"
                  >
                    <span className="text-amber-400">★</span>
                    <span>Εγχειρίδιο Χρήσης (Οδηγός)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Schools & Credits Column */}
            <div className="md:col-span-4 space-y-2.5">
              <span className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                ΣΥΝΕΡΓΑΖΟΜΕΝΑ ΣΧΟΛΕΙΑ
              </span>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-start gap-2">
                  <Anchor className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Γυμνάσιο Πρίνου Θάσου</strong>
                    <span className="text-[11px]">Πρίνος, Θάσος • Α΄ & Β΄ Πτέρυγες</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">3ο Γενικό Λύκειο Χανίων</strong>
                    <span className="text-[11px]">Χανιά, Κρήτη • Α΄ & Β΄ Πτέρυγες</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-xs border-t border-slate-800/80 mt-6">
            <p className="text-slate-400 text-xs sm:text-sm">
              © 2026–2027 • Διασχολικό Εργαστήριο Ιστορίας
            </p>

            {/* Developer Credit: Ανάπτυξη Ιστοσελίδας & Logo (Μεγάλο & Ευανάγνωστο) */}
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl hover:border-amber-500/50 transition duration-300 group">
              <span className="text-slate-200 font-serif font-bold text-sm sm:text-base tracking-wide">
                Ανάπτυξη Ιστοσελίδας:
              </span>
              <img 
                src="/anaskalli-logo.png" 
                alt="ANASKALLI" 
                className="h-20 sm:h-24 w-auto object-contain rounded-lg shadow-lg group-hover:scale-105 transition duration-300 border border-amber-400/30 ring-2 ring-amber-500/10"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                100% Ασφαλής & Ανοικτή Πλατφόρμα
              </span>
            </div>
          </div>
        </div>
      </footer>
      {/* Interactive User Guide Modal */}
      <UserGuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
    </div>
  );
}

export default App;
