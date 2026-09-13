import express from 'express';
import moviesRouter from './routes/moviesRouter.js';
import { checkDatabaseConnection } from './database/db.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use('/movies', moviesRouter);

try {
  await checkDatabaseConnection();
  console.log('PostgreSQL connected');

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
} catch (error) {
  console.error('Failed to connect to PostgreSQL:', error.message);
  process.exit(1);
}
