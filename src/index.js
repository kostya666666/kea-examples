import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./store";
// import CounterSingletonScene from "./components/counterSingletonScene";
// import Slider from "./containers/Slider";
// import GithubSearch from "./containers/GithubSearch";
import ProjectSetter from "./containers/ProjectSetter";

ReactDOM.render(
  <Provider store={store}>
    <ProjectSetter />
  </Provider>,
  document.getElementById("app")
);
