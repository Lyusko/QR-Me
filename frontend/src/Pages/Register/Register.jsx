import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Link as RouterLink } from "react-router-dom";
import Hello from "../../assets/hello.svg";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        registerData
      );
      // Registration successful
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000); // Delay to show success message
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data.message || "Error registering user.");
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="left-container-register">
          <img src={Hello} className="hellopic"></img>
          <p>Welcome To</p>
          <h2>QR-Me</h2>
        </div>
        <div className="right-container-1">
          <div className="register-panel">
            <h1 className="register-form">Register</h1>
            <form onSubmit={handleRegisterSubmit}>
              <label htmlFor="mail">E-mail</label>
              <input
                typeof="email"
                id="mail"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              ></input>
              <label htmlFor="user">Username</label>
              <input
                typeof="text"
                id="user"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
              ></input>
              <label htmlFor="pass">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              ></input>
              <div className="error-validation">
                {" "}
                {message && <p>{message}</p>}
              </div>
              <button type="submit">Register</button>
            </form>
            <p>
              Already a member?{" "}
              <RouterLink to="/login" className="cta-register">
                Login
              </RouterLink>{" "}
              Instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
