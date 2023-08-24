const express = require("express");
const { verifyToken } = require("../utils/Verify");
const {
  getSuggestedUsers,
  findFriends,
  getAnUser,
  getAllUsers,
  updateUser,
  deleteUser,
  toggleFollow,
  toggleBookmark,
} = require("../controllers/UserControllers");

const router = express.Router();

router.get("/find/suggestedusers", verifyToken, getSuggestedUsers);

router.get("/find/friends", verifyToken, findFriends);

router.get("/find/getallusers", verifyToken, getAllUsers);

router.get("/find/:userId", verifyToken, getAnUser);

router.put("/update/:userId", verifyToken, updateUser);

router.delete("/delete/:userId", verifyToken, deleteUser);

router.put("/togglefollow/:otherUserId", verifyToken, toggleFollow);

router.put("/togglebookmark/:postId", verifyToken, toggleBookmark);

module.exports = router;
