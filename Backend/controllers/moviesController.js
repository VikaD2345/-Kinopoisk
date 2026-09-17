import pool from "../database/db.js";

const stringFields = ["title", "description", "image", "src"];
const editableFields = ["title", "description", "year", "image", "src"];

function parseMovieId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateMovieData(data, { partial = false } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Movie data must be an object";
  }

  for (const field of stringFields) {
    if (!partial || Object.hasOwn(data, field)) {
      if (typeof data[field] !== "string" || data[field].trim() === "") {
        return `${field} must be a non-empty string`;
      }
    }
  }

  if (!partial || Object.hasOwn(data, "year")) {
    if (!Number.isInteger(data.year) || data.year < 1888) {
      return "Year must be an integer greater than or equal to 1888";
    }
  }

  return null;
}

function handleDatabaseError(res, error) {
  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllMovies(req, res) {
  try {
    const result = await pool.query("SELECT * FROM public.movies ORDER BY id");
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getMovieById(req, res) {
  const movieId = parseMovieId(req.params.id);

  if (movieId === null) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.movies WHERE id = $1",
      [movieId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function createMovie(req, res) {
  const validationError = validateMovieData(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { title, description, year, image, src } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO public.movies (title, description, year, image, src)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        title.trim(),
        description.trim(),
        year,
        image.trim(),
        src.trim(),
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function updateMovie(req, res) {
  const movieId = parseMovieId(req.params.id);

  if (movieId === null) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  const validationError = validateMovieData(req.body, { partial: true });

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const fieldsToUpdate = editableFields.filter((field) =>
    Object.hasOwn(req.body, field),
  );

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: "No movie fields to update" });
  }

  const values = fieldsToUpdate.map((field) => {
    const value = req.body[field];
    return typeof value === "string" ? value.trim() : value;
  });
  const setClause = fieldsToUpdate
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  values.push(movieId);

  try {
    const result = await pool.query(
      `UPDATE public.movies
       SET ${setClause}
       WHERE id = $${values.length}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function deleteMovie(req, res) {
  const movieId = parseMovieId(req.params.id);

  if (movieId === null) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM public.movies WHERE id = $1 RETURNING *",
      [movieId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
