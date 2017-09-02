import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import createSagaMiddleware from "redux-saga";
import { keaSaga, keaReducer } from "kea";

const reducers = combineReducers({
  scenes: keaReducer("scenes")
  // other app reducers here
});

const sagaMiddleware = createSagaMiddleware();

const finalCreateStore = composeWithDevTools(
  applyMiddleware(sagaMiddleware)
  // more middlewares here
)(createStore);

const store = finalCreateStore(reducers);

sagaMiddleware.run(keaSaga);

export default store;
