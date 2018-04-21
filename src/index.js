import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import reducers from './actions'
import {tick, place, TIME_SCALE} from "./actions/game";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers,
  composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, document.getElementById('root'));
registerServiceWorker();

setInterval(() => store.dispatch(tick()), TIME_SCALE * 1000);

store.dispatch(place({
  render() {
    return "Granny" + (this.walker ? '//' : '\\\\')
  },
  update(state) {
    this.walker = state.time % 1 < 0.5;
  },
  position: 10,
  lane: 0,
  walker: true
}));
store.dispatch(place({
  render() {
    return "Foo"
  },
  position: 7,
  lane: 1
}));
store.dispatch(place({
  render() {
    return "A huge tree"
  },
  position: 5,
  lane: 2
}));
store.dispatch(place({
  renderTrack(side) {
    return '<span class="sign">&lt;</span>';
  },
  position: 7
}));
