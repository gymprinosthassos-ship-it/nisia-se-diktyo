import React from 'react';

interface ChaniaLighthouseIconProps {
  className?: string;
  size?: number;
}

/**
 * Εικονίδιο του ιστορικού Αιγυπτιακού Φάρου των Χανίων (1830-1840)
 * στο Ενετικό Λιμάνι των Χανίων σε στυλ μιναρέ / πέτρινου πύργου με φανάρι.
 */
export const ChaniaLighthouseIcon: React.FC<ChaniaLighthouseIconProps> = ({ 
  className = "w-6 h-6",
  size
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Φάρος Χανίων"
    >
      {/* Κυματισμός νερού / θάλασσα στη βάση */}
      <path d="M2 21.5c1.5-.5 3-.5 4.5 0s3 .5 4.5 0 3-.5 4.5 0 3 .5 4.5 0" strokeWidth="1.5" />

      {/* Πέτρινος κυματοθραύστης / Βάση Ενετικού προμαχώνα */}
      <path d="M4.5 20h15" />
      <path d="M6 20l1-3h10l1 3" />

      {/* Κορμός Φάρου Χανίων (Πολυγωνικός & κυλινδρικός πύργος τύπου μιναρέ) */}
      <path d="M8 17l1.2-8h5.6l1.2 8" />

      {/* Διαζώματα / Πέτρινοι δακτύλιοι κορμού */}
      <path d="M8.7 13h6.6" strokeWidth="1.5" />
      <path d="M9.3 9h5.4" strokeWidth="1.5" />

      {/* Εξώστης / Κιγκλίδωμα Φαναριού */}
      <path d="M7.5 9h9" strokeWidth="2" />
      <path d="M8.5 7h7" strokeWidth="1.5" />
      <path d="M8.5 9v-2M15.5 9v-2" strokeWidth="1.5" />

      {/* Θάλαμος φανού (τζαμαρία) */}
      <rect x="9.5" y="4" width="5" height="3" rx="0.5" fill="currentColor" fillOpacity="0.2" />

      {/* Θόλος & Ακίδα κορυφής */}
      <path d="M9.5 4c0-1.8 1.1-2.5 2.5-2.5s2.5.7 2.5 2.5" />
      <path d="M12 1.5v-1" strokeWidth="1.5" />

      {/* Φωτεινές ακτίνες φάρου (αριστερά & δεξιά) */}
      <path d="M4 3.5l3 1.5" strokeWidth="1.5" strokeDasharray="1 1" />
      <path d="M20 3.5l-3 1.5" strokeWidth="1.5" strokeDasharray="1 1" />
    </svg>
  );
};

export default ChaniaLighthouseIcon;
