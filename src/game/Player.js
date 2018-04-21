import { register } from "../actions/console";
import {getPlayer, shakeScreen, TIME_SCALE} from "../actions/game";
import store from '../store'
import {writeLog} from "../actions/log";

export default class Player {
  position = 0;
  floatPosition = 0;
  lane = 1;
  speed = 1;
  rpm = 4500;
  /*queuedActions = [];

  constructor() {
  }

  queue(delay, handler) {
    this.queuedActions.push({ time: this.position + delay, handler })
  }

  execActions(pos) {
    const actions = this.queuedActions.filter(a => a.position === pos);
    this.queuedActions = this.queuedActions.filter(a => a.position !== pos);
    for (const action of actions) {
      action.handler();
    }
  }*/

  update(state) {
    this.floatPosition = this.floatPosition + TIME_SCALE*this.speed;
    this.position = Math.trunc(this.floatPosition);
    // this.execActions(state.time);
  }

  hit(other) {
    setTimeout(() => store.dispatch(shakeScreen()));
    if (other.gameOver) {
      this.speed = 0;
      this.rpm = 0;
    }
  }
}

const switchLane = delta => () => {
  const player = getPlayer(store.getState());
  const newLane = Math.min(Math.max(player.lane + delta, 0), 2);
  if (player.lane === newLane) {
    store.dispatch(writeLog(`The curbs are already dangerously close...`));
    return;
  }
  store.dispatch(writeLog(`Switching lanes...`));
  setTimeout(() => {
    const player = getPlayer(store.getState());
    const newLane = Math.min(Math.max(player.lane + delta, 0), 2);
    if (player.lane === newLane) {
      return;
    }
    player.lane = newLane;
    store.dispatch(writeLog(`Switched to lane ${player.lane + 1}`));
  }, 2000);
};

const switchCmd = register('switch');
switchCmd.register('left', switchLane(-1));
switchCmd.register('right', switchLane(1));
