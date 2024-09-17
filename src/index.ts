import { ApolloServer } from "apollo-server";
import repositorySchema from "./schemas/repository.schema.js";
import { mergeResolvers } from "@graphql-tools/merge";
import { repositoryResolver } from "./resolvers/repository.resolver.js";

const typeDefs = [repositorySchema];

const resolvers = mergeResolvers([repositoryResolver]);

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
