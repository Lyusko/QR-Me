import React, { useState, useEffect, useRef} from "react";
import "./QRCodes.css";
import Topbar from "../Topbar/Topbar";
import QRCode from "react-qr-code";
import axios from "axios";
import NoCode from "../../../assets/no-code.svg";
import Modal from "../../Modal/Modal";


const QRCodes = () => {


  const [staticQRCodes, setStaticQRCodes] = useState([]);
  const [dynamicQRCodes, setDynamicQRCodes] = useState([]);
  const [url, setUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [editingStatic, setEditingStatic] = useState(null);
  const [editingDynamic, setEditingDynamic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State for static carousel index
  const [currentDynamicIndex, setCurrentDynamicIndex] = useState(0); // State for dynamic carousel index

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const localIP = import.meta.env.VITE_LOCAL_IP;

  // Helper function to get JWT token
  const getToken = () => localStorage.getItem("token");





  useEffect(() => {
    const fetchStaticQRCodes = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          "http://localhost:8000/api/static-qrcodes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStaticQRCodes(response.data);
        setCurrentIndex(0); // Reset index on data fetch
      } catch (error) {
        console.error("Error fetching static QR codes:", error);
      }
    };

    const fetchDynamicQRCodes = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `http://${localIP}:8000/api/dynamic-qrcodes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDynamicQRCodes(response.data);
        setCurrentDynamicIndex(0); // Reset dynamic index on data fetch
      } catch (error) {
        console.error("Error fetching dynamic QR codes:", error);
      }
    };

    fetchStaticQRCodes();
    fetchDynamicQRCodes();
  }, [localIP]);

  const handleAddStaticQRCode = async () => {
    if (!url.trim()) {
     setModalMessage('Please enter a valid URL for the static QR code.');
      setIsModalOpen(true);
      return;
    }

    try {
      const token = getToken();
      const response = await axios.post(
        "http://localhost:8000/api/static-qrcodes",
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStaticQRCodes([...staticQRCodes, response.data]);
      setUrl("");
      setCurrentIndex(staticQRCodes.length);
    } catch (error) {
      console.error("Error adding static QR code:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddDynamicQRCode = async () => {
    if (!redirectUrl.trim()) {
      setModalMessage('Please enter a valid URL for the Dynamic QR code.');
      setIsModalOpen(true);
      return;
    }

    try {
      const token = getToken();
      const formattedUrl = formatUrl(redirectUrl);
      const response = await axios.post(
        `http://${localIP}:8000/api/dynamic-qrcodes`,
        { redirect_url: formattedUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDynamicQRCodes([...dynamicQRCodes, response.data]);
      setRedirectUrl("");
      setCurrentDynamicIndex(dynamicQRCodes.length);
    } catch (error) {
      console.error("Error adding dynamic QR code:", error);
    }
  };

  const handleUpdateStaticQRCode = async () => {
    if (!url.trim()) {
      alert("Please enter a valid URL to update the static QR code.");
      return;
    }

    if (editingStatic) {
      try {
        const token = getToken();
        const updatedQRCode = { ...editingStatic, url };
        const response = await axios.put(
          `http://localhost:8000/api/static-qrcodes/${editingStatic.id}`,
          { url },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedIndex = staticQRCodes.findIndex(
          (qr) => qr.id === editingStatic.id
        );

        const updatedStaticQRCodes = staticQRCodes.map((qr) =>
          qr.id === editingStatic.id ? response.data : qr
        );
        setStaticQRCodes(updatedStaticQRCodes);
        setEditingStatic(null);
        setUrl("");
        setCurrentIndex(updatedIndex);
      } catch (error) {
        console.error("Error updating static QR code:", error);
      }
    }
  };

  const handleUpdateDynamicQRCode = async () => {
    if (!redirectUrl.trim()) {
      alert("Please enter a valid URL to update the dynamic QR code.");
      return;
    }

    if (editingDynamic) {
      try {
        const token = getToken();
        const response = await axios.put(
          `http://${localIP}:8000/api/dynamic-qrcodes/${editingDynamic.id}`,
          { redirect_url: redirectUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedIndex = dynamicQRCodes.findIndex(
          (qr) => qr.id === editingDynamic.id
        );

        const updatedDynamicQRCodes = dynamicQRCodes.map((qr) =>
          qr.id === editingDynamic.id ? response.data : qr
        );
        setDynamicQRCodes(updatedDynamicQRCodes);
        setEditingDynamic(null);
        setRedirectUrl("");
        setCurrentDynamicIndex(updatedIndex);
      } catch (error) {
        console.error("Error updating dynamic QR code:", error);
      }
    }
  };

  const handleDeleteStaticQRCode = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:8000/api/static-qrcodes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaticQRCodes(staticQRCodes.filter((qr) => qr.id !== id));
      if (currentIndex >= staticQRCodes.length - 1) {
        setCurrentIndex(0); // Reset to first QR code if last QR code is deleted
      }
    } catch (error) {
      console.error("Error deleting static QR code:", error);
    }
  };

  const handleDeleteDynamicQRCode = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`http://${localIP}:8000/api/dynamic-qrcodes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDynamicQRCodes(dynamicQRCodes.filter((qr) => qr.id !== id));
      if (currentDynamicIndex >= dynamicQRCodes.length - 1) {
        setCurrentDynamicIndex(0); // Reset to first QR code if last QR code is deleted
      }
    } catch (error) {
      console.error("Error deleting dynamic QR code:", error);
    }
  };

  const handleEditStatic = (qr) => {
    setEditingStatic(qr);
    setUrl(qr.url);
  };

  const handleEditDynamic = (qr) => {
    setEditingDynamic(qr);
    setRedirectUrl(qr.redirect_url);
  };

  const formatUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  // Navigation functions for static QR codes
  const goToNext = () => {
    if (staticQRCodes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % staticQRCodes.length);
    }
  };

  const goToPrevious = () => {
    if (staticQRCodes.length > 0) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + staticQRCodes.length) % staticQRCodes.length
      );
    }
  };

  // Navigation functions for dynamic QR codes
  const goToNextDynamic = () => {
    if (dynamicQRCodes.length > 0) {
      setCurrentDynamicIndex(
        (prevIndex) => (prevIndex + 1) % dynamicQRCodes.length
      );
    }
  };

  const goToPreviousDynamic = () => {
    if (dynamicQRCodes.length > 0) {
      setCurrentDynamicIndex(
        (prevIndex) =>
          (prevIndex - 1 + dynamicQRCodes.length) % dynamicQRCodes.length
      );
    }
  };

  const totalPages = staticQRCodes.length;
  const currentPage = totalPages > 0 ? currentIndex + 1 : 0; // +1 for readable format

  const totalDynamicPages = dynamicQRCodes.length;
  const currentDynamicPage =
    totalDynamicPages > 0 ? currentDynamicIndex + 1 : 0;

  return (
    <>
      <Topbar />
      <div className="main-qr">
        
            <div className="card-qr">
              <h2>Static QR Codes</h2>
              <div className="input-box">
                <input
                  maxLength={2048}
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL for static QR code"
                />
                <button
                  onClick={
                    editingStatic
                      ? handleUpdateStaticQRCode
                      : handleAddStaticQRCode
                  }
                >
                  {editingStatic ? "Update" : "Generate"}
                </button>
              </div>

              {staticQRCodes.length > 0 && staticQRCodes[currentIndex] ? ( // Check if currentIndex is within bounds
                <div className="carousel-container">
                  
                  <div className="carousel-content">
                    <QRCode id="QRCode"
                      value={staticQRCodes[currentIndex].url}
                     
                    />
                    <p>{staticQRCodes[currentIndex].url}</p>
                    <div className="edit-delete">
                      <button
                        onClick={() =>
                          handleEditStatic(staticQRCodes[currentIndex])
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteStaticQRCode(
                            staticQRCodes[currentIndex].id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>

                    <div className="pages-navigate">
                    {staticQRCodes.length > 1 && (
                    <button
                      className="carousel-button-prev"
                      onClick={goToPrevious}
                    >
                      &#9664;
                    </button>
                  )}
                    {staticQRCodes.length > 1 && (
                      <div className="page-counter">
                        {currentPage}/{totalPages}
                      </div>
                    )}
                    {staticQRCodes.length > 1 && (
                    <button className="carousel-button-next" onClick={goToNext}>
                      &#9654;
                    </button>
                  )}
                  </div>
                  </div>
                  
                </div>
              ) : (
                <div className="no-codes-container">
                  <img
                    className="no-code"
                    src={NoCode}
                    alt="No Codes Available"
                  />
                  <p className="p-static">No Static QR Codes</p>
                </div>
              )}
            </div>

            <div className="card-qr">
              <h2>Dynamic QR Codes</h2>
              <div className="input-box">
                <input
                  maxLength={2048}
                  type="text"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="Enter URL for dynamic QR code"
                />
                <button
                  onClick={
                    editingDynamic
                      ? handleUpdateDynamicQRCode
                      : handleAddDynamicQRCode
                  }
                >
                  {editingDynamic ? "Update" : "Generate"}
                </button>
              </div>

              {dynamicQRCodes.length > 0 &&
              dynamicQRCodes[currentDynamicIndex] ? (
                <div className="carousel-container">
                  
                  <div className="carousel-content">
                    <QRCode id="QRCode"
                      
                      value={`http://${localIP}:8000/qr/${dynamicQRCodes[currentDynamicIndex].id}`}
                    />
                    <p>{dynamicQRCodes[currentDynamicIndex].redirect_url}</p>
                    <div className="edit-delete">
                      <button
                        onClick={() =>
                          handleEditDynamic(dynamicQRCodes[currentDynamicIndex])
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDynamicQRCode(
                            dynamicQRCodes[currentDynamicIndex].id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>

                    <div className="pages-navigate">
                    {dynamicQRCodes.length > 1 && (
                    <button
                      className="carousel-button-prev"
                      onClick={goToPreviousDynamic}
                    >
                      &#9664;
                    </button>
                  )}
                    {dynamicQRCodes.length > 1 && (
                      <div className="page-counter">
                        {currentDynamicPage}/{totalDynamicPages}
                      </div>
                    )}
                  
                  {dynamicQRCodes.length > 1 && (
                    <button
                      className="carousel-button-next"
                      onClick={goToNextDynamic}
                    >
                      &#9654;
                    </button>
                  )}
                  </div>
                  </div>
                </div>
              ) : (
                <div className="no-codes-container">
                  <img
                    className="no-code"
                    src={NoCode}
                    alt="No Codes Available"
                  />
                  <p className="p-static">No Dynamic QR Codes</p>
                </div>
              )}
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} message={modalMessage} />
          </div>
    </>
  );
};

export default QRCodes;
