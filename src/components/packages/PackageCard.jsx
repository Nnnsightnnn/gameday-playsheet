// built by nnnsightnnn — signal from noise
// Package Forge — the read view of one package: the lie and the truth side by
// side, the macro recipe in programming order, and the price.

import { useState } from 'react'
import { threatById } from '../../lib/packages/metas'
import { recipeText, MACRO_CAP } from '../../lib/packages/engine'
import { SHELLS } from '../../lib/packages/vocab'
import { ShellGlyph, DisguiseMeter, ChecksList, Conf, UserObjectivesView } from './PackageBits'

const shellName = (n) => SHELLS.find((s) => s.id === n)?.label ?? '—'

export default function PackageCard({
  pkg,
  analysis,
  slotInfo,
  situations,
  onSlot,
  onActive,
  onEdit,
  onFork,
  onDelete,
  onAddToSheet,
  onStudy,
}) {
  const [sit, setSit] = useState('')
  const [copied, setCopied] = useState(false)
  const isDef = pkg.side === 'defense'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recipeText(pkg))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="pkg-card">
      <header className="pkg-card__hd">
        <div className="pkg-card__titles">
          <div className="pkg-card__kicker">
            {pkg.custom ? 'Your package' : 'Curated'} · {pkg.base?.formation} · {pkg.base?.name}
          </div>
          <h2 className="pkg-card__name">{pkg.name || 'Untitled package'}</h2>
          {pkg.tagline && <p className="pkg-card__tag">{pkg.tagline}</p>}
        </div>
        <div className="pkg-card__slot">
          <label className="pkg-field pkg-field--inline">
            <span>Macro slot</span>
            <select
              value={slotInfo?.slot ?? ''}
              onChange={(e) => onSlot(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Not slotted</option>
              {Array.from({ length: MACRO_CAP.built }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="pkg-toggle">
            <input
              type="checkbox"
              checked={!!slotInfo?.active}
              disabled={!slotInfo?.slot}
              onChange={(e) => onActive(e.target.checked)}
            />
            Active this week
          </label>
        </div>
      </header>

      <div className="pkg-actions">
        {pkg.custom ? (
          <>
            <button className="pkg-btn" onClick={onEdit}>Edit</button>
            <button className="pkg-btn" onClick={onFork}>Duplicate</button>
            <button className="pkg-btn pkg-btn--danger" onClick={onDelete}>Delete</button>
          </>
        ) : (
          <button className="pkg-btn" onClick={onFork}>Fork to edit</button>
        )}
        {pkg.lab && (
          <button className="pkg-btn" onClick={() => onStudy(pkg.lab)}>
            Study the rotation in Coverage Lab
          </button>
        )}
        <span className="pkg-actions__sheet">
          <select value={sit} onChange={(e) => setSit(e.target.value)} aria-label="Call sheet block">
            <option value="">Put the base call on the sheet…</option>
            {situations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button className="pkg-btn" disabled={!sit} onClick={() => onAddToSheet(sit)}>
            Add
          </button>
        </span>
      </div>

      <section className="pkg-lie">
        <div className="pkg-lie__col">
          <h3 className="pkg-h3">What they see</h3>
          {isDef && <ShellGlyph shell={pkg.look.shell} rush={pkg.look.rush} press={pkg.look.press} label={`${shellName(pkg.look.shell)} · ${pkg.look.rush} showing${pkg.look.press ? ' · press' : ''}`} />}
          <p className="pkg-p">{pkg.look.picture}</p>
        </div>
        <div className="pkg-lie__arrow" aria-hidden="true">→</div>
        <div className="pkg-lie__col">
          <h3 className="pkg-h3">What they get</h3>
          {isDef && <ShellGlyph shell={pkg.truth.shell} rush={pkg.truth.rush} press={false} label={`${shellName(pkg.truth.shell)} · ${pkg.truth.rush} rush · ${pkg.truth.deep} deep`} />}
          <p className="pkg-p">{isDef ? pkg.truth.coverage : pkg.truth.concept}</p>
          {!isDef && (
            <p className="pkg-count">
              {analysis.count.blockers} block · {analysis.count.releases} release
              {analysis.count.chips ? ` · ${analysis.count.chips} chip` : ''}
            </p>
          )}
        </div>
      </section>

      <DisguiseMeter disguise={analysis.disguise} side={pkg.side} />

      <section className="pkg-sec">
        <h3 className="pkg-h3">Built to beat</h3>
        <div className="pkg-threats">
          {(pkg.counters || []).map((id) => {
            const t = threatById(id)
            return t ? (
              <div key={id} className="pkg-threat">
                <strong>{t.name}</strong> <Conf conf={t.conf} />
                <p>{t.what}</p>
              </div>
            ) : null
          })}
        </div>
      </section>

      <section className="pkg-sec">
        <div className="pkg-sec__hd">
          <h3 className="pkg-h3">Macro recipe</h3>
          <button className="pkg-btn pkg-btn--small" onClick={copy}>
            {copied ? 'Copied' : 'Copy as text'}
          </button>
        </div>
        <p className="pkg-hint">
          Call {pkg.base?.name}, program these in order, save to slot {slotInfo?.slot ?? '—'}. In game: L1 / LB at the line.
        </p>
        <ol className="pkg-recipe">
          {analysis.recipe.map((s) => (
            <li key={s.step} className={s.inMacro ? '' : 'pkg-recipe__manual'}>
              <div className="pkg-recipe__line">
                <span className="pkg-recipe__menu">
                  {s.inMacro ? s.menu : 'At the line'} <em>{s.ps} / {s.xbox}</em>
                </span>
                <span className="pkg-recipe__what">
                  {s.target && <b>{s.target}</b>} {s.label}: <strong>{s.value}</strong>
                </span>
                <Conf conf={s.conf} />
              </div>
              {s.why && <p className="pkg-recipe__why">{s.why}</p>}
            </li>
          ))}
        </ol>
      </section>

      {(!!pkg.userObjectives?.length || pkg.user) && (
        <section className="pkg-sec">
          <h3 className="pkg-h3">Your user</h3>
          <UserObjectivesView rows={pkg.userObjectives} note={pkg.user} />
        </section>
      )}

      {!!pkg.twins?.length && (
        <section className="pkg-sec">
          <h3 className="pkg-h3">Same look, other calls</h3>
          <ul className="pkg-twins">
            {pkg.twins.map((t) => (
              <li key={t.playId}>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="pkg-ledger">
        <div>
          <h3 className="pkg-h3">Beats</h3>
          <ul>{(pkg.beats || []).map((b, i) => <li key={i}>{b}</li>)}</ul>
        </div>
        <div>
          <h3 className="pkg-h3 pkg-h3--bad">Loses to</h3>
          <ul>{(pkg.losesTo || []).map((b, i) => <li key={i}>{b}</li>)}</ul>
        </div>
      </section>

      {pkg.checkout?.playId && (
        <p className="pkg-checkout">
          <span>Checkout</span> <strong>{pkg.checkout.name}</strong> {pkg.checkout.when}
        </p>
      )}
      {pkg.call && (
        <p className="pkg-call">
          <span>When to call it</span> {pkg.call}
        </p>
      )}
      {!!pkg.tells?.length && (
        <section className="pkg-sec">
          <h3 className="pkg-h3">Tells and rules</h3>
          <ul className="pkg-bullets">{pkg.tells.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
      )}

      {!!pkg.sequence?.length && (
        <section className="pkg-sec">
          <h3 className="pkg-h3">When they adjust</h3>
          <ol className="pkg-seq">
            {pkg.sequence.map((s, i) => (
              <li key={i}>
                <span className="pkg-seq__if">{s.if}</span>
                <span className="pkg-seq__call">{s.call}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {!!pkg.practice?.length && (
        <section className="pkg-sec">
          <h3 className="pkg-h3">Prove it in practice</h3>
          <ol className="pkg-practice">
            {pkg.practice.map((r, i) => (
              <li key={i}>
                {r.setup && <span className="pkg-practice__setup">{r.setup}</span>}
                <span>{r.verify}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="pkg-sec">
        <h3 className="pkg-h3">Soundness</h3>
        <ChecksList checks={analysis.checks} />
      </section>
    </article>
  )
}
