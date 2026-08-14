// built by nnnsightnnn — signal from noise
// Personnel Lab — the answer to "I have a blanket scheme and I hope the
// individuals fill it." Four lenses: Roles (what each of the 22 jobs is and
// which ratings do it), Build (the depth-chart procedure, in order), In-Game
// (between-play reads), Gaps (which roles you don't know, and which the
// roster can't fill).

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getPersonnelChart, savePersonnelRole } from '../../lib/db';
import { plansForGame } from '../../data/personnelPlans';
import { POSITION_MIGRATION, KNOW_ANCHORS } from '../../data/personnel';
import {
  rolesForSide,
  gradeSummary,
  rosterHoles,
  knowledgeGaps,
  unratedRoles,
  knowAverage,
  focusRole,
  readsByPhase,
  trapDigest,
  confidenceOf,
  GRADES,
} from '../../lib/personnel/roleModel';
import RoleCard from './RoleCard';

const MODES = [
  { id: 'roles', label: 'Roles' },
  { id: 'build', label: 'Build' },
  { id: 'ingame', label: 'In-Game' },
  { id: 'gaps', label: 'Gaps' },
];

function ConfChip({ id }) {
  const c = confidenceOf(id);
  if (!c) return null;
  return (
    <span className={'pers-conf pers-conf--' + c.id} title={c.blurb}>
      {c.label}
    </span>
  );
}

