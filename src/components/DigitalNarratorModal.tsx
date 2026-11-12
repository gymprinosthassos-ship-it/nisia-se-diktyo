import React, { useState, useEffect, useRef } from 'react';
import { Traveler19thAvatar } from './Traveler19thAvatar';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  Compass, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import type { Language } from '../data/translations';

export interface NarratorStation {
  id: number;
  stageNumber: string;
  island: string;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  text: string;
  audioUrl: string;
  historicalQuote?: string;
  actionButton?: {
    label: string;
    targetTab: 'timeline' | 'map' | 'teams' | 'identity';
  };
}

const narratorStationsEl: NarratorStation[] = [
  {
    id: 1,
    stageNumber: "Σταθμός 1",
    island: "Θάσος",
    title: "Η Θάσος του Μεχμέτ Αλή & το Βακούφι (1813)",
    subtitle: "Από την παραχώρηση του νησιού στη συντήρηση του Ιμαρέτ Καβάλας",
    accentColor: "text-amber-500",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    text: `Καλωσορίσατε στα πέλαγα και στους καιρούς των παλιών. Βρισκόμαστε στα 1813. Ο Μεχμέτ Αλή Πασάς, γεννημένος στην Καβάλα μα γενόμενος ισχυρός άρχοντας της Αιγύπτου, παίρνει τη Θάσο ως δωρεά απ' τον Σουλτάνο Μαχμούτ τον Δεύτερο. Τούτο το νησί τ' αφιερώνει Βακούφι, για να βαστά και να συντηρεί το ξακουστό Ιμαρέτ της Καβάλας. Στον Πρίνο, στους παλιούς ελαιώνες και στα λιοτρίβια, οι άνθρωποι ανάσαναν με μια ιδιαίτερη αυτονομία, κρατώντας τα παλιά τους προνόμια.`,
    audioUrl: "/audio/narrator-station-1.mp3",
    historicalQuote: `«Η νήσος Θάσος αφιερούται εις το εν Καβάλα ευαγές ίδρυμα, διατηρούσα τα αρχαία αυτής προνόμια...» — Οθωμανικό Φιρμάνιο (1813)`,
    actionButton: {
      label: "Δείτε το στο Χρονολόγιο (1813)",
      targetTab: "timeline"
    }
  },
  {
    id: 2,
    stageNumber: "Σταθμός 2",
    island: "Αιγαίο",
    title: "Θαλάσσιοι Δρόμοι & Μεσογειακά Δίκτυα",
    subtitle: "Οι ρότες του ελαιολάδου, της ξυλείας και των ανθρώπων",
    accentColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    text: `Η θάλασσα δεν χώριζε τα νησιά μας, μα τα 'δενε γερά. Σε τούτο το Αιγαίο, καΐκια και ιστιοφόρα με έμπειρους καπεταναίους άνοιγαν πανιά. Απ' τον Πρίνο και τους ορμίσκους της Θάσου φορτωμένα με λάδι ξανθό και ναυπηγική ξυλεία, κατηφόριζαν στα λιμάνια του Νότου — στα Χανιά, στο Ηράκλειο και στην Αλεξάνδρεια. Ήταν μια Οθωμανική Μεσόγειος σε αναβρασμό, όπου οι άνθρωποι, τα εμπορεύματα και τα κιτάπια ταξίδευαν ασταμάτητα.`,
    audioUrl: "/audio/narrator-station-2.mp3",
    historicalQuote: `«Καΐκια εκ των βορείων νήσων κατέπλεον εις τους κρητικούς λιμένας, ανταλλάσσοντα ξυλείαν και έλαιον...» — Ναυτιλιακά Κατάστιχα Εποχής`,
    actionButton: {
      label: "Εξερευνήστε τον Ναυτικό Χάρτη",
      targetTab: "map"
    }
  },
  {
    id: 3,
    stageNumber: "Σταθμός 3",
    island: "Χανιά",
    title: "Η Αιγυπτιοκρατία στην Κρήτη (1830–1840)",
    subtitle: "Η αναμόρφωση των Χανίων, ο Αιγυπτιακός Φάρος και η αναδιοργάνωση",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    text: `Αρμενίζοντας νοτιότερα, φτάνουμε στα νερά της Κρήτης. Μετά τον μεγάλο ξεσηκωμό του 1821, οι Μεγάλες Δυνάμεις παραχωρούν την Κρήτη στον Μεχμέτ Αλή για μια ολόκληρη δεκαετία, απ' τα 1830 ως τα 1840. Επί διοικητού Μουσταφά Ναϊλή Πασά, τα Χανιά αλλάζουνε όψη. Το λιμάνι βαθαίνει, χτίζεται απ' την αρχή ο περίφημος Αιγυπτιακός Φάρος σε σχήμα μιναρέ που στέκει αγέρωχος ως τα σήμερα, και το εμπόριο του λαδιού και του σαπουνιού γνωρίζει μέρες ακμής.`,
    audioUrl: "/audio/narrator-station-3.mp3",
    historicalQuote: `«Ο Φάρος των Χανίων ανηγέρθη επί αιγυπτιακής διοικήσεως, δεσπόζων επί των παλαιών ενετικών οχυρώσεων...» — Αρχειακές Πηγές Χανίων`,
    actionButton: {
      label: "Δείτε τα Τεκμήρια των Χανίων",
      targetTab: "timeline"
    }
  },
  {
    id: 4,
    stageNumber: "Σταθμός 4",
    island: "Κοινό Έργο",
    title: "Δύο Σχολεία — Ένα Κοινό Ψηφιακό Δίκτυο",
    subtitle: "Γυμνάσιο Πρίνου Θάσου & 3ο ΓΕΛ Χανίων ενώνουν το παρελθόν με το μέλλον",
    accentColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    text: `Και να που σήμερα, διακόσια χρόνια μετά, η παλιά ιστορία γίνεται γέφυρα αδελφοσύνης. Οι κοπελιές, οι μαθητές κι οι δάσκαλοι απ' το Γυμνάσιο Πρίνου της Θάσου και το 3ο Γενικό Λύκειο Χανίων σμίγουν σε ένα κοινό ταξίδι. Ψάχνουνε κιτάπια και παλιά χαρτιά, ρωτούνε τους γερόντους, ιστορούν τα μνημεία και χτίζουν αυτή την πλατφόρμα. Οι ιστορικοί δεσμοί των νησιών μας ζωντανεύουν ξανά, με τη φρεσκάδα και τη φωνή της νέας γενιάς.`,
    audioUrl: "/audio/narrator-station-4.mp3",
    historicalQuote: `«Γεφυρώνοντας το Βόρειο Αιγαίο με την Κρήτη μέσα από τη μαθητική ιστορική έρευνα.»`,
    actionButton: {
      label: "Γνωρίστε τις Μαθητικές Ομάδες",
      targetTab: "teams"
    }
  }
];

