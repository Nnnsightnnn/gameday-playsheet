// Top-level Formation Planner: both teams on one field, the ball at its hash,
// real-time legality for the active side, and live formation discovery.

import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getFormations, saveFormation, deleteFormation } from '../../lib/db';
import { validateFormation } from '../../lib/field/rulesEngine';
import { classifyFormation } from '../../lib/field/featureExtraction';
import { matchLibrary } from '../../lib/field/matchingEngine';
import { normalizePlayers } from '../../lib/field/formationFactory';
import { HASH_LEFT_X, HASH_RIGHT_X } from '../../lib/field/fieldConfig';
import { useFormationEditor } from '../../hooks/useFormationEditor';
import FieldBoard from './FieldBoard';
import ValidationPanel from './ValidationPanel';
import PositionPicker from './PositionPicker';
import DiscoveryPanel from './DiscoveryPanel';
import FormationLibraryDrawer from './FormationLibraryDrawer';

const BALL_X = { left: HASH_LEFT_X, middle: 0.5, right: HASH_RIGHT_X };

// Snap a raw x to the nearest of the three legal ball spots.
function nearestSpot(x) {
  let best = 'middle';
  let bestD = Infinity;
  for (const [spot, val] of Object.entries(BALL_X)) {
    const d = Math.abs(x - val);
    if (d < bestD) {
      bestD = d;
      best = spot;
    }
  }
  return best;
}

export default function FormationPlanner({ side }) {
  // One editor per side so both stay live on the field at once.
  const offense = useFormationEditor('offense');
  const defense = useFormationEditor('defense');
  const editorFor = (team) => (team === 'defense' ? defense : offense);
  const active = editorFor(side);

  const [ruleset, setRuleset] = useState('nfl');
  const [ballSpot, setBallSpot] = useState('middle');
  const [snap, setSnap] = useState(true);
  const [name, setName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [library, setLibrary] = useState([]);

  const formations = useLiveQuery(() => getFormations(), [], []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/formation-library.json`)
      .then((r) => r.json())
      .then((d) => !cancelled && setLibrary(d.formations || []))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const allPlayers = useMemo(
    () => [...offense.players, ...defense.players],
    [offense.players, defense.players],
  );
  const teamById = useMemo(() => {
    const m = {};
    for (const p of allPlayers) m[p.id] = p.team;
    return m;
  }, [allPlayers]);

  const valOff = useMemo(
    () => validateFormation(offense.players, { ruleset, ballSpot, side: 'offense' }),
    [offense.players, ruleset, ballSpot],
  );
  const valDef = useMemo(
    () => validateFormation(defense.players, { ruleset, ballSpot, side: 'defense' }),
    [defense.players, ruleset, ballSpot],
  );
  const activeValidation = side === 'defense' ? valDef : valOff;
  const byPlayer = useMemo(
    () => ({ ...valOff.byPlayer, ...valDef.byPlayer }),
    [valOff, valDef],
  );

  // Live formation discovery for the active side.
  const features = useMemo(
    () => classifyFormation(active.players, side, BALL_X[ballSpot]),
    [active.players, side, ballSpot],
  );
  const match = useMemo(
    () => matchLibrary(features, library, side),
    [features, library, side],
  );

  const selectedId = offense.selectedId || defense.selectedId;
  const selected = allPlayers.find((p) => p.id === selectedId) || null;

  const handleMove = (id, point) => {
    if (id === '__ball__') {
      setBallSpot(nearestSpot(point.x));
      return;
    }
    editorFor(teamById[id]).move(id, point);
  };

  // Tap a token: select, swap with the selected same-team token, or deselect.
  const handleTap = (id) => {
    if (id === '__ball__') return;
    const team = teamById[id];
    const ed = editorFor(team);
    const other = editorFor(team === 'offense' ? 'defense' : 'offense');
    if (other.selectedId) other.select(null);
    if (ed.selectedId && ed.selectedId !== id) ed.swap(ed.selectedId, id);
    else if (ed.selectedId === id) ed.select(null);
    else ed.select(id);
  };

  const handleSave = async () => {
    const fname =
      name.trim() || `${features.name} — ${side}`;
    await saveFormation({
      id: `fm_${Math.random().toString(36).slice(2, 10)}`,
      name: fname,
      side,
      ruleset,
      ballSpot,
      players: active.players,
      derived: features,
      linkedPlayIds: [],
    });
    setName('');
  };

  const handleLoad = (f) => {
    editorFor(f.side).load(normalizePlayers(f.players, f.side));
    if (f.ruleset) setRuleset(f.ruleset);
    if (f.ballSpot) setBallSpot(f.ballSpot);
    setDrawerOpen(false);
  };

  return (
    <div className="planner">
      <div className="planner__bar">
        <div className="seg">
          <button
            className={'seg__btn' + (ruleset === 'nfl' ? ' is-on' : '')}
            onClick={() => setRuleset('nfl')}
          >
            NFL
          </button>
          <button
            className={'seg__btn' + (ruleset === 'ncaa' ? ' is-on' : '')}
            onClick={() => setRuleset('ncaa')}
          >
            NCAA
          </button>
        </div>

        <div className="seg">
          {['left', 'middle', 'right'].map((s) => (
            <button
              key={s}
              className={'seg__btn' + (ballSpot === s ? ' is-on' : '')}
              onClick={() => setBallSpot(s)}
              title={`Ball on ${s} hash`}
            >
              {s === 'middle' ? 'Mid hash' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <button
          className={'plbtn' + (snap ? ' is-on' : '')}
          onClick={() => setSnap((v) => !v)}
        >
          Snap {snap ? 'On' : 'Off'}
        </button>

        <button className="plbtn" onClick={() => active.reset(side)}>
          Reset {side}
        </button>

        <div className="planner__save">
          <input
            className="planner__name"
            placeholder={`Name this ${side} formation…`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="plbtn plbtn--primary" onClick={handleSave}>
            Save
          </button>
          <button className="plbtn" onClick={() => setDrawerOpen(true)}>
            Load
          </button>
        </div>
      </div>

      <div className="planner__main">
        <div className="planner__board">
          <FieldBoard
            players={allPlayers}
            activeTeam={side}
            snap={snap}
            selectedId={selectedId}
            byPlayer={byPlayer}
            ballSpot={ballSpot}
            onMove={handleMove}
            onTap={handleTap}
          />
          <p className="planner__hint">
            Editing <b>{side}</b> · drag the ball to set the hash · tap two
            teammates to swap · tap one to edit position &amp; number
          </p>
        </div>

        <div className="planner__side">
          <DiscoveryPanel side={side} features={features} match={match} />
          <ValidationPanel
            validation={activeValidation}
            onHighlight={(ids) => ids?.length && active.select(ids[0])}
          />
          {selected && (
            <PositionPicker
              player={selected}
              side={selected.team}
              onSetPos={editorFor(selected.team).setPos}
              onSetJersey={editorFor(selected.team).setJersey}
              onClose={() => editorFor(selected.team).select(null)}
            />
          )}
        </div>
      </div>

      <FormationLibraryDrawer
        open={drawerOpen}
        side={side}
        formations={formations}
        onLoad={handleLoad}
        onDelete={deleteFormation}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
