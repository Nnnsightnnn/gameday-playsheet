import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, removeFromMyPlays, updatePlayNotes } from '../lib/db'

function MyPlaysheet() {
  const [filterTag, setFilterTag] = useState(null)
  const [editingId, setEditingId] = useState(null)

  // Live query for all my plays
  const myPlays = useLiveQuery(() => db.myPlays.toArray(), [], [])

  // Get unique tags from all plays
  const allTags = [...new Set(myPlays.flatMap(p => p.tags || []))]

  // Filter plays by tag if selected
  const filteredPlays = filterTag
    ? myPlays.filter(p => p.tags?.includes(filterTag))
    : myPlays

  // Group plays by formation group
  const groupedPlays = filteredPlays.reduce((acc, play) => {
    const group = play.formationGroup || 'Uncategorized'
    if (!acc[group]) acc[group] = []
    acc[group].push(play)
    return acc
  }, {})

  const handleRemove = async (id) => {
    await removeFromMyPlays(id)
  }

  const handleRating = async (id, rating) => {
    await updatePlayNotes(id, { rating })
  }

  if (myPlays.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold mb-2">Your playsheet is empty</h2>
        <p className="text-gray-400">
          Browse plays and click to add them to your playsheet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
        <div className="flex gap-6">
          <div>
            <span className="text-2xl font-bold text-green-400">{myPlays.length}</span>
            <span className="text-gray-400 ml-2">total plays</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-blue-400">
              {myPlays.filter(p => p.playType === 'pass').length}
            </span>
            <span className="text-gray-400 ml-2">pass</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-orange-400">
              {myPlays.filter(p => p.playType === 'run').length}
            </span>
            <span className="text-gray-400 ml-2">run</span>
          </div>
        </div>
        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Filter:</span>
            <button
              onClick={() => setFilterTag(null)}
              className={`px-2 py-1 rounded text-xs ${
                !filterTag ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2 py-1 rounded text-xs ${
                  filterTag === tag ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grouped Plays */}
      {Object.entries(groupedPlays).map(([group, plays]) => (
        <div key={group} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 font-semibold">
            {group} ({plays.length})
          </div>
          <div className="divide-y divide-gray-700">
            {plays.map(play => (
              <div
                key={play.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-750"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    play.playType === 'pass' 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'bg-orange-900 text-orange-300'
                  }`}>
                    {play.playType || 'play'}
                  </span>
                  <div>
                    <div className="font-medium">{play.playName}</div>
                    <div className="text-sm text-gray-400">
                      {play.playbook} → {play.formation}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRating(play.id, star)}
                        className={`text-lg ${
                          play.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                        } hover:text-yellow-300`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(play.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 
                               px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyPlaysheet
