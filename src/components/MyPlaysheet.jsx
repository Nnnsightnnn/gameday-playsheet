import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { db, removeFromMyPlays, updatePlayNotes } from '../lib/db'
import GameContextBar from './GameContextBar'
import SituationTabs from './SituationTabs'
import PlayCard from './PlayCard'

// Situation definitions for filtering plays
const SITUATIONS = [
  { id: 'all', label: 'All', tag: null, color: 'bg-gray-600' },
  { id: '1st-down', label: '1st Down', tag: 'opener', color: 'bg-cyan-600' },
  { id: '3rd-down', label: '3rd Down', tag: '3rd down', color: 'bg-yellow-600' },
  { id: 'red-zone', label: 'Red Zone', tag: 'red zone', color: 'bg-red-600' },
  { id: 'goal-line', label: 'Goal Line', tag: 'goal line', color: 'bg-purple-600' },
  { id: '2-min', label: '2 Minute', tag: '2 min', color: 'bg-blue-600' },
  { id: 'money', label: 'Money', tag: 'money', color: 'bg-green-600' },
]

function MyPlaysheet() {
  const [selectedSide, setSelectedSide] = useState('offense') // 'offense' | 'defense'
  const [activeSituation, setActiveSituation] = useState(SITUATIONS[0]) // 'All' by default
  const [sortBy, setSortBy] = useState('formation') // 'formation' | 'rating' | 'added'
  const [isDragging, setIsDragging] = useState(false)
  const [activePlay, setActivePlay] = useState(null)

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold before drag starts on touch
        tolerance: 5,
      },
    })
  )

  // Live query for plays filtered by side
  const myPlays = useLiveQuery(
    () => db.myPlays.where('side').equals(selectedSide).toArray(),
    [selectedSide],
    []
  )

  // Filter plays by situation tag
  const filteredPlays = activeSituation?.tag
    ? myPlays.filter(p => p.tags?.includes(activeSituation.tag))
    : myPlays

  // Sort plays
  const sortedPlays = [...filteredPlays].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0)
    }
    if (sortBy === 'added') {
      return new Date(b.addedAt) - new Date(a.addedAt)
    }
    // Default: by formation group then formation
    const groupCompare = (a.formationGroup || '').localeCompare(b.formationGroup || '')
    if (groupCompare !== 0) return groupCompare
    return (a.formation || '').localeCompare(b.formation || '')
  })

  // Group plays by formation for grid layout
  const groupedByFormation = sortedPlays.reduce((acc, play) => {
    const formation = play.formation || 'Uncategorized'
    if (!acc[formation]) {
      acc[formation] = {
        formation,
        formationGroup: play.formationGroup || 'Other',
        plays: []
      }
    }
    acc[formation].plays.push(play)
    return acc
  }, {})

  // Group formations by formation group for section headers
  const formationGroups = Object.values(groupedByFormation).reduce((acc, formationData) => {
    const group = formationData.formationGroup
    if (!acc[group]) acc[group] = []
    acc[group].push(formationData)
    return acc
  }, {})

  const handleRemove = async (id) => {
    await removeFromMyPlays(id)
  }

  const handleRating = async (id, rating) => {
    await updatePlayNotes(id, { rating })
  }

  // Drag handlers
  const handleDragStart = (event) => {
    setIsDragging(true)
    setActivePlay(event.active.data.current?.play || null)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setIsDragging(false)
    setActivePlay(null)

    // Check if we dropped on a situation tab
    if (over && over.id.toString().startsWith('situation-')) {
      const situation = over.data.current?.situation
      const play = active.data.current?.play

      if (situation && play && situation.tag) {
        // Add the situation tag to the play if not already present
        const currentTags = play.tags || []
        if (!currentTags.includes(situation.tag)) {
          await updatePlayNotes(play.id, {
            tags: [...currentTags, situation.tag]
          })
        }
      }
    }
  }

  const handleDragCancel = () => {
    setIsDragging(false)
    setActivePlay(null)
  }

  // Stats
  const totalPlays = myPlays.length
  const passPlays = myPlays.filter(p => p.playType === 'pass').length
  const runPlays = myPlays.filter(p => p.playType === 'run').length
  const filteredCount = filteredPlays.length

  // Pulse animation keys - using the count value as key triggers CSS animation on change
  // We use a combination of count and timestamp to ensure animation replays
  const totalPulseKey = `total-${totalPlays}`
  const passPulseKey = `pass-${passPlays}`
  const runPulseKey = `run-${runPlays}`

  if (totalPlays === 0) {
    return (
      <div className="playsheet-container space-y-4">
        <GameContextBar />
        {/* Side Toggle (Offense/Defense) */}
        <div className="flex gap-2">
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
        <div className="text-center py-16 bg-gray-800 rounded-lg laminated-card">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">Your {selectedSide} playsheet is empty</h2>
          <p className="text-gray-400">
            Browse {selectedSide} plays and click + Add to build your game plan
          </p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="playsheet-container space-y-4">
        {/* Game Context Bar */}
        <GameContextBar />

        {/* Side Toggle (Offense/Defense) */}
        <div className="flex gap-2">
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

        {/* Situation Tabs - Drop targets */}
        <SituationTabs
          situations={SITUATIONS}
          activeSituation={activeSituation}
          onSituationChange={setActiveSituation}
          isDragging={isDragging}
        />

        {/* Stats Bar */}
        <div className="flex items-center justify-between bg-gray-950/80 backdrop-blur-sm rounded-lg p-3 flex-wrap gap-4">
          <div className="flex gap-6">
            <div className="flex items-baseline gap-2">
              <span key={totalPulseKey} className="text-2xl font-bold text-green-400 count-pulse">{totalPlays}</span>
              <span className="text-gray-500 text-sm">total</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span key={passPulseKey} className="text-2xl font-bold text-blue-400 count-pulse">{passPlays}</span>
              <span className="text-gray-500 text-sm">pass</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span key={runPulseKey} className="text-2xl font-bold text-orange-400 count-pulse">{runPlays}</span>
              <span className="text-gray-500 text-sm">run</span>
            </div>
            {activeSituation?.tag && (
              <div className="flex items-baseline gap-2 border-l border-gray-700 pl-6">
                <span className="text-2xl font-bold text-white">{filteredCount}</span>
                <span className="text-gray-500 text-sm">in {activeSituation.label}</span>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="formation">By Formation</option>
              <option value="rating">By Rating</option>
              <option value="added">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Laminated Playsheet Grid */}
        <div className="laminated-card bg-gray-800 rounded-lg overflow-hidden">
          {sortBy === 'formation' ? (
            // Grid layout grouped by formation group, then by formation
            <div className="divide-y divide-gray-700">
              {Object.entries(formationGroups).map(([groupName, formations]) => (
                <div key={groupName} className="formation-group-section">
                  {/* Formation Group Header */}
                  <div className="bg-gray-900 px-4 py-2 border-b border-gray-700">
                    <h3 className="font-bold text-gray-300 uppercase tracking-wide text-sm">
                      {groupName}
                      <span className="ml-2 text-gray-500 font-normal">
                        ({formations.reduce((sum, f) => sum + f.plays.length, 0)} plays)
                      </span>
                    </h3>
                  </div>

                  {/* Formations Grid */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {formations.map((formationData) => (
                      <div
                        key={formationData.formation}
                        className="formation-card bg-gray-850 rounded-lg overflow-hidden border border-gray-700"
                      >
                        {/* Formation Header */}
                        <div className="bg-gray-750 px-3 py-2 border-b border-gray-700">
                          <h4 className="font-semibold text-sm text-white truncate">
                            {formationData.formation}
                          </h4>
                          <div className="text-xs text-gray-500">
                            {formationData.plays.length} play{formationData.plays.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Plays in this formation */}
                        <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                          {formationData.plays.map(play => (
                            <PlayCard
                              key={play.id}
                              play={play}
                              onRemove={handleRemove}
                              onRating={handleRating}
                              compact={true}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat list for rating/added sort
            <div>
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-700">
                <h3 className="font-bold text-gray-300 uppercase tracking-wide text-sm">
                  {sortBy === 'rating' ? 'Sorted by Rating' : 'Recently Added'}
                  <span className="ml-2 text-gray-500 font-normal">
                    ({sortedPlays.length} plays)
                  </span>
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sortedPlays.map(play => (
                  <PlayCard
                    key={play.id}
                    play={play}
                    onRemove={handleRemove}
                    onRating={handleRating}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay - shows dragged item */}
      <DragOverlay>
        {activePlay ? (
          <div className="bg-gray-800 p-3 rounded-lg shadow-2xl ring-2 ring-green-500 border-l-4 border-green-500 opacity-90">
            <div className="font-medium text-sm">{activePlay.playName}</div>
            <div className="text-xs text-gray-400">{activePlay.formation}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default MyPlaysheet
