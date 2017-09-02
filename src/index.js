import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./store";
// import CounterSingletonScene from "./components/counterSingletonScene";
// import Slider from "./containers/Slider";
import GithubSearch from "./containers/GithubSearch";

ReactDOM.render(
  <Provider store={store}>
    <GithubSearch />
  </Provider>,
  document.getElementById("app")
);
