import AppDataSource from "@config/database/typeorm";
import { app } from '@/server';

async function init() {
  await AppDataSource.initialize()

  console.log('Data Source has been initialized!');
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

init();