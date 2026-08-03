// The laminated sheet — color-coded situation blocks with empty/filled slots.

function Slot({ index, play, color, onAdd, onRemove }) {
  if (!play) {
    return (
      <div
        className="slot slot--empty"
        style={{ '--block-c': color }}
        onClick={onAdd}
      >
        + Add play
      </div>
    )
  }
  return (
    <div className="slot slot--filled">
      <span className="slot__num">{index + 1}</span>
      <span className={'slot__dot slot__dot--' + play.type} />
      <div className="slot__main">
        <div className="slot__name">{play.name}</div>
        <div className="slot__form">{play.formation}</div>
        {play.note && <div className="slot__note">{play.note}</div>}
      </div>
      <button
        className="slot__x"
        title="Remove"
        aria-label={`Remove ${play.name}`}
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  )
}

function Block({ situation, plays, live, slotCount, onAdd, onRemove }) {
  const rows = Math.max(slotCount, plays.length)
  return (
    <section
      className={'block' + (live ? ' block--live' : '')}
      style={{ '--block-c': situation.color }}
    >
      <div className="block__hd">
        <div className="block__titles">
          <div className="block__name">{situation.name}</div>
          <div className="block__sub">{situation.sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {live && <span className="block__live-dot">LIVE</span>}
          <button
            className="block__add"
            title="Add play"
            onClick={() => onAdd(situation.id)}
          >
            +
          </button>
        </div>
      </div>
      <div className="block__body">
        {Array.from({ length: rows }).map((_, i) => (
          <Slot
            key={i}
            index={i}
            play={plays[i]}
            color={situation.color}
            onAdd={() => onAdd(situation.id)}
            onRemove={() => onRemove(situation.id, plays[i].playId)}
          />
        ))}
      </div>
    </section>
  )
}

function Sheet({
  situations,
  assignments,
  liveIds,
  slotCount,
  gloss,
  onAdd,
  onRemove,
}) {
  return (
    <div className="sheet-wrap">
      <div className={'sheet' + (gloss ? '' : ' no-gloss')}>
        <div className="sheet__grid">
          {situations.map((s) => (
            <Block
              key={s.id}
              situation={s}
              plays={assignments[s.id] || []}
              live={liveIds.has(s.id)}
              slotCount={slotCount}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sheet
