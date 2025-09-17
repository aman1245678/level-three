import express from "express";
import {
  createProblem,
  getProblems,
  getProblemById,
} from "../controllers/problemController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(getProblems)
  .post(protect, upload.single("image"), createProblem);

router.route("/:id").get(getProblemById);

export default router;
