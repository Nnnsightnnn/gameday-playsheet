import { useLiveQuery } from 'dexie-react-hooks'
import { db, updateGameContext, clearGameContext } from '../lib/db'

const DOWNS = [1, 2, 3, 4]
const DISTANCE_PRESETS = [1, 2, 3, 5, 7, 10, 15, 20]
const YARD_LINES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

const DEFAULT_CONTEXT = { down: 1, distance: 10, fieldSide: 'own', yardLine: 25 }

function GameContextBar() {
  const gameContextData = useLiveQuery(
    () => db.gameContext.get('current'),
    []
  )

  // Use defaults when data is loading or doesn't exist
  const gameContext = gameContextData || DEFAULT_CONTEXT
  const { down, distance, fieldSide, yardLine } = gameContext

  const handleDownChange = (newDown) => {
    updateGameContext({ down: newDown })
  }

  const handleDistanceChange = (newDistance) => {
    updateGameContext({ distance: newDistance })
  }

  const handleFieldSideChange = (newSide) => {
    updateGameContext({ fieldSide: newSide })
  }

  const handleYardLineChange = (newYardLine) => {
    updateGameContext({ yardLine: newYardLine })
  }

  const handleClear = () => {
    clearGameContext()
  }

  // Calculate display text for field position
  const fieldPositionText = fieldSide === 'opp'
    ? `OPP ${yardLine}`
    : yardLine === 50
      ? 'MIDFIELD'
      : `OWN ${yardLine}`

  return (
    <div className="game-context-bar bg-gray-950 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Down Selector */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Down</span>
          <div className="flex gap-1">
            {DOWNS.map(d => (
              <button
                key={d}
                onClick={() => handleDownChange(d)}
                className={`w-10 h-10 rounded font-bold text-lg transition-all ${
                  down === d
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Selector */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Distance</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-wrap max-w-64">
              {DISTANCE_PRESETS.map(d => (
                <button
                  key={d}
                  onClick={() => handleDistanceChange(d)}
                  className={`px-2 h-10 rounded font-medium transition-all ${
                    distance === d
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={distance}
              onChange={(e) => handleDistanceChange(parseInt(e.target.value) || 10)}
              min="1"
              max="99"
              className="w-14 h-10 bg-gray-800 text-white text-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Field Position */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Field Position</span>
          <div className="flex items-center gap-2">
            {/* Own/Opp Toggle */}
            <div className="flex rounded overflow-hidden">
              <button
                onClick={() => handleFieldSideChange('own')}
                className={`px-3 h-10 font-medium transition-all ${
                  fieldSide === 'own'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                OWN
              </button>
              <button
                onClick={() => handleFieldSideChange('opp')}
                className={`px-3 h-10 font-medium transition-all ${
                  fieldSide === 'opp'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                OPP
              </button>
            </div>
            {/* Yard Line Select */}
            <select
              value={yardLine}
              onChange={(e) => handleYardLineChange(parseInt(e.target.value))}
              className="h-10 bg-gray-800 text-white px-3 rounded font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {YARD_LINES.map(yl => (
                <option key={yl} value={yl}>{yl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Display */}
        <div className="flex flex-col gap-1 ml-auto">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Current Situation</span>
          <div className="bg-gray-800 rounded px-4 h-10 flex items-center gap-3">
            <span className="text-2xl font-bold text-green-400">{down}</span>
            <span className="text-gray-500">&amp;</span>
            <span className="text-2xl font-bold text-yellow-400">{distance}</span>
            <span className="text-gray-500">at</span>
            <span className={`text-lg font-bold ${fieldSide === 'opp' ? 'text-red-400' : 'text-blue-400'}`}>
              {fieldPositionText}
            </span>
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
          title="Reset game context"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default GameContextBar
