import {writeLog} from "./log";

export const TIME_SCALE = 1/30;

const TICK = "game/TICK";
const PLACE = "game/PLACE";
const SHAKE_START = "game/SHAKE_START";
const SHAKE_END = "game/SHAKE_END";

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

export const logStart = () => (dispatch, getState) => {
  dispatch(writeLog(`You are starting on lane ${getPlayer(getState().game).lane + 1}.`));
};

export const shakeScreen = () => (dispatch, getState) => {
  dispatch({ type: SHAKE_START });
  setTimeout(() => {
    dispatch({ type: SHAKE_END });
  }, 2000)
};

export function getPlayer(state) {
  if (state.game) {
    state = state.game;
  }
  return state.objects[0];
}

export default function(state = { ticks: 0, time: 0, objects: [], shaking: false }, action) {
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
    default:
      return state;
  }
}

function processTick(state) {
  const objects = state.objects;//state.objects.filter(o => !o.dead);
  for (const obj of objects) {
    if (obj.update && !obj.dead) {
      obj.update(state);
    }
  }
  for (let i = 0; i < objects.length; i++) {
    const obj1 = objects[i];
    if (obj1.dead || !obj1.hit) {
      continue;
    }
    for (let j = i + 1; j < objects.length; j++) {
      const obj2 = objects[j];
      if (!obj2.dead && obj2.hit && obj1.position === obj2.position && obj1.lane === obj2.lane) {
        obj1.hit(obj2);
        obj2.hit(obj1);
      }
    }
  }
  return { ...state, objects };
}