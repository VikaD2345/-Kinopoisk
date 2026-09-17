import pool from "../database/db.js";

const allowedRoles = new Set(["guest", "client", "admin"]);

function parsePositiveInteger(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function authenticate(req, res, next) {
  const headerValue = req.get("X-User-Id");

  if (headerValue === undefined) {
    req.user = { role: "guest" };
    return next();
  }

  const userId = parsePositiveInteger(headerValue);

  if (userId === null) {
    return res.status(401).json({ error: "Invalid X-User-Id header" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM public.users WHERE id = $1",
      [userId],
    );

    if (result.rows.length === 0 || !allowedRoles.has(result.rows[0].role)) {
      return res
        .status(401)
        .json({ error: "User not found or has an invalid role" });
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    console.error("Authentication database error:", error.message);
    return res.status(500).json({ error: "Database error" });
  }
}

export function requireAuthenticated(req, res, next) {
  if (!req.user || req.user.role === "guest") {
    return res.status(401).json({ error: "Authentication required" });
  }

  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role === "guest") {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
}
