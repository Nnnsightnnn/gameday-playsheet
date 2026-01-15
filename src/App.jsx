import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './lib/db'
import PlaybookBrowser from './components/PlaybookBrowser'
import MyPlaysheet from './components/MyPlaysheet'

function App() {
  const [activeTab, setActiveTab] = useState('browse') // 'browse' | 'playsheet'
  const [selectedSide, setSelectedSide] = useState('offense') // 'offense' | 'defense'
  
  // Live query for my plays count
  const myPlaysCount = useLiveQuery(() => db.myPlays.count(), [], 0)

  return (
    <div className="min-h-screen stadium-lights-bg text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-green-400 hero-title uppercase">
            Gameday Playsheet
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {myPlaysCount} plays in your playsheet
            </span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-gray-800/60 backdrop-blur-sm px-6 py-2 flex gap-4 border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'browse'
              ? 'bg-green-600 text-white nav-glow-active'
              : 'text-gray-400 hover:text-white hover:bg-gray-700 nav-glow'
          }`}
        >
          Browse Plays
        </button>
        <button
          onClick={() => setActiveTab('playsheet')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'playsheet'
              ? 'bg-green-600 text-white nav-glow-active'
              : 'text-gray-400 hover:text-white hover:bg-gray-700 nav-glow'
          }`}
        >
          My Playsheet ({myPlaysCount})
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'browse' ? (
          <div>
            {/* Side Toggle (Offense/Defense) */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedSide('offense')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedSide === 'offense'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Offense
              </button>
              <button
                onClick={() => setSelectedSide('defense')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedSide === 'defense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Defense
              </button>
            </div>

            <PlaybookBrowser side={selectedSide} />
          </div>
        ) : (
          <MyPlaysheet />
        )}
      </main>
    </div>
  )
}

export default App
