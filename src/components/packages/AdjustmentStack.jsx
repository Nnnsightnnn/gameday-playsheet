// built by nnnsightnnn — signal from noise
// Package Forge — the adjustment stack editor. One row per adjustment:
// what, value, who (when it needs a player), why, and how sure we are.

import { adjustmentsForSide, adjustmentById, MENUS, DEF_POSITIONS, OFF_POSITIONS } from '../../lib/packages/vocab'
import { CONFIDENCE } from '../../data/personnel'

export default function AdjustmentStack({ side, rows, onChange }) {
  const vocab = adjustmentsForSide(side)
  const menus = [...new Set(vocab.map((a) => a.menu))]
  const positions = side === 'defense' ? DEF_POSITIONS : OFF_POSITIONS

  const set = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= rows.length) return
    const next = [...rows]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const remove = (i) => onChange(rows.filter((_, j) => j !== i))
  const add = () => {
    const first = vocab[0]
    onChange([...rows, { adj: first.id, value: first.options[0], why: '', conf: first.conf }])
  }
  const pickAdj = (i, id) => {
    const def = adjustmentById(id)
    const patch = { adj: id, value: def.options[0], conf: def.conf }
    if (!def.target) patch.target = undefined
    set(i, patch)
  }

  return (
    <div className="pkg-stack">
      {rows.map((r, i) => {
        const def = adjustmentById(r.adj)
        return (
          <div key={i} className="pkg-stack__row">
            <span className="pkg-stack__n">{i + 1}</span>
            <select value={r.adj} onChange={(e) => pickAdj(i, e.target.value)} aria-label="Adjustment">
              {menus.map((m) => (
                <optgroup key={m} label={MENUS[m].label}>
                  {vocab.filter((a) => a.menu === m).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {def?.target && (
              <select value={r.target || ''} onChange={(e) => set(i, { target: e.target.value || undefined })} aria-label="Player">
                <option value="">Who?</option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
            <select value={r.value} onChange={(e) => set(i, { value: e.target.value })} aria-label="Value">
              {(def?.options || []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select value={r.conf || 'read'} onChange={(e) => set(i, { conf: e.target.value })} aria-label="Confidence" title="How sure are you this does what you say?">
              {Object.values(CONFIDENCE).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="pkg-stack__ctl">
              <button type="button" className="pkg-icon" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className="pkg-icon" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className="pkg-icon pkg-icon--bad" onClick={() => remove(i)} aria-label="Remove">✕</button>
            </span>
            <input
              className="pkg-stack__why"
              value={r.why || ''}
              placeholder={def?.hint || 'Why this adjustment? What does it take away?'}
              onChange={(e) => set(i, { why: e.target.value })}
            />
          </div>
        )
      })}
      <button type="button" className="pkg-btn" onClick={add}>
        + Add adjustment
      </button>
    </div>
  )
}
