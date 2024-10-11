import React from "react";
import { useState, useEffect } from "react";
import "./DashboardHome.css";
import axios from "axios";
import upgradeImg from "../../../assets/upgrade.svg"
const DashboardHome = () => {
  const [staticCount, setStaticCount] = useState(0);
  const [dynamicCount, setDynamicCount] = useState(0);
  const [shortenedCount, setShortenedCount] = useState(0);
  

  const localIP = import.meta.env.VITE_LOCAL_IP; 

  useEffect(() => {
    const fetchQRCodeCounts = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch static QR code count
        const staticResponse = await axios.get(
          `http://${localIP}:8000/api/static-qrcodes/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStaticCount(staticResponse.data.count);

        // Fetch dynamic QR code count
        const dynamicResponse = await axios.get(
          `http://${localIP}:8000/api/dynamic-qrcodes/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDynamicCount(dynamicResponse.data.count);

        // Fetch shortened URL count
        const shortenedResponse = await axios.get(
          `http://${localIP}:8000/api/shortened-urls/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShortenedCount(shortenedResponse.data.count);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchQRCodeCounts();
  }, [localIP]);

  return (
   
    
    <main className="main">
    <div className="card-dash">
        <h1>Static QR Codes</h1>
        <p>{staticCount}</p>
    </div>
    <div className="card-dash">
        <h1>Dynamic QR Codes</h1>
        <p>{dynamicCount}</p>
    </div>
    <div className="card-dash">
        <h1>Total QR Codes</h1>
        <p>{staticCount + dynamicCount}</p>
    </div>
    <div className="card-dash">
        <h1>Subscription Plan</h1>
        <p>Your current plan is the <span>Free</span> Plan</p>
        <h2 id="subscribe-text">Subscribe to be able to manage more codes and have access to more features!</h2>
    </div>
    <div className="card-dash">
        <h1>Total URLs</h1>
        <p>{shortenedCount}</p>
    </div>
    <div className="card-dash">
        <div className="subscribe-modal">
        <div className="modal-content">
          <img src={upgradeImg} alt="subscribe" />
          <p>Explore our premium features!</p>
          <button>Subscribe</button>
        </div></div>

        </div>
</main>
    
  );
};

export default DashboardHome;
