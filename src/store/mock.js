import {applyMiddleware, createStore} from "redux";
import reducers from "../actions";
import thunk from "redux-thunk";

export default function() {
  return createStore(reducers, applyMiddleware(thunk));
}
