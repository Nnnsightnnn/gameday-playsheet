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
      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 min-h-[44px] situation-tab-glow ${
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
  return (
    <div className="situation-tabs-container">
      {isDragging && (
        <div className="text-xs text-green-400 mb-2 animate-pulse">
          Drop on a situation tab to assign tag
        </div>
      )}
      <div className="situation-tabs flex gap-2 overflow-x-auto pb-2">
        {situations.map(situation => (
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
