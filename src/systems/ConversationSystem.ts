import { Character, GameState, RelationshipStage, Mood } from '../types';
import { characterDialogues, CONVERSATION_TOPICS, DialogueLine, DialogueResponse } from '../data/dialoguePool';

export interface ConversationState {
  characterId: string;
  currentTopic: string | null;
  turnCount: number;
  lastCharacterLine: string;
  lastPlayerResponse: string;
  memories: string[];
  mood: Mood;
}

export interface ConversationChoice {
  id: string;
  text: string;
  response: DialogueResponse;
}

export class ConversationSystem {
  private state: GameState;
  private conversation: ConversationState | null = null;

  constructor(state: GameState) {
    this.state = state;
  }

  startConversation(characterId: string): { greeting: string; mood: Mood } | null {
    const dialogue = characterDialogues[characterId];
    if (!dialogue) return null;

    // Pick a random greeting
    const greetings = dialogue.greetings;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    this.conversation = {
      characterId,
      currentTopic: null,
      turnCount: 0,
      lastCharacterLine: greeting.text,
      lastPlayerResponse: '',
      memories: [],
      mood: greeting.mood || 'neutral',
    };

    return {
      greeting: greeting.text,
      mood: greeting.mood || 'neutral',
    };
  }

  // Get the current character line for display
  getCurrentLine(): string {
    return this.conversation?.lastCharacterLine || '';
  }

  // Get current mood
  getCurrentMood(): Mood {
    return this.conversation?.mood || 'neutral';
  }

  getAvailableTopics(): Array<{ id: string; name: string; emoji: string }> {
    if (!this.conversation) return [];

    const charId = this.conversation.characterId;
    const rel = this.state.relationships[charId];
    if (!rel) return [];

    return CONVERSATION_TOPICS.filter(topic => {
      if (topic.minStage && !this.isStageAtLeast(rel.stage, topic.minStage)) return false;
      if (topic.minAffection && rel.affection < topic.minAffection) return false;
      if (topic.minTension && rel.tension < topic.minTension) return false;
      return true;
    });
  }

  private isStageAtLeast(current: RelationshipStage, required: RelationshipStage): boolean {
    const stages: RelationshipStage[] = ['stranger', 'acquaintance', 'friend', 'close_friend', 'romance', 'partner'];
    return stages.indexOf(current) >= stages.indexOf(required);
  }

  selectTopic(topicId: string): { line: string; mood: Mood } | null {
    if (!this.conversation) return null;

    // Empty topicId means go back to topic selection
    if (topicId === '') {
      this.conversation.currentTopic = null;
      return null;
    }

    const dialogue = characterDialogues[this.conversation.characterId];
    if (!dialogue || !dialogue.topics[topicId]) return null;

    const topic = dialogue.topics[topicId];
    const lines = topic.characterLines;
    
    // Filter lines by conditions
    const availableLines = lines.filter(line => {
      if (!line.conditions) return true;
      const rel = this.state.relationships[this.conversation!.characterId];
      if (!rel) return false;

      if (line.conditions.minAffection && rel.affection < line.conditions.minAffection) return false;
      if (line.conditions.minTension && rel.tension < line.conditions.minTension) return false;
      if (line.conditions.stage && !this.isStageAtLeast(rel.stage, line.conditions.stage)) return false;
      if (line.conditions.memory) {
        const hasMemory = line.conditions.memory.some(m => this.conversation!.memories.includes(m));
        if (!hasMemory) return false;
      }
      return true;
    });

    if (availableLines.length === 0) return null;

    const line = availableLines[Math.floor(Math.random() * availableLines.length)];
    
    this.conversation.currentTopic = topicId;
    this.conversation.lastCharacterLine = line.text;
    this.conversation.mood = line.mood || this.conversation.mood;
    this.conversation.turnCount++;

    return {
      line: line.text,
      mood: line.mood || 'neutral',
    };
  }

