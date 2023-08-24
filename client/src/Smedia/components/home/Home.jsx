import React from "react";
import classes from "./Home.module.css";
import ProfileCard from "./../profileCard/ProfileCard";
import SuggestedUsers from "./../suggestedUsers/SuggestedUsers";
import Posts from "./../posts/Posts";
import RightSide from "./../rightSide/RightSide";

const Home = () => {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.left}>
          <ProfileCard />
          <SuggestedUsers />
        </div>
        <Posts />
        <RightSide />
      </div>
    </>
  );
};

export default Home;
