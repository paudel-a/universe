import { useEffect, useState } from "react";
import API from "../services/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/assignments");
      setAssignments(res.data);
    };

    fetchData();
  }, []);

  const submitAssignment = async (id) => {
    const content = prompt("Write your answer:");

    if (!content) return;

    await API.post("/submissions", {
      assignmentId: id,
      studentId: JSON.parse(localStorage.getItem("user")).id,
      content,
    });

    alert("Submitted ✅");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Assignments</h1>

      {assignments.map((a) => (
        <div key={a._id} className="bg-white p-4 mb-3 rounded shadow">
          <h2 className="font-bold">{a.title}</h2>
          <p>{a.description}</p>

          <button
            onClick={() => submitAssignment(a._id)}
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            Submit Assignment
          </button>
        </div>
      ))}
    </div>
  );
};

export default Assignments;
