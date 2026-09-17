import express from "express";
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
} from "../controllers/genresController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllGenres);
router.get("/:id", getGenreById);
router.post("/", requireAdmin, createGenre);
router.patch("/:id", requireAdmin, updateGenre);
router.delete("/:id", requireAdmin, deleteGenre);

export default router;
