export type RelationshipStage = 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'romance' | 'partner';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Character {
  id: string;
  name: string;
  age: number;
  grade: string;
  personality: string;
  description: string;
  avatar: string;
  color: string;
  likedGifts: string[];
  dislikedGifts: string[];
  neutralGifts: string[];
  stats: {
    academics: number;
    athletics: number;
    charm: number;
    creativity: number;
  };
  goals: {
    affectionThreshold: number;
    description: string;
    reward: string;
  }[];
  dialogue: {
    stranger: string[];
    acquaintance: string[];
    friend: string[];
    close_friend: string[];
    romance: string[];
    partner: string[];
  };
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'flowers' | 'accessories' | 'books' | 'sports' | 'music' | 'art' | 'luxury';
  emoji: string;
  affectionBonus: number;
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
}

export interface GameState {
  day: number;
  timeOfDay: TimeOfDay;
  allowance: number;
  dailyAllowance: number;
  playerStats: PlayerStats;
  relationships: Record<string, RelationshipProgress>;
  inventory: string[];
  currentScene: string | null;
  notifications: string[];
}

export const STAGE_THRESHOLDS: Record<RelationshipStage, number> = {
  stranger: 0,
  acquaintance: 10,
  friend: 30,
  close_friend: 55,
  romance: 75,
  partner: 95,
};

export const STAGE_COLORS: Record<RelationshipStage, string> = {
  stranger: 'bg-gray-400',
  acquaintance: 'bg-blue-400',
  friend: 'bg-green-400',
  close_friend: 'bg-yellow-400',
  romance: 'bg-pink-400',
  partner: 'bg-red-500',
};

export const STAGE_LABELS: Record<RelationshipStage, string> = {
  stranger: 'Stranger',
  acquaintance: 'Acquaintance',
  friend: 'Friend',
  close_friend: 'Close Friend',
  romance: 'Romance',
  partner: 'Partner',
};
