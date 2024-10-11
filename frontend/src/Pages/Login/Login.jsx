import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Hello from "../../assets/hello.svg";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import "./Login.css";
import Modal from "../../Components/Modal/ModalSession";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const localIP = import.meta.env.VITE_LOCAL_IP;
  
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };


  useEffect(() => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://${localIP}:8000/login`,
        loginData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
     

      // Decode token to get expiry time
      const decodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds

      // Set a timeout to automatically log out the user when the token expires
      setTimeout(() => {
        setModalMessage("Session Expired. Please Log In again!");
        setIsModalOpen(true);
        //alert("Session Expired. Please Log In again!");
        //localStorage.removeItem("token");
        //navigate("/login", { replace: true });
      }, expiryTime - Date.now());

      // Redirect to dashboard after successful login
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data.message || "Error logging in.");
    }
  };

  const closeModal = () => {
    handleLogout();
    setIsModalOpen(false);
  };

  return (
    
    // <div className="container">
      <div className="login-container">
        <div className="left-container">
          <img src={Hello} className="hellopic"></img>
          <p>Welcome To</p>
          <h2>QR-Me</h2>
        </div>
        <div className="right-container">
          <div className="login-panel">
            <h1 className="title-form">Log In</h1>
            <form onSubmit={handleLoginSubmit}>
              <label htmlFor="user">E-mail</label>
              <input
                type="text"
                id="mail"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              ></input>
              <span></span>
              <label htmlFor="pass">Password</label>
              <input
                type="password"
                id="pass"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              ></input>
              {message && <p>{message}</p>}

              <button type="submit">Log In</button>
            </form>
            <p>
              Don't have an account?{" "}
              <RouterLink to="/register" className="cta-register">
                Register
              </RouterLink>{" "}
              Instead.
            </p>
          </div>
        </div>
      {/* </div> */}
      <Modal
          isOpen={isModalOpen}
          closeModal={() => closeModal(false)}
          message={modalMessage}
        />
    </div>
  );
};

export default Login;
