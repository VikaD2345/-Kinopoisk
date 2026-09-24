import express from "express";
import {
  getAllSeries,
  getSeriesById,
} from "../controllers/seriesController.js";

const router = express.Router();

router.get("/", getAllSeries);
router.get("/:id", getSeriesById);

export default router;
