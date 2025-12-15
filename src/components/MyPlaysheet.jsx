import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, removeFromMyPlays, updatePlayNotes } from '../lib/db'

// Preset tags with colors
const PRESET_TAGS = [
  { name: 'money', color: 'bg-green-600' },
  { name: 'red zone', color: 'bg-red-600' },
  { name: '3rd down', color: 'bg-yellow-600' },
  { name: 'goal line', color: 'bg-purple-600' },
  { name: '2 min', color: 'bg-blue-600' },
  { name: 'opener', color: 'bg-cyan-600' },
]

function TagSelector({ play, onClose }) {
  const [customTag, setCustomTag] = useState('')
  const currentTags = play.tags || []

  const handleToggleTag = async (tagName) => {
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName]
    await updatePlayNotes(play.id, { tags: newTags })
  }

  const handleAddCustomTag = async () => {
    if (customTag.trim() && !currentTags.includes(customTag.trim())) {
      await updatePlayNotes(play.id, { tags: [...currentTags, customTag.trim()] })
      setCustomTag('')
    }
  }

  return (
    <div className="absolute right-0 top-full mt-1 z-10 bg-gray-700 rounded-lg shadow-xl p-3 min-w-64">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Tags</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {/* Preset Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESET_TAGS.map(tag => (
          <button
            key={tag.name}
            onClick={() => handleToggleTag(tag.name)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              currentTags.includes(tag.name)
                ? `${tag.color} text-white ring-2 ring-white`
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
          placeholder="Custom tag..."
          className="flex-1 px-2 py-1 bg-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={handleAddCustomTag}
          className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
        >
          Add
        </button>
      </div>

      {/* Current Custom Tags */}
      {currentTags.filter(t => !PRESET_TAGS.some(p => p.name === t)).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-400 mb-1">Custom tags:</div>
          <div className="flex flex-wrap gap-1">
            {currentTags
              .filter(t => !PRESET_TAGS.some(p => p.name === t))
              .map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-500 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleToggleTag(tag)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlayCard({ play, onRemove, onRating }) {
  const [showTagSelector, setShowTagSelector] = useState(false)
  const tags = play.tags || []

  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-750 relative">
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
          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => {
                const preset = PRESET_TAGS.find(p => p.name === tag)
                return (
                  <span
                    key={tag}
                    className={`px-1.5 py-0.5 rounded text-xs ${
                      preset ? preset.color : 'bg-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Rating Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => onRating(play.id, star)}
              className={`text-lg ${
                play.rating >= star ? 'text-yellow-400' : 'text-gray-600'
              } hover:text-yellow-300`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Tag Button */}
        <div className="relative">
          <button
            onClick={() => setShowTagSelector(!showTagSelector)}
            className={`px-2 py-1 rounded transition-colors ${
              tags.length > 0
                ? 'bg-green-900/50 text-green-400 hover:bg-green-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            🏷️ {tags.length > 0 && `(${tags.length})`}
          </button>
          {showTagSelector && (
            <TagSelector play={play} onClose={() => setShowTagSelector(false)} />
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(play.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/30
                     px-2 py-1 rounded transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

function MyPlaysheet() {
  const [filterTag, setFilterTag] = useState(null)
  const [sortBy, setSortBy] = useState('formation') // 'formation' | 'rating' | 'added'

  // Live query for all my plays
  const myPlays = useLiveQuery(() => db.myPlays.toArray(), [], [])

  // Get unique tags from all plays
  const allTags = [...new Set(myPlays.flatMap(p => p.tags || []))]

  // Filter plays by tag if selected
  const filteredPlays = filterTag
    ? myPlays.filter(p => p.tags?.includes(filterTag))
    : myPlays

  // Sort plays
  const sortedPlays = [...filteredPlays].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0)
    }
    if (sortBy === 'added') {
      return new Date(b.addedAt) - new Date(a.addedAt)
    }
    // Default: by formation group
    return (a.formationGroup || '').localeCompare(b.formationGroup || '')
  })

  // Group plays by formation group (only for formation sort)
  const groupedPlays = sortBy === 'formation'
    ? sortedPlays.reduce((acc, play) => {
        const group = play.formationGroup || 'Uncategorized'
        if (!acc[group]) acc[group] = []
        acc[group].push(play)
        return acc
      }, {})
    : null

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
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 flex-wrap gap-4">
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

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none"
          >
            <option value="formation">By Formation</option>
            <option value="rating">By Rating</option>
            <option value="added">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 text-sm">Filter by tag:</span>
          <button
            onClick={() => setFilterTag(null)}
            className={`px-3 py-1 rounded text-sm ${
              !filterTag ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {allTags.map(tag => {
            const preset = PRESET_TAGS.find(p => p.name === tag)
            return (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded text-sm ${
                  filterTag === tag
                    ? preset?.color || 'bg-green-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

      {/* Grouped Plays (by formation) */}
      {sortBy === 'formation' && groupedPlays && (
        Object.entries(groupedPlays).map(([group, plays]) => (
          <div key={group} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 font-semibold">
              {group} ({plays.length})
            </div>
            <div className="divide-y divide-gray-700">
              {plays.map(play => (
                <PlayCard
                  key={play.id}
                  play={play}
                  onRemove={handleRemove}
                  onRating={handleRating}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Flat list (for rating/added sort) */}
      {sortBy !== 'formation' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 font-semibold">
            {sortBy === 'rating' ? 'Sorted by Rating' : 'Recently Added'} ({sortedPlays.length})
          </div>
          <div className="divide-y divide-gray-700">
            {sortedPlays.map(play => (
              <PlayCard
                key={play.id}
                play={play}
                onRemove={handleRemove}
                onRating={handleRating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPlaysheet
