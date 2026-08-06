// built by nnnsightnnn — signal from noise
// Coverage Lab — Learn mode: sequenced lessons, checkpoint quizzes, and the
// miss drill. All progress lives in the persisted lab settings (learn key);
// these components are presentational plus per-attempt local state.

import { useEffect, useRef, useState } from 'react';
import { MODULES, ALL_LESSONS, questionForMiss } from '../../lib/coverage/lessons';

/* ── nav (left rail) ─────────────────────────────────────────────────────── */

export function LessonNav({ learn, onOpenLesson, onOpenDrill }) {
  const total = ALL_LESSONS.length;
  const cleared = learn.done.length;
  return (
    <div className="vpanel">
      <div className="cvpanel__head">Learn track</div>
      <div className="cvlearn__meter">
        {cleared} / {total} lessons cleared
      </div>
      <div className="cvpicker">
        {MODULES.map((m) => (
          <div key={m.id}>
            <div className="cvpicker__fam">{m.name}</div>
            {m.lessons.map((l) => {
              const done = learn.done.includes(l.id);
              const on = learn.current === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  className={'cvpicker__btn' + (on ? ' is-on' : '')}
                  onClick={() => onOpenLesson(l.id)}
                >
                  <span className={'cvlearn__tick' + (done ? ' is-done' : '')}>
                    {done ? '✓' : '○'}
                  </span>
                  {l.title}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {learn.misses.length > 0 && (
        <button
          type="button"
          className={
            'plbtn cvlearn__drillbtn' + (learn.current === '__drill' ? ' is-on' : '')
          }
          onClick={onOpenDrill}
        >
          Drill misses ({learn.misses.length})
        </button>
      )}
    </div>
  );
}

/* ── one quiz question ───────────────────────────────────────────────────── */

function QuizQuestion({ index, question, solved, onPick }) {
  const [picked, setPicked] = useState(null);
  const isSolved = solved || picked === question.answer;
  return (
    <div className="cvquiz__q">
      <div className="cvquiz__prompt">
        <span className="cvquiz__num">Q{index + 1}</span>
        {question.q}
      </div>
      {question.options.map((opt, i) => {
        let cls = 'cvquiz__opt';
        if (isSolved && i === question.answer) cls += ' is-right';
        else if (!isSolved && picked === i) cls += ' is-wrong';
        return (
          <button
            key={opt}
            type="button"
            className={cls}
            disabled={isSolved}
            onClick={() => {
              setPicked(i);
              onPick(i === question.answer);
            }}
          >
            {opt}
          </button>
        );
      })}
      {isSolved && <div className="cvquiz__explain">{question.explain}</div>}
      {!isSolved && picked !== null && (
        <div className="cvquiz__retry">Not it — look at the field again, then retry.</div>
      )}
    </div>
  );
}

/* ── lesson panel (right rail) ───────────────────────────────────────────── */

export function LessonPanel({ lesson, learn, onAnswer, onOpenLesson }) {
  const [solved, setSolved] = useState(() => ({}));
  const allSolved = lesson.quiz.every((_, i) => solved[i]);

  const idx = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const next = idx >= 0 ? ALL_LESSONS[idx + 1] : null;
  const done = learn.done.includes(lesson.id);

  return (
    <div className="planner__side">
      <div className="vpanel">
        <div className="cvpanel__head">
          Lesson {idx + 1} · {lesson.moduleName}
        </div>
        <div className="cvlearn__title">{lesson.title}</div>
        <div className="cvcallout">
          <span className="cvcallout__k">The one idea</span>
          {lesson.why}
        </div>
        <ul className="cvlist cvlearn__teach">
          {lesson.teach.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="cvcallout cvcallout--warn">
          <span className="cvcallout__k">Watch for it</span>
          {lesson.watch}
        </div>
      </div>

      <div className="vpanel">
        <div className="cvpanel__head">Checkpoint</div>
        {lesson.quiz.map((q, i) => (
          <QuizQuestion
            key={`${lesson.id}:${i}`}
            index={i}
            question={q}
            solved={!!solved[i]}
            onPick={(correct) => {
              const nextSolved = correct ? { ...solved, [i]: true } : solved;
              if (correct) setSolved(nextSolved);
              const all = lesson.quiz.every((_, k) => nextSolved[k]);
              onAnswer(lesson.id, i, correct, all);
            }}
          />
        ))}
        {(allSolved || done) && (
          <div className="cvlearn__cleared">
            Lesson cleared ✓
            {next && (
              <button
                type="button"
                className="plbtn plbtn--primary"
                onClick={() => onOpenLesson(next.id)}
              >
                Next: {next.title} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── miss drill (right rail) ─────────────────────────────────────────────── */

export function DrillPanel({ misses, onClear, onLoadSetup, onExit }) {
  const current = misses[0] || null;
  const q = current ? questionForMiss(current) : null;
  const [ok, setOk] = useState(false);

  // Re-point the lab at the snap the missed question came from, once per
  // question. Ref keeps the parent's (re-created) patch out of the deps.
  const loadRef = useRef(onLoadSetup);
  useEffect(() => {
    loadRef.current = onLoadSetup;
  }, [onLoadSetup]);
  useEffect(() => {
    if (!current) return;
    const info = questionForMiss(current);
    if (info) loadRef.current(info.lesson.setup);
  }, [current]);

  return (
    <div className="planner__side">
      <div className="vpanel">
        <div className="cvpanel__head">Miss drill</div>
        {!q ? (
          <div className="cvlearn__cleared">
            All misses cleared ✓
            <button type="button" className="plbtn plbtn--primary" onClick={onExit}>
              Back to lessons
            </button>
          </div>
        ) : (
          <>
            <div className="cvlearn__meter">
              {misses.length} left · from “{q.lesson.title}” ({q.lesson.moduleName})
            </div>
            <QuizQuestion
              key={current}
              index={q.qIdx}
              question={q.question}
              solved={false}
              onPick={(correct) => setOk(correct)}
            />
            {ok && (
              <button
                type="button"
                className="plbtn plbtn--primary"
                onClick={() => {
                  setOk(false);
                  onClear(current);
                }}
              >
                Cleared — next miss →
              </button>
            )}
            <button type="button" className="plbtn cvlearn__drillbtn" onClick={onExit}>
              Exit drill
            </button>
          </>
        )}
      </div>
    </div>
  );
}
