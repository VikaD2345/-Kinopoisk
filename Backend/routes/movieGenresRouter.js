import express from "express";
import {
  createMovieGenre,
  deleteMovieGenre,
  getAllMovieGenres,
  getMovieGenreById,
  updateMovieGenre,
} from "../controllers/movieGenresController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMovieGenres);
router.get("/:movieId/:genreId", getMovieGenreById);
router.post("/", requireAdmin, createMovieGenre);
router.patch("/:movieId/:genreId", requireAdmin, updateMovieGenre);
router.delete("/:movieId/:genreId", requireAdmin, deleteMovieGenre);

export default router;
