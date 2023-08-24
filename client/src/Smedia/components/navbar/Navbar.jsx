import React from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import man from "../../assets/man.jpg";
import { logout, updateUser } from "../../redux/authSlice";
import classes from "./navbar.module.css";

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // mobile
  const [showMobileNav, setShowMobileNav] = useState(false);

  // fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await axios.get(
          `https://smedia-q9go.onrender.com/users/find/getallusers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAllUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllUsers();
  }, []);

  // console.log(allUsers);
  useEffect(() => {
    if (searchText) {
      const re = new RegExp(searchText, "i");
      setFilteredUsers(allUsers?.filter((user) => user.username.match(re)));
    } else {
      setFilteredUsers(allUsers);
    }
  }, [searchText]);

  const handleState = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowModal(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let filename = "";
      if (photo) {
        const fd = new FormData();
        filename = crypto.randomUUID() + photo.name;
        fd.append("filename", filename);
        fd.append("image", photo);

        await axios.post("https://smedia-q9go.onrender.com/upload", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const { data } = await axios(
        `https://smedia-q9go.onrender.com/users/update/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
          data: { ...state, profileImg: filename },
        }
      );

      console.log(data);

      setShowForm(false);
      dispatch(updateUser(data));
      location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <Link to="/">Smedia</Link>
        </div>
        <div className={classes.center}>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search user..."
          />
          <i
            className={classes.searchIcon + " fa-solid fa-magnifying-glass"}
          ></i>
          {searchText && (
            <div
              onClick={() => setSearchText("")}
              className={classes.allUsersContainer}
            >
              {filteredUsers?.map((user) => (
                <Link to={`/profileDetails/${user._id}`} key={user._id}>
                  <img src={man} />
                  <div className={classes.userData}>
                    <span>{user?.username}</span>
                    <span>{user?.bio?.slice(0, 10)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className={classes.right}>
          <Link
            to="/createpost"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Upload
          </Link>
          <div className={classes.icons}>
            <i className="fa-regular fa-user"></i>
            <i
              className="fa-solid fa-arrow-right-from-bracket"
              onClick={handleLogout}
            ></i>
          </div>
          <img
            src={
              user?.profileImg
                ? `https://smedia-q9go.onrender.com/files/${user?.profileImg}`
                : man
            }
            className={classes.profileUserImg}
            onClick={() => setShowModal((prev) => !prev)}
          />
          {showModal && (
            <div className={classes.modal}>
              <span onClick={handleShowForm}>Update Profile</span>
            </div>
          )}
        </div>
        {showForm && (
          <div
            className={classes.updateProfileForm}
            onClick={() => setShowForm(false)}
          >
            <div
              className={classes.updateProfileWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleState}
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleState}
                />
                <input
                  type="text"
                  placeholder="Bio"
                  name="bio"
                  onChange={handleState}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleState}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "50%",
                  }}
                >
                  <label htmlFor="photo">
                    Profile Picture <i className="fa-solid fa-upload"></i>
                  </label>
                  <input
                    type="file"
                    id="photo"
                    placeholder="Profile picture"
                    style={{ display: "none" }}
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                  {photo && <p>{photo.name}</p>}
                </div>
                <button>Update profile</button>
              </form>

              <i
                onClick={() => setShowForm(false)}
                className={classes.removeIcon + " fa-solid fa-xmark"}
              ></i>
            </div>
          </div>
        )}
      </div>
      {
        <div className={classes.mobileNav}>
          {showMobileNav && (
            <div className={classes.navigation}>
              <div
                className={classes.left}
                onClick={() => setShowMobileNav(false)}
              >
                <Link to="/">Smedia</Link>
              </div>

              <i
                onClick={() => setShowMobileNav(false)}
                className={classes.mobileCloseIcon + " fa-solid fa-xmark"}
              ></i>

              <div className={classes.center}>
                <input
                  value={searchText}
                  type="text"
                  placeholder="Search user..."
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <i
                  className={
                    classes.searchIcon + " fa-solid fa-magnifying-glass"
                  }
                ></i>
                {searchText && (
                  <div
                    onClick={() => setSearchText("")}
                    className={classes.allUsersContainer}
                  >
                    {filteredUsers?.map((user) => (
                      <Link
                        to={`/profileDetails/${user?._id}`}
                        key={user?._id}
                        onClick={() => setShowMobileNav(false)}
                      >
                        <img src={man} />
                        <div className={classes.userData}>
                          <span>{user?.username}</span>
                          <span>{user?.bio?.slice(0, 10)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className={classes.right}>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/upload"
                  onClick={() => setShowMobileNav(false)}
                >
                  Upload
                </Link>
                <div
                  className={classes.icons}
                  onClick={() => setShowMobileNav(false)}
                >
                  <i
                    className="fa-regular fa-user"
                    onClick={() => navigate(`/profileDetails/${user._id}`)}
                  ></i>

                  <i
                    className="fa-solid fa-arrow-right-from-bracket"
                    onClick={handleLogout}
                  ></i>
                </div>
                <img
                  onClick={() => setShowModal(!showModal)}
                  src={
                    user?.profileImg
                      ? `https://smedia-q9go.onrender.com/files/${user?.profileImg}`
                      : man
                  }
                  className={classes.profileUserImg}
                />
                {showModal && (
                  <div className={classes.modal}>
                    <span onClick={handleShowForm}>Update Profile</span>
                  </div>
                )}
              </div>
              {showForm && (
                <div
                  className={classes.updateProfileForm}
                  onClick={() => setShowForm(false)}
                >
                  <div
                    className={classes.updateProfileWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Update Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                      <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleState}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleState}
                      />
                      <input
                        type="text"
                        placeholder="Bio"
                        name="bio"
                        onChange={handleState}
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleState}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          width: "50%",
                        }}
                      >
                        <label htmlFor="photo">
                          Profile Picture <i className="fa-solid fa-upload"></i>
                        </label>
                        <input
                          type="file"
                          id="photo"
                          placeholder="Profile picture"
                          style={{ display: "none" }}
                          onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        {photo && <p>{photo.name}</p>}
                      </div>
                      <button>Update profile</button>
                    </form>

                    <i
                      onClick={() => setShowForm(false)}
                      className={classes.removeIcon + " fa-solid fa-xmark"}
                    ></i>
                  </div>
                </div>
              )}
            </div>
          )}
          {!showMobileNav && (
            <i
              onClick={() => setShowMobileNav((prev) => !prev)}
              className={classes.hamburgerIcon + " fa-solid fa-bars"}
            ></i>
          )}
        </div>
      }
    </div>
  );
};

export default Navbar;
