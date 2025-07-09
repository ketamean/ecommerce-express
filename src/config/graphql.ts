import 'reflect-metadata'; // Must be imported first
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway/dist';
import { buildSchema } from 'type-graphql';
import { ProductResolver } from '@modules/product/product.resolver' // './resolvers/product.resolver';

export async function graphqlServer() {
  const schema = await buildSchema({
    resolvers: [ProductResolver],
    // validate: false, // Optional: useful during development
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  return server
};