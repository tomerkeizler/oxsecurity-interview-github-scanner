import GithubProvider from "../providers/github-provider.js";
import { FlatRepository, Repository } from "../types/repository.type.js";

export class GithubService {
  private githubProvider: GithubProvider;

  constructor(developerToken: string) {
    this.githubProvider = new GithubProvider(developerToken);
  }

  public async getRepositoryList(): Promise<Array<FlatRepository>> {
    const repositories = await this.githubProvider.getRepositoryList();
    return repositories.map((repo) => ({
      name: repo.name,
      size: repo.size,
      owner: repo.owner.login,
    }));
  }

  private async countFiles(repoName: string, path = ""): Promise<number> {
    let numberOfFiles = 0;
    const pathContent = await this.githubProvider.getRepositoryContent(
      repoName,
      path
    );

    if (Array.isArray(pathContent)) {
      // This is a folder
      for (const item of pathContent) {
        if (item.type === "file") {
          numberOfFiles++;
        } else if (item.type === "dir") {
          numberOfFiles += await this.countFiles(repoName, item.path);
        }
      }
    } else {
      // This is a file
      numberOfFiles = 1;
    }

    return numberOfFiles;
  }

  private async getRandomYmlFileContent(repoName: string): Promise<string> {
    const { items: ymlFiles, total_count: numberOfYmlFiles } =
      await this.githubProvider.searchFilesWithExtension(repoName, "yaml");
    let randomYmlFileContent = "";

    if (numberOfYmlFiles > 0) {
      const ymlFile = await this.githubProvider.getRepositoryContent(
        repoName,
        ymlFiles[0].path
      );
      if (!Array.isArray(ymlFile) && ymlFile.type === "file") {
        randomYmlFileContent = ymlFile.content;
        // randomYmlFileContent= Buffer.from(ymlFile.content, 'base64').toString();
      }
    }

    return randomYmlFileContent;
  }

  public async getRepositoryDetails(repoName: string): Promise<Repository> {
    const repoDetails = await this.githubProvider.getRepositoryDetails(
      repoName
    );
    const numberOfFiles = await this.countFiles(repoName);
    const randomYmlFileContent = await this.getRandomYmlFileContent(repoName);
    const repoWebhooks = await this.githubProvider.getRepositoryWebhooks(
      repoName
    );

    return {
      name: repoDetails.name,
      size: repoDetails.size,
      owner: repoDetails.owner.login,
      isPrivate: repoDetails.private,
      numberOfFiles,
      randomYmlFileContent,
      webhooks: repoWebhooks
        .filter((webhook) => webhook.active)
        .map((webhook) => webhook.url),
    };
  }
}
