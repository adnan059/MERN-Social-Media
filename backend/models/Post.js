const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    desc: {
      type: String,
      required: true,
      min: 10,
      max: 100,
    },

    photo: {
      type: String,
      required: true,
    },

    likes: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
