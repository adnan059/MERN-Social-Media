import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import man from "../../assets/man.jpg";
import Comment from "./../comment/Comment";
import classes from "./PostDetails.module.css";

const PostDetails = () => {
  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [isCommentLong, setIsCommentLong] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/posts/find/${id}`
        );

        setPost(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/comments/allcomments/${id}`
        );
        console.log(data);
        setComments(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchComments();
  }, [id]);

  console.log(comments);

  const handlePostComment = async () => {
    if (commentText === "") {
      setIsCommentEmpty(true);
      setTimeout(() => {
        setIsCommentEmpty(false);
      }, 2000);
      return;
    }

    if (commentText.length > 50) {
      setIsCommentLong(true);
      setTimeout(() => {
        setIsCommentLong(false);
      }, 2000);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://smedia-q9go.onrender.com/comments/create",
        { commentText, post: post?._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) => [...prev, data]);
      setCommentText("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img
            src={
              post?.photo &&
              `https://smedia-q9go.onrender.com/files/${post?.photo}`
            }
          />
        </div>
        <div className={classes.right}>
          <div className={classes.wrapperTopSide}>
            <Link
              to={`/profileDetail/${post?.user?._id}`}
              className={classes.topRightSide}
            >
              <img src={man} className={classes.profileImage} />
              <div className={classes.userData}>
                <span>{post?.user?.username}</span>
                <span>{post?.desc}</span>
                <span>
                  {post?.location
                    ? post?.location
                    : "Somewhere around the globe"}
                </span>
              </div>
            </Link>
          </div>
          {/* comments */}
          <div className={classes.comments}>
            {comments?.length > 0 ? (
              comments.map((comment) => (
                <Comment c={comment} key={comment._id} />
              ))
            ) : (
              <h3 className={classes.noCommentsMsg}>No comments yet</h3>
            )}
          </div>
          {/* comment input field */}
          <div className={classes.postCommentSection}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
              placeholder="Type comment..."
              className={classes.inputSection}
            />
            <button onClick={handlePostComment}>Post</button>
          </div>
          {isCommentEmpty && (
            <span className={classes.emptyCommentMsg}>
              You can't post empty comment!
            </span>
          )}
          {isCommentLong && (
            <span className={classes.longCommentMsg}>Comment is too long</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
