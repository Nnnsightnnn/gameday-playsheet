import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  SHADING_OPTIONS,
  SAFETY_DEPTH_OPTIONS,
  SAFETY_WIDTH_OPTIONS,
  CB_ALIGNMENT_OPTIONS,
  MAN_ALIGN_OPTIONS,
  DL_SHIFT_OPTIONS,
  LB_SHIFT_OPTIONS,
  DL_STUNT_OPTIONS,
  ZONE_DROP_OPTIONS,
  RPO_KEY_OPTIONS,
  OPTION_KEY_OPTIONS,
  COVERAGE_SHELL_OPTIONS,
  COMMON_FORMATIONS,
  COMMON_ROUTES,
  getDefaultAdjustments,
} from '../data/defensiveConstants'
import { updateDefensiveAdjustments } from '../lib/db'

// Button group component for single-select options
function OptionGroup({ label, options, value, onChange, colorCoded = false, compact = false }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} rounded font-medium transition-all ${
              value === opt.id
                ? colorCoded && opt.color
                  ? `${opt.color} text-white ring-2 ring-white`
                  : 'bg-green-600 text-white ring-2 ring-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
            title={opt.description}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Multi-select tag group for formations/routes
function TagGroup({ label, options, selected, onChange }) {
  const toggleTag = (tag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-1.5 py-0.5 rounded text-xs transition-all ${
              selected.includes(tag)
                ? 'bg-red-600 text-white ring-1 ring-red-400'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

// Collapsible section component
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-gray-700 pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left text-xs text-gray-400 font-medium hover:text-gray-300"
      >
        {title}
        <span className="text-gray-500">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  )
}

function AdjustmentEditor({ play, onClose }) {
  // Initialize state from existing adjustments or defaults
  const defaults = getDefaultAdjustments()
  const existing = play.defensiveAdjustments || {}

  const [shading, setShading] = useState(existing.shading || null)
  const [coaching, setCoaching] = useState({
    ...defaults.coaching,
    ...existing.coaching,
  })
  const [goodAgainst, setGoodAgainst] = useState({
    formations: existing.goodAgainst?.formations || [],
    routes: existing.goodAgainst?.routes || [],
  })
  const [quickTip, setQuickTip] = useState(existing.quickTip || '')

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleCoachingChange = (key, value) => {
    setCoaching(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    const adjustments = {
      shading,
      coaching,
      goodAgainst,
      quickTip: quickTip.trim(),
    }
    await updateDefensiveAdjustments(play.id, adjustments)
    onClose()
  }

  const handleClear = () => {
    setShading(null)
    setCoaching(defaults.coaching)
    setGoodAgainst({ formations: [], routes: [] })
    setQuickTip('')
  }

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl p-4 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-white">Defensive Adjustments</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>

        {/* Play Name */}
        <div className="text-sm text-gray-400 mb-3 pb-2 border-b border-gray-700">
          {play.playName}
        </div>

        {/* Quick Tip Input */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 block mb-1">Quick Tip</label>
          <input
            type="text"
            value={quickTip}
            onChange={(e) => setQuickTip(e.target.value)}
            placeholder="e.g., Shade CB1 outside vs trips"
            className="w-full px-2 py-1.5 bg-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Coverage Shading */}
        <div className="mb-3">
          <OptionGroup
            label="Coverage Shading"
            options={SHADING_OPTIONS}
            value={shading}
            onChange={setShading}
            colorCoded
          />
        </div>

        {/* DB/Coverage Settings */}
        <Section title="DB / Coverage" defaultOpen={true}>
          <OptionGroup
            label="CB Alignment"
            options={CB_ALIGNMENT_OPTIONS}
            value={coaching.cbAlignment}
            onChange={(v) => handleCoachingChange('cbAlignment', v || 'default')}
            compact
          />
          <OptionGroup
            label="Man Align"
            options={MAN_ALIGN_OPTIONS}
            value={coaching.manAlign}
            onChange={(v) => handleCoachingChange('manAlign', v || 'default')}
            compact
          />
          <div className="grid grid-cols-2 gap-2">
            <OptionGroup
              label="Safety Depth"
              options={SAFETY_DEPTH_OPTIONS}
              value={coaching.safetyDepth}
              onChange={(v) => handleCoachingChange('safetyDepth', v || 'default')}
              compact
            />
            <OptionGroup
              label="Safety Width"
              options={SAFETY_WIDTH_OPTIONS}
              value={coaching.safetyWidth}
              onChange={(v) => handleCoachingChange('safetyWidth', v || 'normal')}
              compact
            />
          </div>
          <OptionGroup
            label="Coverage Shell (Disguise)"
            options={COVERAGE_SHELL_OPTIONS}
            value={coaching.coverageShell}
            onChange={(v) => handleCoachingChange('coverageShell', v || 'none')}
            compact
          />
        </Section>

        {/* Front/Pass Rush Settings */}
        <Section title="D-Line / Linebackers" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            <OptionGroup
              label="DL Shift"
              options={DL_SHIFT_OPTIONS}
              value={coaching.dlShift}
              onChange={(v) => handleCoachingChange('dlShift', v || 'default')}
              compact
            />
            <OptionGroup
              label="LB Shift"
              options={LB_SHIFT_OPTIONS}
              value={coaching.lbShift}
              onChange={(v) => handleCoachingChange('lbShift', v || 'default')}
              compact
            />
          </div>
          <OptionGroup
            label="DL Stunt"
            options={DL_STUNT_OPTIONS}
            value={coaching.dlStunt}
            onChange={(v) => handleCoachingChange('dlStunt', v || 'none')}
            compact
          />
          <OptionGroup
            label="Zone Drop"
            options={ZONE_DROP_OPTIONS}
            value={coaching.zoneDrop}
            onChange={(v) => handleCoachingChange('zoneDrop', v || '0')}
            compact
          />
        </Section>

        {/* Option/RPO Settings */}
        <Section title="Option / RPO Keys" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            <OptionGroup
              label="RPO Key"
              options={RPO_KEY_OPTIONS}
              value={coaching.rpoKey}
              onChange={(v) => handleCoachingChange('rpoKey', v || 'conservative')}
              compact
            />
            <OptionGroup
              label="Option Key"
              options={OPTION_KEY_OPTIONS}
              value={coaching.optionKey}
              onChange={(v) => handleCoachingChange('optionKey', v || 'qb')}
              compact
            />
          </div>
        </Section>

        {/* Good Against */}
        <Section title="Good Against" defaultOpen={false}>
          <TagGroup
            label="Formations"
            options={COMMON_FORMATIONS}
            selected={goodAgainst.formations}
            onChange={(v) => setGoodAgainst(prev => ({ ...prev, formations: v }))}
          />
          <TagGroup
            label="Route Concepts"
            options={COMMON_ROUTES}
            selected={goodAgainst.routes}
            onChange={(v) => setGoodAgainst(prev => ({ ...prev, routes: v }))}
          />
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 mt-3 border-t border-gray-700">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
          >
            Clear All
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default AdjustmentEditor
