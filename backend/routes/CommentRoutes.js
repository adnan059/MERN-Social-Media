const express = require("express");
const { verifyToken } = require("../utils/Verify");
const {
  getAllComments,
  getOneComment,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} = require("../controllers/CommentController");

const router = express.Router();

router.get("/allcomments/:postId", getAllComments);
router.get("/:commentId", getOneComment);
router.post("/create", verifyToken, createComment);
router.put("/update/:commentId", verifyToken, updateComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);
router.put("/togglelike/:commentId", verifyToken, toggleLike);

module.exports = router;
