import React, { Component } from "react";
import PropTypes from "prop-types";
import { kea } from "kea";
import { put } from "redux-saga/effects";

@kea({
  actions: () => ({
    fetchProjects: () => ({}),
    setProjects: projects => ({ projects })
  }),
  reducers: ({ actions }) => ({
    projects: [
      [],
      PropTypes.array,
      {
        [actions.setProjects]: (state, payload) => payload.projects
      }
    ]
  }),
  *start() {
    const { fetchProjects } = this.actions;
    yield put(fetchProjects());
  },
  takeLatest: ({ actions, workers }) => ({
    [actions.fetchProjects]: workers.fetchProjects
  }),
  workers: {
    *fetchProjects() {
      const projects = yield ["helloProject", "worldProject"];
      const { setProjects } = this.actions;
      yield put(setProjects(projects));
    }
  }
})
export default class ProjectSetter extends Component {
  componentWillMount() {}
  render() {
    const { projects } = this.props;

    return (
      <div>
        Projects: {JSON.stringify(projects)}
      </div>
    );
  }
}
