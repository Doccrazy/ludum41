import {getPlayer} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";

const turn = where => () => {
  const player = getPlayer(store.getState());
  if (player.turn === where) {
    store.dispatch(writeLog(`Thats where we are going anyway.`, 'error'));
    return;
  }
  store.dispatch(writeLog(`Turning ${where < 0 ? 'left' : (where > 0 ? 'right' : 'straight')}`));
  player.turn = where;
};

const turnCmd = COMMANDS.register('turn', "The autopilot has not been installed yet, so I need to know if 'left', 'right', or 'straight'.");
turnCmd.register('left', turn(-1));
turnCmd.register('right', turn(1));
turnCmd.register('straight', turn(0));
