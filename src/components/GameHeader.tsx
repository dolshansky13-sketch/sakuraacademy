import { TimeOfDay } from '../types';

interface Props {
  day: number;
  timeOfDay: TimeOfDay;
  allowance: number;
  dailyAllowance: number;
  onAdvanceTime: () => void;
  onStudy: () => void;
  onExercise: () => void;
  onSocialize: () => void;
  onCreative: () => void;
  playerStats: { academics: number; athletics: number; charm: number; creativity: number };
}

const TIME_ICONS: Record<TimeOfDay, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
};

const TIME_BG: Record<TimeOfDay, string> = {
  morning: 'from-orange-900/30 to-yellow-900/20',
  afternoon: 'from-blue-900/30 to-cyan-900/20',
  evening: 'from-purple-900/30 to-pink-900/20',
  night: 'from-indigo-900/40 to-gray-900/30',
};

export default function GameHeader({
  day, timeOfDay, allowance, dailyAllowance,
  onAdvanceTime, onStudy, onExercise, onSocialize, onCreative, playerStats
}: Props) {
  return (
    <div className={`bg-gradient-to-r ${TIME_BG[timeOfDay]} rounded-xl p-4 backdrop-blur-sm border border-white/10`}>
      {/* Top Row - Day Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{TIME_ICONS[timeOfDay]}</span>
          <div>
            <h2 className="text-white font-bold text-lg">Day {day}</h2>
            <p className="text-gray-400 text-xs capitalize">{timeOfDay}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-yellow-400 font-bold text-lg">¥{allowance}</p>
          <p className="text-gray-500 text-xs">Daily: ¥{dailyAllowance}</p>
        </div>
      </div>

      {/* Player Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <StatBar label="📚" value={playerStats.academics} color="bg-blue-400" />
        <StatBar label="🏃" value={playerStats.athletics} color="bg-green-400" />
        <StatBar label="💬" value={playerStats.charm} color="bg-pink-400" />
        <StatBar label="🎨" value={playerStats.creativity} color="bg-purple-400" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onStudy}
          className="flex-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors border border-blue-500/30"
        >
          📚 Study
        </button>
        <button
          onClick={onExercise}
          className="flex-1 px-2 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-xs font-medium transition-colors border border-green-500/30"
        >
          🏃 Exercise
        </button>
        <button
          onClick={onSocialize}
          className="flex-1 px-2 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg text-xs font-medium transition-colors border border-pink-500/30"
        >
          💬 Social
        </button>
        <button
          onClick={onCreative}
          className="flex-1 px-2 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium transition-colors border border-purple-500/30"
        >
          🎨 Create
        </button>
        <button
          onClick={onAdvanceTime}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/20"
        >
          ⏭️ Next
        </button>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <span className="text-xs">{label}</span>
      <div className="h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400">{value}</span>
    </div>
  );
}
