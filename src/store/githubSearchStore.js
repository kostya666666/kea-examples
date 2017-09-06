import PropTypes from "prop-types";
import { kea } from "kea";
import { put } from "redux-saga/effects";

import { delay } from "../utils";

const API_URL = "https://api.github.com";

const githubSearchStore = kea({
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

export default githubSearchStore;
