// Tab dividers for Offense/Defense selection

function BinderTabDivider({ selectedSide, onSideChange }) {
  return (
    <div className="binder-tabs">
      <button
        onClick={() => onSideChange('offense')}
        className={`binder-tab binder-tab--offense ${
          selectedSide === 'offense'
            ? 'binder-tab--active'
            : 'binder-tab--inactive'
        }`}
      >
        Offense
      </button>
      <button
        onClick={() => onSideChange('defense')}
        className={`binder-tab binder-tab--defense ${
          selectedSide === 'defense'
            ? 'binder-tab--active'
            : 'binder-tab--inactive'
        }`}
      >
        Defense
      </button>
    </div>
  )
}

export default BinderTabDivider
