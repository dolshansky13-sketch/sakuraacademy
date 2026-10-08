import { Character, RelationshipProgress, TimeOfDay, STAGE_LABELS } from '../types';

interface Props {
  character: Character;
  progress: RelationshipProgress;
  timeOfDay: TimeOfDay;
  onClose: () => void;
}

const SCENE_BACKGROUNDS: Record<TimeOfDay, string> = {
  morning: 'from-amber-900/40 via-orange-800/20 to-transparent',
  afternoon: 'from-sky-900/40 via-blue-800/20 to-transparent',
  evening: 'from-purple-900/40 via-pink-800/20 to-transparent',
  night: 'from-indigo-900/50 via-purple-900/30 to-transparent',
};

const SCENE_LOCATIONS: Record<TimeOfDay, string> = {
  morning: 'School Gate',
  afternoon: 'Classroom',
  evening: 'Rooftop',
  night: 'Park Bench',
};

export default function SceneViewer({ character, progress, timeOfDay, onClose }: Props) {
  const dialogues = character.dialogue[progress.stage];
  const location = SCENE_LOCATIONS[timeOfDay];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900/95 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Scene Background */}
        <div className={`h-48 bg-gradient-to-b ${SCENE_BACKGROUNDS[timeOfDay]} relative flex items-center justify-center`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="text-center z-10">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-5xl mx-auto shadow-2xl mb-3`}>
              {character.avatar}
            </div>
            <p className="text-white font-bold text-lg">{character.name}</p>
            <p className="text-gray-300 text-xs">{location} • {STAGE_LABELS[progress.stage]}</p>
          </div>
        </div>

        {/* Dialogue */}
        <div className="p-5">
          <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
            {dialogues.map((line, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <p className="text-sm text-gray-300 italic leading-relaxed">"{line}"</p>
                {idx < dialogues.length - 1 && <div className="border-b border-white/5 mt-3" />}
              </div>
            ))}
          </div>

          {/* Scene Info */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                🎁 Gifts: {progress.giftsGiven}
              </span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                💬 Chats: {progress.conversationsHad}
              </span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                ♥ {progress.affection}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
