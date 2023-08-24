const express = require("express");

const {
  getUserPosts,
  getTimelinePosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/PostController");
const { verifyToken } = require("../utils/Verify");

const router = express.Router();

router.get("/find/:id", getOnePost);

router.get("/userposts/:userId", getUserPosts);

router.get("/timelineposts", verifyToken, getTimelinePosts);

router.post("/create", verifyToken, createPost);

router.put("/update/:postId", verifyToken, updatePost);

router.delete("/delete/:postId", verifyToken, deletePost);

router.put("/togglelike/:postId", verifyToken, toggleLike);

module.exports = router;
