// built by nnnsightnnn — signal from noise
// Gameday Playsheet — the laminated call sheet.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  getGameContext,
  updateGameContext,
  getSheetAssignments,
  saveSheetAssignments,
  getSheetSettings,
  saveSheetSettings,
  ensureSheetAssignmentsSeeded,
  ensureFormationsSeeded,
} from './lib/db'
import { SITUATIONS } from './data/situations'
import Coordinator from './components/laminated/Coordinator'
import Sheet from './components/laminated/Sheet'
import PlayBank from './components/laminated/PlayBank'
import Toast from './components/laminated/Toast'
import TweaksPanel from './components/laminated/TweaksPanel'
import FormationPlanner from './components/planner/FormationPlanner'
import CoverageLab from './components/coverage/CoverageLab'
import BrandCredit from './BrandCredit'

const DENSITY_SLOTS = { compact: 3, regular: 4, comfy: 5 }
const PLAYBOOK_FILES = {
  madden: 'data/playbooks.json',
  cfb: 'data/playbooks-cfb27.json',
}
const DEFAULT_TWEAKS = {
  paper: ['#f4efe2', '#e7e0cf', '#d8cfb8', '#1c1a14'],
  accent: '#2f7d4f',
  density: 'regular',
  gloss: true,
}

function App() {
  // ── first-run seed for sheet assignments (writes outside liveQuery) ─────
  useEffect(() => {
    ensureSheetAssignmentsSeeded()
    ensureFormationsSeeded()
  }, [])

  // ── persisted state via Dexie ───────────────────────────────────────────
  const settings = useLiveQuery(() => getSheetSettings(), [], null)
  const ctxRow = useLiveQuery(() => getGameContext(), [], null)
  const sheetRow = useLiveQuery(() => getSheetAssignments(), [], null)

  const team = settings?.team ?? 'Sentinels'
  const side = settings?.side ?? 'offense'
  const game = settings?.game ?? 'madden'

  // ── playbook data (lazy-loaded per game, cached) ─────────────────────────
  const [playbookCache, setPlaybookCache] = useState({})
  useEffect(() => {
    if (playbookCache[game]) return
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}${PLAYBOOK_FILES[game]}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled)
          setPlaybookCache((c) => ({ ...c, [game]: data.playbooks || [] }))
      })
      .catch((err) => {
        console.error('Failed to load playbooks for ' + game, err)
        if (!cancelled) setPlaybookCache((c) => ({ ...c, [game]: [] }))
      })
    return () => {
      cancelled = true
    }
  }, [game, playbookCache])

  const playbooks = playbookCache[game] || []
  const pbLoading = !playbookCache[game]
  const tweaks = settings?.tweaks ?? DEFAULT_TWEAKS
  const view = settings?.view ?? 'sheet'
  const coverageLab = settings?.coverageLab ?? null

  const ctx = ctxRow ?? { down: 1, distance: 10, fieldSide: 'own', yardLine: 25 }
  const assignments = useMemo(
    () => sheetRow ?? { offense: {}, defense: {} },
    [sheetRow],
  )

  // ── transient UI state ──────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [targetId, setTargetId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // ── derived ─────────────────────────────────────────────────────────────
  const situations = SITUATIONS[side]
  const sideAssign = assignments[side] || {}

  const liveList = situations.filter((s) => s.match && s.match(ctx))
  const liveIds = new Set(liveList.map((s) => s.id))
  const liveText = liveList.length
    ? liveList.map((s) => s.name).join(' · ')
    : 'Set the situation'

  const slotCount = DENSITY_SLOTS[tweaks.density] || 4
  const assignedIds = (sideAssign[targetId] || []).map((p) => p.playId)
  const totalCalls = situations.reduce(
    (n, s) => n + (sideAssign[s.id]?.length || 0),
    0,
  )

  // ── handlers ────────────────────────────────────────────────────────────
  const setTeam = (t) =>
    saveSheetSettings({ ...(settings || {}), team: t, side, tweaks })
  const setSide = (s) =>
    saveSheetSettings({ ...(settings || {}), team, side: s, tweaks })
  const setGame = (g) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, game: g })
  const setTweak = (key, val) =>
    saveSheetSettings({
      ...(settings || {}),
      team,
      side,
      tweaks: { ...tweaks, [key]: val },
    })
  const setCtx = (patch) => updateGameContext(patch)
  const setView = (v) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, view: v })
  const setCoverageLab = (next) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, coverageLab: next })

  const openDrawer = (situationId) => {
    setTargetId(situationId || situations[0].id)
    setDrawerOpen(true)
  }
  const closeDrawer = () => setDrawerOpen(false)

  const showToast = (msg, color) => {
    setToast({ msg, color })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1900)
  }

  const addPlay = (play) => {
    const sit = situations.find((s) => s.id === targetId)
    const cur = assignments[side] || {}
    const list = cur[targetId] || []
    if (list.some((p) => p.playId === play.playId)) return
    const next = {
      ...assignments,
      [side]: { ...cur, [targetId]: [...list, play] },
    }
    saveSheetAssignments(next)
    showToast('Added to ' + (sit?.name || 'sheet'), sit?.color)
  }

  const removePlay = (situationId, playId) => {
    const cur = assignments[side] || {}
    const list = (cur[situationId] || []).filter((p) => p.playId !== playId)
    const next = { ...assignments, [side]: { ...cur, [situationId]: list } }
    saveSheetAssignments(next)
  }

  // CSS custom properties for live theming
  const rootStyle = {
    '--paper': tweaks.paper[0],
    '--paper-edge': tweaks.paper[1],
    '--paper-line': tweaks.paper[2],
    '--ink': tweaks.paper[3],
    '--accent': tweaks.accent,
  }

  // Wait for Dexie to hydrate to avoid flicker on first paint
  if (!settings || !ctxRow || !sheetRow) {
    return (
      <div className="stage" style={rootStyle}>
        <div className="foot" style={{ marginTop: 80 }}>
          Loading sheet…
        </div>
      </div>
    )
  }

  return (
    <div className="stage" style={rootStyle}>
      <Coordinator
        team={team}
        setTeam={setTeam}
        ctx={ctx}
        setCtx={setCtx}
        liveSituations={liveText}
      />

      <div className="viewswitch">
        <button
          className={'view-tab' + (view === 'sheet' ? ' view-tab--on' : '')}
          onClick={() => setView('sheet')}
        >
          Call Sheet
        </button>
        <button
          className={'view-tab' + (view === 'planner' ? ' view-tab--on' : '')}
          onClick={() => setView('planner')}
        >
          Formation Planner
        </button>
        <button
          className={'view-tab' + (view === 'coverage' ? ' view-tab--on' : '')}
          onClick={() => setView('coverage')}
        >
          Coverage Lab
        </button>
      </div>

      {/* The Coverage Lab is defense-only by definition, so the side tabs
          would be a no-op there. */}
      {view !== 'coverage' && (
      <div className="sides">
        <button
          className={
            'side-tab' +
            (side === 'offense' ? ' side-tab--on side-tab--off-on' : '')
          }
          onClick={() => setSide('offense')}
        >
          Offense
        </button>
        <button
          className={
            'side-tab' +
            (side === 'defense' ? ' side-tab--on side-tab--def-on' : '')
          }
          onClick={() => setSide('defense')}
        >
          Defense
        </button>
        {view === 'sheet' && (
          <div
            style={{
              marginLeft: 'auto',
              alignSelf: 'flex-end',
              paddingBottom: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: 1,
              color: '#8a866f',
              transform: 'translateY(-2px)',
              whiteSpace: 'nowrap',
            }}
          >
            {totalCalls} {side} calls on the sheet
          </div>
        )}
      </div>
      )}

      {view === 'coverage' ? (
        <CoverageLab lab={coverageLab} setLab={setCoverageLab} />
      ) : view === 'planner' ? (
        <FormationPlanner side={side} />
      ) : (
        <>
          <Sheet
            situations={situations}
            assignments={sideAssign}
            liveIds={liveIds}
            slotCount={slotCount}
            gloss={tweaks.gloss}
            onAdd={openDrawer}
            onRemove={removePlay}
          />

          <div className="foot">
            Set the down, distance &amp; field position — the live block lights up.
            Tap any slot to call from the play bank.
          </div>

          <PlayBank
            key={side + '-' + game}
            open={drawerOpen}
            side={side}
            game={game}
            setGame={setGame}
            playbooks={playbooks}
            loading={pbLoading}
            situations={situations}
            targetId={targetId}
            setTargetId={setTargetId}
            assignedIds={assignedIds}
            onAdd={addPlay}
            onClose={closeDrawer}
          />
        </>
      )}

      <Toast toast={toast} />

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />

      <BrandCredit />
    </div>
  )
}

export default App
