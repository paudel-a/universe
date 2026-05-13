import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function SinglePost() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ======================
  // FETCH POST
  // ======================
  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // ======================
  // LIKE POST
  // ======================
  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/like/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ======================
  // COMMENT POST
  // ======================
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);

      const res = await API.post(`/posts/comment/${id}`, {
        text: commentText,
      });

      setPost(res.data);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // LOADING STATES
  // ======================
  if (loading) {
    return <div className="text-center mt-10">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10">Post not found</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-5">
      {/* USER */}
      <h2 className="text-xl font-bold">{post.user?.name || "Unknown User"}</h2>

      {/* CONTENT */}
      <p className="text-gray-700 text-lg">{post.content}</p>

      {/* LIKE BUTTON */}
      <button
        onClick={handleLike}
        className="text-blue-500 font-medium hover:underline"
      >
        👍 Like ({post.likes?.length || 0})
      </button>

      {/* COMMENTS */}
      <div className="space-y-2">
        <h3 className="font-semibold">Comments</h3>

        {post.comments?.length === 0 && (
          <p className="text-gray-400 text-sm">No comments yet</p>
        )}

        {post.comments?.map((c, i) => (
          <div key={i} className="text-sm text-gray-600">
            <strong>{c.user?.name || "User"}:</strong> {c.text}
          </div>
        ))}
      </div>

      {/* COMMENT INPUT */}
      <div className="flex gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={handleComment}
          disabled={submitting}
          className={`px-4 rounded text-white ${
            submitting ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
