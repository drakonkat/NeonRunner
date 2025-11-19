
import React, { useEffect, useState } from 'react';
import { GameStatus, GameState, PowerUpType, PersistentData, NarrativeScenario, Difficulty, Language, LocalizedText } from '../types';
import { LEVELS, COLORS, UPGRADE_CONFIG, LORE_TEXT, INFINITE_SCALING, NARRATIVE_SCENARIOS, GLITCH_MODS, LEVEL_END_LORE, DIFFICULTY_MODS, CHARACTERS, UI_TEXT, CHARACTER_STORIES, MUSIC_TRACKS } from '../constants';

interface UIOverlayProps {
  gameState: GameState;
  persistentData: PersistentData;
  language: Language;
  setLanguage: (lang: Language) => void;
  onStart: () => void;
  onRestart: () => void;
  onOpenStore: () => void;
  onBackToMenu: () => void;
  onBuyUpgrade: (type: PowerUpType) => void;
  onSelectGlitch: (glitchId: string) => void;
  onNextLevel: () => void; 
  onSelectDifficulty: (diff: Difficulty) => void;
  onOpenCharacterSelect: () => void;
  onSelectCharacter: (id: string) => void;
  onPause: () => void;
  onResume: () => void;
  onToggleMute: () => void;
  onSelectAudioTrack: (id: string) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  gameState, 
  persistentData, 
  language,
  setLanguage,
  onStart, 
  onRestart,
  onOpenStore,
  onBackToMenu,
  onBuyUpgrade,
  onSelectGlitch,
  onNextLevel,
  onSelectDifficulty,
  onOpenCharacterSelect,
  onSelectCharacter,
  onPause,
  onResume,
  onToggleMute,
  onSelectAudioTrack
}) => {
  const [activeScenario, setActiveScenario] = useState<NarrativeScenario | null>(null);
  const [chosenFlavor, setChosenFlavor] = useState<string | null>(null);
  const [loreCharacterId, setLoreCharacterId] = useState<string | null>(null); // Track which char story is open
  const [storeTab, setStoreTab] = useState<'UPGRADES' | 'AUDIO'>('UPGRADES');

  // Helper for localization
  const t = (content: LocalizedText | undefined) => {
      if (!content) return "???";
      return content[language === 'IT' ? 'it' : 'en'];
  };
  
  const txt = (key: keyof typeof UI_TEXT) => t(UI_TEXT[key]);

  // Pick a random scenario when entering Level Up Choice
  useEffect(() => {
    if (gameState.status === GameStatus.LEVEL_UP_CHOICE) {
      const randomScenario = NARRATIVE_SCENARIOS[Math.floor(Math.random() * NARRATIVE_SCENARIOS.length)];
      setActiveScenario(randomScenario);
      setChosenFlavor(null);
    }
  }, [gameState.status]);

  const handleAnswer = (glitchId: string, flavor: string) => {
      setChosenFlavor(flavor);
      setTimeout(() => {
          onSelectGlitch(glitchId);
      }, 1500);
  };

  // Calculate dynamic threshold for HUD
  const levelIndex = gameState.level - 1;
  const currentLevelConfig = LEVELS[levelIndex % LEVELS.length];
  
  let nextLevelScore = 0;
  if (levelIndex < LEVELS.length) {
      nextLevelScore = LEVELS[levelIndex].threshold;
  } else {
      const lastDefinedThreshold = LEVELS[LEVELS.length - 1].threshold;
      const extraLevels = levelIndex - LEVELS.length + 1;
      nextLevelScore = lastDefinedThreshold + (extraLevels * INFINITE_SCALING.SCORE_THRESHOLD_INCREMENT);
  }

  // Lore State
  const [showLore, setShowLore] = useState(false);
  
  // Get lore list based on language
  const currentLoreList = language === 'IT' ? LORE_TEXT.it : LORE_TEXT.en;
  const loreIndex = Math.min(gameState.level - 1, currentLoreList.length - 1);
  const activeLore = currentLoreList[loreIndex] || currentLoreList[currentLoreList.length - 1];

  useEffect(() => {
      if (gameState.status === GameStatus.PLAYING) {
          setShowLore(true);
          const timer = setTimeout(() => setShowLore(false), 4000);
          return () => clearTimeout(timer);
      }
  }, [gameState.level, gameState.status]);

  const getUpgradeCost = (type: PowerUpType) => {
    const level = persistentData.upgrades[type] || 0;
    return Math.floor(UPGRADE_CONFIG.BASE_COST * Math.pow(UPGRADE_CONFIG.COST_MULTIPLIER, level));
  };

  const getGlitchInfo = (id: string) => GLITCH_MODS.find(g => g.id === id);

  // --- LORE MODAL ---
  const renderLoreModal = () => {
      if (!loreCharacterId) return null;
      const char = CHARACTERS.find(c => c.id === loreCharacterId);
      const storyData = CHARACTER_STORIES[loreCharacterId];
      if (!char || !storyData) return null;

      const characterProgress = persistentData.characterStageRecords[loreCharacterId] || 1;

      return (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in zoom-in duration-200">
              <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(34,211,238,0.1)] relative flex flex-col">
                  <div className="sticky top-0 bg-slate-900/95 p-4 border-b border-cyan-900 flex justify-between items-center z-10">
                      <h2 className="text-xl font-mono text-cyan-400 font-bold uppercase">{t(storyData.title)}</h2>
                      <button 
                        onClick={() => setLoreCharacterId(null)}
                        className="text-red-400 font-bold hover:text-red-300"
                      >
                          [X] {txt('CLOSE')}
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      {storyData.chapters.map((chapter, idx) => {
                          const isUnlocked = characterProgress >= (idx + 1);
                          const stageReq = idx + 1;
                          return (
                              <div key={idx} className={`border-l-2 pl-4 py-2 ${isUnlocked ? 'border-cyan-500' : 'border-gray-700'}`}>
                                  <div className="text-xs font-bold mb-1 font-mono uppercase tracking-wider" style={{ color: isUnlocked ? char.color : '#555' }}>
                                      Stage {stageReq} {isUnlocked ? ' // DECRYPTED' : ' // ENCRYPTED'}
                                  </div>
                                  {isUnlocked ? (
                                      <p className="text-gray-200 font-mono leading-relaxed text-sm md:text-base">{t(chapter)}</p>
                                  ) : (
                                      <p className="text-gray-600 font-mono text-xs bg-black/30 p-2 rounded">
                                         ⚠ {txt('LOCKED_CHAPTER').replace('{0}', stageReq.toString())} ⚠
                                         <br/>
                                         ██████ ████ █████████ ███ ████
                                      </p>
                                  )}
                              </div>
                          )
                      })}
                  </div>

                  <div className="p-4 border-t border-cyan-900 bg-black/20 text-center">
                      <p className="text-xs text-gray-500 font-mono uppercase">
                          {t(char.name)} Record: Stage {characterProgress}
                      </p>
                  </div>
              </div>
          </div>
      )
  }

  // --- PAUSED SCREEN ---
  if (gameState.status === GameStatus.PAUSED) {
    return (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white p-6 text-center animate-in fade-in duration-200">
        <h2 className="text-5xl font-bold text-cyan-400 mb-8 animate-pulse">{txt('PAUSED')}</h2>
        <div className="space-y-4 w-64">
          <button
            onClick={onResume}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            {txt('RESUME')}
          </button>
          <button
             onClick={onToggleMute}
             className={`w-full py-3 font-bold rounded-xl border ${persistentData.isMuted ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-green-900/50 border-green-500 text-green-200'}`}
          >
             {persistentData.isMuted ? `🔇 ${txt('UNMUTE')}` : `🔊 ${txt('MUTE')}`}
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl"
          >
            {txt('BACK_TO_MENU')}
          </button>
        </div>
      </div>
    );
  }

  // --- LEVEL COMPLETE STORY SCREEN ---
  if (gameState.status === GameStatus.LEVEL_COMPLETE) {
      const finishedLevelIndex = (gameState.level - 2) % LEVEL_END_LORE.length; 
      const safeIndex = finishedLevelIndex < 0 ? 0 : finishedLevelIndex;
      const story = LEVEL_END_LORE[safeIndex];

      return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white p-6 animate-in fade-in duration-500">
            <div className="max-w-2xl w-full border-t-4 border-b-4 border-cyan-500 bg-black/80 backdrop-blur-lg p-8 text-center shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                <h1 className="text-4xl md:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-2">
                    {txt('STAGE_CLEARED')}
                </h1>
                <div className="w-full h-px bg-gray-700 my-6"></div>
                
                <h2 className="text-cyan-500 font-mono font-bold tracking-widest mb-4 text-sm md:text-base uppercase">
                    {txt('SYSTEM_LOG')}: {t(story.title)}
                </h2>
                
                <p className="text-lg md:text-2xl font-medium leading-relaxed text-gray-200 mb-10">
                    "{t(story.text)}"
                </p>

                <button 
                    onClick={onNextLevel}
                    className="px-8 py-4 bg-white text-black font-black text-xl hover:bg-cyan-400 transition-all transform hover:scale-105 rounded-sm uppercase tracking-wider"
                >
                    {txt('PROCEED')}
                </button>
            </div>
        </div>
      );
  }

  // --- ROGUELIKE NARRATIVE CHOICE SCREEN ---
  if (gameState.status === GameStatus.LEVEL_UP_CHOICE && activeScenario) {
    if (chosenFlavor) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black p-4 animate-in zoom-in duration-300">
                <h2 className="text-3xl md:text-5xl font-black text-white text-center italic mb-4 glitch-text">
                    {txt('SYSTEM_UPDATED')}
                </h2>
                 <p className="text-xl md:text-2xl text-cyan-400 font-mono text-center max-w-2xl">
                    {`> ${chosenFlavor}`}
                 </p>
            </div>
        )
    }

    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white p-4 animate-in fade-in duration-300 font-mono">
        <div className="max-w-3xl w-full border-2 border-green-500/50 p-6 md:p-10 rounded-lg bg-black shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,6px_100%]"></div>
            
            <h2 className="text-green-500 text-xs md:text-sm tracking-widest mb-6 uppercase border-b border-green-900 pb-2 z-10 relative">
                {txt('CRITICAL_DECISION')}
            </h2>

            <p className="text-xl md:text-3xl font-bold mb-10 leading-relaxed z-10 relative">
              "{t(activeScenario.question)}"
            </p>

            <div className="grid gap-4 z-10 relative">
                {activeScenario.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(option.glitchId, t(option.flavorResult))}
                        className="text-left p-4 border border-green-800 hover:bg-green-900/30 hover:border-green-400 transition-all group flex items-center gap-4"
                    >
                        <span className="bg-green-900 text-green-300 px-2 py-1 text-xs font-bold group-hover:bg-green-400 group-hover:text-black">
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-300 group-hover:text-white md:text-lg">
                            {t(option.text)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-6 text-right text-[10px] text-green-800">
                ID: {Math.random().toString(36).substring(7).toUpperCase()} // MEMORY_LEAK_DETECTED
            </div>
        </div>
      </div>
    );
  }

  if (gameState.status === GameStatus.STORE) {
    return (
       <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white p-4">
         <div className="w-full max-w-md h-full flex flex-col">
           <div className="flex justify-between items-center mb-4 flex-shrink-0">
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 italic">
               STORE
             </h2>
             <div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-500/30">
               <span className="text-yellow-400 text-xl">●</span>
               <span className="font-mono font-bold text-xl">{persistentData.totalCoins}</span>
             </div>
           </div>

           {/* TABS */}
           <div className="flex gap-2 mb-6">
               <button 
                 onClick={() => setStoreTab('UPGRADES')}
                 className={`flex-1 py-2 font-bold rounded uppercase ${storeTab === 'UPGRADES' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400'}`}
               >
                   {txt('UPGRADES')}
               </button>
               <button 
                 onClick={() => setStoreTab('AUDIO')}
                 className={`flex-1 py-2 font-bold rounded uppercase ${storeTab === 'AUDIO' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-gray-400'}`}
               >
                   {txt('AUDIO')}
               </button>
           </div>

           <div className="space-y-4 mb-8 flex-grow overflow-y-auto">
             {storeTab === 'UPGRADES' && [PowerUpType.SHIELD, PowerUpType.MULTIPLIER, PowerUpType.SPEED].map((type) => {
               const level = persistentData.upgrades[type] || 0;
               const isMax = level >= UPGRADE_CONFIG.MAX_LEVEL;
               const cost = getUpgradeCost(type);
               const canAfford = persistentData.totalCoins >= cost;
               const name = t(UPGRADE_CONFIG.NAMES[type]);

               return (
                 <div key={type} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.POWERUPS[type] }}>
                       <span className="text-xs font-bold text-black">{level}</span>
                     </div>
                     <div>
                       <div className="font-bold text-lg">{name}</div>
                       <div className="text-xs text-gray-400">{txt('BASE_LEVEL')}: {level} / {UPGRADE_CONFIG.MAX_LEVEL}</div>
                     </div>
                   </div>
                   
                   {isMax ? (
                     <span className="text-green-400 font-bold px-4">{txt('MAXED')}</span>
                   ) : (
                     <button 
                       onClick={() => onBuyUpgrade(type)}
                       disabled={!canAfford}
                       className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1 ${
                         canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                       }`}
                     >
                       <span>{cost}</span>
                       <span className="text-[10px]">●</span>
                     </button>
                   )}
                 </div>
               );
             })}

             {storeTab === 'AUDIO' && MUSIC_TRACKS.map((track) => {
                 const isUnlocked = persistentData.unlockedTrackIds.includes(track.id);
                 const isSelected = persistentData.selectedTrackId === track.id;
                 const canAfford = persistentData.totalCoins >= track.cost;

                 return (
                    <div key={track.id} className={`bg-white/5 p-4 rounded-xl border flex items-center justify-between ${isSelected ? 'border-cyan-400 bg-cyan-900/20' : 'border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: track.color }}>
                                <span className="text-xl">🎵</span>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{t(track.name)}</div>
                                <div className="text-xs text-gray-400 font-mono">{track.bpm} BPM</div>
                            </div>
                        </div>

                        {isUnlocked ? (
                             <button 
                                onClick={() => onSelectAudioTrack(track.id)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-600 text-white hover:bg-slate-500'}`}
                             >
                                 {isSelected ? 'ACTIVE' : 'SELECT'}
                             </button>
                        ) : (
                            <button 
                                onClick={() => onSelectAudioTrack(track.id)}
                                disabled={!canAfford}
                                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1 ${
                                canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <span>{track.cost}</span>
                                <span className="text-[10px]">●</span>
                            </button>
                        )}
                    </div>
                 )
             })}
           </div>

           <button
             onClick={onBackToMenu}
             className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors mt-auto"
           >
             {txt('BACK_TO_MENU')}
           </button>
         </div>
       </div>
    );
  }

  // --- CHARACTER SELECTION SCREEN ---
  if (gameState.status === GameStatus.CHARACTER_SELECT) {
      return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white p-4">
            {renderLoreModal()}
            <div className="w-full max-w-5xl h-full flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl md:text-4xl font-black italic text-cyan-400">{txt('SELECT_FIGHTER')}</h2>
                    <div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-500/30">
                        <span className="text-yellow-400 text-lg">●</span>
                        <span className="font-mono font-bold text-lg">{persistentData.totalCoins}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pb-20 flex-grow">
                    {CHARACTERS.map((char) => {
                        const isUnlocked = persistentData.unlockedCharacters.includes(char.id);
                        const isSelected = persistentData.selectedCharacterId === char.id;
                        const canAfford = persistentData.totalCoins >= char.unlockCost;

                        return (
                            <div 
                                key={char.id}
                                onClick={() => {
                                    if (isUnlocked) onSelectCharacter(char.id);
                                    else if (canAfford) onSelectCharacter(char.id); 
                                }}
                                className={`
                                    relative rounded-xl p-4 border-2 transition-all cursor-pointer flex flex-col h-full
                                    ${isSelected ? 'border-cyan-400 bg-cyan-900/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'border-gray-700 bg-slate-800/50 hover:border-gray-500'}
                                    ${!isUnlocked && !canAfford ? 'opacity-50 grayscale' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-16 h-16 rounded-lg shadow-inner border border-white/10 flex items-center justify-center" style={{ backgroundColor: char.color }}>
                                        {/* Simple icon based on shape */}
                                        {char.shape === 'SPHERE' && <div className="w-8 h-8 rounded-full bg-black/30"></div>}
                                        {char.shape === 'BOX' && <div className="w-8 h-8 bg-black/30"></div>}
                                        {char.shape === 'TETRA' && <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-black/30"></div>}
                                    </div>
                                    {isSelected && <div className="bg-cyan-500 text-black text-[10px] font-bold px-2 py-1 rounded">SELECTED</div>}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white mb-1">{t(char.name)}</h3>
                                    {/* LORE BUTTON */}
                                    {isUnlocked && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLoreCharacterId(char.id);
                                            }}
                                            className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded border border-gray-500 font-mono"
                                        >
                                            📖 {txt('READ_LORE')}
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400 mb-2 italic leading-relaxed flex-grow">{t(char.description)}</p>
                                
                                {/* Skill Info Block */}
                                <div className="mt-2 text-xs bg-black/40 p-2 rounded border border-cyan-500/20">
                                    <div className="font-bold text-cyan-300 uppercase mb-1 flex justify-between">
                                        <span>★ {t(char.skillName)}</span>
                                        <span>{char.skillCooldown}s CD</span>
                                    </div>
                                    <p className="text-gray-500">{t(char.skillDescription)}</p>
                                </div>

                                {!isUnlocked ? (
                                    <button 
                                        className={`w-full py-2 rounded font-bold text-sm mt-4 ${canAfford ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-600 text-gray-400'}`}
                                    >
                                        {txt('UNLOCK')} {char.unlockCost} ●
                                    </button>
                                ) : (
                                    <div className="text-center text-xs text-green-400 font-mono mt-4 uppercase tracking-widest">
                                        {isSelected ? txt('READY') : txt('CLICK_TO_SELECT')}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                 
                 <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-center">
                    <button
                        onClick={onBackToMenu}
                        className="w-full max-w-md py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                    >
                        {txt('BACK_TO_MENU')}
                    </button>
                 </div>
            </div>
        </div>
      )
  }

  if (gameState.status === GameStatus.IDLE) {
    return (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white p-6 text-center">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 italic">
          NEON RUNNER
        </h1>
        <h2 className="text-2xl font-bold text-pink-500 italic mb-4 rotate-[-2deg]">CHAOS EDITION</h2>
        <p className="text-gray-300 mb-6 text-lg">{txt('SUBTITLE')} <span className="text-red-400 font-bold">GLITCH.</span></p>
        
        {/* LANGUAGE SWITCHER */}
        <div className="absolute top-6 right-6 flex gap-2">
            <button 
                onClick={() => setLanguage('EN')} 
                className={`px-3 py-1 font-bold rounded border border-white/30 ${language === 'EN' ? 'bg-cyan-500 text-black' : 'bg-black text-gray-400'}`}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('IT')} 
                className={`px-3 py-1 font-bold rounded border border-white/30 ${language === 'IT' ? 'bg-cyan-500 text-black' : 'bg-black text-gray-400'}`}
            >
                IT
            </button>
            <button 
                onClick={onToggleMute}
                className={`px-3 py-1 font-bold rounded border border-white/30 ${!persistentData.isMuted ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
                title={persistentData.isMuted ? "Unmute" : "Mute"}
            >
                {persistentData.isMuted ? "🔇" : "🔊"}
            </button>
        </div>

        <div className="mb-6 bg-white/10 px-6 py-2 rounded-full flex items-center gap-2">
           <span className="text-xs text-gray-400 uppercase">{txt('HIGH_SCORE')}</span>
           <span className="font-mono font-bold text-xl text-cyan-400">{persistentData.highScore}</span>
        </div>

        {/* DIFFICULTY SELECTOR */}
        <div className="mb-6 w-full max-w-sm">
          <div className="text-xs text-gray-500 mb-2 font-mono tracking-widest">{txt('SELECT_DIFFICULTY')}</div>
          <div className="flex gap-2">
            {(Object.keys(DIFFICULTY_MODS) as Difficulty[]).map((key) => {
               const conf = DIFFICULTY_MODS[key];
               const isSelected = gameState.difficulty === key;
               return (
                  <button
                    key={key}
                    onClick={() => onSelectDifficulty(key)}
                    className={`flex-1 py-2 text-xs md:text-sm font-bold border rounded transition-all uppercase ${
                        isSelected 
                        ? `bg-[${conf.color}] text-black border-[${conf.color}] shadow-[0_0_15px_${conf.color}] scale-105`
                        : 'bg-transparent text-gray-500 border-gray-700 hover:border-white/50'
                    }`}
                    style={{ 
                        backgroundColor: isSelected ? conf.color : 'transparent',
                        color: isSelected ? 'black' : '#6b7280',
                        borderColor: isSelected ? conf.color : '#374151'
                    }}
                  >
                    {t(conf.label)}
                  </button>
               )
            })}
          </div>
        </div>

        <div className="space-y-4 w-64">
          <button
            onClick={onStart}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            {txt('START_RUN')}
          </button>

           {/* CHARACTER BUTTON */}
           <button
            onClick={onOpenCharacterSelect}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-lg transition-all border border-pink-400/50 flex items-center justify-center gap-2"
          >
            <span>{txt('CHARACTERS')}</span>
            <span className="text-xs bg-black/30 px-2 py-1 rounded">
                {persistentData.selectedCharacterId === 'DEFAULT' ? 'NEON' : 'CUSTOM'}
            </span>
          </button>
          
          <button
            onClick={onOpenStore}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-lg transition-all border border-purple-400/50"
          >
            {txt('UPGRADES')} ({persistentData.totalCoins} ●)
          </button>
        </div>
      </div>
    );
  }

  if (gameState.status === GameStatus.GAME_OVER) {
    return (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white p-6 text-center">
        <h2 className="text-5xl font-bold text-red-500 mb-4">{txt('CRITICAL_FAILURE')}</h2>
        <div className="bg-white/10 p-6 rounded-2xl mb-8 w-72">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">{txt('SCORE')}</span>
            <span className="font-mono font-bold text-xl text-white">{gameState.score}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">DIFFICULTY</span>
            <span className="font-mono font-bold text-xs text-white" style={{ color: DIFFICULTY_MODS[gameState.difficulty].color }}>
                {t(DIFFICULTY_MODS[gameState.difficulty].label)}
            </span>
          </div>

          <div className="w-full h-px bg-gray-600 my-4"></div>

          <div className="text-left mb-4">
             <span className="text-xs text-gray-400 uppercase mb-1 block">{txt('ACTIVE_GLITCHES')}</span>
             <div className="flex flex-wrap gap-1">
                 {gameState.activeGlitches.length === 0 ? <span className="text-gray-600 text-xs italic">{txt('NONE')}</span> :
                   gameState.activeGlitches.map(g => {
                       const info = getGlitchInfo(g);
                       return <span key={g} className="text-[10px] px-2 py-1 bg-red-500/20 border border-red-500 rounded text-red-300" title={t(info?.description)}>{info?.icon} {t(info?.title)}</span>
                   })
                 }
             </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-600">
             <span className="text-sm text-gray-400">{txt('TOTAL_WALLET')}</span>
             <div className="flex items-center gap-1 text-yellow-500 font-bold">
               <span>{persistentData.totalCoins}</span>
               <span className="text-xs">●</span>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg"
          >
            MENU
          </button>
          <button
            onClick={onOpenStore}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
          >
            STORE
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {txt('REBOOT')}
          </button>
        </div>
      </div>
    );
  }

  // HUD
  return (
    <>
        {/* Lore Display */}
        <div 
            className={`absolute top-24 left-0 right-0 flex justify-center pointer-events-none z-20 transition-opacity duration-1000 ${showLore ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="bg-black/60 backdrop-blur border border-white/10 px-6 py-3 rounded-full">
                <p className="text-cyan-300 font-mono font-bold text-sm md:text-base tracking-wider flex items-center gap-2">
                    <span className="animate-pulse">▋</span>
                    {activeLore}
                </p>
            </div>
        </div>

        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-20 pointer-events-none select-none">
        {/* Score & Coin Panel */}
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
            <div className="text-4xl font-black text-white italic drop-shadow-md font-mono leading-none">
                {gameState.score.toString().padStart(5, '0')}
            </div>
            <div className="text-xs text-cyan-300 font-bold uppercase tracking-widest">{txt('SCORE')}</div>
            </div>
            
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded-full self-start border border-white/10">
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
            <span className="font-mono font-bold text-yellow-100">{gameState.coinsCollected}</span>
            </div>

            {/* Glitch List Mini */}
            <div className="mt-2 flex flex-col gap-1 opacity-80">
                 <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                     {t(DIFFICULTY_MODS[gameState.difficulty].label)}
                 </div>
                {gameState.activeGlitches.map((g, i) => (
                    <span key={i} className="text-[10px] font-bold text-red-400 bg-black/50 px-2 rounded self-start border-l-2 border-red-500">
                        {g}
                    </span>
                ))}
            </div>
        </div>

        {/* Power Up Indicator */}
        {gameState.activePowerUp !== PowerUpType.NONE && (
            <div className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div 
                className="px-4 py-1 rounded-full text-black font-bold uppercase text-sm mb-1 shadow-lg"
                style={{ backgroundColor: COLORS.POWERUPS[gameState.activePowerUp] }}
            >
                {gameState.activePowerUp}
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden border border-white/20">
                <div 
                className="h-full transition-all duration-100 linear"
                style={{ 
                    width: `${gameState.powerUpTimeLeft}%`,
                    backgroundColor: COLORS.POWERUPS[gameState.activePowerUp]
                }}
                />
            </div>
            </div>
        )}

        {/* Level Panel & Pause Button */}
        <div className="flex flex-col items-end">
             {gameState.status === GameStatus.PLAYING && (
              <button 
                onClick={onPause} 
                className="p-2 bg-white/10 backdrop-blur-md rounded-full mb-4 pointer-events-auto active:bg-white/30 transition-colors" 
                aria-label="Pause Game"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-white italic">
                {gameState.level > 3 ? `ZONE ${gameState.level}` : `LVL ${gameState.level}`}
            </div>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: currentLevelConfig.color }}></div>
            </div>
            
            <div className="w-32 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden border border-white/10">
                <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (gameState.score / nextLevelScore) * 100)}%` }}
                />
            </div>
            
            {/* Current Track Info (Fade in/out usually, simplified here) */}
            {!persistentData.isMuted && (
                <div className="mt-2 text-[10px] text-cyan-500/80 font-mono text-right">
                    ♪ {t(MUSIC_TRACKS.find(t => t.id === persistentData.selectedTrackId)?.name)}
                </div>
            )}
        </div>
        </div>
    </>
  );
};

export default UIOverlay;
