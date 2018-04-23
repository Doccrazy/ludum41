import {wipers} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";

const toggleWipers = on => () => {
  if (store.getState().game.wipers === on) {
    store.dispatch(writeLog('The dial won\'t move.', 'error'));
    return;
  }
  if (on) {
    store.dispatch(writeLog('The windshield wipers are now doing their thing. You know, wiping and stuff.'));
  } else {
    store.dispatch(writeLog('Windshield wipers turned off.'));
  }
  store.dispatch(wipers(on));
};

const wipersCmd = COMMANDS.register('wipers', "Toggle your windshield wipers 'on' or 'off'.");
wipersCmd.register('on', toggleWipers(true));
wipersCmd.register('off', toggleWipers(false));
