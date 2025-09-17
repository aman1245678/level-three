import Solution from "../models/Solution.js";
import asyncHandler from "express-async-handler";

export const postSolution = asyncHandler(async (req, res) => {
  const { problem, description } = req.body; // accept 'problem' as frontend sends
  if (!problem || !description) {
    res.status(400);
    throw new Error("Problem ID and description are required");
  }

  const solution = await Solution.create({
    user: req.user._id,
    problem,
    description,
  });

  await solution.populate("user", "name email");
  res.status(201).json(solution);
});

export const getSolutions = asyncHandler(async (req, res) => {
  const solutions = await Solution.find({ problem: req.params.problemId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json(solutions);
});

export const upvoteSolution = asyncHandler(async (req, res) => {
  const solution = await Solution.findById(req.params.id);
  if (!solution) {
    res.status(404);
    throw new Error("Solution not found");
  }

  if (solution.upvotes.includes(req.user._id)) {
    solution.upvotes.pull(req.user._id);
  } else {
    solution.upvotes.push(req.user._id);
  }

  await solution.save();

  const populatedSolution = await solution.populate("user", "name");
  res.json(populatedSolution);
});
