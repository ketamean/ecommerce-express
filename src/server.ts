import express, { Request, Response } from "express";
// import 'express-async-errors';

import { json } from "body-parser";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "@middlewares/errorHandler";
import { graphqlServer } from "@config/graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLContext } from "@modules/user/context";
import authRoutes from "./routes/auth.routes";

const app = express();

async function main() {
  const server = await graphqlServer();
  // set middlewares for /api/* path
  app.use(
    "/api",
    cors(),
    helmet(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        return { req };
      },
    })
  );

  // health check
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
  });

  // Auth routes
  app.use("/auth", authRoutes);

  // // graphql route
  // const schema = await buildSchema({
  //   resolvers: [ProductResolver], // Add other resolvers here
  //   emitSchemaFile: true, // Optional: for generating schema.gql file
  // });

  // app.use(
  //   '/graphql',
  //   graphqlHTTP({
  //     schema: schema,
  //     graphiql: true, // Enables the GraphiQL UI
  //   }),
  // );

  // set error handling
  app.use(errorHandler);
}

main();

export { app };
