// src/Components/Preloader/Preloader.jsx
import React from 'react';
import './Preloader.css';
import Spinner from "../../assets/loader.gif"
const Preloader = () => {
  return (
    <div className="preloader">
      <div className="spinner">
        <img src={Spinner} />
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Preloader;
