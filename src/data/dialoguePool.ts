import { Character, GameState, RelationshipStage, Mood } from '../types';

export interface DialogueLine {
  text: string;
  mood?: Mood;
  conditions?: {
    minAffection?: number;
    minTension?: number;
    stage?: RelationshipStage;
    weather?: string[];
    time?: string[];
    location?: string[];
    memory?: string[]; // Requires previous conversation topic
  };
}

export interface DialogueResponse {
  text: string;
  effects?: {
    affection?: number;
    tension?: number;
    mood?: Mood;
    memory?: string; // What to remember
  };
}

export interface ConversationTopic {
  id: string;
  name: string;
  emoji: string;
  minStage?: RelationshipStage;
  minAffection?: number;
  minTension?: number;
}

export interface CharacterDialogue {
  greetings: DialogueLine[];
  topics: Record<string, {
    characterLines: DialogueLine[];
    playerResponses: Record<string, DialogueResponse>;
  }>;
  reactions: {
    gift_liked: DialogueLine[];
    gift_disliked: DialogueLine[];
    gift_neutral: DialogueLine[];
    flirt_success: DialogueLine[];
    flirt_fail: DialogueLine[];
    compliment: DialogueLine[];
    question: DialogueLine[];
  };
}

// Conversation topics available at different stages
export const CONVERSATION_TOPICS: ConversationTopic[] = [
  { id: 'small_talk', name: 'Small Talk', emoji: '💬', minStage: 'stranger' },
  { id: 'hobbies', name: 'Hobbies & Interests', emoji: '🎨', minStage: 'acquaintance' },
  { id: 'dreams', name: 'Dreams & Goals', emoji: '✨', minStage: 'friend', minAffection: 25 },
  { id: 'fears', name: 'Fears & Vulnerabilities', emoji: '😰', minStage: 'close_friend', minAffection: 45 },
  { id: 'romance', name: 'Romance & Feelings', emoji: '💕', minStage: 'romance', minAffection: 70 },
  { id: 'intimate', name: 'Intimate Moments', emoji: '🔥', minStage: 'romance', minTension: 50 },
];

