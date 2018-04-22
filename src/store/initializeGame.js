import {logStart, place, resetGame, tick, TIME_SCALE} from "../actions/game";
import Granny from "../game/Granny";
import Radio from "../game/Radio";
import StaticObstacle from "../game/StaticObstacle";
import Player from "../game/Player";
import Turn from "../game/Turn";
import Finish from "../game/Finish";
import {getRandomInt} from "../utils";
import {clearLog} from "../actions/log";

let interval;

const LENGTH = 100;
const TURN_PROB = 0.1;
const OBSTACLE_PROB = 0.05;
const GRANNY_PROB = 0.05;

export default function(store) {
  store.dispatch(resetGame());
  store.dispatch(clearLog());

  store.dispatch(place(new Player()));
  store.dispatch(place(new Radio()));
  store.dispatch(logStart());

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => store.dispatch(tick()), TIME_SCALE * 1000);

  const turnMap = placeTurns(store);
  placeObstacles(store, turnMap);
  store.dispatch(place(new Finish(LENGTH)));
}

function placeObstacles(store, turnMap) {
  let side;
  for (let p = 4; p < LENGTH - 6; p++) {
    if (turnMap[p] && !turnMap[p - 1]) {
      side = getRandomInt(2);
    } else if (!turnMap[p] && !turnMap[p - 1]) {
      side = null;
    }
    let placed = false;
    for (let l = (side == null ? 0 : side); l < (side == null ? 2 : side); l++) {
      if (Math.random() > OBSTACLE_PROB) {
        continue;
      }
      const o = OBSTACLES[getRandomInt(OBSTACLES.length)];
      store.dispatch(place(new StaticObstacle(o[0], p, l, o[1], o[2])));
      placed = true;
    }
    if (p > 10 && !placed && !turnMap[p] && Math.random() < GRANNY_PROB) {
      store.dispatch(place(new Granny(p, getRandomInt(2))));
    }
  }
}

function placeTurns(store) {
  const turnMap = [];
  for (let p = 10; p < LENGTH - 6; p++) {
    if (Math.random() > TURN_PROB) {
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
  ['A rock', 'It might be a good idea NOT to run into this rock at full speed.', true],
  ['A huge tree', 'That tree is probably not going to move...', true],
  ['A pothole', 'Your suspension would NOT be pleased to make accquaintance with this pothole.', false],
  ['A deer', 'A huge deer is ogling your headlights, not moving an inch.', true]
];
