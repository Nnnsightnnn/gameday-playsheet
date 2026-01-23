import { useState, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { db, removeFromMyPlays, updatePlayNotes } from '../lib/db'
import GameContextBar from './GameContextBar'
import SituationTabs from './SituationTabs'
import PlayCard from './PlayCard'
import { SITUATION_TAGS } from '../data/defensiveConstants'
import BinderContainer from './binder/BinderContainer'
import BinderTabDivider from './binder/BinderTabDivider'
import ChapterEdgeTabs from './binder/ChapterEdgeTabs'
import PageTransition from './binder/PageTransition'

// Build situation definitions from SITUATION_TAGS
const SITUATIONS = [
  { id: 'all', label: 'All', tag: null, color: 'bg-gray-600' },
  ...SITUATION_TAGS.map(tag => ({
    id: tag.name.replace(/\s+/g, '-').toLowerCase(),
    label: tag.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    tag: tag.name,
    color: tag.color,
  }))
]

function MyPlaysheet() {
  const [selectedSide, setSelectedSide] = useState('offense') // 'offense' | 'defense'
  const [activeSituation, setActiveSituation] = useState(SITUATIONS[0]) // 'All' by default
  const [sortBy, setSortBy] = useState('formation') // 'formation' | 'rating' | 'added'
  const [isDragging, setIsDragging] = useState(false)
  const [activePlay, setActivePlay] = useState(null)

  // Multi-select state
  const [selectedPlayIds, setSelectedPlayIds] = useState(new Set())
  const [selectionMode, setSelectionMode] = useState(false)

  // Formation group navigation
  const [activeFormationGroup, setActiveFormationGroup] = useState(null)
  const formationGroupRefs = useRef({})

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
    // Also remove from selection
    setSelectedPlayIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleRating = async (id, rating) => {
    await updatePlayNotes(id, { rating })
  }

  // Selection handlers
  const handleSelectPlay = (playId) => {
    setSelectedPlayIds(prev => {
      const next = new Set(prev)
      if (next.has(playId)) {
        next.delete(playId)
      } else {
        next.add(playId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    const allIds = new Set(sortedPlays.map(p => p.id))
    setSelectedPlayIds(allIds)
  }

  const handleClearSelection = () => {
    setSelectedPlayIds(new Set())
    setSelectionMode(false)
  }

  const toggleSelectionMode = () => {
    if (selectionMode) {
      // Exiting selection mode, clear selections
      setSelectedPlayIds(new Set())
    }
    setSelectionMode(!selectionMode)
  }

  // Get selected plays for drag operations
  const getSelectedPlays = () => {
    return myPlays.filter(p => selectedPlayIds.has(p.id))
  }

  // Scroll to formation group
  const scrollToFormationGroup = (groupName) => {
    setActiveFormationGroup(groupName)
    const element = formationGroupRefs.current[groupName]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Get unique formation group names
  const formationGroupNames = Object.keys(formationGroups)

  // Drag handlers
  const handleDragStart = (event) => {
    setIsDragging(true)
    const draggedPlay = event.active.data.current?.play
    setActivePlay(draggedPlay || null)

    // If dragged play isn't selected but we have selections, add it
    if (draggedPlay && selectedPlayIds.size > 0 && !selectedPlayIds.has(draggedPlay.id)) {
      setSelectedPlayIds(prev => new Set([...prev, draggedPlay.id]))
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setIsDragging(false)
    setActivePlay(null)

    // Check if we dropped on a situation tab
    if (over && over.id.toString().startsWith('situation-')) {
      const situation = over.data.current?.situation
      const draggedPlay = active.data.current?.play

      if (situation && situation.tag) {
        // Determine which plays to update
        let playsToUpdate = []

        if (selectedPlayIds.size > 0 && selectedPlayIds.has(draggedPlay?.id)) {
          // Update all selected plays
          playsToUpdate = getSelectedPlays()
        } else if (draggedPlay) {
          // Just update the dragged play
          playsToUpdate = [draggedPlay]
        }

        // Add tag to all plays
        for (const play of playsToUpdate) {
          const currentTags = play.tags || []
          if (!currentTags.includes(situation.tag)) {
            await updatePlayNotes(play.id, {
              tags: [...currentTags, situation.tag]
            })
          }
        }

        // Clear selection after successful drop
        if (selectedPlayIds.size > 0) {
          setSelectedPlayIds(new Set())
          setSelectionMode(false)
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
  const selectedCount = selectedPlayIds.size

  // Count of selected plays being dragged
  const dragCount = isDragging && selectedPlayIds.size > 0 && activePlay && selectedPlayIds.has(activePlay.id)
    ? selectedPlayIds.size
    : 1

  // Pulse animation keys
  const totalPulseKey = `total-${totalPlays}`
  const passPulseKey = `pass-${passPlays}`
  const runPulseKey = `run-${runPlays}`

  if (totalPlays === 0) {
    return (
      <div className="playsheet-container space-y-4">
        <GameContextBar />
        <BinderContainer>
          {/* Tab Dividers */}
          <BinderTabDivider
            selectedSide={selectedSide}
            onSideChange={setSelectedSide}
          />
          <div className="p-6">
            <div className="text-center py-16 bg-gray-800 rounded-lg laminated-premium paper-texture">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold mb-2">Your {selectedSide} playsheet is empty</h2>
              <p className="text-gray-400">
                Browse {selectedSide} plays and click + Add to build your game plan
              </p>
            </div>
          </div>
        </BinderContainer>
      </div>
    )
  }

  // Transition key for page animations
  const transitionKey = `${selectedSide}-${activeSituation?.id}`

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

        {/* Binder Container */}
        <BinderContainer>
          {/* Tab Dividers (Offense/Defense) */}
          <BinderTabDivider
            selectedSide={selectedSide}
            onSideChange={setSelectedSide}
          />

          {/* Binder Inner Content */}
          <div className="relative p-4">
            {/* Chapter Edge Tabs */}
            {sortBy === 'formation' && (
              <ChapterEdgeTabs
                formationGroups={formationGroupNames}
                activeGroup={activeFormationGroup}
                onGroupChange={scrollToFormationGroup}
              />
            )}

            {/* Situation Tabs - Drop targets */}
            <SituationTabs
              situations={SITUATIONS}
              activeSituation={activeSituation}
              onSituationChange={setActiveSituation}
              isDragging={isDragging}
            />

            {/* Stats Bar with Selection Controls */}
            <div className="flex items-center justify-between bg-gray-950/80 backdrop-blur-sm rounded-lg p-3 flex-wrap gap-4 mt-4">
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

              {/* Selection & Sort Controls */}
              <div className="flex items-center gap-3">
                {/* Selection Mode Toggle */}
                <button
                  onClick={toggleSelectionMode}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    selectionMode
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {selectionMode ? `Select Mode (${selectedCount})` : 'Select'}
                </button>

                {selectionMode && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      All
                    </button>
                    <button
                      onClick={handleClearSelection}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </>
                )}

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 border-l border-gray-700 pl-3">
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
            </div>

            {/* Selection hint when in selection mode */}
            {selectionMode && selectedCount > 0 && (
              <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 mt-2">
                <span className="font-medium">{selectedCount} play{selectedCount !== 1 ? 's' : ''} selected</span>
                <span className="text-green-600">—</span>
                <span>Drag any selected play to a situation tab to tag all</span>
              </div>
            )}

            {/* Laminated Playsheet Grid */}
            <PageTransition transitionKey={transitionKey}>
              <div className="laminated-premium paper-texture paper-stack-shadow bg-gray-800 rounded-lg overflow-hidden mt-4">
                {sortBy === 'formation' ? (
                  // Grid layout grouped by formation group, then by formation
                  <div className="divide-y divide-gray-700">
                    {Object.entries(formationGroups).map(([groupName, formations]) => (
                      <div
                        key={groupName}
                        ref={el => formationGroupRefs.current[groupName] = el}
                        className="formation-group-section"
                      >
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
                                    selectionMode={selectionMode}
                                    isSelected={selectedPlayIds.has(play.id)}
                                    onSelect={() => handleSelectPlay(play.id)}
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
                          selectionMode={selectionMode}
                          isSelected={selectedPlayIds.has(play.id)}
                          onSelect={() => handleSelectPlay(play.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PageTransition>
          </div>
        </BinderContainer>
      </div>

      {/* Drag Overlay - shows dragged item(s) */}
      <DragOverlay>
        {activePlay ? (
          <div className="bg-gray-800 p-3 rounded-lg shadow-2xl ring-2 ring-green-500 border-l-4 border-green-500 opacity-90">
            <div className="font-medium text-sm">{activePlay.playName}</div>
            <div className="text-xs text-gray-400">{activePlay.formation}</div>
            {dragCount > 1 && (
              <div className="mt-1 text-xs text-green-400 font-medium">
                +{dragCount - 1} more selected
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default MyPlaysheet
