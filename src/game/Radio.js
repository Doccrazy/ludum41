import store from "../store";
import {writeLog} from "../actions/log";
import {getRandomInt} from "../utils";

const MESSAGES = [
  'Duh duh duh duh-dee-duh duh-dee-duh',
  'Grade A fake tunnel openings by ACME now 50% off! Success 99% guaranteed!',
  'Wubba Lubba Dub Dub',
  'You won\'t believe that some dumbass implemented a radio that does ABSOLUTELY NOTHING in a Ludum Dare game!',
  'All ASCII characters used in this game were bred in captivity under humane conditions monitored by the IEEE'
];

export function postRadioMessage() {
  const style = Math.random() > 0.8 ? 'warning' : 'default';
  store.dispatch(writeLog('Radio says: ' + MESSAGES[getRandomInt(MESSAGES.length)], style));
}

export default class Radio {
  update(state) {
    if (state.radio && Math.random() > 0.99) {
      setTimeout(postRadioMessage, 0);
    }
  }
}