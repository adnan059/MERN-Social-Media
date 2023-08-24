import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import man from "../../assets/man.jpg";
import { capitalizeFirstLetter } from "./../../utils/utils";
import classes from "./RightSide.module.css";

const RightSide = () => {
  const { token, user } = useSelector((store) => store.auth);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await axios.get(
          "https://smedia-q9go.onrender.com/users/find/friends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFriends(data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchFriends();
  }, [user?.followings, token]);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {friends?.length > 0 ? (
          friends?.map((friend) => (
            <Link
              className={classes.user}
              to={`/profileDetails/${friend._id}`}
              key={friend._id}
            >
              <img
                src={
                  friend?.profileImg
                    ? `https://smedia-q9go.onrender.com/files/${friend?.profileImg}`
                    : man
                }
                className={classes.profileUserImg}
              />
              <div className={classes.userData}>
                <span>{capitalizeFirstLetter(friend.username)}</span>
              </div>
            </Link>
          ))
        ) : (
          <span>You currently have no friends. Follow someone!</span>
        )}
      </div>
    </div>
  );
};

export default RightSide;
