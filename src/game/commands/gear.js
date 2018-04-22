import {getPlayer} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";
import {GEARS} from "../Player";
import {getRandomInt} from "../../utils";

const changeGear = delta => () => {
  const player = getPlayer(store.getState());
  const newGear = Math.min(Math.max(player.gear + delta, 0), GEARS.length - 1);
  if (player.gear === newGear) {
    store.dispatch(writeLog(`You are already in the ${newGear === 0 ? 'lowest' : 'highest'} gear.`, 'error'));
    return;
  }
  player.gear = newGear;
  const logs = [
    `The car is now in gear ${player.gear + 1}.`,
    `I put the car into gear ${player.gear + 1} for you.`,
    `Without too much objection, the gearbox switched to gear ${player.gear + 1}.`,
  ];
  store.dispatch(writeLog(logs[getRandomInt(logs.length)]));
};

const gearCmd = COMMANDS.register('gear', "I only know how to change gear 'up' or 'down'.");
gearCmd.register('up', changeGear(1));
gearCmd.register('down', changeGear(-1));
gearCmd.register('reverse', () => {
  store.dispatch(writeLog("Your gearbox says 'fuck you'.", 'error'));
});
gearCmd.register('neutral', () => {
  store.dispatch(writeLog("Do you want to win, or watch the scenery?", 'error'));
});
