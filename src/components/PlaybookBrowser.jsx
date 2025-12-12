import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addToMyPlays } from '../lib/db'
import { playbooks, loadPlaybookData, getPlaybook, nameToSlug, searchPlays } from '../data/playbooks'

function PlaybookBrowser({ side }) {
  const [selectedCategory, setSelectedCategory] = useState('team')
  const [selectedPlaybookName, setSelectedPlaybookName] = useState(null)
  const [selectedFormationGroup, setSelectedFormationGroup] = useState(null)
  const [selectedFormation, setSelectedFormation] = useState(null)
  const [playbookData, setPlaybookData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // Get list of play IDs already in my playsheet
  const myPlayIds = useLiveQuery(
    () => db.myPlays.toArray().then(plays => plays.map(p => p.playId)),
    [],
    []
  )

  // Load playbook data on mount
  useEffect(() => {
    loadPlaybookData()
      .then(data => {
        setPlaybookData(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load playbook data')
        setLoading(false)
      })
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 2 && playbookData) {
      const results = searchPlays(searchQuery, { type: side, limit: 30 })
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, side, playbookData])

  const availablePlaybooks = playbooks[side][selectedCategory]

  // Get current playbook data
  const currentPlaybookId = selectedPlaybookName ? nameToSlug(selectedPlaybookName, side) : null
  const currentPlaybook = currentPlaybookId ? getPlaybook(currentPlaybookId) : null

  // Get formation groups for selected playbook
  const formationGroups = currentPlaybook?.formationGroups || []

  // Get formations for selected formation group
  const currentGroup = formationGroups.find(g => g.name === selectedFormationGroup)
  const formations = currentGroup?.formations || []

  // Get plays for selected formation
  const currentFormationData = formations.find(f => f.name === selectedFormation)
  const plays = currentFormationData?.plays || []

  const handleAddPlay = async (play, formation, formationGroup, playbookName) => {
    if (myPlayIds.includes(play.id)) return

    await addToMyPlays({
      playId: play.id,
      playbook: playbookName,
      formationGroup: formationGroup,
      formation: formation,
      playName: play.name,
      playType: play.type
    })
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedPlaybookName(null)
    setSelectedFormationGroup(null)
    setSelectedFormation(null)
  }

  const handlePlaybookSelect = (name) => {
    setSelectedPlaybookName(name)
    setSelectedFormationGroup(null)
    setSelectedFormation(null)
  }

  const handleFormationGroupSelect = (name) => {
    setSelectedFormationGroup(name)
    setSelectedFormation(null)
  }

  // Render search results
  if (searchQuery.length >= 2) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plays..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Search Results ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
              No plays found matching "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map(play => {
                const isAdded = myPlayIds.includes(play.id)
                return (
                  <div
                    key={play.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        play.type === 'run'
                          ? 'bg-orange-900 text-orange-300'
                          : 'bg-blue-900 text-blue-300'
                      }`}>
                        {play.type}
                      </span>
                      <div>
                        <div className="font-medium">{play.name}</div>
                        <div className="text-sm text-gray-400">
                          {play.playbook} → {play.formationGroup} → {play.formation}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPlay(play, play.formation, play.formationGroup, play.playbook)}
                      disabled={isAdded}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isAdded
                          ? 'bg-green-900 text-green-400 cursor-default'
                          : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plays across all playbooks..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                     text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Category Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleCategoryChange('team')}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedCategory === 'team'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Team Playbooks
        </button>
        <button
          onClick={() => handleCategoryChange('alternate')}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedCategory === 'alternate'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Alternate Playbooks
        </button>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <button
          onClick={() => {
            setSelectedPlaybookName(null)
            setSelectedFormationGroup(null)
            setSelectedFormation(null)
          }}
          className="hover:text-white"
        >
          {side === 'offense' ? 'Offense' : 'Defense'}
        </button>
        {selectedPlaybookName && (
          <>
            <span>/</span>
            <button
              onClick={() => {
                setSelectedFormationGroup(null)
                setSelectedFormation(null)
              }}
              className="hover:text-white"
            >
              {selectedPlaybookName}
            </button>
          </>
        )}
        {selectedFormationGroup && (
          <>
            <span>/</span>
            <button
              onClick={() => setSelectedFormation(null)}
              className="hover:text-white"
            >
              {selectedFormationGroup}
            </button>
          </>
        )}
        {selectedFormation && (
          <>
            <span>/</span>
            <span className="text-white">{selectedFormation}</span>
          </>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
          Loading playbook data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-8 text-center text-red-400">
          <p className="mb-2">{error}</p>
          <p className="text-sm">Make sure playbooks.json is in the public/data folder</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {!selectedPlaybookName ? (
            // Show Playbooks
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Select a {selectedCategory === 'team' ? 'Team' : 'Alternate'} Playbook
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {availablePlaybooks.map((name) => (
                  <button
                    key={name}
                    onClick={() => handlePlaybookSelect(name)}
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700
                               transition-colors text-center text-sm font-medium"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : !selectedFormationGroup ? (
            // Show Formation Groups
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {selectedPlaybookName} - Formation Groups
              </h2>
              {formationGroups.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                  <p className="mb-2">No formation data available</p>
                  <p className="text-sm">This playbook may not have been scraped yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {formationGroups.map((group) => (
                    <button
                      key={group.name}
                      onClick={() => handleFormationGroupSelect(group.name)}
                      className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700
                                 transition-colors text-center"
                    >
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {group.formations.length} formations
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : !selectedFormation ? (
            // Show Formations
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {selectedFormationGroup} - Formations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {formations.map((formation) => (
                  <button
                    key={formation.slug}
                    onClick={() => setSelectedFormation(formation.name)}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700
                               transition-colors text-left"
                  >
                    <div className="font-medium">{formation.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {formation.plays.length} plays
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Show Plays
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {selectedFormation} - Plays ({plays.length})
              </h2>
              <div className="space-y-2">
                {plays.map(play => {
                  const isAdded = myPlayIds.includes(play.id)
                  return (
                    <div
                      key={play.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          play.type === 'run'
                            ? 'bg-orange-900 text-orange-300'
                            : 'bg-blue-900 text-blue-300'
                        }`}>
                          {play.type}
                        </span>
                        <span className="font-medium">{play.name}</span>
                      </div>
                      <button
                        onClick={() => handleAddPlay(play, selectedFormation, selectedFormationGroup, selectedPlaybookName)}
                        disabled={isAdded}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isAdded
                            ? 'bg-green-900 text-green-400 cursor-default'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                      >
                        {isAdded ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PlaybookBrowser
