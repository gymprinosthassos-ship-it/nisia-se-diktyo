import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import type { HistoricalEntry } from '../types/database.types';
import { SmartVideoEmbed } from './SmartVideoEmbed';
import { Anchor, Compass, MapPin, Image as ImageIcon, X } from 'lucide-react';

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

interface HistoricalHub {
  id: string;
  tag: string; // ταιριάζει με το location_tag των μαθητικών αναρτήσεων
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
    subtitle: '4ο Γενικό Λύκειο Χανίων — Αιγυπτιοκρατία (1830–1840)',
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
  const [selectedEntryModal, setSelectedEntryModal] = useState<HistoricalEntry | null>(null);

  // Φιλτράρισμα των μαθητικών αναρτήσεων που αντιστοιχούν στον επιλεγμένο κόμβο
  const hubEntries = activeHub 
    ? entries.filter(e => e.location_tag === activeHub.tag || (activeHub.tag === 'thasos' && e.school_id === 'school-prinos'))
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Τίτλος & Εισαγωγή */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>Υποομάδα Β1 • Διαδραστική Χαρτογράφηση Τεκμηρίων</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Θαλάσσιοι Δρόμοι & Φωτογραφικά Τεκμήρια
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl mx-auto">
          Κάντε κλικ στα σημεία του χάρτη για να δείτε τις <strong>φωτογραφίες, τα αρχειακά έγγραφα και τα βίντεο</strong> που έχουν αναρτήσει οι μαθητικές ομάδες!
        </p>
      </div>

      {/* Πλέγμα Χάρτη & Πλαϊνού Πάνελ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ο Χάρτης Leaflet */}
        <div className="lg:col-span-2 bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-300 h-[550px] relative z-10">
          <MapContainer
            center={[36.8, 26.5]}
            zoom={6}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

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
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-lg text-xs space-y-1.5">
            <span className="font-bold text-slate-900 block mb-1">Υπόμνημα Διαδρομών:</span>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600"></span>
              <span>Θάσος ➔ Κρήτη ➔ Αλεξάνδρεια</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-600"></span>
              <span>Θάσος ➔ Κωνσταντινούπολη</span>
            </div>
          </div>
        </div>

        {/* Πλαϊνό Πάνελ: Πληροφορίες & Μαθητικά Τεκμήρια (Φωτογραφίες) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 max-h-[550px] overflow-y-auto">
          {activeHub ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="text-xl font-black text-slate-900">{activeHub.name}</h3>
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
                    <span>Φωτογραφίες & Τεκμήρια Μαθητών ({hubEntries.length})</span>
                  </h4>
                </div>

                {hubEntries.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    Δεν έχουν αναρτηθεί ακόμα εγκεκριμένα τεκμήρια για αυτό το σημείο.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hubEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedEntryModal(entry)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition cursor-pointer group shadow-sm"
                      >
                        {/* Προεπισκόπηση πρώτης εικόνας αν υπάρχει */}
                        {entry.sources && entry.sources.find(s => s.source_url && !s.source_url.includes('video.sch.gr') && !s.source_url.includes('youtube')) && (
                          <div className="h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                            <img
                              src={entry.sources.find(s => s.source_url && !s.source_url.includes('video.sch.gr') && !s.source_url.includes('youtube'))?.source_url || ''}
                              alt={entry.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}

                        <span className="text-[11px] font-bold text-amber-800 block">
                          {entry.date_display} ({entry.year_numeric})
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                          {entry.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {entry.research_question}
                        </p>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{entry.team?.name}</span>
                          <span className="font-bold text-blue-600">Προβολή ➔</span>
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

          {/* Γρήγορη Εστίαση */}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-800 block mb-1.5">Όλοι οι Κόμβοι:</span>
            {hubs.map(h => (
              <button
                key={h.id}
                onClick={() => setActiveHub(h)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  activeHub?.id === h.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{h.name}</span>
                <Anchor className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL ΠΛΗΡΟΥΣ ΠΡΟΒΟΛΗΣ ΤΟΥ ΕΠΙΛΕΓΜΕΝΟΥ ΤΕΚΜΗΡΙΟΥ ΑΠΟ ΤΟΝ ΧΑΡΤΗ */}
      {selectedEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedEntryModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 inline-block mb-2">
              {selectedEntryModal.period_tag} • {selectedEntryModal.date_display}
            </span>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              {selectedEntryModal.title}
            </h3>

            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 mb-4">
              <strong>Ερευνητικό Ερώτημα:</strong> {selectedEntryModal.research_question}
            </div>

            <p className="text-sm text-slate-700 mb-4 whitespace-pre-line leading-relaxed">
              {selectedEntryModal.historical_context}
            </p>

            {/* Πηγές / Φωτογραφίες / Video */}
            {selectedEntryModal.sources && selectedEntryModal.sources.map(source => (
              <div key={source.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-3">
                <span className="font-bold text-xs text-slate-900 block mb-1">{source.title}</span>
                
                {source.source_url && !source.source_url.includes('video.sch.gr') && !source.source_url.includes('youtube') && (
                  <div className="rounded-lg overflow-hidden my-2 shadow">
                    <img src={source.source_url} alt={source.title} className="w-full max-h-80 object-cover" />
                  </div>
                )}

                {source.source_url && (source.source_url.includes('video.sch.gr') || source.source_url.includes('youtube')) && (
                  <SmartVideoEmbed url={source.source_url} title={source.title} />
                )}

                <p className="text-xs text-slate-600 mt-2"><strong>Κριτική Πηγής:</strong> {source.critique_notes}</p>
                <div className="mt-2 text-[11px] text-slate-500">
                  Φορέας: {source.origin_holder} | Άδεια: {source.licence_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
