import {applyMiddleware, compose, createStore} from "redux";
import reducers from "../actions";
import {logStart, place, tick, TIME_SCALE} from "../actions/game";
import Player from "../game/Player";
import thunk from "redux-thunk";
import Turn from "../game/Turn";
import Granny from "../game/Granny";
import StaticObstacle from "../game/StaticObstacle";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers,
  composeEnhancers(applyMiddleware(thunk)));
store.dispatch(place(new Player()));
store.dispatch(logStart());

setInterval(() => store.dispatch(tick()), TIME_SCALE * 1000);

store.dispatch(place(new Granny(12, 0)));
store.dispatch(place(new StaticObstacle("A rock", 7, 1, 'It might be a good idea NOT to run into this rock at full speed.')));
store.dispatch(place(new StaticObstacle("A huge tree", 5, 2, 'That tree is probably not going to move...')));
store.dispatch(place(new StaticObstacle("A pothole", 8, 1, 'Your suspension would NOT be pleased to make accquaintance with this pothole.')));
store.dispatch(place(new Turn(7, 'right')));
store.dispatch(place(new Turn(8, 'right')));
store.dispatch(place(new Turn(9, 'right')));

export default store;
