import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import woman from "../../assets/man.jpg";
import Comment from "./../comment/Comment";
import classes from "./post.module.css";

import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { bookmarkPost } from "../../redux/authSlice";
import { capitalizeFirstLetter } from "./../../utils/utils";

/////////////////////////////////////////////////////

const Post = ({ post }) => {
  const { token, user } = useSelector((store) => store.auth);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.likes.includes(user._id));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarkedPosts?.some(
      (bookmarkedPost) => bookmarkedPost._id === post?._id
    )
  );
  const [showComment, setShowComment] = useState(false);
  const dispatch = useDispatch();

  //******************************************************/

  // fetch comments useEffect
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/comments/allcomments/${post?._id}`
        );

        setComments(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchComments();
  }, [post?._id]);
  //*****************************************************/

  const deletePost = async () => {
    if (confirm("Do you want to delete this post?")) {
      const { data } = await axios.delete(
        `https://smedia-q9go.onrender.com/posts/delete/${post?._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      location.reload();
    } else {
      setShowDeleteModal(false);
    }
  };
  //++++++++++++++++++++++++++++++++++++
  const handleLikePost = async () => {
    try {
      const { data } = await axios(
        `https://smedia-q9go.onrender.com/posts/togglelike/${post?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
        }
      );
      setIsLiked((prev) => !prev);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  // ++++++++++++++++++++++++++++++++++++++++++++
  const handleBookmark = async () => {
    try {
      const { data } = await axios(
        `https://smedia-q9go.onrender.com/users/togglebookmark/${post?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
        }
      );
      //console.log(data);
      dispatch(bookmarkPost(post));
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //++++++++++++++++++++++++++++++++++++++++++++
  const handlePostComment = async () => {
    if (commentText === "") {
      setIsCommentEmpty(true);
      setTimeout(() => {
        setIsCommentEmpty(false);
      }, 2000);
    }
    try {
      const { data } = await axios.post(
        `https://smedia-q9go.onrender.com/comments/create`,
        { commentText, post: post?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, data]);
      setCommentText("");
      console.log(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //*****************************************************/
  // return part
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <Link
            to={`/profileDetails/${post?.user?._id}`}
            className={classes.topLeft}
          >
            <img
              src={
                post?.user.profileImg
                  ? `https://smedia-q9go.onrender.com/files/${post?.user.profileImg}`
                  : woman
              }
              className={classes.profileUserImg}
            />
            <div className={classes.profileMetadata}>
              <span>{capitalizeFirstLetter(post?.user.username)}</span>
              <span>{format(post?.createdAt)}</span>
            </div>
          </Link>
          {user?._id === post?.user._id && (
            <i
              className="fa-solid fa-ellipsis-vertical"
              onClick={() => setShowDeleteModal((prev) => !prev)}
            ></i>
          )}
          {showDeleteModal && (
            <div className={classes.deleteModal}>
              <h3>Delete Post</h3>
              <div className={classes.buttons}>
                <button onClick={deletePost}>Yes</button>
                <button onClick={() => setShowDeleteModal(false)}>No</button>
              </div>
            </div>
          )}
        </div>

        <div className={classes.center}>
          <div className={classes.desc}>{post?.desc}</div>
          {post?.location && (
            <div className={classes.location}>
              <i className="fa-solid fa-location-dot"></i> {post?.location}
            </div>
          )}
          <img
            className={classes.postImg}
            src={
              post?.photo
                ? `https://smedia-q9go.onrender.com/files/${post.photo}`
                : woman
            }
          />
        </div>
        <div
          className={`${classes.controls} ${
            showComment && classes.showComment
          }`}
        >
          <div className={classes.controlsLeft}>
            {isLiked ? (
              <i className="fa-solid fa-heart" onClick={handleLikePost}></i>
            ) : (
              <i className="fa-regular fa-heart" onClick={handleLikePost}></i>
            )}
            <i
              className="fa-regular fa-message"
              onClick={() => setShowComment((prev) => !prev)}
            ></i>
          </div>
          <div className={classes.controlsRight} onClick={handleBookmark}>
            {isBookmarked ? (
              <i className="fa-solid fa-bookmark"></i>
            ) : (
              <i className="fa-regular fa-bookmark"></i>
            )}
          </div>
        </div>
        {showComment && (
          <>
            <div className={classes.comments}>
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                ))
              ) : (
                <span style={{ marginLeft: "12px", fontSize: "20px" }}>
                  No comments
                </span>
              )}
            </div>
            <div className={classes.postCommentSection}>
              <input
                type="text"
                className={classes.inputSection}
                placeholder="Type comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
            {isCommentEmpty && (
              <span className={classes.emptyCommentMsg}>
                You can't post empty comment!
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
