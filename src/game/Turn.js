import {getPlayer} from "../actions/game";
import store from "../store";
import {writeLog} from "../actions/log";
import Player from "./Player";

export default class Turn {
  allLanes = true;

  constructor(pos, dir, description) {
    this.position = pos;
    this.direction = dir;
    this.description = description;
  }

  renderTrack(side) {
    return `<span class="sign">${this.direction === 'right' ? '&gt;' : '&lt;'}</span>`;
  }

  update(state) {
    if (!this.seenTaunt && this.position - getPlayer(state).position < 6 && this.description) {
      const msg = `A ${this.description.replace('$dir', this.direction)} turn is approaching.`;
      setTimeout(() => store.dispatch(writeLog(msg, 'warning')));
      this.seenTaunt = true;
    }
  }

  hit(other) {
    if (other instanceof Player) {
      this.dead = true;
      const player = other;
      const turn = this.direction === 'right' ? 1 : -1;
      const laneDelta = player.turn - turn;
      player.turnTimer = 0;
      if (laneDelta !== 0) {
        if (Math.random() < 0.2) {
          setTimeout(() => store.dispatch(writeLog(`You hurt the sharp ${this.direction} turn's feelings by ignoring it.`)));
        }
        player.moveLane(laneDelta, 'With screeching tires, you car slides $dest.');
      }
    }
  }
}
