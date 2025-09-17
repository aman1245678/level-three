import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
