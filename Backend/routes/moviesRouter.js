import express from "express";
import { getAllMovies } from "../controllers/moviesController.js";
import { getMovieById } from "../controllers/moviesController.js";
import { createMovie } from "../controllers/moviesController.js";
import { updateMovie } from "../controllers/moviesController.js";
import { deleteMovie } from "../controllers/moviesController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.post("/", requireAdmin, createMovie);

router.patch("/:id", requireAdmin, updateMovie);

router.delete("/:id", requireAdmin, deleteMovie);

export default router;
