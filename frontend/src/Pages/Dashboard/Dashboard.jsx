import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "../../Components/DashboardElements/SideBar/Sidebar";
import DashboardHome from "../../Components/DashboardElements/DashboardHome/DashboardHome";
import QRCodes from "../../Components/DashboardElements/QRCodes/QRCodes";
import { jwtDecode } from "jwt-decode";
import Analytics from "../../Components/DashboardElements/Analytics/Analytics";
import UrlShortener from "../../Components/DashboardElements/UrlShortener/UrlShortener";
import PremiumAd from "../../Components/DashboardElements/PremiumAd/PremiumAd";
import Topbar from "../../Components/DashboardElements/Topbar/Topbar";
import Modal from "../../Components/Modal/ModalSession";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home"); // Step 1: State for active component
  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {

    
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token is expired
          //localStorage.removeItem("token"); 
         

          setModalMessage("Session Expired. Please Log In again!");
        setIsModalOpen(true);
        // alert("Session Expired. Please Log In again!");
        // navigate("/login", { replace: true });
        }
      } else {
        // No token found, redirect to login
        navigate("/login", { replace: true });
      }
    };

    // Check token on component mount
    checkTokenExpiration();

    // Check token every minute (60000 milliseconds)
    const intervalId = setInterval(checkTokenExpiration, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <DashboardHome />;
      case "qrCodes":
        return <QRCodes />;
      case "analytics":
        return <Analytics />;
      case "urlshort":
        return <UrlShortener />;
      case "premium-ad":
        return <PremiumAd />;
      default:
        return <DashboardHome />;
    }
  };
  

  const closeModal = () => {
    handleLogout();
    setIsModalOpen(false);
  };

  return (
    <>

    <div className="dashboard-container">
    
      <Topbar/>
      <Sidebar setActiveComponent={setActiveComponent} />
      <Modal
          isOpen={isModalOpen}
          closeModal={() => closeModal(false)}
          message={modalMessage}
        />
      {renderComponent()}
    </div>
    </>
  );
};

export default Dashboard;
