import React from "react";
import "../../Components/Homepage.css";
import convert from "../../assets/convert.svg";
import analytics from "../../assets/analytics.svg";
import noregImg from "../../assets/noreg.svg";
import opensourceImg from "../../assets/opensource.svg";
const About = () => {
  return (
   
    <div className="container">
      <section id="about">
         <div className="grid-container">
      
            <div className="card">
              <img src={convert}></img>
              <h1>Dynamic QR Codes</h1>
              <p>
                Create and Manage QR Codes without the need to print out new ones
                and waste resources!
              </p>
            </div>
            <div className="card">
              <img src={analytics}></img>
              <h1>Analytics</h1>
              <p>
                Monitor and Manage how many times your QR Codes have been scanned
                & accessed!
              </p>
            </div>
      
      
            <div className="card">
              <img src={noregImg}></img>
              <h1>No Registration Required</h1>
              <p>
                If you only want static QR Code generation, no registration or
                collection of data is required!
              </p>
            </div>
            <div className="card">
              <img src={opensourceImg}></img>
              <h1>100% Open Source</h1>
              <p>
                Developed by a student and it's open source! What's better than
                this?
              </p>
            </div>
      
         </div>
      </section>
    </div>
      
  );
};

export default About;
