import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import SolutionCard from "../components/SolutionCard";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProblem = await API.get(`/problems/${id}`);
        setProblem(resProblem.data);

        const resSolutions = await API.get(`/solutions/problem/${id}`);
        setSolutions(resSolutions.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await API.post("/solutions", { problem: id, description: desc });

      setSolutions([res.data, ...solutions]);
      setDesc("");
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert(error.response?.data?.message || "Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-pulse text-indigo-600 text-lg">Loading problem details...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Problem Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
          <p className="text-sm">{problem.location}</p>
        </div>

        {/* Problem Description */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Problem Description</h2>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">{problem.description}</p>

          {problem.image && (
            <img
              src={`http://localhost:5000/${problem.image}`}
              alt={problem.title}
              className="w-full h-64 object-cover rounded-lg shadow-md mt-4"
            />
          )}

          {/* Solution Form */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Suggest a Solution</h2>
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <textarea
                placeholder="Share your innovative solution..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                rows="4"
              />
              <button
                type="submit"
                disabled={isSubmitting || !desc.trim()}
                className={`px-6 py-2 rounded-lg font-medium ${isSubmitting || !desc.trim()
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Solution"}
              </button>
            </form>
          </div>

          {/* Solutions List */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Proposed Solutions ({solutions.length})</h2>
            {solutions.length === 0 ? (
              <p className="text-gray-500">No solutions yet. Be the first to suggest one!</p>
            ) : (
              <div className="space-y-4">
                {solutions.map((s) => (
                  <SolutionCard key={s._id} solution={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
