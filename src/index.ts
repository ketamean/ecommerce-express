import AppDataSource from "@config/database/typeorm";
import { app } from '@/server';

function init() {
  AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
}

init();