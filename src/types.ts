export type RelationshipStage = 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'romance' | 'partner';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type GamePhase = 'title' | 'wakeup' | 'location_select' | 'encounter' | 'dialogue' | 'choice' | 'gift_give' | 'event' | 'day_end' | 'menu';

export interface Character {
  id: string;
  name: string;
  age: number;
  grade: string;
  personality: string;
  description: string;
  avatar: string;
  color: string;
  bgColor: string;
  likedGifts: string[];
  dislikedGifts: string[];
  neutralGifts: string[];
  stats: { academics: number; athletics: number; charm: number; creativity: number };
  locations: string[]; // Where they can be found
  goals: { affectionThreshold: number; description: string; reward: string }[];
  dialogue: Record<RelationshipStage, string[]>;
  expressions: string[];
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
  charactersPresent: string[]; // character IDs that can appear here
  bgGradient: string;
}

export interface DialogueLine {
  speaker: string | null; // null = narration
  text: string;
  expression?: string;
  characterId?: string;
}

export interface ChoiceOption {
  text: string;
  affectionChange?: number;
  nextScene?: string;
  statBoost?: { stat: string; amount: number };
  condition?: { stat?: string; min?: number; affection?: string; minAffection?: number };
}

export interface SceneEvent {
  id: string;
  characterId: string;
  locationId: string;
  requiredStage?: RelationshipStage;
  requiredTime?: TimeOfDay;
  requiredAffection?: number;
  requiredStat?: { stat: string; min: number };
  dialogue: DialogueLine[];
  choices?: ChoiceOption[];
  affectionReward?: number;
  unlocksScene?: string;
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
}

export interface GameState {
  phase: GamePhase;
  day: number;
  timeOfDay: TimeOfDay;
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
