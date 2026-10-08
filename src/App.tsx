import { useState, useEffect, useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import { characters } from './data/characters';
import { locations } from './data/locations';
import { gifts } from './data/gifts';
import { secretScenes } from './data/secretScenes';
import { STAGE_LABELS, STAGE_COLORS, TimeOfDay, Weather, LOCATION_IMAGES, CHARACTER_PORTRAITS, PLAYER_PORTRAIT, OUTFIT_IMAGES, GameState, RelationshipStage, Mood, FlirtOption, SECRET_BG } from './types';
import { ConversationNode, ConversationChoice } from './systems/ConversationEngine';

// ===== TITLE SCREEN =====
function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${LOCATION_IMAGES.garden})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-pink-950/60 via-purple-950/40 to-black/80" />
      {/* Animated petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="absolute animate-float text-pink-300/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, animationDuration: `${4 + Math.random() * 4}s`, fontSize: `${14 + Math.random() * 18}px` }}>
            🌸
          </div>
        ))}
      </div>
      <div className="relative z-10 text-center">
        <div className="text-8xl mb-6 animate-pulse">🌸</div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-300 via-rose-200 to-purple-300 bg-clip-text text-transparent mb-3 tracking-tight">
          Sakura Academy
        </h1>
        <p className="text-pink-300/70 text-xl mb-2 italic">~ Hearts in Bloom ~</p>
        <p className="text-gray-400 text-sm mb-12">A Visual Novel Dating Sim</p>
        <button onClick={onStart}
          className="group px-14 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200 border border-pink-400/30 hover:from-pink-500/50 hover:to-purple-500/50 hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
          <span className="group-hover:animate-pulse">▶ Start Game</span>
        </button>
        <div className="mt-10 text-gray-500 text-xs space-y-1">
          <p>5 Heroines • Flirting System • Gift System • Weather Events</p>
          <p>Day/Night Cycle • Relationship Stages • Multiple Endings</p>
        </div>
      </div>
    </div>
  );
}

// ===== HUD =====
function HUD({ state, onMenu, onSleep }: { state: GameState; onMenu: () => void; onSleep: () => void }) {
  const timeIcons: Record<TimeOfDay, string> = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
  const weatherIcons: Record<Weather, string> = { sunny: '☀️', cloudy: '☁️', rainy: '🌧️', snowy: '🌨️' };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">Day {state.day}</span>
          <span className="text-sm">{timeIcons[state.timeOfDay]}</span>
          <span className="text-sm">{weatherIcons[state.weather]}</span>
          <span className="text-yellow-400 font-bold text-sm">¥{state.allowance}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{state.actionsToday}/{state.maxActionsPerDay} actions</span>
          <button onClick={onMenu} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors border border-white/10">
            📊 Status
          </button>
          <button onClick={onSleep} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-xs text-indigo-300 border border-indigo-500/30 transition-colors">
            🌙 Sleep
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-3">
        {Object.entries(state.playerStats).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1 flex-1">
            <span className="text-xs">{key === 'academics' ? '📚' : key === 'athletics' ? '🏃' : key === 'charm' ? '💬' : '🎨'}</span>
            <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-400 rounded-full transition-all duration-500" style={{ width: `${val}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 w-5 text-right">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== CHARACTER PORTRAIT (with image) =====
function CharacterPortrait({ characterId }: { characterId: string }) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return null;
  const portraitUrl = CHARACTER_PORTRAITS[characterId];

  return (
    <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      {portraitUrl ? (
        <div className="relative">
          <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img src={portraitUrl} alt={char.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10">
            <span className="text-white text-sm font-bold">{char.avatar} {char.name}</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center shadow-2xl border-4 border-white/20`}>
            <span className="text-7xl md:text-8xl">{char.avatar}</span>
          </div>
          <div className="text-center mt-2">
            <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white font-medium">{char.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== DIALOGUE BOX =====
function DialogueBox({ dialogue, index, characterId, onClick }: {
  dialogue: { speaker: string | null; text: string; characterId?: string }[];
  index: number; characterId?: string; onClick: () => void;
}) {
  const line = dialogue[index];
  if (!line) return null;
  const char = line.characterId ? characters.find(c => c.id === line.characterId) : null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30" onClick={onClick}>
      <div className="bg-gradient-to-t from-black/95 via-black/85 to-black/70 backdrop-blur-xl border-t border-white/10 px-6 py-6 cursor-pointer">
        {line.speaker && (
          <div className="flex items-center gap-2 mb-2">
            {char && <span className="text-xl">{char.avatar}</span>}
            <span className={`font-bold ${char ? `bg-gradient-to-r ${char.color} bg-clip-text text-transparent` : 'text-gray-300'}`}>
              {line.speaker}
            </span>
          </div>
        )}
        <p className="text-white text-lg leading-relaxed animate-textReveal">{line.text}</p>
        <div className="mt-4 flex justify-end">
          <span className="text-gray-500 text-xs animate-pulse">▼ Click to continue</span>
        </div>
      </div>
    </div>
  );
}

// ===== LOCATION SELECT =====
function LocationSelect({ state, onSelect, onTrain }: {
  state: GameState; onSelect: (id: string) => void;
  onTrain: (stat: 'academics' | 'athletics' | 'charm' | 'creativity') => void;
}) {
  const available = locations.filter(l => l.availableTimes.includes(state.timeOfDay));
  const tired = state.actionsToday >= state.maxActionsPerDay;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-24">
      <h2 className="text-3xl font-bold text-white mb-2">Where will you go?</h2>
      <p className="text-gray-400 text-sm mb-6">
        {tired ? "⚠️ You're exhausted. Time to sleep." : `${state.maxActionsPerDay - state.actionsToday} actions remaining`}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl w-full mb-6">
        {available.map(loc => (
          <button key={loc.id} onClick={() => !tired && onSelect(loc.id)} disabled={tired}
            className={`relative overflow-hidden rounded-xl border transition-all text-left group ${tired ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl cursor-pointer'}`}>
            {loc.bgImage && <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: `url(${loc.bgImage})` }} />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative p-4">
              <span className="text-3xl">{loc.emoji}</span>
              <h3 className="text-white font-bold text-sm mt-2">{loc.name}</h3>
              <p className="text-gray-300 text-xs mt-1 line-clamp-2">{loc.description}</p>
              {loc.charactersPresent.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {loc.charactersPresent.map(cId => {
                    const c = characters.find(ch => ch.id === cId);
                    return c ? <span key={cId} className="text-sm" title={c.name}>{c.avatar}</span> : null;
                  })}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {!tired && (
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-4xl w-full">
          <h3 className="text-sm font-bold text-white mb-2">📈 Train Stats</h3>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => onTrain('academics')} className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs text-blue-300 transition-colors">📚 Study (+5)</button>
            <button onClick={() => onTrain('athletics')} className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs text-green-300 transition-colors">🏃 Exercise (+5)</button>
            <button onClick={() => onTrain('charm')} className="px-3 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-xs text-pink-300 transition-colors">💬 Socialize (+5)</button>
            <button onClick={() => onTrain('creativity')} className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-xs text-purple-300 transition-colors">🎨 Create (+5)</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CHOICE MENU =====
function ChoiceMenu({ choices, onChoose, characterId }: { choices: { text: string; emoji?: string; type?: string }[]; onChoose: (idx: number) => void; characterId?: string }) {
  const char = characterId ? characters.find(c => c.id === characterId) : null;
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="max-w-md w-full space-y-3 animate-fadeIn">
        {char && (
          <div className="text-center mb-4">
            <span className="text-3xl">{char.avatar}</span>
            <p className={`font-bold mt-1 bg-gradient-to-r ${char.color} bg-clip-text text-transparent`}>{char.name}</p>
          </div>
        )}
        {choices.map((choice, idx) => (
          <button key={idx} onClick={() => onChoose(idx)}
            className={`w-full px-6 py-4 rounded-xl text-left transition-all hover:scale-[1.02] border ${
              choice.type === 'flirt' ? 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-200' :
              choice.type === 'bold' ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-200' :
              'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/30 text-white'
            }`}>
            <span className="mr-2">{choice.emoji || '•'}</span>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== FLIRT MENU =====
function FlirtMenu({ options, playerCharm, onFlirt, onBack }: {
  options: FlirtOption[]; playerCharm: number; onFlirt: (type: 'smooth' | 'cheesy' | 'bold' | 'sweet') => void; onBack: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="max-w-md w-full bg-gradient-to-b from-pink-950/80 to-purple-950/80 rounded-2xl border border-pink-500/20 p-6 animate-fadeIn">
        <h3 className="text-xl font-bold text-center text-pink-200 mb-1">💕 Flirt</h3>
        <p className="text-center text-xs text-gray-400 mb-4">Your Charm: {playerCharm}/100 — Higher charm = better success rate!</p>
        <div className="space-y-3">
          {options.map(opt => {
            const locked = playerCharm < opt.charmRequired;
            const successRate = Math.min(95, Math.round((40 + (playerCharm / 100) * 50) * (opt.type === 'bold' ? 0.7 : 1)));
            return (
              <button key={opt.type} onClick={() => !locked && onFlirt(opt.type)} disabled={locked}
                className={`w-full px-5 py-4 rounded-xl text-left transition-all border ${
                  locked ? 'bg-gray-800/50 border-gray-700/30 opacity-50 cursor-not-allowed' :
                  'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20 hover:border-pink-500/40 hover:scale-[1.02]'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg mr-2">{opt.emoji}</span>
                    <span className="text-white font-medium">{opt.text}</span>
                    {locked && <span className="text-xs text-gray-500 ml-2">🔒 Charm {opt.charmRequired}+</span>}
                  </div>
                  {!locked && <span className="text-xs text-pink-400">{successRate}% success</span>}
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={onBack} className="mt-4 w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
}

// ===== SECRET SCENES MENU =====
function SecretScenesMenu({ characterId, state, onSelect, onBack }: {
  characterId: string; state: GameState; onSelect: (sceneId: string) => void; onBack: () => void;
}) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return null;

  const availableScenes = secretScenes.filter(s => s.characterId === characterId);
  const unlockedScenes = availableScenes.filter(s => {
    const rel = state.relationships[characterId];
    if (!rel) return false;
    if (rel.affection < s.requiredAffection) return false;
    if (rel.tension < s.requiredTension) return false;
    if (s.requiredStage && rel.stage !== s.requiredStage) return false;
    return true;
  });

  const completedScenes = state.scenesCompleted.filter(id => availableScenes.some(s => s.id === id));

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <div className="max-w-lg w-full bg-gradient-to-b from-purple-950/90 to-indigo-950/90 rounded-2xl border border-purple-500/30 p-6 animate-fadeIn max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-center text-purple-200 mb-1">✨ Secret Scenes</h3>
        <p className="text-center text-xs text-gray-400 mb-4">{char.name}'s hidden moments</p>
        
        {unlockedScenes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No secret scenes available yet.</p>
            <p className="text-gray-500 text-xs mt-2">Increase affection and tension to unlock special moments!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unlockedScenes.map(scene => {
              const completed = completedScenes.includes(scene.id);
              return (
                <button
                  key={scene.id}
                  onClick={() => !completed && onSelect(scene.id)}
                  disabled={completed}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    completed
                      ? 'bg-gray-800/30 border-gray-700/30 opacity-60 cursor-not-allowed'
                      : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-500/50 hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{completed ? '✅' : '🔓'}</span>
                        <span className="text-white font-bold">{scene.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-7">{scene.description}</p>
                      <div className="flex gap-2 mt-2 ml-7 flex-wrap">
                        <span className="text-xs text-pink-400">♥{scene.requiredAffection}+</span>
                        <span className="text-xs text-red-400">🔥{scene.requiredTension}+</span>
                        {scene.requiredStage && <span className="text-xs text-blue-400">{STAGE_LABELS[scene.requiredStage]}</span>}
                        {scene.requiredWeather && <span className="text-xs text-cyan-400">{scene.requiredWeather}</span>}
                        {scene.requiredTime && <span className="text-xs text-amber-400">{scene.requiredTime}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <button onClick={onBack} className="mt-4 w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
}

// ===== GIFT MENU =====
function GiftGiveMenu({ characterId, inventory, allowance, onGive, onBack, onBuy }: {
  characterId: string; inventory: { giftId: string; quantity: number }[]; allowance: number;
  onGive: (giftId: string) => void; onBack: () => void; onBuy: (giftId: string) => void;
}) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return null;
  const invGifts = inventory.map(i => ({ ...i, gift: gifts.find(g => g.id === i.giftId)! })).filter(i => i.gift);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-lg w-full bg-slate-900/95 rounded-2xl border border-white/10 p-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">🎁 Gift for {char.name}</h3>
          <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">✕</button>
        </div>
        {invGifts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-400 mb-2 font-bold">Your Inventory:</h4>
            <div className="grid grid-cols-2 gap-2">
              {invGifts.map(({ giftId, quantity, gift }) => (
                <button key={giftId} onClick={() => onGive(giftId)}
                  className="p-3 bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-left transition-all">
                  <span className="text-2xl">{gift.emoji}</span>
                  <p className="text-xs text-white font-medium mt-1">{gift.name} x{quantity}</p>
                  {char.likedGifts.includes(giftId) && <p className="text-xs text-green-400">❤️ Loves!</p>}
                  {char.dislikedGifts.includes(giftId) && <p className="text-xs text-red-400">💔 Dislikes</p>}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-xs text-gray-400 mb-2 font-bold">🛍️ Buy (¥{allowance}):</h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {gifts.map(gift => (
                <button key={gift.id} onClick={() => allowance >= gift.price && onBuy(gift.id)} disabled={allowance < gift.price}
                  className={`p-2 rounded-lg text-left transition-all relative ${
                    allowance >= gift.price 
                      ? gift.category === 'special' 
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-400/50'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      : 'opacity-30 cursor-not-allowed bg-white/3'
                  }`}>
                  {gift.category === 'special' && <span className="absolute top-1 right-1 text-xs">✨</span>}
                  <span className="text-lg">{gift.emoji}</span>
                  <p className="text-xs text-white">{gift.name}</p>
                  <p className="text-xs text-yellow-400">¥{gift.price}</p>
                </button>            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CAFÉ SHOP =====
function CafeScene({ allowance, onBuy, onBack }: { allowance: number; onBuy: (id: string) => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-24">
      <div className="max-w-3xl w-full bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-5 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">☕ Café Gift Shop</h3>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 font-bold">¥{allowance}</span>
            <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">← Leave</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gifts.filter(g => g.category !== 'outfit').map(gift => (
            <button key={gift.id} onClick={() => allowance >= gift.price && onBuy(gift.id)} disabled={allowance < gift.price}
              className={`p-3 rounded-xl border text-left transition-all ${allowance >= gift.price ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-yellow-500/30 hover:scale-105' : 'opacity-30 cursor-not-allowed bg-white/3'}`}>
              <span className="text-3xl">{gift.emoji}</span>
              <p className="text-sm text-white font-medium mt-1">{gift.name}</p>
              <p className="text-xs text-gray-400">{gift.description}</p>
              <div className="flex justify-between mt-2">
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

// ===== OUTFIT STORE =====
function OutfitStore({ allowance, onBuy, onBack }: { allowance: number; onBuy: (id: string) => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-24">
      <div className="max-w-3xl w-full bg-black/60 backdrop-blur-xl rounded-2xl border border-pink-500/30 p-5 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-pink-300">👗 Fashion Boutique</h3>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 font-bold">¥{allowance}</span>
            <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">← Leave</button>
          </div>
        </div>
        <p className="text-pink-200/60 text-sm mb-4">Special outfits and costumes for your dates!</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gifts.filter(g => g.category === 'outfit').map(gift => (
            <button key={gift.id} onClick={() => allowance >= gift.price && onBuy(gift.id)} disabled={allowance < gift.price}
              className={`p-3 rounded-xl border text-left transition-all ${allowance >= gift.price ? 'bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/20 hover:border-pink-400/40 hover:scale-105' : 'opacity-30 cursor-not-allowed bg-white/3'}`}>
              <span className="text-3xl">{gift.emoji}</span>
              <p className="text-sm text-white font-medium mt-1">{gift.name}</p>
              <p className="text-xs text-gray-400">{gift.description}</p>
              <div className="flex justify-between mt-2">
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

// ===== APARTMENT MENU =====
function ApartmentMenu({ state, onTrain, onBack }: { state: GameState; onTrain: (stat: 'academics' | 'athletics' | 'charm' | 'creativity') => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full bg-black/60 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-300">🏠 Your Apartment</h3>
          <button onClick={onBack} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">← Leave</button>
        </div>
        <p className="text-amber-200/60 text-sm mb-4">Train your stats or rest.</p>
        <div className="space-y-3">
          <button
            onClick={() => onTrain('academics')}
            className="w-full p-4 bg-blue-900/50 hover:bg-blue-800/50 border-2 border-blue-500/50 rounded-lg text-left transition-all"
          >
            <div className="text-2xl mb-1">📚</div>
            <div className="font-bold text-white">Study</div>
            <div className="text-xs text-blue-300">Increase Academics (+5)</div>
            <div className="text-xs text-gray-400 mt-1">Current: {state.playerStats.academics}/100</div>
          </button>
          <button
            onClick={() => onTrain('athletics')}
            className="w-full p-4 bg-green-900/50 hover:bg-green-800/50 border-2 border-green-500/50 rounded-lg text-left transition-all"
          >
            <div className="text-2xl mb-1">🏃</div>
            <div className="font-bold text-white">Exercise</div>
            <div className="text-xs text-green-300">Increase Athletics (+5)</div>
            <div className="text-xs text-gray-400 mt-1">Current: {state.playerStats.athletics}/100</div>
          </button>
          <button
            onClick={() => onTrain('charm')}
            className="w-full p-4 bg-pink-900/50 hover:bg-pink-800/50 border-2 border-pink-500/50 rounded-lg text-left transition-all"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="font-bold text-white">Socialize</div>
            <div className="text-xs text-pink-300">Increase Charm (+5)</div>
            <div className="text-xs text-gray-400 mt-1">Current: {state.playerStats.charm}/100</div>
          </button>
          <button
            onClick={() => onTrain('creativity')}
            className="w-full p-4 bg-purple-900/50 hover:bg-purple-800/50 border-2 border-purple-500/50 rounded-lg text-left transition-all"
          >
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-bold text-white">Create</div>
            <div className="text-xs text-purple-300">Increase Creativity (+5)</div>
            <div className="text-xs text-gray-400 mt-1">Current: {state.playerStats.creativity}/100</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== STATS MENU =====
function StatsMenu({ state, onClose }: { state: GameState; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900/95 rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">📊 Status</h3>
          <button onClick={onClose} className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">✕</button>
        </div>
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-white mb-3">Your Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(state.playerStats as unknown as Record<string, number>).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-lg">{key === 'academics' ? '📚' : key === 'athletics' ? '🏃' : key === 'charm' ? '💬' : '🎨'}</span>
                <div className="flex-1">
                  <div className="flex justify-between"><span className="text-xs text-gray-400 capitalize">{key}</span><span className="text-xs text-white font-bold">{val}/100</span></div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Total flirts: {state.totalFlirts} | Day: {state.day}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-white mb-3">💕 Relationships</h4>
          <div className="space-y-3">
            {characters.map(char => {
              const rel = state.relationships[char.id]!;
              return (
                <div key={char.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-xl`}>{char.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">{char.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: STAGE_COLORS[rel.stage] + '30', color: STAGE_COLORS[rel.stage] }}>{STAGE_LABELS[rel.stage]}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: `${rel.affection}%` }} />
                        </div>
                        <span className="text-xs text-pink-400 font-bold">{rel.affection}/100</span>
                      </div>
                      {/* Tension meter */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500">Tension:</span>
                        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-pink-400 rounded-full" style={{ width: `${rel.tension}%` }} />
                        </div>
                        <span className="text-[10px] text-red-400">{rel.tension}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>💬 {rel.conversationsHad}</span>
                    <span>🎁 {rel.giftsGiven}</span>
                    <span>💕 {rel.flirtCount} flirts</span>
                    <span>🎯 {rel.goalsCompleted.length}/{char.goals.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-sm font-bold text-white mb-2">🎒 Inventory</h4>
          {state.inventory.length === 0 ? <p className="text-gray-500 text-xs">Empty</p> : (
            <div className="flex flex-wrap gap-2">
              {state.inventory.map(item => {
                const gift = gifts.find(g => g.id === item.giftId);
                return gift ? <div key={item.giftId} className="bg-white/5 rounded-lg px-3 py-2 text-xs text-white">{gift.emoji} {gift.name} x{item.quantity}</div> : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== NOTIFICATION TOAST =====
function NotificationToast({ notifications }: { notifications: string[] }) {
  const [visible, setVisible] = useState<string | null>(null);
  const prevRef = useRef<string[]>([]);
  useEffect(() => {
    if (notifications.length > 0 && notifications[0] !== prevRef.current[0]) {
      setVisible(notifications[0]);
      const t = setTimeout(() => setVisible(null), 3000);
      prevRef.current = notifications;
      return () => clearTimeout(t);
    }
  }, [notifications]);
  if (!visible) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
      <div className="bg-black/80 backdrop-blur-xl border border-pink-500/30 rounded-xl px-5 py-3 shadow-xl shadow-pink-500/10">
        <p className="text-sm text-white">{visible}</p>
      </div>
    </div>
  );
}

// ===== CONVERSATION DISPLAY =====
function ConversationDisplay({ 
  node, 
  characterId, 
  choices, 
  onChoice, 
  onAdvance 
}: { 
  node: ConversationNode; 
  characterId: string; 
  choices: ConversationChoice[]; 
  onChoice: (choiceId: string) => void;
  onAdvance: () => void;
}) {
  const char = characters.find(c => c.id === characterId);
  const hasChoices = choices.length > 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      <div 
        className="bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-5 cursor-pointer"
        onClick={!hasChoices ? onAdvance : undefined}
      >
        {/* Speaker name */}
        {node.speaker && (
          <div className="flex items-center gap-2 mb-2">
            {char && <span className="text-xl">{char.avatar}</span>}
            <span className={`font-bold ${char ? `bg-gradient-to-r ${char.color} bg-clip-text text-transparent` : 'text-gray-300'}`}>
              {node.speaker}
            </span>
          </div>
        )}

        {/* Dialogue text */}
        <p className="text-white text-lg leading-relaxed animate-textReveal">{node.text}</p>

        {/* Choices or continue prompt */}
        {hasChoices ? (
          <div className="mt-4 space-y-2" onClick={e => e.stopPropagation()}>
            {choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => onChoice(choice.id)}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all border ${
                  choice.type === 'flirt' 
                    ? 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-200' 
                    : choice.type === 'bold'
                    ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-200'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/30 text-white'
                }`}
              >
                <span className="mr-2">{choice.emoji || '•'}</span>
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <span className="text-gray-500 text-xs animate-pulse">▼ Click to continue</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== WEATHER EFFECTS =====
function WeatherEffects({ weather }: { weather: Weather }) {
  if (weather === 'rainy') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="absolute w-0.5 h-8 bg-blue-300/20 animate-rain"
            style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }} />
        ))}
      </div>
    );
  }
  if (weather === 'snowy') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute text-white/40 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, fontSize: '8px' }}>❄</div>
        ))}
      </div>
    );
  }
  return null;
}

// ===== MAIN APP =====
export default function App() {
  const {
    state, startGame, advanceDialogue, selectLocation, handleChoice,
    giveGift, buyGift, goToSleep, trainStat, openMenu, closeMenu,
    backToLocationSelect, backToChoices, handleFlirt, triggerSecretScene,
    startConversation, makeConversationChoice, advanceConversation, endConversation, getConversationChoices,
    currentConversationNode,
    FLIRT_OPTIONS,
  } = useGameState();

  const currentLoc = state.currentLocation ? locations.find(l => l.id === state.currentLocation) : null;
  const currentChar = state.currentCharacter ? characters.find(c => c.id === state.currentCharacter) : null;

  // Background
  const getBg = () => {
    // Check if we're in a secret scene with custom background
    if (state.phase === 'dialogue' && state.currentDialogue.length > 0) {
      // Look for secret scene by matching dialogue
      const currentScene = secretScenes.find(s => 
        s.dialogue[0]?.text === state.currentDialogue[0]?.text
      );
      if (currentScene?.bgImage) return currentScene.bgImage;
    }
    if (currentLoc?.bgImage) return currentLoc.bgImage;
    if (state.currentLocation && LOCATION_IMAGES[state.currentLocation]) return LOCATION_IMAGES[state.currentLocation];
    return '';
  };
  const bgImage = getBg();
  const defaultGradient = state.timeOfDay === 'morning' ? 'from-amber-900/40 to-slate-950' : state.timeOfDay === 'afternoon' ? 'from-sky-900/40 to-slate-950' : state.timeOfDay === 'evening' ? 'from-purple-900/40 to-slate-950' : 'from-indigo-950/60 to-slate-950';

  if (state.phase === 'title') return <TitleScreen onStart={startGame} />;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Background Image */}
      {bgImage && <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${bgImage})` }} />}
      {!bgImage && <div className={`absolute inset-0 bg-gradient-to-b ${defaultGradient}`} />}
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />
      {/* Weather effects */}
      <WeatherEffects weather={state.weather} />

      {/* HUD */}
      <HUD state={state} onMenu={openMenu} onSleep={goToSleep} />

      {/* Location badge */}
      {currentLoc && (state.phase === 'encounter' || state.phase === 'choice' || state.phase === 'flirt' || state.phase === 'gift_give') && (
        <div className="absolute top-24 left-4 z-10">
          <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80 border border-white/10">
            {currentLoc.emoji} {currentLoc.name}
          </span>
        </div>
      )}

      {/* Character Portrait */}
      {currentChar && (state.phase === 'encounter' || state.phase === 'dialogue' || state.phase === 'choice' || state.phase === 'flirt') && (
        <CharacterPortrait characterId={currentChar.id} />
      )}

      {/* Affection/Tension popup */}
      {currentChar && state.relationships[currentChar.id] && (state.phase === 'encounter' || state.phase === 'choice' || state.phase === 'flirt') && (
        <div className="absolute top-24 right-4 z-10 bg-black/70 backdrop-blur-xl rounded-xl p-3 border border-white/10 min-w-[160px]">
          <div className="flex items-center gap-2 mb-2">
            <span>{currentChar.avatar}</span>
            <span className="text-xs text-white font-bold">{currentChar.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-400">♥</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all" style={{ width: `${state.relationships[currentChar.id].affection}%` }} />
            </div>
            <span className="text-xs text-pink-400 font-bold">{state.relationships[currentChar.id].affection}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-red-400">🔥</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all" style={{ width: `${state.relationships[currentChar.id].tension}%` }} />
            </div>
            <span className="text-xs text-red-400">{state.relationships[currentChar.id].tension}</span>
          </div>
          <span className="text-[10px] mt-1 block" style={{ color: STAGE_COLORS[state.relationships[currentChar.id].stage] }}>
            {STAGE_LABELS[state.relationships[currentChar.id].stage]}
          </span>
        </div>
      )}

      {/* LOCATION SELECT */}
      {state.phase === 'location_select' && <LocationSelect state={state} onSelect={selectLocation} onTrain={trainStat} />}

      {/* CAFÉ SHOP */}
      {state.phase === 'dialogue' && state.currentLocation === 'cafe' && state.currentDialogueIndex >= state.currentDialogue.length - 1 && (
        <CafeScene allowance={state.allowance} onBuy={buyGift} onBack={backToLocationSelect} />
      )}

      {/* OUTFIT STORE */}
      {state.phase === 'dialogue' && state.currentLocation === 'outfit_store' && state.currentDialogueIndex >= state.currentDialogue.length - 1 && (
        <OutfitStore allowance={state.allowance} onBuy={buyGift} onBack={backToLocationSelect} />
      )}

      {/* APARTMENT MENU */}
      {state.phase === 'dialogue' && state.currentLocation === 'apartment' && state.currentDialogueIndex >= state.currentDialogue.length - 1 && (
        <ApartmentMenu state={state} onTrain={trainStat} onBack={backToLocationSelect} />
      )}

      {/* DIALOGUE */}
      {(state.phase === 'wakeup' || state.phase === 'encounter' || state.phase === 'dialogue' || state.phase === 'day_end') &&
        state.currentDialogue.length > 0 &&
        !(state.currentLocation === 'cafe' && state.currentDialogueIndex >= state.currentDialogue.length - 1) && (
        <DialogueBox dialogue={state.currentDialogue} index={state.currentDialogueIndex} characterId={state.currentCharacter || undefined} onClick={advanceDialogue} />
      )}

      {/* CHOICES */}
      {state.phase === 'choice' && state.currentChoices.length > 0 && (
        <ChoiceMenu choices={state.currentChoices} onChoose={handleChoice} characterId={state.currentCharacter || undefined} />
      )}

      {/* FLIRT MENU */}
      {state.phase === 'flirt' && (
        <FlirtMenu options={FLIRT_OPTIONS} playerCharm={state.playerStats.charm} onFlirt={handleFlirt} onBack={backToChoices} />
      )}

      {/* SECRET SCENES MENU */}
      {state.phase === 'secret_scenes' && state.currentCharacter && (
        <SecretScenesMenu characterId={state.currentCharacter} state={state} onSelect={triggerSecretScene} onBack={backToChoices} />
      )}

      {/* GIFT MENU */}
      {state.phase === 'gift_give' && state.currentCharacter && (
        <GiftGiveMenu characterId={state.currentCharacter} inventory={state.inventory} allowance={state.allowance} onGive={giveGift} onBack={backToChoices} onBuy={buyGift} />
      )}

      {/* STATS MENU */}
      {state.phase === 'menu' && <StatsMenu state={state} onClose={closeMenu} />}

      {/* CONVERSATION DISPLAY */}
      {state.phase === 'conversation' && currentConversationNode && state.currentCharacter && (
        <ConversationDisplay
          node={currentConversationNode}
          characterId={state.currentCharacter}
          choices={getConversationChoices()}
          onChoice={makeConversationChoice}
          onAdvance={advanceConversation}
        />
      )}

      {/* NOTIFICATIONS */}
      <NotificationToast notifications={state.notifications} />
    </div>
  );
}
