import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { characters } from './data/characters';
import CharacterCard from './components/CharacterCard';
import CharacterDetail from './components/CharacterDetail';
import GiftShop from './components/GiftShop';
import GameHeader from './components/GameHeader';
import NotificationPanel from './components/NotificationPanel';
import SceneViewer from './components/SceneViewer';

type Tab = 'roster' | 'shop' | 'stats';

export default function App() {
  const {
    state,
    giveGift,
    talkToCharacter,
    advanceTime,
    study,
    exercise,
    socialize,
    createArt,
    resetGame,
  } = useGameState();

  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [showScene, setShowScene] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const selectedCharacter = characters.find(c => c.id === selectedCharId);
  const selectedProgress = selectedCharId ? state.relationships[selectedCharId] : null;

  const totalAffection = Object.values(state.relationships).reduce((sum, r) => sum + r.affection, 0);
  const maxAffection = characters.length * 100;
  const overallProgress = Math.round((totalAffection / maxAffection) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]" />
      </div>

      <div className="relative max-w-6xl mx-auto p-4">
        {/* Title Bar */}
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            🌸 Sakura Academy
          </h1>
          <p className="text-gray-500 text-sm mt-1">A High School Dating Sim</p>
        </header>

        {/* Game Header */}
        <GameHeader
          day={state.day}
          timeOfDay={state.timeOfDay}
          allowance={state.allowance}
          dailyAllowance={state.dailyAllowance}
          onAdvanceTime={advanceTime}
          onStudy={study}
          onExercise={exercise}
          onSocialize={socialize}
          onCreative={createArt}
          playerStats={state.playerStats}
        />

        {/* Overall Progress */}
        <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Overall Romance Progress</span>
            <span className="text-xs text-pink-400 font-bold">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 mb-3">
          {(['roster', 'shop', 'stats'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              {tab === 'roster' && '💕 Characters'}
              {tab === 'shop' && '🎁 Gift Shop'}
              {tab === 'stats' && '📊 Progress'}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Panel - Character Roster / Tab Content */}
          <div className="lg:col-span-2">
            {activeTab === 'roster' && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {characters.map(char => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      progress={state.relationships[char.id]}
                      onSelect={() => setSelectedCharId(char.id === selectedCharId ? null : char.id)}
                      isSelected={char.id === selectedCharId}
                    />
                  ))}
                </div>

                {/* Selected Character Detail */}
                {selectedCharacter && selectedProgress && (
                  <div className="mt-4">
                    <CharacterDetail
                      character={selectedCharacter}
                      progress={selectedProgress}
                      onTalk={() => talkToCharacter(selectedCharacter.id)}
                      onGift={() => {}}
                      playerStats={state.playerStats}
                    />
                    {/* View Scene Button */}
                    <button
                      onClick={() => setShowScene(true)}
                      className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white rounded-xl text-sm font-medium transition-all border border-pink-500/20"
                    >
                      🎬 View Scene — {selectedCharacter.name}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shop' && selectedCharacter && selectedProgress && (
              <GiftShop
                allowance={state.allowance}
                onGiveGift={(giftId) => giveGift(selectedCharacter.id, giftId)}
                characterName={selectedCharacter.name}
              />
            )}

            {activeTab === 'shop' && !selectedCharacter && (
              <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
                <p className="text-4xl mb-3">🎁</p>
                <p className="text-gray-400">Select a character from the roster to give gifts!</p>
                <button
                  onClick={() => setActiveTab('roster')}
                  className="mt-3 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg text-sm hover:bg-pink-500/30 transition-colors"
                >
                  Go to Characters
                </button>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-4">
                {/* Individual Stats */}
                {characters.map(char => {
                  const rel = state.relationships[char.id];
                  return (
                    <div key={char.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-xl`}>
                          {char.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-sm">{char.name}</h4>
                          <p className="text-gray-400 text-xs">{rel.giftsGiven} gifts • {rel.conversationsHad} chats</p>
                        </div>
                        <span className="text-pink-400 font-bold text-sm">{rel.affection}♥</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all"
                          style={{ width: `${rel.affection}%` }}
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        {char.goals.map((goal, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 text-center p-1 rounded text-xs ${
                              rel.goalsCompleted.includes(idx)
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-white/5 text-gray-500 border border-white/5'
                            }`}
                          >
                            {rel.goalsCompleted.includes(idx) ? '✅' : `${goal.affectionThreshold}♥`}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel - Notifications & Info */}
          <div className="space-y-4">
            <NotificationPanel notifications={state.notifications} />

            {/* Quick Tips */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2">💡 Tips</h3>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Give liked gifts for 2.5x affection bonus</li>
                <li>• Disliked gifts reduce affection!</li>
                <li>• Talk daily to build bonds</li>
                <li>• Train your stats to unlock options</li>
                <li>• New day = ¥{state.dailyAllowance} allowance</li>
              </ul>
            </div>

            {/* Relationship Summary */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2">💕 Relationships</h3>
              <div className="space-y-2">
                {characters.map(char => {
                  const rel = state.relationships[char.id];
                  return (
                    <div key={char.id} className="flex items-center gap-2">
                      <span className="text-sm">{char.avatar}</span>
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${char.color} rounded-full transition-all`}
                          style={{ width: `${rel.affection}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{rel.affection}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors border border-red-500/20"
                >
                  🔄 Reset Game
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-red-400 mb-2">Are you sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { resetGame(); setShowResetConfirm(false); }}
                      className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-3 py-1.5 bg-white/10 text-gray-400 rounded-lg text-xs hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scene Viewer Modal */}
      {showScene && selectedCharacter && selectedProgress && (
        <SceneViewer
          character={selectedCharacter}
          progress={selectedProgress}
          timeOfDay={state.timeOfDay}
          onClose={() => setShowScene(false)}
        />
      )}
    </div>
  );
}
