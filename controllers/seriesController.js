import pool from "../database/db.js";

const selectSeries = `
  SELECT
    id,
    'series' AS type,
    title,
    original,
    year,
    end_year AS "endYear",
    rating::float8 AS rating,
    age,
    duration,
    genres,
    director,
    description,
    image,
    src
  FROM public.series
`;

function handleDatabaseError(res, error) {
  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllSeries(req, res) {
  try {
    const result = await pool.query(`${selectSeries} ORDER BY year DESC, title`);
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getSeriesById(req, res) {
  try {
    const result = await pool.query(`${selectSeries} WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Series not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
