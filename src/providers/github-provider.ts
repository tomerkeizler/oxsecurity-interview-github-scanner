import { Octokit } from "@octokit/rest";

export default class GithubProvider {
  private readonly octokit: Octokit;
  private counter: number;

  constructor(developerToken: string) {
    this.octokit = new Octokit({ auth: developerToken });
    this.counter = 0;
  }

  get userName(): string {
    return "tomerkeizler";
  }

  public async increaseCounter() {
    this.counter++;
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

  public async getRepositoryContent(repoName: string, path: string) {
    // --------
    console.log(`Called getRepositoryContent! ${this.counter}`);
    this.increaseCounter();
    // --------

    const response = await this.octokit.repos.getContent({
      owner: this.userName,
      repo: repoName,
      path,
    });
    return response.data;
  }

  public async searchFilesWithExtension(repoName: string, extension: string) {
    const response = await this.octokit.search.code({
      q: `extension:${extension} repo:${this.userName}/${repoName}`,
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
}
