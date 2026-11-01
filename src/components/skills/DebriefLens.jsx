// built by nnnsightnnn — signal from noise
// Debrief lens — two minutes after the game, before the next one.
//
// Fixed taps, no essays: game · mode · result · did the focus skill hold ·
// where points leaked (≤3) · what held (≤2) · minutes · one line. Recent
// games roll up into a recommended next lab focus; one tap stages the week.

import { useEffect, useMemo, useState } from 'react';
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
  FACED_OUTCOMES,
  NEW_THREAT,
  answersFor,
  chipsForMode,
  emptyDebrief,
  facedLine,
  isComplete,
  normalizeDebrief,
  threatBoard,
  threatsForGame,
  recommendFocus,
  skillSignals,
  vaultLine,
  vaultBlock,
  leakById,
  holdById,
} from '../../lib/skills/debrief';
import { NoLogSectionError, canSaveToNote, saveLinesToNote } from '../../lib/skills/vaultLog';
import { clearVaultNoteHandle, getVaultNoteHandle, setVaultNoteHandle } from '../../lib/db';
import { skillById } from '../../data/skills';
import { packagesForGame } from '../../data/packages';

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

// Offense and defense threats share one question: what hurt you most?
function FacedStep({ n, draft, customPackages, onChange }) {
  const f = draft.faced;
  const threats = threatsForGame(draft.game);
  const groups = [
    { id: 'offense', label: 'Their offense' },
    { id: 'defense', label: 'Their defense' },
  ];
  const packages = [
    ...packagesForGame(draft.game),
    ...(customPackages || []).filter((p) => p.game === draft.game),
  ];
  const answers = answersFor(f.threatId, packages);
  const pickThreat = (id) =>
    onChange(f.threatId === id ? { threatId: null } : { threatId: id, packageId: null, call: '' });

  return (
    <div className="dbf-step">
      <span className="dbf-step__n">{n}</span>
      <div className="dbf-step__body">
        <div className="dbf-step__q">
          What hurt you most? <em>optional, the one thing they did that you’d prepare for</em>
        </div>
        {groups.map((g) => (
          <div key={g.id} className="dbf-side">
            <span className="dbf-side__lbl">{g.label}</span>
            <Chips
              items={threats.filter((t) => t.threat === g.id).map((t) => ({ id: t.id, label: t.name }))}
              value={f.threatId}
              single
              onPick={pickThreat}
            />
          </div>
        ))}
        <div className="dbf-side">
          <span className="dbf-side__lbl">Not listed</span>
          <Chips
            items={[{ id: NEW_THREAT, label: 'Something new' }]}
            value={f.threatId}
            single
            onPick={pickThreat}
          />
        </div>
        {f.threatId === NEW_THREAT && (
          <input
            className="trends-input"
            placeholder="What was it? Formation and play if you saw them."
            value={f.note}
            onChange={(e) => onChange({ note: e.target.value })}
          />
        )}
        {f.threatId && (
          <>
            <div className="dbf-step__q">What did you go to?</div>
            {answers.length > 0 && (
              <Chips
                items={answers.map((p) => ({ id: p.id, label: p.name }))}
                value={f.packageId}
                single
                onPick={(id) => {
                  const on = f.packageId === id;
                  const pkg = answers.find((p) => p.id === id);
                  onChange({ packageId: on ? null : id, call: on ? '' : pkg.name });
                }}
              />
            )}
            <input
              className="trends-input"
              placeholder="Or type the call"
              value={f.packageId ? '' : f.call}
              onChange={(e) => onChange({ packageId: null, call: e.target.value })}
            />
            <Chips
              items={FACED_OUTCOMES}
              value={f.outcome}
              single
              onPick={(id) => onChange({ outcome: f.outcome === id ? null : id })}
            />
          </>
        )}
      </div>
    </div>
  );
}

