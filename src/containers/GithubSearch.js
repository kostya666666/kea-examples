import React from "react";
import PropTypes from "prop-types";
import { kea } from "kea";
import { put } from "redux-saga/effects";
import { pure, branch, renderComponent, compose } from "recompose";

import { delay } from "../utils";

const API_URL = "https://api.github.com";

const Loading = () => <div>Loading</div>;
const displayLoadingState = branch(
  ({ isLoading }) => isLoading,
  renderComponent(Loading)
);

const data = kea({
  actions: () => ({
    setUsername: username => ({ username }),
    setRepositories: repositories => ({ repositories }),
    setFetchError: message => ({ message })
  }),
  reducers: ({ actions }) => ({
    username: [
      "",
      PropTypes.string,
      {
        [actions.setUsername]: (_, payload) => payload.username
      }
    ],
    repositories: [
      [],
      PropTypes.array,
      {
        [actions.setUsername]: () => [],
        [actions.setRepositories]: (_, payload) => payload.repositories
      }
    ],
    isLoading: [
      false,
      PropTypes.bool,
      {
        [actions.setUsername]: () => true,
        [actions.setRepositories]: () => false,
        [actions.setFetchError]: () => false
      }
    ],
    error: [
      null,
      PropTypes.string,
      {
        [actions.setUsername]: () => null,
        [actions.setFetchError]: (_, payload) => payload.message
      }
    ]
  }),
  takeLatest: ({ actions, workers }) => ({
    [actions.setUsername]: workers.fetchRepositories
  }),
  workers: {
    *fetchRepositories(action) {
      const { setRepositories, setFetchError } = this.actions;
      const { username } = action.payload;

      yield delay(100); // debounce for 100ms

      const url = `${API_URL}/users/${username}/repos?per_page=250`;
      const response = yield window.fetch(url);

      if (response.status === 200) {
        const json = yield response.json();
        yield put(setRepositories(json));
      } else {
        const json = yield response.json();
        yield put(setFetchError(json.message));
      }
    }
  }
});

const ReposPure = ({ repositories, username, error }) =>
  repositories.length > 0
    ? <div>
        Found {repositories.length} repositories for user {username}!
        {repositories.map(repo =>
          <div key={repo.id}>
            <a href={repo.html_url}>{repo.full_name}</a>
            {" - "}
            {repo.stargazers_count} stars, {repo.forks} forks.
          </div>
        )}
      </div>
    : <div>
        {error ? `Error: ${error}` : "No repositories found"}
      </div>;

const Repos = compose(data, displayLoadingState, pure)(ReposPure);

const GithubSearchPure = ({ username, actions: { setUsername } }) =>
  <div>
    <h1> Github Search</h1>
    <input
      type="text"
      value={username}
      placeholder="Search for a github user..."
      onChange={e => setUsername(e.target.value)}
    />
    <div>
      <p />
      <Repos />
    </div>
  </div>;

const GithubSearch = compose(data, pure)(GithubSearchPure);
export default GithubSearch;
