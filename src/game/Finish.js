import store from "../store";
import {writeLog} from "../actions/log";
import Player from "./Player";
import Opponent from "./Opponent";

export default class Finish {
  allLanes = true;
  renderRow = true;

  constructor(pos) {
    this.position = pos;
  }

  renderTrack(side) {
    return `<span class="finish">&num;</span>`;
  }

  hit(other, gameState) {
    if (other instanceof Player) {
      const player = other;
      this.dead = true;
      const time = gameState.time - gameState.startTime;
      let place = 1;
      for (const obj of gameState.objects) {
        if (obj instanceof Opponent && obj.position > player.position) {
          place++;
        }
      }
      place = place === 1 ? '1st' : (place === 2 ? '2nd' : (place === 3 ? '3rd' : `${place}th`));
      setTimeout(() => store.dispatch(writeLog(`CONGRATULATIONS! You made it to the finish line without a nervous breakdown.`, 'success')));
      setTimeout(() => store.dispatch(writeLog(`You finished the race ${place} in ${time}s.`, 'success')));
      setTimeout(() => store.dispatch(writeLog("Enter 'start easy|medium|hard' to start a game at another difficulty.", 'warning')));
      player.accel = -1;
      player.turn = 0;
    }
  }
}