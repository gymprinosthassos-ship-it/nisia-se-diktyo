import React from 'react';

interface ChaniaLighthouseIconProps {
  className?: string;
  size?: number;
}

/**
 * Εικονίδιο του ιστορικού Αιγυπτιακού Φάρου των Χανίων (1830-1840)
 * Σχεδιασμένο με την αυθεντική μακρόστενη, λεπτή και επιβλητική σιλουέτα τύπου μιναρέ.
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Φάρος Χανίων (Μακρόστενος)"
    >
      {/* 1. Ακίδα κορυφής & Θόλος φανού */}
      <path d="M12 1v1.5" strokeWidth="1.5" />
      <path d="M10.2 4.2c0-1.2.8-1.7 1.8-1.7s1.8.5 1.8 1.7" />

      {/* 2. Θάλαμος φανού (τζαμαρία) */}
      <rect 
        x="10.3" 
        y="4.2" 
        width="3.4" 
        height="2.3" 
        rx="0.4" 
        fill="currentColor" 
        fillOpacity="0.25" 
        strokeWidth="1.4"
      />

      {/* 3. Εξώστης / Κιγκλίδωμα Φαναριού */}
      <path d="M8.8 6.5h6.4" strokeWidth="2" />
      <path d="M9.2 7.6h5.6" strokeWidth="1.4" />

      {/* 4. Μακρόστενος κυλινδρικός κορμός (τύπου μιναρέ) */}
      <path d="M10.2 7.6l-.5 6h4.6l-.5-6" strokeWidth="1.8" />
      {/* Ενδιάμεσος λεπτός δακτύλιος */}
      <path d="M9.9 10.8h4.2" strokeWidth="1.2" />

      {/* 5. Μεσαίο πολυγωνικό διάζωμα */}
      <path d="M9.7 13.6h4.6" strokeWidth="2" />
      <path d="M9.5 13.6l-.7 4.2h6.4l-.7-4.2" strokeWidth="1.8" />

      {/* 6. Βάση πέτρινου προμαχώνα (Ενετικό κάστρο λιμενοβραχίονα) */}
      <path d="M8.2 17.8h7.6" strokeWidth="2" />
      <path d="M8.5 17.8l-1.3 3.4h9.6l-1.3-3.4" strokeWidth="1.8" />

      {/* 7. Πέτρινη βάση & κυματισμός θάλασσας */}
      <path d="M6.5 21.2h11" strokeWidth="1.8" />
      <path d="M4 22.8c2-.4 4.5.4 8 0s6 .4 8 0" strokeWidth="1.4" />

      {/* 8. Διακριτικές φωτεινές ακτίνες φάρου */}
      <path d="M7.5 4.8l-2.5-1" strokeWidth="1.3" />
      <path d="M16.5 4.8l2.5-1" strokeWidth="1.3" />
    </svg>
  );
};

export default ChaniaLighthouseIcon;
