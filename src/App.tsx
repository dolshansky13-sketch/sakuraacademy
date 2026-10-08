import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { characters } from './data/characters';
import { locations } from './data/locations';
import { gifts } from './data/gifts';
import { STAGE_LABELS, STAGE_COLORS, TimeOfDay, GameState, RelationshipStage } from './types';

// ===== TITLE SCREEN =====
function TitleScreen({ onStart }: { onStart: () => void }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Animated background petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${12 + Math.random() * 20}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="text-7xl mb-4 animate-pulse">🌸</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 bg-clip-text text-transparent mb-2">
          Sakura Academy
        </h1>
        <p className="text-pink-300/60 text-lg mb-1">~ Hearts in Bloom ~</p>
        <p className="text-gray-400 text-sm mb-12">A Visual Novel Dating Sim</p>

        <button
          onClick={onStart}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={`px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
            hovering
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105'
              : 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30'
          }`}
        >
          ▶ New Game
        </button>

        <div className="mt-8 text-gray-500 text-xs space-y-1">
          <p>5 Heroines • Gift System • Relationship Stages</p>
          <p>Day/Night Cycle • Multiple Endings</p>
        </div>
      </div>
    </div>
  );
}

// ===== HUD (Top Bar) =====
function HUD({ day, timeOfDay, allowance, actionsToday, maxActions, playerStats, onMenu, onSleep }: {
  day: number; timeOfDay: TimeOfDay; allowance: number;
  actionsToday: number; maxActions: number;
  playerStats: { academics: number; athletics: number; charm: number; creativity: number };
  onMenu: () => void; onSleep: () => void;
}) {
  const timeIcons: Record<TimeOfDay, string> = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
  const timeColors: Record<TimeOfDay, string> = {
    morning: 'text-amber-400', afternoon: 'text-yellow-400', evening: 'text-orange-400', night: 'text-indigo-400',
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-sm">Day {day}</span>
          <span className={`text-sm ${timeColors[timeOfDay]}`}>{timeIcons[timeOfDay]} {timeOfDay}</span>
          <span className="text-yellow-400 text-sm font-bold">¥{allowance}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Actions: {actionsToday}/{maxActions}</span>
          <button onClick={onMenu} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
            📊 Stats
          </button>
          <button onClick={onSleep} className="px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 rounded text-xs text-indigo-300 border border-indigo-500/30 transition-colors">
            🌙 Sleep
          </button>
        </div>
      </div>
      {/* Mini stat bars */}
      <div className="max-w-4xl mx-auto px-4 pb-1 flex gap-3">
        {Object.entries(playerStats).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1 flex-1">
            <span className="text-[10px] text-gray-500 w-3">{key === 'academics' ? '📚' : key === 'athletics' ? '🏃' : key === 'charm' ? '💬' : '🎨'}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all" style={{ width: `${val}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 w-5 text-right">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== DIALOGUE BOX =====
function DialogueBox({ dialogue, index, characterId, onClick }: {
  dialogue: { speaker: string | null; text: string; characterId?: string }[];
  index: number;
  characterId?: string;
  onClick: () => void;
}) {
  const line = dialogue[index];
  if (!line) return null;
  const char = line.characterId ? characters.find(c => c.id === line.characterId) : null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30" onClick={onClick}>
      <div className="bg-black/80 backdrop-blur-md border-t border-white/10 px-6 py-5 cursor-pointer">
        {line.speaker && (
          <div className="flex items-center gap-2 mb-2">
            {char && <span className="text-xl">{char.avatar}</span>}
            <span className={`font-bold text-sm ${char ? `bg-gradient-to-r ${char.color} bg-clip-text text-transparent` : 'text-gray-300'}`}>
              {line.speaker}
            </span>
          </div>
        )}
        <p className="text-white text-base leading-relaxed">{line.text}</p>
        <div className="mt-3 flex justify-end">
          <span className="text-gray-500 text-xs animate-pulse">▼ Click to continue</span>
        </div>
      </div>
    </div>
  );
}

// ===== CHARACTER PORTRAIT =====
function CharacterPortrait({ characterId, position }: { characterId: string; position: 'center' | 'left' | 'right' }) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return null;

  const posClass = position === 'center' ? 'left-1/2 -translate-x-1/2' : position === 'left' ? 'left-8' : 'right-8';

  return (
    <div className={`absolute bottom-32 ${posClass} z-20 pointer-events-none`}>
      <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center shadow-2xl border-4 border-white/20`}>
        <span className="text-7xl md:text-8xl">{char.avatar}</span>
      </div>
      <div className="text-center mt-2">
        <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white font-medium">{char.name}</span>
      </div>
    </div>
  );
}

// ===== LOCATION SELECT =====
function LocationSelect({ timeOfDay, actionsToday, maxActions, onSelect, onTrain }: {
  timeOfDay: TimeOfDay; actionsToday: number; maxActions: number;
  onSelect: (id: string) => void;
  onTrain: (stat: 'academics' | 'athletics' | 'charm' | 'creativity') => void;
}) {
  const available = locations.filter(l => l.availableTimes.includes(timeOfDay));
  const tired = actionsToday >= maxActions;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-20">
      <h2 className="text-2xl font-bold text-white mb-2">Where will you go?</h2>
      <p className="text-gray-400 text-sm mb-6">
        {tired ? "⚠️ You're exhausted. Time to sleep." : `Choose a location to visit (${maxActions - actionsToday} actions left)`}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl w-full mb-6">
        {available.map(loc => (
          <button
            key={loc.id}
            onClick={() => !tired && onSelect(loc.id)}
            disabled={tired}
            className={`p-4 rounded-xl border transition-all text-left ${
              tired
                ? 'bg-white/3 border-gray-700/30 opacity-50 cursor-not-allowed'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30 hover:scale-105 cursor-pointer'
            }`}
          >
            <span className="text-3xl">{loc.emoji}</span>
            <h3 className="text-white font-bold text-sm mt-2">{loc.name}</h3>
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{loc.description}</p>
            {loc.charactersPresent.length > 0 && (
              <div className="flex gap-1 mt-2">
                {loc.charactersPresent.map(cId => {
                  const c = characters.find(ch => ch.id === cId);
                  return c ? <span key={cId} className="text-sm" title={c.name}>{c.avatar}</span> : null;
                })}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Training Options */}
      {!tired && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-w-3xl w-full">
          <h3 className="text-sm font-bold text-white mb-2">📈 Train Stats (uses 1 action)</h3>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => onTrain('academics')} className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs text-blue-300 transition-colors">
              📚 Study
            </button>
            <button onClick={() => onTrain('athletics')} className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs text-green-300 transition-colors">
              🏃 Exercise
            </button>
            <button onClick={() => onTrain('charm')} className="px-3 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-xs text-pink-300 transition-colors">
              💬 Socialize
            </button>
            <button onClick={() => onTrain('creativity')} className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-xs text-purple-300 transition-colors">
              🎨 Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CHOICE MENU =====
function ChoiceMenu({ choices, onChoose }: { choices: { text: string }[]; onChoose: (idx: number) => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="max-w-md w-full space-y-3">
        <h3 className="text-center text-white font-bold text-lg mb-4">What do you do?</h3>
        {choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => onChoose(idx)}
            className="w-full px-6 py-4 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-pink-500/40 rounded-xl text-white text-left transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== GIFT GIVING =====
function GiftGiveMenu({ characterId, inventory, allowance, onGive, onBack, onBuy }: {
  characterId: string;
  inventory: { giftId: string; quantity: number }[];
  allowance: number;
  onGive: (giftId: string) => void;
  onBack: () => void;
  onBuy: (giftId: string) => void;
}) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return null;

  const inventoryGifts = inventory.map(i => ({ ...i, gift: gifts.find(g => g.id === i.giftId)! })).filter(i => i.gift);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-lg w-full bg-slate-900/95 rounded-2xl border border-white/10 p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">🎁 Give Gift to {char.name}</h3>
          <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">✕ Close</button>
        </div>

        {/* Inventory */}
        {inventoryGifts.length > 0 ? (
          <div className="mb-4">
            <h4 className="text-xs text-gray-400 mb-2 font-bold">Your Inventory:</h4>
            <div className="grid grid-cols-2 gap-2">
              {inventoryGifts.map(({ giftId, quantity, gift }) => (
                <button
                  key={giftId}
                  onClick={() => onGive(giftId)}
                  className="p-3 bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-left transition-all"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <p className="text-xs text-white font-medium mt-1">{gift.name} x{quantity}</p>
                  <p className="text-xs text-pink-400">+{gift.affectionBonus}♥ base</p>
                  {char.likedGifts.includes(giftId) && <p className="text-xs text-green-400">❤️ Loves it!</p>}
                  {char.dislikedGifts.includes(giftId) && <p className="text-xs text-red-400">💔 Dislikes</p>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-4">Your inventory is empty. Visit the Café to buy gifts!</p>
        )}

        {/* Shop */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-xs text-gray-400 mb-2 font-bold">🛍️ Buy Gifts (¥{allowance} available):</h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {gifts.map(gift => (
              <button
                key={gift.id}
                onClick={() => allowance >= gift.price && onBuy(gift.id)}
                disabled={allowance < gift.price}
                className={`p-2 rounded-lg text-left transition-all ${
                  allowance >= gift.price
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/30'
                    : 'bg-white/3 border-gray-700/30 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{gift.emoji}</span>
                  <div>
                    <p className="text-xs text-white font-medium">{gift.name}</p>
                    <p className="text-xs text-yellow-400">¥{gift.price}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STATS MENU =====
function StatsMenu({ state, onClose }: { state: GameState; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900/95 rounded-2xl border border-white/10 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">📊 Status</h3>
          <button onClick={onClose} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">✕ Close</button>
        </div>

        {/* Player Stats */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-white mb-3">Your Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(state.playerStats as unknown as Record<string, number>).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-lg">{key === 'academics' ? '📚' : key === 'athletics' ? '🏃' : key === 'charm' ? '💬' : '🎨'}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400 capitalize">{key}</span>
                    <span className="text-xs text-white font-bold">{val}/100</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-white mb-3">💕 Relationships</h4>
          <div className="space-y-3">
            {characters.map(char => {
              const rel = state.relationships[char.id]!;
              return (
                <div key={char.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-xl`}>
                      {char.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">{char.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: STAGE_COLORS[rel.stage] + '30', color: STAGE_COLORS[rel.stage] }}>
                          {STAGE_LABELS[rel.stage]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all" style={{ width: `${rel.affection}%` }} />
                        </div>
                        <span className="text-xs text-pink-400 font-bold">{rel.affection}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>💬 {rel.conversationsHad} chats</span>
                    <span>🎁 {rel.giftsGiven} gifts</span>
                    <span>🎯 {rel.goalsCompleted.length}/{char.goals.length} goals</span>
                  </div>
                  {/* Goals */}
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {char.goals.map((goal, idx) => (
                      <div key={idx} className={`text-xs px-2 py-1 rounded ${rel.goalsCompleted.includes(idx) ? 'bg-green-500/10 text-green-400' : 'bg-white/3 text-gray-500'}`}>
                        {rel.goalsCompleted.includes(idx) ? '✅' : `${goal.affectionThreshold}♥`} {goal.description}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-sm font-bold text-white mb-2">🎒 Inventory</h4>
          {state.inventory.length === 0 ? (
            <p className="text-gray-500 text-xs">Empty. Buy gifts at the Café!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.inventory.map((item: any) => {
                const gift = gifts.find(g => g.id === item.giftId);
                return gift ? (
                  <div key={item.giftId} className="bg-white/5 rounded-lg px-3 py-2 text-xs text-white">
                    {gift.emoji} {gift.name} x{item.quantity}
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== CAFÉ (Gift Shop) =====
function CafeScene({ allowance, onBuy, onBack }: { allowance: number; onBuy: (id: string) => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-20">
      <div className="max-w-2xl w-full bg-slate-900/90 rounded-2xl border border-white/10 p-5 max-h-[75vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">☕ Café — Gift Shop</h3>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 font-bold">¥{allowance}</span>
            <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">← Leave</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gifts.map(gift => (
            <button
              key={gift.id}
              onClick={() => allowance >= gift.price && onBuy(gift.id)}
              disabled={allowance < gift.price}
              className={`p-3 rounded-xl border text-left transition-all ${
                allowance >= gift.price
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-yellow-500/30 hover:scale-105'
                  : 'bg-white/3 border-gray-700/30 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl">{gift.emoji}</span>
              <p className="text-sm text-white font-medium mt-1">{gift.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{gift.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-yellow-400 font-bold">¥{gift.price}</span>
                <span className="text-xs text-pink-400">+{gift.affectionBonus}♥</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== NOTIFICATION TOAST =====
function NotificationToast({ notifications }: { notifications: string[] }) {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      setVisible([notifications[0]]);
      const timer = setTimeout(() => setVisible([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-md border border-pink-500/30 rounded-xl px-4 py-2 shadow-lg animate-slideDown">
        <p className="text-sm text-white">{visible[0]}</p>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const {
    state, startGame, advanceDialogue, selectLocation, handleChoice,
    giveGift, buyGift, goToSleep, trainStat, openMenu, closeMenu, resetGame,
    backToLocationSelect, backToChoices,
  } = useGameState();

  const currentLoc = state.currentLocation ? locations.find(l => l.id === state.currentLocation) : null;
  const currentChar = state.currentCharacter ? characters.find(c => c.id === state.currentCharacter) : null;

  // Determine background gradient
  const getBgGradient = () => {
    if (currentLoc) return currentLoc.bgGradient;
    const timeBgs: Record<TimeOfDay, string> = {
      morning: 'from-amber-900/40 via-orange-800/20 to-slate-950',
      afternoon: 'from-sky-900/40 via-blue-800/20 to-slate-950',
      evening: 'from-purple-900/40 via-pink-800/20 to-slate-950',
      night: 'from-indigo-900/50 via-purple-900/30 to-slate-950',
    };
    return timeBgs[state.timeOfDay];
  };

  // TITLE SCREEN
  if (state.phase === 'title') {
    return <TitleScreen onStart={startGame} />;
  }

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${getBgGradient()} overflow-hidden`}>
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {state.timeOfDay === 'night' && Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
        {(state.timeOfDay === 'evening' || state.timeOfDay === 'morning') && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute text-pink-300/10 animate-float"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, fontSize: '16px' }}>
            🌸
          </div>
        ))}
      </div>

      {/* HUD */}
      <HUD
        day={state.day} timeOfDay={state.timeOfDay} allowance={state.allowance}
        actionsToday={state.actionsToday} maxActions={state.maxActionsPerDay}
        playerStats={state.playerStats} onMenu={openMenu} onSleep={goToSleep}
      />

      {/* Location name overlay */}
      {currentLoc && (state.phase === 'encounter' || state.phase === 'choice' || state.phase === 'gift_give') && (
        <div className="absolute top-20 left-4 z-10">
          <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/80 border border-white/10">
            {currentLoc.emoji} {currentLoc.name}
          </span>
        </div>
      )}

      {/* Character Portrait */}
      {currentChar && (state.phase === 'encounter' || state.phase === 'dialogue' || state.phase === 'choice') && (
        <CharacterPortrait characterId={currentChar.id} position="center" />
      )}

      {/* LOCATION SELECT */}
      {state.phase === 'location_select' && (
        <LocationSelect
          timeOfDay={state.timeOfDay}
          actionsToday={state.actionsToday}
          maxActions={state.maxActionsPerDay}
          onSelect={selectLocation}
          onTrain={trainStat}
        />
      )}

      {/* CAFÉ SHOP */}
      {state.phase === 'dialogue' && state.currentLocation === 'cafe' && state.currentDialogueIndex >= state.currentDialogue.length - 1 && (
        <CafeScene
          allowance={state.allowance}
          onBuy={buyGift}
          onBack={backToLocationSelect}
        />
      )}

      {/* DIALOGUE */}
      {(state.phase === 'wakeup' || state.phase === 'encounter' || state.phase === 'dialogue' || state.phase === 'day_end') &&
        state.currentDialogue.length > 0 &&
        !(state.currentLocation === 'cafe' && state.currentDialogueIndex >= state.currentDialogue.length - 1) && (
        <DialogueBox
          dialogue={state.currentDialogue}
          index={state.currentDialogueIndex}
          characterId={state.currentCharacter || undefined}
          onClick={advanceDialogue}
        />
      )}

      {/* CHOICES */}
      {state.phase === 'choice' && state.currentChoices.length > 0 && (
        <ChoiceMenu choices={state.currentChoices} onChoose={handleChoice} />
      )}

      {/* GIFT GIVING */}
      {state.phase === 'gift_give' && state.currentCharacter && (
        <GiftGiveMenu
          characterId={state.currentCharacter}
          inventory={state.inventory}
          allowance={state.allowance}
          onGive={giveGift}
          onBack={backToChoices}
          onBuy={buyGift}
        />
      )}

      {/* STATS MENU */}
      {state.phase === 'menu' && (
        <StatsMenu state={state} onClose={closeMenu} />
      )}

      {/* NOTIFICATIONS */}
      <NotificationToast notifications={state.notifications} />

      {/* Affection popup for current character */}
      {currentChar && state.relationships[currentChar.id] && (state.phase === 'encounter' || state.phase === 'choice') && (
        <div className="absolute top-20 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/10 min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <span>{currentChar.avatar}</span>
            <span className="text-xs text-white font-bold">{currentChar.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">♥</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: `${state.relationships[currentChar.id].affection}%` }} />
            </div>
            <span className="text-xs text-pink-400">{state.relationships[currentChar.id].affection}</span>
          </div>
          <span className="text-[10px] mt-1 block" style={{ color: STAGE_COLORS[state.relationships[currentChar.id].stage] }}>
            {STAGE_LABELS[state.relationships[currentChar.id].stage]}
          </span>
        </div>
      )}
    </div>
  );
}