// SAKURA'S DIALOGUE POOL
export const sakuraDialogue: CharacterDialogue = {
  greetings: [
    { text: "Oh! H-hello... I didn't see you there.", mood: 'shy' },
    { text: "Hi there! The library is nice and quiet today, isn't it?", mood: 'happy' },
    { text: "You came to visit? That's... really nice of you.", mood: 'happy' },
    { text: "I was just reading something interesting. Want to hear about it?", mood: 'excited' },
    { text: "I saved you a seat by the window. The light is perfect today.", mood: 'warm' },
  ],
  topics: {
    small_talk: {
      characterLines: [
        { text: "How's your day been? Did anything interesting happen?", mood: 'neutral' },
        { text: "The weather is lovely today, don't you think?", mood: 'happy' },
        { text: "I've been meaning to ask... do you come here often?", mood: 'shy' },
      ],
      playerResponses: {
        good: {
          text: "It's been great, especially now that I'm here with you.",
          effects: { affection: 3, mood: 'flustered' }
        },
        normal: {
          text: "Pretty good, just the usual school stuff.",
          effects: { affection: 1 }
        },
        ask_back: {
          text: "It's been alright. How about you? What have you been up to?",
          effects: { affection: 2, mood: 'happy' }
        }
      }
    },
    hobbies: {
      characterLines: [
        { text: "I've been reading a lot of poetry lately. There's something about the way words can capture feelings...", mood: 'thinking' },
        { text: "Do you have any hobbies? I'd love to know more about what you enjoy.", mood: 'curious' },
        { text: "I sometimes write my own poems. They're not very good, but it helps me think.", mood: 'shy' },
      ],
      playerResponses: {
        interested: {
          text: "Poetry sounds beautiful. I'd love to read some of your work sometime.",
          effects: { affection: 5, mood: 'flustered', memory: 'sakura_poetry_interest' }
        },
        share: {
          text: "I like [hobby]. Maybe we could do something together sometime?",
          effects: { affection: 4, mood: 'happy', memory: 'sakura_shared_hobby' }
        },
        curious: {
          text: "What kind of poetry do you write? Love poems? Nature?",
          effects: { affection: 3, mood: 'thinking' }
        }
      }
    },
    dreams: {
      characterLines: [
        { text: "I sometimes dream about traveling the world... visiting all the famous libraries.", mood: 'thinking' },
        { text: "What do you want to do after graduation? I've been thinking about it a lot.", mood: 'serious' },
        { text: "I want to write a book someday. Something that helps people feel less alone.", mood: 'vulnerable' },
      ],
      playerResponses: {
        supportive: {
          text: "That's amazing. I think you'd write something beautiful. I'd buy the first copy.",
          effects: { affection: 7, tension: 3, mood: 'flustered', memory: 'sakura_dream_support' }
        },
        share_dream: {
          text: "I want to [dream]. Maybe our paths will cross in the future.",
          effects: { affection: 5, mood: 'happy', memory: 'shared_dreams' }
        },
        ask_more: {
          text: "Tell me more. What would your book be about?",
          effects: { affection: 4, mood: 'excited' }
        }
      }
    },
    fears: {
      characterLines: [
        { text: "Can I tell you something? Sometimes I feel like I'm not... enough. Like I'm too quiet, too boring.", mood: 'vulnerable' },
        { text: "I'm scared of being forgotten. Of not leaving any mark on the world.", mood: 'sad' },
        { text: "Do you ever feel like you don't belong anywhere? I feel that way sometimes.", mood: 'vulnerable' },
      ],
      playerResponses: {
        reassure: {
          text: "You're not boring. You're one of the most interesting people I know. Quiet doesn't mean boring.",
          effects: { affection: 8, tension: 5, mood: 'flustered', memory: 'sakura_reassured' }
        },
        share_fear: {
          text: "I understand. I have my own fears too. But we can face them together.",
          effects: { affection: 10, tension: 8, mood: 'warm', memory: 'shared_fears' }
        },
        gentle: {
          text: "It's okay to feel that way. But I see how amazing you are, even if you don't.",
          effects: { affection: 6, mood: 'warm' }
        }
      }
    },
    romance: {
      characterLines: [
        { text: "I never believed in love at first sight, but... being with you feels like something I've been waiting for.", mood: 'love' },
        { text: "When I'm with you, even silence feels comfortable. Is that strange?", mood: 'shy' },
        { text: "I wrote a poem about you. Would you... want to hear it?", mood: 'flustered' },
      ],
      playerResponses: {
        reciprocal: {
          text: "I feel the same way. Being with you makes everything better.",
          effects: { affection: 10, tension: 10, mood: 'love', memory: 'mutual_feelings' }
        },
        poem: {
          text: "I'd love to hear your poem. Your words always mean so much.",
          effects: { affection: 8, tension: 8, mood: 'flustered', memory: 'sakura_poem_shared' }
        },
        intimate: {
          text: "Come closer. I want to be near you.",
          effects: { affection: 8, tension: 15, mood: 'flustered', memory: 'intimate_moment' }
        }
      }
    },
    intimate: {
      characterLines: [
        { text: "When you look at me like that, my heart races. I can't help it.", mood: 'flustered' },
        { text: "I've been thinking about what it would be like to... kiss you.", mood: 'flustered' },
        { text: "Can I tell you a secret? I sometimes imagine us together, just the two of us.", mood: 'vulnerable' },
      ],
      playerResponses: {
        escalate: {
          text: "I've been thinking about that too. Want to make it real?",
          effects: { affection: 12, tension: 20, mood: 'flustered', memory: 'intimate_escalation' }
        },
        tender: {
          text: "You're so beautiful when you're flustered. Come here.",
          effects: { affection: 10, tension: 18, mood: 'love', memory: 'tender_moment' }
        },
        promise: {
          text: "Someday soon, I want to make all your imaginations come true.",
          effects: { affection: 10, tension: 15, mood: 'love', memory: 'future_promise' }
        }
      }
    }
  },
  reactions: {
    gift_liked: [
      { text: "Oh my gosh! This is... this is perfect! How did you know?", mood: 'excited' },
      { text: "I love it! You really understand me, don't you?", mood: 'love' },
      { text: "This means so much to me. Thank you!", mood: 'warm' },
    ],
    gift_disliked: [
      { text: "Oh... um... thank you, I guess?", mood: 'sad' },
      { text: "It's nice, but... it's not really my thing.", mood: 'neutral' },
    ],
    gift_neutral: [
      { text: "Oh, for me? That's very thoughtful of you.", mood: 'happy' },
      { text: "Thank you! This is very kind.", mood: 'happy' },
    ],
    flirt_success: [
      { text: "Y-you can't just say things like that! My heart can't take it!", mood: 'flustered' },
      { text: "Stop it... you're making me blush so much!", mood: 'flustered' },
      { text: "I... I don't know what to say! You're amazing!", mood: 'flustered' },
    ],
    flirt_fail: [
      { text: "Oh... um... that was a bit much, don't you think?", mood: 'neutral' },
      { text: "I'm not sure what to say to that...", mood: 'neutral' },
    ],
    compliment: [
      { text: "R-really? You think so? That means a lot coming from you.", mood: 'flustered' },
      { text: "You always know how to make me feel special.", mood: 'warm' },
    ],
    question: [
      { text: "That's a good question! Let me think...", mood: 'thinking' },
      { text: "Hmm, I've never thought about it that way before.", mood: 'thinking' },
    ]
  }
};

