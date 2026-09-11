
import movies from '../movie.json' with { type: 'json' };

export function getAllMovies(req, res) {
  res.json(movies);
}

export function getMovieById(req, res) {
  const movieId = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
}

export function createMovie(req, res) {
  const newMovie = req.body;
  movies.push(newMovie);
  res.status(201).json(newMovie);
}

export function updateMovie(req, res) {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex((m) => m.id === movieId);
    if (movieIndex !== -1) {
        const updatedMovie = { ...movies[movieIndex], ...req.body };
        movies[movieIndex] = updatedMovie;
        res.json(updatedMovie);
    } else {
        res.status(404).json({ error: 'Movie not found' });
    }
}

export function deleteMovie(req, res) {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex((m) => m.id === movieId);
    if (movieIndex !== -1) {
        const deletedMovie = movies.splice(movieIndex, 1);
        res.json(deletedMovie[0]);
    } else {
        res.status(404).json({ error: 'Movie not found' });
    }
}