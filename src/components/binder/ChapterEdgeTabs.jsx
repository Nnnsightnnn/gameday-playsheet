// Chapter edge tabs for formation group navigation (right edge)

function ChapterEdgeTabs({ formationGroups, activeGroup, onGroupChange }) {
  // Only show if we have formation groups
  if (!formationGroups || formationGroups.length === 0) {
    return null
  }

  return (
    <div className="chapter-edge-tabs hidden lg:flex">
      {formationGroups.map(group => (
        <button
          key={group}
          onClick={() => onGroupChange(group)}
          className={`chapter-tab ${
            activeGroup === group ? 'chapter-tab--active' : ''
          }`}
          title={group}
        >
          {group}
        </button>
      ))}
    </div>
  )
}

export default ChapterEdgeTabs
