// built by nnnsightnnn — signal from noise
// One scheme role, expanded: the job, the ratings that let a body do it,
// who holds it now, what breaks without it, and the live reads.

import { useState } from 'react';
import { RATING_GLOSSARY, KNOW_ANCHORS } from '../../data/personnel';
import {
  coreRatings,
  supportRatings,
  sortKey,
  confidenceOf,
  GRADES,
} from '../../lib/personnel/roleModel';

function ConfChip({ id }) {
  const c = confidenceOf(id);
  if (!c) return null;
  return (
    <span className={'pers-conf pers-conf--' + c.id} title={c.blurb}>
      {c.label}
    </span>
  );
}

function RatingLine({ r }) {
  return (
    <div className={'pers-rate pers-rate--' + (r.tier || 'support')}>
      <span className="pers-rate__key" title={RATING_GLOSSARY[r.key] || r.key}>
        {r.key}
      </span>
      <div className="pers-rate__body">
        <div className="pers-rate__gloss">{RATING_GLOSSARY[r.key] || ''}</div>
        <p className="pers-rate__why">{r.why}</p>
      </div>
      <ConfChip id={r.conf} />
    </div>
  );
}

function Holder({ h, label }) {
  if (!h) return null;
  const g = GRADES[h.grade];
  return (
    <div className={'pers-holder' + (h.grade ? ' pers-holder--' + h.grade : '')}>
      <div className="pers-holder__hd">
        <span className="pers-holder__label">{label}</span>
        <span className="pers-holder__name">{h.name}</span>
        {h.ovr != null && <span className="pers-holder__ovr">{h.ovr} OVR</span>}
        {g && <span className="pers-holder__grade">{g.label}</span>}
      </div>
      <div className="pers-holder__line">{h.line}</div>
      <p className="pers-holder__verdict">{h.verdict}</p>
    </div>
  );
}

export default function RoleCard({ role, entry, onPatch }) {
  const [open, setOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(entry?.note || '');
  const [playerDraft, setPlayerDraft] = useState(entry?.player || '');
  const rating = entry?.rating ?? null;
  const grade = GRADES[role.holder?.grade];

  return (
    <div className={'pers-role' + (open ? ' pers-role--open' : '')}>
      <div className="pers-role__hd">
        <button className="pers-role__title" onClick={() => setOpen(!open)}>
          <span className="pers-role__pos">{role.pos}</span>
          <span className="pers-role__name">{role.name}</span>
          <span className="pers-role__slot">{role.slot}</span>
          {grade && (
            <span
              className={'pers-dot pers-dot--' + role.holder.grade}
              title={grade.label}
            />
          )}
        </button>
        <div className="pers-know">
          {KNOW_ANCHORS.map((a) => (
            <button
              key={a.value}
              title={a.label}
              className={'pers-knowdot' + (rating === a.value ? ' pers-knowdot--on' : '')}
              onClick={() =>
                onPatch(role.id, {
                  rating: rating === a.value ? null : a.value,
                })
              }
            >
              {a.value}
            </button>
          ))}
        </div>
      </div>

      <div className="pers-role__sub">
        <span className="pers-role__personnel">{role.personnel}</span>
        <span className="pers-role__sortkey">sort the room by {sortKey(role)}</span>
      </div>

      {open && (
        <div className="pers-role__body">
          <section className="pers-block">
            <h4 className="pers-block__hd">The job</h4>
            <p className="pers-block__text">{role.job}</p>
          </section>

          <section className="pers-block">
            <h4 className="pers-block__hd">Ratings that do the job</h4>
            {coreRatings(role).map((r) => (
              <RatingLine key={r.key} r={r} />
            ))}
            {supportRatings(role).map((r) => (
              <RatingLine key={r.key} r={r} />
            ))}
          </section>

          {role.traps?.length > 0 && (
            <section className="pers-block">
              <h4 className="pers-block__hd">Do not pick him on these</h4>
              {role.traps.map((t) => (
                <div key={t.key} className="pers-trap">
                  <span className="pers-trap__key">{t.key}</span>
                  <p className="pers-trap__why">{t.why}</p>
                  <ConfChip id={t.conf} />
                </div>
              ))}
            </section>
          )}

          {role.archetype && (
            <section className="pers-block">
              <h4 className="pers-block__hd">EA archetype</h4>
              <div className="pers-arch">
                <strong>{role.archetype.name}</strong>
                <span className="pers-arch__keys">
                  {role.archetype.keys.join(' · ')}
                </span>
                <ConfChip id={role.archetype.conf} />
              </div>
            </section>
          )}

          <section className="pers-block">
            <h4 className="pers-block__hd">Who holds it</h4>
            <Holder h={role.holder} label="Starter" />
            <Holder h={role.backup} label="Behind him" />
          </section>

          <section className="pers-block pers-block--breaks">
            <h4 className="pers-block__hd">What breaks without it</h4>
            <p className="pers-block__text">{role.breaks}</p>
          </section>

          {role.reads?.length > 0 && (
            <section className="pers-block">
              <h4 className="pers-block__hd">Between-play reads</h4>
              {role.reads.map((r, i) => (
                <div key={i} className="pers-read">
                  <div className="pers-read__when">{r.when}</div>
                  <div className="pers-read__do">{r.do}</div>
                </div>
              ))}
            </section>
          )}

          <section className="pers-block pers-block--mine">
            <h4 className="pers-block__hd">Mine</h4>
            <div className="pers-mine">
              <input
                className="trends-input"
                placeholder="Who I actually start here"
                value={playerDraft}
                onChange={(e) => setPlayerDraft(e.target.value)}
                onBlur={() => onPatch(role.id, { player: playerDraft })}
              />
              <input
                className="trends-input"
                placeholder="My note — what I saw this guy do or fail to do"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                onBlur={() => onPatch(role.id, { note: noteDraft })}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
