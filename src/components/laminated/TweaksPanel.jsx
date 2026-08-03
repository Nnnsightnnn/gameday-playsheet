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

function TweaksPanel({ tweaks, setTweak, onLoadPlan }) {
  const [open, setOpen] = useState(false)

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

        {onLoadPlan && (
          <>
            <div className="tweaks__sect">Game plan</div>
            <div className="tweaks__row tweaks__row-h">
              <div className="tweaks__lbl">Ole Miss · CFB 27</div>
              <button
                type="button"
                className="tweaks__load"
                onClick={onLoadPlan}
              >
                Load
              </button>
            </div>
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
