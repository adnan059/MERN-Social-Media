import React, { useState } from "react";
import { Link } from "react-router-dom";

import classes from "./postPhoto.module.css";

const PostPhoto = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

  //console.log(post);
  return (
    <Link
      className={classes.post}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      to={`/postDetails/${post._id}`}
    >
      <img src={`https://smedia-q9go.onrender.com/files/${post?.photo}`} />
      {isHovered && (
        <div className={classes.likes}>{post?.likes?.length} likes</div>
      )}
    </Link>
  );
};

export default PostPhoto;
