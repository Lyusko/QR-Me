import React from "react";
import "./Sidebar.css";
import { useEffect, useState } from "react";


import { Link } from "react-router-dom";
import gauge from "../../../assets/gauge-solid.svg";
import qrcode from "../../../assets/qrcode-solid.svg"
import chart from "../../../assets/chart-simple-solid.svg"
import link from "../../../assets/link-solid.svg"
import logoutimg from "../../../assets/logout.svg"
import { jwtDecode } from "jwt-decode";
const Sidebar = ({ setActiveComponent }) => {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username); // Extract the username from the token
    }
  }, []);

  return (
    <section className="sidebar">
    <div className="top-sidebar">
        <div className="logo">
          <h1>QR-Me</h1>
        </div>
        <div className="user-info">
            <h2>Hi, {username}</h2>
        </div>
    </div>
    <div className="middle-sidebar">
        <div className="links">
          <ul>
             <li>
     <img className="dashboard-icon" onClick={() => setActiveComponent("home")} src={gauge}></img> <button className="menu-links" onClick={() => setActiveComponent("home")}>Dashboard</button>
    </li>
    <li>
    <img className="dashboard-icon"  onClick={() => setActiveComponent("qrCodes")} src={qrcode}></img><button className="menu-links" onClick={() => setActiveComponent("qrCodes")}>QR Codes</button>
    </li>
    <li>
    <img className="dashboard-icon" onClick={() => setActiveComponent("analytics")} src={chart}></img> <button  className="menu-links" onClick={() => setActiveComponent("analytics")}>Analytics</button>
    </li>
    <li>
    <img className="dashboard-icon" onClick={() => setActiveComponent("urlshort")} src={link}></img> <button className="menu-links" onClick={() => setActiveComponent("urlshort")}>URL Shortener</button>
    </li>
          </ul>
        </div>
    </div>
    <div className="bottom-sidebar">
        
        <div className="logout-button">
        
        <Link className="logout-button" to="/logout">
        <img src={logoutimg} />
          <p>Log out</p>
          
        </Link>
       
        </div>
      </div>
</section>
  );
};

export default Sidebar;
