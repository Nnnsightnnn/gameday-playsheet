// Working-formation state for one side of the ball.
// Holds the 11 tokens + the current selection, exposing intent-named helpers.

import { useReducer } from 'react';
import { defaultFormation } from '../lib/field/formationFactory';

function reducer(state, action) {
  switch (action.type) {
    case 'move': {
      const players = state.players.map((p) =>
        p.id === action.id ? { ...p, x: action.point.x, y: action.point.y } : p,
      );
      return { ...state, players };
    }
    case 'swap': {
      const a = state.players.find((p) => p.id === action.a);
      const b = state.players.find((p) => p.id === action.b);
      if (!a || !b) return state;
      const players = state.players.map((p) => {
        if (p.id === a.id) return { ...p, x: b.x, y: b.y };
        if (p.id === b.id) return { ...p, x: a.x, y: a.y };
        return p;
      });
      return { ...state, players, selectedId: null };
    }
    case 'setPos':
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, pos: action.pos, label: action.label ?? action.pos } : p,
        ),
      };
    case 'setJersey':
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, jersey: action.jersey } : p,
        ),
      };
    case 'select':
      return { ...state, selectedId: action.id };
    case 'load':
      return { players: action.players.map((p) => ({ ...p })), selectedId: null };
    case 'reset':
      return { players: defaultFormation(action.side), selectedId: null };
    default:
      return state;
  }
}

export function useFormationEditor(side) {
  const [state, dispatch] = useReducer(
    reducer,
    side,
    (s) => ({ players: defaultFormation(s), selectedId: null }),
  );

  return {
    players: state.players,
    selectedId: state.selectedId,
    move: (id, point) => dispatch({ type: 'move', id, point }),
    swap: (a, b) => dispatch({ type: 'swap', a, b }),
    setPos: (id, pos, label) => dispatch({ type: 'setPos', id, pos, label }),
    setJersey: (id, jersey) => dispatch({ type: 'setJersey', id, jersey }),
    select: (id) => dispatch({ type: 'select', id }),
    load: (players) => dispatch({ type: 'load', players }),
    reset: (s) => dispatch({ type: 'reset', side: s }),
  };
}
