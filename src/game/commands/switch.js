import {getPlayer} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";

const SWITCH_DELAY = 2000;

const switchLane = delta => () => {
  const player = getPlayer(store.getState());
  const newLane = Math.min(Math.max(player.lane + delta, 0), 2);
  if (player.lane === newLane) {
    store.dispatch(writeLog(`The curbs are already dangerously close...`, 'error'));
    return;
  } else if (player.speed <= 0) {
    store.dispatch(writeLog(`You are welcome to carry the car over yourself.`, 'error'));
    return;
  }
  store.dispatch(writeLog(`Switching lanes...`));
  setTimeout(() => {
    const player = getPlayer(store.getState());
    const newLane = Math.min(Math.max(player.lane + delta, 0), 2);
    if (player.lane === newLane) {
      return;
    }
    player.setLane(newLane);
    store.dispatch(writeLog(`Switched to lane ${player.lane + 1}`));
  }, SWITCH_DELAY);
};

const switchCmd = COMMANDS.register('switch', "Please tell me to which lane ('left' or 'right').");
switchCmd.register('left', switchLane(-1));
switchCmd.register('right', switchLane(1));
