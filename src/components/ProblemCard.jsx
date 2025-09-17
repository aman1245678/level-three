import { Link } from "react-router-dom";

export default function ProblemCard({ problem }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition mb-4">
      {problem.image && (
        <img
          src={`http://localhost:5000/${problem.image}`}
          alt={problem.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}
      <h2 className="font-bold text-lg">{problem.title}</h2>
      <p className="text-gray-700">
        {problem.description.substring(0, 100)}...
      </p>
      <p className="text-sm text-gray-500">{problem.location}</p>
      <Link
        to={`/problem/${problem._id}`}
        className="text-blue-600 mt-2 inline-block">
        View Solutions
      </Link>
    </div>
  );
}
