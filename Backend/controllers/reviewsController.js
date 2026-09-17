import pool from "../database/db.js";

const editableFields = ["rating", "comment"];

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateReview(data, { partial = false } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Review data must be an object";
  }

  if (!partial || Object.hasOwn(data, "movie_id")) {
    if (parseId(data.movie_id) === null) return "movie_id must be a positive integer";
  }

  if (!partial || Object.hasOwn(data, "rating")) {
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 10) {
      return "rating must be an integer from 1 to 10";
    }
  }

  if (!partial || Object.hasOwn(data, "comment")) {
    if (typeof data.comment !== "string" || data.comment.trim() === "") {
      return "comment must be a non-empty string";
    }
  }

  return null;
}

function handleDatabaseError(res, error) {
  if (error.code === "23503") return res.status(400).json({ error: "Movie or user does not exist" });
  if (error.code === "23505") return res.status(409).json({ error: "You have already reviewed this movie" });

  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllReviews(req, res) {
  try {
    const values = [];
    let whereClause = "";

    if (req.query.movie_id !== undefined) {
      const movieId = parseId(req.query.movie_id);
      if (movieId === null) return res.status(400).json({ error: "Invalid movie_id" });
      values.push(movieId);
      whereClause = "WHERE r.movie_id = $1";
    }

    const result = await pool.query(
      `SELECT r.*, u.name AS user_name
       FROM public.reviews AS r
       JOIN public.users AS u ON u.id = r.user_id
       ${whereClause}
       ORDER BY r.created_at DESC, r.id DESC`,
      values,
    );
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getReviewById(req, res) {
  const reviewId = parseId(req.params.id);
  if (reviewId === null) return res.status(400).json({ error: "Invalid review id" });

  try {
    const result = await pool.query("SELECT * FROM public.reviews WHERE id = $1", [reviewId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function createReview(req, res) {
  const validationError = validateReview(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await pool.query(
      `INSERT INTO public.reviews (movie_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.body.movie_id, req.user.id, req.body.rating, req.body.comment.trim()],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function updateReview(req, res) {
  const reviewId = parseId(req.params.id);
  if (reviewId === null) return res.status(400).json({ error: "Invalid review id" });

  const validationError = validateReview(req.body, { partial: true });
  if (validationError) return res.status(400).json({ error: validationError });

  const fields = editableFields.filter((field) => Object.hasOwn(req.body, field));
  if (fields.length === 0) return res.status(400).json({ error: "No review fields to update" });

  const values = fields.map((field) =>
    field === "comment" ? req.body[field].trim() : req.body[field],
  );
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  values.push(reviewId);

  try {
    const existing = await pool.query("SELECT user_id FROM public.reviews WHERE id = $1", [reviewId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    if (req.user.role !== "admin" && existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own reviews" });
    }

    const result = await pool.query(
      `UPDATE public.reviews SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length} RETURNING *`,
      values,
    );
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function deleteReview(req, res) {
  const reviewId = parseId(req.params.id);
  if (reviewId === null) return res.status(400).json({ error: "Invalid review id" });

  try {
    const existing = await pool.query("SELECT user_id FROM public.reviews WHERE id = $1", [reviewId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    if (req.user.role !== "admin" && existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }

    const result = await pool.query("DELETE FROM public.reviews WHERE id = $1 RETURNING *", [reviewId]);
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
