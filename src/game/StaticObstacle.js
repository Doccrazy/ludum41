import {writeLog} from "../actions/log";
import store from "../store";

export default class StaticObstacle {
  gameOver = true;

  constructor(name, position, lane) {
    this.name = name;
    this.position = position;
    this.lane = lane;
  }

  render() {
    return this.name;
  }

  renderRear(gameState, items) {
    items.push({text: this.name, order: -10});
  }

  update(state) {
  }

  hit(other) {
    setTimeout(() => store.dispatch(writeLog(`With a splintering thud, your car grinds to a halt against ${this.name}.`)));
    this.dead = true;
  }
}
