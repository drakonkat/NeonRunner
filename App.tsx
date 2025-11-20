
import React, { useState, useRef, useEffect, useCallback } from 'react';
import GameCanvas, { GameCanvasHandle } from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import Controls from './components/Controls';
import { GameStatus, GameState, GameAction, PowerUpType, PersistentData, GlitchType, Difficulty, Language, ControlSettings } from './types';
import { LEVELS, UPGRADE_CONFIG, INFINITE_SCALING, CHARACTERS, MUSIC_TRACKS } from './constants';
import { audioManager } from './audioManager';

const App: React.FC = () => {
  const gameRef = useRef<GameCanvasHandle>(null);
  
  // Persistent State with Lazy Initialization for 1000 Coins start
  const [persistentData, setPersistentData] = useState<PersistentData>(() => {
    const saved = localStorage.getItem('neonRunnerSave');
    const defaultData: PersistentData = {
      totalCoins: 1000, // Start with 1000 coins
      highScore: 0,
      maxStageReached: 1,
      characterStageRecords: { 'DEFAULT': 1 }, // Default char starts at 1
      upgrades: {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.MULTIPLIER]: 0,
        [PowerUpType.SPEED]: 0
      },
      selectedCharacterId: 'DEFAULT',
      unlockedCharacters: ['DEFAULT'],
      isMuted: false,
      selectedTrackId: 'THE_GRID',
      unlockedTrackIds: ['THE_GRID'],
      controlSettings: {
          enableSwipe: true,
          showButtons: true,
          layout: 'STANDARD'
      }
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved data with default structure to ensure new fields exist
        return {
          ...defaultData,
          ...parsed,
          unlockedCharacters: parsed.unlockedCharacters || ['DEFAULT'],
          selectedCharacterId: parsed.selectedCharacterId || 'DEFAULT',
          totalCoins: parsed.totalCoins !== undefined ? parsed.totalCoins : 1000,
          maxStageReached: parsed.maxStageReached || 1,
          characterStageRecords: parsed.characterStageRecords || { 'DEFAULT': parsed.maxStageReached || 1 },
          // Audio Migration
          isMuted: parsed.isMuted !== undefined ? parsed.isMuted : false,
          selectedTrackId: parsed.selectedTrackId || 'THE_GRID',
          unlockedTrackIds: parsed.unlockedTrackIds || ['THE_GRID'],
          controlSettings: parsed.controlSettings || defaultData.controlSettings
        };
      } catch (e) {
        console.error("Failed to load save", e);
        return defaultData;
      }
    }
    return defaultData;
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
      const browserLang = navigator.language.toUpperCase();
      if (browserLang.includes('IT')) return 'IT';
      return 'EN';
  });

  // Auto-save whenever persistentData changes
  useEffect(() => {
    localStorage.setItem('neonRunnerSave', JSON.stringify(persistentData));
  }, [persistentData]);

  // SYNC AUDIO MANAGER
  useEffect(() => {
    audioManager.setMute(persistentData.isMuted);
    audioManager.setTrack(persistentData.selectedTrackId);
  }, [persistentData.isMuted, persistentData.selectedTrackId]);

  // Audio Life Cycle
  useEffect(() => {
    // Init audio on first interaction/load
    const handleInteraction = () => {
      audioManager.initialize();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      audioManager.stop();
    }
  }, []);


  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.IDLE,
    score: 0,
    coinsCollected: 0,
    level: 1,
    activePowerUp: PowerUpType.NONE,
    powerUpTimeLeft: 0,
    activeGlitches: [],
    difficulty: 'CYBER_PUNK' // Default Normal
  });

  const [skillState, setSkillState] = useState<{ current: number, max: number }>({ current: 0, max: 1 });

  const handlePause = useCallback(() => {
    if (gameState.status === GameStatus.PLAYING) {
      setGameState(prev => ({ ...prev, status: GameStatus.PAUSED }));
      audioManager.stop(); // Stop music on pause
    }
  }, [gameState.status]);

  const handleResume = useCallback(() => {
    if (gameState.status === GameStatus.PAUSED) {
      setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
      audioManager.play(); // Resume music
    }
  }, [gameState.status]);

  const handleBackToMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: GameStatus.IDLE,
      score: 0,
      coinsCollected: 0,
      level: 1,
      activePowerUp: PowerUpType.NONE,
      powerUpTimeLeft: 0,
      activeGlitches: []
    }));
    gameRef.current?.resetGame();
    audioManager.stop(); // Stop music in menu (or keep playing if you prefer menu music)
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: GameStatus.PLAYING,
      score: 0,
      coinsCollected: 0,
      level: 1,
      activePowerUp: PowerUpType.NONE,
      powerUpTimeLeft: 0,
      activeGlitches: [] // Reset glitches on new run
    }));
    setSkillState({ current: 0, max: 1 });
    gameRef.current?.resetGame();
    audioManager.play(); // Start music
  }, []);

  // Transition from Level Complete (Lore) -> Roguelike Choice
  const handleNextLevelAck = useCallback(() => {
      setGameState(prev => ({
          ...prev,
          status: GameStatus.LEVEL_UP_CHOICE
      }));
  }, []);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // GLOBAL MENU SHORTCUTS
      if (e.key === 'Enter') {
          if (gameState.status === GameStatus.GAME_OVER) {
              startGame();
              return;
          }
          if (gameState.status === GameStatus.LEVEL_COMPLETE) {
              handleNextLevelAck();
              return;
          }
          if (gameState.status === GameStatus.PAUSED) {
              handleResume();
              return;
          }
      }

      if (e.key === 'Escape' || e.key === 'p') {
        if (gameState.status === GameStatus.PLAYING) {
          handlePause();
        } else if (gameState.status === GameStatus.PAUSED) {
          handleResume();
        }
        return;
      }

      if (gameState.status !== GameStatus.PLAYING) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          gameRef.current?.performAction('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          gameRef.current?.performAction('RIGHT');
          break;
        case 'ArrowUp':
        case 'w':
        case ' ':
          gameRef.current?.performAction('JUMP');
          break;
        case 'ArrowDown':
        case 's':
          gameRef.current?.performAction('SLIDE');
          break;
        case 'Shift':
        case 'e':
          gameRef.current?.performAction('SKILL');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, handlePause, handleResume, startGame, handleNextLevelAck]);

  const openStore = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.STORE }));
  };

  const openCharacterSelect = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.CHARACTER_SELECT }));
  };

  const handleSelectCharacter = (id: string) => {
     const char = CHARACTERS.find(c => c.id === id);
     if (!char) return;

     const isUnlocked = persistentData.unlockedCharacters.includes(id);
     
     if (isUnlocked) {
         setPersistentData(prev => ({ ...prev, selectedCharacterId: id }));
     } else {
         // Try to buy
         if (persistentData.totalCoins >= char.unlockCost) {
             setPersistentData(prev => ({
                 ...prev,
                 totalCoins: prev.totalCoins - char.unlockCost,
                 unlockedCharacters: [...prev.unlockedCharacters, id],
                 selectedCharacterId: id
             }));
         }
     }
  };

  const handleSetDifficulty = (diff: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty: diff }));
  };

  const handleToggleMute = () => {
      setPersistentData(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleSelectAudioTrack = (id: string) => {
      const track = MUSIC_TRACKS.find(t => t.id === id);
      if (!track) return;
      
      const isUnlocked = persistentData.unlockedTrackIds.includes(id);

      if (isUnlocked) {
          setPersistentData(prev => ({ ...prev, selectedTrackId: id }));
      } else {
          // Buy logic
          if (persistentData.totalCoins >= track.cost) {
              setPersistentData(prev => ({
                  ...prev,
                  totalCoins: prev.totalCoins - track.cost,
                  unlockedTrackIds: [...prev.unlockedTrackIds, id],
                  selectedTrackId: id
              }));
          }
      }
  };

  const handleUpdateSettings = (newSettings: ControlSettings) => {
      setPersistentData(prev => ({
          ...prev,
          controlSettings: newSettings
      }));
  };

  const buyUpgrade = (type: PowerUpType) => {
    const currentLevel = persistentData.upgrades[type] || 0;
    if (currentLevel >= UPGRADE_CONFIG.MAX_LEVEL) return;

    const cost = Math.floor(UPGRADE_CONFIG.BASE_COST * Math.pow(UPGRADE_CONFIG.COST_MULTIPLIER, currentLevel));
    
    if (persistentData.totalCoins >= cost) {
      setPersistentData(prev => ({
        ...prev,
        totalCoins: prev.totalCoins - cost,
        upgrades: { ...prev.upgrades, [type]: currentLevel + 1 }
      }));
    }
  };

  const handleScoreUpdate = useCallback((newScore: number, coins: number) => {
    setGameState(prev => {
      const currentLvlIndex = prev.level - 1;
      let threshold = 0;

      if (currentLvlIndex < LEVELS.length) {
        threshold = LEVELS[currentLvlIndex].threshold;
      } else {
        const lastDefinedThreshold = LEVELS[LEVELS.length - 1].threshold;
        const extraLevels = prev.level - LEVELS.length;
        threshold = lastDefinedThreshold + (extraLevels * INFINITE_SCALING.SCORE_THRESHOLD_INCREMENT);
      }
      
      // FINITE STAGE LOGIC:
      // If score >= threshold, we finish the stage.
      if (newScore >= threshold && prev.status === GameStatus.PLAYING) {
         const nextLevel = prev.level + 1;
         
         // Update character specific record and global record
         setPersistentData(curr => {
             const charId = curr.selectedCharacterId;
             const currentRecord = curr.characterStageRecords[charId] || 1;
             let newRecords = { ...curr.characterStageRecords };
             
             let globalMax = curr.maxStageReached;

             // Only update if we exceeded the previous record for THIS character
             if (nextLevel > currentRecord) {
                 newRecords[charId] = nextLevel;
             }
             
             if (nextLevel > globalMax) {
                 globalMax = nextLevel;
             }

             return { 
                 ...curr, 
                 maxStageReached: globalMax,
                 characterStageRecords: newRecords
             };
         });
         
         audioManager.stop(); // Silence during story

         return {
           ...prev,
           score: newScore,
           coinsCollected: coins,
           level: nextLevel,
           status: GameStatus.LEVEL_COMPLETE
         };
      }

      return {
        ...prev,
        score: newScore,
        coinsCollected: coins
      };
    });
  }, []);

  const handleSkillUpdate = useCallback((current: number, max: number) => {
      setSkillState({ current, max });
  }, []);

  // Transition from Choice -> Playing
  const handleSelectGlitch = useCallback((glitchId: string) => {
     setGameState(prev => ({
         ...prev,
         status: GameStatus.PLAYING,
         activeGlitches: [...prev.activeGlitches, glitchId as GlitchType]
     }));
     audioManager.play(); // Resume music on next stage
  }, []);

  const handleCollision = useCallback(() => {
    setGameState(prev => {
      // Only process if we were playing
      if (prev.status !== GameStatus.PLAYING && prev.status !== GameStatus.LEVEL_COMPLETE) return prev;

      setPersistentData(current => ({
        ...current,
        totalCoins: current.totalCoins + prev.coinsCollected,
        highScore: Math.max(prev.score, current.highScore)
      }));

      audioManager.stop();

      return {
        ...prev,
        status: GameStatus.GAME_OVER,
        activePowerUp: PowerUpType.NONE
      };
    });
  }, []);

  const handlePowerUpChange = useCallback((type: PowerUpType, progress: number) => {
    setGameState(prev => ({
      ...prev,
      activePowerUp: type,
      powerUpTimeLeft: progress
    }));
  }, []);

  const handleControlAction = (action: GameAction) => {
    gameRef.current?.performAction(action);
  };

  const skillProgressUI = skillState.max > 0 ? 1 - (skillState.current / skillState.max) : 1;

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-black relative">
      <GameCanvas
        ref={gameRef}
        status={gameState.status}
        levelIndex={gameState.level - 1}
        upgradeLevels={persistentData.upgrades}
        activeGlitches={gameState.activeGlitches}
        difficulty={gameState.difficulty}
        selectedCharacterId={persistentData.selectedCharacterId}
        onScoreUpdate={handleScoreUpdate}
        onCollision={handleCollision}
        onPowerUpChange={handlePowerUpChange}
        onSkillUpdate={handleSkillUpdate}
      />

      <UIOverlay
        gameState={gameState}
        persistentData={persistentData}
        language={language}
        setLanguage={setLanguage}
        onStart={startGame}
        onRestart={startGame}
        onOpenStore={openStore}
        onBuyUpgrade={buyUpgrade}
        onSelectGlitch={handleSelectGlitch}
        onNextLevel={handleNextLevelAck}
        onSelectDifficulty={handleSetDifficulty}
        onOpenCharacterSelect={openCharacterSelect}
        onSelectCharacter={handleSelectCharacter}
        onPause={handlePause}
        onResume={handleResume}
        onBackToMenu={handleBackToMenu}
        onToggleMute={handleToggleMute}
        onSelectAudioTrack={handleSelectAudioTrack}
        onUpdateSettings={handleUpdateSettings}
      />

      {gameState.status === GameStatus.PLAYING && (
        <Controls 
            onAction={handleControlAction} 
            skillProgress={skillProgressUI}
            isSkillReady={skillState.current <= 0}
            settings={persistentData.controlSettings}
        />
      )}
    </div>
  );
};

export default App;
