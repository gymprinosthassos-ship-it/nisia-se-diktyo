import React, { useState, useEffect, useRef } from 'react';
import { Traveler19thAvatar } from './Traveler19thAvatar';

interface DraggableNarratorButtonProps {
  onClick: () => void;
}

export const DraggableNarratorButton: React.FC<DraggableNarratorButtonProps> = ({ onClick }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  });

  const buttonSize = 54; // Διάμετρος σε pixels (στρογγυλό, ιδανικό compact μέγεθος)

  // Αρχικοποίηση θέσης κάτω δεξιά στην οθόνη
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialX = Math.max(16, window.innerWidth - buttonSize - 24);
      const initialY = Math.max(16, window.innerHeight - buttonSize - 28);
      setPosition({ x: initialX, y: initialY });

      // Διατήρηση εντός οθόνης σε περίπτωση resize
      const handleResize = () => {
        setPosition(prev => {
          if (!prev) return prev;
          const clampedX = Math.max(12, Math.min(window.innerWidth - buttonSize - 12, prev.x));
          const clampedY = Math.max(12, Math.min(window.innerHeight - buttonSize - 12, prev.y));
          return { x: clampedX, y: clampedY };
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!position) return;
    
    // Ενεργοποίηση pointer capture για ομαλό drag ακόμα κι αν το ποντίκι βγει εκτός
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !position) return;

    const deltaX = e.clientX - dragInfoRef.current.startX;
    const deltaY = e.clientY - dragInfoRef.current.startY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 5) {
      dragInfoRef.current.hasMoved = true;
    }

    if (dragInfoRef.current.hasMoved) {
      const rawX = dragInfoRef.current.initialX + deltaX;
      const rawY = dragInfoRef.current.initialY + deltaY;

      // Όρια παραθύρου (ώστε να μην χάνεται εκτός οθόνης)
      const maxX = window.innerWidth - buttonSize - 8;
      const maxY = window.innerHeight - buttonSize - 8;
      const clampedX = Math.max(8, Math.min(maxX, rawX));
      const clampedY = Math.max(8, Math.min(maxY, rawY));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDragging(false);

    // Εάν δεν σύρθηκε πάνω από 5 pixels, θεωρείται απλό κλικ και ανοίγει ο αφηγητής
    if (!dragInfoRef.current.hasMoved) {
      onClick();
    }
  };

  if (!position) return null;

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'} transition-transform duration-75`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      aria-label="Ψηφιακός Αφηγητής 19ου Αιώνα (Σύρετε για μετακίνηση)"
    >
      {/* Στρογγυλό Μετάλλιο Αφηγητή */}
      <div className="relative group">
        <div className="w-[54px] h-[54px] rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-2xl shadow-black/80 ring-2 ring-amber-500/50 hover:ring-amber-400 flex items-center justify-center transition-all">
          <Traveler19thAvatar 
            className="w-full h-full rounded-full" 
            showBorder={false}
          />
        </div>

        {/* Πράσινη ένδειξη ενεργής παρουσίας */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm animate-pulse" />

        {/* Tooltip οδηγίας μετακίνησης & ανοίγματος */}
        {showTooltip && !isDragging && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-white text-[11px] shadow-2xl backdrop-blur-md pointer-events-none flex flex-col items-start gap-0.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Ψηφιακός Αφηγητής</span>
            </div>
            <span className="text-[10px] text-slate-300">
              Κλικ για ακρόαση • Σύρετε οπουδήποτε
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
