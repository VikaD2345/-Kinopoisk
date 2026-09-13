import express from 'express';
import { getAllMovies } from '../controllers/moviesController.js';
import { getMovieById } from '../controllers/moviesController.js';
import { createMovie } from '../controllers/moviesController.js';
import { updateMovie } from '../controllers/moviesController.js';
import { deleteMovie } from '../controllers/moviesController.js';


const router = express.Router();

router.get('/', getAllMovies);

router.get('/:id', getMovieById);

router.post('/', createMovie);

router.patch('/:id', updateMovie);

router.delete('/:id', deleteMovie);

export default router;