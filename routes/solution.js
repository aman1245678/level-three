import express from "express";
import {
  postSolution,
  getSolutions,
  upvoteSolution,
} from "../controllers/solutionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/problem/:problemId").get(getSolutions);
router.route("/").post(protect, postSolution);
router.route("/upvote/:id").put(protect, upvoteSolution);

export default router;
