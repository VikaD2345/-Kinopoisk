import pool from "../database/db.js";

function parseGenreId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateGenreName(name) {
  return typeof name === "string" && name.trim() !== "";
}

function handleDatabaseError(res, error) {
  if (error.code === "23505") {
    return res.status(409).json({ error: "Genre already exists" });
  }

  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllGenres(req, res) {
  try {
    const result = await pool.query("SELECT * FROM public.genres ORDER BY id");
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getGenreById(req, res) {
  const genreId = parseGenreId(req.params.id);

  if (genreId === null) {
    return res.status(400).json({ error: "Invalid genre id" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.genres WHERE id = $1",
      [genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function createGenre(req, res) {
  if (!validateGenreName(req.body?.name)) {
    return res.status(400).json({ error: "Name must be a non-empty string" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO public.genres (name) VALUES ($1) RETURNING *",
      [req.body.name.trim()],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function updateGenre(req, res) {
  const genreId = parseGenreId(req.params.id);

  if (genreId === null) {
    return res.status(400).json({ error: "Invalid genre id" });
  }

  if (!validateGenreName(req.body?.name)) {
    return res.status(400).json({ error: "Name must be a non-empty string" });
  }

  try {
    const result = await pool.query(
      "UPDATE public.genres SET name = $1 WHERE id = $2 RETURNING *",
      [req.body.name.trim(), genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function deleteGenre(req, res) {
  const genreId = parseGenreId(req.params.id);

  if (genreId === null) {
    return res.status(400).json({ error: "Invalid genre id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM public.genres WHERE id = $1 RETURNING *",
      [genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Genre not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
