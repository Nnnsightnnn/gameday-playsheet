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
  applyGamePlan,
  getCallSheets,
  saveCallSheet,
  deleteCallSheet,
  backupCurrentSheet,
  getSetupChecks,
  toggleSetupCheck,
  clearSetupChecks,
} from './lib/db'
import { SITUATIONS } from './data/situations'
import { GAME_PLANS } from './data/gameplans'
import Coordinator from './components/laminated/Coordinator'
import Sheet from './components/laminated/Sheet'
import SetupSheet from './components/laminated/SetupSheet'
import PlayBank from './components/laminated/PlayBank'
import Toast from './components/laminated/Toast'
import TweaksPanel from './components/laminated/TweaksPanel'
import FormationPlanner from './components/planner/FormationPlanner'
import CoverageLab from './components/coverage/CoverageLab'
import TrendsBoard from './components/trends/TrendsBoard'
import SkillsLab from './components/skills/SkillsLab'
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
  const checksRow = useLiveQuery(() => getSetupChecks(), [], null)
  const savedSheets = useLiveQuery(() => getCallSheets(), [], null)

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
  // Call Sheet layout: by situation (calling plays) or by formation
  // (walking the in-game favorites menu on setup day).
  const sheetMode = settings?.sheetMode ?? 'situation'
  const coverageLab = settings?.coverageLab ?? null
  const trendsCfg = settings?.trends ?? null

  const ctx = ctxRow ?? { down: 1, distance: 10, fieldSide: 'own', yardLine: 25 }
  // Per-game sheet: the Madden sheet and the CFB sheet live side by side.
  const assignments = useMemo(
    () => sheetRow?.byGame?.[game] ?? { offense: {}, defense: {} },
    [sheetRow, game],
  )

  const saveGameAssignments = (next) => {
    saveSheetAssignments({
      ...(sheetRow || {}),
      byGame: { ...(sheetRow?.byGame || {}), [game]: next },
    })
  }

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
  const sideChecks = checksRow?.byGame?.[game]?.[side] ?? {}
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
  const setSheetMode = (m) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, sheetMode: m })
  const setCoverageLab = (next) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, coverageLab: next })
  const setTrendsCfg = (next) =>
    saveSheetSettings({ ...(settings || {}), team, side, tweaks, trends: next })

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
    saveGameAssignments({
      ...assignments,
      [side]: { ...cur, [targetId]: [...list, play] },
    })
    showToast('Added to ' + (sit?.name || 'sheet'), sit?.color)
  }

  const removePlay = (situationId, playId) => {
    const cur = assignments[side] || {}
    const list = (cur[situationId] || []).filter((p) => p.playId !== playId)
    saveGameAssignments({ ...assignments, [side]: { ...cur, [situationId]: list } })
  }

  // Set/clear Kenny's own note on a sheet play. Stored on the play object in
  // sheetAssignments (myNote), separate from the plan's coaching note (note),
  // so loading a curated plan later replaces coaching notes but a cleared
  // field never leaves an empty key behind.
  const setPlayNote = (situationId, playId, note) => {
    const cur = assignments[side] || {}
    const list = (cur[situationId] || []).map((p) => {
      if (p.playId !== playId) return p
      const next = { ...p }
      if (note) next.myNote = note
      else delete next.myNote
      return next
    })
    saveGameAssignments({
      ...assignments,
      [side]: { ...cur, [situationId]: list },
    })
  }

  // Loads a curated game plan or a saved call sheet — same shape either way.
  // The current sheet is auto-backed up first so a load is always recoverable.
  const loadPlan = async (plan, side = 'both') => {
    const label = plan.game === 'cfb' ? 'CFB' : 'Madden'
    const scope =
      side === 'both' ? 'offense + defense' : `${side} only — your ${side === 'offense' ? 'defense' : 'offense'} is untouched`
    const ok = window.confirm(
      `Replace your ${label} call sheet (${scope}) with “${plan.name}”?\n\nYour current sheet is saved as an auto-backup you can reload from Tweaks.`,
    )
    if (!ok) return
    await backupCurrentSheet(plan.game, plan.name)
    await applyGamePlan(plan.game, plan, side)
    if (game !== plan.game) setGame(plan.game)
    const suffix = side === 'both' ? '' : ` (${side})`
    showToast(plan.name + suffix + ' loaded', '#2f7d4f')
  }

  // Save the current game's sheet (both sides) as a named snapshot.
  const saveCurrentSheet = async (name) => {
    const label = game === 'cfb' ? 'CFB' : 'Madden'
    const fname =
      name.trim() || `${label} sheet — ${new Date().toLocaleDateString()}`
    await saveCallSheet({
      name: fname,
      game,
      offense: assignments.offense || {},
      defense: assignments.defense || {},
    })
    showToast(`Saved “${fname}”`, '#2f7d4f')
  }

  const deleteSavedSheet = async (sheet) => {
    const ok = window.confirm(`Delete saved sheet “${sheet.name}”?`)
    if (!ok) return
    await deleteCallSheet(sheet.id)
    showToast('Sheet deleted', '#b3392f')
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
        <button
          className={'view-tab' + (view === 'trends' ? ' view-tab--on' : '')}
          onClick={() => setView('trends')}
        >
          Trends
        </button>
        <button
          className={'view-tab' + (view === 'skills' ? ' view-tab--on' : '')}
          onClick={() => setView('skills')}
        >
          Skills
        </button>
      </div>

      {/* The Coverage Lab is defense-only and Trends/Skills span both sides,
          so the offense/defense tabs would be a no-op on those views. */}
      {view !== 'coverage' && view !== 'trends' && view !== 'skills' && (
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
          <div className="sheetmode">
            <div className="sheetmode__toggle">
              <button
                className={
                  'sheetmode__btn' +
                  (sheetMode === 'situation' ? ' sheetmode__btn--on' : '')
                }
                onClick={() => setSheetMode('situation')}
              >
                By Situation
              </button>
              <button
                className={
                  'sheetmode__btn' +
                  (sheetMode === 'formation' ? ' sheetmode__btn--on' : '')
                }
                onClick={() => setSheetMode('formation')}
              >
                By Formation
              </button>
            </div>
            <span className="sheetmode__count">
              {totalCalls} {side} calls on the sheet
            </span>
          </div>
        )}
      </div>
      )}

      {view === 'coverage' ? (
        <CoverageLab lab={coverageLab} setLab={setCoverageLab} />
      ) : view === 'trends' ? (
        <TrendsBoard game={game} trendsCfg={trendsCfg} setTrendsCfg={setTrendsCfg} />
      ) : view === 'skills' ? (
        <SkillsLab game={game} />
      ) : view === 'planner' ? (
        <FormationPlanner side={side} />
      ) : (
        <>
          {sheetMode === 'formation' ? (
            <SetupSheet
              situations={situations}
              assignments={sideAssign}
              playbooks={playbooks}
              checks={sideChecks}
              gloss={tweaks.gloss}
              onToggle={(playId) => toggleSetupCheck(game, side, playId)}
              onClear={() => clearSetupChecks(game, side)}
            />
          ) : (
            <Sheet
              situations={situations}
              assignments={sideAssign}
              liveIds={liveIds}
              slotCount={slotCount}
              gloss={tweaks.gloss}
              onAdd={openDrawer}
              onRemove={removePlay}
              onNote={setPlayNote}
            />
          )}

          <div className="foot">
            {sheetMode === 'formation'
              ? 'Favorites sort newest-first in game — follow the numbered order and the menu comes out matching your sheet.'
              : 'Set the down, distance & field position — the live block lights up. Tap any slot to call from the play bank.'}
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

      <TweaksPanel
        tweaks={tweaks}
        setTweak={setTweak}
        plans={GAME_PLANS}
        onLoadPlan={loadPlan}
        game={game}
        savedSheets={savedSheets || []}
        onSaveSheet={saveCurrentSheet}
        onDeleteSheet={deleteSavedSheet}
      />

      <BrandCredit />
    </div>
  )
}

export default App