const narratorStationsEn: NarratorStation[] = [
  {
    id: 1,
    stageNumber: "Station 1",
    island: "Thassos",
    title: "Thassos under Muhammad Ali & the Waqf (1813)",
    subtitle: "From the island's grant to the endowment of the Kavala Imaret",
    accentColor: "text-amber-500",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    text: `Welcome to the open seas and the bygone eras. We find ourselves in 1813. Muhammad Ali Pasha, born in nearby Kavala and now the formidable ruler of Egypt, receives the island of Thassos as an imperial grant from Sultan Mahmud II. He dedicates the entire island as a Waqf endowment to sustain his majestic Imaret in Kavala. In Prinos, amid centuries-old olive groves and stone presses, the islanders lived under a unique autonomy, preserving their ancient privileges.`,
    audioUrl: "/audio/narrator-station-1-en.mp3",
    historicalQuote: `«The island of Thassos is dedicated as an endowment to the charitable foundation of Kavala, retaining its ancient privileges...» — Ottoman Firman (1813)`,
    actionButton: {
      label: "View in Historical Timeline (1813)",
      targetTab: "timeline"
    }
  },
  {
    id: 2,
    stageNumber: "Station 2",
    island: "Aegean",
    title: "Maritime Routes & Mediterranean Networks",
    subtitle: "The maritime trade routes of olive oil, timber, and seafaring communities",
    accentColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    text: `The sea never divided our islands; it forged an enduring bond between them. Across the Aegean, seaworthy caiques and trading schooners hoisted their sails under seasoned captains. From Prinos and the coves of Thassos, laden with golden olive oil and ship timber, down to the bustling ports of the South—Chania, and onwards to Alexandria. It was an Ottoman Mediterranean in transition, where seafaring people, merchandise, and ideas wove an unbroken maritime network.`,
    audioUrl: "/audio/narrator-station-2-en.mp3",
    historicalQuote: `«Caiques from the northern islands cast anchor in the Cretan ports, exchanging Thassian timber and oil for southern products...» — Maritime Customs Ledger`,
    actionButton: {
      label: "Explore the Maritime Map",
      targetTab: "map"
    }
  },
  {
    id: 3,
    stageNumber: "Station 3",
    island: "Chania",
    title: "Egyptian Administration in Crete (1830–1840)",
    subtitle: "The renewal of Chania, the Egyptian Lighthouse, and the agrarian revival",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    text: `Setting our course south, we reach the waters of Crete. Following the great struggle of 1821, the Great Powers placed Crete under the rule of Muhammad Ali for an entire decade, from 1830 to 1840. Under Governor Mustafa Naili Pasha, Chania underwent an architectural and administrative renewal. The harbor was dredged, the iconic Egyptian Lighthouse was erected in the shape of a minaret atop Venetian stones, and the olive oil trade entered days of prosperity.`,
    audioUrl: "/audio/narrator-station-3-en.mp3",
    historicalQuote: `«The Lighthouse of Chania was erected under Egyptian administration, commanding the old Venetian fortifications...» — Historical Archives of Chania (GAK)`,
    actionButton: {
      label: "View Chania Archival Dossier",
      targetTab: "timeline"
    }
  },
  {
    id: 4,
    stageNumber: "Station 4",
    island: "Shared Network",
    title: "Two Schools — One Shared Digital Network",
    subtitle: "Junior High School of Prinos, Thassos & 3rd Senior High School of Chania connect past and future",
    accentColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    text: `And here we are today, two centuries later, as that distant history becomes a bridge of friendship. The students and educators of the Junior High School of Prinos, Thassos, and the 3rd Senior High School of Chania, Crete, unite on a shared voyage. Investigating primary archives, interviewing elders, documenting monuments, and building this collaborative digital platform. The historic ties of our islands come alive once more, animated by the voice of a new generation.`,
    audioUrl: "/audio/narrator-station-4-en.mp3",
    historicalQuote: `«Bridging the North Aegean with Crete through collaborative student historical research.»`,
    actionButton: {
      label: "Discover the Student Teams",
      targetTab: "teams"
    }
  }
];

