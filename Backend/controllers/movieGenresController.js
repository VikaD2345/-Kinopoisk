import pool from "../database/db.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseRelation(data) {
  const movieId = parseId(data?.movie_id);
  const genreId = parseId(data?.genre_id);

  if (movieId === null || genreId === null) {
    return null;
  }

  return { movieId, genreId };
}

function handleDatabaseError(res, error) {
  if (error.code === "23503") {
    return res.status(400).json({ error: "Movie or genre does not exist" });
  }

  if (error.code === "23505") {
    return res.status(409).json({ error: "Movie already has this genre" });
  }

  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllMovieGenres(req, res) {
  try {
    const result = await pool.query(
      `SELECT mg.movie_id, mg.genre_id, m.title AS movie_title, g.name AS genre_name
       FROM public.movie_genres AS mg
       JOIN public.movies AS m ON m.id = mg.movie_id
       JOIN public.genres AS g ON g.id = mg.genre_id
       ORDER BY mg.movie_id, mg.genre_id`,
    );
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getMovieGenreById(req, res) {
  const movieId = parseId(req.params.movieId);
  const genreId = parseId(req.params.genreId);

  if (movieId === null || genreId === null) {
    return res.status(400).json({ error: "Invalid movie or genre id" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.movie_genres WHERE movie_id = $1 AND genre_id = $2",
      [movieId, genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function createMovieGenre(req, res) {
  const relation = parseRelation(req.body);

  if (relation === null) {
    return res.status(400).json({ error: "movie_id and genre_id must be positive integers" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.movie_genres (movie_id, genre_id)
       VALUES ($1, $2)
       RETURNING *`,
      [relation.movieId, relation.genreId],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function updateMovieGenre(req, res) {
  const currentMovieId = parseId(req.params.movieId);
  const currentGenreId = parseId(req.params.genreId);
  const relation = parseRelation(req.body);

  if (currentMovieId === null || currentGenreId === null || relation === null) {
    return res.status(400).json({ error: "movie_id and genre_id must be positive integers" });
  }

  try {
    const result = await pool.query(
      `UPDATE public.movie_genres
       SET movie_id = $1, genre_id = $2
       WHERE movie_id = $3 AND genre_id = $4
       RETURNING *`,
      [relation.movieId, relation.genreId, currentMovieId, currentGenreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function deleteMovieGenre(req, res) {
  const movieId = parseId(req.params.movieId);
  const genreId = parseId(req.params.genreId);

  if (movieId === null || genreId === null) {
    return res.status(400).json({ error: "Invalid movie or genre id" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM public.movie_genres
       WHERE movie_id = $1 AND genre_id = $2
       RETURNING *`,
      [movieId, genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