// YUKI'S DIALOGUE POOL
export const yukiDialogue: CharacterDialogue = {
  greetings: [
    { text: "Hey. You're here. Good.", mood: 'neutral' },
    { text: "Took you long enough. I was about to start without you.", mood: 'smirk' },
    { text: "Finally! I've been waiting. Don't make me wait again.", mood: 'neutral' },
    { text: "You showed up. I was starting to think you'd bail.", mood: 'neutral' },
  ],
  topics: {
    small_talk: {
      characterLines: [
        { text: "So, what's new? Anything exciting happen lately?", mood: 'neutral' },
        { text: "You look like you've got something on your mind. Spill it.", mood: 'neutral' },
        { text: "I've been training hard. Feeling stronger every day.", mood: 'happy' },
      ],
      playerResponses: {
        challenge: {
          text: "Not much. But I bet I could still beat you in a race.",
          effects: { affection: 4, mood: 'smirk', memory: 'yuki_challenge' }
        },
        casual: {
          text: "Just the usual. School, training, you know.",
          effects: { affection: 1 }
        },
        ask: {
          text: "Same old. What about you? How's training going?",
          effects: { affection: 2, mood: 'happy' }
        }
      }
    },
    hobbies: {
      characterLines: [
        { text: "Running isn't just a hobby for me. It's... everything. It's how I think.", mood: 'serious' },
        { text: "What do you do for fun? Don't tell me you just sit around.", mood: 'smirk' },
        { text: "I used to think I was alone in this. But maybe... not anymore.", mood: 'soft' },
      ],
      playerResponses: {
        relate: {
          text: "I get it. For me, it's about pushing limits too. We're not so different.",
          effects: { affection: 5, mood: 'soft', memory: 'yuki_connection' }
        },
        challenge: {
          text: "I have my own things. Maybe I'll show you sometime.",
          effects: { affection: 4, mood: 'smirk', memory: 'yuki_mystery' }
        },
        support: {
          text: "Running sounds intense. I'd like to see you in action sometime.",
          effects: { affection: 3, mood: 'happy' }
        }
      }
    },
    dreams: {
      characterLines: [
        { text: "I want to go to the Olympics. I know it sounds crazy, but I'm serious.", mood: 'serious' },
        { text: "Sometimes I wonder if I'm good enough. If I can really make it.", mood: 'vulnerable' },
        { text: "What about you? What's your big dream?", mood: 'neutral' },
      ],
      playerResponses: {
        believe: {
          text: "It's not crazy. I've seen you run. You're going to make it, I know it.",
          effects: { affection: 7, tension: 3, mood: 'soft', memory: 'yuki_belief' }
        },
        share: {
          text: "My dream is [dream]. Maybe we can chase them together.",
          effects: { affection: 5, mood: 'happy', memory: 'shared_dreams' }
        },
        encourage: {
          text: "You're the strongest person I know. Of course you'll make it.",
          effects: { affection: 6, mood: 'flustered' }
        }
      }
    },
    fears: {
      characterLines: [
        { text: "I'm scared of failing. Of all this work meaning nothing.", mood: 'vulnerable' },
        { text: "People think I'm tough, but... I'm not. Not really.", mood: 'vulnerable' },
        { text: "What if I'm not enough? What if I never am?", mood: 'sad' },
      ],
      playerResponses: {
        strong: {
          text: "You're stronger than you think. And even if you fail, I'll be there.",
          effects: { affection: 8, tension: 5, mood: 'flustered', memory: 'yuki_support' }
        },
        real: {
          text: "I have fears too. But we don't have to face them alone.",
          effects: { affection: 10, tension: 8, mood: 'soft', memory: 'shared_fears' }
        },
        challenge: {
          text: "You? Scared? I don't buy it. Show me what you're really made of.",
          effects: { affection: 5, mood: 'smirk' }
        }
      }
    },
    romance: {
      characterLines: [
        { text: "I never thought I'd say this, but... I like having you around.", mood: 'soft' },
        { text: "You're the only person who doesn't treat me like I'm made of ice.", mood: 'vulnerable' },
        { text: "Being with you feels... different. In a good way.", mood: 'flustered' },
      ],
      playerResponses: {
        direct: {
          text: "I like having you around too. More than you know.",
          effects: { affection: 10, tension: 10, mood: 'flustered', memory: 'mutual_feelings' }
        },
        challenge: {
          text: "Different how? Come on, tell me.",
          effects: { affection: 6, tension: 8, mood: 'flustered' }
        },
        tender: {
          text: "You're not ice. You're warm. I see the real you.",
          effects: { affection: 8, tension: 12, mood: 'love', memory: 'seen_real' }
        }
      }
    },
    intimate: {
      characterLines: [
        { text: "When you look at me like that, I forget how to be tough.", mood: 'flustered' },
        { text: "I want to show you something. Something I don't show anyone.", mood: 'vulnerable' },
        { text: "Come closer. I want to feel you near me.", mood: 'flustered' },
      ],
      playerResponses: {
        bold: {
          text: "Show me everything. I want to know all of you.",
          effects: { affection: 12, tension: 20, mood: 'flustered', memory: 'intimate_reveal' }
        },
        tender: {
          text: "You don't have to be tough with me. Just be you.",
          effects: { affection: 10, tension: 18, mood: 'love', memory: 'vulnerable_moment' }
        },
        action: {
          text: "*pulls you close* Like this?",
          effects: { affection: 10, tension: 22, mood: 'flustered', memory: 'physical_intimacy' }
        }
      }
    }
  },
  reactions: {
    gift_liked: [
      { text: "This is... actually pretty cool. Thanks.", mood: 'happy' },
      { text: "Not bad. You know me better than I thought.", mood: 'smirk' },
    ],
    gift_disliked: [
      { text: "This isn't really my thing, but... thanks anyway.", mood: 'neutral' },
      { text: "I appreciate the thought, but I'm not really into this.", mood: 'neutral' },
    ],
    gift_neutral: [
      { text: "Oh, for me? Thanks.", mood: 'neutral' },
      { text: "That's nice of you.", mood: 'neutral' },
    ],
    flirt_success: [
      { text: "Hah! You've got guts saying that to my face.", mood: 'smirk' },
      { text: "Keep talking like that and I might actually blush.", mood: 'flustered' },
      { text: "You're playing with fire. I like it.", mood: 'smirk' },
    ],
    flirt_fail: [
      { text: "That was weak. Try harder.", mood: 'neutral' },
      { text: "You can do better than that.", mood: 'smirk' },
    ],
    compliment: [
      { text: "Don't think flattery will work on me. ...But thanks.", mood: 'smirk' },
      { text: "You're not so bad yourself.", mood: 'smirk' },
    ],
    question: [
      { text: "Straight to the point. I like that.", mood: 'neutral' },
      { text: "Fine, I'll answer. But you owe me one.", mood: 'smirk' },
    ]
  }
};

