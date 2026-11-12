export type Language = 'el' | 'en';

export interface TranslationDictionary {
  // Header & Navbar
  labTitle: string;
  centuryBadge: string;
  labSubtitle: string;
  cloudLive: string;
  prinosSchoolBadge: string;
  chaniaSchoolBadge: string;
  helpButton: string;
  
  // Navigation
  navIdentity: string;
  navIdentityDesc: string;
  navTimeline: string;
  navTimelineDesc: string;
  navMap: string;
  navMapDesc: string;
  navTeams: string;
  navTeamsDesc: string;
  navTeachers: string;
  navTeachersDesc: string;

  // Project Identity
  identityBadge: string;
  identityMainTitle: string;
  identitySubTitle: string;
  schoolPrinosTitle: string;
  schoolPrinosRegion: string;
  schoolChaniaTitle: string;
  schoolChaniaRegion: string;
  teacherCoordination: string;
  historicalContextTitle: string;
  historicalContextText1: string;
  historicalContextText2: string;
  pedagogicalGoalsTitle: string;
  goal1Title: string;
  goal1Desc: string;
  goal2Title: string;
  goal2Desc: string;
  goal3Title: string;
  goal3Desc: string;
  goal4Title: string;
  goal4Desc: string;

  // Timeline
  timelineTitle: string;
  timelineSubtitle: string;
  allEventsFilter: string;
  thasosEventsFilter: string;
  creteEventsFilter: string;
  searchPlaceholder: string;
  noEntriesFound: string;
  sourceDocument: string;
  verifiedArchive: string;
  timelineBadge: string;
  allRegionsPill: string;
  thasosRegionPill: string;
  creteRegionPill: string;
  filterLabel: string;
  allPeriodsOption: string;
  allSchoolsOption: string;
  printTimelineBtn: string;
  foundEntriesPrefix: string;
  foundEntriesSuffix: string;
  clearFiltersBtn: string;
  researchQuestionLabel: string;
  evidenceLabel: string;
  partnerSchoolContribution: string;
  viewDetailsBtn: string;
  historicalContextModalLabel: string;
  primarySourcesModalLabel: string;
  sourceCritiqueLabel: string;
  sourceHolderLabel: string;
  sourceLicenceLabel: string;
  teamInterpretationLabel: string;
  partnerCounterpointLabel: string;
  resetAllFiltersBtn: string;
  originalLanguageNotice: string;

  // Map
  mapTitle: string;
  mapSubtitle: string;
  maritimeRoutes: string;
  tradeConnections: string;

  // Footer
  footerCopyright: string;
  footerSchoolsTitle: string;
  footerPrinosDesc: string;
  footerChaniaDesc: string;
  footerDevCredit: string;
  footerSafeBadge: string;
  footerQuickNav: string;
  footerGuideLink: string;
  
