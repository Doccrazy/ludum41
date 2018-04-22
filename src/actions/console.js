import CommandRegistry from "../utils/CommandRegistry";
import {writeLog} from "./log";

const CHANGE = 'console/CHANGE';
const CLEAR = 'console/CLEAR';

export const COMMANDS = new CommandRegistry();

export function change(str) {
  return {
    type: CHANGE,
    payload: str
  }
}

function clear() {
  return {
    type: CLEAR
  }
}

export const execute = () => (dispatch, getState) => {
  const cmd = getState().console.input;
  if (cmd) {
    const action = COMMANDS.handle(cmd, dispatch, getState);
    if (action instanceof Error) {
      dispatch(writeLog(action.message, 'error'));
    } else if (action) {
      dispatch(action);
    }
    dispatch(clear());
  }
};

export default function(state = { input: '' }, action) {
  switch (action.type) {
    case CHANGE:
      return {...state, input: action.payload};
    case CLEAR:
      return {...state, input: ''};
    default:
      return state;
  }
}
