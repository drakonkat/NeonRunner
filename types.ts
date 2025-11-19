
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  STORE = 'STORE',
  CHARACTER_SELECT = 'CHARACTER_SELECT', 
  LEVEL_UP_CHOICE = 'LEVEL_UP_CHOICE'
}

export enum Lane {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1
}

export type Language = 'EN' | 'IT';

export interface LocalizedText {
  en: string;
  it: string;
}

export type Difficulty = 'SCRIPT_KIDDIE' | 'CYBER_PUNK' | 'NET_RUNNER';

export enum PowerUpType {
  NONE = 'NONE',
  SHIELD = 'SHIELD',
  MULTIPLIER = 'MULTIPLIER', 
  SPEED = 'SPEED' 
}

export type GlitchType = 
  | 'GIANT' 
  | 'TINY' 
  | 'MOON_GRAVITY' 
  | 'HEAVY_METAL' 
  | 'DRUNK_CAM' 
  | 'WIDE_LENS' 
  | 'DISCO' 
  | 'SPEED_DEMON'
  | 'INVERTED_COLORS'
  | 'PIXEL_HELL'    
  | 'WIRE_FRAME'    
  | 'AUSTRALIA_MODE' 
  | 'EARTHQUAKE';   

export interface GlitchMod {
  id: GlitchType;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY' | 'CURSED';
}

export type SkillType = 'DASH' | 'BLAST' | 'CLONE' | 'MAGNET' | 'SLOW_MO' | 'ALCHEMY';

export interface Character {
  id: string;
  name: LocalizedText;
  description: LocalizedText; 
  color: string;
  emissive: string;
  shape: 'BOX' | 'SPHERE' | 'TETRA'; 
  unlockCost: number;
  skillId: SkillType;
  skillName: LocalizedText;
  skillDescription: LocalizedText; 
  skillCooldown: number; // in seconds
  skillDuration?: number; // in seconds (if applicable)
}

export interface AudioTrack {
  id: string;
  name: LocalizedText;
  bpm: number;
  cost: number;
  color: string;
}

export interface NarrativeOption {
  text: LocalizedText;
  glitchId: GlitchType;
  flavorResult: LocalizedText;
}

export interface NarrativeScenario {
  id: string;
  question: LocalizedText;
  options: NarrativeOption[];
}

export interface UpgradeLevels {
  [PowerUpType.SHIELD]: number;
  [PowerUpType.MULTIPLIER]: number;
  [PowerUpType.SPEED]: number;
}

export interface PersistentData {
  totalCoins: number;
  highScore: number;
  maxStageReached: number; 
  characterStageRecords: Record<string, number>; 
  upgrades: UpgradeLevels;
  selectedCharacterId: string; 
  unlockedCharacters: string[];
  // Audio Settings
  isMuted: boolean;
  selectedTrackId: string;
  unlockedTrackIds: string[];
}

export interface GameState {
  status: GameStatus;
  score: number;
  coinsCollected: number;
  level: number;
  activePowerUp: PowerUpType;
  powerUpTimeLeft: number;
  activeGlitches: GlitchType[]; 
  difficulty: Difficulty;
}

export interface LevelConfig {
  id: number;
  speed: number;
  obstacleDensity: number; 
  color: string; 
  groundColor: string;
  threshold: number; 
}

export type GameAction = 'LEFT' | 'RIGHT' | 'JUMP' | 'SLIDE' | 'SKILL';
