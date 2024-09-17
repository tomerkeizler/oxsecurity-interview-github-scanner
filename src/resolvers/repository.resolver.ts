import { GithubService } from "../services/github-service.js";

export const repositoryResolver = {
  Query: {
    repositories: async (
      _: any,
      { developerToken }: { developerToken: string }
    ) => {
      const service = new GithubService(developerToken);
      return await service.getRepositoryList();
    },

    repository: async (
      _: any,
      { developerToken, repoName }: { developerToken: string; repoName: string }
    ) => {
      const service = new GithubService(developerToken);
      return await service.getRepositoryDetails(repoName);
    },
  },
};
