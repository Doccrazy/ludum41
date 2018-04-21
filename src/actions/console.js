const CHANGE = 'console/CHANGE';
const CLEAR = 'console/CLEAR';

const COMMANDS = {};

export function register(cmd, handler, registry = COMMANDS) {
  const cmdRegistry = {};
  registry[cmd] = { handler: handler || handle, registry: cmdRegistry};
  return { register: (cmd, handler) => register(cmd, handler, cmdRegistry) };
}

export function handle(cmdLine, registry) {
  const m = /(\w+)\s*(.*)/.exec(cmdLine);
  if (!m) {
    return;
  }
  const cmd = m[1];
  const rest = m[2];

  const commandObj = (registry || COMMANDS)[cmd];
  console.log(cmdLine, commandObj);
  if (commandObj && commandObj.handler) {
    return commandObj.handler(rest, commandObj.registry, ...Array.prototype.slice.call(arguments, 2));
  }
}

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
    const action = handle(cmd, COMMANDS, dispatch, getState);
    if (action) {
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
