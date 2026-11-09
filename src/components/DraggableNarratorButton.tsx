import React, { useState, useEffect, useRef } from 'react';
import { Traveler19thAvatar } from './Traveler19thAvatar';

interface DraggableNarratorButtonProps {
  onClick: () => void;
}

export const DraggableNarratorButton: React.FC<DraggableNarratorButtonProps> = ({ onClick }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const buttonSize = 50; // Compact 50px διάμετρος (στρογγυλό, διακριτικό)
  const posRef = useRef<{ x: number; y: number } | null>(null);

  // Συγχρονισμός του posRef με το state
  useEffect(() => {
    posRef.current = position;
  }, [position]);

  // Αρχικοποίηση θέσης κάτω δεξιά στην οθόνη
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initX = Math.max(16, window.innerWidth - buttonSize - 24);
      const initY = Math.max(16, window.innerHeight - buttonSize - 28);
      setPosition({ x: initX, y: initY });

      const handleResize = () => {
        setPosition(prev => {
          if (!prev) return prev;
          const maxX = window.innerWidth - buttonSize - 12;
          const maxY = window.innerHeight - buttonSize - 12;
          return {
            x: Math.max(12, Math.min(maxX, prev.x)),
            y: Math.max(12, Math.min(maxY, prev.y)),
          };
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Αποδοχή μόνο αριστερού κλικ ή αφής
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Αποτροπή προεπιλεγμένης επιλογής κειμένου ή εγγενούς drag εικόνας
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const currentPos = posRef.current || { x: 0, y: 0 };
    const startPosX = currentPos.x;
    const startPosY = currentPos.y;

    let hasMoved = false;
    setIsDragging(true);

    const onPointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      // Αν μετακινήθηκε πάνω από 4 pixels, ενεργοποιείται το σύρσιμο
      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
      }

      if (hasMoved) {
        const maxX = window.innerWidth - buttonSize - 8;
        const maxY = window.innerHeight - buttonSize - 8;
        const nextX = Math.max(8, Math.min(maxX, startPosX + dx));
        const nextY = Math.max(8, Math.min(maxY, startPosY + dy));

        setPosition({ x: nextX, y: nextY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setIsDragging(false);

      // Εάν δεν σύρθηκε, είναι απλό κλικ -> άνοιγμα ξεναγού
      if (!hasMoved) {
        onClick();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  if (!position) return null;

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      className={`fixed z-[9999] select-none ${
        isDragging ? 'cursor-grabbing scale-110 drop-shadow-2xl' : 'cursor-grab hover:scale-105'
      } transition-transform duration-75`}
      onPointerDown={handlePointerDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      title="Ψηφιακός Αφηγητής 19ου Αιώνα (Σύρετε για μετακίνηση)"
    >
      {/* Στρογγυλό συμπαγές μετάλλιο (50px) */}
      <div className="relative group pointer-events-none">
        <div className="w-[50px] h-[50px] rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-2xl shadow-black/90 ring-2 ring-amber-400/80 hover:ring-amber-300 flex items-center justify-center transition-all overflow-hidden">
          <Traveler19thAvatar 
            className="w-full h-full rounded-full pointer-events-none" 
            showBorder={false}
          />
        </div>

        {/* Πράσινη ένδειξη ενεργής παρουσίας */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm animate-pulse" />

        {/* Tooltip οδηγίας */}
        {showTooltip && !isDragging && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/95 border border-amber-500/50 text-white text-[11px] shadow-2xl backdrop-blur-md flex flex-col items-start gap-0.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>Ψηφιακός Αφηγητής</span>
            </div>
            <span className="text-[10px] text-slate-300">
              Κλικ για αφήγηση • Σύρετε παντού στην οθόνη
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
