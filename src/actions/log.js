const ADD = 'log/ADD';

export function writeLog(message, style = 'default') {
  return {
    type: ADD,
    payload: {
      message,
      style
    }
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, action.payload];
    default:
      return state;
  }
}
