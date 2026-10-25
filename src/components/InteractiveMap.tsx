import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { HistoricalEntry } from '../types/database.types';
import { SmartVideoEmbed } from './SmartVideoEmbed';
import { 
  Compass, 
  MapPin, 
  Image as ImageIcon, 
  X, 
  Building, 
  Users, 
  Award, 
  MessageSquare, 
  ArrowLeft,
  Maximize2
} from 'lucide-react';

// Custom Marker Icons
const createCustomIcon = (bgColor: string, borderColor: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${bgColor}; 
        border: 2px solid ${borderColor}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="background-color: white; width: 7px; height: 7px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14]
  });
};

const thasosIcon = createCustomIcon('#2563EB', '#93C5FD'); // Blue
const chaniaIcon = createCustomIcon('#D97706', '#FDE68A'); // Amber
const hubIcon = createCustomIcon('#0F172A', '#E2E8F0');    // Slate

// Component to dynamically resize Leaflet map when sidebar opens/closes
function MapResizer({ trigger }: { trigger: any }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [trigger, map]);
  return null;
}

interface HistoricalHub {
  id: string;
  tag: string; // matches location_tag of student posts
  name: string;
  subtitle: string;
  coords: [number, number];
  role: string;
  icon: L.DivIcon;
  details: string;
}

const hubs: HistoricalHub[] = [
  {
    id: 'thasos-prinos',
    tag: 'thasos',
    name: 'Θάσος (Πρίνος & Λιμένας)',
    subtitle: 'Γυμνάσιο Πρίνου — Βακούφι Μεχμέτ Αλή',
    coords: [40.7386, 24.5772],
    role: 'Έδρα Βακουφίου, ναυπηγεία ξυλείας και παραγωγή ελαιολάδου. Ειδικό καθεστώς αυτονομίας από το 1813.',
    icon: thasosIcon,
    details: 'Τα πευκοδάση της Θάσου παρείχαν ξυλεία για τα καρνάγια του Πρίνου και τον αιγυπτιακό στόλο. Τα έσοδα χρηματοδοτούσαν το Ιμαρέτ της Καβάλας.'
  },
  {
    id: 'chania',
    tag: 'chania',
    name: 'Χανιά (Κρήτη)',
    subtitle: '3ο Γενικό Λύκειο Χανίων — Αιγυπτιοκρατία (1830–1840)',
    coords: [35.5186, 24.0157],
    role: 'Κομβικό μεσογειακό λιμάνι, επισκευή Αιγυπτιακού Φάρου, εμπόριο ελαιολάδου και σαπωνοποιίας.',
    icon: chaniaIcon,
    details: 'Κατά τη δεκαετή διοίκηση του Μεχμέτ Αλή στην Κρήτη, τα Χανιά ανακαινίστηκαν ριζικά. Ο Φάρος αποτελεί ζωντανό τεκμήριο της σύνδεσης των δύο νησιών.'
  },
  {
    id: 'kavala',
    tag: 'kavala',
    name: 'Καβάλα',
    subtitle: 'Γενέτειρα Μεχμέτ Αλή & Ιμαρέτ',
    coords: [40.9378, 24.4128],
    role: 'Διοικητικός δεσμός με τη Θάσο μέσω των ευαγών ιδρυμάτων (Ιμαρέτ).',
    icon: hubIcon,
    details: 'Το επιβλητικό Ιμαρέτ στην παλιά πόλη της Καβάλας συντηρούνταν κυρίως από τις φορολογικές προσόδους της Θάσου.'
  },
  {
    id: 'alexandria',
    tag: 'alexandria',
    name: 'Αλεξάνδρεια (Αίγυπτος)',
    subtitle: 'Έδρα της Δυναστείας του Μεχμέτ Αλή',
    coords: [31.2001, 29.9187],
    role: 'Μητρόπολη της Ανατολικής Μεσογείου, τελικός κόμβος εξαγωγών λαδιού & ξυλείας.',
    icon: hubIcon,
    details: 'Η Αλεξάνδρεια αναπτύχθηκε ταχύτατα τον 19ο αιώνα, προσελκύοντας έντονη ελληνική εμπορική παρουσία από τα νησιά του Αιγαίου και την Κρήτη.'
  },
  {
    id: 'constantinople',
    tag: 'constantinople',
    name: 'Κωνσταντινούπολη (Ισταμπούλ)',
    subtitle: 'Πρωτεύουσα Οθωμανικής Αυτοκρατορίας',
    coords: [41.0082, 28.9784],
    role: 'Σουλτανική εξουσία — Έκδοση Φιρμανιών παραχώρησης.',
    icon: hubIcon,
    details: 'Εκεί εκδόθηκαν τα σουλτανικά φιρμάνια του Μαχμούτ Β΄ που καθόρισαν την τύχη της Θάσου και αργότερα της Κρήτης.'
  }
];

