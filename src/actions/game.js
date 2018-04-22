import {writeLog} from "./log";

export const TIME_SCALE = 1/10;

const TICK = "game/TICK";
const PLACE = "game/PLACE";
const SHAKE_START = "game/SHAKE_START";
const SHAKE_END = "game/SHAKE_END";
const RADIO = "game/RADIO";
const RESET = "game/RESET";

export function tick() {
  return {
    type: TICK
  }
}

export function place(object) {
  return {
    type: PLACE,
    payload: object
  }
}

export const logStart = (difficulty) => (dispatch, getState) => {
  dispatch(writeLog(`Starting new game at ${difficulty} difficulty.`));
  dispatch(writeLog(`You are starting on lane ${getPlayer(getState().game).lane + 1} of 3 (from the left).`));
  dispatch(writeLog(`Gear ${getPlayer(getState().game).gear + 1} is waiting for action in the gearbox.`));
  dispatch(writeLog(`You might want to 'speed' up a little to make the race less boring.`));
};

export const shakeScreen = () => (dispatch, getState) => {
  dispatch({ type: SHAKE_START });
  setTimeout(() => {
    dispatch({ type: SHAKE_END });
  }, 1000)
};

export function radio(on) {
  return { type: RADIO, payload: on };
}

export function resetGame() {
  return {
    type: RESET
  }
}

export function getPlayer(state) {
  if (state.game) {
    state = state.game;
  }
  return state.objects[0];
}

const DEFAULT_STATE = { ticks: 0, time: 0, objects: [], shaking: false, radio: false };
export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case TICK:
      const ticks = state.ticks + 1;
      return processTick({ ...state, ticks, time: ticks*TIME_SCALE });
    case PLACE:
      const obj = action.payload;
      return { ...state, objects: [...state.objects, obj] };
    case SHAKE_START:
      return { ...state, shaking: true };
    case SHAKE_END:
      return { ...state, shaking: false };
    case RADIO:
      return { ...state, radio: action.payload };
    case RESET:
      return DEFAULT_STATE;
    default:
      return state;
  }
}

function processTick(state) {
  const objects = state.objects;
  const updateable = state.objects.filter(o => !o.dead);
  for (const obj of updateable) {
    if (obj.update) {
      obj.update(state);
    }
  }
  for (let i = 0; i < updateable.length; i++) {
    const obj1 = updateable[i];
    if (!obj1.hit) {
      continue;
    }
    for (let j = i + 1; j < updateable.length; j++) {
      const obj2 = updateable[j];
      if (obj2.hit && obj1.position === obj2.position && (obj1.lane === obj2.lane || obj1.allLanes || obj2.allLanes)) {
        obj1.hit(obj2);
        obj2.hit(obj1);
      }
    }
  }
  return { ...state, objects };
}