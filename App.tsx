
import React, { useState, useRef, useEffect, useCallback } from 'react';
import GameCanvas, { GameCanvasHandle } from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import Controls from './components/Controls';
import { GameStatus, GameState, GameAction, PowerUpType, PersistentData, GlitchType, Difficulty } from './types';
import { LEVELS, UPGRADE_CONFIG, INFINITE_SCALING, CHARACTERS } from './constants';

const App: React.FC = () => {
  const gameRef = useRef<GameCanvasHandle>(null);
  
  // Persistent State with Lazy Initialization for 1000 Coins start
  const [persistentData, setPersistentData] = useState<PersistentData>(() => {
    const saved = localStorage.getItem('neonRunnerSave');
    const defaultData: PersistentData = {
      totalCoins: 1000, // Start with 1000 coins
      highScore: 0,
      upgrades: {
        [PowerUpType.SHIELD]: 0,
        [PowerUpType.MULTIPLIER]: 0,
        [PowerUpType.SPEED]: 0
      },
      selectedCharacterId: 'DEFAULT',
      unlockedCharacters: ['DEFAULT']
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved data with default structure to ensure new fields exist
        return {
          ...defaultData,
          ...parsed,
          // Ensure unlocking array exists if loading old save
          unlockedCharacters: parsed.unlockedCharacters || ['DEFAULT'],
          selectedCharacterId: parsed.selectedCharacterId || 'DEFAULT',
          // If totalCoins is missing/0 in old save, give 1000? No, respect save, 
          // but if it's undefined, default to 1000.
          totalCoins: parsed.totalCoins !== undefined ? parsed.totalCoins : 1000
        };
      } catch (e) {
        console.error("Failed to load save", e);
        return defaultData;
      }
    }
    return defaultData;
  });

  // Auto-save whenever persistentData changes
  useEffect(() => {
    localStorage.setItem('neonRunnerSave', JSON.stringify(persistentData));
  }, [persistentData]);

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
    }
  }, [gameState.status]);

  const handleResume = useCallback(() => {
    if (gameState.status === GameStatus.PAUSED) {
      setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
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
  }, []);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [gameState.status, handlePause, handleResume]);

  const startGame = () => {
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
  };

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

  // Transition from Level Complete (Lore) -> Roguelike Choice
  const handleNextLevelAck = () => {
      setGameState(prev => ({
          ...prev,
          status: GameStatus.LEVEL_UP_CHOICE
      }));
  };

  // Transition from Choice -> Playing
  const handleSelectGlitch = (glitchId: string) => {
     setGameState(prev => ({
         ...prev,
         status: GameStatus.PLAYING,
         activeGlitches: [...prev.activeGlitches, glitchId as GlitchType]
     }));
  };

  const handleCollision = useCallback(() => {
    setGameState(prev => {
      // Only process if we were playing
      if (prev.status !== GameStatus.PLAYING && prev.status !== GameStatus.LEVEL_COMPLETE) return prev;

      setPersistentData(current => ({
        ...current,
        totalCoins: current.totalCoins + prev.coinsCollected,
        highScore: Math.max(prev.score, current.highScore)
      }));

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
    <div className="w-full h-screen overflow-hidden bg-black relative">
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
      />

      {gameState.status === GameStatus.PLAYING && (
        <Controls 
            onAction={handleControlAction} 
            skillProgress={skillProgressUI}
            isSkillReady={skillState.current <= 0}
        />
      )}
    </div>
  );
};

export default App;