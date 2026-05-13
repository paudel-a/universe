import { useEffect, useState } from "react";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import socket from "../socket"; // ✅ ADDED

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔥 REAL-TIME LISTENER ADDED
  useEffect(() => {
    socket.on("receivePost", (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });

    return () => socket.off("receivePost");
  }, []);

  const handleLike = async (id) => {
    const res = await API.put(`/posts/like/${id}`);
    setPosts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
  };

  const handleComment = async (id, text) => {
    const res = await API.post(`/posts/comment/${id}`, { text });
    setPosts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
  };

  const handleDelete = async (id) => {
    await API.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleEdit = (post) => {
    const newContent = prompt("Edit post:", post.content);
    if (!newContent) return;

    API.put(`/posts/${post._id}`, { content: newContent }).then((res) => {
      setPosts((prev) => prev.map((p) => (p._id === post._id ? res.data : p)));
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feed</h1>

      <CreatePost
        onPostCreated={(post) => setPosts((prev) => [post, ...prev])}
      />

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={user}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
