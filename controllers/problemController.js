import Problem from "../models/Problem.js";
import asyncHandler from "express-async-handler";

export const createProblem = asyncHandler(async (req, res) => {
  const { title, description, location } = req.body;
  const image = req.file ? req.file.path : null;

  const problem = await Problem.create({
    user: req.user._id,
    title,
    description,
    location,
    image,
  });

  res.status(201).json(problem);
});

export const getProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(problems);
});

export const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (problem) res.json(problem);
  else res.status(404).json({ message: "Problem not found" });
});
