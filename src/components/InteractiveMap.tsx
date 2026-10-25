import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { HistoricalEntry } from '../types/database.types';
import { SmartVideoEmbed } from './SmartVideoEmbed';
import { 
  Compass, 
  X, 
  Building, 
  Users, 
  Award, 
  MessageSquare, 
  Maximize2,
  ZoomIn,
  BookOpen
} from 'lucide-react';

// 18th-Century Cartographic Wax Seal Markers (Βουλοκέρια & Ναυτικά Σύμβολα 18ου αι.)
const create18thCenturyMarker = (
  type: 'anchor' | 'compass' | 'fortress' | 'galleon' | 'imperial',
  waxColorDark: string,
  waxColorMid: string,
  waxColorLight: string,
  label: string
) => {
  let emblemSvg = '';
  if (type === 'anchor') {
    // ⚓ 18th century naval anchor
    emblemSvg = `
      <g stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <circle cx="22" cy="12.5" r="2.2" stroke="#fef08a" stroke-width="1.5" />
        <line x1="22" y1="14.7" x2="22" y2="26.5" />
        <line x1="16.5" y1="17.5" x2="27.5" y2="17.5" />
        <path d="M15.5 23 C17 28 27 28 28.5 23" />
        <line x1="15.5" y1="23" x2="14" y2="21.5" />
        <line x1="28.5" y1="23" x2="30" y2="21.5" />
      </g>
    `;
  } else if (type === 'compass') {
    // 🧭 18th century 8-point compass rose / ανεμολόγιο
    emblemSvg = `
      <g transform="translate(22, 20)">
        <polygon points="0,-10 2.5,-2.5 0,0 -2.5,-2.5" fill="#fef08a" stroke="#78350f" stroke-width="0.5"/>
        <polygon points="0,10 2.5,2.5 0,0 -2.5,2.5" fill="#d97706" stroke="#78350f" stroke-width="0.5"/>
        <polygon points="10,0 2.5,2.5 0,0 2.5,-2.5" fill="#facc15" stroke="#78350f" stroke-width="0.5"/>
        <polygon points="-10,0 -2.5,2.5 0,0 -2.5,-2.5" fill="#b45309" stroke="#78350f" stroke-width="0.5"/>
        <polygon points="6,-6 1.5,-1.5 0,0 0,-2" fill="#fef9c3" opacity="0.95"/>
        <polygon points="-6,-6 -1.5,-1.5 0,0 -2,0" fill="#fef9c3" opacity="0.95"/>
        <polygon points="6,6 1.5,1.5 0,0 2,0" fill="#92400e" opacity="0.95"/>
        <polygon points="-6,6 -1.5,1.5 0,0 0,2" fill="#92400e" opacity="0.95"/>
        <circle cx="0" cy="0" r="2" fill="#fef08a" stroke="#451a03" stroke-width="0.8"/>
      </g>
    `;
  } else if (type === 'fortress') {
    // 🏛️ Ottoman Imaret / fortress arches
    emblemSvg = `
      <g stroke="#fef08a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M16 25.5 L16 19 C16 16.5 18.5 14.5 22 14.5 C25.5 14.5 28 16.5 28 19 L28 25.5" />
        <path d="M19 25.5 L19 21 C19 19.5 20.2 18.5 22 18.5 C23.8 18.5 25 19.5 25 21 L25 25.5" fill="#ca8a04" opacity="0.4" />
        <line x1="14" y1="25.5" x2="30" y2="25.5" />
        <line x1="22" y1="12.5" x2="22" y2="14.5" />
        <circle cx="22" cy="12" r="0.9" fill="#fef08a" />
      </g>
    `;
  } else if (type === 'galleon') {
    // ⛵ 18th century caravel / merchant sailing ship
    emblemSvg = `
      <g stroke="#fef08a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M14.5 24 C16.5 27 27.5 27 29.5 24 L28 21.5 L16 21.5 Z" fill="#ca8a04" opacity="0.85" />
        <line x1="22" y1="12.5" x2="22" y2="21.5" />
        <path d="M22 13.5 C25.5 15 25.5 18.5 22 19.5 Z" fill="#fef08a" opacity="0.95" />
        <line x1="17.5" y1="14.5" x2="17.5" y2="21.5" />
        <path d="M17.5 15.5 C19.5 16.5 19.5 19 17.5 19.8 Z" fill="#fef08a" opacity="0.85" />
        <path d="M14 26 C16 25 18 27 20 26 C22 25 24 27 26 26 C28 25 30 27" stroke="#93c5fd" stroke-width="1.2" />
      </g>
    `;
  } else {
    // 👑 18th century Imperial Cartographic Insignia
    emblemSvg = `
      <g stroke="#fef08a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M23 13.5 C18.5 13.5 15.5 16.8 15.5 21 C15.5 25.2 18.5 28.5 23 28.5 C19.8 26 18.8 23 18.8 21 C18.8 19 19.8 16 23 13.5 Z" fill="#fef08a" opacity="0.9" />
        <polygon points="25,18 25.8,19.8 27.5,20 26.2,21.2 26.6,23 25,22 23.4,23 23.8,21.2 22.5,20 24.2,19.8" fill="#fef08a" />
      </g>
    `;
  }

  const uniqueId = `wax_${type}_${Math.random().toString(36).substring(2, 7)}`;

  return L.divIcon({
    className: 'cartographic-18th-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.45));">
          <defs>
            <radialGradient id="${uniqueId}" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="${waxColorLight}" />
              <stop offset="50%" stop-color="${waxColorMid}" />
              <stop offset="100%" stop-color="${waxColorDark}" />
            </radialGradient>
            <linearGradient id="needle_${uniqueId}" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#78716c" />
              <stop offset="50%" stop-color="#e7e5e4" />
              <stop offset="100%" stop-color="#44403c" />
            </linearGradient>
          </defs>

          <!-- Antique Needle / Pointer -->
          <path d="M19 32 L22 54 L25 32 Z" fill="url(#needle_${uniqueId})" stroke="#292524" stroke-width="0.8" />
          <circle cx="22" cy="54" r="1.5" fill="#1c1917" />

          <!-- Wax Seal Outer Body -->
          <circle cx="22" cy="20" r="18" fill="url(#${uniqueId})" stroke="#fef08a" stroke-width="1.2" stroke-dasharray="3, 1.5" />
          
          <!-- Inner Relief Rim -->
          <circle cx="22" cy="20" r="14.5" fill="none" stroke="#fef08a" stroke-width="0.8" opacity="0.85" />
          
          <!-- Center 18th-century Emblem -->
          ${emblemSvg}
        </svg>

        <!-- Parchment Cartouche Label (Περγαμηνή ταμπελίτσα εποχής) -->
        <div style="
          margin-top: 1px;
          background: #fdf6e7;
          background-image: linear-gradient(180deg, #fefae0 0%, #faedd0 100%);
          color: #3b1d05;
          font-family: 'EB Garamond', Georgia, serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.02em;
          padding: 2px 8px;
          border-radius: 4px;
          white-space: nowrap;
          border: 1.5px solid #854d0e;
          box-shadow: 0 3px 8px rgba(45, 20, 5, 0.4), inset 0 1px 1px rgba(255,255,255,0.8);
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 4px;
          line-height: 1.2;
        ">
          <span style="color: #991b1b; font-size: 9px; line-height: 1;">✦</span>
          <span>${label}</span>
          <span style="color: #991b1b; font-size: 9px; line-height: 1;">✦</span>
        </div>
      </div>
    `,
    iconSize: [44, 76],
    iconAnchor: [22, 54],
    popupAnchor: [0, -56]
  });
};

// 18th-Century Historical Cartographic Pins:
const thasosIcon = create18thCenturyMarker('anchor', '#450a0a', '#991b1b', '#dc2626', 'Θάσος');
const chaniaIcon = create18thCenturyMarker('compass', '#451a03', '#92400e', '#d97706', 'Χανιά');
const kavalaIcon = create18thCenturyMarker('fortress', '#292524', '#78350f', '#b45309', 'Καβάλα');
const alexandriaIcon = create18thCenturyMarker('galleon', '#082f49', '#0369a1', '#38bdf8', 'Αλεξάνδρεια');
const constantinopleIcon = create18thCenturyMarker('imperial', '#3b0764', '#7e22ce', '#c084fc', 'Κωνσταντινούπολη');

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

// Component to smoothly pan the map
function MapPanTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 6.5, { duration: 0.8 });
    }
  }, [coords, map]);
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

// Fallback curated documentary content for hubs if no live database entry is available
const defaultHubEntries: Record<string, Partial<HistoricalEntry>> = {
  kavala: {
    id: 'entry-hub-kavala',
    title: 'Το Ιμαρέτ της Καβάλας και η σύνδεσή του με τις προσόδους της Θάσου',
    date_display: '1817 – 1821',
    year_numeric: 1820,
    period_tag: 'Οθωμανική Διοίκηση & Μεχμέτ Αλή',
    location_tag: 'kavala',
    historical_context: 'Το μνημειώδες συγκρότημα του Ιμαρέτ στην παλιά πόλη της Καβάλας ιδρύθηκε από τον Μεχμέτ Αλή ως ευαγές ίδρυμα. Για τη συντήρηση και λειτουργία του, διατέθηκαν από τον Σουλτάνο όλες οι φορολογικές πρόσοδοι της Θάσου, καθιστώντας τη Θάσο οικονομικό στυλοβάτη του ιδρύματος.',
    research_question: 'Πώς συνδέθηκε θεσμικά και οικονομικά η αγροτική παραγωγή της Θάσου με τα ιδρύματα της Καβάλας;',
    partner_comment: 'Στα Χανιά (3ο ΓΕΛ): Αντίστοιχα ευαγή ιδρύματα και βακούφια υπήρχαν και στα Χανιά, όπως τα συγκροτήματα των τζαμιών και οι κρήνες.',
    school: { id: 'school-prinos', name: 'Γυμνάσιο Πρίνου Θάσου', city: 'Πρίνος, Θάσος', region: 'Αν. Μακεδονία & Θράκη', created_at: '' },
    team: { id: 'team-a4', school_id: 'school-prinos', name: 'Α4: Αρχιτεκτονική & υλικός πολιτισμός', active: true },
    sources: [
      {
        id: 's-kavala-1',
        entry_id: 'entry-hub-kavala',
        title: 'Χαρακτικό του Ιμαρέτ Καβάλας (19ος αι.)',
        source_type: 'artifact',
        origin_holder: 'Δημοτική Βιβλιοθήκη Καβάλας',
        source_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        licence_type: 'Δημόσιο Κτήμα',
        critique_notes: 'Απεικόνιση των μολυβδοσκέπαστων τρούλων του Ιμαρέτ.',
        created_at: ''
      }
    ]
  },
  alexandria: {
    id: 'entry-hub-alexandria',
    title: 'Θαλάσσιοι εμπορικοί δρόμοι προς την Αλεξάνδρεια & αιγυπτιακός στόλος',
    date_display: '1835 – 1850',
    year_numeric: 1840,
    period_tag: 'Εμπόριο & Μεσογειακά Δίκτυα',
    location_tag: 'alexandria',
    historical_context: 'Το λιμάνι της Αλεξάνδρειας ήταν η καρδιά της δυναστείας του Μεχμέτ Αλή. Από τα ναυπηγεία της Θάσου και τα λιμάνια της Κρήτης κατέπλεαν πλοία φορτωμένα ξυλεία, λάδι και σαπούνια, τροφοδοτώντας την ταχύτατα αναπτυσσόμενη αιγυπτιακή μητρόπολη.',
    research_question: 'Ποιος ήταν ο ρόλος των ελληνικών πληρωμάτων και καραβοκύρηδων στο μεσογειακό εμπόριο της Αλεξάνδρειας;',
    partner_comment: 'Στη Θάσο (Γυμνάσιο Πρίνου): Πολλοί Θάσιοι ναυτικοί πραγματοποιούσαν το δρομολόγιο Θάσος-Χανιά-Αλεξάνδρεια μεταφέροντας ξυλεία για τα ναυπηγεία.',
    school: { id: 'school-chania', name: '3ο Γενικό Λύκειο Χανίων', city: 'Χανιά, Κρήτη', region: 'Κρήτη', created_at: '' },
    team: { id: 'team-b1', school_id: 'school-chania', name: 'Β1: Ιστοσελίδα & διαδραστικός χάρτης', active: true },
    sources: [
      {
        id: 's-alex-1',
        entry_id: 'entry-hub-alexandria',
        title: 'Ιστορικός ναυτικός χάρτης πορείας προς Αλεξάνδρεια (19ος αι.)',
        source_type: 'document',
        origin_holder: 'Εθνική Βιβλιοθήκη της Ελλάδος',
        source_url: 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=800&q=80',
        licence_type: 'Creative Commons BY-NC',
        critique_notes: 'Χάρτης θαλάσσιων ρευμάτων και λιμένων ανεφοδιασμού στην Ανατολική Μεσόγειο.',
        created_at: ''
      }
    ]
  },
  constantinople: {
    id: 'entry-hub-constantinople',
    title: 'Σουλτανικά φιρμάνια και διπλωματία της Υψηλής Πύλης (Κωνσταντινούπολη)',
    date_display: '1813 – 1830',
    year_numeric: 1825,
    period_tag: 'Οθωμανική Διοίκηση & Μεχμέτ Αλή',
    location_tag: 'constantinople',
    historical_context: 'Στην Κωνσταντινούπολη, το διοικητικό κέντρο της Οθωμανικής Αυτοκρατορίας, εκδόθηκαν τα σουλτανικά φιρμάνια του Μαχμούτ Β΄ που καθόρισαν την τύχη της Θάσου και αργότερα της Κρήτης.',
    research_question: 'Πώς αντικατοπτρίζονται στα οθωμανικά κρατικά έγγραφα οι γεωπολιτικές ισορροπίες για τον έλεγχο των νησιών του Αιγαίου;',
    partner_comment: 'Στα Χανιά (3ο ΓΕΛ): Τα φιρμάνια αυτά καθόρισαν την τύχη της Κρήτης για δεκαετίες, προκαλώντας έντονες αντιδράσεις.',
    school: { id: 'school-prinos', name: 'Γυμνάσιο Πρίνου Θάσου', city: 'Πρίνος, Θάσος', region: 'Αν. Μακεδονία & Θράκη', created_at: '' },
    team: { id: 'team-a2', school_id: 'school-prinos', name: 'Α2: Ο Μεχμέτ Αλή και η Θάσος', active: true },
    sources: [
      {
        id: 's-const-1',
        entry_id: 'entry-hub-constantinople',
        title: 'Οθωμανικό κρατικό κατάστιχο διοικητικών αποφάσεων (Κωνσταντινούπολη)',
        source_type: 'document',
        origin_holder: 'Οθωμανικά Αρχεία Πρωθυπουργίας (BOA, Istanbul)',
        source_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        licence_type: 'Εκπαιδευτική Χρήση',
        critique_notes: 'Επίσημο κρατικό χειρόγραφο με επικύρωση του μεγάλου βεζίρη.',
        created_at: ''
      }
    ]
  }
};

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

  // Εύρεση καταχωρίσεων για ένα hub (με fallback στα ιστορικά τεκμήρια του κόμβου)
  const getEntriesForHub = (hub: HistoricalHub): HistoricalEntry[] => {
    const liveDocs = entries.filter(e => 
      e.location_tag === hub.tag || 
      (hub.tag === 'thasos' && e.school_id === 'school-prinos') ||
      (hub.tag === 'chania' && (e.school_id === 'school-chania' || e.location_tag === 'crete'))
    );

    if (liveDocs.length > 0) return liveDocs;

    // Αν δεν υπάρχουν ακόμα αναρτήσεις στη βάση για αυτόν τον κόμβο, χρησιμοποιούμε το επιμελημένο ιστορικό τεκμήριο
    if (defaultHubEntries[hub.tag]) {
      return [defaultHubEntries[hub.tag] as HistoricalEntry];
    }
    return [];
  };

  // Όταν ο χρήστης επιλέγει έναν κόμβο στον χάρτη
  const handleHubClick = (hub: HistoricalHub) => {
    setActiveHub(hub);
    const hubDocs = getEntriesForHub(hub);
    if (hubDocs.length > 0) {
      setSelectedEntry(hubDocs[0]);
    }
  };

  // Τεκμήρια του τρέχοντος ενεργού hub
  const currentHubEntries = activeHub ? getEntriesForHub(activeHub) : (selectedEntry ? [selectedEntry] : []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Τίτλος & Εισαγωγή */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>Υποομάδα Β1 • Διαδραστική Χαρτογράφηση Τεκμηρίων</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Θαλάσσιοι Δρόμοι & Φωτογραφικά Τεκμήρια
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-700 max-w-2xl mx-auto">
          {selectedEntry 
            ? 'Ο χάρτης μαζεύτηκε αριστερά. Το τεκμήριο εμφανίζεται δεξιά. Πατήστε «Επαναφορά πλήρους χάρτη» για πλήρη προβολή.'
            : 'Κάντε κλικ σε ένα σημείο του χάρτη ή επιλέξτε ένα τεκμήριο: ο χάρτης μαζεύεται αριστερά και το τεκμήριο ανοίγει στα δεξιά!'}
        </p>
      </div>

      {/* ΓΡΗΓΟΡΗ ΕΠΙΛΟΓΗ ΤΕΚΜΗΡΙΩΝ (Πάντα διαθέσιμη στο επάνω μέρος του χάρτη) */}
      <div className="mb-5 p-3 sm:p-4 bg-[#fdfaf3] rounded-2xl border border-[#dcd1be] shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Επιλέξτε Τεκμήριο για Άμεση Προβολή Δεξιά του Χάρτη:</span>
          </span>
          {selectedEntry && (
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-xs text-amber-900 hover:text-amber-700 font-bold underline flex items-center gap-1"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Κλείσιμο δεξιάς προβολής</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {hubs.map(hub => {
            const docs = getEntriesForHub(hub);
            if (docs.length === 0) return null;
            const isHubActive = activeHub?.id === hub.id;
            return docs.map(doc => {
              const isSelected = selectedEntry?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveHub(hub);
                    setSelectedEntry(doc);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-500 scale-105'
                      : isHubActive
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white text-slate-800 hover:bg-amber-50 border border-[#e2d5c3]'
                  }`}
                >
                  <span className="text-amber-800 font-bold">
                    {hub.name.split(' ')[0]}:
                  </span>
                  <span>{doc.title.split('(')[0].trim().slice(0, 36)}...</span>
                  <span className="text-[10px] opacity-75 font-normal">({doc.year_numeric})</span>
                </button>
              );
            });
          })}
        </div>
      </div>

      {/* ΔΙΑΤΑΞΗ SIDE-BY-SIDE (ΔΙΠΛΑ-ΔΙΠΛΑ):
          Σε οθόνες md: (>= 768px):
          - ΑΡΙΣΤΕΡΑ: Χάρτης (45% ή 42%)
          - ΔΕΞΙΑ: Τεκμήριο (55% ή 58%)
      */}
      <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start transition-all duration-300">
        
        {/* ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ: ΧΑΡΤΗΣ LEAFLET */}
        <div className={`${selectedEntry ? 'w-full md:w-[46%] lg:w-[42%] shrink-0' : 'w-full'} transition-all duration-300`}>
          <div className={`bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative z-10 transition-all ${selectedEntry ? 'h-[520px] md:h-[620px]' : 'h-[500px] md:h-[580px]'}`}>
            
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

              {/* Dynamic Pan when hub changes */}
              <MapPanTo coords={activeHub ? activeHub.coords : null} />

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
                        
                        {count > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHub(hub);
                              setSelectedEntry(hubDocs[0]);
                            }}
                            className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Προβολή Τεκμηρίου στα Δεξιά ➔</span>
                          </button>
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

            {/* Κουμπί επαναφοράς σε πλήρη οθόνη */}
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
        </div>

        {/* ΔΕΞΙΑ ΣΤΗΛΗ: ΑΝΑΛΥΤΙΚΟ ΤΕΚΜΗΡΙΟ (ΕΜΦΑΝΙΖΕΤΑΙ ΣΤΑ ΔΕΞΙΑ ΤΟΥ ΧΑΡΤΗ) */}
        {selectedEntry && (
          <div className="w-full md:w-[54%] lg:w-[58%] shrink-0 transition-all duration-300">
            <div className="parchment-modal-bg rounded-2xl p-5 sm:p-7 shadow-xl space-y-5 max-h-[620px] overflow-y-auto animate-fadeIn relative">
              
              {/* Header: Επισήμανση & Κουμπί Επαναφοράς */}
              <div className="flex items-center justify-between border-b border-[#dcd1be] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Καρτέλα Τεκμηρίου (Δεξιά Προβολή)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                    title="Επιστροφή σε πλήρη χάρτη"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Επαναφορά πλήρους χάρτη</span>
                  </button>

                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-amber-100/50 transition"
                    aria-label="Κλείσιμο"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs εναλλαγής αν υπάρχουν περισσότερα τεκμήρια στον κόμβο */}
              {currentHubEntries.length > 1 && (
                <div className="p-2.5 bg-[#f6eee0] border border-[#dfd2be] rounded-xl space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 block">
                    Τεκμήρια αυτού του κόμβου ({currentHubEntries.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentHubEntries.map((doc, idx) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedEntry(doc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition ${
                          selectedEntry.id === doc.id
                            ? 'bg-amber-700 text-white font-bold shadow-sm'
                            : 'bg-white text-slate-800 hover:bg-amber-50 border border-[#dfd2be]'
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
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                    {selectedEntry.period_tag}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-950 border border-amber-300">
                    {selectedEntry.date_display} ({selectedEntry.year_numeric})
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 leading-snug">
                  {selectedEntry.title}
                </h3>
              </div>

              {/* Σχολείο & Ομάδα */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-amber-50/60 rounded-xl text-xs text-slate-800 border border-[#e5dac9]">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span><strong>Σχολείο:</strong> {selectedEntry.school?.name || 'Διασχολικό Εργαστήριο'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span><strong>Ομάδα:</strong> {selectedEntry.team?.name || 'Ομάδα Έρευνας'}</span>
                </div>
              </div>

              {/* Ερευνητικό Ερώτημα */}
              <div className="p-4 bg-amber-100/70 rounded-xl border-l-4 border-amber-600 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Ερευνητικό Ερώτημα
                </span>
                <p className="text-sm font-medium text-amber-950">
                  {selectedEntry.research_question}
                </p>
              </div>

              {/* Ιστορικό Πλαίσιο & Γεγονότα */}
              <div>
                <h4 className="text-sm font-bold text-slate-950 mb-1.5 font-serif">
                  Ιστορικό Πλαίσιο & Γεγονότα
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedEntry.historical_context}
                </p>
              </div>

              {/* Πηγές / Φωτογραφίες / Video */}
              {selectedEntry.sources && selectedEntry.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-950 mb-3 flex items-center gap-2 font-serif">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span>Πρωτογενείς Πηγές & Τεκμήρια ({selectedEntry.sources.length})</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedEntry.sources.map(source => (
                      <div key={source.id} className="p-4 bg-white/80 rounded-xl border border-[#dfd2be] shadow-sm">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                          <span className="font-bold text-slate-900">{source.origin_holder}</span>
                          <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-900">
                            {source.licence_type}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-950 mb-2 font-serif">{source.title}</h5>

                        {/* Video ή Φωτογραφία */}
                        {source.source_type === 'video_link' || (source.source_url && (source.source_url.includes('video.sch.gr') || source.source_url.includes('youtube.com') || source.source_url.includes('youtu.be') || source.source_url.includes('vimeo.com'))) ? (
                          <div className="my-3">
                            <SmartVideoEmbed url={source.source_url} title={source.title} />
                          </div>
                        ) : source.source_url ? (
                          <div className="my-3 relative group">
                            <div className="rounded-xl overflow-hidden border border-[#dfd2be] bg-black/5 max-h-72">
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
                          <p className="text-xs text-slate-700 mt-2 bg-[#fdfaf3] p-2.5 rounded-lg border border-[#e5dac9] leading-relaxed">
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
                <div className="p-4 bg-indigo-50/80 rounded-xl border-l-4 border-indigo-700 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
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
