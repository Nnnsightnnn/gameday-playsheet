// built by nnnsightnnn — signal from noise
// Skills Lab — rate the skills that separate elite from good, find the gap,
// attack it. Three lenses: Assess (snapshot yourself against the taxonomy),
// Gaps (where you're weakest, what to attack next), Progress (snapshots over
// time — the deltas are the point).

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  getSkillAssessments,
  saveSkillAssessment,
  deleteSkillAssessment,
  getLabPlans,
  saveLabPlan,
  updateLabPlanSession,
  deleteLabPlan,
} from '../../lib/db';
import { buildWeekPlan, sessionMinutes } from '../../lib/skills/labPlan';
import {
  SKILL_CATEGORIES,
  RATING_ANCHORS,
  skillsForGame,
  categoryAverages,
  gapList,
  focusSkill,
  skillById,
} from '../../data/skills';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function SessionCard({ plan, session }) {
  const [open, setOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(session.note || '');
  return (
    <div className={'skl-sess' + (session.done ? ' skl-sess--done' : '')}>
      <div className="skl-sess__hd">
        <button
          className="skl-sess__check"
          title={session.done ? 'Mark not done' : 'Mark done'}
          onClick={() =>
            updateLabPlanSession(plan.id, session.idx, { done: !session.done })
          }
        >
          {session.done ? '✓' : ''}
        </button>
        <button className="skl-sess__title" onClick={() => setOpen(!open)}>
          <span className="skl-sess__num">S{session.idx + 1}</span>
          {session.title}
          <span className="skl-sess__min">{sessionMinutes(session)} min</span>
        </button>
      </div>
      {session.goal && <div className="skl-sess__goal">{session.goal}</div>}
      {open && (
        <div className="skl-sess__body">
          {session.blocks.map((b, i) => (
            <div key={i} className="skl-sess__block">
              <span className="skl-sess__blockmin">{b.min}′</span>
              <span>{b.text}</span>
            </div>
          ))}
          <div className="skl-sess__noterow">
            <input
              className="trends-input"
              placeholder="Session note — what was the number? what broke?"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
            />
            <button
              className="trends-btn trends-btn--ghost"
              onClick={() =>
                updateLabPlanSession(plan.id, session.idx, { note: noteDraft })
              }
            >
              Save note
            </button>
          </div>
          {session.note && noteDraft === session.note && (
            <div className="skl-sess__notesaved">Saved.</div>
          )}
        </div>
      )}
    </div>
  );
}

function RatingRow({ skill, value, onRate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="skl-row">
      <div className="skl-row__main">
        <button className="skl-row__name" onClick={() => setOpen(!open)}>
          {skill.name}
          {skill.leverage && <span className="skl-star" title="High leverage">★</span>}
          {skill.games !== 'both' && (
            <span className="skl-gamechip">{skill.games === 'cfb' ? 'CFB' : 'Madden'}</span>
          )}
        </button>
        <div className="skl-scale">
          {RATING_ANCHORS.map((a) => (
            <button
              key={a.value}
              title={a.label}
              className={
                'skl-dot' + (value === a.value ? ' skl-dot--on' : '')
              }
              onClick={() => onRate(skill.id, value === a.value ? null : a.value)}
            >
              {a.value}
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="skl-row__detail">
          <p><strong>What it is:</strong> {skill.def}</p>
          <p><strong>Elite marker (a 5):</strong> {skill.elite}</p>
          <p><strong>Drill:</strong> {skill.drill}</p>
        </div>
      )}
    </div>
  );
}

export default function SkillsLab({ game }) {
  const assessments = useLiveQuery(() => getSkillAssessments(), [], null);
  const latest = assessments?.[0] || null;
  const plans = useLiveQuery(() => getLabPlans(), [], null);
  const activePlan = plans?.[0] || null;
  const [planSkillId, setPlanSkillId] = useState('');

  const [mode, setMode] = useState('gaps');
  // Default the filter to the game currently active on the call sheet.
  const [gameFilter, setGameFilter] = useState(
    game === 'cfb' || game === 'madden' ? game : 'both',
  );
  const [draft, setDraft] = useState(null); // null until Assess is opened
  const [note, setNote] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const visibleSkills = useMemo(() => skillsForGame(gameFilter), [gameFilter]);
  const visibleIds = useMemo(
    () => new Set(visibleSkills.map((s) => s.id)),
    [visibleSkills],
  );

  const startAssess = () => {
    setDraft({ ...(latest?.ratings || {}) });
    setNote('');
    setMode('assess');
  };

  const rate = (id, val) => {
    setDraft((d) => {
      const next = { ...(d || {}) };
      if (val == null) delete next[id];
      else next[id] = val;
      return next;
    });
  };

  const ratedCount = draft
    ? visibleSkills.filter((s) => typeof draft[s.id] === 'number').length
    : 0;

  const save = async () => {
    await saveSkillAssessment({ ratings: draft, note });
    setDraft(null);
    setMode('gaps');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  // ── Gaps lens data ───────────────────────────────────────────────────────
  const ratings = useMemo(() => latest?.ratings || {}, [latest]);
  const catAvgs = useMemo(() => categoryAverages(ratings), [ratings]);
  const gaps = useMemo(
    () => gapList(ratings).filter((s) => visibleIds.has(s.id)),
    [ratings, visibleIds],
  );
  const focus = useMemo(() => focusSkill(ratings), [ratings]);

  // ── Progress lens data ───────────────────────────────────────────────────
  const history = useMemo(() => {
    if (!assessments) return [];
    return assessments.map((a, i) => {
      const prev = assessments[i + 1];
      const avgs = categoryAverages(a.ratings);
      const rated = Object.values(a.ratings || {}).filter(
        (v) => typeof v === 'number',
      );
      const overall = rated.length
        ? Math.round((rated.reduce((x, y) => x + y, 0) / rated.length) * 10) / 10
        : null;
      let prevOverall = null;
      if (prev) {
        const pv = Object.values(prev.ratings || {}).filter(
          (v) => typeof v === 'number',
        );
        prevOverall = pv.length
          ? Math.round((pv.reduce((x, y) => x + y, 0) / pv.length) * 10) / 10
          : null;
      }
      return { ...a, avgs, overall, prevOverall };
    });
  }, [assessments]);

  if (assessments === null) {
    return <div className="trends-empty">Loading…</div>;
  }

  return (
    <div className="skl">
      <div className="skl-hd">
        <div className="trends-tabs">
          <button
            className={'trend-tab' + (mode === 'gaps' ? ' trend-tab--on' : '')}
            onClick={() => setMode('gaps')}
          >
            Gaps
          </button>
          <button
            className={'trend-tab' + (mode === 'plan' ? ' trend-tab--on' : '')}
            onClick={() => setMode('plan')}
          >
            Plan
          </button>
          <button
            className={'trend-tab' + (mode === 'assess' ? ' trend-tab--on' : '')}
            onClick={() => (draft ? setMode('assess') : startAssess())}
          >
            Assess
          </button>
          <button
            className={'trend-tab' + (mode === 'progress' ? ' trend-tab--on' : '')}
            onClick={() => setMode('progress')}
          >
            Progress
          </button>
        </div>
        <div className="trends-tabs">
          {['both', 'madden', 'cfb'].map((g) => (
            <button
              key={g}
              className={'trend-chip' + (gameFilter === g ? ' trend-chip--on' : '')}
              onClick={() => setGameFilter(g)}
            >
              {g === 'both' ? 'All skills' : g === 'cfb' ? 'CFB' : 'Madden'}
            </button>
          ))}
        </div>
      </div>

      {savedFlash && <div className="skl-flash">Snapshot saved.</div>}

      {/* ── ASSESS ─────────────────────────────────────────────────────── */}
      {mode === 'assess' && draft && (
        <>
          <div className="skl-intro">
            Rate yourself against the elite marker, not against your friends.
            1 unaware · 2 aware but can’t execute · 3 inconsistent · 4 reliable
            under pressure · 5 the elite marker is true of you. Tap a skill
            name for its definition, marker, and drill.
          </div>
          {SKILL_CATEGORIES.map((cat) => {
            const skills = cat.skills.filter((s) => visibleIds.has(s.id));
            if (!skills.length) return null;
            return (
              <section key={cat.id} className="skl-cat">
                <h3 className="skl-cat__hd">{cat.name}</h3>
                <p className="skl-cat__blurb">{cat.blurb}</p>
                {skills.map((s) => (
                  <RatingRow
                    key={s.id}
                    skill={s}
                    value={draft[s.id]}
                    onRate={rate}
                  />
                ))}
              </section>
            );
          })}
          <div className="skl-savebar">
            <input
              className="trends-input"
              placeholder="Snapshot note (optional) — e.g. after roll-coverage week"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="trends-btn"
              disabled={ratedCount === 0}
              onClick={save}
            >
              Save snapshot ({ratedCount}/{visibleSkills.length} rated)
            </button>
          </div>
        </>
      )}

      {/* ── GAPS ───────────────────────────────────────────────────────── */}
      {mode === 'gaps' && (
        <>
          {!latest ? (
            <div className="skl-empty">
              <p>
                No snapshot yet. The whole system starts with an honest
                baseline — take the first assessment and the gaps show
                themselves.
              </p>
              <button className="trends-btn" onClick={startAssess}>
                Take first assessment
              </button>
            </div>
          ) : (
            <>
              <div className="skl-meta">
                Latest snapshot: {fmtDate(latest.createdAt)}
                {latest.note ? ` — ${latest.note}` : ''}
              </div>

              {focus && (
                <div className="skl-focus">
                  <div className="skl-focus__label">Attack next</div>
                  <div className="skl-focus__name">
                    {focus.name} <span className="skl-focus__rating">rated {focus.rating}/5</span>
                    {focus.leverage && <span className="skl-star">★ high leverage</span>}
                  </div>
                  <p className="skl-focus__drill">{focus.drill}</p>
                  <p className="skl-focus__elite">Elite marker: {focus.elite}</p>
                </div>
              )}

              <section className="skl-cat">
                <h3 className="skl-cat__hd">Category averages</h3>
                {catAvgs.map((c) => (
                  <div key={c.id} className="skl-bar">
                    <span className="skl-bar__name">{c.name}</span>
                    <div className="skl-bar__track">
                      <div
                        className="skl-bar__fill"
                        style={{ width: `${((c.avg || 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="skl-bar__val">
                      {c.avg != null ? c.avg : '—'}
                      <em> ({c.rated}/{c.total})</em>
                    </span>
                  </div>
                ))}
              </section>

              <section className="skl-cat">
                <h3 className="skl-cat__hd">Weakest first</h3>
                {gaps.slice(0, 12).map((s) => (
                  <div key={s.id} className="skl-gap">
                    <span className="skl-gap__rating">{s.rating}</span>
                    <span className="skl-gap__name">
                      {s.name}
                      {s.leverage && <span className="skl-star">★</span>}
                    </span>
                    <span className="skl-gap__cat">{s.catName}</span>
                  </div>
                ))}
                {gaps.length === 0 && (
                  <p className="skl-cat__blurb">
                    Nothing rated for this game filter yet.
                  </p>
                )}
              </section>
            </>
          )}
        </>
      )}

      {/* ── PLAN ───────────────────────────────────────────────────────── */}
      {mode === 'plan' && (
        <>
          {!latest ? (
            <div className="skl-empty">
              <p>
                The plan is generated from your gaps, so it needs a snapshot
                first. Rate yourself once and the week builds itself.
              </p>
              <button className="trends-btn" onClick={startAssess}>
                Take first assessment
              </button>
            </div>
          ) : (
            <>
              {activePlan && (
                <div className="skl-plan">
                  <div className="skl-plan__hd">
                    <div>
                      <div className="skl-focus__label">
                        Week of {activePlan.weekOf} — focus
                      </div>
                      <div className="skl-focus__name">{activePlan.skillName}</div>
                    </div>
                    <div className="skl-plan__count">
                      {activePlan.sessions.filter((s) => s.done).length}/
                      {activePlan.sessions.length} sessions
                    </div>
                  </div>
                  <p className="skl-focus__elite">
                    Elite marker: {activePlan.skillElite}
                  </p>
                  {activePlan.sessions.map((s) => (
                    <SessionCard key={s.idx} plan={activePlan} session={s} />
                  ))}
                </div>
              )}

              <section className="skl-cat">
                <h3 className="skl-cat__hd">
                  {activePlan ? 'Start a new week' : 'Generate this week'}
                </h3>
                <p className="skl-cat__blurb">
                  One skill, seven ~60-minute sessions: baseline → volume →
                  pressure test → repair → pressure test → review + re-rate.
                  Defaults to your lowest-rated high-leverage gap.
                </p>
                <div className="trends-yt__row">
                  <select
                    className="trends-input"
                    value={planSkillId || focus?.id || ''}
                    onChange={(e) => setPlanSkillId(e.target.value)}
                  >
                    {gaps.slice(0, 10).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — rated {s.rating}/5
                        {s.leverage ? ' ★' : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    className="trends-btn"
                    disabled={gaps.length === 0}
                    onClick={() => {
                      const skill =
                        skillById(planSkillId) || focus || gaps[0];
                      if (!skill) return;
                      const plan = buildWeekPlan(
                        skill,
                        new Date().toISOString().slice(0, 10),
                      );
                      saveLabPlan(plan);
                    }}
                  >
                    Generate week
                  </button>
                  {activePlan && (
                    <button
                      className="trends-btn trends-btn--ghost"
                      onClick={() => {
                        if (window.confirm('Delete the current week plan?'))
                          deleteLabPlan(activePlan.id);
                      }}
                    >
                      Delete current
                    </button>
                  )}
                </div>
              </section>

              {plans && plans.length > 1 && (
                <section className="skl-cat">
                  <h3 className="skl-cat__hd">Past weeks</h3>
                  {plans.slice(1).map((p) => (
                    <div key={p.id} className="skl-gap">
                      <span className="skl-gap__rating">
                        {p.sessions.filter((s) => s.done).length}/
                        {p.sessions.length}
                      </span>
                      <span className="skl-gap__name">{p.skillName}</span>
                      <span className="skl-gap__cat">week of {p.weekOf}</span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </>
      )}

      {/* ── PROGRESS ───────────────────────────────────────────────────── */}
      {mode === 'progress' && (
        <>
          {history.length === 0 ? (
            <div className="skl-empty">
              <p>No snapshots yet — progress needs at least one.</p>
              <button className="trends-btn" onClick={startAssess}>
                Take first assessment
              </button>
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="skl-snap">
                <div className="skl-snap__hd">
                  <span className="skl-snap__date">{fmtDate(h.createdAt)}</span>
                  <span className="skl-snap__overall">
                    overall {h.overall ?? '—'}
                    {h.prevOverall != null && h.overall != null && (
                      <em
                        className={
                          h.overall >= h.prevOverall
                            ? 'skl-delta skl-delta--up'
                            : 'skl-delta skl-delta--down'
                        }
                      >
                        {h.overall >= h.prevOverall ? ' ▲' : ' ▼'}
                        {Math.abs(
                          Math.round((h.overall - h.prevOverall) * 10) / 10,
                        )}
                      </em>
                    )}
                  </span>
                  <button
                    className="skl-snap__del"
                    onClick={() => {
                      if (window.confirm('Delete this snapshot?'))
                        deleteSkillAssessment(h.id);
                    }}
                  >
                    delete
                  </button>
                </div>
                {h.note && <div className="skl-snap__note">{h.note}</div>}
                <div className="skl-snap__cats">
                  {h.avgs
                    .filter((c) => c.avg != null)
                    .map((c) => (
                      <span key={c.id} className="skl-snap__cat">
                        {c.name}: <strong>{c.avg}</strong>
                      </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
