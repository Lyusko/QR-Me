import React, { useState, useEffect } from "react";
import "../../Components/Homepage.css";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import burgerMenu from "../../assets/menu.svg";
import lightModeIcon from "../../assets/light-mode-switch.svg";
import darkModeIcon from "../../assets/dark-mode-switch.svg";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    
  
   
     <div className="navbar">
        <h1 className="logo">QR-Me</h1>
        
        <div className="navbar-menu">
          <ScrollLink
            activeclass="active"
            to="header"
            spy={true}
            smooth={true}
            offset={-150}
            duration={500}
            className="menuListItem"
          >
            Home
          </ScrollLink>
          <ScrollLink
            activeclass="active"
            to="about"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
            className="menuListItem"
          >
            About
          </ScrollLink>
          <ScrollLink
            activeclass="active"
            to="services"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
            className="menuListItem"
          >
            Services
          </ScrollLink>
          <RouterLink
            activeclass="active"
            to="/register"
            className="menuListItem"
          >
            Get Started
          </RouterLink>
        </div>
        <div className="CTA">
          <RouterLink to="/login">
            <button id="cta">Log In</button>
          </RouterLink>
          <button
            className="switch-button"
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
        </div>
        <img
          src={burgerMenu}
          alt="Menu"
          className="mobMenu"
          onClick={() => setShowMenu(!showMenu)}
        />
        <div className="navMenu" style={{ display: showMenu ? "flex" : "none" }}>
          <ScrollLink
            activeclass="active"
            to="header"
            spy={true}
            smooth={true}
            offset={-150}
            duration={500}
            className="ListItem"
            onClick={() => setShowMenu(false)}
          >
            Home
          </ScrollLink>
          <ScrollLink
            activeclass="active"
            to="about"
            spy={true}
            smooth={true}
            offset={-150}
            duration={500}
            className="ListItem"
            onClick={() => setShowMenu(false)}
          >
            About
          </ScrollLink>
          <ScrollLink
            activeclass="active"
            to="services"
            spy={true}
            smooth={true}
            offset={-150}
            duration={500}
            className="ListItem"
            onClick={() => setShowMenu(false)}
          >
            Services
          </ScrollLink>
          <RouterLink
            activeclass="active"
            to="/register"
            className="ListItem"
            id="cta-ham"
            onClick={() => setShowMenu(false)}
          >
            Get Started
          </RouterLink>
          <RouterLink
            activeclass="active"
            to="/login"
            className="ListItem"
            id="cta-ham"
            onClick={() => setShowMenu(false)}
          >
            Log In
          </RouterLink>
        </div>
      </div>

  
  );
};

export default Navbar;
