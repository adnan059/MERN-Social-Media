const Comment = require("../models/Comment");
const createError = require("../utils/Error");

////////////////////////////////////////////////////

// fetch all comments of a post
const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("user", "-password")
      .populate("post", "-user");

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

/////////////////////////////////////////////////////

// fetch a comment
const getOneComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "user",
      "-password"
    );
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////////////

// create a comment
const createComment = async (req, res, next) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user: req.user._id,
    });
    const finalComment = await newComment.populate("user", "-password");
    res.status(201).json(finalComment);
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////////////

// update a comment
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(createError(403, "No such comment"));
    }
    if (comment.user._id.toString() === req.user._id.toString()) {
      comment.commentText = req.body.commentText;
      comment.save();
      res.status(200).json({ message: "comment updated succesfully" });
    } else {
      return next(createError(403, "You can only update your comment"));
    }
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////////

// delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(createError(403, "No such comment"));
    }

    if (comment.user._id.toString() === req.user._id.toString()) {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json({ message: "comment successfully deleted!" });
    } else {
      return next(createError(403, "You can only delete your comment"));
    }
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////////////

// toggle like
const toggleLike = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment.likes.includes(currentUserId)) {
      comment.likes.push(currentUserId);

      await comment.save();

      res.status(200).json({ message: "Comment successfully liked!" });
    } else {
      comment.likes = comment.likes.filter((uid) => {
        return uid !== currentUserId;
      });

      await comment.save();

      res.status(200).json({
        message: "Comment successfully unliked!",
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllComments,
  getOneComment,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
};
