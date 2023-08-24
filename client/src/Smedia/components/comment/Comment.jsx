import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import man from "../../assets/man.jpg";
import { capitalizeFirstLetter } from "../../utils/utils";
import classes from "./Comment.module.css";

const Comment = ({ c }) => {
  // console.log(c);
  const { token, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState(c);
  const [isLiked, setIsLiked] = useState(comment?.likes?.includes(user._id));

  const handleLikeComment = async () => {
    try {
      const { data } = await axios(
        `https://smedia-q9go.onrender.com/comments/togglelike/${comment?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      console.log(data);

      setComment((prev) => ({
        ...prev,
        likes: isLiked
          ? [...prev.likes].filter((id) => id !== user._id)
          : [...prev.likes, user._id],
      }));

      setIsLiked((prev) => !prev);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.commentLeft}>
        <img
          src={
            comment?.user?.profileImg
              ? `https://smedia-q9go.onrender.com/files/${comment?.user?.profileImg}`
              : man
          }
          className={classes.commentImg}
        />
        <div className={classes.commentData}>
          <span>
            {comment?.user?.username
              ? capitalizeFirstLetter(comment?.user?.username)
              : ""}
          </span>
          <span className={classes.commentTimeago}>
            {format(comment?.createdAt)}
          </span>
        </div>
        <div className={classes.commentText}>{comment?.commentText}</div>
      </div>
      <div className={classes.commentRight}>
        {isLiked ? (
          <i className="fa-solid fa-heart" onClick={handleLikeComment}></i>
        ) : (
          <i className="fa-regular fa-heart" onClick={handleLikeComment}></i>
        )}
        <span>{comment?.likes?.length || 0}</span>
        <span>likes</span>
      </div>
    </div>
  );
};

export default Comment;