  getPlayerChoices(): ConversationChoice[] {
    if (!this.conversation || !this.conversation.currentTopic) return [];

    const dialogue = characterDialogues[this.conversation.characterId];
    if (!dialogue || !dialogue.topics[this.conversation.currentTopic]) return [];

    const topic = dialogue.topics[this.conversation.currentTopic];
    const responses = topic.playerResponses;

    return Object.entries(responses).map(([id, response]) => ({
      id,
      text: response.text,
      response,
    }));
  }

  selectChoice(choiceId: string): { 
    characterResponse: string; 
    mood: Mood;
    effects: { affection?: number; tension?: number; mood?: Mood; memory?: string };
  } | null {
    if (!this.conversation || !this.conversation.currentTopic) return null;

    const choices = this.getPlayerChoices();
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return null;

    // Apply effects
    const effects = choice.response.effects || {};
    const charId = this.conversation.characterId;
    const rel = this.state.relationships[charId];
    
    if (rel) {
      if (effects.affection) {
        rel.affection = Math.min(100, Math.max(0, rel.affection + effects.affection));
      }
      if (effects.tension) {
        rel.tension = Math.min(100, Math.max(0, rel.tension + effects.tension));
      }
      if (effects.memory) {
        this.conversation.memories.push(effects.memory);
        if (!rel.memories) rel.memories = [];
        rel.memories.push(effects.memory);
      }
    }

    this.conversation.lastPlayerResponse = choice.text;
    
    // Generate character response based on the choice
    const dialogue = characterDialogues[charId];
    const newMood = effects.mood || this.conversation.mood;
    
    // Pick a response line based on mood and context
    let responseLine = this.generateResponse(charId, choiceId, newMood);
    
    this.conversation.lastCharacterLine = responseLine;
    this.conversation.mood = newMood;
    this.conversation.turnCount++;

    return {
      characterResponse: responseLine,
      mood: newMood,
      effects,
    };
  }