const outcomeCounts = (o) =>
  [
    o.stopped && `${o.stopped} stopped`,
    o.slowed && `${o.slowed} slowed`,
    o.failed && `${o.failed} failed`,
    o.noanswer && `${o.noanswer} no answer`,
  ]
    .filter(Boolean)
    .join(', ');

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
  customPackages,
  onSave,
  onDelete,
  onStageWeek,
}) {
  const [draft, setDraft] = useState(null);
  const [flash, setFlash] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [noteName, setNoteName] = useState(null);

  useEffect(() => {
    if (canSaveToNote()) getVaultNoteHandle().then((h) => setNoteName(h?.name ?? null));
  }, []);

  const rec = useMemo(
    () => recommendFocus(debriefs, activePlan?.skillId),
    [debriefs, activePlan],
  );
  const signals = useMemo(() => skillSignals(debriefs).slice(0, 6), [debriefs]);
  // Per logged game, not the app's active game: a Madden log must stay visible
  // while the call sheet happens to be on CFB.
  const boards = useMemo(
    () =>
      GAMES.map((g) => ({ ...g, threats: threatBoard(debriefs, g.id) })).filter((g) => g.threats.length),
    [debriefs],
  );
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

  const forgetNote = async () => {
    await clearVaultNoteHandle();
    setNoteName(null);
  };

  const pickNote = async () => {
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: 'Markdown note', accept: { 'text/markdown': ['.md'] } }],
    });
    return handle;
  };

  // Returns how many lines went in, or null if nothing could be saved. Permission
  // can lapse between sessions, and asking again needs the click that got us here.
  const saveToNote = async (lines, handle) => {
    try {
      let granted = await handle.queryPermission({ mode: 'readwrite' });
      if (granted !== 'granted') granted = await handle.requestPermission({ mode: 'readwrite' });
      if (granted !== 'granted') {
        say('The browser needs permission to save to that note.');
        return null;
      }
      const { added } = await saveLinesToNote(handle, lines);
      await setVaultNoteHandle(handle);
      setNoteName(handle.name);
      return added;
    } catch (err) {
      if (err instanceof NoLogSectionError) {
        await forgetNote();
        say(`${handle.name} has no "## Log" section, so nothing was saved. Choose Madden-Elite.md.`);
      } else if (err.name === 'NotFoundError') {
        await forgetNote();
        say(`Can't find ${handle.name}. It may have moved. Click Save to vault to choose it again.`);
      } else {
        say(`Could not save to ${handle.name}. Use Copy all as Vault log instead.`);
      }
      return null;
    }
  };

  const saveAllToNote = async (choose) => {
    let handle;
    try {
      handle = (!choose && (await getVaultNoteHandle())) || (await pickNote());
    } catch (err) {
      if (err.name !== 'AbortError') say('Could not open the file picker.');
      return;
    }
    const added = await saveToNote(vaultBlock(debriefs).split('\n'), handle);
    if (added === null) return;
    say(
      added
        ? `Saved ${added} new ${added === 1 ? 'game' : 'games'} to ${handle.name}.`
        : `${handle.name} already has every game.`,
    );
  };

  const save = async () => {
    const row = await onSave(normalizeDebrief(draft));
    // Close before touching the clipboard: writeText can wait on a permission
    // prompt, and an open form invites a second save and a duplicate game.
    setDraft(null);
    say('Saved.');
    const handle = canSaveToNote() ? await getVaultNoteHandle() : null;
    if (handle) {
      const added = await saveToNote([vaultLine(row)], handle);
      if (added !== null) say(`Saved and logged to ${handle.name}.`);
      return;
    }
    if (await copyText(vaultLine(row))) say('Saved. Log line copied. Paste it into Madden-Elite.md.');
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

          {draft.mode === 'h2h' && (
            <FacedStep
              n={focusSkill ? 5 : 4}
              draft={draft}
              customPackages={customPackages}
              onChange={(patch) => setDraft((d) => ({ ...d, faced: { ...d.faced, ...patch } }))}
            />
          )}

          <div className="dbf-step">
            <span className="dbf-step__n">{(focusSkill ? 5 : 4) + (draft.mode === 'h2h' ? 1 : 0)}</span>
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

      {/* ── THREATS FACED ────────────────────────────────────────────── */}
      {!draft && boards.map((b) => (
        <section key={b.id} className="skl-cat">
          <h3 className="skl-cat__hd">What you’re facing, {b.label} H2H</h3>
          <p className="dbf-board__hint">Counts, not verdicts. A few games can’t prove a call works.</p>
          {b.threats.map((t) => (
            <div key={t.key} className="dbf-threat">
              <div className="dbf-threat__hd">
                <span className="dbf-threat__name">{t.name}</span>
                <span className="skl-gap__cat">
                  {t.games} game{t.games === 1 ? '' : 's'} · {t.wins}-{t.games - t.wins}
                  {outcomeCounts(t.outcomes) && ` · ${outcomeCounts(t.outcomes)}`}
                </span>
              </div>
              {t.calls.map((c) => (
                <div key={c.call} className="dbf-threat__call">
                  {c.call}: {c.games} game{c.games === 1 ? '' : 's'}
                  {outcomeCounts(c) && `, ${outcomeCounts(c)}`}
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}

      {/* ── RECENT GAMES ─────────────────────────────────────────────── */}
      {debriefs.length > 0 && !draft && (
        <section className="skl-cat">
          <div className="dbf-loghd">
            <h3 className="skl-cat__hd">Recent games</h3>
            {canSaveToNote() && (
              <>
                <button className="trends-btn" onClick={() => saveAllToNote(false)}>
                  {noteName ? `Save to ${noteName}` : 'Save to vault'}
                </button>
                {noteName && (
                  <button className="trends-btn trends-btn--ghost" onClick={() => saveAllToNote(true)}>
                    Change note
                  </button>
                )}
              </>
            )}
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
                {(d.leaks.length > 0 || d.holds.length > 0 || d.faced?.threatId) && (
                  <div className="dbf-game__chips">
                    {d.faced?.threatId && (
                      <span className="dbf-tag dbf-tag--faced">{facedLine(d.faced)}</span>
                    )}
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
