import express, { Request, Response } from 'express';
// import 'express-async-errors';
import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// Basic error handling
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export { app };