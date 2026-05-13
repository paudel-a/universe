const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const createNotification = require("../utils/createNotification");

// =======================
// CREATE POST
// =======================
exports.createPost = async (req, res) => {
  try {
    const io = req.app.get("io"); // ✅ FIXED

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ msg: "Content is required" });
    }

    const post = await Post.create({
      user: req.user,
      content,
    });

    const populatedPost = await post.populate("user", "name email");

    // 🔔 NOTIFY ALL USERS
    const users = await User.find({}, "_id");

    const notifications = users
      .filter((u) => u._id.toString() !== req.user.toString())
      .map((u) => ({
        user: u._id,
        sender: req.user,
        type: "post",
        post: post._id,
        text: "New post created",
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // 🔥 REAL-TIME FEED UPDATE
    io.emit("receivePost", populatedPost);

    res.status(201).json(populatedPost);
  } catch (error) {
    console.log("CREATE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// GET ALL POSTS
// =======================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.log("GET POSTS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// LIKE POST
// =======================
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (!post.likes) post.likes = [];

    const alreadyLiked = post.likes.includes(req.user);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.toString(),
      );
    } else {
      post.likes.push(req.user);

      if (post.user.toString() !== req.user.toString()) {
        await createNotification({
          user: post.user,
          sender: req.user,
          type: "like",
          post: post._id,
          text: "liked your post",
        });
      }
    }

    await post.save();

    const updatedPost = await post.populate([
      { path: "user", select: "name email" },
      { path: "comments.user", select: "name email" },
    ]);

    res.json(updatedPost);
  } catch (error) {
    console.log("LIKE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// COMMENT POST
// =======================
exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    post.comments.push({
      user: req.user,
      text,
    });

    await post.save();

    if (post.user.toString() !== req.user.toString()) {
      await createNotification({
        user: post.user,
        sender: req.user,
        type: "comment",
        post: post._id,
        text: "commented on your post",
      });
    }

    const updatedPost = await post.populate([
      { path: "user", select: "name email" },
      { path: "comments.user", select: "name email" },
    ]);

    res.json(updatedPost);
  } catch (error) {
    console.log("COMMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// DELETE POST
// =======================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// UPDATE POST
// =======================
exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ msg: "Content is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    post.content = content;

    await post.save();

    const updatedPost = await post.populate([
      { path: "user", select: "name email" },
      { path: "comments.user", select: "name email" },
    ]);

    res.json(updatedPost);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// GET SINGLE POST
// =======================
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.log("GET POST BY ID ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
