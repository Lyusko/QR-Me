import React, { useEffect, useState } from "react";

import "./Analytics.css";
import Topbar from "../Topbar/Topbar";

import axios from 'axios';

const Analytics = () => {


  
  return (
    <>
      <Topbar />
      <div className="main-analytics">
        <div className="card-dash">
          <div className="message-text">
          <h1>This feature is currently being developed!</h1>
          <p id="message-p">Please be patient while we roll out new and exciting features</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
