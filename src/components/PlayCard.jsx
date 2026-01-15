import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { updatePlayNotes } from '../lib/db'

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
    <div className="absolute right-0 top-full mt-1 z-20 bg-gray-700 rounded-lg shadow-xl p-3 min-w-64">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Tags</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">x</button>
      </div>

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
                    x
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Drag handle icon (6 dots)
function DragHandle({ listeners, attributes }) {
  return (
    <div
      {...listeners}
      {...attributes}
      className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 mr-1 text-gray-500 hover:text-gray-300 touch-none"
      title="Drag to assign situation"
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
        <circle cx="3" cy="3" r="1.5" />
        <circle cx="9" cy="3" r="1.5" />
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="9" cy="8" r="1.5" />
        <circle cx="3" cy="13" r="1.5" />
        <circle cx="9" cy="13" r="1.5" />
      </svg>
    </div>
  )
}

function PlayCard({ play, onRemove, onRating, compact = false }) {
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const tags = play.tags || []

  // Setup draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `play-${play.id}`,
    data: { play },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  // Compact grid view
  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`play-card laminated-card-shine relative p-3 rounded-lg transition-all min-h-[48px] ${
          play.playType === 'pass'
            ? 'bg-gray-800 border-l-4 border-blue-500'
            : 'bg-gray-800 border-l-4 border-orange-500'
        } ${isDragging ? 'shadow-2xl ring-2 ring-green-500' : 'hover:bg-gray-750'}`}
      >
        <div className="flex items-start gap-1">
          {/* Drag Handle */}
          <DragHandle listeners={listeners} attributes={attributes} />

          {/* Card Content */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{play.playName}</div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.slice(0, 2).map(tag => {
                      const preset = PRESET_TAGS.find(p => p.name === tag)
                      return (
                        <span
                          key={tag}
                          className={`px-1 py-0.5 rounded text-xs ${preset ? preset.color : 'bg-gray-600'}`}
                        >
                          {tag}
                        </span>
                      )
                    })}
                    {tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
              {play.rating && (
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`text-xs ${play.rating >= star ? 'text-yellow-400' : 'text-gray-700'}`}
                    >
                      *
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Expanded state */}
            {expanded && (
              <div className="mt-3 pt-3 border-t border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs text-gray-400 mb-2">
                  {play.playbook} / {play.formation}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => onRating(play.id, star)}
                        className={`text-lg ${play.rating >= star ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300`}
                      >
                        *
                      </button>
                    ))}
                  </div>

                  {/* Tag Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTagSelector(!showTagSelector)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        tags.length > 0
                          ? 'bg-green-900/50 text-green-400 hover:bg-green-900'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Tags {tags.length > 0 && `(${tags.length})`}
                    </button>
                    {showTagSelector && (
                      <TagSelector play={play} onClose={() => setShowTagSelector(false)} />
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(play.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 rounded text-xs hover:bg-red-900/30 transition-colors ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Full row view (fallback)
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`play-card laminated-card-shine px-4 py-3 flex items-center justify-between relative overflow-hidden ${
        isDragging ? 'shadow-2xl ring-2 ring-green-500 bg-gray-800' : 'hover:bg-gray-750'
      }`}
    >
      {/* Drag Handle */}
      <DragHandle listeners={listeners} attributes={attributes} />

      <div className="flex items-center gap-4 flex-1">
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
            {play.playbook} / {play.formation}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => {
                const preset = PRESET_TAGS.find(p => p.name === tag)
                return (
                  <span
                    key={tag}
                    className={`px-1.5 py-0.5 rounded text-xs ${preset ? preset.color : 'bg-gray-600'}`}
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
              className={`text-lg ${play.rating >= star ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300`}
            >
              *
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
            Tags {tags.length > 0 && `(${tags.length})`}
          </button>
          {showTagSelector && (
            <TagSelector play={play} onClose={() => setShowTagSelector(false)} />
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(play.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-2 py-1 rounded transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default PlayCard
