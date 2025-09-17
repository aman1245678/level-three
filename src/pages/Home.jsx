import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import ProblemCard from "../components/ProblemCard";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "solved", "unsolved"

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/problems");
        setProblems(res.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Filter problems based on selection
  const filteredProblems = problems.filter(problem => {
    if (filter === "solved") return problem.isSolved;
    if (filter === "unsolved") return !problem.isSolved;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Solve Problems Together</h1>
            <p className="text-xl mb-8 opacity-90">
              CrowdSolve brings people together to find solutions to challenging problems
            </p>
            <Link
              to="/post-problem"
              className="inline-flex items-center bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Post a Problem
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header with Stats and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Community Problems</h2>
            <p className="text-gray-600">
              {problems.length} problems • {problems.filter(p => p.isSolved).length} solved
            </p>
          </div>

          {/* Filter Options */}
          <div className="mt-4 md:mt-0 flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "all"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              All Problems
            </button>
            <button
              onClick={() => setFilter("solved")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "solved"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Solved
            </button>
            <button
              onClick={() => setFilter("unsolved")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "unsolved"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Unsolved
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Problems Grid */}
        {!isLoading && (
          <>
            {filteredProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((problem) => (
                  <ProblemCard key={problem._id} problem={problem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 p-6 rounded-lg max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No problems found</h3>
                  <p className="text-gray-600">
                    {filter === "all"
                      ? "Be the first to post a problem!"
                      : `No ${filter} problems at the moment.`}
                  </p>
                  {filter !== "all" && (
                    <button
                      onClick={() => setFilter("all")}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all problems
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}