
import React from 'react';
import { GameAction } from '../types';

interface ControlsProps {
  onAction: (action: GameAction) => void;
  skillProgress: number; // 0 to 1 (1 is full ready)
  isSkillReady: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onAction, skillProgress, isSkillReady }) => {
  // Prevent default behavior to stop zooming/scrolling on double tap
  const handleTouch = (action: GameAction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction(action);
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-between px-6 gap-4 z-20 select-none">
      {/* LEFT / RIGHT */}
      <div className="flex gap-4 items-end">
        <button
          className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full active:bg-white/30 active:scale-95 transition-all flex items-center justify-center"
          onPointerDown={handleTouch('LEFT')}
          aria-label="Move Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button
          className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full active:bg-white/30 active:scale-95 transition-all flex items-center justify-center"
          onPointerDown={handleTouch('RIGHT')}
          aria-label="Move Right"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* CENTER SKILL BUTTON */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4">
          <button
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all shadow-xl relative overflow-hidden
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

             <div className="z-10 flex flex-col items-center">
                <span className="text-2xl">{isSkillReady ? '⚡' : '⏳'}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">ULTIMATE</span>
             </div>
          </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-4 items-end">
        <button
          className="w-20 h-20 bg-cyan-500/20 backdrop-blur-md border-2 border-cyan-400 rounded-full active:bg-cyan-500/40 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          onPointerDown={handleTouch('JUMP')}
          aria-label="Jump"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>

        <button
          className="w-20 h-20 bg-purple-500/20 backdrop-blur-md border-2 border-purple-400 rounded-full active:bg-purple-500/40 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          onPointerDown={handleTouch('SLIDE')}
          aria-label="Slide"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
           </svg>
        </button>
      </div>
    </div>
  );
};

export default Controls;
