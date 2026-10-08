import { Gift } from '../types';

export const gifts: Gift[] = [
  // Food
  { id: 'chocolate', name: 'Chocolate Box', description: 'A sweet box of assorted chocolates', price: 50, category: 'food', emoji: '🍫', affectionBonus: 3 },
  { id: 'protein_bar', name: 'Protein Bar', description: 'High-energy nutrition bar', price: 30, category: 'food', emoji: '🥜', affectionBonus: 2 },
  { id: 'tea_set', name: 'Premium Tea Set', description: 'Elegant Japanese green tea collection', price: 200, category: 'food', emoji: '🍵', affectionBonus: 8 },
  { id: 'energy_drink', name: 'Energy Drink', description: 'Maximum power in a can', price: 25, category: 'food', emoji: '⚡', affectionBonus: 1 },
  { id: 'cookbook', name: 'Gourmet Cookbook', description: 'Recipes from around the world', price: 150, category: 'food', emoji: '📖', affectionBonus: 7 },

  // Flowers
  { id: 'flower_bouquet', name: 'Flower Bouquet', description: 'A beautiful arrangement of seasonal flowers', price: 120, category: 'flowers', emoji: '💐', affectionBonus: 6 },
  { id: 'herb_garden', name: 'Herb Garden Kit', description: 'Grow your own fresh herbs', price: 80, category: 'flowers', emoji: '🌿', affectionBonus: 5 },
  { id: 'rain_umbrella', name: 'Rain Umbrella', description: 'A pretty transparent umbrella', price: 60, category: 'flowers', emoji: '☂️', affectionBonus: 4 },

  // Books
  { id: 'poetry_book', name: 'Poetry Collection', description: 'Beautiful verses about love and nature', price: 90, category: 'books', emoji: '📚', affectionBonus: 5 },
  { id: 'rare_book', name: 'Rare First Edition', description: 'A valuable collector\'s book', price: 500, category: 'books', emoji: '📕', affectionBonus: 12 },

  // Sports
  { id: 'sports_ball', name: 'Sports Ball', description: 'A quality basketball', price: 100, category: 'sports', emoji: '🏀', affectionBonus: 5 },
  { id: 'running_shoes', name: 'Running Shoes', description: 'Professional athletic shoes', price: 300, category: 'sports', emoji: '👟', affectionBonus: 10 },

  // Music
  { id: 'headphones', name: 'Headphones', description: 'High-quality wireless headphones', price: 250, category: 'music', emoji: '🎧', affectionBonus: 8 },
  { id: 'music_sheet', name: 'Music Sheet', description: 'Rare sheet music collection', price: 180, category: 'music', emoji: '🎼', affectionBonus: 7 },
  { id: 'guitar_pick', name: 'Guitar Pick Set', description: 'Premium guitar picks', price: 40, category: 'music', emoji: '🎸', affectionBonus: 3 },
  { id: 'concert_ticket', name: 'Concert Tickets', description: 'VIP concert experience for two', price: 400, category: 'music', emoji: '🎫', affectionBonus: 11 },
  { id: 'loud_speaker', name: 'Bluetooth Speaker', description: 'Powerful portable speaker', price: 150, category: 'music', emoji: '🔊', affectionBonus: 4 },

  // Art
  { id: 'sketchbook', name: 'Art Sketchbook', description: 'Premium quality sketchbook', price: 70, category: 'art', emoji: '🎨', affectionBonus: 4 },

  // Luxury
  { id: 'chess_set', name: 'Chess Set', description: 'Elegant wooden chess set', price: 350, category: 'luxury', emoji: '♟️', affectionBonus: 9 },

  // Special/Rare Gifts
  { id: 'sakura_ring', name: 'Sakura Ring', description: 'A delicate ring with a cherry blossom design', price: 800, category: 'special', emoji: '💍', affectionBonus: 15 },
  { id: 'champion_trophy', name: 'Champion Trophy', description: 'A golden trophy engraved with "To My Champion"', price: 750, category: 'special', emoji: '🏆', affectionBonus: 14 },
  { id: 'golden_microphone', name: 'Golden Microphone', description: 'A custom golden microphone with her name', price: 900, category: 'special', emoji: '🎤', affectionBonus: 16 },
  { id: 'moonlight_necklace', name: 'Moonlight Necklace', description: 'A silver necklace with a moon pendant', price: 850, category: 'special', emoji: '🌙', affectionBonus: 15 },
  { id: 'eternal_rose', name: 'Eternal Rose', description: 'A preserved rose that will never wilt', price: 700, category: 'special', emoji: '🌹', affectionBonus: 14 },
  { id: 'love_letter', name: 'Handwritten Love Letter', description: 'A heartfelt letter written by you', price: 0, category: 'special', emoji: '💌', affectionBonus: 20 },
  { id: 'promise_ring', name: 'Promise Ring', description: 'A simple ring symbolizing your promise', price: 1200, category: 'special', emoji: '💎', affectionBonus: 25 },
];

export const getGiftById = (id: string): Gift | undefined => gifts.find(g => g.id === id);
