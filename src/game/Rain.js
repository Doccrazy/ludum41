import store from "../store";
import {writeLog} from "../actions/log";
import {raining, wipers} from "../actions/game";

export default class Radio {
  update(state) {
    if (!state.raining && Math.random() > 0.9999 && state.startTime) {
      setTimeout(() => store.dispatch(raining(true)));
      setTimeout(() => store.dispatch(writeLog('It started raining. Bruh. What\'s next? Grannys on the road?')));
    } else if (state.raining && Math.random() > 0.997) {
      setTimeout(() => store.dispatch(raining(false)));
      setTimeout(() => store.dispatch(wipers(false)));
      setTimeout(() => store.dispatch(writeLog('The rain stopped, and the wipers ground themselves to a halt.')));
    }
  }
}