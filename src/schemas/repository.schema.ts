import { gql } from "apollo-server";

export default gql`
  type FlatRepository {
    name: String!
    size: Int!
    owner: String!
  }

  type Repository {
    name: String!
    size: Int!
    owner: String!
    isPrivate: Boolean!
    numberOfFiles: Int!
    randomYamlFileContent: String
    webhooks: [String]
  }

  type Query {
    repositories(developerToken: String!): [FlatRepository]
    repository(developerToken: String!, repoName: String!): Repository
  }
`;
