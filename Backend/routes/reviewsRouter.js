import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "../controllers/reviewsController.js";
import { requireAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", requireAuthenticated, createReview);
router.patch("/:id", requireAuthenticated, updateReview);
router.delete("/:id", requireAuthenticated, deleteReview);

export default router;
