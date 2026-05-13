const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    description: String,
    price: Number,

    category: {
      type: String,
      default: "general",
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "used",
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Marketplace", marketplaceSchema);
