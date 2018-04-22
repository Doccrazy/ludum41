import {writeLog} from "../actions/log";
import store from "../store";
import Player from "./Player";
import {getPlayer} from "../actions/game";

export default class StaticObstacle {
  constructor(name, position, lane, tauntMessage, fatal) {
    this.name = name;
    this.position = position;
    this.lane = lane;
    this.tauntMessage = tauntMessage;
    this.gameOver = fatal;
    this.damage = !fatal;
  }

  render() {
    return this.name;
  }

  renderRear(gameState, items) {
    items.push({text: this.name, order: -10});
  }

  update(state) {
    if (this.tauntMessage && !this.seenTaunt && getPlayer(state).lane === this.lane
      && this.position - getPlayer(state).position < 6 && this.position - getPlayer(state).position > 1) {
      setTimeout(() => store.dispatch(writeLog(this.tauntMessage, 'warning')));
      this.seenTaunt = true;
    }
  }

  hit(other) {
    if (other instanceof Player) {
      if (this.gameOver) {
        setTimeout(() => store.dispatch(writeLog(`With a splintering thud, your car grinds to a halt against ${this.name}.`)));
      } else {
        setTimeout(() => store.dispatch(writeLog(`Your car makes its rumbling way over ${this.name}.`)));
      }
      this.dead = true;
    }
  }
}
