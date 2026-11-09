import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Compass, 
  Headphones, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export interface NarratorStation {
  id: number;
  stageNumber: string;
  island: 'Θάσος' | 'Αιγαίο' | 'Χανιά' | 'Κοινό Έργο';
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  text: string;
  historicalQuote?: string;
  actionButton?: {
    label: string;
    targetTab: 'timeline' | 'map' | 'teams' | 'identity';
  };
}

const narratorStations: NarratorStation[] = [
  {
    id: 1,
    stageNumber: 'Σταθμός 1',
    island: 'Θάσος',
    title: 'Η Θάσος του Μεχμέτ Αλή & το Βακούφι (1813)',
    subtitle: 'Από την παραχώρηση του νησιού στη συντήρηση του Ιμαρέτ Καβάλας',
    accentColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    text: 'Καλώς ήρθατε στους Ιστορικούς Δεσμούς. Βρισκόμαστε στο 1813. Ο Μεχμέτ Αλή Πασάς, γεννημένος στην Καβάλα και ισχυρός ηγεμόνας της Αιγύπτου, λαμβάνει τη Θάσο ως δωρεά από τον Σουλτάνο Μαχμούτ Β΄. Ο Μεχμέτ Αλή αφιερώνει τα έσοδα του νησιού ως Βακούφι για τη συντήρηση του περίφημου Ιμαρέτ της Καβάλας. Στον Πρίνο και σε όλο το νησί, οι παλαιοί ελαιώνες, τα παραδοσιακά λιοτρίβια και τα τρία ενετικά και αιγυπτιακά κτήρια μαρτυρούν μια εποχή ιδιαίτερης διοικητικής και οικονομικής αυτονομίας.',
    historicalQuote: '«Η νήσος Θάσος αφιερούται εις το εν Καβάλα ευαγές ίδρυμα, διατηρούσα τα αρχαία αυτής προνόμια...» — Οθωμανικό Φιρμάνιο (1813)',
    actionButton: {
      label: 'Δείτε το στο Χρονολόγιο (1813)',
      targetTab: 'timeline'
    }
  },
  {
    id: 2,
    stageNumber: 'Σταθμός 2',
    island: 'Αιγαίο',
    title: 'Θαλάσσιοι Δρόμοι & Μεσογειακά Δίκτυα',
    subtitle: 'Οι ρότες του ελαιολάδου, της ξυλείας και των ανθρώπων',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    text: 'Η θάλασσα δεν χώριζε τα νησιά, αλλά τα ένωνε. Καθ\' όλη τη διάρκεια του 19ου αιώνα, εμπορικά ιστιοφόρα και καΐκια όργωναν το Αιγαίο Πέλαγος. Από τα λιμάνια του Πρίνου και του Λιμένα, φορτία με εκλεκτό θασίτικο λάδι και ναυπηγική ξυλεία ταξίδευαν νότια. Οι ναυτικοί χάρτες και τα κατάστιχα καταγράφουν τις θαλάσσιες ρότες που συνέδεαν το Βόρειο Αιγαίο με τις Κυκλάδες και την Κρήτη, μέσα σε μια Μεσόγειο έντονων γεωπολιτικών αλλαγών.',
    historicalQuote: '«Τα θασιακά σκάφη διέπλεον το Αιγαίον, μεταφέροντα έλαιον και ξυλείαν έως τα λιμάνια της Κρήτης και της Αλεξανδρείας...»',
    actionButton: {
      label: 'Εξερευνήστε τις Ρότες στον Χάρτη',
      targetTab: 'map'
    }
  },
  {
    id: 3,
    stageNumber: 'Σταθμός 3',
    island: 'Χανιά',
    title: 'Χανιά: Η Αιγυπτιοκρατία στην Κρήτη (1830–1840)',
    subtitle: 'Ο Μουσταφά Ναϊλή Πασάς, το Λιμάνι και ο Αιγυπτιακός Φάρος',
    accentColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    text: 'Καταπλέουμε στα Χανιά. Μετά την Επανάσταση του 1821, οι Μεγάλες Δυνάμεις παραχωρούν τη διοίκηση της Κρήτης στον Μεχμέτ Αλή της Αιγύπτου για μία ολόκληρη δεκαετία (1830–1840). Υπό τον διοικητή Μουσταφά Ναϊλή Πασά, τα Χανιά γνωρίζουν έντονο οικοδομικό οργασμό. Το Ενετικό Λιμάνι εκβαθύνεται, αναστηλώνεται ο εμβληματικός Αιγυπτιακός Φάρος των Χανίων σε σχήμα μιναρέ, ενώ το εμπόριο ελαιολάδου και σαπουνιού γνωρίζει πρωτοφανή άνθηση.',
    historicalQuote: '«Ο Φάρος των Χανίων ανηγέρθη επί αιγυπτιακής διοικήσεως, δεσπόζων επί των παλαιών ενετικών οχυρώσεων...» — Αρχειακές Πηγές Χανίων',
    actionButton: {
      label: 'Δείτε τα Τεκμήρια των Χανίων',
      targetTab: 'timeline'
    }
  },
  {
    id: 4,
    stageNumber: 'Σταθμός 4',
    island: 'Κοινό Έργο',
    title: 'Δύο Σχολεία — Ένα Κοινό Ψηφιακό Δίκτυο',
    subtitle: 'Γυμνάσιο Πρίνου Θάσου & 3ο ΓΕΛ Χανίων ενώνουν το παρελθόν με το μέλλον',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    text: 'Διακόσια χρόνια μετά, η ιστορία γίνεται γέφυρα μαθητικής συνεργασίας. Οι μαθήτριες, οι μαθητές και οι εκπαιδευτικοί του Γυμνασίου Πρίνου Θάσου και του 3ου ΓΕΛ Χανίων συναντιούνται σε ένα κοινό ψηφιακό ταξίδι. Μελετούν αρχειακά έγγραφα, καταγράφουν προφορικές μαρτυρίες, φωτογραφίζουν μνημεία και δημιουργούν αυτή τη ζωντανή πλατφόρμα. Οι ιστορικοί δεσμοί του 19ου αιώνα ζωντανεύουν ξανά μέσα από τη φωνή της νέας γενιάς.',
    historicalQuote: '«Γεφυρώνοντας το Βόρειο Αιγαίο με την Κρήτη μέσα από τη μαθητική ιστορική έρευνα.»',
    actionButton: {
      label: 'Γνωρίστε τις Μαθητικές Ομάδες',
      targetTab: 'teams'
    }
  }
];

