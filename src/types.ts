export type RelationshipStage = 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'romance' | 'partner';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';
export type GamePhase = 'title' | 'wakeup' | 'location_select' | 'encounter' | 'dialogue' | 'choice' | 'gift_give' | 'flirt' | 'secret_scenes' | 'conversation' | 'event' | 'day_end' | 'menu' | 'date' | 'minigame' | 'text_message';
export type Mood = 'neutral' | 'happy' | 'shy' | 'flustered' | 'love' | 'angry' | 'sad' | 'surprised' | 'smirk' | 'thinking' | 'soft' | 'vulnerable' | 'warm' | 'caring' | 'excited' | 'serious' | 'intense' | 'teasing' | 'possessive' | 'obsessive';

export interface CharacterPsyche {
  alterEgo: string;
  secretDesire: string;
  obsession: string;
  trigger: string;
  hiddenSide: string;
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'casual' | 'formal' | 'cosplay' | 'lingerie' | 'fantasy';
  emoji: string;
  affectionBonus: number;
  tensionBonus: number;
  characterPreference?: string[];
}

export interface Character {
  id: string;
  name: string;
  fullName: string;
  age: number;
  grade: string;
  personality: string;
  description: string;
  avatar: string;
  portrait?: string;
  color: string;
  bgColor: string;
  likedGifts: string[];
  dislikedGifts: string[];
  neutralGifts: string[];
  stats: { academics: number; athletics: number; charm: number; creativity: number };
  locations: string[];
  goals: { affectionThreshold: number; description: string; reward: string }[];
  dialogue: Record<RelationshipStage, string[]>;
  flirtResponses: {
    smooth: string[];
    cheesy: string[];
    bold: string[];
    sweet: string[];
  };
  textMessages: Record<RelationshipStage, string[]>;
  psyche: CharacterPsyche;
  outfitPreferences: string[];
  roleplayScenes: string[];
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  affectionBonus: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  emoji: string;
  availableTimes: TimeOfDay[];
  charactersPresent: string[];
  bgImage?: string;
  bgGradient: string;
  weatherEffects?: boolean;
}

export interface DialogueLine {
  speaker: string | null;
  text: string;
  expression?: Mood;
  characterId?: string;
  effect?: 'shake' | 'flash' | 'heartbeat' | 'sparkle';
}

export interface ChoiceOption {
  text: string;
  emoji?: string;
  affectionChange?: number;
  statBoost?: { stat: string; amount: number };
  type?: 'normal' | 'flirt' | 'bold' | 'special';
  successRate?: number;
  failText?: string;
  successText?: string;
}

export interface FlirtOption {
  type: 'smooth' | 'cheesy' | 'bold' | 'sweet';
  text: string;
  emoji: string;
  charmRequired: number;
  baseBonus: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  characterId?: string;
  choices: { text: string; effect: () => void }[];
  condition?: (state: any) => boolean;
}

export interface PlayerStats {
  academics: number;
  athletics: number;
  charm: number;
  creativity: number;
}

export interface RelationshipProgress {
  affection: number;
  stage: RelationshipStage;
  giftsGiven: number;
  conversationsHad: number;
  lastGift: string | null;
  unlockedScenes: string[];
  goalsCompleted: number[];
  met: boolean;
  flirtCount: number;
  datesHad: number;
  lastTextMessage: string | null;
  tension: number; // 0-100 romantic tension meter
  lastMood?: Mood; // Track character's last mood
}

export interface GameState {
  phase: GamePhase;
  day: number;
  timeOfDay: TimeOfDay;
  weather: Weather;
  allowance: number;
  dailyAllowance: number;
  playerStats: PlayerStats;
  relationships: Record<string, RelationshipProgress>;
  inventory: { giftId: string; quantity: number }[];
  currentLocation: string | null;
  currentCharacter: string | null;
  currentDialogue: DialogueLine[];
  currentDialogueIndex: number;
  currentChoices: ChoiceOption[];
  notifications: string[];
  scenesCompleted: string[];
  actionsToday: number;
  maxActionsPerDay: number;
  totalFlirts: number;
  eventsTriggered: string[];
  mood: Mood;
  unlockedScenes: string[]; // Global unlocked scenes
  flags: string[]; // Game flags for tracking story progress
}

export const STAGE_THRESHOLDS: Record<RelationshipStage, number> = {
  stranger: 0, acquaintance: 10, friend: 30, close_friend: 55, romance: 75, partner: 95,
};

export const STAGE_COLORS: Record<RelationshipStage, string> = {
  stranger: '#9ca3af', acquaintance: '#60a5fa', friend: '#4ade80',
  close_friend: '#facc15', romance: '#f472b6', partner: '#ef4444',
};

export const STAGE_LABELS: Record<RelationshipStage, string> = {
  stranger: 'Stranger', acquaintance: 'Acquaintance', friend: 'Friend',
  close_friend: 'Close Friend', romance: 'Romance', partner: 'Partner',
};

