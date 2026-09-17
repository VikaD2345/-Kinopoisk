import pool from "../database/db.js";

const editableFields = ["name", "email"];

function parseUserId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateUser(data, { partial = false } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "User data must be an object";

  if (!partial || Object.hasOwn(data, "name")) {
    if (typeof data.name !== "string" || data.name.trim() === "") return "name must be a non-empty string";
  }

  if (!partial || Object.hasOwn(data, "email")) {
    if (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return "email must be valid";
    }
  }

  if (Object.hasOwn(data, "role") && !["guest", "client", "admin"].includes(data.role)) {
    return "role must be guest, client or admin";
  }

  return null;
}

function handleDatabaseError(res, error) {
  if (error.code === "23505") return res.status(409).json({ error: "Email already exists" });
  console.error("Database error:", error.message);
  return res.status(500).json({ error: "Database error" });
}

export async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM public.users ORDER BY id");
    return res.json(result.rows);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function getUserById(req, res) {
  const userId = parseUserId(req.params.id);
  if (userId === null) return res.status(400).json({ error: "Invalid user id" });
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ error: "You can only view your own profile" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM public.users WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function createUser(req, res) {
  const validationError = validateUser(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await pool.query(
      `INSERT INTO public.users (name, email, role)
       VALUES ($1, $2, 'client')
       RETURNING id, name, email, role, created_at`,
      [req.body.name.trim(), req.body.email.trim().toLowerCase()],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function updateUser(req, res) {
  const userId = parseUserId(req.params.id);
  if (userId === null) return res.status(400).json({ error: "Invalid user id" });
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ error: "You can only edit your own profile" });
  }
  if (req.user.role !== "admin" && Object.hasOwn(req.body ?? {}, "role")) {
    return res.status(403).json({ error: "Only an admin can change a user role" });
  }

  const validationError = validateUser(req.body, { partial: true });
  if (validationError) return res.status(400).json({ error: validationError });

  const allowedFields = req.user.role === "admin" ? [...editableFields, "role"] : editableFields;
  const fields = allowedFields.filter((field) => Object.hasOwn(req.body, field));
  if (fields.length === 0) return res.status(400).json({ error: "No user fields to update" });

  const values = fields.map((field) => {
    const value = req.body[field];
    return field === "email" ? value.trim().toLowerCase() : typeof value === "string" ? value.trim() : value;
  });
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  values.push(userId);

  try {
    const result = await pool.query(
      `UPDATE public.users SET ${setClause} WHERE id = $${values.length}
       RETURNING id, name, email, role, created_at`,
      values,
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}

export async function deleteUser(req, res) {
  const userId = parseUserId(req.params.id);
  if (userId === null) return res.status(400).json({ error: "Invalid user id" });
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ error: "You can only delete your own profile" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM public.users WHERE id = $1 RETURNING id, name, email, role, created_at",
      [userId],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
}
