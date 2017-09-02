import React, { Component } from "react";

import Counter from "../containers/counter";

export default class CounterSingletonScene extends Component {
  componentWillMount() {}
  render() {
    return (
      <div>
        <Counter id={1} />
        <Counter id={2} />
      </div>
    );
  }
}
