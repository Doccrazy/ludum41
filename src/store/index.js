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
store.dispatch(place(new StaticObstacle("Foo", 7, 1)));
store.dispatch(place(new StaticObstacle("A huge tree", 5, 2)));
store.dispatch(place(new Turn(7, 'r')));
store.dispatch(place(new Turn(8, 'r')));
store.dispatch(place(new Turn(9, 'r')));

export default store;
