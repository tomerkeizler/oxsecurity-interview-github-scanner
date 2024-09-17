export interface FlatRepository {
  name: string;
  size?: number;
  owner: string;
}

export interface Repository extends FlatRepository {
  isPrivate: boolean;
  numberOfFiles: number;
  randomYamlFileContent?: string;
  webhooks: Array<string>;
}
