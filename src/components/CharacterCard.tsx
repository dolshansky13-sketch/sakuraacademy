import { Character, RelationshipProgress, STAGE_LABELS, STAGE_COLORS } from '../types';

interface Props {
  character: Character;
  progress: RelationshipProgress;
  onSelect: () => void;
  isSelected: boolean;
}

export default function CharacterCard({ character, progress, onSelect, isSelected }: Props) {
  const stageLabel = STAGE_LABELS[progress.stage];
  const stageColor = STAGE_COLORS[progress.stage];

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? 'ring-2 ring-pink-400 shadow-lg shadow-pink-400/20 bg-white/10'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-2xl shadow-lg`}>
          {character.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm truncate">{character.name}</h3>
          <p className="text-gray-400 text-xs">{character.grade} • {character.personality}</p>
        </div>
      </div>

      {/* Affection Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Affection</span>
          <span className="text-xs font-bold text-pink-400">{progress.affection}/100</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${progress.affection}%` }}
          />
        </div>
      </div>

      {/* Stage Badge */}
      <div className="mt-2 flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${stageColor}`}>
          {stageLabel}
        </span>
        <span className="text-xs text-gray-500">
          💬{progress.conversationsHad} 🎁{progress.giftsGiven}
        </span>
      </div>

      {/* Goals Progress */}
      <div className="mt-2 flex gap-1">
        {character.goals.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              progress.goalsCompleted.includes(idx) ? 'bg-yellow-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
