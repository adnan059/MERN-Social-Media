const User = require("../models/User");
const Post = require("../models/Post");

const createError = require("../utils/Error");
const bcrypt = require("bcrypt");

//////////////////////////////////////////////

const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({}).select("-password");

    let suggestedUsers = users.filter((user) => {
      return (
        !currentUser.followings.includes(user._id) &&
        user._id.toString() !== currentUser._id.toString()
      );
    });

    if (suggestedUsers.length > 5) {
      suggestedUsers = suggestedUsers.slice(0, 5);
    }

    res.status(200).json(suggestedUsers);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////

const findFriends = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const friends = await Promise.all(
      currentUser.followings.map((fid) => {
        return User.findById(fid).select("-password");
      })
    );

    return res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////

const getAnUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(createError(500, "No such user, wrong ID"));
    }

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    console.log(users);

    const formattedUsers = users.map((user) => ({
      username: user.username,
      email: user.email,
      _id: user._id,
      createdAt: user.createdAt,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////

const updateUser = async (req, res, next) => {
  if (req.params.userId === req.user.id) {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can only update your own profile."));
  }
};

////////////////////////////////////////////////

const deleteUser = async (req, res, next) => {
  if (req.params.userId === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json({
        message: "User successfully deleted!",
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can only delete your own account"));
  }
};

///////////////////////////////////////////////

const toggleFollow = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    if (currentUserId === otherUserId) {
      throw new Error("You can't follow yourself");
    }

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!currentUser.followings.includes(otherUserId)) {
      currentUser.followings.push(otherUserId);
      otherUser.followers.push(currentUserId);

      await User.findByIdAndUpdate(
        currentUserId,
        { $set: currentUser },
        { new: true }
      );
      await User.findByIdAndUpdate(
        otherUserId,
        { $set: otherUser },
        { new: true }
      );

      return res
        .status(200)
        .json({ msg: "You have successfully followed the user!" });
    } else {
      currentUser.followings = currentUser.followings.filter(
        (id) => id !== otherUserId
      );
      otherUser.followers = otherUser.followers.filter(
        (id) => id !== currentUserId
      );

      await User.findByIdAndUpdate(
        currentUserId,
        { $set: currentUser },
        { new: true }
      );
      await User.findByIdAndUpdate(
        otherUserId,
        { $set: otherUser },
        { new: true }
      );

      return res
        .status(200)
        .json({ msg: "You have successfully unfollowed the user!" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

////////////////////////////////////////////////

const toggleBookmark = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "user",
      "-password"
    );

    if (!post) {
      return next(createError(403, "No such post!"));
    } else {
      if (
        post.user.bookmarkedPosts.some(
          (post) => post._id.toString() === req.params.postId.toString()
        )
      ) {
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { bookmarkedPosts: post },
        });
        return res
          .status(200)
          .json({ msg: "Successfully unbookmarked the post" });
      } else {
        //console.log(post);
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { bookmarkedPosts: post },
        });
        return res
          .status(200)
          .json({ msg: "Successfully boomkarked the post" });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuggestedUsers,
  findFriends,
  getAnUser,
  getAllUsers,
  updateUser,
  deleteUser,
  toggleFollow,
  toggleBookmark,
};
