// Situation tabs for filtering plays by game situation
// Each tab is a drop target for drag-and-drop play assignment

import { useDroppable } from '@dnd-kit/core'

function DroppableSituationTab({ situation, isActive, onClick, isDraggingActive }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `situation-${situation.id}`,
    data: { situation },
  })

  // Only show as drop target if we're dragging and this isn't the "All" tab
  const isValidDropTarget = isDraggingActive && situation.tag !== null

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        isOver && isValidDropTarget
          ? `${situation.color} text-white ring-2 ring-white scale-105 shadow-lg`
          : isActive
            ? `${situation.color} text-white ring-2 ring-white/30 shadow-md`
            : isDraggingActive && isValidDropTarget
              ? 'bg-gray-700 text-white border-2 border-dashed border-gray-500 hover:border-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {isOver && isValidDropTarget && (
        <span className="mr-1">+</span>
      )}
      {situation.label}
    </button>
  )
}

function SituationTabs({ situations, activeSituation, onSituationChange, isDragging = false }) {
  // Group situations by category for better organization
  const allTab = situations.find(s => s.tag === null)
  const otherTabs = situations.filter(s => s.tag !== null)

  return (
    <div className="situation-tabs-container laminated-premium paper-stack-shadow rounded-lg p-3">
      {isDragging && (
        <div className="text-xs text-green-400 mb-2 animate-pulse relative z-10">
          Drop on a tag to assign it to selected play(s)
        </div>
      )}
      <div className="situation-tabs flex flex-wrap gap-2 relative z-10">
        {/* All tab first */}
        {allTab && (
          <DroppableSituationTab
            situation={allTab}
            isActive={activeSituation?.id === allTab.id}
            onClick={() => onSituationChange(allTab)}
            isDraggingActive={isDragging}
          />
        )}
        {/* Divider */}
        <div className="w-px bg-gray-700 mx-1 self-stretch" />
        {/* Other tabs */}
        {otherTabs.map(situation => (
          <DroppableSituationTab
            key={situation.id}
            situation={situation}
            isActive={activeSituation?.id === situation.id}
            onClick={() => onSituationChange(situation)}
            isDraggingActive={isDragging}
          />
        ))}
      </div>
    </div>
  )
}

export default SituationTabs
