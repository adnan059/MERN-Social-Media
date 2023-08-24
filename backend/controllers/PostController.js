const Post = require("../models/Post");
const User = require("../models/User");
const createError = require("../utils/Error");

//////////////////////////////////////////////

// get someone's posts
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////

// get timeline posts
const getTimelinePosts = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const posts = await Post.find({}).populate("user", "-password");

    const currentUserPosts = await Post.find({
      user: currentUser._id,
    }).populate("user", "-password");

    const friendsPosts = posts.filter((post) => {
      //console.log(post.user);
      //console.log(post.user._id);
      return currentUser.followings.includes(post.user._id);
    });

    const timelinePosts = currentUserPosts.concat(...friendsPosts);

    if (timelinePosts.length > 40) {
      timelinePosts = timelinePosts.slice(0, 40);
    }

    res.status(200).json(timelinePosts);
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////////////

// get one post
const getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "-password"
    );

    if (!post) {
      return next(createError(500, "No such post"));
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    next(error);
  }
};

/////////////////////////////////////////////

// create post
const createPost = async (req, res, next) => {
  try {
    const newPost = await Post.create({ ...req.body, user: req.user._id });

    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////

// update post
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (post.user.toString() === req.user._id.toString()) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        req.body,
        { new: true }
      );

      res.status(200).json(updatedPost);
    } else {
      return next(createError(403, "You can only update your post."));
    }
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////

// delete a post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (post.user._id.toString() === req.user._id.toString()) {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json({ message: "post successfully deleted!" });
    } else {
      return next(createError(403, "You can only delete your post."));
    }
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////

//toggle like
const toggleLike = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    //console.log(currentUserId);
    //console.log(req.user._id);
    const post = await Post.findById(req.params.postId);

    if (post.likes.includes(currentUserId)) {
      post.likes = post.likes.filter((uid) => {
        // console.log(uid);
        return uid !== currentUserId;
      });

      await post.save();

      res.status(200).json({ message: "succesfully unliked the post" });
    } else {
      post.likes.push(currentUserId);
      await post.save();
      res.status(200).json({ message: "succesfully liked the post" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserPosts,
  getTimelinePosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
};