  // Language switcher
  langSwitchAria: string;
  archiveNotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  el: {
    labTitle: 'ΔΙΑΣΧΟΛΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΨΗΦΙΑΚΗΣ ΤΟΠΙΚΗΣ ΙΣΤΟΡΙΑΣ',
    centuryBadge: '19ος αι.',
    labSubtitle: 'Θάσος & Κρήτη στην Οθωμανική Μεσόγειο του Μεχμέτ Αλή',
    cloudLive: 'Cloud Live',
    prinosSchoolBadge: 'Γυμνάσιο Πρίνου Θάσου',
    chaniaSchoolBadge: '3ο Γενικό Λύκειο Χανίων',
    helpButton: 'Βοήθεια',

    navIdentity: 'Ταυτότητα Έργου',
    navIdentityDesc: 'Σκοπός, σχολεία & ομάδες',
    navTimeline: 'Χρονολόγιο',
    navTimelineDesc: 'Διαδραστικό ιστορικό χρονολόγιο',
    navMap: 'Χάρτης Δικτύου',
    navMapDesc: 'Ναυτικοί & εμπορικοί δρόμοι',
    navTeams: 'Υποβολή Ομάδων',
    navTeamsDesc: 'Καταχώριση αρχειακών τεκμηρίων',
    navTeachers: 'Εκπαιδευτικοί',
    navTeachersDesc: 'Επιμέλεια & αξιολόγηση',

    identityBadge: 'ΤΑΥΤΟΤΗΤΑ & ΣΚΟΠΟΣ ΕΡΓΑΣΤΗΡΙΟΥ',
    identityMainTitle: 'Θάσος & Κρήτη: Δύο Νησιά, Ένα Κοινό Ιστορικό Νήμα',
    identitySubTitle: 'Μια διασχολική ψηφιακή σύμπραξη τοπικής ιστορίας και αρχειακής έρευνας για τη Μεσόγειο του 19ου αιώνα.',
    schoolPrinosTitle: 'Γυμνάσιο Πρίνου Θάσου',
    schoolPrinosRegion: 'ΒΟΡΕΙΟ ΑΙΓΑΙΟ • ΘΑΣΟΣ',
    schoolChaniaTitle: '3ο Γενικό Λύκειο Χανίων',
    schoolChaniaRegion: 'ΝΟΤΙΑ ΜΕΣΟΓΕΙΟΣ • ΚΡΗΤΗ',
    teacherCoordination: 'Συντονισμός Εκπαιδευτικών:',
    historicalContextTitle: 'Το Ιστορικό Πλαίσιο: Η Εποχή του Μεχμέτ Αλή',
    historicalContextText1: 'Στις αρχές του 19ου αιώνα, δύο γεωγραφικά απομακρυσμένα νησιά του ελληνικού χώρου συνδέθηκαν κάτω από την κοινή διοίκηση και επιρροή της δυναστείας του Μεχμέτ Αλή Πασά της Αιγύπτου. Η Θάσος παραχωρήθηκε ως βακούφι το 1813 με ειδικό καθεστώς αυτοδιοίκησης, ενώ η Κρήτη βρέθηκε υπό αιγυπτιακή διοίκηση κατά την περίοδο 1830–1840.',
    historicalContextText2: 'Μέσα από τη μελέτη αρχειακών πηγών, παλαιών εγγράφων και προφορικών μαρτυριών, οι μαθητές ανακαλύπτουν τις κοινές όψεις της καθημερινής ζωής, της ναυτιλίας, του εμπορίου και των κοινωνικών μετασχηματισμών.',
    pedagogicalGoalsTitle: 'Παιδαγωγικοί Στόχοι & Μεθοδολογία',
    goal1Title: 'Βιωματική Ιστορική Έρευνα',
    goal1Desc: 'Οι μαθητές δρουν ως μικροί ερευνητές αναζητώντας τεκμήρια στα τοπικά αρχεία και στις οικογενειακές μνήμες.',
    goal2Title: 'Διασχολική Συνεργασία',
    goal2Desc: 'Συνεχής επικοινωνία, συνδιδασκαλίες και κοινές ψηφιακές δράσεις ανάμεσα σε Βόρειο Αιγαίο και Κρήτη.',
    goal3Title: 'Προφορική Ιστορία & Μαρτυρίες',
    goal3Desc: 'Συλλογή συνεντεύξεων από ηλικιωμένους και διάσωση της άυλης πολιτιστικής κληρονομιάς των δύο νησιών.',
    goal4Title: 'Ψηφιακός Γραμματισμός & Διάχυση',
    goal4Desc: 'Αξιοποίηση σύγχρονων ψηφιακών χαρτών, πολυμέσων και ανοικτών αποθετηρίων προσβάσιμων στην τοπική κοινωνία.',

    timelineTitle: 'Διαδραστικό Ιστορικό Χρονολόγιο',
    timelineSubtitle: 'Περιηγηθείτε στα κομβικά γεγονότα, στα αρχειακά τεκμήρια και στις μαρτυρίες του 19ου αιώνα.',
    allEventsFilter: 'Όλα τα Γεγονότα',
    thasosEventsFilter: 'Θάσος',
    creteEventsFilter: 'Κρήτη',
    searchPlaceholder: 'Αναζήτηση σε γεγονότα, πρόσωπα, τοπωνύμια...',
    noEntriesFound: 'Δεν βρέθηκαν ιστορικά γεγονότα με αυτά τα κριτήρια.',
    sourceDocument: 'Ιστορική Πηγή / Τεκμήριο',
    verifiedArchive: 'Επαληθευμένο Αρχείο',
    timelineBadge: 'ΚΟΙΝΟ ΨΗΦΙΑΚΟ ΧΡΟΝΟΛΟΓΙΟ (19ος ΑΙΩΝΑΣ)',
    allRegionsPill: '🌍 Όλες οι περιοχές',
    thasosRegionPill: 'Θάσος',
    creteRegionPill: 'Κρήτη / Χανιά',
    filterLabel: 'Φίλτρα:',
    allPeriodsOption: 'Όλες οι περίοδοι',
    allSchoolsOption: 'Όλα τα σχολεία',
    printTimelineBtn: 'Εκτύπωση',
    foundEntriesPrefix: 'Βρέθηκαν',
    foundEntriesSuffix: 'εγκεκριμένες ιστορικές καταχωρίσεις',
    clearFiltersBtn: 'Καθαρισμός φίλτρων',
    researchQuestionLabel: 'Ερευνητικό Ερώτημα:',
    evidenceLabel: 'Τεκμήρια',
    partnerSchoolContribution: 'Περιλαμβάνει συνεισφορά άλλου σχολείου',
    viewDetailsBtn: 'Προβολή',
    historicalContextModalLabel: 'Ιστορικό Πλαίσιο & Γεγονότα',
    primarySourcesModalLabel: 'Πρωτογενείς Πηγές & Οπτικοακουστικά Τεκμήρια',
    sourceCritiqueLabel: 'Κριτική Αξιολόγηση Πηγής:',
    sourceHolderLabel: 'Κάτοχος/Φορέας:',
    sourceLicenceLabel: 'Άδεια Χρήσης:',
    teamInterpretationLabel: 'ΙΣΤΟΡΙΚΗ ΕΡΜΗΝΕΙΑ & ΣΥΜΠΕΡΑΣΜΑΤΑ ΟΜΑΔΑΣ',
    partnerCounterpointLabel: 'ΣΥΝΕΙΣΦΟΡΑ & ΑΝΤΙΛΟΓΟΣ ΣΥΝΕΡΓΑΖΟΜΕΝΟΥ ΣΧΟΛΕΙΟΥ',
    resetAllFiltersBtn: 'Επαναφορά όλων των φίλτρων',
    originalLanguageNotice: 'Πρωτότυπο ελληνικό αρχειακό κείμενο',

    mapTitle: 'Διαδραστικός Χάρτης Δικτύου',
    mapSubtitle: 'Ναυτικοί δρόμοι, λιμάνια και τοπόσημα της Θάσου και των Χανίων.',
    maritimeRoutes: 'Ναυτικές Διαδρομές',
    tradeConnections: 'Εμπορικοί & Διοικητικοί Σύνδεσμοι',

    footerCopyright: '© 2026–2027 • Διασχολικό Εργαστήριο Ψηφιακής Τοπικής Ιστορίας',
    footerSchoolsTitle: 'ΣΥΝΕΡΓΑΖΟΜΕΝΑ ΣΧΟΛΕΙΑ',
    footerPrinosDesc: 'Πρίνος, Θάσος • Α΄ & Β΄ Πτέρυγες',
    footerChaniaDesc: 'Χανιά, Κρήτη • Α΄ & Β΄ Πτέρυγες',
    footerDevCredit: 'Ανάπτυξη Ιστοσελίδας:',
    footerSafeBadge: '100% Ασφαλής & Ανοικτή Πλατφόρμα',
    footerQuickNav: 'ΧΡΗΣΙΜΟΙ ΣΥΝΔΕΣΜΟΙ',
    footerGuideLink: 'Εγχειρίδιο Χρήσης (Οδηγός)',
    langSwitchAria: 'Επιλογή Γλώσσας (Ελληνικά / English)',
    archiveNotice: 'Αρχειακό Υλικό & Πηγές'
  },
  en: {
    labTitle: 'INTER-SCHOOL DIGITAL LOCAL HISTORY LAB',
    centuryBadge: '19th c.',
    labSubtitle: 'Thasos & Crete in the Ottoman Mediterranean of Muhammad Ali',
    cloudLive: 'Cloud Live',
    prinosSchoolBadge: 'Junior High School of Prinos, Thasos',
    chaniaSchoolBadge: '3rd Senior High School of Chania, Crete',
    helpButton: 'User Guide',

    navIdentity: 'Project Identity',
    navIdentityDesc: 'Scope, partner schools & student wings',
    navTimeline: 'Historical Timeline',
    navTimelineDesc: 'Interactive 19th-century timeline',
    navMap: 'Heritage Map',
    navMapDesc: 'Maritime routes & cultural landmarks',
    navTeams: 'Student Teams',
    navTeamsDesc: 'Archival records & research submissions',
    navTeachers: 'Educators Hub',
    navTeachersDesc: 'Curatorship, feedback & moderation',

    identityBadge: 'PROJECT IDENTITY & ACADEMIC SCOPE',
    identityMainTitle: 'Thasos & Crete: Two Islands, One Shared Historical Thread',
    identitySubTitle: 'A cross-school digital humanities partnership investigating local history and archival heritage in the 19th-century Mediterranean.',
    schoolPrinosTitle: 'Junior High School of Prinos, Thasos',
    schoolPrinosRegion: 'NORTH AEGEAN • THASOS ISLAND',
    schoolChaniaTitle: '3rd Senior High School of Chania',
    schoolChaniaRegion: 'SOUTH MEDITERRANEAN • CRETE ISLAND',
    teacherCoordination: 'Teacher Coordination Team:',
    historicalContextTitle: 'Historical Framework: The Era of Muhammad Ali Pasha',
    historicalContextText1: 'During the early 19th century, two geographically distant Greek island communities were uniquely linked under the administration and influence of Muhammad Ali Pasha of Egypt. Thasos was granted as a Waqf in 1813 with special self-governing status, while Crete was placed under Egyptian administration during 1830–1840.',
    historicalContextText2: 'Through the rigorous examination of municipal archives, historical manuscripts, and oral history testimonies, secondary students explore daily social life, trade networks, seafaring traditions, and institutional reforms.',
    pedagogicalGoalsTitle: 'Pedagogical Objectives & Methodology',
    goal1Title: 'Inquiry-Based History Research',
    goal1Desc: 'Students act as young historians discovering primary sources in local archives and oral records.',
    goal2Title: 'Cross-Regional Collaboration',
    goal2Desc: 'Continuous digital dialogue, co-teaching sessions, and collaborative work across North and South Greece.',
    goal3Title: 'Oral History & Living Memories',
    goal3Desc: 'Recording oral testimonies from senior citizens to preserve the intangible cultural heritage of both islands.',
    goal4Title: 'Digital Literacy & Public Dissemination',
    goal4Desc: 'Deploying interactive web maps, multimedia narratives, and open repositories accessible to the community.',

    timelineTitle: 'Interactive Historical Timeline',
    timelineSubtitle: 'Explore pivotal milestones, archival records, and 19th-century primary accounts.',
    allEventsFilter: 'All Milestones',
    thasosEventsFilter: 'Thasos Island',
    creteEventsFilter: 'Crete Island',
    searchPlaceholder: 'Search events, historical figures, locations...',
    noEntriesFound: 'No historical entries found matching these criteria.',
    sourceDocument: 'Primary Source / Archival Record',
    verifiedArchive: 'Peer-Reviewed Archival Record',
    timelineBadge: 'SHARED DIGITAL TIMELINE (19th CENTURY)',
    allRegionsPill: '🌍 All Regions',
    thasosRegionPill: 'Thasos Island',
    creteRegionPill: 'Crete / Chania',
    filterLabel: 'Filters:',
    allPeriodsOption: 'All historical periods',
    allSchoolsOption: 'All partner schools',
    printTimelineBtn: 'Print Timeline',
    foundEntriesPrefix: 'Found',
    foundEntriesSuffix: 'verified historical records',
    clearFiltersBtn: 'Reset filters',
    researchQuestionLabel: 'Research Question:',
    evidenceLabel: 'Evidence / Sources',
    partnerSchoolContribution: 'Includes peer contribution from partner school',
    viewDetailsBtn: 'View Record',
    historicalContextModalLabel: 'Historical Context & Events',
    primarySourcesModalLabel: 'Primary Sources & Multimedia Records',
    sourceCritiqueLabel: 'Critical Source Evaluation:',
    sourceHolderLabel: 'Custodian / Archive:',
    sourceLicenceLabel: 'License:',
    teamInterpretationLabel: 'HISTORICAL INTERPRETATION & STUDENT CONCLUSIONS',
    partnerCounterpointLabel: 'PARTNER SCHOOL CONTRIBUTION & PEER REVIEW',
    resetAllFiltersBtn: 'Reset all filters',
    originalLanguageNotice: 'Primary archival document preserved in original Greek',

    mapTitle: 'Interactive Maritime & Heritage Map',
    mapSubtitle: 'Naval routes, harbors, and historical monuments across Thasos and Chania.',
    maritimeRoutes: 'Seafaring Trade Routes',
    tradeConnections: 'Administrative & Cultural Connections',

    footerCopyright: '© 2026–2027 • Inter-School Digital Local History Lab',
    footerSchoolsTitle: 'PARTNER SCHOOLS',
    footerPrinosDesc: 'Prinos, Thasos • Wings A & B',
    footerChaniaDesc: 'Chania, Crete • Wings A & B',
    footerDevCredit: 'Platform Development:',
    footerSafeBadge: '100% Safe & Open Educational Platform',
    footerQuickNav: 'QUICK LINKS',
    footerGuideLink: 'User Guide & Manual',
    langSwitchAria: 'Language Switcher (Greek / English)',
    archiveNotice: 'Original Archival Records'
  }
};
