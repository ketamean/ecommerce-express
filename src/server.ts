import express, { Request, Response } from 'express';
// import 'express-async-errors';

import { json } from "body-parser";
import helmet from "helmet";
import cors from "cors";
import errorHandler from '@middlewares/errorHandler';
import { graphqlServer } from '@config/graphql';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();

async function main() {
  const server = await graphqlServer()
  // set middlewares for /api/* path
  app.use(
    '/api',
    cors(),
    helmet(),
    json(),
    // (req:Request, res:Response, next:Function) => {
    //   console.log(req)
    // },
    expressMiddleware(server) as any,
  );

  // health check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

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