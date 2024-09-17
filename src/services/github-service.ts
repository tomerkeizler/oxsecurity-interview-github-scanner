import { RestEndpointMethodTypes } from "@octokit/rest";
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

  private async getRepositoryTree(repoName: string, defaultBranch: string) {
    // Get the latest commit SHA on the specified branch
    const ref = await this.githubProvider.getRef(
      repoName,
      `heads/${defaultBranch}`
    );

    // Fetch the tree recursively
    const treeData = await this.githubProvider.getRepositoryTreeRecursively(
      repoName,
      ref.object.sha
    );
    return treeData.tree;
  }

  private async getrandomYamlFileContent(
    repoName: string,
    tree: RestEndpointMethodTypes["git"]["getTree"]["response"]["data"]["tree"]
  ): Promise<string> {
    const yamlFiles = tree.filter((item) => item.path?.endsWith("yaml"));
    let randomYamlFileContent = "";

    if (yamlFiles.length > 0) {
      const yamlFile = await this.githubProvider.getRepositoryPathContent(
        repoName,
        yamlFiles[0].path!
      );

      if (!Array.isArray(yamlFile) && yamlFile.type === "file") {
        randomYamlFileContent = Buffer.from(
          yamlFile.content,
          "base64"
        ).toString();
      }
    }

    return randomYamlFileContent;
  }

  public async getRepositoryDetails(repoName: string): Promise<Repository> {
    console.log(`getRepositoryDetails - START`, { repoName });

    const repoDetails = await this.githubProvider.getRepositoryDetails(
      repoName
    );
    const defaultBranch = repoDetails.default_branch;
    const tree = await this.getRepositoryTree(repoName, defaultBranch);

    // Count the number of files
    const numberOfFiles = tree.filter((item) => item.type === "blob").length;

    // Fetching a random yaml file content
    const randomYamlFileContent = await this.getrandomYamlFileContent(
      repoName,
      tree
    );

    // Get repository webhook list
    const repoWebhooks = await this.githubProvider.getRepositoryWebhooks(
      repoName
    );

    console.log(`getRepositoryDetails - IN PROGRESS`, { repoName });

    return {
      name: repoDetails.name,
      size: repoDetails.size,
      owner: repoDetails.owner.login,
      isPrivate: repoDetails.private,
      numberOfFiles,
      randomYamlFileContent,
      webhooks: repoWebhooks
        .filter((webhook) => webhook.active)
        .map((webhook) => webhook.url),
    };
  }
}
