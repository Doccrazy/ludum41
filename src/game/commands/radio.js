import {radio} from "../../actions/game";
import store from "../../store";
import {writeLog} from "../../actions/log";
import {COMMANDS} from "../../actions/console";

const toggleRadio = on => () => {
  if (store.getState().game.radio === on) {
    store.dispatch(writeLog('The dial won\'t move.', 'error'));
    return;
  }
  if (on) {
    store.dispatch(writeLog('The car stereo is now playing a cheerful tune that would have been to expensive to license.'));
  } else {
    store.dispatch(writeLog('The silence is almost deafening.'));
  }
  store.dispatch(radio(on));
};

const radioCmd = COMMANDS.register('radio', "The radio has absolutely no influence on gameplay, but will to its best to distract you when turned 'on'.");
radioCmd.register('on', toggleRadio(true));
radioCmd.register('off', toggleRadio(false));
