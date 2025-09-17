import React, { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function SolutionCard({ solution, onUpvote }) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(solution.upvotes || []);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!user) return alert("Please login to upvote");
    setLoading(true);
    try {
      const res = await API.put(`/solutions/upvote/${solution._id}`);
      setUpvotes(res.data.upvotes);
      if (onUpvote) onUpvote(res.data); t
    } catch (err) {
      console.error("Upvote failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasUpvoted = user && upvotes.includes(user._id);

  return (
    <div className="border rounded p-3 shadow mb-3 bg-white flex justify-between items-start">
      <div>
        <p className="text-gray-800">{solution.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          <span>By: {solution.user?.name || "Unknown"}</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={handleUpvote}
          disabled={loading}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${hasUpvoted
            ? "bg-yellow-400 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
        >
          {loading ? "..." : hasUpvoted ? "Upvoted" : "Upvote"}
        </button>
        <span className="text-sm text-gray-500 mt-1">{upvotes.length}</span>
      </div>
    </div>
  );
}
