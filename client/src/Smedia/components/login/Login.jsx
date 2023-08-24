import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/woman.jpg";
import { login } from "../../redux/authSlice";
import classes from "./Login.module.css";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please fill out all the fields of the form.");
    }
    try {
      const { data } = await axios.post(
        "https://smedia-q9go.onrender.com/auth/login",
        {
          email,
          password,
        }
      );
      const { token, ...others } = data;
      dispatch(login({ token, others }));
      navigate("/");
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };
  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginWrapper}>
        <div className={classes.loginLeftSide}>
          <img src={img} className={classes.leftImg} />
        </div>
        <div className={classes.loginRightSide}>
          <h2 className={classes.title}>Login</h2>
          <form onSubmit={handleLogin} className={classes.loginForm}>
            <input
              type="email"
              placeholder="Type email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Type password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button className={classes.submitBtn}>Login</button>
            <p>
              Dont have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
          {error && (
            <div className={classes.errorMessage}>
              Wrong credentials! Try different ones
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