// HINA'S DIALOGUE POOL
export const hinaDialogue: CharacterDialogue = {
  greetings: [
    { text: "La la la~! Oh! Hi there! Want to hear what I've been working on?", mood: 'excited' },
    { text: "Hey hey! You came to visit! That makes my day!", mood: 'happy' },
    { text: "I was just composing something new. Perfect timing!", mood: 'excited' },
    { text: "You have a nice smile today! That's a C-major kind of smile!", mood: 'happy' },
  ],
  topics: {
    small_talk: {
      characterLines: [
        { text: "How's your day been? Tell me everything!", mood: 'excited' },
        { text: "I've been humming all day. I think it's because I saw you earlier!", mood: 'flustered' },
        { text: "Did anything interesting happen? I want to hear all about it!", mood: 'curious' },
      ],
      playerResponses: {
        good: { text: "It's been great, especially now that I'm here with you.", effects: { affection: 3, mood: 'flustered' } },
        normal: { text: "Pretty good, just the usual.", effects: { affection: 1 } },
        ask_back: { text: "It's been alright. What have you been up to?", effects: { affection: 2, mood: 'happy' } }
      }
    },
    hobbies: {
      characterLines: [
        { text: "I've been working on a new song! It's inspired by... well, someone special.", mood: 'flustered' },
        { text: "Do you play any instruments? We could make music together!", mood: 'excited' },
        { text: "Music is how I express what I can't say in words. It's my truest self.", mood: 'thinking' },
      ],
      playerResponses: {
        interested: { text: "I'd love to hear your new song! Can you play it for me?", effects: { affection: 5, mood: 'flustered', memory: 'hina_song_request' } },
        share: { text: "I don't play, but I'd love to be your audience anytime.", effects: { affection: 4, mood: 'happy', memory: 'hina_audience' } },
        curious: { text: "Who's the song inspired by? Don't be shy!", effects: { affection: 3, mood: 'flustered' } }
      }
    },
    dreams: {
      characterLines: [
        { text: "I want to perform at Budokan someday! The biggest stage in Japan!", mood: 'excited' },
        { text: "Sometimes I dream about writing a song that makes people cry happy tears.", mood: 'thinking' },
        { text: "I want my music to reach someone out there. Just one person who really needs it.", mood: 'vulnerable' },
      ],
      playerResponses: {
        supportive: { text: "You're going to make it. I can feel it. Your music is special.", effects: { affection: 7, tension: 3, mood: 'flustered', memory: 'hina_dream_support' } },
        share_dream: { text: "I have my own dreams. Maybe we can achieve them together.", effects: { affection: 5, mood: 'happy', memory: 'shared_dreams' } },
        ask_more: { text: "Tell me more about Budokan! What would you play first?", effects: { affection: 4, mood: 'excited' } }
      }
    },
    fears: {
      characterLines: [
        { text: "I'm scared of being forgotten. Of my music not mattering.", mood: 'sad' },
        { text: "Sometimes I feel like I'm just making noise. Like no one really hears me.", mood: 'vulnerable' },
        { text: "What if I'm not talented enough? What if all this practice means nothing?", mood: 'sad' },
      ],
      playerResponses: {
        reassure: { text: "I hear you. Every note. Every word. You matter to me.", effects: { affection: 8, tension: 5, mood: 'flustered', memory: 'hina_reassured' } },
        share_fear: { text: "I have fears too. But we can face them together, one song at a time.", effects: { affection: 10, tension: 8, mood: 'warm', memory: 'shared_fears' } },
        gentle: { text: "Your music already matters. It matters to me. That's enough.", effects: { affection: 6, mood: 'warm' } }
      }
    },
    romance: {
      characterLines: [
        { text: "Every love song I hear now makes me think of you. Is that weird?", mood: 'flustered' },
        { text: "I wrote you a melody in my head. It plays on repeat all day long.", mood: 'love' },
        { text: "Being with you feels like the perfect harmony. Everything just... fits.", mood: 'love' },
      ],
      playerResponses: {
        reciprocal: { text: "You're my favorite song. The one I never want to stop playing.", effects: { affection: 10, tension: 10, mood: 'love', memory: 'mutual_feelings' } },
        poem: { text: "Play it for me. I want to hear the song you wrote in your heart.", effects: { affection: 8, tension: 8, mood: 'flustered', memory: 'hina_heart_song' } },
        intimate: { text: "Come here. Let me be your harmony.", effects: { affection: 8, tension: 15, mood: 'flustered', memory: 'intimate_moment' } }
      }
    },
    intimate: {
      characterLines: [
        { text: "When you touch me, I feel like a song reaching its crescendo.", mood: 'flustered' },
        { text: "I want to write our love story. In music. In moments. In us.", mood: 'love' },
        { text: "Can I stay close to you? Just like this? Forever?", mood: 'vulnerable' },
      ],
      playerResponses: {
        escalate: { text: "Forever isn't long enough. I want eternity with you.", effects: { affection: 12, tension: 20, mood: 'love', memory: 'intimate_escalation' } },
        tender: { text: "You're my favorite melody. Let me hold you.", effects: { affection: 10, tension: 18, mood: 'love', memory: 'tender_moment' } },
        promise: { text: "Stay close. Always. I'll write you a thousand songs.", effects: { affection: 10, tension: 15, mood: 'love', memory: 'future_promise' } }
      }
    }
  },
  reactions: {
    gift_liked: [
      { text: "OMG!! This is amazing! You're the best!", mood: 'excited' },
      { text: "I love it! I love it! I LOVE IT!", mood: 'excited' },
      { text: "You really know how to make me happy!", mood: 'happy' },
    ],
    gift_disliked: [
      { text: "Oh... um... it's nice, I guess?", mood: 'neutral' },
      { text: "That's... not really my style, but thanks!", mood: 'neutral' },
    ],
    gift_neutral: [
      { text: "Oh, for me? That's so sweet!", mood: 'happy' },
      { text: "Thank you! You're too kind!", mood: 'happy' },
    ],
    flirt_success: [
      { text: "KYAAA! You can't just say things like that! My heart!", mood: 'flustered' },
      { text: "Stop it! I'm going to explode from cuteness overload!", mood: 'flustered' },
      { text: "You're making me compose love songs in real time!", mood: 'flustered' },
    ],
    flirt_fail: [
      { text: "Hehe, that was cute! Try again?", mood: 'happy' },
      { text: "Aww, nice try! But I think you can do better!", mood: 'happy' },
    ],
    compliment: [
      { text: "You're making me blush! But keep going!", mood: 'flustered' },
      { text: "Right back at you, handsome!", mood: 'happy' },
    ],
    question: [
      { text: "Ooh, good question! Let me think of a song about it!", mood: 'thinking' },
      { text: "Hmm, that's deep! Like a bass note!", mood: 'thinking' },
    ]
  }
};

