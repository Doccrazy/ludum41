import {logStart, place, resetGame, tick, TIME_SCALE} from "../actions/game";
import Radio from "../game/Radio";
import Player from "../game/Player";
import {getRandomInt} from "../utils";
import {clearLog} from "../actions/log";
import generateLevel from "./levelGenerator";

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
  difficulty = difficulty || 'easy';
  const settings = DIFFICULTIES[difficulty] || EASY;

  store.dispatch(resetGame());
  store.dispatch(clearLog());

  store.dispatch(place(new Player(getRandomInt(3))));
  store.dispatch(place(new Radio()));
  store.dispatch(logStart(difficulty));

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => store.dispatch(tick()), TIME_SCALE * 1000);

  generateLevel(store, settings);
}
