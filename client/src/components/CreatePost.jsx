import { useState } from "react";
import API from "../services/api";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      const res = await API.post("/posts", { content });

      setContent("");

      // instantly update feed (no refresh needed)
      if (onPostCreated) {
        onPostCreated(res.data);
      }
    } catch (err) {
      console.error("Create post error:", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border p-3 rounded-lg focus:outline-none"
      />

      <button
        onClick={handlePost}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
