// built by nnnsightnnn — signal from noise
// One opponent's report: the 10-second version, tale of the tape, then the
// fork (Attack their D / Defend their O), threats, and the live tells to
// chart on the first two drives.

import { useMemo, useState } from 'react';
import { TEAMS } from '../../lib/scouting/teams';
import { confidenceOf } from '../../lib/personnel/roleModel';
import { starterIndex } from '../../lib/scouting/view';
import { TaleOfTape, EdgeChart, SpeedStrip } from './charts';
import { ThreatPips } from './ScoutingRoom';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attack', label: 'Attack their D' },
  { id: 'defend', label: 'Defend their O' },
  { id: 'live', label: 'Live tells' },
];

function Conf({ id }) {
  const c = confidenceOf(id);
  return c ? <span className={'pers-conf pers-conf--' + c.id} title={c.blurb}>{c.label}</span> : null;
}

function Ratings({ p }) {
  if (!p) return null;
  return (
    <span className="scout-ratings">
      <b>{p.ovr}</b> {Object.entries(p.ratings).slice(0, 5).map(([k, v]) => `${k} ${v}`).join(' · ')}
    </span>
  );
}

function PlayerCards({ list, idx, tone, withHow = true }) {
  return (
    <div className="scout-cards">
      {list.map((t, i) => (
        <div key={i} className={'scout-card scout-card--' + tone}>
          <div className="scout-card__hd">
            <strong>{t.player}</strong>
            <span className="scout-card__pos">{idx.get(t.player)?.slot}</span>
            <Conf id={t.conf} />
          </div>
          <Ratings p={idx.get(t.player)} />
          <p>{t.why}</p>
          {withHow && t.how && <p className="scout-card__how">→ {t.how}</p>}
        </div>
      ))}
    </div>
  );
}

