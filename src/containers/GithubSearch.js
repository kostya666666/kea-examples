import React from "react";
import { pure, branch, renderComponent, compose } from "recompose";

import githubSeachStore from "../store/githubSearchStore";

const Loading = () => <div>Loading</div>;
const displayLoadingState = branch(
  ({ isLoading }) => isLoading,
  renderComponent(Loading)
);

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

const Repos = compose(githubSeachStore, displayLoadingState, pure)(ReposPure);

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

const GithubSearch = compose(githubSeachStore, pure)(GithubSearchPure);
export default GithubSearch;
