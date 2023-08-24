import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./CreatePost.module.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const { token } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !desc || !location) {
      return alert("Please fill out all the fields of the form");
    }
    try {
      let filename = "";
      let fd = new FormData();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (file) {
        filename = crypto.randomUUID() + file.name;
        fd.append("filename", filename);
        fd.append("image", file);
        const res1 = await axios.post(
          "https://smedia-q9go.onrender.com/upload",
          fd,
          config
        );
        console.log(res1.data);
      }

      const res2 = await axios.post(
        "https://smedia-q9go.onrender.com/posts/create",
        { title, desc, location, photo: filename },
        config
      );

      console.log(res2.data);

      navigate("/");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Upload Post</h2>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            name="title"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            name="desc"
            placeholder="Description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <label htmlFor="file">
            Upload photo <i className="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
