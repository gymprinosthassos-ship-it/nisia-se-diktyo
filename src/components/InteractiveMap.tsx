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
  Maximize2,
  ZoomIn,
  BookOpen
} from 'lucide-react';

// Custom Marker Icons with labels
const createCustomIcon = (bgColor: string, borderColor: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          background-color: ${bgColor}; 
          border: 2.5px solid ${borderColor}; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="background-color: white; width: 9px; height: 9px; border-radius: 50%;"></div>
        </div>
        <div style="
          margin-top: 4px;
          background: rgba(15, 23, 42, 0.92);
          color: white;
          font-family: inherit;
          font-weight: 700;
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 6px;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          pointer-events: none;
        ">
          ${label}
        </div>
      </div>
    `,
    iconSize: [30, 52],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18]
  });
};

const thasosIcon = createCustomIcon('#2563EB', '#93C5FD', '⚓ Θάσος');
const chaniaIcon = createCustomIcon('#D97706', '#FDE68A', '🧭 Χανιά');
const kavalaIcon = createCustomIcon('#0F172A', '#E2E8F0', '🏛️ Καβάλα');
const alexandriaIcon = createCustomIcon('#0F172A', '#E2E8F0', '🚢 Αλεξάνδρεια');
const constantinopleIcon = createCustomIcon('#0F172A', '#E2E8F0', '👑 Κωνσταντινούπολη');

// Component to dynamically resize Leaflet map when sidebar opens/closes
function MapResizer({ trigger }: { trigger: any }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 350);
    const t3 = setTimeout(() => map.invalidateSize(), 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [trigger, map]);
  return null;
}

interface HistoricalHub {
  id: string;
  tag: string;
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
    icon: kavalaIcon,
    details: 'Το επιβλητικό Ιμαρέτ στην παλιά πόλη της Καβάλας συντηρούνταν κυρίως από τις φορολογικές προσόδους της Θάσου.'
  },
  {
    id: 'alexandria',
    tag: 'alexandria',
    name: 'Αλεξάνδρεια (Αίγυπτος)',
    subtitle: 'Έδρα της Δυναστείας του Μεχμέτ Αλή',
    coords: [31.2001, 29.9187],
    role: 'Μητρόπολη της Ανατολικής Μεσογείου, τελικός κόμβος εξαγωγών λαδιού & ξυλείας.',
    icon: alexandriaIcon,
    details: 'Η Αλεξάνδρεια αναπτύχθηκε ταχύτατα τον 19ο αιώνα, προσελκύοντας έντονη ελληνική εμπορική παρουσία από τα νησιά του Αιγαίου και την Κρήτη.'
  },
  {
    id: 'constantinople',
    tag: 'constantinople',
    name: 'Κωνσταντινούπολη (Ισταμπούλ)',
    subtitle: 'Πρωτεύουσα Οθωμανικής Αυτοκρατορίας',
    coords: [41.0082, 28.9784],
    role: 'Σουλτανική εξουσία — Έκδοση Φιρμανιών παραχώρησης.',
    icon: constantinopleIcon,
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
  const [activeHub, setActiveHub] = useState<HistoricalHub | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<HistoricalEntry | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Εύρεση καταχωρίσεων για ένα hub
  const getEntriesForHub = (hub: HistoricalHub) => {
    return entries.filter(e => e.location_tag === hub.tag || (hub.tag === 'thasos' && e.school_id === 'school-prinos'));
  };

  // Όταν ο χρήστης επιλέγει έναν κόμβο στον χάρτη
  const handleHubClick = (hub: HistoricalHub) => {
    setActiveHub(hub);
    const hubDocs = getEntriesForHub(hub);
    if (hubDocs.length > 0) {
      // Επιλέγουμε αυτόματα το πρώτο τεκμήριο ώστε να μαζευτεί ο χάρτης αριστερά
      setSelectedEntry(hubDocs[0]);
    }
  };

  // Τεκμήρια του τρέχοντος ενεργού hub
  const currentHubEntries = activeHub ? getEntriesForHub(activeHub) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
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
          {selectedEntry 
            ? 'Ο χάρτης έχει συρρικνωθεί αριστερά. Προβάλλεται το τεκμήριο στα δεξιά. Πατήστε «Επαναφορά πλήρους χάρτη» για πλήρη προβολή.'
            : 'Κάντε κλικ σε ένα σημείο του χάρτη ή σε ένα τεκμήριο: ο χάρτης μαζεύεται αριστερά και το τεκμήριο εμφανίζεται στα δεξιά!'}
        </p>
      </div>

      {/* Δυναμικό Grid: 
          - Όταν ΔΕΝ έχει επιλεγεί τεκμήριο: Ο χάρτης καταλαμβάνει 100% (col-span-12)
          - Όταν ΕΧΕΙ επιλεγεί τεκμήριο: Ο χάρτης μαζεύεται αριστερά (lg:col-span-5) και το τεκμήριο ανοίγει στα δεξιά (lg:col-span-7)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300">
        
        {/* ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ: ΧΑΡΤΗΣ */}
        <div className={`${selectedEntry ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
          <div className={`bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative z-10 transition-all ${selectedEntry ? 'h-[540px] lg:h-[620px]' : 'h-[500px] lg:h-[580px]'}`}>
            
            <MapContainer
              center={[37.5, 26.0]}
              zoom={6}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Dynamic Resizer */}
              <MapResizer trigger={selectedEntry ? selectedEntry.id : 'full-map'} />

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

              {/* Markers για κάθε Κόμβο */}
              {hubs.map(hub => {
                const hubDocs = getEntriesForHub(hub);
                const count = hubDocs.length;
                return (
                  <Marker
                    key={hub.id}
                    position={hub.coords}
                    icon={hub.icon}
                    eventHandlers={{
                      click: () => handleHubClick(hub)
                    }}
                  >
                    <Popup>
                      <div className="p-1 max-w-[220px]">
                        <span className="font-bold text-sm text-slate-900 block">{hub.name}</span>
                        <span className="text-xs text-blue-700 font-semibold block mb-1">{hub.subtitle}</span>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed">{hub.role}</p>
                        
                        {count > 0 ? (
                          <button
                            onClick={() => {
                              setActiveHub(hub);
                              setSelectedEntry(hubDocs[0]);
                            }}
                            className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Άνοιγμα {count} {count === 1 ? 'Τεκμηρίου' : 'Τεκμηρίων'} ➔</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic block">
                            (Ιστορικός κόμβος δικτύου)
                          </span>
                        )}
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

            {/* Κουμπί επαναφοράς σε πλήρη οθόνη (όταν είναι ανοιχτό τεκμήριο) */}
            {selectedEntry && (
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-3 right-3 z-[1000] bg-slate-900/90 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur transition hover:scale-105"
                title="Επαναφορά πλήρους χάρτη"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Πλήρης Χάρτης</span>
              </button>
            )}
          </div>

          {/* Μπάρα Επιλογής Κόμβων */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Κόμβοι Δικτύου:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hubs.map(h => {
                const count = getEntriesForHub(h).length;
                const isSelected = activeHub?.id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => handleHubClick(h)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{h.name.split(' ')[0]}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white text-blue-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ΔΕΞΙΑ ΣΤΗΛΗ: ΑΝΑΛΥΤΙΚΟ ΤΕΚΜΗΡΙΟ (ΕΜΦΑΝΙΖΕΤΑΙ ΜΟΝΟ ΟΤΑΝ ΕΧΕΙ ΕΠΙΛΕΓΕΙ ΤΕΚΜΗΡΙΟ) */}
        {selectedEntry && (
          <div className="lg:col-span-7 transition-all duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-5 max-h-[620px] overflow-y-auto animate-fadeIn relative">
              
              {/* Header: Κουμπί Επαναφοράς Χάρτη & Multi-doc selector */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                  title="Επιστροφή σε πλήρη χάρτη"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Επαναφορά πλήρους χάρτη</span>
                </button>

                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  aria-label="Κλείσιμο"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs εναλλαγής τεκμηρίων αν ο κόμβος διαθέτει πολλαπλά τεκμήρια */}
              {currentHubEntries.length > 1 && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Τεκμήρια αυτού του κόμβου ({currentHubEntries.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentHubEntries.map((doc, idx) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedEntry(doc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition ${
                          selectedEntry.id === doc.id
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Τεκμήριο {idx + 1}: {doc.date_display}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Τίτλος & Χρονολογία */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    {selectedEntry.period_tag}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    {selectedEntry.date_display} ({selectedEntry.year_numeric})
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
                  {selectedEntry.title}
                </h3>
              </div>

              {/* Σχολείο & Ομάδα */}
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

              {/* Ιστορικό Πλαίσιο & Γεγονότα */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif">
                  Ιστορικό Πλαίσιο & Γεγονότα
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedEntry.historical_context}
                </p>
              </div>

              {/* Πηγές / Φωτογραφίες / Video */}
              {selectedEntry.sources && selectedEntry.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 font-serif">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Πρωτογενείς Πηγές & Τεκμήρια ({selectedEntry.sources.length})</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedEntry.sources.map(source => (
                      <div key={source.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span className="font-semibold text-slate-800">{source.origin_holder}</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px]">
                            {source.licence_type}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 mb-2 font-serif">{source.title}</h5>

                        {/* Έλεγχος αν είναι Video ή Φωτογραφία */}
                        {source.source_type === 'video_link' || (source.source_url && (source.source_url.includes('video.sch.gr') || source.source_url.includes('youtube.com') || source.source_url.includes('youtu.be') || source.source_url.includes('vimeo.com'))) ? (
                          <div className="my-3">
                            <SmartVideoEmbed url={source.source_url} title={source.title} />
                          </div>
                        ) : source.source_url ? (
                          <div className="my-3 relative group">
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5 max-h-72">
                              <img
                                src={source.source_url}
                                alt={source.title}
                                className="w-full h-auto max-h-72 object-contain mx-auto"
                              />
                            </div>
                            <button
                              onClick={() => source.source_url && setZoomImage({ url: source.source_url, title: source.title })}
                              className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur transition"
                            >
                              <ZoomIn className="w-4 h-4 text-amber-400" />
                              <span>Μεγέθυνση</span>
                            </button>
                          </div>
                        ) : null}

                        {source.critique_notes && (
                          <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                            <strong>Κριτική & Τεκμηρίωση:</strong> {source.critique_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Σχόλιο Διασχολικής Ομάδας */}
              {selectedEntry.partner_comment && (
                <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-600">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Σχόλιο Συνεργαζόμενου Σχολείου</span>
                  </h4>
                  <p className="text-sm text-indigo-950 italic">
                    «{selectedEntry.partner_comment}»
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ΣΥΛΛΟΓΗ ΤΕΚΜΗΡΙΩΝ (ΟΤΑΝ Ο ΧΑΡΤΗΣ ΕΙΝΑΙ ΣΕ ΠΛΗΡΗ ΠΡΟΒΟΛΗ) */}
      {!selectedEntry && (
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span>Συλλογή Τεκμηρίων — Κάντε κλικ για προβολή στα δεξιά του χάρτη:</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {entries.length} αναρτήσεις
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => {
                  setSelectedEntry(entry);
                  const foundHub = hubs.find(h => h.tag === entry.location_tag || (h.tag === 'thasos' && entry.school_id === 'school-prinos'));
                  if (foundHub) setActiveHub(foundHub);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Εικόνα τεκμηρίου αν υπάρχει */}
                {entry.sources && entry.sources.find(s => s.source_url && !s.source_url.includes('video.sch.gr') && !s.source_url.includes('youtube')) && (
                  <div className="h-36 w-full rounded-lg overflow-hidden mb-3 bg-slate-100">
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
                  <span className="text-slate-500 font-medium">{entry.school?.city}</span>
                </div>

                <h4 className="text-sm font-serif font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                  {entry.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {entry.research_question}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-amber-600">
                  <span>{entry.team?.name?.split(':')[0]}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
                    Προβολή στον χάρτη ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal για εικόνες */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 p-2 shadow-2xl">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={zoomImage.url} 
              alt={zoomImage.title}
              className="max-h-[82vh] max-w-full object-contain mx-auto rounded-lg" 
            />
            <p className="text-center text-xs text-slate-300 mt-2 px-4 py-1">
              {zoomImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
