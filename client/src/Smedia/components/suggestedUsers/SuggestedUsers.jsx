import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import man from "../../assets/man.jpg";
import { handleFollow } from "../../redux/authSlice";
import { capitalizeFirstLetter } from "./../../utils/utils";
import classes from "./SuggestedUsers.module.css";

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { user, token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "https://smedia-q9go.onrender.com/users/find/suggestedusers",
          config
        );
        setSuggestedUsers(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getSuggestedUsers();
  }, [token]);

  const toggleFollow = async (id) => {
    try {
      const { data } = await axios(
        `https://smedia-q9go.onrender.com/users/togglefollow/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
        }
      );
      console.log(data);

      setSuggestedUsers((prev) => {
        return [...prev].filter((user) => user?._id !== id);
      });

      dispatch(handleFollow(id));
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.myProfile}>
          <img
            src={
              user?.profileImg
                ? `https://smedia-q9go.onrender.com/files/${user?.profileImg}`
                : man
            }
            className={classes.profileUserImg}
            alt=""
          />
          <div className={classes.profileData}>
            <span>{capitalizeFirstLetter(user?.username)}</span>
            <span className={classes.shortBio}>
              {user?.bio ? user.bio : "Live is full of adventures"}
            </span>
          </div>
        </div>
        {suggestedUsers?.length > 0 ? (
          <div className={classes.suggestedUsers}>
            <h3 className={classes.title}>Recommended users to follow</h3>
            {suggestedUsers?.map((suggestedUser) => (
              <div className={classes.suggestedUser} key={suggestedUser._id}>
                <Link to={`/profileDetail/${suggestedUser?._id}`}>
                  <img
                    src={suggestedUser?.photo ? suggestedUser.photo : man}
                    className={classes.imgUser}
                  />
                </Link>
                <div className={classes.suggestedUserData}>
                  <span>{capitalizeFirstLetter(suggestedUser.username)}</span>
                  <span className={classes.suggestedMsg}>Suggested to you</span>
                </div>
                <button
                  onClick={() => toggleFollow(suggestedUser?._id)}
                  className={classes.followBtn}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h3 className={classes.title}>You have no suggested users</h3>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