// Θαλάσσιες Διαδρομές
const maritimeRoutes: [number, number][][] = [
  // Θάσος -> Χανιά -> Αλεξάνδρεια
  [
    [40.7386, 24.5772],
    [39.1000, 25.0000],
    [37.5000, 25.3000],
    [35.5186, 24.0157],
    [33.0000, 27.0000],
    [31.2001, 29.9187]
  ],
  // Θάσος -> Κωνσταντινούπολη
  [
    [40.7386, 24.5772],
    [40.4000, 26.2000],
    [40.8000, 27.5000],
    [41.0082, 28.9784]
  ]
];

interface InteractiveMapProps {
  entries: HistoricalEntry[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ entries }) => {
  const [activeHub, setActiveHub] = useState<HistoricalHub | null>(hubs[0]);
  const [selectedEntry, setSelectedEntry] = useState<HistoricalEntry | null>(null);

  // Φιλτράρισμα των μαθητικών αναρτήσεων που αντιστοιχούν στον επιλεγμένο κόμβο
  const hubEntries = activeHub 
    ? entries.filter(e => e.location_tag === activeHub.tag || (activeHub.tag === 'thasos' && e.school_id === 'school-prinos'))
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Τίτλος & Εισαγωγή */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>Υποομάδα Β1 • Διαδραστική Χαρτογράφηση Τεκμηρίων</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Θαλάσσιοι Δρόμοι & Φωτογραφικά Τεκμήρια
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl mx-auto">
          Κάντε κλικ στα σημεία του χάρτη ή επιλέξτε ένα τεκμήριο: <strong>ο χάρτης συρρικνώνεται αριστερά</strong> και το τεκμήριο ανοίγει αναλυτικά στα δεξιά!
        </p>
      </div>

      {/* Δυναμικό Πλέγμα: Εναλλαγή μεταξύ Πλήρους Προβολής & Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300">
        {/* ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ: ΧΑΡΤΗΣ LEAFLET (Προσαρμόζεται από 8/12 σε 5/12 όταν επιλεγεί τεκμήριο) */}
        <div className={`${selectedEntry ? 'lg:col-span-5' : 'lg:col-span-8'} space-y-4 transition-all duration-300`}>
          <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-300 h-[500px] lg:h-[580px] relative z-10 transition-all">
            <MapContainer
              center={activeHub ? activeHub.coords : [36.8, 26.5]}
              zoom={selectedEntry ? 6 : 6}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Hook to recalculate map dimensions when sidebar expands */}
              <MapResizer trigger={selectedEntry ? selectedEntry.id : 'normal'} />

              {/* Θαλάσσιες Διαδρομές */}
              <Polyline
                positions={maritimeRoutes[0]}
                pathOptions={{
                  color: '#D97706',
                  weight: 3.5,
                  dashArray: '8, 8',
                  opacity: 0.9
                }}
              />
              <Polyline
                positions={maritimeRoutes[1]}
                pathOptions={{
                  color: '#2563EB',
                  weight: 3,
                  dashArray: '6, 6',
                  opacity: 0.8
                }}
              />

              {/* Markers */}
              {hubs.map(hub => {
                const count = entries.filter(e => e.location_tag === hub.tag || (hub.tag === 'thasos' && e.school_id === 'school-prinos')).length;
                return (
                  <Marker
                    key={hub.id}
                    position={hub.coords}
                    icon={hub.icon}
                    eventHandlers={{
                      click: () => setActiveHub(hub)
                    }}
                  >
                    <Popup>
                      <div className="p-1 max-w-[200px]">
                        <span className="font-bold text-sm text-slate-900 block">{hub.name}</span>
                        <span className="text-xs text-blue-700 font-semibold block mb-1">{hub.subtitle}</span>
                        <p className="text-xs text-slate-600 line-clamp-2">{hub.role}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                          📸 {count} Μαθητικά Τεκμήρια
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Υπόμνημα */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-lg text-[11px] space-y-1">
              <span className="font-bold text-slate-900 block">Υπόμνημα:</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600"></span>
                <span>Θάσος ➔ Κρήτη ➔ Αλεξάνδρεια</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-600"></span>
                <span>Θάσος ➔ Κωνσταντινούπολη</span>
              </div>
            </div>

            {/* Κουμπί επαναφοράς πλήρους προβολής αν είναι επιλεγμένο τεκμήριο */}
            {selectedEntry && (
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-3 right-3 z-[1000] bg-slate-900/90 hover:bg-slate-900 text-white p-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur transition"
                title="Επαναφορά πλήρους χάρτη"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Μεγέθυνση Χάρτη</span>
              </button>
            )}
          </div>

          {/* Quick Hub Navigation Selector (Compact) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Επιλογή Κόμβου:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hubs.map(h => (
                <button
                  key={h.id}
                  onClick={() => setActiveHub(h)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    activeHub?.id === h.id
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{h.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ΔΕΞΙΑ ΣΤΗΛΗ: ΠΡΟΒΟΛΗ ΑΝΑΛΥΤΙΚΟΥ ΤΕΚΜΗΡΙΟΥ Ή ΛΙΣΤΑΣ ΚΟΜΒΟΥ */}
        <div className={`${selectedEntry ? 'lg:col-span-7' : 'lg:col-span-4'} transition-all duration-300`}>
          {selectedEntry ? (
            /* ΑΝΑΛΥΤΙΚΗ ΠΡΟΒΟΛΗ ΤΟΥ ΕΠΙΛΕΓΜΕΝΟΥ ΤΕΚΜΗΡΙΟΥ */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-5 max-h-[580px] overflow-y-auto animate-fadeIn relative">
              {/* Top Bar with Close/Back Button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Επιστροφή στη λίστα</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    {selectedEntry.date_display} ({selectedEntry.year_numeric})
                  </span>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    aria-label="Κλείσιμο"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <span className="text-xs font-semibold text-blue-700 block mb-1">
                  {selectedEntry.period_tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
                  {selectedEntry.title}
                </h3>
              </div>

              {/* School & Team Badge */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span><strong>Σχολείο:</strong> {selectedEntry.school?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span><strong>Ομάδα:</strong> {selectedEntry.team?.name}</span>
                </div>
              </div>

              {/* Ερευνητικό Ερώτημα */}
              <div className="p-4 bg-amber-50/80 rounded-xl border-l-4 border-amber-500">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Ερευνητικό Ερώτημα
                </span>
                <p className="text-sm font-medium text-amber-950">
                  {selectedEntry.research_question}
                </p>
              </div>

              {/* Ιστορικό Πλαίσιο */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif">
                  Ιστορικό Πλαίσιο & Γεγονότα
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedEntry.historical_context}
                </p>
              </div>

              {/* Πηγές / Video / Εικόνες */}
              {selectedEntry.sources && selectedEntry.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 font-serif">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Πρωτογενείς Πηγές & Τεκμήρια ({selectedEntry.sources.length})</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedEntry.sources.map(source => (
                      <div key={source.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm text-slate-900">{source.title}</span>
                          <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                            {source.source_type}
                          </span>
                        </div>

                        {source.source_url && !source.source_url.includes('video.sch.gr') && !source.source_url.includes('youtube') && (
                          <div className="rounded-xl overflow-hidden my-3 shadow-md border border-slate-200">
                            <img src={source.source_url} alt={source.title} className="w-full max-h-80 object-cover" />
                          </div>
                        )}

                        {source.source_url && (source.source_url.includes('video.sch.gr') || source.source_url.includes('youtube')) && (
                          <div className="my-3">
                            <SmartVideoEmbed url={source.source_url} title={source.title} />
                          </div>
                        )}

                        {source.critique_notes && (
                          <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-100">
                            <strong>Κριτική Πηγής:</strong> {source.critique_notes}
                          </p>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                          <span><strong>Φορέας:</strong> {source.origin_holder}</span>
                          <span><strong>Άδεια:</strong> {source.licence_type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ιστορική Ερμηνεία */}
              {selectedEntry.interpretation && (
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                    Ιστορική Ερμηνεία & Συμπεράσματα
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {selectedEntry.interpretation}
                  </p>
                </div>
              )}

              {/* Συνεισφορά Συνεργαζόμενου Σχολείου */}
              {selectedEntry.partner_comment && (
                <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-600">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Συνεισφορά & Αντίλογος Συνεργαζόμενου Σχολείου</span>
                  </h4>
                  <p className="text-sm text-indigo-950 italic">
                    «{selectedEntry.partner_comment}»
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ΛΙΣΤΑ ΤΕΚΜΗΡΙΩΝ ΤΟΥ ΕΠΙΛΕΓΜΕΝΟΥ ΚΟΜΒΟΥ (ΟΤΑΝ ΔΕΝ ΕΧΕΙ ΕΠΙΛΕΓΕΙ ΑΚΟΜΑ ΣΥΓΚΕΚΡΙΜΕΝΟ ΤΕΚΜΗΡΙΟ) */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 max-h-[580px] overflow-y-auto">
              {activeHub ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="text-xl font-serif font-bold text-slate-900">{activeHub.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-blue-700 block mb-3">
                    {activeHub.subtitle}
                  </span>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4 leading-relaxed">
                    <strong className="block text-slate-900 mb-1">Ιστορικό Πλαίσιο:</strong>
                    {activeHub.role}
                  </div>

                  {/* ΕΝΟΤΗΤΑ: ΜΑΘΗΤΙΚΑ ΤΕΚΜΗΡΙΑ & ΦΩΤΟΓΡΑΦΙΕΣ */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Μαθητικά Τεκμήρια ({hubEntries.length})</span>
                      </h4>
                    </div>

                    {hubEntries.length === 0 ? (
                      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                        Δεν έχουν αναρτηθεί ακόμα εγκεκριμένα τεκμήρια για αυτό το σημείο.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hubEntries.map(entry => (
                          <div
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          >
                            {/* Προεπισκόπηση εικόνας */}
                            {entry.sources && entry.sources.find(s => s.source_url && !s.source_url.includes('video.sch.gr') && !s.source_url.includes('youtube')) && (
                              <div className="h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                                <img
                                  src={entry.sources.find(s => s.source_url && !s.source_url.includes('video.sch.gr') && !s.source_url.includes('youtube'))?.source_url || ''}
                                  alt={entry.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-amber-800">
                                {entry.date_display} ({entry.year_numeric})
                              </span>
                              <span className="text-slate-400">{entry.school?.city}</span>
                            </div>

                            <h5 className="text-sm font-serif font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                              {entry.title}
                            </h5>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {entry.research_question}
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                              <span>{entry.team?.name}</span>
                              <span className="font-bold text-blue-600 group-hover:translate-x-1 transition flex items-center gap-1">
                                Άνοιγμα τεκμηρίου ➔
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Κάντε κλικ σε ένα σημείο του χάρτη.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