// REI'S DIALOGUE POOL
export const reiDialogue: CharacterDialogue = {
  greetings: [
    { text: "You're late by exactly 3 minutes. I've been timing you.", mood: 'neutral' },
    { text: "Ah. You're here. I was... not waiting. Just observing the area.", mood: 'smirk' },
    { text: "Interesting timing. I was just thinking about you. Statistically speaking.", mood: 'thinking' },
    { text: "Welcome. I've prepared tea. Don't read into it.", mood: 'neutral' },
  ],
  topics: {
    small_talk: {
      characterLines: [
        { text: "How has your day been? I've been analyzing the optimal schedule.", mood: 'thinking' },
        { text: "You seem... different today. My observations suggest something is on your mind.", mood: 'curious' },
        { text: "I've been reviewing some data. Care to discuss something intellectual?", mood: 'neutral' },
      ],
      playerResponses: {
        good: { text: "It's been productive. Being here with you adds value.", effects: { affection: 3, mood: 'smirk' } },
        normal: { text: "Fine. The usual variables.", effects: { affection: 1 } },
        ask_back: { text: "It's been fine. What have you been analyzing?", effects: { affection: 2, mood: 'thinking' } }
      }
    },
    hobbies: {
      characterLines: [
        { text: "I play chess. It's the only game where I can predict all outcomes. Except yours.", mood: 'smirk' },
        { text: "I read extensively. Currently studying behavioral psychology. Fascinating subject.", mood: 'thinking' },
        { text: "My hobbies are... efficient. Unlike most people's. No offense.", mood: 'smirk' },
      ],
      playerResponses: {
        interested: { text: "Chess sounds intriguing. I'd love a match sometime.", effects: { affection: 5, mood: 'smirk', memory: 'rei_chess' } },
        share: { text: "I have my own interests. Maybe I'll share them with you.", effects: { affection: 4, mood: 'curious', memory: 'rei_mystery' } },
        curious: { text: "Behavioral psychology? Are you studying me?", effects: { affection: 3, mood: 'smirk' } }
      }
    },
    dreams: {
      characterLines: [
        { text: "I plan to attend Tokyo University. Then perhaps... MIT. The data supports this path.", mood: 'serious' },
        { text: "I want to understand everything. Every system. Every pattern. Except... you.", mood: 'vulnerable' },
        { text: "My dream is to create order from chaos. To make the world predictable.", mood: 'thinking' },
      ],
      playerResponses: {
        supportive: { text: "You'll achieve it. Your mind is unmatched. I believe in your data.", effects: { affection: 7, tension: 3, mood: 'soft', memory: 'rei_belief' } },
        share_dream: { text: "I have my own ambitions. Perhaps our paths will align.", effects: { affection: 5, mood: 'thinking', memory: 'shared_dreams' } },
        ask_more: { text: "Why not understand me? Am I that unpredictable?", effects: { affection: 4, tension: 5, mood: 'flustered' } }
      }
    },
    fears: {
      characterLines: [
        { text: "I fear... losing control. Of situations. Of myself. Of... this.", mood: 'vulnerable' },
        { text: "What if my predictions are wrong? What if I can't account for every variable?", mood: 'vulnerable' },
        { text: "I've built walls around my heart. What if no one ever climbs them?", mood: 'sad' },
      ],
      playerResponses: {
        reassure: { text: "You don't need to control everything. Some things are meant to be felt.", effects: { affection: 8, tension: 5, mood: 'flustered', memory: 'rei_reassured' } },
        share_fear: { text: "I have fears too. But with you, mine feel smaller.", effects: { affection: 10, tension: 8, mood: 'soft', memory: 'shared_fears' } },
        gentle: { text: "I climbed your wall. I'm here. That should tell you something.", effects: { affection: 6, tension: 8, mood: 'flustered' } }
      }
    },
    romance: {
      characterLines: [
        { text: "My analysis indicates a 97.3% probability that I'm developing feelings for you.", mood: 'flustered' },
        { text: "You're an anomaly in my data. A beautiful, unpredictable anomaly.", mood: 'soft' },
        { text: "I've run the numbers. Being with you increases my happiness index by 340%.", mood: 'smirk' },
      ],
      playerResponses: {
        reciprocal: { text: "My feelings for you don't need statistics. They just are.", effects: { affection: 10, tension: 10, mood: 'love', memory: 'mutual_feelings' } },
        poem: { text: "Forget the numbers. Tell me how you feel. In your own words.", effects: { affection: 8, tension: 8, mood: 'vulnerable', memory: 'rei_words' } },
        intimate: { text: "Come here. Let me be your one unpredictable variable.", effects: { affection: 8, tension: 15, mood: 'flustered', memory: 'intimate_moment' } }
      }
    },
    intimate: {
      characterLines: [
        { text: "My heart rate elevates in your presence. This is... statistically significant.", mood: 'flustered' },
        { text: "I want to study you. Up close. Every detail. Every reaction.", mood: 'intense' },
        { text: "For the first time, I don't want to predict what happens next. I want to feel it.", mood: 'vulnerable' },
      ],
      playerResponses: {
        escalate: { text: "Then feel this. No analysis. Just us.", effects: { affection: 12, tension: 20, mood: 'love', memory: 'intimate_escalation' } },
        tender: { text: "You don't need to understand everything. Just feel me.", effects: { affection: 10, tension: 18, mood: 'love', memory: 'tender_moment' } },
        promise: { text: "I'll be your favorite anomaly. Forever.", effects: { affection: 10, tension: 15, mood: 'love', memory: 'future_promise' } }
      }
    }
  },
  reactions: {
    gift_liked: [
      { text: "This is... acceptable. Thank you. I'll put it to efficient use.", mood: 'smirk' },
      { text: "My analysis suggests this is an excellent choice. Well done.", mood: 'smirk' },
      { text: "Hmm. You understand me better than I expected.", mood: 'soft' },
    ],
    gift_disliked: [
      { text: "This doesn't align with my preferences. But... noted.", mood: 'neutral' },
      { text: "I appreciate the gesture, even if the item is suboptimal.", mood: 'neutral' },
    ],
    gift_neutral: [
      { text: "An interesting choice. Thank you.", mood: 'neutral' },
      { text: "I'll find a use for this. Thank you.", mood: 'neutral' },
    ],
    flirt_success: [
      { text: "Your approach is... effective. I'll allow it.", mood: 'smirk' },
      { text: "Hmph. You're playing dangerous games. I don't dislike it.", mood: 'flustered' },
      { text: "My composure is intact. Barely.", mood: 'flustered' },
    ],
    flirt_fail: [
      { text: "That was illogical. Try a different approach.", mood: 'neutral' },
      { text: "Your strategy needs revision.", mood: 'smirk' },
    ],
    compliment: [
      { text: "Flattery is inefficient. But... thank you.", mood: 'smirk' },
      { text: "Your assessment is... not inaccurate.", mood: 'smirk' },
    ],
    question: [
      { text: "An interesting query. Let me formulate a response.", mood: 'thinking' },
      { text: "I'll need to analyze that. Give me a moment.", mood: 'thinking' },
    ]
  }
};

