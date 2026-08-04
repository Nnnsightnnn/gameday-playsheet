// Favorites-setup view — the sheet regrouped by playbook → formation so it
// reads in the same order as the in-game favorites menu. Tap a play to check
// it off once it's been added to favorites on the console; checks persist
// per game + side in Dexie.

function flattenBySide(situations, sideAssign) {
  const byId = new Map()
  for (const s of situations) {
    for (const p of sideAssign[s.id] || []) {
      const cur = byId.get(p.playId)
      if (cur) {
        if (!cur.situations.some((x) => x.id === s.id))
          cur.situations.push({ id: s.id, name: s.name, color: s.color })
      } else {
        byId.set(p.playId, {
          play: p,
          situations: [{ id: s.id, name: s.name, color: s.color }],
        })
      }
    }
  }
  return [...byId.values()]
}

// Order formations to match the in-game menu: playbooks in catalog order,
// formations in each book's formationGroups order. Unknowns sort last, alpha.
function groupForSetup(entries, playbooks) {
  const pbIndex = new Map(playbooks.map((pb, i) => [pb.name, i]))
  const formIndex = new Map()
  for (const pb of playbooks) {
    let i = 0
    for (const g of pb.formationGroups || [])
      for (const f of g.formations || [])
        formIndex.set(pb.name + '|' + f.name, i++)
  }

  const books = new Map()
  for (const e of entries) {
    const pbName = e.play.playbook || 'Unknown book'
    if (!books.has(pbName)) books.set(pbName, new Map())
    const forms = books.get(pbName)
    const fName = e.play.formation || 'Unknown formation'
    if (!forms.has(fName)) forms.set(fName, [])
    forms.get(fName).push(e)
  }

  const orderIdx = (map, key) => (map.has(key) ? map.get(key) : Infinity)
  return [...books.entries()]
    .sort(
      (a, b) =>
        orderIdx(pbIndex, a[0]) - orderIdx(pbIndex, b[0]) ||
        a[0].localeCompare(b[0]),
    )
    .map(([pbName, forms]) => ({
      playbook: pbName,
      formations: [...forms.entries()]
        .sort(
          (a, b) =>
            orderIdx(formIndex, pbName + '|' + a[0]) -
              orderIdx(formIndex, pbName + '|' + b[0]) ||
            a[0].localeCompare(b[0]),
        )
        .map(([fName, plays]) => ({ formation: fName, plays })),
    }))
}

function SetupRow({ entry, checked, onToggle }) {
  const { play, situations } = entry
  return (
    <button
      className={'setup-row' + (checked ? ' setup-row--done' : '')}
      onClick={() => onToggle(play.playId)}
    >
      <span className={'setup-check' + (checked ? ' setup-check--on' : '')}>
        {checked ? '✓' : ''}
      </span>
      <span className={'slot__dot slot__dot--' + play.type} />
      <span className="setup-row__main">
        <span className="setup-row__name">{play.name}</span>
        <span className="setup-row__sits">
          {situations.map((s) => (
            <span key={s.id} className="setup-sit" title={s.name}>
              <span className="tdot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}

function SetupSheet({
  situations,
  assignments,
  playbooks,
  checks,
  gloss,
  onToggle,
  onClear,
}) {
  const entries = flattenBySide(situations, assignments)
  const groups = groupForSetup(entries, playbooks)
  const total = entries.length
  const done = entries.filter((e) => checks[e.play.playId]).length

  return (
    <div className="sheet-wrap">
      <div className={'sheet' + (gloss ? '' : ' no-gloss')}>
        <div className="setup-hd">
          <div className="setup-hd__titles">
            <div className="setup-hd__name">Favorites Setup</div>
            <div className="setup-hd__sub">
              Same order as the in-game menu — work top to bottom, check each
              play once it&apos;s favorited.
            </div>
          </div>
          <div className="setup-hd__right">
            <span
              className={
                'setup-progress' + (total && done === total ? ' setup-progress--done' : '')
              }
            >
              {done} / {total} added
            </span>
            <button
              className="setup-reset"
              onClick={() => {
                if (window.confirm('Clear all checkmarks for this side?')) onClear()
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {!total && (
          <div className="dempty" style={{ color: 'var(--ink-faint)' }}>
            Nothing on the sheet yet — fill the call sheet first.
          </div>
        )}

        {groups.map((book) => (
          <section key={book.playbook} className="setup-book">
            <div className="setup-book__name">{book.playbook}</div>
            <div className="setup-grid">
              {book.formations.map((f) => {
                const fDone = f.plays.filter((e) => checks[e.play.playId]).length
                return (
                  <div
                    key={f.formation}
                    className={
                      'setup-form' +
                      (fDone === f.plays.length ? ' setup-form--done' : '')
                    }
                  >
                    <div className="setup-form__hd">
                      <span className="setup-form__name">{f.formation}</span>
                      <span className="setup-form__count">
                        {fDone}/{f.plays.length}
                      </span>
                    </div>
                    <div className="setup-form__body">
                      {f.plays.map((e) => (
                        <SetupRow
                          key={e.play.playId}
                          entry={e}
                          checked={!!checks[e.play.playId]}
                          onToggle={onToggle}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default SetupSheet