export default function PersonnelLab({ game, side }) {
  const plans = useMemo(() => plansForGame(game), [game]);
  const [planId, setPlanId] = useState(plans[0]?.id || '');
  const plan = plans.find((p) => p.id === planId) || plans[0] || null;

  const [mode, setMode] = useState('roles');
  const [sideFilter, setSideFilter] = useState(side || 'offense');

  const chart = useLiveQuery(
    () => (plan ? getPersonnelChart(game, plan.id) : Promise.resolve(null)),
    [game, plan?.id],
    null,
  );
  // Memoised so the gap/unrated selectors below don't recompute every render
  // on a fresh {} identity.
  const know = useMemo(() => chart?.know || {}, [chart]);

  const patch = (roleId, p) => {
    if (!plan) return;
    savePersonnelRole(game, plan.id, roleId, p);
  };

  const roles = useMemo(
    () => (plan ? rolesForSide(plan, sideFilter) : []),
    [plan, sideFilter],
  );
  const summary = useMemo(
    () => (plan ? gradeSummary(plan, sideFilter) : null),
    [plan, sideFilter],
  );
  const holes = useMemo(
    () => (plan ? rosterHoles(plan, sideFilter) : []),
    [plan, sideFilter],
  );
  const gaps = useMemo(
    () => (plan ? knowledgeGaps(plan, know, sideFilter) : []),
    [plan, know, sideFilter],
  );
  const unrated = useMemo(
    () => (plan ? unratedRoles(plan, know, sideFilter) : []),
    [plan, know, sideFilter],
  );
  const avg = plan ? knowAverage(plan, know, sideFilter) : null;
  const focus = plan ? focusRole(plan, know, sideFilter) : null;
  const phases = useMemo(
    () => (plan ? readsByPhase(plan, sideFilter) : []),
    [plan, sideFilter],
  );
  const traps = useMemo(
    () => (plan ? trapDigest(plan, sideFilter) : []),
    [plan, sideFilter],
  );

  if (!plan) {
    return (
      <div className="trends-empty">
        No personnel sheet for this game yet. The Falcons sheet is Madden —
        switch the game in the play bank.
      </div>
    );
  }
  if (chart === null) return <div className="trends-empty">Loading…</div>;

  return (
    <div className="pers">
      <div className="pers-hd">
        <div className="trends-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={'trend-tab' + (mode === m.id ? ' trend-tab--on' : '')}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="trends-tabs">
          {['offense', 'defense'].map((s) => (
            <button
              key={s}
              className={'trend-chip' + (sideFilter === s ? ' trend-chip--on' : '')}
              onClick={() => setSideFilter(s)}
            >
              {s === 'offense' ? 'Offense' : 'Defense'}
            </button>
          ))}
          {plans.length > 1 && (
            <select
              className="trends-input pers-planpick"
              value={plan.id}
              onChange={(e) => setPlanId(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="pers-meta">
        <strong>{plan.team}</strong> — {plan.teamOvr}
        <span className="pers-meta__date">updated {plan.updatedAt}</span>
      </div>

      {/* ── ROLES ────────────────────────────────────────────────────────── */}
      {mode === 'roles' && (
        <>
          <div className="pers-doctrine">
            <div className="pers-doctrine__label">
              {sideFilter === 'offense' ? 'Offensive identity' : 'Defensive identity'}
            </div>
            <p>{plan.doctrine[sideFilter]}</p>
            {sideFilter === 'defense' && plan.doctrine.honest && (
              <p className="pers-doctrine__honest">
                <strong>Read this twice:</strong> {plan.doctrine.honest}
              </p>
            )}
          </div>

          {summary && (
            <div className="pers-summary">
              {['fit', 'stretch', 'hole'].map((g) => (
                <span key={g} className={'pers-tally pers-tally--' + g}>
                  <strong>{summary[g]}</strong> {GRADES[g].label.toLowerCase()}
                </span>
              ))}
              <span className="pers-tally">
                rate each role 1–5: {KNOW_ANCHORS[0].label} → {KNOW_ANCHORS[4].label}
              </span>
            </div>
          )}

          {roles.map((r) => (
            <RoleCard key={r.id} role={r} entry={know[r.id]} onPatch={patch} />
          ))}
        </>
      )}

      {/* ── BUILD ────────────────────────────────────────────────────────── */}
      {mode === 'build' && (
        <>
          <div className="pers-doctrine">
            <div className="pers-doctrine__label">Depth-chart procedure</div>
            <p>
              Run these in order. Each step&rsquo;s answer constrains the next —
              that is the whole reason it is a procedure and not a checklist.
            </p>
          </div>
          {plan.buildOrder.map((s) => (
            <div key={s.step} className="pers-step">
              <div className="pers-step__hd">
                <span className="pers-step__num">{s.step}</span>
                <span className="pers-step__title">{s.title}</span>
                <ConfChip id={s.conf} />
              </div>
              <p className="pers-step__do">{s.do}</p>
              <p className="pers-step__why">
                <em>Why:</em> {s.why}
              </p>
            </div>
          ))}

          <section className="pers-block">
            <h4 className="pers-block__hd">
              Position labels changed — Madden 27 merged DE and OLB into EDGE
            </h4>
            <div className="pers-migrate">
              {POSITION_MIGRATION.map((m) => (
                <div key={m.was} className="pers-migrate__row">
                  <span className="pers-migrate__was">{m.was}</span>
                  <span className="pers-migrate__arrow">→</span>
                  <span className="pers-migrate__now">{m.now}</span>
                  <span className="pers-migrate__note">{m.note}</span>
                </div>
              ))}
            </div>
          </section>

          {traps.length > 0 && (
            <section className="pers-block">
              <h4 className="pers-block__hd">
                Ratings not to build on ({sideFilter})
              </h4>
              {traps.map((t) => (
                <div key={t.key} className="pers-trap">
                  <span className="pers-trap__key">{t.key}</span>
                  <p className="pers-trap__why">
                    {t.why}
                    <em className="pers-trap__where"> — {t.roles.join(', ')}</em>
                  </p>
                  <ConfChip id={t.conf} />
                </div>
              ))}
            </section>
          )}
        </>
      )}

      {/* ── IN-GAME ──────────────────────────────────────────────────────── */}
      {mode === 'ingame' && (
        <>
          <div className="pers-doctrine">
            <div className="pers-doctrine__label">Between-play adjustments</div>
            <p>
              Every entry is a tell you can actually see and a fix you can
              execute before the next snap. Read the left column during the
              play, run the right column after the whistle.
            </p>
          </div>
          {phases.map((p) => (
            <section key={p.phase} className="pers-block">
              <h4 className="pers-block__hd">{p.phase}</h4>
              {p.items.map((r) => (
                <div key={r.id} className="pers-adj">
                  <div className="pers-adj__tell">{r.tell}</div>
                  <div className="pers-adj__fix">
                    {r.fix}
                    <ConfChip id={r.conf} />
                  </div>
                </div>
              ))}
            </section>
          ))}
        </>
      )}

      {/* ── GAPS ─────────────────────────────────────────────────────────── */}
      {mode === 'gaps' && (
        <>
          <div className="pers-summary">
            <span className="pers-tally">
              your average knowledge: <strong>{avg ?? '—'}</strong>/5
            </span>
            <span className="pers-tally">
              <strong>{gaps.length}</strong> rated · <strong>{unrated.length}</strong>{' '}
              still unrated
            </span>
          </div>

          {focus && (
            <div className="pers-focus">
              <div className="pers-doctrine__label">Study this role next</div>
              <div className="pers-focus__name">
                {focus.pos} — {focus.name}
                <span className="pers-focus__rating">you rated it {focus.rating}/5</span>
              </div>
              <p className="pers-focus__job">{focus.job}</p>
              <p className="pers-focus__breaks">
                <strong>What breaks without it:</strong> {focus.breaks}
              </p>
            </div>
          )}

          <section className="pers-block">
            <h4 className="pers-block__hd">Roles you know least</h4>
            {gaps.length === 0 ? (
              <p className="pers-block__text">
                Nothing rated yet. Open the Roles tab and rate each one 1–5 —
                the gap list builds itself from there.
              </p>
            ) : (
              gaps.slice(0, 12).map((g) => (
                <div key={g.role.id} className="pers-gap">
                  <span className="pers-gap__rating">{g.rating}</span>
                  <span className="pers-gap__name">
                    {g.role.pos} — {g.role.name}
                  </span>
                  <span
                    className={'pers-dot pers-dot--' + (g.role.holder?.grade || 'fit')}
                    title={GRADES[g.role.holder?.grade]?.label}
                  />
                </div>
              ))
            )}
          </section>

          <section className="pers-block">
            <h4 className="pers-block__hd">
              Roles the roster can&rsquo;t fill — this is not your fault, it is
              a scheme constraint
            </h4>
            {holes.length === 0 ? (
              <p className="pers-block__text">Every role on this side has a fit.</p>
            ) : (
              holes.map((r) => (
                <div key={r.id} className="pers-gap">
                  <span className={'pers-dot pers-dot--' + r.holder.grade} />
                  <span className="pers-gap__name">
                    {r.pos} — {r.name}
                  </span>
                  <span className="pers-gap__who">
                    {r.holder.name} ({r.holder.ovr} OVR)
                  </span>
                </div>
              ))
            )}
          </section>

          {unrated.length > 0 && (
            <section className="pers-block">
              <h4 className="pers-block__hd">Not rated yet</h4>
              <p className="pers-block__text">
                {unrated.map((r) => `${r.pos} ${r.name}`).join(' · ')}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
