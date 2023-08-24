import React, { useEffect } from "react";
import "./Smedia.css";
import Navbar from "./components/navbar/Navbar";

import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

import ProfileDetails from "./components/profileDetails/ProfileDetails";
import PostDetails from "./components/postDetails/PostDetails";
import CreatePost from "./components/createPost/CreatePost";
import { useSelector } from "react-redux";

const Smedia = () => {
  const { user, token } = useSelector((store) => store.auth);
  console.log(user, token);
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/createPost" element={user ? <CreatePost /> : <Login />} />
        <Route
          path="/profileDetails/:id"
          element={user ? <ProfileDetails /> : <Login />}
        />
        <Route
          path="/postDetails/:id"
          element={user ? <PostDetails /> : <Login />}
        />
      </Routes>
    </>
  );
};

export default Smedia;
