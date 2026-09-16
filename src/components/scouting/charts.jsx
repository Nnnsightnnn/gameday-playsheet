// built by nnnsightnnn — signal from noise
// Scouting Room charts: tale of the tape, matchup edges, speed strip.
// Falcons are always red (#e05a52), the opponent always blue (#4a90e2);
// the pair passes the dataviz CVD validator on the dark stage. Every mark
// carries a text label too, so identity is never color alone.

import { useState } from 'react';
import { tapeRows, rankTone, edgeRows, edgeDomain, speedRows, speedDomain } from '../../lib/scouting/view';

function Tip({ tip }) {
  if (!tip) return null;
  return (
    <div className="scout-tip" style={{ left: tip.x, top: tip.y }}>
      {tip.lines.map((l, i) => (
        <div key={i} className={i === 0 ? 'scout-tip__hd' : ''}>{l}</div>
      ))}
    </div>
  );
}

function useTip() {
  const [tip, setTip] = useState(null);
  const on = (lines) => (e) => {
    const box = e.currentTarget.closest('.scout-chart').getBoundingClientRect();
    setTip({ x: e.clientX - box.left + 12, y: e.clientY - box.top + 12, lines });
  };
  return [tip, on, () => setTip(null)];
}

export function Legend({ opp }) {
  return (
    <div className="scout-legend">
      <span><i className="scout-sw scout-sw--us" />Falcons</span>
      <span><i className="scout-sw scout-sw--them" />{opp}</span>
    </div>
  );
}

export function TaleOfTape({ facts }) {
  const rows = tapeRows(facts);
  const [tip, on, off] = useTip();
  const lo = 60;
  const hi = 95;
  const pct = (v) => `${Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100))}%`;
  return (
    <div className="scout-chart scout-tape" onMouseLeave={off}>
      <Legend opp={facts.team.name.split(' ').pop()} />
      {rows.map((r) => (
        <div
          key={r.key}
          className="scout-tape__row"
          onMouseMove={on([r.label, `Falcons ${r.us}  ·  ${facts.team.abbr} ${r.them}`, `${facts.team.abbr} ranks ${r.rank} of 32`])}
        >
          <div className="scout-tape__label">{r.label}</div>
          <div className="scout-tape__bars">
            <div className="scout-bar scout-bar--us" style={{ width: pct(r.us) }} />
            <div className="scout-bar scout-bar--them" style={{ width: pct(r.them) }} />
          </div>
          <div className="scout-tape__vals">
            <span className={'scout-diff ' + (r.diff > 0 ? 'scout-diff--us' : r.diff < 0 ? 'scout-diff--them' : '')}>
              {r.diff > 0 ? '+' : ''}{r.diff}
            </span>
            <span className={'scout-rank scout-rank--' + rankTone(r.rank)}>#{r.rank}</span>
          </div>
        </div>
      ))}
      <div className="scout-axisnote">Unit score (job-weighted ratings), bars start at {lo}. Rank is the opponent's, league-wide.</div>
      <Tip tip={tip} />
    </div>
  );
}

export function EdgeChart({ list, fork }) {
  const rows = edgeRows(list);
  const d = edgeDomain(rows);
  const [tip, on, off] = useTip();
  const w = (v) => `${(Math.abs(v) / d) * 50}%`;
  return (
    <div className="scout-chart scout-edges" onMouseLeave={off}>
      <div className="scout-edges__scale">
        <span>their edge</span><span>even</span><span>Falcons edge</span>
      </div>
      {rows.map((m, i) => (
        <div
          key={i}
          className="scout-edge"
          onMouseMove={on([
            m.label,
            `${m.falcons.name} ${m.falcons.score}`,
            `${m.opponent.name} ${m.opponent.score}`,
            m.kind === 'run' ? 'Unit vs unit' : `Speed ${m.speedDelta > 0 ? '+' : ''}${m.speedDelta} for ATL`,
          ])}
        >
          <div className="scout-edge__who">
            <strong>{m.label}</strong>
            <span>{fork === 'attack' ? m.falcons.name : m.falcons.name} vs {m.opponent.name}</span>
          </div>
          <div className="scout-edge__track">
            <div className="scout-edge__mid" />
            <div
              className={'scout-edge__bar ' + (m.edge >= 0 ? 'scout-edge__bar--us' : 'scout-edge__bar--them')}
              style={m.edge >= 0 ? { left: '50%', width: w(m.edge) } : { right: '50%', width: w(m.edge) }}
            />
          </div>
          <div className={'scout-edge__val ' + (m.edge >= 0 ? 'scout-diff--us' : 'scout-diff--them')}>
            {m.edge > 0 ? '+' : ''}{m.edge}
          </div>
        </div>
      ))}
      <Tip tip={tip} />
    </div>
  );
}

export function SpeedStrip({ facts, fork }) {
  const data = speedRows(facts, fork);
  const [lo, hi] = speedDomain(data);
  const [tip, on, off] = useTip();
  const x = (v) => `${((v - lo) / (hi - lo)) * 100}%`;
  const ticks = [];
  for (let t = lo; t <= hi; t += 5) ticks.push(t);
  const lane = (rows, cls, label) => (
    <div className="scout-speed__lane">
      <div className="scout-speed__lab">{label}</div>
      <div className="scout-speed__track">
        {ticks.map((t) => <div key={t} className="scout-speed__tick" style={{ left: x(t) }} />)}
        {rows.map((p, i) => (
          <div
            key={p.name}
            className={'scout-dot ' + cls}
            style={{ left: x(p.SPD), top: `${18 + (i % 3) * 14}px` }}
            onMouseMove={on([p.name, `${p.slot}  ·  SPD ${p.SPD}`])}
          >
            <span className="scout-dot__lab">{p.slot}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="scout-chart scout-speed" onMouseLeave={off}>
      {fork === 'attack' ? lane(data.us, 'scout-dot--us', 'Our targets') : lane(data.them, 'scout-dot--them', 'Their skill')}
      {fork === 'attack' ? lane(data.them, 'scout-dot--them', 'Their defenders') : lane(data.us, 'scout-dot--us', 'Our coverage')}
      <div className="scout-speed__axis">
        {ticks.map((t) => <span key={t} style={{ left: x(t) }}>{t}</span>)}
      </div>
      <Tip tip={tip} />
    </div>
  );
}
