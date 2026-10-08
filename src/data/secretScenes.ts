import { SecretScene } from '../types';

export const secretScenes: SecretScene[] = [
  // Sakura secret scenes
  {
    id: 'sakura_rainy_confession',
    characterId: 'sakura',
    title: 'Rainy Day Confession',
    description: 'A heartfelt confession under the rain',
    requiredAffection: 70,
    requiredTension: 50,
    requiredStage: 'romance',
    requiredWeather: 'rainy',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'The rain falls softly around you both. Sakura stands close, her hair damp, eyes shimmering.' },
      { speaker: 'Sakura', text: 'I... I never thought it would come to this. Us. Here. In the rain.', expression: 'shy' },
      { speaker: null, text: 'She takes your hand, her fingers trembling slightly.' },
      { speaker: 'Sakura', text: 'I love you. I think I always have. Since that first day in the library.', expression: 'love' },
      { speaker: null, text: 'She leans in, her lips brushing yours in the gentle rain.' },
      { speaker: 'Sakura', text: 'Promise me... promise me we\'ll always find each other. No matter what.', expression: 'love' },
    ],
  },
  {
    id: 'sakura_library_intimate',
    characterId: 'sakura',
    title: 'Library Whispers',
    description: 'A quiet moment in the library stacks',
    requiredAffection: 85,
    requiredTension: 70,
    requiredStage: 'partner',
    requiredTime: 'evening',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'The library is empty. Golden light filters through the windows. Sakura pulls you between the shelves.' },
      { speaker: 'Sakura', text: 'No one will find us here. Just for a moment...', expression: 'shy' },
      { speaker: null, text: 'She presses herself against you, her breath warm on your neck.' },
      { speaker: 'Sakura', text: 'I want to memorize this. The way you smell. The way your heart beats.', expression: 'love' },
      { speaker: null, text: 'Her hands find yours, intertwining your fingers.' },
      { speaker: 'Sakura', text: 'I never knew love could feel like this. Like coming home.', expression: 'love' },
    ],
  },

  // Yuki secret scenes
  {
    id: 'yuki_victory_celebration',
    characterId: 'yuki',
    title: 'Victory Celebration',
    description: 'Celebrating a hard-won victory together',
    requiredAffection: 75,
    requiredTension: 60,
    requiredStage: 'romance',
    requiredStat: { stat: 'athletics', min: 60 },
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'You cross the finish line together. Yuki is breathing hard, a rare smile on her face.' },
      { speaker: 'Yuki', text: 'We did it. Actually did it. Together.', expression: 'happy' },
      { speaker: null, text: 'She turns to you, eyes bright with emotion she rarely shows.' },
      { speaker: 'Yuki', text: 'You know... I never thought I\'d find someone who could keep up with me.', expression: 'soft' },
      { speaker: null, text: 'She grabs your collar and pulls you close.' },
      { speaker: 'Yuki', text: 'Don\'t you dare leave me. You\'re stuck with me now. Got it?', expression: 'flustered' },
    ],
  },
  {
    id: 'yuki_dawn_training',
    characterId: 'yuki',
    title: 'Dawn Training Bond',
    description: 'An early morning training session turns intimate',
    requiredAffection: 90,
    requiredTension: 80,
    requiredStage: 'partner',
    requiredTime: 'morning',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'The sun is just rising. You\'re both exhausted from training. Yuki collapses next to you.' },
      { speaker: 'Yuki', text: '...You\'re insane. You know that?', expression: 'smirk' },
      { speaker: null, text: 'She leans her head on your shoulder, something she\'d never do in front of others.' },
      { speaker: 'Yuki', text: 'I used to think I didn\'t need anyone. Then I met you.', expression: 'soft' },
      { speaker: null, text: 'Her hand finds yours, squeezing gently.' },
      { speaker: 'Yuki', text: 'You\'re my teammate. My partner. My... everything. Don\'t make it weird.', expression: 'flustered' },
    ],
  },

  // Hina secret scenes
  {
    id: 'hina_starlight_concert',
    characterId: 'hina',
    title: 'Starlight Concert',
    description: 'A private concert under the stars',
    requiredAffection: 80,
    requiredTension: 65,
    requiredStage: 'romance',
    requiredTime: 'night',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'The rooftop is bathed in moonlight. Hina begins to play, her voice soft and intimate.' },
      { speaker: 'Hina', text: 'This song... I wrote it for you. Only you.', expression: 'happy' },
      { speaker: null, text: 'She sets down her instrument and turns to you, eyes shining.' },
      { speaker: 'Hina', text: 'You\'re my muse. My inspiration. My everything.', expression: 'love' },
      { speaker: null, text: 'She takes your hands, pressing them to her heart.' },
      { speaker: 'Hina', text: 'Feel that? That beat? It\'s yours. It\'s always been yours.', expression: 'love' },
    ],
  },
  {
    id: 'hina_eternal_melody',
    characterId: 'hina',
    title: 'Eternal Melody',
    description: 'She writes her masterpiece about you',
    requiredAffection: 95,
    requiredTension: 90,
    requiredStage: 'partner',
    requiredStat: { stat: 'creativity', min: 70 },
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'Hina pulls you into the music room, eyes bright with excitement.' },
      { speaker: 'Hina', text: 'I finished it! My masterpiece! The song about us!', expression: 'excited' },
      { speaker: null, text: 'She plays it for you. It\'s beautiful. It\'s you. Both of you.' },
      { speaker: 'Hina', text: 'This is our song. Forever. No matter what happens.', expression: 'love' },
      { speaker: null, text: 'She kisses you, soft and sweet, as the final note fades.' },
      { speaker: 'Hina', text: 'I love you. More than music. More than anything.', expression: 'love' },
    ],
  },

  // Rei secret scenes
  {
    id: 'rei_moonlit_walk',
    characterId: 'rei',
    title: 'Moonlit Walk',
    description: 'A secret shared under the moon',
    requiredAffection: 75,
    requiredTension: 55,
    requiredStage: 'romance',
    requiredTime: 'night',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'The moon is full. Rei walks beside you, uncharacteristically quiet.' },
      { speaker: 'Rei', text: 'I have a confession. One I\'ve never told anyone.', expression: 'serious' },
      { speaker: null, text: 'She stops, turning to face you. Her mask is gone.' },
      { speaker: 'Rei', text: 'I\'m lonely. I\'ve always been lonely. Until you.', expression: 'vulnerable' },
      { speaker: null, text: 'She takes your hand, something she\'d never do in daylight.' },
      { speaker: 'Rei', text: 'You\'re the only variable I can\'t predict. And I... I don\'t want to.', expression: 'soft' },
    ],
  },
  {
    id: 'rei_eternal_bond',
    characterId: 'rei',
    title: 'Eternal Bond',
    description: 'She opens up completely',
    requiredAffection: 95,
    requiredTension: 85,
    requiredStage: 'partner',
    requiredStat: { stat: 'academics', min: 80 },
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'Rei sits close, her usual composure replaced with something raw and real.' },
      { speaker: 'Rei', text: 'I\'ve run the numbers. Analyzed every possibility.', expression: 'serious' },
      { speaker: null, text: 'She looks at you, eyes vulnerable.' },
      { speaker: 'Rei', text: 'The probability of me living without you is... unacceptable.', expression: 'vulnerable' },
      { speaker: null, text: 'She leans in, her forehead against yours.' },
      { speaker: 'Rei', text: 'I love you. Statistically speaking. Logically. Completely. Irrevocably.', expression: 'love' },
    ],
  },

  // Miko secret scenes
  {
    id: 'miko_garden_memories',
    characterId: 'miko',
    title: 'Garden of Memories',
    description: 'Tending the garden together',
    requiredAffection: 80,
    requiredTension: 60,
    requiredStage: 'romance',
    requiredTime: 'afternoon',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'You\'re both working in the garden. Miko brushes dirt from her hands, smiling.' },
      { speaker: 'Miko', text: 'This garden... it\'s like us. It grows with care.', expression: 'warm' },
      { speaker: null, text: 'She moves closer, her shoulder touching yours.' },
      { speaker: 'Miko', text: 'I want to build something with you. Something that lasts.', expression: 'caring' },
      { speaker: null, text: 'She takes your hand, pressing it to her cheek.' },
      { speaker: 'Miko', text: 'You nourish my soul. I want to nourish yours. Always.', expression: 'love' },
    ],
  },
  {
    id: 'miko_home_cooked_love',
    characterId: 'miko',
    title: 'Home-Cooked Love',
    description: 'She makes your favorite meal with love',
    requiredAffection: 90,
    requiredTension: 75,
    requiredStage: 'partner',
    bgImage: 'https://image.qwenlm.ai/generated-images/00f49f01-3ceb-4c1b-84a7-67797b089698/_result.png',
    dialogue: [
      { speaker: null, text: 'Miko\'s kitchen is warm. The aroma of your favorite meal fills the air.' },
      { speaker: 'Miko', text: 'I made this just for you. With all my love.', expression: 'warm' },
      { speaker: null, text: 'She feeds you a bite, her eyes searching yours.' },
      { speaker: 'Miko', text: 'I want to spend every day making you happy. Feeding you. Loving you.', expression: 'love' },
      { speaker: null, text: 'She pulls you into a warm embrace.' },
      { speaker: 'Miko', text: 'You\'re my home. Wherever you are is where I belong.', expression: 'love' },
    ],
  },
];

export const getSecretScenesForCharacter = (characterId: string): SecretScene[] => {
  return secretScenes.filter(s => s.characterId === characterId);
};

export const canUnlockSecretScene = (scene: SecretScene, state: any): boolean => {
  const rel = state.relationships[scene.characterId];
  if (!rel) return false;
  
  if (rel.affection < scene.requiredAffection) return false;
  if (rel.tension < scene.requiredTension) return false;
  if (scene.requiredStage && rel.stage !== scene.requiredStage) return false;
  if (scene.requiredWeather && state.weather !== scene.requiredWeather) return false;
  if (scene.requiredTime && state.timeOfDay !== scene.requiredTime) return false;
  if (scene.requiredStat) {
    const statValue = state.playerStats[scene.requiredStat.stat as keyof typeof state.playerStats];
    if (statValue < scene.requiredStat.min) return false;
  }
  if (scene.requiredItem && !state.inventory.find((i: any) => i.giftId === scene.requiredItem)) return false;
  
  return true;
};
