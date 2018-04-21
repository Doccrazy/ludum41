import { combineReducers } from 'redux';
import console from './console';
import game from './game';
import log from './log';

const rootReducer = combineReducers({
  console,
  game,
  log
});

export default rootReducer;
