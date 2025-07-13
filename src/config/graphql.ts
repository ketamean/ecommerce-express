import "reflect-metadata"; // Must be imported first
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "@modules/product/product.resolver";
import { UserResolver } from "@modules/user/user.resolver";
import { CartResolver } from "@modules/cart/cart.resolver";
import { OrderResolver } from "@modules/order/order.resolver";
import { CategoryResolver } from "@modules/category/category.resolver";
import { GraphQLContext } from "@modules/user/context";

export async function graphqlServer() {
  const schema = await buildSchema({
    resolvers: [
      ProductResolver,
      UserResolver,
      CategoryResolver,
      CartResolver,
      OrderResolver,
    ],
    // validate: false, // Optional: useful during development
  });

  const server = new ApolloServer<GraphQLContext>({
    schema,
  });

  await server.start();

  return server;
}
