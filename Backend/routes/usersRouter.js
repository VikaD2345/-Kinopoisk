import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/usersController.js";
import { requireAdmin, requireAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAdmin, getAllUsers);
router.get("/:id", requireAuthenticated, getUserById);
router.post("/", createUser);
router.patch("/:id", requireAuthenticated, updateUser);
router.delete("/:id", requireAuthenticated, deleteUser);

export default router;
