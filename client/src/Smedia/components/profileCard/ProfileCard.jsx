import React from "react";
import man from "../../assets/man.jpg";
import { capitalizeFirstLetter } from "../../utils/utils";
import classes from "./ProfileCard.module.css";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { format } from "timeago.js";

const ProfileCard = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.imgContainer}>
            <img
              src={
                user?.profileImg
                  ? `https://smedia-q9go.onrender.com/files/${user?.profileImg}`
                  : man
              }
              className={classes.profileUserImg}
            />
          </div>
          <div className={classes.usernameAndCreatedAt}>
            <p>
              <span>Username:</span> {capitalizeFirstLetter(user?.username)}
            </p>
            <p>
              <span>Created At:</span> {format(user?.createdAt)}
            </p>
          </div>
        </div>
        <hr />
        <div className={classes.bottom}>
          <p>
            Followers: <span>{user?.followers.length}</span>
          </p>
          <p>
            Followings: <span>{user?.followings.length}</span>
          </p>
        </div>
      </div>
      <Link
        style={{ textDecoration: "none" }}
        to={`/profileDetails/${user?._id}`}
      >
        <h3 className={classes.myProfile}>My Profile</h3>
      </Link>
    </div>
  );
};

export default ProfileCard;
