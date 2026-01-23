import {
  SHADING_OPTIONS,
  SAFETY_DEPTH_OPTIONS,
  SAFETY_WIDTH_OPTIONS,
  CB_ALIGNMENT_OPTIONS,
  DL_SHIFT_OPTIONS,
  LB_SHIFT_OPTIONS,
  DL_STUNT_OPTIONS,
  COVERAGE_SHELL_OPTIONS,
} from '../data/defensiveConstants'

// Get shading option by ID
function getShadingOption(id) {
  return SHADING_OPTIONS.find(opt => opt.id === id)
}

// Get option label by ID from options array
function getOptionLabel(options, id) {
  const opt = options.find(o => o.id === id)
  return opt ? opt.label : id
}

// Compact inline display for quickTip (used in collapsed cards)
export function QuickTipBadge({ quickTip }) {
  if (!quickTip) return null

  return (
    <div className="flex items-start gap-1 mt-1 text-xs text-amber-300 bg-amber-900/30 px-2 py-1 rounded">
      <span className="shrink-0">💡</span>
      <span className="truncate">{quickTip}</span>
    </div>
  )
}

// Full adjustment panel for expanded view
function DefensiveAdjustmentsPanel({ adjustments }) {
  if (!adjustments) return null

  const { shading, coaching, goodAgainst, quickTip } = adjustments
  const shadingOpt = getShadingOption(shading)

  // Check for non-default coaching settings
  const hasDBChanges = coaching && (
    coaching.safetyDepth !== 'default' ||
    coaching.safetyWidth !== 'normal' ||
    coaching.cbAlignment !== 'default' ||
    (coaching.coverageShell && coaching.coverageShell !== 'none')
  )

  const hasFrontChanges = coaching && (
    coaching.dlShift !== 'default' ||
    coaching.lbShift !== 'default' ||
    (coaching.dlStunt && coaching.dlStunt !== 'none') ||
    (coaching.zoneDrop && coaching.zoneDrop !== '0')
  )

  const hasRPOChanges = coaching && (
    coaching.rpoKey !== 'conservative' ||
    (coaching.optionKey && coaching.optionKey !== 'qb')
  )

  const hasGoodAgainst = goodAgainst && (
    (goodAgainst.formations?.length > 0) ||
    (goodAgainst.routes?.length > 0)
  )

  const hasAnyContent = shading || quickTip || hasDBChanges || hasFrontChanges || hasRPOChanges || hasGoodAgainst

  if (!hasAnyContent) return null

  return (
    <div className="space-y-2 text-sm">
      {/* Quick Tip */}
      {quickTip && (
        <div className="flex items-start gap-2 bg-amber-900/30 px-2 py-1.5 rounded">
          <span className="shrink-0">💡</span>
          <span className="text-amber-200">{quickTip}</span>
        </div>
      )}

      {/* Shading */}
      {shading && shadingOpt && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Shading:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${shadingOpt.color}`}>
            {shadingOpt.label}
          </span>
          <span className="text-gray-500 text-xs">({shadingOpt.description})</span>
        </div>
      )}

      {/* DB/Coverage Settings */}
      {hasDBChanges && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-300 text-xs">
          {coaching.cbAlignment !== 'default' && (
            <span>
              <span className="text-gray-500">CB:</span>{' '}
              {getOptionLabel(CB_ALIGNMENT_OPTIONS, coaching.cbAlignment)}
            </span>
          )}
          {coaching.safetyDepth !== 'default' && (
            <span>
              <span className="text-gray-500">Safety:</span>{' '}
              {getOptionLabel(SAFETY_DEPTH_OPTIONS, coaching.safetyDepth)}
            </span>
          )}
          {coaching.safetyWidth !== 'normal' && (
            <span>
              <span className="text-gray-500">Width:</span>{' '}
              {getOptionLabel(SAFETY_WIDTH_OPTIONS, coaching.safetyWidth)}
            </span>
          )}
          {coaching.coverageShell && coaching.coverageShell !== 'none' && (
            <span>
              <span className="text-gray-500">Shell:</span>{' '}
              {getOptionLabel(COVERAGE_SHELL_OPTIONS, coaching.coverageShell)}
            </span>
          )}
        </div>
      )}

      {/* Front/Pass Rush Settings */}
      {hasFrontChanges && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-300 text-xs">
          {coaching.dlShift !== 'default' && (
            <span>
              <span className="text-gray-500">DL:</span>{' '}
              {getOptionLabel(DL_SHIFT_OPTIONS, coaching.dlShift)}
            </span>
          )}
          {coaching.lbShift !== 'default' && (
            <span>
              <span className="text-gray-500">LB:</span>{' '}
              {getOptionLabel(LB_SHIFT_OPTIONS, coaching.lbShift)}
            </span>
          )}
          {coaching.dlStunt && coaching.dlStunt !== 'none' && (
            <span>
              <span className="text-gray-500">Stunt:</span>{' '}
              {getOptionLabel(DL_STUNT_OPTIONS, coaching.dlStunt)}
            </span>
          )}
          {coaching.zoneDrop && coaching.zoneDrop !== '0' && (
            <span>
              <span className="text-gray-500">Zone Drop:</span>{' '}
              {coaching.zoneDrop}
            </span>
          )}
        </div>
      )}

      {/* RPO/Option Settings */}
      {hasRPOChanges && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-300 text-xs">
          {coaching.rpoKey !== 'conservative' && (
            <span>
              <span className="text-gray-500">RPO:</span> Aggressive
            </span>
          )}
          {coaching.optionKey && coaching.optionKey !== 'qb' && (
            <span>
              <span className="text-gray-500">Option:</span>{' '}
              {coaching.optionKey === 'rb' ? 'RB' : 'Pitch'}
            </span>
          )}
        </div>
      )}

      {/* Good Against */}
      {hasGoodAgainst && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-gray-500 text-xs">Good vs:</span>
          {goodAgainst.formations?.map(f => (
            <span key={f} className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
              {f}
            </span>
          ))}
          {goodAgainst.routes?.map(r => (
            <span key={r} className="px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default DefensiveAdjustmentsPanel