interface DigitalNarratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: 'timeline' | 'map' | 'teams' | 'teachers') => void;
}

export const DigitalNarratorModal: React.FC<DigitalNarratorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const station = narratorStations[currentIdx];

  // Έλεγχος διαθεσιμότητας Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Διακοπή ομιλίας όταν αλλάζει σταθμός ή κλείνει το modal
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    stopSpeech();
  }, [currentIdx, isOpen]);

  // Χειρισμός έναρξης / παύσης φωνής
  const toggleSpeech = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      stopSpeech();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(station.text);
    utterance.lang = 'el-GR';
    utterance.rate = 0.95; // Λίγο πιο αργός, επιβλητικός ρυθμός αφήγησης
    utterance.pitch = 1.0;

    // Προσπάθεια εύρεσης ελληνικής φωνής
    const voices = window.speechSynthesis.getVoices();
    const greekVoice = voices.find(v => v.lang.startsWith('el'));
    if (greekVoice) {
      utterance.voice = greekVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleNext = () => {
    stopSpeech();
    if (currentIdx < narratorStations.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative text-white flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                Διαδραστικος Ξεναγος Εργου
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Το Ταξίδι των Ιστορικών Δεσμών
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Κλείσιμο Ξεναγού"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stations Navigation Bar (Pills) */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {narratorStations.map((st, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={st.id}
                onClick={() => {
                  stopSpeech();
                  setCurrentIdx(idx);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 border text-center ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-102' 
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
                {station.stageNumber} από 4
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 leading-snug">
              {station.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {station.subtitle}
            </p>
          </div>

          {/* Voiceover Control Box */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSpeech}
                className={`p-3 rounded-2xl font-bold flex items-center gap-2 text-xs shadow-md transition ${
                  isPlaying 
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 animate-pulse' 
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{isPlaying ? 'Παύση Φωνής' : 'Ακούστε τον Αφηγητή'}</span>
              </button>

              {isPlaying && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:450ms]"></span>
                  <span className="text-xs text-amber-300 italic hidden sm:inline ml-1.5 font-serif">
                    Ομιλία σε εξέλιξη...
                  </span>
                </div>
              )}
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:block">
              Φωνητική αφήγηση
            </span>
          </div>

          {/* Narration Narrative Text */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <p className="text-sm sm:text-base text-slate-200 font-serif leading-relaxed text-justify">
              {station.text}
            </p>

            {station.historicalQuote && (
              <blockquote className="p-3.5 rounded-xl bg-slate-900 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed">
                {station.historicalQuote}
              </blockquote>
            )}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Προηγούμενος</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === narratorStations.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
            >
              <span>Επόμενος</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {station.actionButton && (
            <button
              onClick={() => {
                stopSpeech();
                onClose();
                onNavigateToTab(station.actionButton!.targetTab as any);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{station.actionButton.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
