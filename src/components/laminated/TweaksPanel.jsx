// Floating tweaks panel — paper material, accent color, slot density, gloss.

import { useState } from 'react'

const PAPER_PALETTES = [
  ['#f4efe2', '#e7e0cf', '#d8cfb8', '#1c1a14'], // Cardstock cream
  ['#f3f4f2', '#e3e5e1', '#cfd2cc', '#181a1e'], // Cool white
  ['#efe6d2', '#e0d4ba', '#cbbd9c', '#241f15'], // Field tan
]
const ACCENT_COLORS = [
  '#2f7d4f',
  '#2a4a7f',
  '#b3392f',
  '#b3862a',
  '#6a4a9c',
  '#1f7d77',
]
const DENSITIES = ['compact', 'regular', 'comfy']

function arrayEq(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function TweaksPanel({
  tweaks,
  setTweak,
  plans,
  onLoadPlan,
  game,
  savedSheets,
  onSaveSheet,
  onDeleteSheet,
}) {
  const [open, setOpen] = useState(false)
  const [sheetName, setSheetName] = useState('')

  const handleSaveSheet = () => {
    onSaveSheet(sheetName)
    setSheetName('')
  }

  if (!open) {
    return (
      <button
        className="tweaks__fab"
        title="Tweaks"
        onClick={() => setOpen(true)}
      >
        ✦
      </button>
    )
  }

  return (
    <div className="tweaks">
      <div className="tweaks__hd">
        <b>Tweaks</b>
        <button className="tweaks__x" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>
      <div className="tweaks__body">
        <div className="tweaks__sect">Material</div>
        <div className="tweaks__row">
          <div className="tweaks__lbl">Paper</div>
          <div className="swatches">
            {PAPER_PALETTES.map((p, i) => {
              const on = arrayEq(p, tweaks.paper)
              return (
                <button
                  key={i}
                  className={'swatch' + (on ? ' swatch--on' : '')}
                  style={{ background: p[0] }}
                  title={p.join(' · ')}
                  onClick={() => setTweak('paper', p)}
                >
                  {on && <span className="swatch__chk">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
        <div className="tweaks__row tweaks__row-h">
          <div className="tweaks__lbl">Lamination gloss</div>
          <button
            type="button"
            className="toggle"
            data-on={tweaks.gloss ? '1' : '0'}
            onClick={() => setTweak('gloss', !tweaks.gloss)}
          >
            <i />
          </button>
        </div>

        <div className="tweaks__sect">Team accent</div>
        <div className="tweaks__row">
          <div className="tweaks__lbl">Accent</div>
          <div className="swatches">
            {ACCENT_COLORS.map((c) => {
              const on = c === tweaks.accent
              return (
                <button
                  key={c}
                  className={'swatch' + (on ? ' swatch--on' : '')}
                  style={{ background: c }}
                  onClick={() => setTweak('accent', c)}
                >
                  {on && <span className="swatch__chk">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {onLoadPlan && plans?.length > 0 && (
          <>
            <div className="tweaks__sect">Game plans</div>
            {plans.map((plan) => (
              <div key={plan.name} className="tweaks__row tweaks__row-h">
                <div className="tweaks__lbl">{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {plan.guide && (
                    <a
                      className="tweaks__guide"
                      href={import.meta.env.BASE_URL + plan.guide}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Guide
                    </a>
                  )}
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace offense only"
                    onClick={() => onLoadPlan(plan, 'offense')}
                  >
                    O
                  </button>
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace defense only"
                    onClick={() => onLoadPlan(plan, 'defense')}
                  >
                    D
                  </button>
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace offense + defense"
                    onClick={() => onLoadPlan(plan, 'both')}
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {onSaveSheet && (
          <>
            <div className="tweaks__sect">My call sheets</div>
            <div className="tweaks__savebar">
              <input
                className="tweaks__input"
                placeholder={`Name this ${game === 'cfb' ? 'CFB' : 'Madden'} sheet…`}
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSheet()}
              />
              <button
                type="button"
                className="tweaks__load"
                title="Save the current sheet (offense + defense)"
                onClick={handleSaveSheet}
              >
                Save
              </button>
            </div>
            {savedSheets?.length === 0 && (
              <div className="tweaks__empty">
                Nothing saved yet — name your sheet and hit Save before loading
                a new plan.
              </div>
            )}
            {savedSheets?.map((sheet) => (
              <div key={sheet.id} className="tweaks__row tweaks__row-h">
                <div className="tweaks__sheetinfo">
                  <div className="tweaks__lbl">{sheet.name}</div>
                  <div className="tweaks__meta">
                    {(sheet.game === 'cfb' ? 'CFB' : 'Madden') +
                      ' · ' +
                      new Date(sheet.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace offense only"
                    onClick={() => onLoadPlan(sheet, 'offense')}
                  >
                    O
                  </button>
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace defense only"
                    onClick={() => onLoadPlan(sheet, 'defense')}
                  >
                    D
                  </button>
                  <button
                    type="button"
                    className="tweaks__load"
                    title="Replace offense + defense"
                    onClick={() => onLoadPlan(sheet, 'both')}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="tweaks__del"
                    title="Delete saved sheet"
                    onClick={() => onDeleteSheet(sheet)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="tweaks__sect">Layout</div>
        <div className="tweaks__row">
          <div className="tweaks__lbl">Slots / block</div>
          <div className="seg">
            {DENSITIES.map((d) => (
              <button
                key={d}
                className={tweaks.density === d ? 'seg--on' : ''}
                onClick={() => setTweak('density', d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweaksPanel
