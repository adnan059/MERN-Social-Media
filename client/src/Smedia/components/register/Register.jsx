import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/woman2.jpg";
import { register } from "../../redux/authSlice";
import classes from "./Register.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(username, email, password);
    if (!username || !email || !password) {
      return alert("Please fill out all the fields of the form.");
    }
    try {
      const { data } = await axios.post(
        "https://smedia-q9go.onrender.com/auth/register",
        {
          username,
          email,
          password,
        }
      );
      const { token, ...others } = data;
      dispatch(register({ others, token }));
      navigate("/");
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className={classes.registerContainer}>
      <div className={classes.registerWrapper}>
        <div className={classes.registerLeftSide}>
          <img src={img} className={classes.leftImg} />
        </div>

        <div className={classes.registerRightSide}>
          <h2 className={classes.title}>Register</h2>

          <form className={classes.registerForm} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Type username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              type="email"
              placeholder="Type email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Type password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={classes.submitBtn}>
              Register
            </button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
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

export default Register;
