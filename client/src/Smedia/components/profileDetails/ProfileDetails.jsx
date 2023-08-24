import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import man from "../../assets/man.jpg";
import { handleFollow } from "../../redux/authSlice";
import PostPhoto from "./../postPhoto/PostPhoto";
import classes from "./ProfileDetails.module.css";

const ProfileDetails = () => {
  const [profile, setProfile] = useState({});
  const [profilePosts, setProfilePosts] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [isFollowed, setIsFollowed] = useState(false);
  const [show, setShow] = useState("mypost");
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/users/find/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(data);

        // console.log(data?._id);

        if (user?._id !== data?._id) {
          console.log(user);
          setIsFollowed(user?.followings?.includes(data?._id));
        }
        //  console.log(isFollowed);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/posts/userposts/${id}`
        );

        setProfilePosts(data);
      } catch (error) {
        alert(error.reponse.data.message);
      }
    };
    fetchProfilePosts();
  }, [id]);

  const handleFollowFunction = async () => {
    try {
      const { data } = await axios(
        `https://smedia-q9go.onrender.com/users/togglefollow/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, method: "PUT" }
      );
      console.log(data);
      dispatch(handleFollow(id));

      setProfile((prev) => {
        return {
          ...prev,
          followers: isFollowed
            ? [...prev.followers].filter((uid) => uid !== user?._id)
            : [...prev.followers, user?._id],
        };
      });

      setIsFollowed((prev) => !prev);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //console.log(profilePosts);
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.topLeftSide}>
            <img
              src={
                profile?.profileImg
                  ? `https://smedia-q9go.onrender.com/files/${profile?.profileImg}`
                  : man
              }
              className={classes.profileImg}
            />
          </div>
          <div className={classes.topRightSide}>
            <h4>{profile?.username}</h4>
            <h4>
              Bio: {profile?.bio ? profile.bio : "Life is full of adventures"}
            </h4>
          </div>
          {profile?._id !== user._id && (
            <button
              onClick={handleFollowFunction}
              className={classes.followBtn}
            >
              {isFollowed ? "unfollow" : "follow"}
            </button>
          )}
        </div>
        <div className={classes.center}>
          <div className={classes.followings}>
            Followings: {profile?.followings?.length}
          </div>
          <div className={classes.followers}>
            Followers: {profile?.followers?.length}
          </div>
        </div>
        {user._id === profile?._id && (
          <div className={classes.postsOrBookmarked}>
            <button
              onClick={() => setShow("mypost")}
              className={`${show === "mypost" && classes.active}`}
            >
              My posts
            </button>
            <button
              onClick={() => setShow("bookmarked")}
              className={`${show === "bookmarked" && classes.active}`}
            >
              Bookmarked
            </button>
          </div>
        )}
        {show === "mypost" && profilePosts?.length > 0 ? (
          <div className={classes.bottom}>
            {profilePosts?.map((post) => {
              return <PostPhoto post={post} key={post._id} />;
            })}
          </div>
        ) : show === "mypost" ? (
          <h2>Profile has no posts</h2>
        ) : (
          ""
        )}
        {show === "bookmarked" && profilePosts?.length > 0 ? (
          <div className={classes.bottom}>
            {user?.bookmarkedPosts?.map((post) => {
              console.log(user);
              // console.log(post);
              return <PostPhoto post={post} key={post._id} />;
            })}
          </div>
        ) : show === "bookmarked" ? (
          <h2>You have no bookmarked posts</h2>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
