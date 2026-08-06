// built by nnnsightnnn — signal from noise
// Coverage Lab — study the adjustment, not the picture.
//
// Pick a coverage, an offensive formation and a route concept; the engine
// resolves every defender's assignment from the actual releases, so two calls
// that look identical pre-snap diverge only where the football says they do.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  makeContext,
  buildDefense,
  divergingPositions,
  phaseLabel,
} from '../../lib/coverage/engine';
import { COVERAGES, FAMILIES } from '../../lib/coverage/coverages';
import { FORMATIONS } from '../../lib/coverage/formations';
import { CONCEPTS } from '../../lib/coverage/concepts';
import { differenceFor } from '../../lib/coverage/differences';
import { ballYards } from '../../lib/coverage/labField';
import { DEFAULT_LAB, LEGEND, SNAP_MS } from '../../lib/coverage/labConfig';
import { ALL_LESSONS, lessonById, missKey } from '../../lib/coverage/lessons';
import CoverageField from './CoverageField';
import AssignmentSheet from './AssignmentSheet';
import CoverageBriefing from './CoverageBriefing';
import { LessonNav, LessonPanel, DrillPanel } from './LessonMode';
import GlossaryPanel from './GlossaryPanel';

export default function CoverageLab({ lab, setLab }) {
  const cfg = { ...DEFAULT_LAB, ...(lab || {}) };
  const learn = { current: null, done: [], misses: [], ...(cfg.learn || {}) };
  const isLearn = cfg.mode === 'learn';
  const activeLesson =
    isLearn && learn.current !== '__drill' ? lessonById(learn.current) : null;
  const compare = isLearn
    ? (activeLesson ? activeLesson.setup.view : cfg.learnView) === 'compare'
    : cfg.mode === 'compare';

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const raf = useRef(null);
  const startedAt = useRef(0);
  const loopRef = useRef(loop);
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const patch = (p) => setLab({ ...cfg, ...p });

  // ── learn-mode handlers ────────────────────────────────────────────────
  const openLesson = (id) => {
    const l = lessonById(id);
    if (!l) return;
    const { view, ...setup } = l.setup;
    patch({ ...setup, mode: 'learn', learnView: view, learn: { ...learn, current: id } });
  };
  const enterLearn = () =>
    openLesson(lessonById(learn.current) ? learn.current : ALL_LESSONS[0].id);
  const openDrill = () => patch({ learn: { ...learn, current: '__drill' } });
  const exitDrill = () =>
    openLesson(
      (ALL_LESSONS.find((l) => !learn.done.includes(l.id)) || ALL_LESSONS[0]).id,
    );
  const clearMiss = (k) =>
    patch({ learn: { ...learn, misses: learn.misses.filter((x) => x !== k) } });
  const loadDrillSetup = (setup) => {
    const { view, ...rest } = setup;
    patch({ ...rest, learnView: view, learn: { ...learn, current: '__drill' } });
  };
  const handleAnswer = (lessonId, qIdx, correct, allSolved) => {
    const k = missKey(lessonId, qIdx);
    let { done, misses } = learn;
    if (correct) misses = misses.filter((x) => x !== k);
    else if (!misses.includes(k)) misses = [...misses, k];
    if (allSolved && !done.includes(lessonId)) done = [...done, lessonId];
    patch({ learn: { ...learn, done, misses } });
  };

  const ball = useMemo(() => ballYards(cfg.ruleset, cfg.ballSpot), [cfg.ruleset, cfg.ballSpot]);

  const ctx = useMemo(
    () =>
      makeContext({
        formation: cfg.formation,
        concept: cfg.concept,
        ball,
        flip: cfg.flip,
      }),
    [cfg.formation, cfg.concept, ball, cfg.flip],
  );

  const defA = useMemo(() => buildDefense(cfg.coverage, ctx), [cfg.coverage, ctx]);
  const defB = useMemo(
    () => (compare ? buildDefense(cfg.compareWith, ctx) : null),
    [compare, cfg.compareWith, ctx],
  );

  const diverging = useMemo(
    () => (defB ? divergingPositions(defA, defB) : []),
    [defA, defB],
  );

  // ── snap animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return undefined;
    startedAt.current = performance.now() - t * SNAP_MS;
    const step = (now) => {
      let nt = (now - startedAt.current) / SNAP_MS;
      if (nt >= 1) {
        if (loopRef.current) {
          startedAt.current = now;
          nt = 0;
        } else {
          setT(1);
          setPlaying(false);
          return;
        }
      }
      setT(nt);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // t is intentionally read once at start so scrubbing does not restart the loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const covA = COVERAGES[cfg.coverage];
  const covB = compare ? COVERAGES[cfg.compareWith] : null;
  const diffText = compare ? differenceFor(cfg.coverage, cfg.compareWith) : null;

  const pickList = (activeKey, onPick) => (
    <div className="cvpicker">
      {FAMILIES.map(([fam, ids]) => (
        <div key={fam}>
          <div className="cvpicker__fam">{fam}</div>
          {ids.map((id) => (
            <button
              key={id}
              type="button"
              className={'cvpicker__btn' + (activeKey === id ? ' is-on' : '')}
              onClick={() => onPick(id)}
            >
              {COVERAGES[id].name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="planner cvlab">
      {/* ── control bar ─────────────────────────────────────────────── */}
      <div className="planner__bar">
        <div className="seg">
          <button
            type="button"
            className={'seg__btn' + (cfg.mode === 'study' ? ' is-on' : '')}
            onClick={() => patch({ mode: 'study' })}
          >
            Study
          </button>
          <button
            type="button"
            className={'seg__btn' + (cfg.mode === 'compare' ? ' is-on' : '')}
            onClick={() => patch({ mode: 'compare' })}
          >
            Compare
          </button>
          <button
            type="button"
            className={'seg__btn' + (isLearn ? ' is-on' : '')}
            onClick={enterLearn}
          >
            Learn
          </button>
        </div>

        <div className="seg">
          {['nfl', 'ncaa'].map((r) => (
            <button
              key={r}
              type="button"
              className={'seg__btn' + (cfg.ruleset === r ? ' is-on' : '')}
              onClick={() => patch({ ruleset: r })}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="seg">
          {['left', 'middle', 'right'].map((s) => (
            <button
              key={s}
              type="button"
              className={'seg__btn' + (cfg.ballSpot === s ? ' is-on' : '')}
              onClick={() => patch({ ballSpot: s })}
            >
              {s === 'left' ? '◀ hash' : s === 'right' ? 'hash ▶' : 'middle'}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={'plbtn' + (cfg.flip ? ' is-on' : '')}
          onClick={() => patch({ flip: !cfg.flip })}
          title="Mirror the formation to put the passing strength into the boundary"
        >
          Flip strength
        </button>

        <button
          type="button"
          className={'plbtn' + (glossaryOpen ? ' is-on' : '')}
          onClick={() => setGlossaryOpen((v) => !v)}
          title="Every term the lab uses, defined"
        >
          Glossary
        </button>

        <div className="planner__save">
          <button type="button" className="plbtn plbtn--primary" onClick={() => {
            if (playing) { setPlaying(false); return; }
            if (t >= 0.999) setT(0);
            setPlaying(true);
          }}>
            {playing ? '❚❚ Pause' : '▶ Snap'}
          </button>
          <button
            type="button"
            className={'plbtn' + (loop ? ' is-on' : '')}
            onClick={() => setLoop((v) => !v)}
          >
            Loop
          </button>
        </div>
      </div>

      {glossaryOpen && <GlossaryPanel onClose={() => setGlossaryOpen(false)} />}

      {/* ── formation + concept (hidden in Learn — the lesson pins them) ── */}
      {!isLearn && (
      <div className="planner__bar cvbar--picks">
        <div className="cvchips">
          <span className="cvchips__lbl">Formation</span>
          {Object.entries(FORMATIONS).map(([k, f]) => (
            <button
              key={k}
              type="button"
              className={'plbtn' + (cfg.formation === k ? ' is-on' : '')}
              onClick={() => patch({ formation: k })}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="cvchips">
          <span className="cvchips__lbl">Concept</span>
          {Object.entries(CONCEPTS).map(([k, c]) => (
            <button
              key={k}
              type="button"
              className={'plbtn' + (cfg.concept === k ? ' is-on' : '')}
              onClick={() => patch({ concept: k })}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="cvnote">{CONCEPTS[cfg.concept].note}</div>
      </div>
      )}

      {/* ── main ────────────────────────────────────────────────────── */}
      <div className="cvlab__main">
        <div className="cvlab__rail">
          {isLearn ? (
            <LessonNav learn={learn} onOpenLesson={openLesson} onOpenDrill={openDrill} />
          ) : (
            <>
              <div className="vpanel">
                <div className="cvpanel__head">Coverage</div>
                {pickList(cfg.coverage, (id) => patch({ coverage: id }))}
              </div>
              {compare && (
                <div className="vpanel">
                  <div className="cvpanel__head">Compare against</div>
                  {pickList(cfg.compareWith, (id) => patch({ compareWith: id }))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="cvlab__center">
          <div className="planner__board">
            <div className={'cvfields' + (compare ? ' is-split' : '')}>
              <div className="cvfield">
                <div className="cvfield__cap">
                  <b>{covA.name}</b>
                  <span>{covA.fam} · {covA.shell}</span>
                </div>
                <CoverageField ctx={ctx} defense={defA} t={t} ruleset={cfg.ruleset} />
              </div>
              {compare && covB && (
                <div className="cvfield">
                  <div className="cvfield__cap">
                    <b>{covB.name}</b>
                    <span>{covB.fam} · {covB.shell}</span>
                  </div>
                  <CoverageField ctx={ctx} defense={defB} t={t} ruleset={cfg.ruleset} />
                </div>
              )}
            </div>

            <div className="cvscrub">
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(t * 1000)}
                onChange={(e) => {
                  setPlaying(false);
                  setT(Number(e.target.value) / 1000);
                }}
              />
              <span className="cvscrub__phase">{phaseLabel(t)}</span>
            </div>

            <div className="cvlegend">
              {LEGEND.map(([k, label]) => (
                <span key={k}>
                  <i className={`cvdot cvdot--${k}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {compare && (
            <div className="cvdiff">
              <div className="cvcallout">
                <span className="cvcallout__k">The one difference</span>
                {diffText ||
                  'No written pairing for these two yet — read the highlighted rows below, they are where the calls actually diverge.'}
              </div>
              <div className={'cvcallout cvcallout--warn'}>
                <span className="cvcallout__k">Diverging on this snap</span>
                {diverging.length ? (
                  <>
                    {diverging.join(' · ')} — against <b>{CONCEPTS[cfg.concept].name}</b> out of{' '}
                    <b>{FORMATIONS[cfg.formation].name}</b>.
                  </>
                ) : (
                  <>
                    Nothing. Against <b>{CONCEPTS[cfg.concept].name}</b> these two calls play
                    identically. Change the concept to find the trigger.
                  </>
                )}
              </div>
            </div>
          )}

          <div className={'cvsheets' + (compare ? ' is-split' : '')}>
            <AssignmentSheet
              title={compare ? covA.name : 'Assignment sheet'}
              defense={defA}
              compareTo={defB}
            />
            {compare && defB && (
              <AssignmentSheet title={covB.name} defense={defB} compareTo={defA} />
            )}
          </div>

          <div className="planner__hint">{FORMATIONS[cfg.formation].blurb}</div>
        </div>

        {isLearn && learn.current === '__drill' ? (
          <DrillPanel
            misses={learn.misses}
            onClear={clearMiss}
            onLoadSetup={loadDrillSetup}
            onExit={exitDrill}
          />
        ) : isLearn && activeLesson ? (
          <LessonPanel
            key={activeLesson.id}
            lesson={activeLesson}
            learn={learn}
            onAnswer={handleAnswer}
            onOpenLesson={openLesson}
          />
        ) : (
          <CoverageBriefing cov={covA} ctx={ctx} />
        )}
      </div>
    </div>
  );
}
