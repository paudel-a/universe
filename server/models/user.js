const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "student",
    },

    university: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "https://i.imgur.com/4M34hi2.png",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
