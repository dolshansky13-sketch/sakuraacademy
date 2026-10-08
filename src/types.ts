export type RelationshipStage = 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'romance' | 'partner';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';
export type GamePhase = 'title' | 'wakeup' | 'location_select' | 'encounter' | 'dialogue' | 'choice' | 'gift_give' | 'flirt' | 'event' | 'day_end' | 'menu' | 'date' | 'minigame' | 'text_message';
export type Mood = 'neutral' | 'happy' | 'shy' | 'flustered' | 'love' | 'angry' | 'sad' | 'surprised' | 'smirk' | 'thinking';

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
};

export const CHARACTER_PORTRAITS: Record<string, string> = {
  sakura: 'https://image.qwenlm.ai/generated-images/e834f767-9aa7-4d0d-af7c-3f6c0f5bd5d5/_result.png',
  yuki: 'https://image.qwenlm.ai/generated-images/a85e0e9f-c9fb-4d18-abc2-812876665e04/_result.png',
};
