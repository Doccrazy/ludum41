import store from "../store";
import {writeLog} from "../actions/log";
import Player from "./Player";

export default class Finish {
  allLanes = true;
  renderRow = true;

  constructor(pos) {
    this.position = pos;
  }

  renderTrack(side) {
    return `<span class="finish">&num;</span>`;
  }

  hit(other) {
    if (other instanceof Player) {
      const player = other;
      this.dead = true;
      setTimeout(() => store.dispatch(writeLog(`CONGRATULATIONS! You made it to the finish line without a nervous breakdown.`, 'success')));
      setTimeout(() => store.dispatch(writeLog("Enter 'start easy|medium|hard' to start a game at another difficulty.", 'warning')));
      player.accel = -1;
      player.turn = 0;
    }
  }
}