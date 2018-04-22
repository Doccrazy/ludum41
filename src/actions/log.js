const ADD = 'log/ADD';
const CLEAR = 'log/CLEAR';

export function writeLog(message, style = 'default') {
  return {
    type: ADD,
    payload: {
      message,
      style
    }
  }
}

export function clearLog() {
  return { type: CLEAR };
}

export default function(state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, action.payload];
    case CLEAR:
      return [];
    default:
      return state;
  }
}
