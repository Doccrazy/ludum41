import {getPlayer} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";
import {getRandomInt} from "../../utils";

const speed = amount => () => {
  const player = getPlayer(store.getState());
  const newAccel = Math.min(Math.max(amount, 0), 1);
  if (player.accel === newAccel) {
    store.dispatch(writeLog(`Your pedal is already ${newAccel === 0 ? 'up' : (newAccel === 1 ? 'fully down' : 'half-way down')}.`, 'error'));
    return;
  }
  if (newAccel === 1) {
    store.dispatch(writeLog(['Putting the pedal to the metal.', 'Pushing the engine to its limits.', 'All the way down it goes.'][getRandomInt(3)]));
  } else if (newAccel === 0) {
    store.dispatch(writeLog('Holding speed.'));
  } else {
    store.dispatch(writeLog('If you insist: Holding gas at half-way down.'));
  }
  player.accel = newAccel;
};

const gearCmd = COMMANDS.register('speed', "Please tell me how much, 'full', 'half' or 'none'/'0'.");
gearCmd.register('full', speed(1));
gearCmd.register('max', speed(1));
gearCmd.register('up', speed(1));
gearCmd.register('half', speed(0.5));
gearCmd.register('none', speed(0));
gearCmd.register('down', speed(0));
gearCmd.register('0', speed(0));
