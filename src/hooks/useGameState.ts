import { useState, useCallback } from 'react';
import { GameState, RelationshipProgress, RelationshipStage, STAGE_THRESHOLDS, TimeOfDay, GamePhase, DialogueLine, ChoiceOption } from '../types';
import { characters } from '../data/characters';
import { locations, getLocationById } from '../data/locations';
import { gifts, getGiftById } from '../data/gifts';

const INITIAL_RELATIONSHIP: RelationshipProgress = {
  affection: 0, stage: 'stranger', giftsGiven: 0, conversationsHad: 0,
  lastGift: null, unlockedScenes: [], goalsCompleted: [], met: false,
};

const getStage = (affection: number): RelationshipStage => {
  if (affection >= STAGE_THRESHOLDS.partner) return 'partner';
  if (affection >= STAGE_THRESHOLDS.romance) return 'romance';
  if (affection >= STAGE_THRESHOLDS.close_friend) return 'close_friend';
  if (affection >= STAGE_THRESHOLDS.friend) return 'friend';
  if (affection >= STAGE_THRESHOLDS.acquaintance) return 'acquaintance';
  return 'stranger';
};

const nextTime = (t: TimeOfDay): TimeOfDay => {
  const order: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
  return order[(order.indexOf(t) + 1) % order.length];
};

const getInitialState = (): GameState => {
  const relationships: Record<string, RelationshipProgress> = {};
  characters.forEach(c => { relationships[c.id] = { ...INITIAL_RELATIONSHIP }; });
  return {
    phase: 'title', day: 1, timeOfDay: 'morning',
    allowance: 500, dailyAllowance: 300,
    playerStats: { academics: 30, athletics: 30, charm: 30, creativity: 30 },
    relationships, inventory: [],
    currentLocation: null, currentCharacter: null,
    currentDialogue: [], currentDialogueIndex: 0, currentChoices: [],
    notifications: [], scenesCompleted: [],
    actionsToday: 0, maxActionsPerDay: 4,
  };
};

// Generate encounter dialogue
function generateEncounter(charId: string, stage: RelationshipStage): DialogueLine[] {
  const char = characters.find(c => c.id === charId)!;
  const lines = char.dialogue[stage];
  const line = lines[Math.floor(Math.random() * lines.length)];
  return [
    { speaker: null, text: `You see ${char.name} at this location...` },
    { speaker: char.name, text: line, characterId: charId },
  ];
}

