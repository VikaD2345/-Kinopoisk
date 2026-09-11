import express from 'express';
import moviesRouter from './routes/moviesRouter.js';

const app = express();

app.use(express.json());

app.use('/movies', moviesRouter);

app.listen(3000);