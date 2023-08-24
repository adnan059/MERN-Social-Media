import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Posts.module.css";

import Post from "./../post/Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const { data } = await axios.get(
          "https://smedia-q9go.onrender.com/posts/timelineposts",
          config
        );

        setPosts(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchPosts();
  }, [token]);

  // console.log(posts);

  return (
    <>
      <div className={classes.container}>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Posts;
