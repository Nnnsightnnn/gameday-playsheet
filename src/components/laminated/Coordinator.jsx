// Coordinator header — team identity + live game-context strip.

const DOWNS = [1, 2, 3, 4]
const DISTANCES = [1, 3, 5, 7, 10, 15]
const YLS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

function Coordinator({ team, setTeam, ctx, setCtx, liveSituations }) {
  const fieldText =
    ctx.fieldSide === 'opp'
      ? `OPP ${ctx.yardLine}`
      : ctx.yardLine === 50
      ? 'MIDFIELD'
      : `OWN ${ctx.yardLine}`
  const set = (patch) => setCtx({ ...ctx, ...patch })
  const crestLetter = (team.trim()[0] || 'G').toUpperCase()

  return (
    <header className="coord">
      <div className="coord__brand">
        <div className="crest">{crestLetter}</div>
        <div className="coord__titles">
          <input
            className="coord__team"
            value={team}
            spellCheck="false"
            onChange={(e) => setTeam(e.target.value.slice(0, 18))}
            aria-label="Team name"
          />
          <div className="coord__meta">
            Gameday Call Sheet · <b>{liveSituations}</b>
          </div>
        </div>
      </div>

      <div className="gctx">
        <div className="gctx__group">
          <span className="gctx__label">Down</span>
          <div className="gctx__btns">
            {DOWNS.map((d) => (
              <button
                key={d}
                className={'chip' + (ctx.down === d ? ' chip--on' : '')}
                onClick={() => set({ down: d })}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="gctx__group">
          <span className="gctx__label">Distance</span>
          <div className="gctx__btns">
            {DISTANCES.map((d) => (
              <button
                key={d}
                className={'chip' + (ctx.distance === d ? ' chip--on' : '')}
                onClick={() => set({ distance: d })}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="gctx__group">
          <span className="gctx__label">Field Position</span>
          <div className="gctx__btns" style={{ alignItems: 'center' }}>
            <button
              className={'chip' + (ctx.fieldSide === 'own' ? ' chip--on' : '')}
              onClick={() => set({ fieldSide: 'own' })}
              style={{ fontSize: 13 }}
            >
              OWN
            </button>
            <button
              className={'chip' + (ctx.fieldSide === 'opp' ? ' chip--on' : '')}
              onClick={() => set({ fieldSide: 'opp' })}
              style={{ fontSize: 13 }}
            >
              OPP
            </button>
            <select
              className="target-pick"
              style={{ width: 64, marginTop: 0, padding: '6px' }}
              value={ctx.yardLine}
              onChange={(e) => set({ yardLine: parseInt(e.target.value, 10) })}
            >
              {YLS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="gctx__sep" />
        <div className="gctx__call">
          <span className="gctx__label">On the Call</span>
          <span className="big">
            {ctx.down}
            <em> &amp; </em>
            {ctx.distance}{' '}
            <span style={{ opacity: 0.5, fontSize: 18 }}>·</span> {fieldText}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Coordinator
