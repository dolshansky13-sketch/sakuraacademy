import { useState, useCallback } from 'react';
import { GameState, RelationshipProgress, RelationshipStage, STAGE_THRESHOLDS, TimeOfDay, Weather, DialogueLine, ChoiceOption, FlirtOption, Mood } from '../types';
import { characters } from '../data/characters';
import { locations, getLocationById } from '../data/locations';
import { gifts, getGiftById } from '../data/gifts';
import { secretScenes, canUnlockSecretScene } from '../data/secretScenes';

const INITIAL_RELATIONSHIP: RelationshipProgress = {
  affection: 0, stage: 'stranger', giftsGiven: 0, conversationsHad: 0,
  lastGift: null, unlockedScenes: [], goalsCompleted: [], met: false,
  flirtCount: 0, datesHad: 0, lastTextMessage: null, tension: 0,
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

const randomWeather = (): Weather => {
  const r = Math.random();
  if (r < 0.5) return 'sunny';
  if (r < 0.75) return 'cloudy';
  if (r < 0.92) return 'rainy';
  return 'snowy';
};

const FLIRT_OPTIONS: FlirtOption[] = [
  { type: 'sweet', text: 'Give a sweet compliment', emoji: '💝', charmRequired: 0, baseBonus: 4 },
  { type: 'smooth', text: 'Say something smooth', emoji: '✨', charmRequired: 20, baseBonus: 6 },
  { type: 'cheesy', text: 'Tell a cheesy pickup line', emoji: '😏', charmRequired: 10, baseBonus: 5 },
  { type: 'bold', text: 'Make a bold move', emoji: '🔥', charmRequired: 40, baseBonus: 10 },
];

// Random events
const RANDOM_EVENTS = [
  {
    id: 'found_money',
    title: 'Lucky Find!',
    description: 'You found ¥200 on the ground!',
    condition: () => true,
  },
  {
    id: 'rain_sudden',
    title: 'Sudden Downpour',
    description: 'It starts raining unexpectedly!',
    condition: (state: GameState) => state.weather !== 'rainy',
  },
  {
    id: 'cat_appears',
    title: 'Stray Cat',
    description: 'A cute stray cat approaches you...',
    condition: () => Math.random() > 0.7,
  },
  {
    id: 'rival_appears',
    title: 'Rival Student',
    description: 'Someone is trying to get close to your love interest...',
    condition: (state: GameState) => Object.values(state.relationships).some(r => r.affection > 30),
  },
];

const getInitialState = (): GameState => {
  const relationships: Record<string, RelationshipProgress> = {};
  characters.forEach(c => { relationships[c.id] = { ...INITIAL_RELATIONSHIP }; });
  return {
    phase: 'title', day: 1, timeOfDay: 'morning', weather: randomWeather(),
    allowance: 500, dailyAllowance: 300,
    playerStats: { academics: 30, athletics: 30, charm: 30, creativity: 30 },
    relationships, inventory: [],
    currentLocation: null, currentCharacter: null,
    currentDialogue: [], currentDialogueIndex: 0, currentChoices: [],
    notifications: [], scenesCompleted: [],
    actionsToday: 0, maxActionsPerDay: 5,
    totalFlirts: 0, eventsTriggered: [], mood: 'neutral',
  };
};

function generateEncounter(charId: string, stage: RelationshipStage): DialogueLine[] {
  const char = characters.find(c => c.id === charId)!;
  const lines = char.dialogue[stage];
  const line = lines[Math.floor(Math.random() * lines.length)];
  return [
    { speaker: null, text: `You see ${char.name}...` },
    { speaker: char.name, text: line, characterId: charId, expression: 'neutral' },
  ];
}

function generateChoices(charId: string, stage: RelationshipStage, hasSecretScenes: boolean): ChoiceOption[] {
  const char = characters.find(c => c.id === charId)!;
  const choices: ChoiceOption[] = [
    { text: `💬 Chat`, emoji: '💬', affectionChange: 3, type: 'normal' },
    { text: `🎁 Give Gift`, emoji: '🎁', type: 'normal' },
    { text: `💕 Flirt`, emoji: '💕', type: 'flirt' },
    { text: `🚶 Leave`, emoji: '🚶', type: 'normal' },
  ];

  if (stage === 'stranger') {
    choices.unshift({ text: `👋 Introduce Yourself`, emoji: '👋', affectionChange: 5, type: 'normal' });
  }
  if (stage === 'close_friend' || stage === 'romance' || stage === 'partner') {
    choices.splice(2, 0, { text: `🤝 Hold Hands`, emoji: '🤝', affectionChange: 6, type: 'bold' });
  }
  if (stage === 'romance' || stage === 'partner') {
    choices.splice(3, 0, { text: `💋 Kiss`, emoji: '💋', affectionChange: 10, type: 'bold' });
  }
  if (hasSecretScenes) {
    choices.push({ text: `✨ Secret Scene`, emoji: '✨', type: 'special' });
  }
  if (stage === 'friend' || stage === 'close_friend') {
    choices.push({ text: `📱 Text Later`, emoji: '📱', affectionChange: 2, type: 'normal' });
  }
  return choices;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState());

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
      weather: randomWeather(),
      currentDialogue: [
        { speaker: null, text: `Day 1 — Morning` },
        { speaker: null, text: 'You wake up to birds chirping outside. The weather looks beautiful today...' },
        { speaker: null, text: 'Your phone buzzes — your parents sent your allowance. Time to make the most of school life!' },
        { speaker: null, text: 'Where will you go today? Who will you meet?' },
      ],
      currentDialogueIndex: 0,
    }));
  }, []);

  const advanceDialogue = useCallback(() => {
    setState(prev => {
      const nextIdx = prev.currentDialogueIndex + 1;
      if (nextIdx >= prev.currentDialogue.length) {
        if (prev.phase === 'wakeup') {
          return { ...prev, phase: 'location_select', currentDialogue: [], currentDialogueIndex: 0 };
        }
        if (prev.currentLocation === 'cafe' || prev.currentLocation === 'outfit_store' || prev.currentLocation === 'apartment') {
          return { ...prev, currentDialogueIndex: prev.currentDialogue.length - 1 };
        }
        if (prev.phase === 'day_end') {
          const newDay = prev.day + 1;
          const newWeather = randomWeather();
          return {
            ...prev, phase: 'location_select', day: newDay, timeOfDay: 'morning',
            weather: newWeather,
            allowance: prev.allowance + prev.dailyAllowance,
            actionsToday: 0, mood: 'neutral',
            currentDialogue: [
              { speaker: null, text: `Day ${newDay} — Morning` },
              { speaker: null, text: `The weather is ${newWeather} today...` },
              { speaker: null, text: 'A new day begins. Where will you go?' },
            ],
            currentDialogueIndex: 0,
            notifications: [`☀️ Day ${newDay} — ¥${prev.dailyAllowance} received`, ...prev.notifications].slice(0, 30),
          };
        }
        if (prev.currentCharacter && (prev.phase === 'dialogue' || prev.phase === 'encounter')) {
          const hasSecretScenes = secretScenes.some(s => s.characterId === prev.currentCharacter && canUnlockSecretScene(s, prev) && !prev.scenesCompleted.includes(s.id));
          return {
            ...prev, phase: 'choice',
            currentDialogue: [], currentDialogueIndex: 0,
            currentChoices: generateChoices(prev.currentCharacter, prev.relationships[prev.currentCharacter].stage, hasSecretScenes),
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
      addNotification(`Can't go there at this time.`);
      return;
    }
    if (state.actionsToday >= state.maxActionsPerDay) {
      addNotification("You're exhausted. Time to sleep.");
      return;
    }

    // Café = shop
    if (locationId === 'cafe') {
      setState(prev => ({
        ...prev, currentLocation: locationId, phase: 'dialogue', actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You visit the Café.` },
          { speaker: null, text: 'A cozy place to buy gifts and relax. Browse the shop below...' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    // Outfit Store = outfit shop
    if (locationId === 'outfit_store') {
      setState(prev => ({
        ...prev, currentLocation: locationId, phase: 'dialogue', actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You visit the Fashion Boutique.` },
          { speaker: null, text: 'A trendy shop with outfits, costumes, and special items. Browse the collection below...' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    // Apartment = rest/train
    if (locationId === 'apartment') {
      setState(prev => ({
        ...prev, currentLocation: locationId, phase: 'dialogue', actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You return to your apartment.` },
          { speaker: null, text: 'Your cozy private space. Time to rest, train, or prepare for your next adventure.' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    // Check for characters
    const allCharsHere = characters.filter(c => c.locations.includes(locationId));

    // Random event chance (20%)
    if (Math.random() < 0.2 && allCharsHere.length > 0) {
      const eventChar = allCharsHere[Math.floor(Math.random() * allCharsHere.length)];
      const eventDialogue: DialogueLine[] = [
        { speaker: null, text: `As you arrive at ${loc.name}, something unexpected happens...`, effect: 'sparkle' },
        { speaker: null, text: `${eventChar.name} seems to be in a special mood today!`, effect: 'sparkle' },
        { speaker: eventChar.name, text: eventChar.dialogue[getStage(state.relationships[eventChar.id].affection)][0], characterId: eventChar.id, expression: 'happy' },
      ];
      setState(prev => {
        const newRels = { ...prev.relationships };
        newRels[eventChar.id] = { ...newRels[eventChar.id], met: true, affection: Math.min(100, newRels[eventChar.id].affection + 3) };
        return {
          ...prev, phase: 'encounter', currentLocation: locationId, currentCharacter: eventChar.id,
          currentDialogue: eventDialogue, currentDialogueIndex: 0, actionsToday: prev.actionsToday + 1,
          relationships: newRels, mood: 'surprised',
          notifications: [`✨ Special encounter with ${eventChar.name}!`, ...prev.notifications].slice(0, 30),
        };
      });
      return;
    }

    if (allCharsHere.length === 0) {
      setState(prev => ({
        ...prev, currentLocation: locationId, phase: 'dialogue', actionsToday: prev.actionsToday + 1,
        currentDialogue: [
          { speaker: null, text: `You visit ${loc.name}.` },
          { speaker: null, text: loc.description + ' No one else is around.' },
        ],
        currentDialogueIndex: 0,
      }));
      return;
    }

    const char = allCharsHere[Math.floor(Math.random() * allCharsHere.length)];
    const rel = state.relationships[char.id];
    const stage = rel.stage;

    const encounterDialogue: DialogueLine[] = [
      { speaker: null, text: `You arrive at ${loc.name}.` },
    ];

    if (!rel.met) {
      encounterDialogue.push({ speaker: null, text: `You notice someone you haven't met before...` });
      encounterDialogue.push({ speaker: char.name, text: char.dialogue.stranger[0], characterId: char.id, expression: 'neutral' });
    } else {
      encounterDialogue.push({ speaker: null, text: `You see ${char.name} here.` });
      const mood: Mood = stage === 'romance' || stage === 'partner' ? 'love' : stage === 'close_friend' ? 'happy' : 'neutral';
      encounterDialogue.push({ speaker: char.name, text: char.dialogue[stage][Math.floor(Math.random() * char.dialogue[stage].length)], characterId: char.id, expression: mood });
    }

    setState(prev => {
      const newRels = { ...prev.relationships };
      newRels[char.id] = { ...newRels[char.id], met: true };
      return {
        ...prev, phase: 'encounter', currentLocation: locationId, currentCharacter: char.id,
        currentDialogue: encounterDialogue, currentDialogueIndex: 0, actionsToday: prev.actionsToday + 1,
        relationships: newRels, mood: 'neutral',
      };
    });
  }, [state.timeOfDay, state.actionsToday, state.maxActionsPerDay, state.relationships, addNotification]);

  const handleChoice = useCallback((choiceIdx: number) => {
    setState(prev => {
      const choice = prev.currentChoices[choiceIdx];
      if (!choice) return { ...prev, phase: 'location_select', currentChoices: [] };

      if (choice.text.includes('Gift')) {
        return { ...prev, phase: 'gift_give', currentChoices: [] };
      }
      if (choice.text.includes('Flirt')) {
        return { ...prev, phase: 'flirt', currentChoices: [] };
      }
      if (choice.text.includes('Secret Scene')) {
        return { ...prev, phase: 'secret_scenes', currentChoices: [] };
      }
      if (choice.text.includes('Leave')) {
        return {
          ...prev, phase: 'location_select', currentChoices: [], currentCharacter: null,
          notifications: ['You head somewhere else.', ...prev.notifications].slice(0, 30),
        };
      }
      if (choice.text.includes('Text')) {
        const charId = prev.currentCharacter!;
        const char = characters.find(c => c.id === charId)!;
        const rel = prev.relationships[charId];
        const msgs = char.textMessages[rel.stage];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const newRels = { ...prev.relationships };
        newRels[charId] = { ...newRels[charId], lastTextMessage: msg, affection: Math.min(100, rel.affection + 2) };
        return {
          ...prev, phase: 'dialogue', relationships: newRels, currentChoices: [],
          currentDialogue: [
            { speaker: null, text: `You send a text to ${char.name}...` },
            { speaker: char.name, text: msg, characterId: charId, expression: 'happy' },
            { speaker: null, text: '♥ +2 Affection' },
          ],
          currentDialogueIndex: 0,
        };
      }

      // Normal chat / hold hands / kiss
      if (prev.currentCharacter) {
        const charId = prev.currentCharacter;
        const char = characters.find(c => c.id === charId)!;
        const rel = { ...prev.relationships[charId] };
        const bonus = choice.affectionChange || 3;
        rel.affection = Math.min(100, Math.max(0, rel.affection + bonus));
        rel.conversationsHad += 1;
        if (choice.text.includes('Hold')) rel.tension = Math.min(100, rel.tension + 15);
        if (choice.text.includes('Kiss')) rel.tension = Math.min(100, rel.tension + 30);
        const newStage = getStage(rel.affection);
        const stageChanged = newStage !== rel.stage;
        rel.stage = newStage;

        let message = '';
        char.goals.forEach((goal, idx) => {
          if (rel.affection >= goal.affectionThreshold && !rel.goalsCompleted.includes(idx)) {
            rel.goalsCompleted = [...rel.goalsCompleted, idx];
            message = `🎯 Goal: ${goal.description}!`;
          }
        });

        const newRels = { ...prev.relationships, [charId]: rel };
        const mood: Mood = choice.text.includes('Kiss') ? 'love' : choice.text.includes('Hold') ? 'flustered' : 'happy';

        const responseDialogue: DialogueLine[] = [];
        responseDialogue.push({ speaker: null, text: choice.text.includes('Kiss') ? 'You lean in closer...' : choice.text.includes('Hold') ? 'You gently reach for their hand...' : 'You have a pleasant conversation.' });
        responseDialogue.push({ speaker: char.name, text: char.dialogue[newStage][Math.floor(Math.random() * char.dialogue[newStage].length)], characterId: charId, expression: mood });
        responseDialogue.push({ speaker: null, text: `♥ +${bonus} Affection` });
        if (message) responseDialogue.push({ speaker: null, text: message });
        if (stageChanged) responseDialogue.push({ speaker: null, text: `🎉 Relationship → ${newStage.toUpperCase()}!` });

        return {
          ...prev, phase: 'dialogue', relationships: newRels, mood,
          currentDialogue: responseDialogue, currentDialogueIndex: 0, currentChoices: [],
          notifications: [
            ...(stageChanged ? [`🎉 ${char.name}: ${newStage.toUpperCase()}!`] : []),
            ...(message ? [message] : []),
            `${choice.emoji || '💬'} ${char.name}: +${bonus}♥`,
            ...prev.notifications,
          ].slice(0, 30),
        };
      }
      return { ...prev, phase: 'location_select', currentChoices: [] };
    });
  }, []);

  const handleFlirt = useCallback((flirtType: 'smooth' | 'cheesy' | 'bold' | 'sweet') => {
    setState(prev => {
      if (!prev.currentCharacter) return prev;
      const charId = prev.currentCharacter;
      const char = characters.find(c => c.id === charId)!;
      const rel = { ...prev.relationships[charId] };
      const flirt = FLIRT_OPTIONS.find(f => f.type === flirtType)!;

      // Success check based on charm
      const successChance = Math.min(0.95, 0.4 + (prev.playerStats.charm / 100) * 0.5 + (rel.affection / 100) * 0.2);
      const success = Math.random() < successChance;

      let bonus = success ? flirt.baseBonus : -2;
      rel.affection = Math.min(100, Math.max(0, rel.affection + bonus));
      rel.flirtCount += 1;
      if (success) rel.tension = Math.min(100, rel.tension + 10);

      const newStage = getStage(rel.affection);
      rel.stage = newStage;

      const responses = char.flirtResponses[flirtType];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const mood: Mood = success ? (flirtType === 'bold' ? 'flustered' : flirtType === 'sweet' ? 'shy' : 'happy') : 'angry';

      const newRels = { ...prev.relationships, [charId]: rel };

      const responseDialogue: DialogueLine[] = [];
      responseDialogue.push({ speaker: null, text: `You try to flirt with ${char.name}...` });
      responseDialogue.push({ speaker: char.name, text: response, characterId: charId, expression: mood });
      responseDialogue.push({ speaker: null, text: success ? `♥ +${bonus} Affection — Success!` : `♥ ${bonus} Affection — Failed...` });

      return {
        ...prev, phase: 'dialogue', relationships: newRels, mood,
        totalFlirts: prev.totalFlirts + 1,
        currentDialogue: responseDialogue, currentDialogueIndex: 0, currentChoices: [],
        notifications: [
          success ? `💕 Flirt success with ${char.name}! +${bonus}♥` : `💔 Flirt failed with ${char.name}... ${bonus}♥`,
          ...prev.notifications,
        ].slice(0, 30),
      };
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
      let mood: Mood = 'happy';

      // Special gifts get extra bonuses
      const isSpecial = gift.category === 'special';
      if (isSpecial) {
        bonus = Math.floor(bonus * 1.5);
      }

      if (char.likedGifts.includes(giftId)) {
        bonus = Math.floor(bonus * 2.5);
        reaction = `${char.name}'s eyes light up with joy! They absolutely love it!`;
        mood = 'love';
        rel.tension = Math.min(100, rel.tension + (isSpecial ? 15 : 8));
      } else if (char.dislikedGifts.includes(giftId)) {
        bonus = -Math.floor(bonus * 1.5);
        reaction = `${char.name} looks uncomfortable... They don't like this.`;
        mood = 'sad';
      } else {
        reaction = `${char.name} accepts the gift with a ${isSpecial ? 'surprised gasp' : 'polite smile'}.`;
        mood = isSpecial ? 'surprised' : 'happy';
        if (isSpecial) rel.tension = Math.min(100, rel.tension + 5);
      }

      rel.affection = Math.min(100, Math.max(0, rel.affection + bonus));
      rel.giftsGiven += 1;
      rel.lastGift = giftId;
      const newStage = getStage(rel.affection);
      const stageChanged = newStage !== rel.stage;
      rel.stage = newStage;

      let message = '';
      char.goals.forEach((goal, idx) => {
        if (rel.affection >= goal.affectionThreshold && !rel.goalsCompleted.includes(idx)) {
          rel.goalsCompleted = [...rel.goalsCompleted, idx];
          message = `🎯 Goal: ${goal.description}!`;
        }
      });

      // Remove from inventory
      let newInv = [...prev.inventory];
      const invIdx = newInv.findIndex(i => i.giftId === giftId);
      if (invIdx >= 0) {
        if (newInv[invIdx].quantity <= 1) newInv.splice(invIdx, 1);
        else newInv[invIdx] = { ...newInv[invIdx], quantity: newInv[invIdx].quantity - 1 };
      }

      const newRels = { ...prev.relationships, [charId]: rel };

      const responseDialogue: DialogueLine[] = [];
      responseDialogue.push({ speaker: null, text: `You give ${char.name} a ${gift.name} ${gift.emoji}` });
      responseDialogue.push({ speaker: null, text: reaction });
      responseDialogue.push({ speaker: char.name, text: char.dialogue[newStage][Math.floor(Math.random() * char.dialogue[newStage].length)], characterId: charId, expression: mood });
      responseDialogue.push({ speaker: null, text: bonus >= 0 ? `♥ +${bonus} Affection` : `♥ ${bonus} Affection` });
      if (message) responseDialogue.push({ speaker: null, text: message });
      if (stageChanged) responseDialogue.push({ speaker: null, text: `🎉 Relationship → ${newStage.toUpperCase()}!` });

      return {
        ...prev, phase: 'dialogue', relationships: newRels, mood, inventory: newInv,
        currentDialogue: responseDialogue, currentDialogueIndex: 0, currentChoices: [],
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
        ...prev, allowance: prev.allowance - gift.price, inventory: newInv,
        notifications: [`🛍️ Bought ${gift.name}! (-¥${gift.price})`, ...prev.notifications].slice(0, 30),
      };
    });
  }, [state.allowance, addNotification]);

  const goToSleep = useCallback(() => {
    setState(prev => ({
      ...prev, phase: 'day_end',
      currentDialogue: [
        { speaker: null, text: `Day ${prev.day} — Night` },
        { speaker: null, text: 'The day is coming to an end. You reflect on the moments that passed...' },
        { speaker: null, text: 'Tomorrow is a new day full of possibilities.' },
      ],
      currentDialogueIndex: 0, currentCharacter: null, currentLocation: null,
    }));
  }, []);

  const trainStat = useCallback((stat: 'academics' | 'athletics' | 'charm' | 'creativity') => {
    if (state.actionsToday >= state.maxActionsPerDay) {
      addNotification("Too tired to train more today.");
      return;
    }
    setState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, [stat]: Math.min(100, prev.playerStats[stat] + 5) },
      actionsToday: prev.actionsToday + 1,
      notifications: [`📈 ${stat.charAt(0).toUpperCase() + stat.slice(1)} +5!`, ...prev.notifications].slice(0, 30),
    }));
  }, [state.actionsToday, state.maxActionsPerDay, addNotification]);

  const openMenu = useCallback(() => { setState(prev => ({ ...prev, phase: 'menu' })); }, []);
  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, phase: prev.currentCharacter ? 'choice' : 'location_select' }));
  }, []);
  const backToLocationSelect = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'location_select', currentLocation: null, currentCharacter: null, currentDialogue: [], currentDialogueIndex: 0, currentChoices: [] }));
  }, []);
  const backToChoices = useCallback(() => {
    setState(prev => {
      if (!prev.currentCharacter) return { ...prev, phase: 'choice', currentChoices: [] };
      const hasSecretScenes = secretScenes.some(s => s.characterId === prev.currentCharacter && canUnlockSecretScene(s, prev) && !prev.scenesCompleted.includes(s.id));
      return {
        ...prev, phase: 'choice',
        currentChoices: generateChoices(prev.currentCharacter, prev.relationships[prev.currentCharacter].stage, hasSecretScenes),
      };
    });
  }, []);
  const resetGame = useCallback(() => { setState(getInitialState()); }, []);

  const triggerSecretScene = useCallback((sceneId: string) => {
    const scene = secretScenes.find(s => s.id === sceneId);
    if (!scene || !canUnlockSecretScene(scene, state)) return;

    const char = characters.find(c => c.id === scene.characterId);
    if (!char) return;

    setState(prev => ({
      ...prev,
      phase: 'dialogue',
      currentCharacter: scene.characterId,
      currentDialogue: scene.dialogue,
      currentDialogueIndex: 0,
      scenesCompleted: [...prev.scenesCompleted, sceneId],
      notifications: [`🔓 Secret Scene Unlocked: ${scene.title}`, ...prev.notifications].slice(0, 30),
    }));
  }, [state]);

  const getAvailableSecretScenes = useCallback((characterId: string) => {
    return secretScenes
      .filter(s => s.characterId === characterId && canUnlockSecretScene(s, state))
      .filter(s => !state.scenesCompleted.includes(s.id));
  }, [state]);

  return {
    state, startGame, advanceDialogue, selectLocation, handleChoice,
    giveGift, buyGift, goToSleep, trainStat, openMenu, closeMenu, resetGame,
    addNotification, backToLocationSelect, backToChoices, handleFlirt,
    triggerSecretScene, getAvailableSecretScenes,
    FLIRT_OPTIONS,
  };
}
