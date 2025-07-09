import express, { Request, Response } from 'express';
// import 'express-async-errors';

import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { buildSchema } from 'type-graphql';
import errorHandler from '@middlewares/errorHandler';

const app = express();

async function main() {
  // set middlewares
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());

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