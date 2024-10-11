import React from "react";

import "./PremiumAd.css";

const PremiumAd = () => {
  return (
    <div className="premium-ad-container">
      <div className="premium-ad-card">
        <h1>Premium is currently in beta!</h1>
        <p>
          Please be patient, as we bring more and more features to the platform.
        </p>
        <button onClick={() => setActiveComponent("analytics")}>
          Okay, Back to Dashboard Please!
        </button>
      </div>
    </div>
  );
};

export default PremiumAd;
