import { Octokit } from "@octokit/rest";

export default class GithubProvider {
  private readonly octokit: Octokit;

  constructor(developerToken: string) {
    this.octokit = new Octokit({ auth: developerToken });
  }

  get userName(): string {
    return "tomerkeizler";
  }

  public async getRepositoryList() {
    const response = await this.octokit.repos.listForUser({
      username: this.userName,
    });
    return response.data;
  }

  public async getRepositoryDetails(repoName: string) {
    const response = await this.octokit.repos.get({
      owner: this.userName,
      repo: repoName,
    });
    return response.data;
  }

  public async getRepositoryPathContent(repoName: string, path: string) {
    const response = await this.octokit.repos.getContent({
      owner: this.userName,
      repo: repoName,
      path,
    });
    return response.data;
  }

  public async getRepositoryWebhooks(repoName: string) {
    const response = await this.octokit.repos.listWebhooks({
      owner: this.userName,
      repo: repoName,
    });
    return response.data;
  }

  public async getRef(repoName: string, ref: string) {
    const response = await this.octokit.git.getRef({
      owner: this.userName,
      repo: repoName,
      ref,
    });
    return response.data;
  }

  public async getRepositoryTreeRecursively(
    repoName: string,
    tree_sha: string
  ) {
    const response = await this.octokit.git.getTree({
      owner: this.userName,
      repo: repoName,
      tree_sha,
      recursive: "true",
    });
    return response.data;
  }
}
