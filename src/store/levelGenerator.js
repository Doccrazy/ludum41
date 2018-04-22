import {getRandomInt} from "../utils";
import {place} from "../actions/game";
import Start from "../game/Start";
import Finish from "../game/Finish";
import Granny from "../game/Granny";
import StaticObstacle from "../game/StaticObstacle";
import Turn from "../game/Turn";

export default function generateLevel(store, settings) {
  const turnMap = placeTurns(store, settings);
  placeObstacles(store, settings, turnMap);
  store.dispatch(place(new Start(2)));
  store.dispatch(place(new Finish(settings.length)));
}

function placeObstacles(store, settings, turnMap) {
  let side;
  for (let p = 4; p < settings.length - 6; p++) {
    if (turnMap[p] && !turnMap[p - 1]) {
      side = getRandomInt(2);
    } else if (!turnMap[p] && !turnMap[p - 1]) {
      side = null;
    }
    let placed = false;
    for (let l = (side == null ? 0 : side); l < (side == null ? 2 : side); l++) {
      if (Math.random() > settings.obstacleProb) {
        continue;
      }
      const o = OBSTACLES[getRandomInt(OBSTACLES.length)];
      store.dispatch(place(o(p, l)));
      placed = true;
    }
    if (p > 10 && !placed && !turnMap[p] && Math.random() < settings.specialProb) {
      const s = SPECIALS[getRandomInt(SPECIALS.length)];
      store.dispatch(place(s(p)));
    }
  }
}

function placeTurns(store, settings) {
  const turnMap = [];
  for (let p = 10; p < settings.length - 6; p++) {
    if (Math.random() > settings.turnProb) {
      continue;
    }
    const d = getRandomInt(2);
    const turn = TURNS[getRandomInt(TURNS.length)];
    const descr = turn.shift();
    p += turn.length + 1;
    for (const obj of turn.map((t, idx) => new Turn(p + idx, (t ^ d) ? 'right' : 'left', idx === 0 ? descr : null))) {
      store.dispatch(place(obj));
      turnMap[obj.position] = 1;
    }
  }
  return turnMap;
}

const TURNS = [
  ['$dir', 0, 0, 0],
  ['$dir', 0, 0, 0, 0],
  ['long $dir', 0, 0, 0, 0, 0],
  ['long $dir', 0, 0, 0, 0, 0, 0],
  ['short double-bend, starting $dir', 0, 1],
  ['twisting track, starting $dir', 0, 1, 0],
  ['long twisting track, starting $dir', 0, 1, 0, 1],
];

const OBSTACLES = [
  (p, l) => new StaticObstacle('A rock', p, l, 'It might be a good idea NOT to run into this rock at full speed.', true),
  (p, l) => new StaticObstacle('A huge tree', p, l, 'That tree is probably not going to move...', true),
  (p, l) => new StaticObstacle('A pothole', p, l, 'Your suspension would NOT be pleased to make accquaintance with this pothole.', false),
  (p, l) => new StaticObstacle('An elk', p, l, 'The huge elk keeps ogling your headlights, not moving an inch.', true),
];

const SPECIALS = [
  p => new Granny(p, getRandomInt(2))
];