// MIKO'S DIALOGUE POOL
export const mikoDialogue: CharacterDialogue = {
  greetings: [
    { text: "Oh! You look tired! Come, sit down. Let me take care of you.", mood: 'caring' },
    { text: "I made extra today! I was hoping you'd come by.", mood: 'warm' },
    { text: "Welcome! I've been thinking about you. I mean— I made your favorite!", mood: 'flustered' },
    { text: "You're here! Perfect timing. Dinner is almost ready.", mood: 'happy' },
  ],
  topics: {
    small_talk: {
      characterLines: [
        { text: "Have you eaten properly today? I worry about you sometimes.", mood: 'caring' },
        { text: "How are you feeling? You seem a bit tense. Let me make you something.", mood: 'caring' },
        { text: "I've been trying a new recipe. I'd love for you to be my taste tester.", mood: 'happy' },
      ],
      playerResponses: {
        good: { text: "I'm doing well, especially now that I'm here with you.", effects: { affection: 3, mood: 'flustered' } },
        normal: { text: "I'm fine. Just the usual.", effects: { affection: 1 } },
        ask_back: { text: "I'm alright. What have you been cooking up?", effects: { affection: 2, mood: 'happy' } }
      }
    },
    hobbies: {
      characterLines: [
        { text: "I love cooking. It's how I show people I care. Especially you.", mood: 'warm' },
        { text: "I also tend the garden. There's something nurturing about growing things.", mood: 'thinking' },
        { text: "My hobby is making people happy. Starting with you.", mood: 'caring' },
      ],
      playerResponses: {
        interested: { text: "I'd love to learn to cook from you. Teach me?", effects: { affection: 5, mood: 'happy', memory: 'miko_cooking_lesson' } },
        share: { text: "I'm not much of a cook, but I'd love to help you in the kitchen.", effects: { affection: 4, mood: 'warm', memory: 'miko_kitchen' } },
        curious: { text: "What's your specialty? What do you love making most?", effects: { affection: 3, mood: 'happy' } }
      }
    },
    dreams: {
      characterLines: [
        { text: "I want to open my own restaurant someday. A place that feels like home.", mood: 'thinking' },
        { text: "I dream of having a big family. A home filled with warmth and love.", mood: 'warm' },
        { text: "I want to nourish people. Body and soul. That's my purpose.", mood: 'caring' },
      ],
      playerResponses: {
        supportive: { text: "Your restaurant will be amazing. I'll be your first regular customer.", effects: { affection: 7, tension: 3, mood: 'warm', memory: 'miko_dream_support' } },
        share_dream: { text: "I want a warm home too. Maybe... with you.", effects: { affection: 8, tension: 10, mood: 'flustered', memory: 'shared_future' } },
        ask_more: { text: "Tell me about your restaurant. What would it be like?", effects: { affection: 4, mood: 'excited' } }
      }
    },
    fears: {
      characterLines: [
        { text: "I'm scared of not being enough. Of not being able to take care of the people I love.", mood: 'vulnerable' },
        { text: "What if I smother people? I worry I care too much sometimes.", mood: 'vulnerable' },
        { text: "I'm afraid of being alone. Of my love not being wanted.", mood: 'sad' },
      ],
      playerResponses: {
        reassure: { text: "You're more than enough. Your love is a gift. I want all of it.", effects: { affection: 8, tension: 5, mood: 'flustered', memory: 'miko_reassured' } },
        share_fear: { text: "I have fears too. But with you, I feel safe. Let's face them together.", effects: { affection: 10, tension: 8, mood: 'warm', memory: 'shared_fears' } },
        gentle: { text: "I want your love. All of it. Don't hold back.", effects: { affection: 6, tension: 8, mood: 'flustered' } }
      }
    },
    romance: {
      characterLines: [
        { text: "Every meal I make, I make with you in my heart. Can you taste the love?", mood: 'love' },
        { text: "I want to build a home with you. One filled with warmth and laughter.", mood: 'warm' },
        { text: "You nourish my soul the way food nourishes the body. I need you.", mood: 'love' },
      ],
      playerResponses: {
        reciprocal: { text: "I taste it. And I want to share every meal with you. Forever.", effects: { affection: 10, tension: 10, mood: 'love', memory: 'mutual_feelings' } },
        poem: { text: "Cook for me. Always. Let me be yours.", effects: { affection: 8, tension: 8, mood: 'flustered', memory: 'miko_commitment' } },
        intimate: { text: "Come here. Let me hold you. Let me feel your warmth.", effects: { affection: 8, tension: 15, mood: 'flustered', memory: 'intimate_moment' } }
      }
    },
    intimate: {
      characterLines: [
        { text: "When you're close, my heart feels full. Like a perfectly seasoned dish.", mood: 'flustered' },
        { text: "I want to take care of you. In every way. Is that okay?", mood: 'vulnerable' },
        { text: "You make me feel warm all over. Like sunshine on a cold day.", mood: 'love' },
      ],
      playerResponses: {
        escalate: { text: "Take care of me. All of me. I'm yours.", effects: { affection: 12, tension: 20, mood: 'love', memory: 'intimate_escalation' } },
        tender: { text: "You already do. Every day. Let me return the warmth.", effects: { affection: 10, tension: 18, mood: 'love', memory: 'tender_moment' } },
        promise: { text: "I want to grow old eating your cooking. Every single day.", effects: { affection: 10, tension: 15, mood: 'love', memory: 'future_promise' } }
      }
    }
  },
  reactions: {
    gift_liked: [
      { text: "Oh my! This is perfect! You really understand me!", mood: 'happy' },
      { text: "I love it! You're so thoughtful!", mood: 'happy' },
      { text: "This means so much to me. Thank you from my heart!", mood: 'warm' },
    ],
    gift_disliked: [
      { text: "Oh... um... thank you, dear. It's... interesting.", mood: 'neutral' },
      { text: "That's not quite my taste, but I appreciate the thought!", mood: 'neutral' },
    ],
    gift_neutral: [
      { text: "Oh, for me? You're too kind!", mood: 'happy' },
      { text: "Thank you! That's very thoughtful of you!", mood: 'happy' },
    ],
    flirt_success: [
      { text: "My! You're making my heart boil over!", mood: 'flustered' },
      { text: "Oh stop it! ...Actually, don't stop!", mood: 'flustered' },
      { text: "You're going to make me burn dinner with all this flattery!", mood: 'flustered' },
    ],
    flirt_fail: [
      { text: "Oh dear... that was a bit much, wasn't it?", mood: 'neutral' },
      { text: "Let's try that again, sweetheart.", mood: 'warm' },
    ],
    compliment: [
      { text: "You always know how to make me feel special!", mood: 'warm' },
      { text: "Oh my, you're too sweet!", mood: 'flustered' },
    ],
    question: [
      { text: "What a thoughtful question! Let me think...", mood: 'thinking' },
      { text: "Hmm, that's something to consider!", mood: 'thinking' },
    ]
  }
};

export const characterDialogues: Record<string, CharacterDialogue> = {
  sakura: sakuraDialogue,
  yuki: yukiDialogue,
  hina: hinaDialogue,
  rei: reiDialogue,
  miko: mikoDialogue,
};