// Generate choices for encounter
function generateChoices(charId: string, stage: RelationshipStage): ChoiceOption[] {
  const char = characters.find(c => c.id === charId)!;
  const choices: ChoiceOption[] = [
    { text: `💬 Chat with ${char.name}`, affectionChange: 3 },
    { text: `🎁 Give a gift`, affectionChange: 0 },
    { text: `🚶 Leave`, affectionChange: 0 },
  ];
  if (stage === 'stranger') {
    choices.unshift({ text: `👋 Introduce yourself`, affectionChange: 5 });
  }
  if (stage === 'romance' || stage === 'partner') {
    choices.splice(1, 0, { text: `💕 Hold hands`, affectionChange: 5 });
  }
  return choices;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState);

  const addNotification = useCallback((msg: string) => {
    setState(prev => ({
      ...prev,
      notifications: [msg, ...prev.notifications].slice(0, 30),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'wakeup',
      currentDialogue: [
        { speaker: null, text: `Day 1 — Morning` },
        { speaker: null, text: 'You wake up to the sound of birds chirping outside your window. Today is the first day of your new semester at Sakura Academy...' },
        { speaker: null, text: 'You check your phone. Your parents sent your weekly allowance. Time to make the most of high school!' },
        { speaker: null, text: 'Where will you go today?' },
      ],
      currentDialogueIndex: 0,
    }));
  }, []);

  const advanceDialogue = useCallback(() => {
    setState(prev => {
      const nextIdx = prev.currentDialogueIndex + 1;
      if (nextIdx >= prev.currentDialogue.length) {
        // Dialogue finished, determine next phase
        if (prev.phase === 'wakeup') {
          return { ...prev, phase: 'location_select', currentDialogue: [], currentDialogueIndex: 0 };
        }
        // Café - stay in dialogue phase but at last index (shop overlay shows)
        if (prev.currentLocation === 'cafe') {
          return { ...prev, currentDialogueIndex: prev.currentDialogue.length - 1 };
        }
        if (prev.phase === 'day_end') {
          // Start new day
          const newDay = prev.day + 1;
          return {
            ...prev, phase: 'location_select', day: newDay, timeOfDay: 'morning',
            allowance: prev.allowance + prev.dailyAllowance,
            actionsToday: 0,
            currentDialogue: [{ speaker: null, text: `Day ${newDay} — Morning` }, { speaker: null, text: 'A new day begins. Where will you go?' }],
            currentDialogueIndex: 0,
            notifications: [`☀️ Day ${newDay} — ¥${prev.dailyAllowance} allowance received`, ...prev.notifications].slice(0, 30),
          };
        }
        if (prev.phase === 'encounter') {
          return { ...prev, phase: 'choice', currentChoices: generateChoices(prev.currentCharacter!, prev.relationships[prev.currentCharacter!].stage) };
        }
        // After gift response or chat response, go back to choices if character is present
        if (prev.currentCharacter && prev.phase === 'dialogue') {
          return {
            ...prev,
            phase: 'choice',
            currentDialogue: [],
            currentDialogueIndex: 0,
            currentChoices: generateChoices(prev.currentCharacter, prev.relationships[prev.currentCharacter].stage),
          };
        }
        return { ...prev, phase: 'location_select', currentDialogue: [], currentDialogueIndex: 0 };
      }
      return { ...prev, currentDialogueIndex: nextIdx };
    });
  }, []);

  const selectLocation = useCallback((locationId: string) => {
    const loc = getLocationById(locationId);
    if (!loc) return;
    if (!loc.availableTimes.includes(state.timeOfDay)) {
      addNotification(`Can't go to ${loc.name} at this time.`);
      return;
    }
    if (state.actionsToday >= state.maxActionsPerDay) {
      addNotification("You're too tired. Time to rest for the night.");
      return;
    }

    // Check if any characters are here
    const charsHere = loc.charactersPresent.filter(cId => {
      const char = characters.find(c => c.id === cId);
      if (!char) return false;
      return char.locations.includes(locationId);
    });

    // Also check park/evening characters
    const allCharsHere = characters.filter(c => c.locations.includes(locationId));

    if (allCharsHere.length === 0 && locationId === 'cafe') {
      // Café - shop location
      setState(prev => ({
        ...prev,
        currentLocation: locationId,
        phase: 'dialogue',
        actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You visit the ${loc.name}.` },
          { speaker: null, text: 'Browse the gift shop to find something special for someone...' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    // Pick a random character present (weighted by who's available)
    const available = allCharsHere.length > 0 ? allCharsHere : [];
    if (available.length === 0) {
      setState(prev => ({
        ...prev, currentLocation: locationId, phase: 'dialogue', actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You visit the ${loc.name}.` },
          { speaker: null, text: loc.description + ' It\'s peaceful here, but no one else is around.' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    // Pick character - prefer ones with higher affinity to location
    const char = available[Math.floor(Math.random() * available.length)];
    const rel = state.relationships[char.id];
    const stage = rel.stage;

    const encounterDialogue: DialogueLine[] = [
      { speaker: null, text: `You arrive at ${loc.name}.` },
      { speaker: null, text: `${loc.description}` },
    ];

    if (!rel.met) {
      encounterDialogue.push({ speaker: null, text: `You notice someone you haven't met before...` });
      encounterDialogue.push({ speaker: char.name, text: char.dialogue.stranger[0], characterId: char.id });
    } else {
      encounterDialogue.push({ speaker: null, text: `You see ${char.name} here.` });
      encounterDialogue.push({ speaker: char.name, text: char.dialogue[stage][Math.floor(Math.random() * char.dialogue[stage].length)], characterId: char.id });
    }

    setState(prev => {
      const newRels = { ...prev.relationships };
      newRels[char.id] = { ...newRels[char.id], met: true };
      return {
        ...prev,
        phase: 'encounter',
        currentLocation: locationId,
        currentCharacter: char.id,
        currentDialogue: encounterDialogue,
        currentDialogueIndex: 0,
        actionsToday: prev.actionsToday + 1,
        relationships: newRels,
      };
    });
  }, [state.timeOfDay, state.actionsToday, state.maxActionsPerDay, state.relationships, addNotification]);

  const handleChoice = useCallback((choiceIdx: number) => {
    setState(prev => {
      const choice = prev.currentChoices[choiceIdx];
      if (!choice) return { ...prev, phase: 'location_select', currentChoices: [] };

      const newRels = { ...prev.relationships };
      let message = '';

      if (choice.text.includes('Gift')) {
        // Open gift menu
        return { ...prev, phase: 'gift_give', currentChoices: [] };
      }

      if (choice.text.includes('Leave')) {
        return {
          ...prev, phase: 'location_select', currentChoices: [], currentCharacter: null,
          notifications: ['You decide to head somewhere else.', ...prev.notifications].slice(0, 30),
        };
      }

      if (choice.affectionChange && prev.currentCharacter) {
        const charId = prev.currentCharacter;
        const rel = { ...newRels[charId] };
        rel.affection = Math.min(100, Math.max(0, rel.affection + choice.affectionChange));
        rel.conversationsHad += 1;
        const newStage = getStage(rel.affection);
        const stageChanged = newStage !== rel.stage;
        rel.stage = newStage;

        // Check goals
        const char = characters.find(c => c.id === charId)!;
        char.goals.forEach((goal, idx) => {
          if (rel.affection >= goal.affectionThreshold && !rel.goalsCompleted.includes(idx)) {
            rel.goalsCompleted = [...rel.goalsCompleted, idx];
            message = `🎯 Goal unlocked: ${goal.description}!`;
          }
        });

        newRels[charId] = rel;

        const charLines = char.dialogue[newStage];
        const responseLine = charLines[Math.floor(Math.random() * charLines.length)];

        const responseDialogue: DialogueLine[] = [
          { speaker: null, text: choice.text.includes('Hold') ? 'You gently take their hand...' : choice.text.includes('Introduce') ? 'You introduce yourself warmly.' : 'You have a pleasant conversation.' },
          { speaker: char.name, text: responseLine, characterId: charId },
          { speaker: null, text: `♥ Affection +${choice.affectionChange}` },
          ...(message ? [{ speaker: null, text: message }] : []),
          ...(stageChanged ? [{ speaker: null, text: `🎉 Relationship evolved to ${newStage.toUpperCase()}!` }] : []),
        ];

        return {
          ...prev,
          phase: 'dialogue',
          relationships: newRels,
          currentDialogue: responseDialogue,
          currentDialogueIndex: 0,
          currentChoices: [],
          notifications: [
            ...(stageChanged ? [`🎉 ${char.name}: ${newStage.toUpperCase()}!`] : []),
            ...(message ? [message] : []),
            `💬 ${char.name}: +${choice.affectionChange}♥`,
            ...prev.notifications,
          ].slice(0, 30),
        };
      }

      return { ...prev, phase: 'location_select', currentChoices: [] };
    });
  }, []);

  const giveGift = useCallback((giftId: string) => {
    const gift = getGiftById(giftId);
    if (!gift || !state.currentCharacter) return;

    setState(prev => {
      const charId = prev.currentCharacter!;
      const char = characters.find(c => c.id === charId)!;
      const rel = { ...prev.relationships[charId] };

      let bonus = gift.affectionBonus;
      let reaction = '';

      if (char.likedGifts.includes(giftId)) {
        bonus = Math.floor(bonus * 2.5);
        reaction = `${char.name}'s eyes light up! They absolutely love it!`;
      } else if (char.dislikedGifts.includes(giftId)) {
        bonus = -Math.floor(bonus * 1.5);
        reaction = `${char.name} looks uncomfortable... They don't seem to like this.`;
      } else {
        reaction = `${char.name} accepts the gift with a polite smile.`;
      }

      rel.affection = Math.min(100, Math.max(0, rel.affection + bonus));
      rel.giftsGiven += 1;
      rel.lastGift = giftId;

      const newStage = getStage(rel.affection);
      const stageChanged = newStage !== rel.stage;
      rel.stage = newStage;

      // Check goals
      let message = '';
      char.goals.forEach((goal, idx) => {
        if (rel.affection >= goal.affectionThreshold && !rel.goalsCompleted.includes(idx)) {
          rel.goalsCompleted = [...rel.goalsCompleted, idx];
          message = `🎯 Goal unlocked: ${goal.description}!`;
        }
      });

      const newRels = { ...prev.relationships, [charId]: rel };

      const responseDialogue: DialogueLine[] = [
        { speaker: null, text: `You give ${char.name} a ${gift.name}.` },
        { speaker: null, text: reaction },
        { speaker: char.name, text: char.dialogue[newStage][Math.floor(Math.random() * char.dialogue[newStage].length)], characterId: charId },
        { speaker: null, text: bonus >= 0 ? `♥ +${bonus} Affection` : `♥ ${bonus} Affection` },
        ...(message ? [{ speaker: null, text: message }] : []),
        ...(stageChanged ? [{ speaker: null, text: `🎉 Relationship evolved to ${newStage.toUpperCase()}!` }] : []),
      ];

      return {
        ...prev,
        phase: 'dialogue',
        relationships: newRels,
        currentDialogue: responseDialogue,
        currentDialogueIndex: 0,
        currentChoices: [],
        allowance: prev.allowance - gift.price,
        notifications: [
          ...(stageChanged ? [`🎉 ${char.name}: ${newStage.toUpperCase()}!`] : []),
          ...(message ? [message] : []),
          `🎁 ${char.name}: ${bonus >= 0 ? '+' : ''}${bonus}♥ (${gift.name})`,
          ...prev.notifications,
        ].slice(0, 30),
      };
    });
  }, [state.currentCharacter]);

  const buyGift = useCallback((giftId: string) => {
    const gift = getGiftById(giftId);
    if (!gift) return;
    if (state.allowance < gift.price) {
      addNotification(`Not enough money! Need ¥${gift.price}`);
      return;
    }
    setState(prev => {
      const existing = prev.inventory.find(i => i.giftId === giftId);
      let newInv;
      if (existing) {
        newInv = prev.inventory.map(i => i.giftId === giftId ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        newInv = [...prev.inventory, { giftId, quantity: 1 }];
      }
      return {
        ...prev,
        allowance: prev.allowance - gift.price,
        inventory: newInv,
        notifications: [`🛍️ Bought ${gift.name}! (-¥${gift.price})`, ...prev.notifications].slice(0, 30),
      };
    });
  }, [state.allowance, addNotification]);

  const goToSleep = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'day_end',
      currentDialogue: [
        { speaker: null, text: `Day ${prev.day} — Night` },
        { speaker: null, text: 'The day is coming to an end. You reflect on the moments that passed...' },
        { speaker: null, text: `You earned some rest. Tomorrow is a new day.` },
      ],
      currentDialogueIndex: 0,
      currentCharacter: null,
      currentLocation: null,
    }));
  }, []);

  const trainStat = useCallback((stat: 'academics' | 'athletics' | 'charm' | 'creativity') => {
    if (state.actionsToday >= state.maxActionsPerDay) {
      addNotification("You're too tired to train more today.");
      return;
    }
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, [stat]: Math.min(100, prev.playerStats[stat] + 5) },
      actionsToday: prev.actionsToday + 1,
      notifications: [`📈 ${stat.charAt(0).toUpperCase() + stat.slice(1)} +5!`, ...prev.notifications].slice(0, 30),
    }));
  }, [state.actionsToday, state.maxActionsPerDay, addNotification]);

  const openMenu = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'menu' }));
  }, []);

  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, phase: prev.currentCharacter ? 'choice' : 'location_select' }));
  }, []);

  const backToLocationSelect = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'location_select',
      currentLocation: null,
      currentCharacter: null,
      currentDialogue: [],
      currentDialogueIndex: 0,
      currentChoices: [],
    }));
  }, []);

  const backToChoices = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'choice',
      currentChoices: prev.currentCharacter ? generateChoices(prev.currentCharacter, prev.relationships[prev.currentCharacter].stage) : [],
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(getInitialState());
  }, []);

  return {
    state, startGame, advanceDialogue, selectLocation, handleChoice,
    giveGift, buyGift, goToSleep, trainStat, openMenu, closeMenu, resetGame, addNotification,
    backToLocationSelect, backToChoices,
  };
}