interface DigitalNarratorModalProps {
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onNavigateToTab: (tab: 'timeline' | 'map' | 'teams' | 'identity') => void;
}

export const DigitalNarratorModal: React.FC<DigitalNarratorModalProps> = ({
  isOpen,
  language = 'el',
  onClose,
  onNavigateToTab
}) => {
  const [narratorLang, setNarratorLang] = useState<Language>(language);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync internal language state with prop
  useEffect(() => {
    setNarratorLang(language);
  }, [language]);

  const isEn = narratorLang === 'en';
  const stations = isEn ? narratorStationsEn : narratorStationsEl;
  const station = stations[currentIdx] || stations[0];

  // Stop audio playback
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // Switch language inside modal
  const handleSwitchLang = (newLang: Language) => {
    if (newLang !== narratorLang) {
      stopAudio();
      setNarratorLang(newLang);
    }
  };

  // Cleanup on close or unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Controls for natural neural audio
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(station.audioUrl);
      
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 0);
        }
      };

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime || 0);
          if (audioRef.current.duration && !duration) {
            setDuration(audioRef.current.duration);
          }
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audioRef.current.onerror = () => {
        console.error('Audio playback error:', station.audioUrl);
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleNext = () => {
    stopAudio();
    if (currentIdx < stations.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    stopAudio();
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative text-white flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3.5">
            <Traveler19thAvatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-amber-500/80 shadow-md shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  {isEn ? 'Digital Project Narrator' : 'Ψηφιακός Αφηγητής Έργου'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  {isEn ? '19th C. Traveler (Aegean Timbre)' : 'Ταξιδευτής 19ου αι. (Μπάσα / Κρητική χροιά)'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                {isEn ? 'The Voyage of Historic Ties' : 'Το Ταξίδι των Ιστορικών Δεσμών'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* In-Modal Language Switcher [ EL | EN ] */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-0.5 text-xs font-bold shadow-inner">
              <button
                onClick={() => handleSwitchLang('el')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  narratorLang === 'el'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ελληνικά"
              >
                <span>🇬🇷</span>
                <span className="text-[11px]">EL</span>
              </button>
              <button
                onClick={() => handleSwitchLang('en')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  narratorLang === 'en'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="text-[11px]">EN</span>
              </button>
            </div>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isEn ? 'Close Narrator' : 'Κλείσιμο Ξεναγού'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stations Navigation Bar (Pills) */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stations.map((st, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={st.id}
                onClick={() => {
                  stopAudio();
                  setCurrentIdx(idx);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 border text-center ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-102 font-bold' 
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">{st.stageNumber}</span>
                <span className="text-xs truncate max-w-full font-serif">{st.island}</span>
              </button>
            );
          })}
        </div>

        {/* Current Station Content */}
        <div className="space-y-6 flex-1">
          {/* Header of Station */}
          <div className="space-y-1.5 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${station.badgeBg}`}>
                {station.island}
              </span>
              <span className="text-xs text-slate-400">
                {station.stageNumber} {isEn ? 'of 4' : 'από 4'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 leading-snug">
              {station.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {station.subtitle}
            </p>
          </div>

          {/* Natural Voiceover Player Controls */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className={`p-3 rounded-2xl font-bold flex items-center gap-2 text-xs shadow-md transition ${
                    isPlaying 
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-400/50' 
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  <Traveler19thAvatar className="w-5 h-5 rounded-full" showBorder={false} />
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? (isEn ? 'Pause' : 'Παύση') : (isEn ? 'Listen to the Traveler' : 'Ακούστε τον Ταξιδευτή')}</span>
                </button>

                {currentTime > 0 && (
                  <button
                    onClick={handleRestart}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                    title={isEn ? 'Restart narration' : 'Επανάληψη από την αρχή'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                {isPlaying && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:450ms]"></span>
                    <span className="text-xs text-amber-300 italic hidden sm:inline ml-1 font-serif">
                      {isEn ? 'Narration in progress...' : 'Αφήγηση σε εξέλιξη...'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">
                  {formatTime(currentTime)} {duration > 0 && `/ ${formatTime(duration)}`}
                </span>
              </div>
            </div>

            {/* Audio Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Narration Narrative Text */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <p className="text-sm sm:text-base text-slate-200 font-serif leading-relaxed text-justify">
              {station.text}
            </p>

            {station.historicalQuote && (
              <blockquote className="p-3.5 rounded-xl bg-slate-900 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed">
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1">
                  {isEn ? 'Historical Archival Quote' : 'Ιστορικό Τεκμήριο Εποχής'}
                </div>
                {station.historicalQuote}
              </blockquote>
            )}

            {/* Direct Action Navigation Button */}
            {station.actionButton && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    stopAudio();
                    onClose();
                    onNavigateToTab(station.actionButton!.targetTab);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition shadow-sm"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{station.actionButton.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Buttons (Prev / Next) */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              currentIdx === 0
                ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-950'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Previous Station' : 'Προηγούμενος Σταθμός'}</span>
          </button>

          <span className="text-xs text-slate-500 font-serif hidden sm:inline">
            {isEn ? 'Station ' + (currentIdx + 1) + ' of 4' : 'Σταθμός ' + (currentIdx + 1) + ' από 4'}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIdx === stations.length - 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              currentIdx === stations.length - 1
                ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-950'
                : 'text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md'
            }`}
          >
            <span>{isEn ? 'Next Station' : 'Επόμενος Σταθμός'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
