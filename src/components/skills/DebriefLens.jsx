// built by nnnsightnnn — signal from noise
// Debrief lens — two minutes after the game, before the next one.
//
// Fixed taps, no essays: game · mode · result · did the focus skill hold ·
// where points leaked (≤3) · what held (≤2) · minutes · one line. Recent
// games roll up into a recommended next lab focus; one tap stages the week.

import { useMemo, useState } from 'react';
import {
  GAMES,
  MODES,
  RESULTS,
  FOCUS_OUTCOMES,
  MINUTES,
  LEAKS,
  HOLDS,
  SIDES,
  MAX_LEAKS,
  MAX_HOLDS,
  chipsForMode,
  emptyDebrief,
  isComplete,
  recommendFocus,
  skillSignals,
  vaultLine,
  vaultBlock,
  leakById,
  holdById,
} from '../../lib/skills/debrief';
import { skillById } from '../../data/skills';

const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function Chips({ items, value, onPick, single, max }) {
  const picked = single ? [value] : value;
  const full = !single && picked.length >= max;
  return (
    <div className="dbf-chips">
      {items.map((it) => {
        const on = picked.includes(it.id);
        return (
          <button
            key={it.id}
            type="button"
            className={'dbf-chip' + (on ? ' dbf-chip--on' : '') + (full && !on ? ' dbf-chip--dim' : '')}
            title={it.hint || ''}
            onClick={() => onPick(it.id)}
          >
            {it.label}
            {it.hint && single && <em>{it.hint}</em>}
          </button>
        );
      })}
    </div>
  );
}

