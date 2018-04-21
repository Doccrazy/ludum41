export const TIME_SCALE = 1/30;

const TICK = "game/TICK";
const PLACE = "game/PLACE";

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

export default function(state = { ticks: 0, time: 0, position: 0, speed: 1, objects: [] }, action) {
  switch (action.type) {
    case TICK:
      const ticks = state.ticks + 1;
      return processTick({ ...state, ticks, time: ticks*TIME_SCALE });
    case PLACE:
      const obj = action.payload;
      return { ...state, objects: [...state.objects, obj] };
    default:
      return state;
  }
}

function processTick(state) {
  state.position = Math.trunc(state.time*state.speed);
  for (const obj of state.objects) {
    if (obj.update) {
      obj.update(state);
    }
  }
  return state;
}