import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addToMyPlays } from '../lib/db'
import { playbooks, samplePlaybookData } from '../data/playbooks'

function PlaybookBrowser({ side }) {
  const [selectedCategory, setSelectedCategory] = useState('team') // 'team' | 'alternate'
  const [selectedPlaybook, setSelectedPlaybook] = useState(null)
  const [selectedFormationGroup, setSelectedFormationGroup] = useState(null)
  const [selectedFormation, setSelectedFormation] = useState(null)

  // Get list of play IDs already in my playsheet
  const myPlayIds = useLiveQuery(
    () => db.myPlays.toArray().then(plays => plays.map(p => p.playId)),
    [],
    []
  )

  const availablePlaybooks = playbooks[side][selectedCategory]

  const handleAddPlay = async (play, formation, formationGroup, playbookName) => {
    await addToMyPlays({
      playId: play.id,
      playbook: playbookName,
      formationGroup: formationGroup,
      formation: formation,
      playName: play.name,
      playType: play.type
    })
  }

  // Reset selections when side changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedPlaybook(null)
    setSelectedFormationGroup(null)
    setSelectedFormation(null)
  }

  return (
    <div className="space-y-6">
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
            setSelectedPlaybook(null)
            setSelectedFormationGroup(null)
            setSelectedFormation(null)
          }}
          className="hover:text-white"
        >
          {side === 'offense' ? 'Offense' : 'Defense'}
        </button>
        {selectedPlaybook && (
          <>
            <span>/</span>
            <button
              onClick={() => {
                setSelectedFormationGroup(null)
                setSelectedFormation(null)
              }}
              className="hover:text-white"
            >
              {selectedPlaybook}
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

      {/* Content Grid */}
      {!selectedPlaybook ? (
        // Show Playbooks
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Select a {selectedCategory === 'team' ? 'Team' : 'Alternate'} Playbook
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {availablePlaybooks.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedPlaybook(name)}
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 
                           transition-colors text-center text-sm font-medium"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : !selectedFormationGroup ? (
        // Show Formation Groups (placeholder until data is scraped)
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {selectedPlaybook} - Formation Groups
          </h2>
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            <p className="mb-2">📂 Formation groups will appear here</p>
            <p className="text-sm">Run the scraper to populate play data</p>
          </div>
        </div>
      ) : !selectedFormation ? (
        // Show Formations
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {selectedFormationGroup} - Formations
          </h2>
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            <p className="mb-2">📋 Formations will appear here</p>
            <p className="text-sm">Run the scraper to populate play data</p>
          </div>
        </div>
      ) : (
        // Show Plays
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {selectedFormation} - Plays
          </h2>
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            <p className="mb-2">🏈 Plays will appear here</p>
            <p className="text-sm">Click a play to add it to your playsheet</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaybookBrowser
