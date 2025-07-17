import AppDataSource from "@config/database/typeorm";
import { app } from '@/server';
import { initializePrivateKey } from "./entities/product-image.entity";
// import seed from './config/database/seeds/ts';
async function init() {
  await AppDataSource.initialize()
  await initializePrivateKey()
  // await seed()

  console.log('Data Source has been initialized!');
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

init();

// import { ApolloServer, gql } from "apollo-server";

// import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
//   type Mutation {
//     addMessage(message: String!): String
//   }
// `

// const resolvers = {
//   Query: {
//     hello: () => "Hello, world!"
//   },
//   Mutation: {
//     addMessage: (_: any, { message }: { message: string }) => {
//       console.log("Message received:", message);
//       return `Message added: ${message}`;
//     }
//   }
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   csrfPrevention: true,
//   cache: "bounded",
//   introspection: true,
//   plugins: [ApolloServerPluginLandingPageLocalDefault()],
// })

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// }).catch((error) => {
//   console.error("Error starting server:", error);
// });