function Calls({ calls }) {
  return (
    <table className="scout-calls">
      <thead><tr><th>Formation</th><th>Call</th><th>Why it works here</th></tr></thead>
      <tbody>
        {calls.map((c) => (
          <tr key={c.playId}><td>{c.formation}</td><td className="scout-calls__play">{c.name}</td><td>{c.why}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

function Counters({ list }) {
  return (
    <div className="scout-counters">
      {list.map((c, i) => (
        <div key={i} className="scout-counter"><span>If {c.tell}</span><span>{c.answer}</span></div>
      ))}
    </div>
  );
}

function Threats({ facts }) {
  return (
    <div className="scout-cards">
      {facts.threats.map((t) => (
        <div key={t.name} className={'scout-card' + (t.xFactor ? ' scout-card--xf' : '')}>
          <div className="scout-card__hd">
            <strong>{t.name}</strong>
            <span className="scout-card__pos">{t.slot}</span>
            {t.xFactor && <span className="scout-xf">X-Factor</span>}
          </div>
          <Ratings p={t} />
          {t.abilities.length > 0 && (
            <p className="scout-abil">{t.abilities.map((a) => a.name).join(' · ')}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ScoutReport({ doc }) {
  const { facts, report: r } = doc;
  const [tab, setTab] = useState('overview');
  const [checked, setChecked] = useState({});
  const idx = useMemo(() => starterIndex(facts), [facts]);
  const team = TEAMS[doc.opponent];

  return (
    <article className="scout-report" style={{ '--team': team?.color }}>
      <header className="scout-report__hd">
        <div className="scout-report__crest">{doc.opponent}</div>
        <div className="scout-report__titles">
          <h2 className="scout-h1">{facts.team.name}</h2>
          <p className="scout-sub">
            Roster {facts.iteration.label} ({facts.iteration.releaseDate})
            {r && ` · scouted ${r.builtAt}`}
            {r?.stale && <span className="scout-stale"> stale: roster changed since this report</span>}
          </p>
        </div>
        {r && <ThreatPips level={r.threatLevel} />}
      </header>

      {r ? (
        <div className="scout-bl">
          <p className="scout-bl__head">{r.headline}</p>
          <p>{r.bottomLine}</p>
        </div>
      ) : (
        <div className="scout-bl scout-bl--thin">
          <p>No written report yet. The numbers below are live from the roster; run the opponent-scout skill for {doc.opponent} to get the game plan.</p>
        </div>
      )}

      <div className="trends-tabs scout-tabs">
        {TABS.filter((t) => r || t.id === 'overview' || t.id === 'attack' || t.id === 'defend').map((t) => (
          <button key={t.id} className={'trend-tab' + (tab === t.id ? ' trend-tab--on' : '')} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {r && (
            <div className="scout-keys">
              {r.keys.map((k, i) => (
                <div key={i} className="scout-key">
                  <span className="scout-key__n">{i + 1}</span>
                  <div><strong>{k.title}</strong> <Conf id={k.conf} /><p>{k.detail}</p></div>
                </div>
              ))}
            </div>
          )}
          <h3 className="scout-h3">Tale of the tape</h3>
          <TaleOfTape facts={facts} />
          {r && (
            <div className="scout-identity">
              <div><h4>Their offense</h4><p>{r.identity.offense}</p></div>
              <div><h4>Their defense</h4><p>{r.identity.defense}</p></div>
            </div>
          )}
          <h3 className="scout-h3">Threats</h3>
          <Threats facts={facts} />
          {r && <><h3 className="scout-h3">Special teams</h3><p className="scout-p">{r.specialTeams}</p></>}
        </>
      )}

      {(tab === 'attack' || tab === 'defend') && (
        <>
          {r && <p className="scout-plan">{r[tab].plan}</p>}
          <h3 className="scout-h3">{tab === 'attack' ? 'Where we win with the ball' : 'Where they can hurt us'}</h3>
          <EdgeChart list={facts.matchups[tab]} fork={tab} />
          <h3 className="scout-h3">Speed map</h3>
          <SpeedStrip facts={facts} fork={tab} />
          {r && tab === 'attack' && (
            <>
              <h3 className="scout-h3">Pick on</h3>
              <PlayerCards list={r.attack.targets} idx={idx} tone="target" />
              <h3 className="scout-h3">Stay away from</h3>
              <PlayerCards list={r.attack.avoid} idx={idx} tone="avoid" withHow={false} />
            </>
          )}
          {r && tab === 'defend' && (
            <>
              <h3 className="scout-h3">Must stop</h3>
              <PlayerCards list={r.defend.mustStop} idx={idx} tone="avoid" />
              <h3 className="scout-h3">Pressure these</h3>
              <PlayerCards list={r.defend.exploit} idx={idx} tone="target" />
            </>
          )}
          {!r && (
            <>
              <h3 className="scout-h3">Weak links</h3>
              <div className="scout-cards">
                {facts.weakLinks.filter((w) => (tab === 'attack' ? w.side === 'defense' : w.side === 'offense')).map((w) => (
                  <div key={w.unit} className="scout-card scout-card--target">
                    <div className="scout-card__hd"><strong>{w.player}</strong><span className="scout-card__pos">{w.slot}</span></div>
                    <p>{w.unit}: {w.score} vs unit {w.unitAvg}, worst {w.worstRating.key} {w.worstRating.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {r && (
            <>
              <h3 className="scout-h3">Calls</h3>
              <Calls calls={r[tab].calls} />
              <h3 className="scout-h3">When they adjust</h3>
              <Counters list={r[tab].counters} />
            </>
          )}
        </>
      )}

      {tab === 'live' && r && (
        <>
          <h3 className="scout-h3">What they will try</h3>
          <ul className="scout-list">{r.identity.expectFromUser.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <h3 className="scout-h3">Chart these on the first two drives</h3>
          <div className="scout-tells">
            {r.liveTells.map((t, i) => (
              <label key={i} className={'scout-tell' + (checked[i] ? ' scout-tell--on' : '')}>
                <input type="checkbox" checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} />
                <div>
                  <strong>{t.watch}</strong>
                  <p>{t.meaning}</p>
                  <p className="scout-card__how">→ {t.response}</p>
                </div>
              </label>
            ))}
          </div>
          <h3 className="scout-h3">Sources</h3>
          <ul className="scout-list scout-sources">
            {r.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}
          </ul>
        </>
      )}
    </article>
  );
}
