import { GithubService } from "../services/github-service.js";
import { UserInputError, AuthenticationError } from "apollo-server";
import { ConcurrencyUtility } from "../utilities/concurrency.utility.js";

export const repositoryResolver = {
  Query: {
    repositories: async (
      _: any,
      { developerToken }: { developerToken: string }
    ) => {
      const githubService = new GithubService(developerToken);
      return await githubService.getRepositoryList();
    },

    repository: async (
      _: any,
      { developerToken, repoName }: { developerToken: string; repoName: string }
    ) => {
      try {
        if (!developerToken) {
          throw new AuthenticationError("developerToken must be provided");
        }
        if (!repoName) {
          throw new UserInputError("repoName must be provided");
        }

        const githubService = new GithubService(developerToken);

        // Limiting the number of concurrent getRepositoryDetails operations
        const repository = await ConcurrencyUtility.limitConcurrency(() =>
          githubService.getRepositoryDetails(repoName)
        );

        console.log(`getRepositoryDetails - TASK ENDED`, { repoName });
        return repository;
      } catch (err) {
        console.error(`Error in get repository ${repoName}`, err);
        throw err;
      }
    },
  },
};
