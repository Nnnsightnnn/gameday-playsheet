// built by nnnsightnnn — signal from noise
// Scouting Room — an advance scout for every opponent the Falcons can draw.
//
// Data: public/data/scouting/index.json (the board) and <ABBR>.json per team.
// Each team file has a script-built `facts` block (roster ratings, unit
// ranks, matchup edges vs the Falcons) and an agent-written `report` block
// (attack plan, defense plan, live tells) produced by the opponent-scout
// skill. A team with facts but no report still renders its charts.

import { useEffect, useMemo, useState } from 'react';
import { TEAMS } from '../../lib/scouting/teams';
import { THREAT_LABELS, rankTone } from '../../lib/scouting/view';
import ScoutReport from './ScoutReport';

const BASE = `${import.meta.env.BASE_URL}data/scouting/`;
const DIVS = ['NFC South', 'NFC North', 'NFC East', 'NFC West', 'AFC North', 'AFC South', 'AFC East', 'AFC West'];

export function ThreatPips({ level }) {
  if (!level) return <span className="scout-pips scout-pips--none">facts only</span>;
  return (
    <span className="scout-pips" title={THREAT_LABELS[level]} aria-label={`Threat ${level} of 5, ${THREAT_LABELS[level]}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={'scout-pip' + (i <= level ? ' scout-pip--on' : '')} />
      ))}
      <span className="scout-pips__lab">{THREAT_LABELS[level]}</span>
    </span>
  );
}

export default function ScoutingRoom() {
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  const [abbr, setAbbr] = useState(null);
  const [doc, setDoc] = useState(null);
  const [sort, setSort] = useState('division');

  useEffect(() => {
    let dead = false;
    fetch(BASE + 'index.json')
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => !dead && setIndex(j))
      .catch(() => !dead && setError('Could not load the scouting board.'));
    return () => { dead = true; };
  }, []);

  useEffect(() => {
    if (!abbr) return undefined;
    let dead = false;
    fetch(BASE + abbr + '.json')
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => !dead && setDoc(j))
      .catch(() => !dead && setError(`Could not load the ${abbr} report.`));
    return () => { dead = true; };
  }, [abbr]);

  const groups = useMemo(() => {
    if (!index) return [];
    const rows = index.teams;
    if (sort === 'threat') {
      const sorted = [...rows].sort((a, b) => (b.threatLevel || 0) - (a.threatLevel || 0) || a.name.localeCompare(b.name));
      return [{ name: 'By threat', rows: sorted }];
    }
    return DIVS.map((d) => ({ name: d, rows: rows.filter((t) => TEAMS[t.abbr]?.div === d) })).filter((g) => g.rows.length);
  }, [index, sort]);

  if (error) return <div className="trends-empty">{error}</div>;
  if (!index) return <div className="trends-empty">Loading the scouting board…</div>;

  if (abbr) {
    return (
      <div className="scout">
        <button className="trend-chip scout-back" onClick={() => { setAbbr(null); setDoc(null); }}>
          ← All opponents
        </button>
        {doc && doc.opponent === abbr ? <ScoutReport doc={doc} /> : <div className="trends-empty">Loading {abbr}…</div>}
      </div>
    );
  }

  const done = index.teams.filter((t) => t.hasReport).length;
  return (
    <div className="scout">
      <div className="scout-board__hd">
        <div>
          <h2 className="scout-h1">Scouting Room</h2>
          <p className="scout-sub">
            {done} of {index.teams.length} opponents scouted · roster {index.teams[0]?.iteration} · board updated {index.updatedAt}
          </p>
        </div>
        <div className="trends-tabs">
          {[['division', 'By division'], ['threat', 'By threat']].map(([id, label]) => (
            <button key={id} className={'trend-chip' + (sort === id ? ' trend-chip--on' : '')} onClick={() => setSort(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {groups.map((g) => (
        <section key={g.name} className="scout-group">
          <h3 className="scout-group__hd">{g.name}</h3>
          <div className="scout-grid">
            {g.rows.map((t) => (
              <button
                key={t.abbr}
                className={'scout-tile' + (t.hasReport ? '' : ' scout-tile--thin')}
                style={{ '--team': TEAMS[t.abbr]?.color }}
                onClick={() => setAbbr(t.abbr)}
              >
                <div className="scout-tile__hd">
                  <span className="scout-tile__abbr">{t.abbr}</span>
                  <span className="scout-tile__name">{t.name}</span>
                  {t.stale && <span className="scout-stale">stale</span>}
                </div>
                <ThreatPips level={t.threatLevel} />
                {t.headline && <p className="scout-tile__line">{t.headline}</p>}
                <div className="scout-tile__ranks">
                  <span className={'scout-rank scout-rank--' + rankTone(t.ranks.offense)}>OFF #{t.ranks.offense}</span>
                  <span className={'scout-rank scout-rank--' + rankTone(t.ranks.defense)}>DEF #{t.ranks.defense}</span>
                  {t.xFactors.length > 0 && <span className="scout-xf">X {t.xFactors.length}</span>}
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
