const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    profileImg: {
      type: String,
      default: "",
    },

    followers: {
      type: [String],
      default: [],
    },

    followings: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },
    bookmarkedPosts: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
