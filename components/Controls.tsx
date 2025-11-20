
import React, { useEffect, useRef } from 'react';
import { GameAction, ControlSettings } from '../types';

interface ControlsProps {
  onAction: (action: GameAction) => void;
  skillProgress: number; // 0 to 1 (1 is full ready)
  isSkillReady: boolean;
  settings: ControlSettings;
}

const Controls: React.FC<ControlsProps> = ({ onAction, skillProgress, isSkillReady, settings }) => {
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  // Prevent default behavior to stop zooming/scrolling on double tap
  const handleTouch = (action: GameAction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction(action);
  };

  // Swipe Logic
  useEffect(() => {
      if (!settings.enableSwipe) return;

      const handleTouchStart = (e: TouchEvent) => {
          touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };

      const handleTouchEnd = (e: TouchEvent) => {
          if (!touchStartRef.current) return;
          
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const dx = endX - touchStartRef.current.x;
          const dy = endY - touchStartRef.current.y;
          
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          // Minimum distance for swipe to prevent accidental taps being swipes
          if (Math.max(absDx, absDy) < 30) return; 

          if (absDx > absDy) {
              // Horizontal Swipe
              if (dx > 0) onAction('RIGHT');
              else onAction('LEFT');
          } else {
              // Vertical Swipe
              if (dy > 0) onAction('SLIDE'); // Swipe Down
              else onAction('JUMP'); // Swipe Up
          }
          
          touchStartRef.current = null;
      };

      // Attach to window to capture swipes everywhere
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchend', handleTouchEnd);
      };
  }, [settings.enableSwipe, onAction]);

  // Determine Layout Direction
  const isMirrored = settings.layout === 'MIRRORED';

  return (
    // Updated for better mobile support with safe areas and increased bottom clearance
    // pointer-events-none allows clicks to pass through the empty container space
    <div 
      className={`absolute left-0 right-0 flex justify-between px-2 md:px-6 gap-2 z-20 select-none pointer-events-none ${isMirrored ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      {settings.showButtons && (
        <>
            {/* MOVEMENT CONTROLS (Usually Left Side, Right side if Mirrored) */}
            <div className="flex gap-2 md:gap-4 items-end pointer-events-auto pb-1">
                <button
                className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full active:bg-white/30 active:scale-95 transition-all flex items-center justify-center"
                onPointerDown={handleTouch('LEFT')}
                aria-label="Move Left"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                </button>
                
                <button
                className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full active:bg-white/30 active:scale-95 transition-all flex items-center justify-center"
                onPointerDown={handleTouch('RIGHT')}
                aria-label="Move Right"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                </button>
            </div>

            {/* ACTION BUTTONS (Usually Right Side, Left side if Mirrored) */}
            <div className="flex flex-col gap-2 md:gap-4 items-end pointer-events-auto pb-1">
                <button
                className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500/20 backdrop-blur-md border-2 border-cyan-400 rounded-full active:bg-cyan-500/40 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                onPointerDown={handleTouch('JUMP')}
                aria-label="Jump"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                </button>

                <button
                className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/20 backdrop-blur-md border-2 border-purple-400 rounded-full active:bg-purple-500/40 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                onPointerDown={handleTouch('SLIDE')}
                aria-label="Slide"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </button>
            </div>
        </>
      )}

      {/* CENTER SKILL BUTTON (Always Visible/Centered, but you can toggle it off if needed, usually kept for consistency) */}
      {/* Positioned absolutely relative to screen center */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 pointer-events-auto">
          <button
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center transition-all shadow-xl relative overflow-hidden
              ${isSkillReady 
                  ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95 animate-pulse' 
                  : 'bg-gray-800 border-gray-600 opacity-80'
              }`}
            onPointerDown={(e) => {
                if(isSkillReady) handleTouch('SKILL')(e);
            }}
            disabled={!isSkillReady}
          >
             {/* Cooldown Overlay */}
             {!isSkillReady && (
                 <div 
                    className="absolute inset-0 bg-black/60 origin-center"
                    style={{ 
                        background: `conic-gradient(transparent ${skillProgress * 360}deg, rgba(0,0,0,0.8) 0deg)`
                    }}
                 />
             )}

             {/* Desktop Hint [E] */}
             <div className="hidden md:block absolute top-2 right-3 bg-black/50 border border-white/30 text-[10px] font-mono text-white px-1 rounded leading-none">
                 E
             </div>

             <div className="z-10 flex flex-col items-center">
                <span className="text-xl md:text-2xl">{isSkillReady ? '⚡' : '⏳'}</span>
                <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-tighter">ULTIMATE</span>
             </div>
          </button>
      </div>
    </div>
  );
};

export default Controls;
