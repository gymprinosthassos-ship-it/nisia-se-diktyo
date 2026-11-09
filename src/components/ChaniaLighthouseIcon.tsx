import React from 'react';

interface ChaniaLighthouseIconProps {
  className?: string;
  size?: number;
}

/**
 * Εικονίδιο του ιστορικού Αιγυπτιακού Φάρου των Χανίων (1830-1840)
 * Σχεδιασμένο με μακρόστενη, λεπτή γραμμή και στενή, ευθυγραμμισμένη βάση.
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
      aria-label="Φάρος Χανίων (Στενή Βάση)"
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
      <path d="M10.2 7.6l-.4 5.8h4.4l-.4-5.8" strokeWidth="1.8" />
      {/* Ενδιάμεσος λεπτός πέτρινος δακτύλιος */}
      <path d="M9.9 10.6h4.2" strokeWidth="1.2" />

      {/* 5. Μεσαίο πολυγωνικό διάζωμα */}
      <path d="M9.6 13.4h4.8" strokeWidth="1.8" />
      <path d="M9.5 13.4l-.5 4h6l-.5-4" strokeWidth="1.8" />

      {/* 6. Στενή βάση πέτρινου προμαχώνα */}
      <path d="M8.6 17.4h6.8" strokeWidth="1.8" />
      <path d="M8.8 17.4l-.7 3.8h7.8l-.7-3.8" strokeWidth="1.8" />

      {/* 7. Κρηπίδωμα & συμπαγής κυματισμός βάσης */}
      <path d="M7.6 21.2h8.8" strokeWidth="2" />
      <path d="M6 22.8c2-.4 3.5.4 6 0s4 .4 6 0" strokeWidth="1.4" />

      {/* 8. Διακριτικές φωτεινές ακτίνες φάρου */}
      <path d="M7.5 4.8l-2.5-1" strokeWidth="1.3" />
      <path d="M16.5 4.8l2.5-1" strokeWidth="1.3" />
    </svg>
  );
};

export default ChaniaLighthouseIcon;
