import "reflect-metadata"; // Must be imported first
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "@modules/product/product.resolver";
import { UserResolver } from "@modules/user/user.resolver";
import { GraphQLContext } from "@modules/user/context";

export async function graphqlServer() {
  const schema = await buildSchema({
    resolvers: [ProductResolver, UserResolver],
    // validate: false, // Optional: useful during development
  });

  const server = new ApolloServer<GraphQLContext>({
    schema,
  });

  await server.start();

  return server;
}
