import { Character, GameState, RelationshipStage, Mood, TimeOfDay, Weather } from '../types';

export interface ConversationNode {
  id: string;
  speaker: string | null;
  text: string;
  expression?: Mood;
  choices?: ConversationChoice[];
  conditions?: ConversationCondition[];
  effects?: ConversationEffect[];
  nextNodeId?: string;
}

export interface ConversationChoice {
  id: string;
  text: string;
  emoji?: string;
  conditions?: ConversationCondition[];
  effects?: ConversationEffect[];
  nextNodeId: string;
  type?: 'normal' | 'flirt' | 'bold' | 'special' | 'intimate';
}

export interface ConversationCondition {
  type: 'affection' | 'tension' | 'stage' | 'time' | 'weather' | 'stat' | 'item' | 'mood' | 'previous';
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'neq' | 'includes';
  value: any;
  characterId?: string;
}

export interface ConversationEffect {
  type: 'affection' | 'tension' | 'stat' | 'mood' | 'item' | 'unlock' | 'flag';
  value: any;
  target?: string;
}

export interface ConversationTree {
  id: string;
  characterId: string;
  trigger: {
    location?: string[];
    time?: TimeOfDay[];
    weather?: Weather[];
    minAffection?: number;
    minTension?: number;
    stage?: RelationshipStage;
    requiredItem?: string;
    requiredFlag?: string;
  };
  nodes: Record<string, ConversationNode>;
  startNode: string;
}

export class ConversationEngine {
  private state: GameState;
  private activeConversation: ConversationTree | null = null;
  private currentNodeId: string = '';
  private conversationHistory: string[] = [];

  constructor(state: GameState) {
    this.state = state;
  }

  // Check if conditions are met
  checkConditions(conditions: ConversationCondition[] | undefined): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every(condition => {
      const { type, operator, value, characterId } = condition;
      
      switch (type) {
        case 'affection': {
          const rel = characterId ? this.state.relationships[characterId] : null;
          if (!rel) return false;
          return this.compare(rel.affection, operator, value);
        }
        case 'tension': {
          const rel = characterId ? this.state.relationships[characterId] : null;
          if (!rel) return false;
          return this.compare(rel.tension, operator, value);
        }
        case 'stage': {
          const rel = characterId ? this.state.relationships[characterId] : null;
          if (!rel) return false;
          return this.compare(rel.stage, operator, value);
        }
        case 'time':
          return this.compare(this.state.timeOfDay, operator, value);
        case 'weather':
          return this.compare(this.state.weather, operator, value);
        case 'stat': {
          const statValue = this.state.playerStats[value.stat as keyof typeof this.state.playerStats];
          return this.compare(statValue, operator, value.min);
        }
        case 'item':
          return this.state.inventory.some(i => i.giftId === value) === (operator === 'includes');
        case 'mood': {
          const rel = characterId ? this.state.relationships[characterId] : null;
          if (!rel) return false;
          return this.compare(rel.lastMood || 'neutral', operator, value);
        }
        case 'previous':
          return this.conversationHistory.includes(value) === (operator === 'includes');
        default:
          return false;
      }
    });
  }

  private compare(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'eq': return actual === expected;
      case 'neq': return actual !== expected;
      case 'gt': return actual > expected;
      case 'lt': return actual < expected;
      case 'gte': return actual >= expected;
      case 'lte': return actual <= expected;
      case 'includes': return Array.isArray(actual) ? actual.includes(expected) : false;
      default: return false;
    }
  }

  // Apply effects from choices/nodes
  applyEffects(effects: ConversationEffect[] | undefined): void {
    if (!effects) return;

    effects.forEach(effect => {
      const { type, value, target } = effect;

      switch (type) {
        case 'affection': {
          if (target) {
            const rel = this.state.relationships[target];
            if (rel) {
              rel.affection = Math.max(0, Math.min(100, rel.affection + value));
            }
          }
          break;
        }
        case 'tension': {
          if (target) {
            const rel = this.state.relationships[target];
            if (rel) {
              rel.tension = Math.max(0, Math.min(100, rel.tension + value));
            }
          }
          break;
        }
        case 'stat': {
          const statKey = value.stat as keyof typeof this.state.playerStats;
          this.state.playerStats[statKey] = Math.max(0, Math.min(100, this.state.playerStats[statKey] + value.amount));
          break;
        }
        case 'mood': {
          if (target) {
            const rel = this.state.relationships[target];
            if (rel) {
              rel.lastMood = value;
            }
          }
          break;
        }
        case 'item': {
          const existing = this.state.inventory.find(i => i.giftId === value);
          if (existing) {
            existing.quantity += 1;
          } else {
            this.state.inventory.push({ giftId: value, quantity: 1 });
          }
          break;
        }
        case 'unlock': {
          if (!this.state.unlockedScenes.includes(value)) {
            this.state.unlockedScenes.push(value);
          }
          break;
        }
        case 'flag': {
          if (!this.state.flags.includes(value)) {
            this.state.flags.push(value);
          }
          break;
        }
      }
    });
  }

  // Start a conversation
  startConversation(tree: ConversationTree): ConversationNode | null {
    this.activeConversation = tree;
    this.currentNodeId = tree.startNode;
    this.conversationHistory = [];
    return this.getCurrentNode();
  }

  // Get current node
  getCurrentNode(): ConversationNode | null {
    if (!this.activeConversation) return null;
    return this.activeConversation.nodes[this.currentNodeId] || null;
  }

  // Make a choice
  makeChoice(choiceId: string): ConversationNode | null {
    if (!this.activeConversation) return null;

    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices) return null;

    const choice = currentNode.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    // Check choice conditions
    if (!this.checkConditions(choice.conditions)) return null;

    // Apply choice effects
    this.applyEffects(choice.effects);

    // Record in history
    this.conversationHistory.push(choiceId);

    // Move to next node
    this.currentNodeId = choice.nextNodeId;

    // Apply node effects
    const nextNode = this.getCurrentNode();
    if (nextNode) {
      this.applyEffects(nextNode.effects);
    }

    return nextNode;
  }

  // Advance to next node (for nodes without choices)
  advance(): ConversationNode | null {
    if (!this.activeConversation) return null;

    const currentNode = this.getCurrentNode();
    if (!currentNode) return null;

    // Apply current node effects
    this.applyEffects(currentNode.effects);

    // Move to next node if specified
    if (currentNode.nextNodeId) {
      this.currentNodeId = currentNode.nextNodeId;
      const nextNode = this.getCurrentNode();
      if (nextNode) {
        this.applyEffects(nextNode.effects);
      }
      return nextNode;
    }

    return null; // End of conversation
  }

  // Get available choices (filtered by conditions)
  getAvailableChoices(): ConversationChoice[] {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices) return [];

    return currentNode.choices.filter(choice => 
      this.checkConditions(choice.conditions)
    );
  }

  // End conversation
  endConversation(): void {
    this.activeConversation = null;
    this.currentNodeId = '';
    this.conversationHistory = [];
  }

  // Check if conversation is active
  isActive(): boolean {
    return this.activeConversation !== null;
  }
}
