import { Character, RelationshipProgress, STAGE_LABELS } from '../types';

interface Props {
  character: Character;
  progress: RelationshipProgress;
  onTalk: () => void;
  onGift: (giftId: string) => void;
  playerStats: { academics: number; athletics: number; charm: number; creativity: number };
}

export default function CharacterDetail({ character, progress, onTalk, onGift, playerStats }: Props) {
  const currentDialogue = character.dialogue[progress.stage];
  const randomDialogue = currentDialogue[Math.floor(Math.random() * currentDialogue.length)];

  return (
    <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-4xl shadow-xl`}>
          {character.avatar}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{character.name}</h2>
          <p className="text-gray-400 text-sm">{character.grade} • {character.personality}</p>
          <p className="text-gray-300 text-sm mt-1 italic">{character.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(character.stats).map(([key, value]) => (
          <div key={key} className="text-center bg-white/5 rounded-lg p-2">
            <div className="text-xs text-gray-400 capitalize">{key}</div>
            <div className="text-sm font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Dialogue */}
      <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
        <p className="text-sm text-gray-300 italic">"{randomDialogue}"</p>
        <p className="text-xs text-gray-500 mt-1">— {STAGE_LABELS[progress.stage]} stage</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onTalk}
          className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors border border-blue-500/30"
        >
          💬 Talk
        </button>
        <button
          onClick={() => {}}
          className="flex-1 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg text-sm font-medium transition-colors border border-pink-500/30"
          disabled
        >
          🎁 Give Gift (scroll down)
        </button>
      </div>

      {/* Goals */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white mb-2">🎯 Goals</h4>
        <div className="space-y-2">
          {character.goals.map((goal, idx) => {
            const completed = progress.goalsCompleted.includes(idx);
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5 border border-white/5'
                }`}
              >
                <span className={`text-sm ${completed ? 'text-green-400' : 'text-gray-500'}`}>
                  {completed ? '✅' : '⬜'}
                </span>
                <div className="flex-1">
                  <p className={`text-xs ${completed ? 'text-green-300' : 'text-gray-400'}`}>
                    {goal.description}
                  </p>
                  <p className="text-xs text-gray-500">{goal.reward}</p>
                </div>
                <span className="text-xs text-gray-500">{goal.affectionThreshold}♥</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Stats Match */}
      <div className="bg-white/5 rounded-lg p-3">
        <h4 className="text-xs font-bold text-gray-400 mb-2">Your Stats</h4>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(playerStats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xs text-gray-500 capitalize">{key.slice(0, 4)}</div>
              <div className="text-xs font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
