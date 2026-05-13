import { useState } from "react";

export default function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onDelete,
  onEdit,
}) {
  const [commentText, setCommentText] = useState("");

  const isOwner = post?.user?._id === currentUser?.id;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      {/* USER */}
      <h2 className="font-semibold text-lg">
        {post?.user?.name || "Unknown User"}
      </h2>

      {/* CONTENT */}
      <p className="text-gray-700">{post?.content}</p>

      {/* DATE */}
      <p className="text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-3 text-sm">
        <button onClick={() => onLike(post._id)} className="text-blue-500">
          👍 Like ({post.likes?.length || 0})
        </button>

        {isOwner && (
          <>
            <button onClick={() => onEdit(post)} className="text-green-600">
              Edit
            </button>

            <button onClick={() => onDelete(post._id)} className="text-red-500">
              Delete
            </button>
          </>
        )}
      </div>

      {/* COMMENTS */}
      <div className="space-y-1">
        {post.comments?.map((c, i) => (
          <p key={i} className="text-sm text-gray-600">
            <strong>{c.user?.name || "User"}:</strong> {c.text}
          </p>
        ))}
      </div>

      {/* ADD COMMENT */}
      <div className="flex gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-2 py-1 rounded"
        />
        <button
          onClick={() => {
            onComment(post._id, commentText);
            setCommentText("");
          }}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
