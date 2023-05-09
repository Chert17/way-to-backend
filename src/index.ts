import { runDB } from './db/db';
import { app } from './setting';

const port = 3000;

const start = async () => {
  try {
    await runDB();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
