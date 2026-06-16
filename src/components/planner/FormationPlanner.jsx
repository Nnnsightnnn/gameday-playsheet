// Top-level Formation Planner view: board + rules + save/load.

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  getFormations,
  saveFormation,
  deleteFormation,
} from '../../lib/db';
import { validateFormation } from '../../lib/field/rulesEngine';
import { useFormationEditor } from '../../hooks/useFormationEditor';
import FieldBoard from './FieldBoard';
import ValidationPanel from './ValidationPanel';
import PositionPicker from './PositionPicker';
import FormationLibraryDrawer from './FormationLibraryDrawer';

export default function FormationPlanner({ side }) {
  // One editor per side so toggling offense/defense preserves work in progress.
  const offense = useFormationEditor('offense');
  const defense = useFormationEditor('defense');
  const editor = side === 'defense' ? defense : offense;

  const [ruleset, setRuleset] = useState('nfl');
  const [ballSpot, setBallSpot] = useState('middle');
  const [snap, setSnap] = useState(true);
  const [name, setName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const formations = useLiveQuery(() => getFormations(), [], []);

  const validation = useMemo(
    () => validateFormation(editor.players, { side, ruleset, ballSpot }),
    [editor.players, side, ruleset, ballSpot],
  );

  const selected = editor.players.find((p) => p.id === editor.selectedId) || null;

  // Tap a token: select, swap with the already-selected one, or deselect.
  const handleTap = (id) => {
    if (editor.selectedId && editor.selectedId !== id) {
      editor.swap(editor.selectedId, id);
    } else if (editor.selectedId === id) {
      editor.select(null);
    } else {
      editor.select(id);
    }
  };

  const handleSave = async () => {
    const fname = name.trim() || `${side === 'defense' ? 'Defense' : 'Offense'} ${new Date().toLocaleTimeString()}`;
    await saveFormation({
      id: `fm_${Math.random().toString(36).slice(2, 10)}`,
      name: fname,
      side,
      ruleset,
      ballSpot,
      players: editor.players,
      derived: null,
      linkedPlayIds: [],
    });
    setName('');
  };

  const handleLoad = (f) => {
    editor.load(f.players);
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
              {s === 'middle' ? 'Mid' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <button
          className={'plbtn' + (snap ? ' is-on' : '')}
          onClick={() => setSnap((v) => !v)}
        >
          Snap {snap ? 'On' : 'Off'}
        </button>

        <button className="plbtn" onClick={() => editor.reset(side)}>
          Reset
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
            players={editor.players}
            side={side}
            snap={snap}
            selectedId={editor.selectedId}
            byPlayer={validation.byPlayer}
            onMove={editor.move}
            onTap={handleTap}
          />
          <p className="planner__hint">
            Drag to move · tap two players to swap spots · tap one to edit
            position &amp; number
          </p>
        </div>

        <div className="planner__side">
          <ValidationPanel
            validation={validation}
            onHighlight={(ids) => ids?.length && editor.select(ids[0])}
          />
          {selected && (
            <PositionPicker
              player={selected}
              side={side}
              onSetPos={editor.setPos}
              onSetJersey={editor.setJersey}
              onClose={() => editor.select(null)}
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
