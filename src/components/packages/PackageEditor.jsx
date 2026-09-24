// built by nnnsightnnn — signal from noise
// Package Forge — build or edit one package. The analysis runs live beside
// the form, so an unsound stack is visible before it is saved.

import { useState } from 'react'
import { analyzePackage, formationPlays } from '../../lib/packages/engine'
import { threatsFor } from '../../lib/packages/metas'
import { SHELLS } from '../../lib/packages/vocab'
import AdjustmentStack from './AdjustmentStack'
import { DisguiseMeter, ChecksList, UserObjectivesEditor } from './PackageBits'

const toLines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean)

function LinesField({ label, value, onChange, placeholder }) {
  const [text, setText] = useState((value || []).join('\n'))
  return (
    <label className="pkg-field">
      <span>{label}</span>
      <textarea
        rows={3}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value)
          onChange(toLines(e.target.value))
        }}
      />
    </label>
  )
}

export default function PackageEditor({ initial, playbooks, catalog, onSave, onCancel }) {
  // Blank and older saved packages carry no userObjectives; treat as none.
  const [pkg, setPkg] = useState(() => ({ ...initial, userObjectives: initial.userObjectives || [] }))
  const set = (patch) => setPkg((p) => ({ ...p, ...patch }))
  const setLook = (patch) => set({ look: { ...pkg.look, ...patch } })
  const setTruth = (patch) => set({ truth: { ...pkg.truth, ...patch } })
  const isDef = pkg.side === 'defense'

  const books = playbooks.filter((b) => b.type === pkg.side)
  const book = books.find((b) => b.id === pkg.playbook) || books[0]
  // Cheap enough to derive every render; the React Compiler memoizes it.
  const formations = (book?.formationGroups || []).flatMap((g) =>
    (g.formations || []).map((f) => `${g.name} ${f.name}`),
  )
  const formation = pkg.base?.formation || ''
  const pool = formationPlays(playbooks, book?.id, formation)
  const analysis = analyzePackage(pkg, catalog)
  const threats = threatsFor(pkg.game, pkg.side)

  const pickFormation = (f) => set({ base: f ? { playId: '', name: '', formation: f, type: '' } : null, twins: [], checkout: null })
  const pickBase = (playId) => {
    const p = pool.find((x) => x.playId === playId)
    set({
      base: p ? { ...p, formation } : { playId: '', name: '', formation, type: '' },
      twins: pkg.twins.filter((t) => t.playId !== playId),
    })
  }
  const toggleTwin = (p, on) =>
    set({ twins: on ? [...pkg.twins, { ...p, role: '' }] : pkg.twins.filter((t) => t.playId !== p.playId) })
  const setTwinRole = (playId, role) =>
    set({ twins: pkg.twins.map((t) => (t.playId === playId ? { ...t, role } : t)) })
  const toggleThreat = (id, on) =>
    set({ counters: on ? [...pkg.counters, id] : pkg.counters.filter((x) => x !== id) })
  const pickCheckout = (playId) => {
    const p = pool.find((x) => x.playId === playId)
    set({ checkout: p ? { playId: p.playId, name: p.name, when: pkg.checkout?.when || '' } : null })
  }

  const canSave = pkg.name.trim() && pkg.base?.playId && analysis.errors === 0

  return (
    <div className="pkg-edit">
      <div className="pkg-edit__form">
        <div className="pkg-grid2">
          <label className="pkg-field">
            <span>Name</span>
            <input value={pkg.name} onChange={(e) => set({ name: e.target.value.toUpperCase() })} placeholder="GHOST ZERO" />
          </label>
          <label className="pkg-field">
            <span>One line: shows what, plays what</span>
            <input value={pkg.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Show two-high, roll Cover 3 to the stack." />
          </label>
        </div>

        <h3 className="pkg-h3">The call</h3>
        <div className="pkg-grid3">
          <label className="pkg-field">
            <span>Playbook</span>
            <select value={book?.id || ''} onChange={(e) => set({ playbook: e.target.value, base: null, twins: [], checkout: null })}>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="pkg-field">
            <span>Formation</span>
            <select value={formation} onChange={(e) => pickFormation(e.target.value)}>
              <option value="">Pick a formation</option>
              {formations.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="pkg-field">
            <span>Base play</span>
            <select value={pkg.base?.playId || ''} onChange={(e) => pickBase(e.target.value)} disabled={!formation}>
              <option value="">Pick the call</option>
              {pool.map((p) => (
                <option key={p.playId} value={p.playId}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {pkg.base?.playId && (
          <>
            <h3 className="pkg-h3">Twins: other calls from the same look</h3>
            <div className="pkg-twinpick">
              {pool.filter((p) => p.playId !== pkg.base.playId).map((p) => {
                const t = pkg.twins.find((x) => x.playId === p.playId)
                return (
                  <div key={p.playId} className="pkg-twinpick__row">
                    <label className="pkg-toggle">
                      <input type="checkbox" checked={!!t} onChange={(e) => toggleTwin(p, e.target.checked)} />
                      {p.name}
                    </label>
                    {t && <input value={t.role} placeholder="Its job in the family" onChange={(e) => setTwinRole(p.playId, e.target.value)} />}
                  </div>
                )
              })}
            </div>
          </>
        )}

        <h3 className="pkg-h3">The meta it beats</h3>
        <div className="pkg-threatpick">
          {threats.map((t) => (
            <label key={t.id} className="pkg-toggle" title={t.what}>
              <input type="checkbox" checked={pkg.counters.includes(t.id)} onChange={(e) => toggleThreat(t.id, e.target.checked)} />
              {t.name}
            </label>
          ))}
        </div>

        <div className="pkg-grid2">
          <fieldset className="pkg-fs">
            <legend>What they see</legend>
            {isDef && (
              <div className="pkg-grid3">
                <label className="pkg-field"><span>Shell</span>
                  <select value={pkg.look.shell} onChange={(e) => setLook({ shell: Number(e.target.value) })}>
                    {SHELLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
                <label className="pkg-field"><span>Showing rush</span>
                  <input type="number" min="3" max="8" value={pkg.look.rush} onChange={(e) => setLook({ rush: Number(e.target.value) })} />
                </label>
                <label className="pkg-toggle pkg-toggle--field">
                  <input type="checkbox" checked={!!pkg.look.press} onChange={(e) => setLook({ press: e.target.checked })} /> Press look
                </label>
              </div>
            )}
            <label className="pkg-field"><span>The picture</span>
              <textarea rows={2} value={pkg.look.picture} onChange={(e) => setLook({ picture: e.target.value })} />
            </label>
          </fieldset>
          <fieldset className="pkg-fs">
            <legend>What they get</legend>
            {isDef ? (
              <div className="pkg-grid3">
                <label className="pkg-field"><span>Shell</span>
                  <select value={pkg.truth.shell} onChange={(e) => setTruth({ shell: Number(e.target.value) })}>
                    {SHELLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
                <label className="pkg-field"><span>Rushers</span>
                  <input type="number" min="3" max="8" value={pkg.truth.rush} onChange={(e) => setTruth({ rush: Number(e.target.value) })} />
                </label>
                <label className="pkg-field"><span>Deep</span>
                  <input type="number" min="0" max="5" value={pkg.truth.deep} onChange={(e) => setTruth({ deep: Number(e.target.value) })} />
                </label>
              </div>
            ) : (
              <div className="pkg-grid3">
                <label className="pkg-field"><span>Base blockers</span>
                  <input type="number" min="5" max="8" value={pkg.truth.blockers} onChange={(e) => setTruth({ blockers: Number(e.target.value) })} />
                </label>
                <label className="pkg-field"><span>Base releases</span>
                  <input type="number" min="1" max="5" value={pkg.truth.releases} onChange={(e) => setTruth({ releases: Number(e.target.value) })} />
                </label>
                <label className="pkg-toggle pkg-toggle--field">
                  <input type="checkbox" checked={!!pkg.truth.hotBuiltIn} onChange={(e) => setTruth({ hotBuiltIn: e.target.checked })} /> Hot built in
                </label>
              </div>
            )}
            <label className="pkg-field"><span>{isDef ? 'The coverage' : 'The concept'}</span>
              <textarea rows={2} value={isDef ? pkg.truth.coverage : pkg.truth.concept} onChange={(e) => setTruth(isDef ? { coverage: e.target.value } : { concept: e.target.value })} />
            </label>
          </fieldset>
        </div>

        <h3 className="pkg-h3">Adjustment stack</h3>
        <AdjustmentStack side={pkg.side} rows={pkg.adjustments} onChange={(adjustments) => set({ adjustments })} />

        <h3 className="pkg-h3">User objectives</h3>
        <p className="pkg-hint">One player, one job per phase. Each objective shows what it takes away and what it hands back.</p>
        <UserObjectivesEditor side={pkg.side} rows={pkg.userObjectives} onChange={(userObjectives) => set({ userObjectives })} />
        <label className="pkg-field pkg-uobj__notes">
          <span>User notes</span>
          <input
            value={pkg.user || ''}
            onChange={(e) => set({ user: e.target.value })}
            placeholder={isDef ? 'FS Bates. Bail to the deep middle at the snap.' : 'User the slot on the dig; high-point anything thrown late.'}
          />
        </label>

        <div className="pkg-grid2">
          <LinesField label="Beats (one per line)" value={pkg.beats} onChange={(beats) => set({ beats })} />
          <LinesField label="Loses to (one per line)" value={pkg.losesTo} onChange={(losesTo) => set({ losesTo })} />
        </div>
        <div className="pkg-grid2">
          <label className="pkg-field"><span>Checkout call</span>
            <select value={pkg.checkout?.playId || ''} onChange={(e) => pickCheckout(e.target.value)} disabled={!pool.length}>
              <option value="">None</option>
              {pool.filter((p) => p.playId !== pkg.base?.playId).map((p) => <option key={p.playId} value={p.playId}>{p.name}</option>)}
            </select>
          </label>
          <label className="pkg-field"><span>Check out when</span>
            <input value={pkg.checkout?.when || ''} disabled={!pkg.checkout} onChange={(e) => set({ checkout: { ...pkg.checkout, when: e.target.value } })} />
          </label>
        </div>
        <LinesField label="Tells and rules (one per line)" value={pkg.tells} onChange={(tells) => set({ tells })} />
        <label className="pkg-field"><span>When to call it</span>
          <input value={pkg.call} onChange={(e) => set({ call: e.target.value })} placeholder="3rd and 3 to 8, after they have seen the real thing once." />
        </label>
      </div>

      <aside className="pkg-edit__side">
        <DisguiseMeter disguise={analysis.disguise} side={pkg.side} />
        <h3 className="pkg-h3">Soundness</h3>
        <ChecksList checks={analysis.checks} />
        <div className="pkg-edit__btns">
          <button className="pkg-btn pkg-btn--primary" disabled={!canSave} onClick={() => onSave(pkg)}>
            Save package
          </button>
          <button className="pkg-btn" onClick={onCancel}>Cancel</button>
        </div>
        {!canSave && <p className="pkg-hint">Needs a name, a base call, and zero errors to save.</p>}
      </aside>
    </div>
  )
}
