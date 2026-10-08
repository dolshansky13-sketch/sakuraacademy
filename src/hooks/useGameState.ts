import { useState, useCallback } from 'react';
import { GameState, RelationshipProgress, RelationshipStage, STAGE_THRESHOLDS, TimeOfDay } from '../types';
import { characters } from '../data/characters';
import { getGiftById } from '../data/gifts';

const INITIAL_RELATIONSHIP: RelationshipProgress = {
  affection: 0,
  stage: 'stranger',
  giftsGiven: 0,
  conversationsHad: 0,
  lastGift: null,
  unlockedScenes: [],
  goalsCompleted: [],
};

const getInitialState = (): GameState => {
  const relationships: Record<string, RelationshipProgress> = {};
  characters.forEach(char => {
    relationships[char.id] = { ...INITIAL_RELATIONSHIP };
  });
  return {
    day: 1,
    timeOfDay: 'morning',
    allowance: 500,
    dailyAllowance: 300,
    playerStats: { academics: 30, athletics: 30, charm: 30, creativity: 30 },
    relationships,
    inventory: [],
    currentScene: null,
    notifications: ['Welcome to Sakura Academy! Your journey begins...'],
  };
};

const getStage = (affection: number): RelationshipStage => {
  if (affection >= STAGE_THRESHOLDS.partner) return 'partner';
  if (affection >= STAGE_THRESHOLDS.romance) return 'romance';
  if (affection >= STAGE_THRESHOLDS.close_friend) return 'close_friend';
  if (affection >= STAGE_THRESHOLDS.friend) return 'friend';
  if (affection >= STAGE_THRESHOLDS.acquaintance) return 'acquaintance';
  return 'stranger';
};

const nextTimeOfDay = (current: TimeOfDay): TimeOfDay => {
  const order: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
};

export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState);

  const addNotification = useCallback((msg: string) => {
    setState(prev => ({
      ...prev,
      notifications: [msg, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const giveGift = useCallback((characterId: string, giftId: string) => {
    const gift = getGiftById(giftId);
    const character = characters.find(c => c.id === characterId);
    if (!gift || !character) return;
    if (state.allowance < gift.price) {
      addNotification(`Not enough allowance! Need ¥${gift.price}`);
      return;
    }

    setState(prev => {
      const rel = { ...prev.relationships[characterId] };
      let bonus = gift.affectionBonus;
      let message = '';

      if (character.likedGifts.includes(giftId)) {
        bonus = Math.floor(bonus * 2.5);
        message = `${character.name} LOVED the ${gift.name}! (+${bonus} ♥)`;
      } else if (character.dislikedGifts.includes(giftId)) {
        bonus = -Math.floor(bonus * 1.5);
        message = `${character.name} didn't like the ${gift.name}... (${bonus} ♥)`;
      } else {
        message = `${character.name} received the ${gift.name}. (+${bonus} ♥)`;
      }

      rel.affection = Math.max(0, Math.min(100, rel.affection + bonus));
      rel.giftsGiven += 1;
      rel.lastGift = giftId;

      const newStage = getStage(rel.affection);
      const stageChanged = newStage !== rel.stage;
      rel.stage = newStage;

      // Check goals
      character.goals.forEach((goal, idx) => {
        if (rel.affection >= goal.affectionThreshold && !rel.goalsCompleted.includes(idx)) {
          rel.goalsCompleted = [...rel.goalsCompleted, idx];
          message += ` | Goal unlocked: ${goal.description}!`;
        }
      });

      return {
        ...prev,
        allowance: prev.allowance - gift.price,
        relationships: { ...prev.relationships, [characterId]: rel },
        notifications: [
          ...(stageChanged ? [`🎉 ${character.name}'s relationship evolved to ${newStage.toUpperCase()}!`] : []),
          message,
          ...prev.notifications,
        ].slice(0, 20),
      };
    });
  }, [state.allowance, addNotification]);

  const talkToCharacter = useCallback((characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    setState(prev => {
      const rel = { ...prev.relationships[characterId] };
      rel.conversationsHad += 1;
      const bonus = 2;
      rel.affection = Math.min(100, rel.affection + bonus);
      const newStage = getStage(rel.affection);
      const stageChanged = newStage !== rel.stage;
      rel.stage = newStage;

      return {
        ...prev,
        relationships: { ...prev.relationships, [characterId]: rel },
        notifications: [
          ...(stageChanged ? [`🎉 ${character.name}'s relationship evolved to ${newStage.toUpperCase()}!`] : []),
          `Had a nice chat with ${character.name}. (+${bonus} ♥)`,
          ...prev.notifications,
        ].slice(0, 20),
      };
    });
  }, []);

  const advanceTime = useCallback(() => {
    setState(prev => {
      const nextTime = nextTimeOfDay(prev.timeOfDay);
      const isNewDay = nextTime === 'morning';
      const newDay = isNewDay ? prev.day + 1 : prev.day;
      const newAllowance = isNewDay ? prev.dailyAllowance : prev.allowance;

      return {
        ...prev,
        timeOfDay: nextTime,
        day: newDay,
        allowance: newAllowance,
        notifications: [
          ...(isNewDay ? [`☀️ Day ${newDay} begins! You received ¥${prev.dailyAllowance} allowance.`] : []),
          ...prev.notifications,
        ].slice(0, 20),
      };
    });
  }, []);

  const study = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, academics: Math.min(100, prev.playerStats.academics + 5) },
      notifications: [`📚 Studied hard! Academics +5`, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const exercise = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, athletics: Math.min(100, prev.playerStats.athletics + 5) },
      notifications: [`🏃 Exercised! Athletics +5`, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const socialize = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, charm: Math.min(100, prev.playerStats.charm + 5) },
      notifications: [`💬 Socialized! Charm +5`, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const createArt = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, creativity: Math.min(100, prev.playerStats.creativity + 5) },
      notifications: [`🎨 Created art! Creativity +5`, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(getInitialState());
  }, []);

  return {
    state,
    giveGift,
    talkToCharacter,
    advanceTime,
    study,
    exercise,
    socialize,
    createArt,
    resetGame,
  };
}
