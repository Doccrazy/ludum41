import store from "../store";
import {writeLog} from "../actions/log";
import Player from "./Player";
import {markStart} from "../actions/game";

export default class Start {
  allLanes = true;
  renderRow = true;

  constructor(pos) {
    this.position = pos;
  }

  renderTrack(side) {
    return `<span class="start">-</span>`;
  }

  hit(other) {
    if (other instanceof Player) {
      // const player = other;
      this.dead = true;
      setTimeout(() => store.dispatch(writeLog(`GO! Turning the hourglass now. Try to reach the finish before we run out of sand.`)));
      setTimeout(() => store.dispatch(markStart()));
      // player.accel = -1;
      // player.turn = 0;
    }
  }
}