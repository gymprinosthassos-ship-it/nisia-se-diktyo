import React, { useState } from 'react';

interface Traveler19thAvatarProps {
  className?: string;
  size?: number; // width & height in px
  showBorder?: boolean;
}

export const Traveler19thAvatar: React.FC<Traveler19thAvatarProps> = ({
  className = "w-10 h-10",
  size,
  showBorder = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // If a generated image exists, we try to show it; otherwise render the rich historical SVG avatar
  return (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none ${
        showBorder ? 'ring-2 ring-amber-500/60 shadow-lg shadow-amber-950/40 bg-gradient-to-b from-slate-800 to-amber-950/80' : 'bg-slate-900'
      } ${className}`}
      style={size ? { width: size, height: size } : undefined}
      title="Ψηφιακός Αφηγητής — Ταξιδευτής του 19ου Αιώνα"
    >
      {!imgError ? (
        <img 
          src="/images/traveler-19th.jpg?v=2" 
          alt="Ταξιδευτής 19ου Αιώνα" 
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          onError={() => setImgError(true)}
        />
      ) : null}

      {/* Vector Fallback (Detailed 19th-century Mariner/Traveler Portrait) */}
      {imgError && (
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-amber-400 p-1"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Gradient & Radiance */}
          <circle cx="50" cy="50" r="48" fill="#1e1810" stroke="#d97706" strokeWidth="2" strokeDasharray="3 1.5" />
          <circle cx="50" cy="50" r="44" fill="#2d2216" opacity="0.9" />

          {/* Sailor Coat & Shoulders */}
          <path 
            d="M15 95 C 18 72, 35 68, 50 68 C 65 68, 82 72, 85 95 Z" 
            fill="#1c2434" 
            stroke="#d97706" 
            strokeWidth="1.5" 
          />

          {/* Traditional Vest / Cravat */}
          <path d="M42 69 L50 82 L58 69 Z" fill="#991b1b" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="50" cy="85" r="1.5" fill="#f59e0b" />
          <circle cx="50" cy="91" r="1.5" fill="#f59e0b" />

          {/* High White Collar */}
          <path d="M38 64 L45 70 L48 64 Z" fill="#fef3c7" />
          <path d="M62 64 L55 70 L52 64 Z" fill="#fef3c7" />

          {/* Neck */}
          <rect x="44" y="58" width="12" height="10" fill="#fcd34d" rx="2" />

          {/* Face (Warm Toned 19th c. Islander) */}
          <ellipse cx="50" cy="48" rx="16" ry="19" fill="#fde68a" stroke="#b45309" strokeWidth="1" />

          {/* Ears */}
          <ellipse cx="33" cy="49" rx="3" ry="5" fill="#fcd34d" />
          <ellipse cx="67" cy="49" rx="3" ry="5" fill="#fcd34d" />

          {/* Eyes & Weathered Eyebrows */}
          <path d="M40 40 Q 44 38 47 41" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 40 Q 56 38 53 41" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43.5" cy="44.5" r="2" fill="#451a03" />
          <circle cx="56.5" cy="44.5" r="2" fill="#451a03" />
          <circle cx="44.5" cy="44" r="0.6" fill="#ffffff" />
          <circle cx="57.5" cy="44" r="0.6" fill="#ffffff" />

          {/* Straight Proud Nose */}
          <path d="M50 42 L48 51 L52 51" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Distinctive 19th-Century Greek Sea-Captain Mustache */}
          <path 
            d="M34 55 C 38 53, 46 54, 50 56 C 54 54, 62 53, 66 55 C 69 57, 65 60, 60 59 C 54 58, 51 60, 50 61 C 49 60, 46 58, 40 59 C 35 60, 31 57, 34 55 Z" 
            fill="#451a03" 
            stroke="#1c1917" 
            strokeWidth="0.8"
          />

          {/* Chin Definition */}
          <path d="M47 62 Q 50 64 53 62" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />

          {/* 19th-Century Mariner / Explorer Cap (Πηλήκιο Καπετάνιου 19ου Αιώνα) */}
          {/* Cap Crown */}
          <path 
            d="M31 34 C 31 22, 40 18, 50 18 C 60 18, 69 22, 69 34 Z" 
            fill="#1e293b" 
            stroke="#d97706" 
            strokeWidth="1.5"
          />
          {/* Gold Trim / Cord on Cap */}
          <path d="M31 34 Q 50 36 69 34" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="50" cy="27" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
          {/* Anchor symbol on cap badge */}
          <path d="M50 25.5 L50 28.5 M48.5 27.5 Q 50 29 51.5 27.5" stroke="#451a03" strokeWidth="0.7" strokeLinecap="round" />

          {/* Cap Visor (Γείσο) */}
          <path 
            d="M28 34 C 33 39, 67 39, 72 34 C 70 38, 50 41, 28 34 Z" 
            fill="#0f172a" 
            stroke="#f59e0b" 
            strokeWidth="1"
          />

          {/* Sideburns / Hair */}
          <path d="M33 38 Q 35 48 35 52 Q 33 46 32 40 Z" fill="#451a03" />
          <path d="M67 38 Q 65 48 65 52 Q 67 46 68 40 Z" fill="#451a03" />
        </svg>
      )}
    </div>
  );
};
