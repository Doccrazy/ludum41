import {getPlayer, TIME_SCALE} from "../actions/game";
import {writeLog} from "../actions/log";
import store from "../store";
import {getRandomInt} from "../utils";

export default class Granny {
  damage = true;
  position;
  lane = 0;
  sidePos;
  speed;
  rnd = getRandomInt(2);

  constructor(position, left) {
    this.position = position;
    this.sidePos = left ? -0.5 : 3.5;
    this.speed = left ? 0.25 : -0.25;
  }

  init(state) {
    this.initialized = true;
    const logs = [
      `A malicious-looking elderly lady is plodding in from the ${this.speed < 0 ? 'right' : 'left'}.`,
      `A too-friendly looking old lady with a huge battle cane is dragging herself over the road from the ${this.speed < 0 ? 'right' : 'left'}.`
    ];
    setTimeout(() =>
      store.dispatch(writeLog(logs[getRandomInt(logs.length)])));
  }

  enrage(state) {
    this.enraged = true;
    const rnd = getRandomInt(2);
    if (rnd === 0) {
      setTimeout(() => store.dispatch(writeLog(`Frightened to death, the lady stops in place, white as ash.`)));
      this.speed = 0;
    } else {
      setTimeout(() => store.dispatch(writeLog(`The old hag waves her stick and turns back to where she came from.`)));
      this.speed = -this.speed;
    }
  }

  render() {
    const walker = Math.trunc(((this.sidePos + 1) % 1) * 3);
    const walkerStr = ['\\\\', '||', '//'][walker];
    return (this.speed < 0 ? walkerStr : '') + "Granny" + (this.speed > 0 ? walkerStr : '');
  }

  renderRear(gameState, items) {
    if (this.dead) {
      items.push({text: `(${this.rnd ? 'bone' : 'walker'} fragments)`, order: -5});
    }
  }

  update(state) {
    if (this.position - getPlayer(state).position < 10 && !this.initialized) {
      this.init(state);
    }
    if (this.position - getPlayer(state).position < 3 && this.position - getPlayer(state).position > 0
      && this.lane === getPlayer(state).lane && this.initialized && !this.enraged) {
      this.enrage(state);
    }
    if (this.initialized) {
      this.sidePos += TIME_SCALE*this.speed;
      this.lane = Math.trunc(this.sidePos + 1) - 1;
    }
  }

  hit(other) {
    setTimeout(() => store.dispatch(writeLog(`With a low crunching sound, the old lady vanishes beneath your vehicle.`)));
    this.dead = true;
  }
}