  private generateResponse(charId: string, choiceId: string, mood: Mood): string {
    const dialogue = characterDialogues[charId];
    if (!dialogue) return "...";

    // Generate contextual responses based on choice type and mood
    const responses: Record<string, string[]> = {
      // Small talk responses
      good: [
        "That's good to hear!",
        "I'm glad!",
        "Nice!",
      ],
      normal: [
        "I see.",
        "Okay.",
        "Alright.",
      ],
      ask_back: [
        "Me? I've been good. Just reading and thinking.",
        "I've been well. It's nice to talk to you.",
        "Pretty good. Better now that you're here.",
      ],
      
      // Hobby responses
      interested: [
        "Really? You'd like to read my poems? That means a lot.",
        "You're interested? I'd love to share them with you sometime.",
        "That's so sweet of you to say!",
      ],
      share: [
        "That sounds interesting! We should try it together sometime.",
        "Oh, I'd like that! It could be fun.",
        "Really? That sounds nice.",
      ],
      curious: [
        "Mostly about feelings and nature. Sometimes... about you.",
        "A bit of everything. Love, loss, hope. The usual poet stuff.",
        "I write about what I feel. And lately, I've been feeling... a lot.",
      ],
      
      // Dream responses
      supportive: [
        "You really think I could do it? That means so much to me.",
        "Thank you. Having your support makes me feel like I actually can.",
        "You're so sweet. I'll work hard to make it happen.",
      ],
      share_dream: [
        "That's amazing! I hope we both achieve our dreams.",
        "I like that. Maybe our paths will cross in the future.",
        "That sounds wonderful. I'll be cheering for you.",
      ],
      ask_more: [
        "It would be about finding connection. About not feeling alone.",
        "I want to write something that helps people feel understood.",
        "Something that captures the feeling of being seen, really seen.",
      ],
      
      // Fear responses
      reassure: [
        "You really mean that? Thank you... that means everything.",
        "You see me differently than I see myself. That's... beautiful.",
        "I don't know what to say. Thank you for seeing me like that.",
      ],
      share_fear: [
        "Together... I like the sound of that.",
        "You'd face them with me? That makes me feel braver already.",
        "Thank you. I don't feel so alone anymore.",
      ],
      gentle: [
        "You always know what to say to make me feel better.",
        "Thank you. You're so kind to me.",
        "I'm lucky to have you in my life.",
      ],
      
      // Romance responses
      reciprocal: [
        "I feel it too. Being with you is... everything.",
        "Really? I... I feel the same way. More than I can say.",
        "You have no idea how long I've wanted to hear that.",
      ],
      poem: [
        "You want to hear it? Okay... it's about you, actually.",
        "I'd love to share it with you. It's called 'The One Who Sees Me'.",
        "Really? It's a bit embarrassing, but... okay.",
      ],
      intimate: [
        "Come closer? I... I'd like that.",
        "Yes. Please. I want to be near you too.",
        "My heart is racing... but I want this.",
      ],
      
      // Intimate responses
      escalate: [
        "Make it real? I... I want that. I want us.",
        "Are you sure? Because I've been dreaming about this.",
        "Yes. A thousand times yes.",
      ],
      tender: [
        "You make me feel so safe. So seen.",
        "I've never felt this way with anyone before.",
        "You're amazing, you know that?",
      ],
      promise: [
        "You promise? I'll hold you to that.",
        "Someday soon... I can't wait.",
        "I'm going to remember you said that.",
      ],
      
      // Challenge responses (for Yuki)
      challenge: [
        "Oh? You think you can beat me? We'll see about that.",
        "Bold words. I like it. Let's test that theory.",
        "Hah! You've got spirit. I respect that.",
      ],
      casual: [
        "Just the usual, huh? Same here.",
        "Nothing exciting? That's boring.",
        "Fair enough.",
      ],
      ask: [
        "Training's going well. Feeling strong.",
        "Good. I've been pushing myself hard.",
        "It's going great. I'm in the best shape of my life.",
      ],
      
      // More Yuki-specific
      relate: [
        "Yeah? Maybe we're not so different after all.",
        "I like that. We understand each other.",
        "That's... actually really nice to hear.",
      ],
      believe: [
        "You really believe in me? That... means a lot.",
        "Thank you. Having someone believe in me makes all the difference.",
        "You're the first person who's said that with such conviction.",
      ],
      encourage: [
        "The strongest? Hah! You're too kind.",
        "You really think so? Thanks. That means more than you know.",
        "I'll try to live up to that.",
      ],
      strong: [
        "You'd be there even if I failed? ...Thank you.",
        "That's... really comforting to hear.",
        "I don't know what I'd do without you.",
      ],
      real: [
        "Together, huh? I like the sound of that.",
        "You'd face them with me? That's... brave of you.",
        "Thank you. I feel braver already.",
      ],
      direct: [
        "More than I know? That's... a lot. But I like it.",
        "I feel the same. More than I usually admit.",
        "Good. Because I'm not letting you go.",
      ],
      seen_real: [
        "You see the real me? ...Thank you. That's everything.",
        "You're the only one who does. Don't ever stop seeing me.",
        "I've never felt so seen before.",
      ],
      bold: [
        "Everything? You're brave. I like that.",
        "All of me? That's... intense. But I want it.",
        "Show you? Okay. But be prepared for what you see.",
      ],
      action: [
        "*leans in* Like that. Closer.",
        "Yes. Like that. Don't stop.",
        "*heart racing* This is... perfect.",
      ],
    };

    const options = responses[choiceId] || ["..."];
    return options[Math.floor(Math.random() * options.length)];
  }

  getReaction(type: 'gift_liked' | 'gift_disliked' | 'gift_neutral' | 'flirt_success' | 'flirt_fail' | 'compliment' | 'question'): { text: string; mood: Mood } | null {
    if (!this.conversation) return null;

    const dialogue = characterDialogues[this.conversation.characterId];
    if (!dialogue) return null;

    const reactions = dialogue.reactions[type];
    if (!reactions || reactions.length === 0) return null;

    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    this.conversation.lastCharacterLine = reaction.text;
    this.conversation.mood = reaction.mood || this.conversation.mood;

    return {
      text: reaction.text,
      mood: reaction.mood || 'neutral',
    };
  }

  endConversation(): void {
    this.conversation = null;
  }

  getConversation(): ConversationState | null {
    return this.conversation;
  }

  isActive(): boolean {
    return this.conversation !== null;
  }
}
