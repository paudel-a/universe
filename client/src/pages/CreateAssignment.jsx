import { useState } from "react";
import API from "../services/api";

const CreateAssignment = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleSubmit = async () => {
    await API.post("/assignments", {
      ...form,
      createdBy: JSON.parse(localStorage.getItem("user")).id,
    });

    alert("Assignment created ✅");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Create Assignment</h1>

      <input
        placeholder="Title"
        className="border p-2 block w-full mt-2"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="border p-2 block w-full mt-2"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        className="border p-2 block w-full mt-2"
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post Assignment
      </button>
    </div>
  );
};

export default CreateAssignment;
