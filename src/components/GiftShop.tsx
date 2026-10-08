import { useState } from 'react';
import { Gift } from '../types';
import { gifts } from '../data/gifts';

interface Props {
  allowance: number;
  onGiveGift: (giftId: string) => void;
  characterName: string;
}

const CATEGORIES = ['all', 'food', 'flowers', 'books', 'sports', 'music', 'art', 'luxury'] as const;

export default function GiftShop({ allowance, onGiveGift, characterName }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredGift, setHoveredGift] = useState<string | null>(null);

  const filteredGifts = selectedCategory === 'all'
    ? gifts
    : gifts.filter(g => g.category === selectedCategory);

  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">🎁 Gift Shop</h3>
        <span className="text-sm text-yellow-400 font-bold">¥{allowance}</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {filteredGifts.map(gift => (
          <div
            key={gift.id}
            onMouseEnter={() => setHoveredGift(gift.id)}
            onMouseLeave={() => setHoveredGift(null)}
            className={`relative rounded-lg p-2 border transition-all cursor-pointer ${
              allowance >= gift.price
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30'
                : 'bg-white/3 border-gray-700/50 opacity-50'
            }`}
            onClick={() => allowance >= gift.price && onGiveGift(gift.id)}
          >
            <div className="text-center">
              <span className="text-2xl">{gift.emoji}</span>
              <p className="text-xs font-medium text-white mt-1 truncate">{gift.name}</p>
              <p className="text-xs text-yellow-400">¥{gift.price}</p>
              <p className="text-xs text-pink-400">+{gift.affectionBonus}♥</p>
            </div>

            {/* Tooltip */}
            {hoveredGift === gift.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-gray-900 border border-white/20 rounded-lg p-2 z-10 shadow-xl">
                <p className="text-xs text-white font-bold">{gift.name}</p>
                <p className="text-xs text-gray-400 mt-1">{gift.description}</p>
                <p className="text-xs text-pink-400 mt-1">Base: +{gift.affectionBonus}♥</p>
                <p className="text-xs text-gray-500 mt-1">Giving to {characterName}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