function ChipGroups({ chips, mode, value, onToggle, max }) {
  const visible = chipsForMode(chips, mode);
  return SIDES.map((side) => {
    const items = visible.filter((c) => c.side === side.id);
    if (!items.length) return null;
    return (
      <div key={side.id} className="dbf-side">
        <span className="dbf-side__lbl">{side.label}</span>
        <Chips items={items} value={value} onPick={onToggle} max={max} />
      </div>
    );
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function DebriefLens({
  game,
  debriefs,
  activePlan,
  onSave,
  onDelete,
  onStageWeek,
}) {
  const [draft, setDraft] = useState(null);
  const [flash, setFlash] = useState('');
  const [showLog, setShowLog] = useState(false);

  const rec = useMemo(
    () => recommendFocus(debriefs, activePlan?.skillId),
    [debriefs, activePlan],
  );
  const signals = useMemo(() => skillSignals(debriefs).slice(0, 6), [debriefs]);
  const focusSkill = activePlan ? skillById(activePlan.skillId) : null;

  const start = () =>
    setDraft(
      emptyDebrief({
        game: game === 'cfb' ? 'cfb' : 'madden',
        focusSkillId: activePlan?.skillId || null,
      }),
    );

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const toggleIn = (k, id, max) =>
    setDraft((d) => {
      const cur = d[k];
      if (cur.includes(id)) return { ...d, [k]: cur.filter((x) => x !== id) };
      if (cur.length >= max) return d;
      return { ...d, [k]: [...cur, id] };
    });

  const say = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2400);
  };

  const save = async () => {
    const row = await onSave(draft);
    const ok = await copyText(vaultLine(row));
    setDraft(null);
    say(ok ? 'Saved. Log line copied — paste it into Madden-Elite.md.' : 'Saved.');
  };

  return (
    <div className="dbf">
      {flash && <div className="skl-flash">{flash}</div>}

      {/* ── FORM ─────────────────────────────────────────────────────── */}
      {draft ? (
        <div className="dbf-form">
          <div className="dbf-step">
            <span className="dbf-step__n">1</span>
            <div className="dbf-step__body">
              <div className="dbf-row">
                <Chips items={GAMES} value={draft.game} single onPick={(v) => set('game', v)} />
                <Chips
                  items={MODES}
                  value={draft.mode}
                  single
                  onPick={(v) => set('mode', v)}
                />
              </div>
              <Chips items={RESULTS} value={draft.result} single onPick={(v) => set('result', v)} />
            </div>
          </div>

          {focusSkill && (
            <div className="dbf-step">
              <span className="dbf-step__n">2</span>
              <div className="dbf-step__body">
                <div className="dbf-step__q">
                  This week’s focus — <strong>{focusSkill.name}</strong> — did it hold?
                </div>
                <Chips
                  items={FOCUS_OUTCOMES}
                  value={draft.focusOutcome}
                  single
                  onPick={(v) => set('focusOutcome', v)}
                />
              </div>
            </div>
          )}

          <div className="dbf-step">
            <span className="dbf-step__n">{focusSkill ? 3 : 2}</span>
            <div className="dbf-step__body">
              <div className="dbf-step__q">
                Where did the points leak? <em>pick up to {MAX_LEAKS} — the biggest ones, not all of them</em>
              </div>
              <ChipGroups
                chips={LEAKS}
                mode={draft.mode}
                value={draft.leaks}
                max={MAX_LEAKS}
                onToggle={(id) => toggleIn('leaks', id, MAX_LEAKS)}
              />
            </div>
          </div>

          <div className="dbf-step">
            <span className="dbf-step__n">{focusSkill ? 4 : 3}</span>
            <div className="dbf-step__body">
              <div className="dbf-step__q">
                What held? <em>up to {MAX_HOLDS} — even in a loss, something did</em>
              </div>
              <ChipGroups
                chips={HOLDS}
                mode={draft.mode}
                value={draft.holds}
                max={MAX_HOLDS}
                onToggle={(id) => toggleIn('holds', id, MAX_HOLDS)}
              />
            </div>
          </div>

          <div className="dbf-step">
            <span className="dbf-step__n">{focusSkill ? 5 : 4}</span>
            <div className="dbf-step__body">
              <div className="dbf-row">
                <Chips
                  items={MINUTES.map((m) => ({ id: m, label: `${m} min` }))}
                  value={draft.minutes}
                  single
                  onPick={(v) => set('minutes', v)}
                />
                {draft.mode === 'h2h' && (
                  <input
                    className="trends-input dbf-opp"
                    placeholder="Opponent / their team (optional)"
                    value={draft.opponent}
                    onChange={(e) => set('opponent', e.target.value)}
                  />
                )}
              </div>
              <input
                className="trends-input"
                placeholder="One line. The single thing you’d tell yourself before the next game."
                value={draft.note}
                onChange={(e) => set('note', e.target.value)}
              />
            </div>
          </div>

          <div className="skl-savebar dbf-savebar">
            <button className="trends-btn trends-btn--ghost" onClick={() => setDraft(null)}>
              Discard
            </button>
            <button className="trends-btn" disabled={!isComplete(draft)} onClick={save}>
              Save debrief
            </button>
          </div>
        </div>
      ) : (
        <div className="dbf-cta">
          <button className="trends-btn" onClick={start}>
            + Debrief a game
          </button>
          <span className="dbf-cta__hint">
            Two minutes, right after the game. Before you queue the next one.
          </span>
        </div>
      )}

      {/* ── RECOMMENDATION ────────────────────────────────────────────── */}
      {rec && !draft && (
        <div className="skl-focus dbf-rec">
          <div className="skl-focus__label">
            {rec.same ? 'Games agree with the plan' : 'Games say attack next'}
          </div>
          <div className="skl-focus__name">
            {rec.skill.name}
            {rec.skill.leverage && <span className="skl-star">★ high leverage</span>}
          </div>
          <p className="skl-focus__drill">{rec.reason}</p>
          {activePlan && !rec.same && (
            <p className="skl-focus__elite">
              Current week is on <strong>{activePlan.skillName}</strong>. Finish it or switch — your call, not the app’s.
            </p>
          )}
          <div className="dbf-rec__actions">
            <button className="trends-btn" onClick={() => onStageWeek(rec.skill)}>
              Stage a week on {rec.skill.name}
            </button>
          </div>
        </div>
      )}

      {/* ── SIGNALS ───────────────────────────────────────────────────── */}
      {signals.length > 0 && !draft && (
        <section className="skl-cat">
          <h3 className="skl-cat__hd">Leak board — last {Math.min(debriefs.length, 10)} game{debriefs.length === 1 ? '' : 's'}</h3>
          {signals.map((s) => (
            <div key={s.skillId} className="skl-gap">
              <span className={'skl-gap__rating' + (s.score <= 0 ? ' dbf-score--ok' : '')}>
                {s.score > 0 ? `+${s.leaks}` : `${s.holds}✓`}
              </span>
              <span className="skl-gap__name">
                {s.name}
                {s.leverage && <span className="skl-star">★</span>}
              </span>
              <span className="skl-gap__cat">
                {s.leaks} leak{s.leaks === 1 ? '' : 's'} · {s.holds} held
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ── RECENT GAMES ─────────────────────────────────────────────── */}
      {debriefs.length > 0 && !draft && (
        <section className="skl-cat">
          <div className="dbf-loghd">
            <h3 className="skl-cat__hd">Recent games</h3>
            <button
              className="trends-btn trends-btn--ghost"
              onClick={async () => {
                const ok = await copyText(vaultBlock(debriefs));
                say(ok ? 'All log lines copied.' : 'Clipboard blocked — use Show log.');
              }}
            >
              Copy all as Vault log
            </button>
            <button className="trends-btn trends-btn--ghost" onClick={() => setShowLog(!showLog)}>
              {showLog ? 'Hide log' : 'Show log'}
            </button>
          </div>
          {showLog && <pre className="dbf-pre">{vaultBlock(debriefs)}</pre>}
          {debriefs.slice(0, 12).map((d) => {
            const res = RESULTS.find((r) => r.id === d.result);
            return (
              <div key={d.id} className={'dbf-game' + (res?.win ? ' dbf-game--w' : ' dbf-game--l')}>
                <div className="dbf-game__hd">
                  <span className="dbf-game__res">{d.result}</span>
                  <span className="dbf-game__meta">
                    {fmtDay(d.playedAt)} · {d.game === 'cfb' ? 'CFB' : 'M27'} ·{' '}
                    {d.mode === 'h2h' ? `H2H${d.opponent ? ` vs ${d.opponent}` : ''}` : 'CPU'} · {d.minutes}m
                    {d.focusSkillId && d.focusOutcome && (
                      <> · focus {d.focusOutcome}</>
                    )}
                  </span>
                  <button className="skl-snap__del" onClick={() => onDelete(d.id)}>
                    delete
                  </button>
                </div>
                {(d.leaks.length > 0 || d.holds.length > 0) && (
                  <div className="dbf-game__chips">
                    {d.leaks.map((id) => (
                      <span key={id} className="dbf-tag dbf-tag--leak">{leakById(id)?.label}</span>
                    ))}
                    {d.holds.map((id) => (
                      <span key={id} className="dbf-tag dbf-tag--hold">{holdById(id)?.label}</span>
                    ))}
                  </div>
                )}
                {d.note && <div className="dbf-game__note">{d.note}</div>}
              </div>
            );
          })}
        </section>
      )}

      {debriefs.length === 0 && !draft && (
        <div className="skl-empty">
          <p>
            No games diagnosed yet. The Assess lens is what you think you are;
            this is what the games say. After three or four, the two start to disagree — that gap is the lab.
          </p>
        </div>
      )}
    </div>
  );
}
