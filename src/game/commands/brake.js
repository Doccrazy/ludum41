import {getPlayer} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";
import {getRandomInt} from "../../utils";

function brake() {
  const player = getPlayer(store.getState());
  if (player.accel < 0 || player.speed <= 0) {
    store.dispatch(writeLog(`The car won't go any slower.`, 'error'));
    return;
  }
  player.accel = -1;
  store.dispatch(writeLog(['Slowing down.', 'Bringing the car to a stop.'][getRandomInt(2)]));
}

COMMANDS.register('brake', brake);
COMMANDS.register('break', brake);