export const WEATHER_ICONS: Record<Weather, string> = {
  sunny: '☀️', cloudy: '☁️', rainy: '🌧️', snowy: '🌨️',
};

export const LOCATION_IMAGES: Record<string, string> = {
  classroom: 'https://image.qwenlm.ai/generated-images/5758e020-2723-42ef-b362-97d88b20bc17/_result.png',
  library: 'https://image.qwenlm.ai/generated-images/b9fd1900-bb34-49de-8701-85229b046844/_result.png',
  rooftop: 'https://image.qwenlm.ai/generated-images/6e864a48-eb66-4a32-be70-3da51c9dfe7d/_result.png',
  garden: 'https://image.qwenlm.ai/generated-images/91de5b3c-20e3-41b2-b449-23983b70502d/_result.png',
  cafe: 'https://image.qwenlm.ai/generated-images/d28401e1-067c-48d1-9d50-6383ec0e7f2a/_result.png',
  music_room: 'https://image.qwenlm.ai/generated-images/467bfe5b-41c7-433c-8c3b-cd61870399ba/_result.png',
  park: 'https://image.qwenlm.ai/generated-images/e3149b18-ce0c-4a9e-97e9-329a03c788f5/_result.png',
  gym: 'https://image.qwenlm.ai/generated-images/4de44eeb-8d03-4408-a6b6-a30ab0cce11b/_result.png',
  track: 'https://image.qwenlm.ai/generated-images/4de44eeb-8d03-4408-a6b6-a30ab0cce11b/_result.png',
  council_room: 'https://image.qwenlm.ai/generated-images/b9fd1900-bb34-49de-8701-85229b046844/_result.png',
  apartment: 'https://image.qwenlm.ai/generated-images/98f1310d-0d6a-4f9c-b1c5-a31c4e9e5189/_result.png',
  outfit_store: 'https://image.qwenlm.ai/generated-images/b1e6c331-1c2a-4683-9963-39f6d970cd08/_result.png',
};

export const CHARACTER_PORTRAITS: Record<string, string> = {
  sakura: 'https://image.qwenlm.ai/generated-images/885e2d6e-4f08-4634-af0b-00787c7fedcf/_result.png',
  yuki: 'https://image.qwenlm.ai/generated-images/10e70a54-8117-4b9c-85c3-5392fd8f0103/_result.png',
  hina: 'https://image.qwenlm.ai/generated-images/804bf3f5-64a4-407c-aba1-32d5963589ee/_result.png',
  rei: 'https://image.qwenlm.ai/generated-images/759a1471-c64c-40ed-b6c1-053bc4f84baa/_result.png',
  miko: 'https://image.qwenlm.ai/generated-images/dabba02d-ff1c-49f5-ac62-984281f70563/_result.png',
};

export const PLAYER_PORTRAIT = 'https://image.qwenlm.ai/generated-images/f973aec0-d271-49fa-a393-58e6efbd008c/_result.png';

export const OUTFIT_IMAGES: Record<string, string> = {
  maid_outfit: 'https://image.qwenlm.ai/generated-images/d55394f4-0b3e-41a2-9582-20492c067467/_result.png',
  bunny_girl: 'https://image.qwenlm.ai/generated-images/2d4bea1e-256f-46ac-b7f9-4ade6c71cbf1/_result.png',
  school_swimsuit: 'https://image.qwenlm.ai/generated-images/875b126f-c385-40d2-9322-f552e29e7310/_result.png',
  lingerie_set: 'https://image.qwenlm.ai/generated-images/9cfebc2c-1352-4f48-8f56-7dc404d5f1f3/_result.png',
  kimono: 'https://image.qwenlm.ai/generated-images/88b8a118-ef20-4d50-951d-ffa6606bcdc3/_result.png',
  nurse_outfit: 'https://image.qwenlm.ai/generated-images/1aa18b18-7c23-47c1-a391-6e00d36d795d/_result.png',
  catgirl_outfit: 'https://image.qwenlm.ai/generated-images/854a7bdd-b75a-4cc2-887d-ea40ac6cfde7/_result.png',
  idol_costume: 'https://image.qwenlm.ai/generated-images/076ad3a9-9a20-40eb-8d25-639992f3ff84/_result.png',
};

export const SECRET_BG: Record<string, string> = {
  intimate: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
};

export interface SecretScene {
  id: string;
  characterId: string;
  title: string;
  description: string;
  requiredAffection: number;
  requiredTension: number;
  requiredStage: RelationshipStage;
  requiredStat?: { stat: string; min: number };
  requiredItem?: string;
  requiredWeather?: Weather;
  requiredTime?: TimeOfDay;
  dialogue: DialogueLine[];
  bgImage?: string;
}
