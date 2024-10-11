import React from "react";
import "./Topbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import lightModeIcon from "../../../assets/light-mode-switch.svg";
import darkModeIcon from "../../../assets/dark-mode-switch.svg";

const Topbar = () => {
  const [username, setUsername] = useState("Guest");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username); // Extract the username from the token
    }
  document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  

  return (
    <header className="header"><h1>Dashboard</h1>
     <button
          className="switch-button-topbar"
          onClick={toggleTheme}
          style={{ border: "none", background: "none" }}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <img
            className="toggle-switch"
            src={theme === "light" ? darkModeIcon : lightModeIcon}
            alt={`${theme === "light" ? "Dark" : "Light"} mode icon`}
            style={{ width: "24px", height: "24px" }}
          />
        </button>
    </header>
  );
};

export default Topbar;
