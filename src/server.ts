import express, { Request, Response } from 'express';
// import 'express-async-errors';
import dotenv from 'dotenv';
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import errorHandler from '@middlewares/errorHandler'
import masterRouter from '@routes/index';

dotenv.config();  // Load environment variables from .env file 

const app = express();

// set middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// main routes
app.use(masterRouter);

// set error handling
app.use(errorHandler);

export { app };