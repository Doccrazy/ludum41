import {logStart, place, resetGame, tick, TIME_SCALE} from "../actions/game";
import Radio from "../game/Radio";
import Player from "../game/Player";
import {getRandomInt} from "../utils";
import {clearLog} from "../actions/log";
import generateLevel from "./levelGenerator";
import Opponent from "../game/Opponent";

let interval;

const EASY = {
  length: 75,
  turnProb: 0.1,
  obstacleProb: 0.02,
  specialProb: 0.03
};
const MEDIUM = {
  length: 125,
  turnProb: 0.15,
  obstacleProb: 0.05,
  specialProb: 0.03
};
const HARD = {
  length: 200,
  turnProb: 0.25,
  obstacleProb: 0.07,
  specialProb: 0.05
};

const DIFFICULTIES = {
  'easy': EASY,
  'medium': MEDIUM,
  'hard': HARD
};

export default function (store, difficulty) {
  difficulty = DIFFICULTIES[difficulty] ? difficulty : 'easy';
  const settings = DIFFICULTIES[difficulty] || EASY;

  store.dispatch(resetGame());
  store.dispatch(clearLog());

  const playerLane = getRandomInt(3);
  store.dispatch(place(new Player(playerLane)));
  store.dispatch(place(new Radio()));
  store.dispatch(place(new Opponent('', -1, (playerLane + 1) % 3)));
  // store.dispatch(place(new Opponent(2, -2, 1)));
  // store.dispatch(place(new Opponent(3, -3, 2)));
  store.dispatch(logStart(difficulty));

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => store.dispatch(tick()), TIME_SCALE * 1000);

  generateLevel(store, settings);
}
