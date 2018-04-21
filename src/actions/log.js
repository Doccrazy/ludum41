const ADD = 'log/ADD';

export function writeLog(str) {
  return {
    type: ADD,
    payload: str
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
